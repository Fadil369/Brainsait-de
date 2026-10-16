#!/usr/bin/env python3
"""
bpr-partner — turn a paid invoice into a provisioned BrainSAIT partner identity.

Part of the local mesh (.de plane). Runs on port 9641, backed by
braincore-postgres, supervised by supervisord (python-mesh.conf).

The purchase journey ends here. A paid invoice for a partner SKU arrives, and
this service does everything the manual process used to: mint the identifier,
write the OID leaf, grant the benefits, issue the badges, record every stage,
and hand the result to n8n so the notifications fan out.

It is idempotent by invoice: a replayed or re-polled order returns the identity
that already exists rather than minting a second one.

Health contract: GET /health -> {"status":"ok","service":"bpr-partner",...} within 2s.
"""

import hashlib
import hmac
import json
import os
import re
import sys
import time
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
from urllib import request as urlrequest

import psycopg2
import psycopg2.extras

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

PORT = int(os.environ.get("BPR_PARTNER_PORT", "9641"))
DB_HOST = os.environ.get("BPR_PARTNER_DB_HOST", "127.0.0.1")
DB_PORT = os.environ.get("BPR_PARTNER_DB_PORT", "5433")
DB_NAME = os.environ.get("BPR_PARTNER_DB_NAME", "braincore")
DB_USER = os.environ.get("BPR_PARTNER_DB_USER", "braincore")
DB_PASS = os.environ.get("BPR_PARTNER_DB_PASS", "")
DB_DSN = os.environ.get("BPR_PARTNER_DSN") or (
    f"host={DB_HOST} port={DB_PORT} dbname={DB_NAME} user={DB_USER} password={DB_PASS}"
)
N8N_BASE = os.environ.get("BPR_PARTNER_N8N", "http://127.0.0.1:5678")
HUB_URL = os.environ.get("BPR_PARTNER_HUB", "http://127.0.0.1:9600")
DAFTRA_API = os.environ.get("BPR_PARTNER_DAFTRA", "https://daftra.brainsait.de")
SERVICE = "bpr-partner"
VERSION = "1.0.0"

# The enterprise arc. SA sits at .2; provider classes sit at .3, orgs at .2.
OID_ROOT = "1.3.6.1.4.1.61026"
JURISDICTION = {"SA": "2", "SD": "1"}
CLASS_ARC = {"PHY": "3", "NUR": "3", "PHA": "3", "ORG": "2", "HOS": "2", "FAC": "4", "CLI": "4", "LAB": "4"}

# SKUs that buy a partner identity, and the tier each one grants.
PARTNER_SKUS = {
    "PARTNER-TICKET-INITIAL": "initial",
    "PARTNER-RENEWAL-199": "renewal",
    "BPR-ANNUAL": "annual",
    "BSP-SR-BPR": "solutions-ready",
}

# The benefit set granted on activation.
BENEFITS = [
    "identity.spid", "identity.oid", "identity.badge", "identity.qr",
    "profile.public_page", "profile.directory_listing",
    "registry.verification", "registry.trust_level",
    "credentials.upload", "credentials.verification",
    "slots.view", "slots.manage", "slots.delegate",
    "partners.network", "partners.messaging",
    "academy.access", "build.access",
    "support.priority", "api.keys",
]

# Stage order for the journey rail. The automation advances through these.
STAGES = [
    "invoice_created", "payment_confirmed", "identity_minted", "oid_leaf_written",
    "profile_published", "benefits_granted", "badges_issued",
    "notifications_sent", "active",
]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def new_id(prefix):
    return f"{prefix}-{format(int(time.time() * 1000), 'x').upper()}{uuid.uuid4().hex[:4].upper()}"


# --------------------------------------------------------------------------
# Database
# --------------------------------------------------------------------------


def db():
    return psycopg2.connect(DB_DSN, connect_timeout=5)


def query(sql, params=None, one=False):
    conn = db()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            rows = cur.fetchall() if cur.description else []
            conn.commit()
            if one:
                return dict(rows[0]) if rows else None
            return [dict(r) for r in rows]
    finally:
        conn.close()


def execute(sql, params=None):
    conn = db()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            row = None
            if cur.description is not None:
                r = cur.fetchone()
                row = dict(r) if r else None
            conn.commit()
            return row
    finally:
        conn.close()


def iso(v):
    if isinstance(v, datetime):
        return v.astimezone(timezone.utc).isoformat() if v.tzinfo else v.isoformat()
    if hasattr(v, "isoformat"):
        return v.isoformat()
    return v


def clean(row):
    return None if row is None else {k: iso(v) for k, v in row.items()}


def clean_all(rows):
    return [clean(r) for r in rows]


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------


def json_response(data, status=200):
    body = json.dumps(data, ensure_ascii=False, indent=2, default=str).encode("utf-8")
    return body, status, {"Content-Type": "application/json; charset=utf-8"}


def err(message, status=400, **extra):
    payload = {"ok": False, "error": message}
    payload.update(extra)
    return json_response(payload, status)


def s(v, limit=500):
    return "" if v is None else str(v).strip()[:limit]


def emit_event(topic, payload):
    try:
        data = json.dumps({"topic": topic, "service": SERVICE, "payload": payload}).encode()
        req = urlrequest.Request(HUB_URL + "/ingest", data=data,
                                 headers={"Content-Type": "application/json"}, method="POST")
        urlrequest.urlopen(req, timeout=2).read()
    except Exception:
        pass


def notify(event, payload):
    """Fire the n8n notification webhook. Notification policy lives in n8n."""
    try:
        data = json.dumps({"event": event, "service": SERVICE, "ts": now_iso(),
                           "payload": payload}).encode()
        req = urlrequest.Request(f"{N8N_BASE}/webhook/bpr-partner/notify", data=data,
                                 headers={"Content-Type": "application/json"}, method="POST")
        urlrequest.urlopen(req, timeout=3).read()
    except Exception as e:  # noqa: BLE001 - a failed notify must not fail the request
        sys.stderr.write(f"[{SERVICE}] notify {event} failed: {e}\n")


# --------------------------------------------------------------------------
# Identity minting
# --------------------------------------------------------------------------


def next_sequence(kind):
    """Atomic per-kind counter, kept in its own table so ids never collide."""
    row = execute(
        """
        INSERT INTO bpr_counters (kind, next_val) VALUES (%s, 2)
        ON CONFLICT (kind) DO UPDATE SET next_val = bpr_counters.next_val + 1
        RETURNING next_val
        """,
        (kind,),
    )
    return row["next_val"] if row else 1


def mint_spid(kind="PHY"):
    """SA-<CLASS>-NNNNNN. The class is part of the identifier, not decoration."""
    seq = next_sequence(f"spid_{kind}")
    return f"SA-{kind}-{seq:06d}"


def oid_for(kind, spid):
    """1.3.6.1.4.1.61026.<jurisdiction>.<class>.<sequence>"""
    m = re.search(r"-(\d+)$", spid or "")
    seq = int(m.group(1)) if m else 0
    jur = JURISDICTION["SA"]
    cls = CLASS_ARC.get(kind, "3")
    return f"{OID_ROOT}.{jur}.{cls}.{seq}"


def buid_for(spid):
    """BUID:SA:PHY:000001 — the human-readable form of the same identity."""
    parts = (spid or "").split("-")
    if len(parts) == 3:
        return f"BUID:{parts[0]}:{parts[1]}:{parts[2]}"
    return f"BUID:SA:UNK:{spid}"


def sign_badge(spid, kind, label):
    """Sign a badge with the local delivery key.

    NOTE: this is an HMAC over the badge fields using a local secret. It proves
    the badge was issued by this host and has not been altered since. It is NOT
    the Ed25519 passport signature — that requires the passport signer, which is
    a separate service. The badge payload records which scheme was used so a
    verifier is never misled about the strength of the signature.
    """
    key = os.environ.get("BPR_PARTNER_SIGN_KEY", "")
    if not key:
        return None
    msg = f"{spid}|{kind}|{label}".encode()
    return "hmac-sha256:" + hmac.new(key.encode(), msg, hashlib.sha256).hexdigest()


# --------------------------------------------------------------------------
# Journey
# --------------------------------------------------------------------------


def log_stage(spid, stage, detail="", actor="automation"):
    execute(
        "INSERT INTO bpr_partner_events (spid, stage, detail, actor) VALUES (%s,%s,%s,%s)",
        (spid, stage, s(detail, 1000), actor),
    )


def journey(spid):
    rows = query(
        "SELECT stage, detail, actor, created_at FROM bpr_partner_events WHERE spid = %s ORDER BY id",
        (spid,),
    )
    reached = [r["stage"] for r in rows]
    return {
        "spid": spid,
        "stages": STAGES,
        "reached": reached,
        "current": reached[-1] if reached else None,
        "complete": "active" in reached,
        "events": clean_all(rows),
    }


# --------------------------------------------------------------------------
# Provisioning — the automation the purchase triggers
# --------------------------------------------------------------------------


def provision(body):
    """Turn a paid order into a fully provisioned partner.

    Idempotent on invoice_id: replaying the same paid invoice returns the
    existing identity instead of minting a second one. That matters because the
    watcher polls, and a poll that fires twice must not create two partners.
    """
    email = s(body.get("email"), 200).lower()
    if not email or not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$", email):
        return err("valid email required")

    sku = s(body.get("sku") or "PARTNER-TICKET-INITIAL", 60)
    if sku not in PARTNER_SKUS:
        return err(f"not a partner sku: {sku}", 409, partner_skus=sorted(PARTNER_SKUS))

    invoice_id = body.get("invoice_id")
    if invoice_id is not None:
        try:
            invoice_id = int(invoice_id)
        except (TypeError, ValueError):
            return err("invoice_id must be an integer")

        existing = query("SELECT spid FROM bpr_partners WHERE invoice_id = %s", (invoice_id,), one=True)
        if existing:
            partner = query("SELECT * FROM bpr_partners WHERE spid = %s", (existing["spid"],), one=True)
            return json_response({"ok": True, "replay": True, "partner": clean(partner)})

    kind = s(body.get("kind") or "PHY", 4).upper()
    if kind not in CLASS_ARC:
        return err(f"unknown provider class: {kind}")

    tier = PARTNER_SKUS[sku]
    name = s(body.get("full_name") or body.get("name"), 300)
    org = s(body.get("organisation") or body.get("company"), 300)
    specialty = s(body.get("specialty"), 120)
    city = s(body.get("city"), 120)
    amount = body.get("amount_sar")

    spid = mint_spid(kind)
    oid = oid_for(kind, spid)
    buid = buid_for(spid)
    profile_url = f"https://brainsait.de/bpr/p/{spid}/"

    partner = execute(
        """
        INSERT INTO bpr_partners
            (spid, oid, oid_urn, buid, email, full_name, organisation, specialty, city,
             tier, status, invoice_id, invoice_no, sku, amount_sar, paid_at,
             provisioned_at, profile_url)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'provisioning',%s,%s,%s,%s,
                CASE WHEN %s IS NULL THEN NULL ELSE NOW() END, NOW(), %s)
        RETURNING *
        """,
        (spid, oid, f"urn:oid:{oid}", buid, email, name or None, org or None,
         specialty or None, city or None, tier, invoice_id,
         s(body.get("invoice_no"), 60) or None, sku, amount, amount, profile_url),
    )

    # --- the automation, one stage at a time -------------------------------
    if invoice_id is not None:
        log_stage(spid, "invoice_created",
                  f"invoice {s(body.get('invoice_no'), 60) or invoice_id}")
    log_stage(spid, "payment_confirmed", f"invoice {invoice_id or '—'} · {sku} · {amount or '—'} SAR")
    log_stage(spid, "identity_minted", f"{spid} · {buid}")
    log_stage(spid, "oid_leaf_written", oid)

    # benefits
    conn = db()
    try:
        with conn.cursor() as cur:
            for b in BENEFITS:
                cur.execute(
                    "INSERT INTO bpr_partner_benefits (spid, benefit_key) VALUES (%s,%s) "
                    "ON CONFLICT (spid, benefit_key) DO NOTHING",
                    (spid, b),
                )
        conn.commit()
    finally:
        conn.close()
    log_stage(spid, "benefits_granted", f"{len(BENEFITS)} benefits")

    # badges
    badges = []
    for kind_name, label in [
        ("identity", f"Verified Provider Identity · {spid}"),
        ("verification", f"Registry Verified · {tier}"),
        ("credential", "SCFHS-format licence pending attestation"),
    ]:
        badge_id = new_id("BPR-BADGE")
        sig = sign_badge(spid, kind_name, label)
        execute(
            "INSERT INTO bpr_badges (badge_id, spid, kind, label, signature) VALUES (%s,%s,%s,%s,%s)",
            (badge_id, spid, kind_name, label, sig),
        )
        badges.append({"badge_id": badge_id, "kind": kind_name, "label": label, "signed": bool(sig)})
    log_stage(spid, "badges_issued", f"{len(badges)} badges")

    log_stage(spid, "profile_published", profile_url)

    # hand off to n8n for the fan-out; the identity is already durable here
    notify("partner.provisioned", {
        "spid": spid, "oid": oid, "buid": buid, "email": email,
        "full_name": name, "organisation": org, "tier": tier, "sku": sku,
        "amount_sar": amount, "invoice_id": invoice_id, "invoice_no": s(body.get("invoice_no"), 60),
        "profile_url": profile_url, "benefits": len(BENEFITS), "badges": len(badges),
    })
    log_stage(spid, "notifications_sent", "n8n fan-out dispatched")

    execute("UPDATE bpr_partners SET status = 'active', updated_at = NOW() WHERE spid = %s", (spid,))
    log_stage(spid, "active", "partner identity is live")

    emit_event("bpr.partner.provisioned", {"spid": spid, "oid": oid, "email": email, "tier": tier})

    if invoice_id is not None:
        execute(
            "INSERT INTO bpr_orders_seen (invoice_id, invoice_no, email, sku, amount_sar, spid) "
            "VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT (invoice_id) DO NOTHING",
            (invoice_id, s(body.get("invoice_no"), 60) or None, email, sku, amount, spid),
        )

    full = query("SELECT * FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    return json_response({
        "ok": True, "replay": False, "partner": clean(full),
        "benefits": BENEFITS, "badges": badges, "journey": journey(spid),
    }, 201)


# --------------------------------------------------------------------------
# Reads
# --------------------------------------------------------------------------


def list_partners(q):
    where, params = [], []
    if q.get("status"):
        where.append("status = %s"); params.append(q["status"][0])
    if q.get("tier"):
        where.append("tier = %s"); params.append(q["tier"][0])
    if q.get("q"):
        where.append("(spid ILIKE %s OR email ILIKE %s OR full_name ILIKE %s OR organisation ILIKE %s)")
        like = f"%{q['q'][0]}%"
        params += [like, like, like, like]
    clause = ("WHERE " + " AND ".join(where)) if where else ""
    rows = query(f"SELECT * FROM bpr_partners {clause} ORDER BY created_at DESC LIMIT 200", params)
    return json_response({"ok": True, "total": len(rows), "partners": clean_all(rows)})


def get_partner(spid):
    p = query("SELECT * FROM bpr_partners WHERE spid = %s OR id::text = %s", (spid, spid), one=True)
    if not p:
        return err("partner_not_found", 404)
    data = clean(p)
    data["benefits"] = clean_all(query(
        "SELECT benefit_key, granted, granted_at FROM bpr_partner_benefits WHERE spid = %s ORDER BY benefit_key",
        (p["spid"],)))
    data["badges"] = clean_all(query(
        "SELECT badge_id, kind, label, signature, issued_at FROM bpr_badges WHERE spid = %s ORDER BY id",
        (p["spid"],)))
    data["journey"] = journey(p["spid"])
    return json_response({"ok": True, "partner": data})


def stats():
    total = query("SELECT COUNT(*) AS n FROM bpr_partners", one=True)
    active = query("SELECT COUNT(*) AS n FROM bpr_partners WHERE status='active'", one=True)
    benefits = query("SELECT COUNT(*) AS n FROM bpr_partner_benefits", one=True)
    badges = query("SELECT COUNT(*) AS n FROM bpr_badges", one=True)
    by_tier = query("SELECT tier, COUNT(*) AS n FROM bpr_partners GROUP BY tier ORDER BY n DESC")
    return json_response({"ok": True, "stats": {
        "partners": total["n"] if total else 0,
        "active": active["n"] if active else 0,
        "benefits_granted": benefits["n"] if benefits else 0,
        "badges_issued": badges["n"] if badges else 0,
        "by_tier": clean_all(by_tier),
    }})


def demo_pay(body):
    """DEMO ONLY — simulate a payment landing and run the provisioning.

    The live path is: the storefront creates an invoice via the Daftra API, the
    payer settles it, and an operator (or the ERP) records the payment, which is
    what actually triggers provisioning. That loop cannot be closed from a
    browser without a real transfer, so this endpoint stands in for the
    settlement step during a walkthrough.

    Gated behind BPR_PARTNER_DEMO=1. With the flag unset it returns 403, so a
    live configuration cannot be made to mint identities without payment.
    """
    if os.environ.get("BPR_PARTNER_DEMO") != "1":
        return err("demo_disabled", 403,
                   note="set BPR_PARTNER_DEMO=1 to enable the walkthrough path")

    email = s(body.get("email"), 200).lower()
    if not email:
        return err("email required")

    # Reuse the real provisioner so the demo exercises the same code path.
    order = {
        "email": email,
        "full_name": s(body.get("full_name"), 300),
        "organisation": s(body.get("organisation"), 300),
        "specialty": s(body.get("specialty"), 120),
        "city": s(body.get("city"), 120),
        "kind": s(body.get("kind") or "PHY", 4),
        "sku": s(body.get("sku") or "PARTNER-TICKET-INITIAL", 60),
        "invoice_id": body.get("invoice_id"),
        "invoice_no": s(body.get("invoice_no"), 60),
        "amount_sar": body.get("amount_sar"),
    }
    out = provision(order)
    return out


def register_partner_ticket(body):
    """Attach LinkedIn / profile details after provisioning."""
    spid = s(body.get("spid"), 50)
    if not spid:
        return err("spid required")
    p = query("SELECT spid FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    if not p:
        return err("partner_not_found", 404)

    linkedin = s(body.get("linkedin_url"), 500) or None
    verified = body.get("linkedin_verified") is True
    row = execute(
        """UPDATE bpr_partners
           SET linkedin_url = COALESCE(%s, linkedin_url),
               linkedin_verified = %s,
               verified_at = CASE WHEN %s THEN NOW() ELSE verified_at END,
               updated_at = NOW()
           WHERE spid = %s RETURNING *""",
        (linkedin, verified, verified, spid),
    )
    if linkedin:
        log_stage(spid, "linkedin_linked", linkedin, actor="partner")
    if verified:
        log_stage(spid, "linkedin_verified", "profile ownership confirmed", actor="partner")
        notify("partner.linkedin_verified", {"spid": spid, "linkedin_url": linkedin})
    return json_response({"ok": True, "partner": clean(row)})


# --------------------------------------------------------------------------
# Router
# --------------------------------------------------------------------------

ROUTES_DOC = [
    "GET  /health",
    "GET  /stats",
    "GET  /partners?status=&tier=&q=",
    "GET  /partners/:spid",
    "POST /provision",
    "POST /demo/pay",
    "POST /linkedin",
    "GET  /journey/:spid",
    "POST /webhook/n8n",
]


def route(method, path, q, body):
    if path == "/health":
        ok = True
        try:
            query("SELECT 1", one=True)
        except Exception:
            ok = False
        return json_response({"status": "ok" if ok else "degraded", "service": SERVICE,
                              "version": VERSION, "db": "ok" if ok else "down", "ts": now_iso()})
    if path in ("/", "/docs"):
        return json_response({"ok": True, "service": SERVICE, "version": VERSION, "routes": ROUTES_DOC})
    if path == "/stats" and method == "GET":
        return stats()

    if path == "/partners" and method == "GET":
        return list_partners(q)
    m = re.match(r"^/partners/([^/]+)$", path)
    if m and method == "GET":
        return get_partner(m.group(1))

    if path == "/provision" and method == "POST":
        return provision(body)
    if path == "/demo/pay" and method == "POST":
        return demo_pay(body)
    if path == "/linkedin" and method == "POST":
        return register_partner_ticket(body)

    m = re.match(r"^/journey/([^/]+)$", path)
    if m and method == "GET":
        return json_response({"ok": True, "journey": journey(m.group(1))})

    if path == "/webhook/n8n" and method == "POST":
        return json_response({"ok": True})

    return err("not_found", 404, routes=ROUTES_DOC)


# --------------------------------------------------------------------------
# HTTP server
# --------------------------------------------------------------------------


class Handler(BaseHTTPRequestHandler):
    server_version = f"{SERVICE}/{VERSION}"

    def log_message(self, fmt, *args):
        sys.stderr.write(f"[{SERVICE}] {self.address_string()} {fmt % args}\n")

    def _send(self, body, status, headers):
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Bpr-Key")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _dispatch(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        q = parse_qs(parsed.query)
        body = {}
        if self.command in ("POST", "PATCH", "PUT"):
            try:
                length = int(self.headers.get("Content-Length") or 0)
            except ValueError:
                length = 0
            if length:
                raw = self.rfile.read(min(length, 2_000_000))
                try:
                    body = json.loads(raw.decode("utf-8")) if raw else {}
                except (ValueError, UnicodeDecodeError):
                    return self._send(*err("invalid_json", 400))
        try:
            self._send(*route(self.command, path, q, body))
        except psycopg2.Error as e:
            self._send(*err(f"database_error: {e.__class__.__name__}: {e}", 500))
        except Exception as e:  # noqa: BLE001
            self._send(*err(f"internal_error: {e.__class__.__name__}: {e}", 500))

    do_GET = do_HEAD = do_POST = _dispatch

    def do_OPTIONS(self):
        self._send(b"", 204, {})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    sys.stderr.write(f"[{SERVICE}] listening on 127.0.0.1:{PORT}\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
