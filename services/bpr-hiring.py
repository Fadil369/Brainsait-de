#!/usr/bin/env python3
"""
bpr-hiring — Slot, hiring, and organizing system for providers, facilities, and government.

Part of the BrainSAIT local mesh (.de plane). Runs on port 9640, backed by
braincore-postgres, supervised by supervisord (python-mesh.conf).

Health contract: GET /health -> {"status":"ok","service":"bpr-hiring",...} within 2s.

Data model (braincore DB):
  bpr_organizations  facilities, government bodies, provider orgs, associations
  bpr_jobs           slots / jobs / contracts / gigs posted by organizations
  bpr_applications   provider applications against a job
  bpr_credentials    SCFHS / degree / insurance / board / license attestations
  bpr_offers         offers extended to applicants
  bpr_pipeline       stage tracking (Meegle task + Lark chat linkage)
"""

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

PORT = int(os.environ.get("BPR_HIRING_PORT", "9640"))

# Connection settings come from the environment (sourced from a mode-600 secrets
# file by the supervisord command). No credentials live in this source file.
DB_HOST = os.environ.get("BPR_HIRING_DB_HOST", "127.0.0.1")
DB_PORT = os.environ.get("BPR_HIRING_DB_PORT", "5433")
DB_NAME = os.environ.get("BPR_HIRING_DB_NAME", "braincore")
DB_USER = os.environ.get("BPR_HIRING_DB_USER", "braincore")
DB_PASS = os.environ.get("BPR_HIRING_DB_PASS", "")
DB_DSN = os.environ.get("BPR_HIRING_DSN") or (
    f"host={DB_HOST} port={DB_PORT} dbname={DB_NAME} user={DB_USER} password={DB_PASS}"
)
N8N_BASE = os.environ.get("BPR_HIRING_N8N", "http://127.0.0.1:5678")
HUB_URL = os.environ.get("BPR_HIRING_HUB", "http://127.0.0.1:9600")
SERVICE = "bpr-hiring"
VERSION = "1.0.0"

VALID_JOB_TYPES = {"slot", "job", "contract", "gig"}
VALID_JOB_STATUS = {"open", "closed", "filled", "expired"}
VALID_APP_STATUS = {
    "applied",
    "reviewing",
    "interview",
    "assessment",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
}
VALID_ORG_TYPES = {"facility", "gov", "provider_org", "association", "training"}
VALID_CRED_TYPES = {"SCFHS", "Degree", "Insurance", "Board", "License", "Experience"}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def new_id(prefix):
    """Collision-resistant short id: prefix + base36 time + random suffix."""
    ts = format(int(time.time() * 1000), "x").upper()
    rnd = uuid.uuid4().hex[:4].upper()
    return f"{prefix}-{ts}{rnd}"


# --------------------------------------------------------------------------
# Database
# --------------------------------------------------------------------------


def db():
    """Open a connection. Caller is responsible for closing."""
    return psycopg2.connect(DB_DSN, connect_timeout=5)


def query(sql, params=None, one=False):
    conn = db()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            if cur.description is None:
                conn.commit()
                return None
            rows = cur.fetchall()
            conn.commit()
            if one:
                return dict(rows[0]) if rows else None
            return [dict(r) for r in rows]
    finally:
        conn.close()


def execute(sql, params=None):
    """Run a write statement, return the RETURNING row if any."""
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
    """Normalise datetime/date values for JSON output."""
    if isinstance(v, datetime):
        return v.astimezone(timezone.utc).isoformat() if v.tzinfo else v.isoformat()
    if hasattr(v, "isoformat"):
        return v.isoformat()
    return v


def clean(row):
    if row is None:
        return None
    return {k: iso(v) for k, v in row.items()}


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


def emit_event(topic, payload):
    """Publish to the mesh integration hub (fire-and-forget)."""
    try:
        data = json.dumps({"topic": topic, "service": SERVICE, "payload": payload}).encode()
        req = urlrequest.Request(
            HUB_URL + "/ingest",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urlrequest.urlopen(req, timeout=2).read()
    except Exception:
        pass


def notify(event, payload):
    """Fire the n8n notification webhook (fire-and-forget).

    Every event goes to one endpoint; n8n routes on `event` and owns the
    notification policy (which events produce a Lark card, to which chat,
    with what wording). Keeping that decision in n8n means changing it never
    requires redeploying this service.
    """
    try:
        data = json.dumps(
            {"event": event, "service": SERVICE, "ts": now_iso(), "payload": payload}
        ).encode()
        req = urlrequest.Request(
            f"{N8N_BASE}/webhook/bpr-hiring/notify",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urlrequest.urlopen(req, timeout=3).read()
    except Exception as e:  # noqa: BLE001 - a failed notify must never fail the request
        sys.stderr.write(f"[{SERVICE}] notify {event} failed: {e}\n")


def clamp_int(v, lo, hi, default=0):
    try:
        n = int(v)
    except (TypeError, ValueError):
        return default
    return max(lo, min(hi, n))


def s(v, limit=500):
    """Coerce to a trimmed string with a length cap."""
    if v is None:
        return ""
    return str(v).strip()[:limit]


# --------------------------------------------------------------------------
# Organizations
# --------------------------------------------------------------------------


def list_organizations(q):
    where, params = [], []
    if q.get("type"):
        where.append("type = %s")
        params.append(q["type"][0])
    if q.get("status"):
        where.append("status = %s")
        params.append(q["status"][0])
    if q.get("q"):
        where.append("(name ILIKE %s OR spid ILIKE %s OR license_number ILIKE %s)")
        like = f"%{q['q'][0]}%"
        params += [like, like, like]
    clause = ("WHERE " + " AND ".join(where)) if where else ""
    rows = query(
        f"SELECT * FROM bpr_organizations {clause} ORDER BY created_at DESC LIMIT 200",
        params,
    )
    return json_response({"ok": True, "total": len(rows), "organizations": clean_all(rows)})


def create_organization(body):
    name = s(body.get("name"))
    if not name:
        return err("name required")
    org_type = s(body.get("type") or "facility", 30)
    if org_type not in VALID_ORG_TYPES:
        return err(f"invalid type; allowed: {sorted(VALID_ORG_TYPES)}")

    org_id = s(body.get("org_id")) or new_id("BPR-ORG")
    row = execute(
        """
        INSERT INTO bpr_organizations
            (org_id, spid, name, type, license_number, license_expiry,
             address, contact_email, contact_phone, status)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING *
        """,
        (
            org_id,
            s(body.get("spid"), 50) or None,
            name,
            org_type,
            s(body.get("license_number"), 100) or None,
            s(body.get("license_expiry"), 20) or None,
            s(body.get("address"), 500) or None,
            s(body.get("contact_email"), 200) or None,
            s(body.get("contact_phone"), 50) or None,
            "active",
        ),
    )
    emit_event("bpr.organization.registered", {"org_id": org_id, "name": name, "type": org_type})
    notify("organization.registered",
           {"org_id": org_id, "name": name, "type": org_type, "spid": s(body.get("spid"), 50)})
    return json_response({"ok": True, "organization": clean(row)}, 201)


def get_organization(org_id):
    org = query("SELECT * FROM bpr_organizations WHERE org_id = %s OR id::text = %s", (org_id, org_id), one=True)
    if not org:
        return err("organization_not_found", 404)
    jobs = query(
        "SELECT * FROM bpr_jobs WHERE facility_spid = %s ORDER BY posted_at DESC LIMIT 100",
        (org.get("spid") or org_id,),
    )
    data = clean(org)
    data["jobs"] = clean_all(jobs)
    data["open_jobs"] = sum(1 for j in jobs if j.get("status") == "open")
    return json_response({"ok": True, "organization": data})


# --------------------------------------------------------------------------
# Jobs
# --------------------------------------------------------------------------


def list_jobs(q):
    where, params = [], []
    if q.get("facility"):
        where.append("facility_spid = %s")
        params.append(q["facility"][0])
    if q.get("status"):
        where.append("status = %s")
        params.append(q["status"][0])
    if q.get("type"):
        where.append("type = %s")
        params.append(q["type"][0])
    if q.get("specialty"):
        where.append("specialty ILIKE %s")
        params.append(f"%{q['specialty'][0]}%")
    if q.get("q"):
        where.append("(title ILIKE %s OR requirements ILIKE %s OR location ILIKE %s)")
        like = f"%{q['q'][0]}%"
        params += [like, like, like]
    clause = ("WHERE " + " AND ".join(where)) if where else ""
    rows = query(
        f"SELECT * FROM bpr_jobs {clause} ORDER BY posted_at DESC LIMIT 200", params
    )
    return json_response({"ok": True, "total": len(rows), "jobs": clean_all(rows)})


def create_job(body):
    title = s(body.get("title"))
    facility = s(body.get("facility_spid") or body.get("facilitySpid"), 50)
    if not title:
        return err("title required")
    if not facility:
        return err("facility_spid required")

    job_type = s(body.get("type") or "job", 20)
    if job_type not in VALID_JOB_TYPES:
        return err(f"invalid type; allowed: {sorted(VALID_JOB_TYPES)}")

    job_id = new_id("BPR-JOB")
    salary = clamp_int(body.get("salary_sar") or body.get("salarySar"), 0, 10_000_000, 0)
    expires = s(body.get("expires_at") or body.get("expiresAt"), 40) or None

    row = execute(
        """
        INSERT INTO bpr_jobs
            (job_id, facility_spid, facility_name, title, type, specialty,
             location, salary_sar, requirements, status, expires_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,'open',%s)
        RETURNING *
        """,
        (
            job_id,
            facility,
            s(body.get("facility_name") or body.get("facilityName"), 300) or None,
            title,
            job_type,
            s(body.get("specialty"), 100) or None,
            s(body.get("location"), 300) or None,
            salary,
            s(body.get("requirements"), 4000) or None,
            expires,
        ),
    )
    emit_event(
        "bpr.job.posted",
        {"job_id": job_id, "facility_spid": facility, "title": title, "type": job_type},
    )
    notify("job.posted", {
        "job_id": job_id, "title": title, "type": job_type,
        "facility_spid": facility,
        "facility_name": s(body.get("facility_name") or body.get("facilityName"), 300),
        "specialty": s(body.get("specialty"), 100),
        "location": s(body.get("location"), 300),
        "salary_sar": salary,
    })
    return json_response({"ok": True, "job": clean(row)}, 201)


def get_job(job_id):
    job = query("SELECT * FROM bpr_jobs WHERE job_id = %s OR id::text = %s", (job_id, job_id), one=True)
    if not job:
        return err("job_not_found", 404)
    apps = query(
        "SELECT * FROM bpr_applications WHERE job_id = %s ORDER BY applied_at DESC LIMIT 500",
        (job["id"],),
    )
    by_status = {}
    for a in apps:
        st = a.get("status") or "unknown"
        by_status[st] = by_status.get(st, 0) + 1
    data = clean(job)
    data["applications_total"] = len(apps)
    data["by_status"] = by_status
    data["applications"] = clean_all(apps)
    return json_response({"ok": True, "job": data})


def close_job(job_id, body):
    status = s(body.get("status") or "closed", 20)
    if status not in VALID_JOB_STATUS:
        return err(f"invalid status; allowed: {sorted(VALID_JOB_STATUS)}")
    row = execute(
        "UPDATE bpr_jobs SET status = %s, updated_at = NOW() WHERE job_id = %s OR id::text = %s RETURNING *",
        (status, job_id, job_id),
    )
    if not row:
        return err("job_not_found", 404)
    emit_event("bpr.job.status_changed", {"job_id": row["job_id"], "status": status})
    return json_response({"ok": True, "job": clean(row)})


# --------------------------------------------------------------------------
# Applications
# --------------------------------------------------------------------------


def list_applications(q):
    where, params = [], []
    if q.get("job"):
        where.append("job_id_ref = %s")
        params.append(q["job"][0])
    if q.get("applicant"):
        where.append("applicant_spid = %s")
        params.append(q["applicant"][0])
    if q.get("status"):
        where.append("status = %s")
        params.append(q["status"][0])
    clause = ("WHERE " + " AND ".join(where)) if where else ""
    rows = query(
        f"SELECT * FROM bpr_applications {clause} ORDER BY applied_at DESC LIMIT 500", params
    )
    return json_response({"ok": True, "total": len(rows), "applications": clean_all(rows)})


def apply_to_job(job_id, body):
    applicant = s(body.get("applicant_spid") or body.get("applicantSpid"), 50)
    if not applicant:
        return err("applicant_spid required")

    job = query("SELECT * FROM bpr_jobs WHERE job_id = %s OR id::text = %s", (job_id, job_id), one=True)
    if not job:
        return err("job_not_found", 404)
    if job.get("status") != "open":
        return err("job_not_open", 409, job_status=job.get("status"))

    dup = query(
        "SELECT app_id FROM bpr_applications WHERE job_id = %s AND applicant_spid = %s "
        "AND status NOT IN ('rejected','withdrawn')",
        (job["id"], applicant),
        one=True,
    )
    if dup:
        return err("already_applied", 409, app_id=dup["app_id"])

    app_id = new_id("BPR-APP")
    row = execute(
        """
        INSERT INTO bpr_applications
            (app_id, job_id, job_id_ref, applicant_spid, applicant_name, status, notes)
        VALUES (%s,%s,%s,%s,%s,'applied',%s)
        RETURNING *
        """,
        (
            app_id,
            job["id"],
            job["job_id"],
            applicant,
            s(body.get("applicant_name") or body.get("applicantName"), 300) or None,
            s(body.get("message") or body.get("notes"), 4000) or None,
        ),
    )
    # Seed the pipeline row for this application.
    execute(
        """
        INSERT INTO bpr_pipeline (pipeline_id, job_id, app_id, stage, lark_chat_id)
        VALUES (%s,%s,%s,'applied',%s)
        ON CONFLICT (pipeline_id) DO NOTHING
        """,
        (new_id("BPR-PIPE"), job["id"], row["id"], s(body.get("lark_chat_id"), 100) or None),
    )
    emit_event(
        "bpr.application.submitted",
        {"app_id": app_id, "job_id": job["job_id"], "applicant_spid": applicant},
    )
    notify("application.submitted", {
        "app_id": app_id,
        "job_id": job["job_id"],
        "job_title": job.get("title") or "",
        "facility_spid": job.get("facility_spid") or "",
        "facility_name": job.get("facility_name") or "",
        "applicant_spid": applicant,
        "applicant_name": s(body.get("applicant_name") or body.get("applicantName"), 300),
    })
    return json_response({"ok": True, "application": clean(row)}, 201)


def review_application(app_id, body):
    status = s(body.get("status") or "reviewing", 20)
    if status not in VALID_APP_STATUS:
        return err(f"invalid status; allowed: {sorted(VALID_APP_STATUS)}")
    score = clamp_int(body.get("score"), 0, 100, 0)
    row = execute(
        """
        UPDATE bpr_applications
        SET status = %s, score = %s, notes = COALESCE(%s, notes), updated_at = NOW()
        WHERE app_id = %s OR id::text = %s
        RETURNING *
        """,
        (status, score, s(body.get("notes"), 4000) or None, app_id, app_id),
    )
    if not row:
        return err("application_not_found", 404)
    # Advance the pipeline stage alongside the application status.
    execute(
        "UPDATE bpr_pipeline SET stage = %s, updated_at = NOW() WHERE app_id = %s",
        (status, row["id"]),
    )
    emit_event(
        "bpr.application.reviewed",
        {"app_id": row["app_id"], "status": status, "score": score},
    )
    notify("application.reviewed", {
        "app_id": row["app_id"], "job_id": row["job_id_ref"],
        "applicant_spid": row["applicant_spid"], "status": status, "score": score,
    })
    return json_response({"ok": True, "application": clean(row)})


# --------------------------------------------------------------------------
# Offers
# --------------------------------------------------------------------------


def extend_offer(job_id, body):
    app_ref = s(body.get("app_id") or body.get("appId"), 50)
    if not app_ref:
        return err("app_id required")
    app_row = query(
        "SELECT * FROM bpr_applications WHERE app_id = %s OR id::text = %s", (app_ref, app_ref), one=True
    )
    if not app_row:
        return err("application_not_found", 404)

    offer_id = new_id("BPR-OFFER")
    salary = clamp_int(body.get("salary_sar") or body.get("salarySar"), 0, 10_000_000, 0)
    start = s(body.get("start_date") or body.get("startDate"), 20) or None
    row = execute(
        """
        INSERT INTO bpr_offers
            (offer_id, application_id, app_id_ref, salary_sar, start_date, status, offer_letter_url)
        VALUES (%s,%s,%s,%s,%s,'pending',%s)
        RETURNING *
        """,
        (
            offer_id,
            app_row["id"],
            app_row["app_id"],
            salary,
            start,
            s(body.get("offer_letter_url"), 500) or None,
        ),
    )
    execute(
        "UPDATE bpr_applications SET status = 'offer', updated_at = NOW() WHERE id = %s",
        (app_row["id"],),
    )
    execute(
        "UPDATE bpr_pipeline SET stage = 'offer', updated_at = NOW() WHERE app_id = %s",
        (app_row["id"],),
    )
    emit_event(
        "bpr.offer.extended",
        {"offer_id": offer_id, "app_id": app_row["app_id"], "salary_sar": salary},
    )
    notify("offer.extended", {
        "offer_id": offer_id, "app_id": app_row["app_id"],
        "job_id": app_row["job_id_ref"], "applicant_spid": app_row["applicant_spid"],
        "salary_sar": salary, "start_date": start or "",
    })
    return json_response({"ok": True, "offer": clean(row)}, 201)


def respond_to_offer(offer_id, body):
    accepted = body.get("accepted", True) is not False
    new_status = "accepted" if accepted else "rejected"
    row = execute(
        "UPDATE bpr_offers SET status = %s, updated_at = NOW() WHERE offer_id = %s OR id::text = %s RETURNING *",
        (new_status, offer_id, offer_id),
    )
    if not row:
        return err("offer_not_found", 404)
    app_status = "hired" if accepted else "rejected"
    execute(
        "UPDATE bpr_applications SET status = %s, updated_at = NOW() WHERE id = %s",
        (app_status, row["application_id"]),
    )
    execute(
        "UPDATE bpr_pipeline SET stage = %s, updated_at = NOW() WHERE app_id = %s",
        (app_status, row["application_id"]),
    )
    if accepted:
        # A filled hire closes the underlying job.
        execute(
            "UPDATE bpr_jobs SET status = 'filled', updated_at = NOW() WHERE id = "
            "(SELECT job_id FROM bpr_applications WHERE id = %s)",
            (row["application_id"],),
        )
    emit_event(
        "bpr.offer.responded",
        {"offer_id": row["offer_id"], "accepted": accepted, "app_id": row["app_id_ref"]},
    )
    notify(f"offer.{new_status}", {
        "offer_id": row["offer_id"], "app_id": row["app_id_ref"],
        "accepted": accepted, "salary_sar": row.get("salary_sar"),
        "start_date": iso(row.get("start_date")) if row.get("start_date") else "",
    })
    return json_response({"ok": True, "offer": clean(row)})


# --------------------------------------------------------------------------
# Credentials
# --------------------------------------------------------------------------


def add_credential(body):
    app_ref = s(body.get("app_id") or body.get("appId"), 50)
    cred_type = s(body.get("credential_type") or body.get("type"), 50)
    if not app_ref:
        return err("app_id required")
    if cred_type not in VALID_CRED_TYPES:
        return err(f"invalid credential_type; allowed: {sorted(VALID_CRED_TYPES)}")

    app_row = query(
        "SELECT id, app_id FROM bpr_applications WHERE app_id = %s OR id::text = %s",
        (app_ref, app_ref),
        one=True,
    )
    if not app_row:
        return err("application_not_found", 404)

    cred_id = new_id("BPR-CRED")
    row = execute(
        """
        INSERT INTO bpr_credentials
            (cred_id, application_id, app_id_ref, credential_type, issuing_authority,
             document_url, notes, verified)
        VALUES (%s,%s,%s,%s,%s,%s,%s,FALSE)
        RETURNING *
        """,
        (
            cred_id,
            app_row["id"],
            app_row["app_id"],
            cred_type,
            s(body.get("issuing_authority"), 300) or None,
            s(body.get("document_url"), 500) or None,
            s(body.get("notes"), 2000) or None,
        ),
    )
    return json_response({"ok": True, "credential": clean(row)}, 201)


def verify_credential(cred_id, body):
    verified = body.get("verified", True) is not False
    row = execute(
        """
        UPDATE bpr_credentials
        SET verified = %s, verified_at = CASE WHEN %s THEN NOW() ELSE NULL END,
            notes = COALESCE(%s, notes), updated_at = NOW()
        WHERE cred_id = %s OR id::text = %s
        RETURNING *
        """,
        (verified, verified, s(body.get("notes"), 2000) or None, cred_id, cred_id),
    )
    if not row:
        return err("credential_not_found", 404)
    emit_event(
        "bpr.credential.verified",
        {"cred_id": row["cred_id"], "type": row["credential_type"], "verified": verified},
    )
    return json_response({"ok": True, "credential": clean(row)})


# --------------------------------------------------------------------------
# Pipeline, stats, webhooks
# --------------------------------------------------------------------------


def get_pipeline(job_id):
    rows = query(
        """
        SELECT p.*, a.applicant_spid, a.applicant_name, a.score
        FROM bpr_pipeline p
        LEFT JOIN bpr_applications a ON a.id = p.app_id
        WHERE p.job_id = (SELECT id FROM bpr_jobs WHERE job_id = %s OR id::text = %s)
        ORDER BY p.updated_at DESC
        """,
        (job_id, job_id),
    )
    stages = {}
    for r in rows:
        st = r.get("stage") or "applied"
        stages[st] = stages.get(st, 0) + 1
    return json_response(
        {"ok": True, "job_id": job_id, "total": len(rows), "by_stage": stages, "pipeline": clean_all(rows)}
    )


def global_stats():
    orgs = query("SELECT COUNT(*) AS n FROM bpr_organizations", one=True)
    jobs = query("SELECT COUNT(*) AS n FROM bpr_jobs", one=True)
    open_jobs = query("SELECT COUNT(*) AS n FROM bpr_jobs WHERE status = 'open'", one=True)
    apps = query("SELECT COUNT(*) AS n FROM bpr_applications", one=True)
    hired = query("SELECT COUNT(*) AS n FROM bpr_applications WHERE status = 'hired'", one=True)
    offers = query("SELECT COUNT(*) AS n FROM bpr_offers", one=True)
    creds = query("SELECT COUNT(*) AS n FROM bpr_credentials", one=True)
    verified = query("SELECT COUNT(*) AS n FROM bpr_credentials WHERE verified", one=True)
    by_type = query("SELECT type, COUNT(*) AS n FROM bpr_jobs GROUP BY type ORDER BY n DESC")
    by_org_type = query("SELECT type, COUNT(*) AS n FROM bpr_organizations GROUP BY type ORDER BY n DESC")
    return json_response(
        {
            "ok": True,
            "stats": {
                "organizations": orgs["n"] if orgs else 0,
                "jobs": jobs["n"] if jobs else 0,
                "open_jobs": open_jobs["n"] if open_jobs else 0,
                "applications": apps["n"] if apps else 0,
                "offers": offers["n"] if offers else 0,
                "hired": hired["n"] if hired else 0,
                "credentials": creds["n"] if creds else 0,
                "credentials_verified": verified["n"] if verified else 0,
                "jobs_by_type": clean_all(by_type),
                "orgs_by_type": clean_all(by_org_type),
            },
        }
    )


def handle_lark_webhook(body):
    """Handle a Lark interactive card action."""
    action = body.get("action") or {}
    value = action.get("value") or {}
    action_type = s(value.get("action_type"), 40)
    app_id = s(value.get("app_id"), 50)
    job_id = s(value.get("job_id"), 50)

    if action_type == "approve":
        return review_application(app_id, {"status": "reviewing", "notes": "Approved via Lark"})
    if action_type == "reject":
        return review_application(app_id, {"status": "rejected", "notes": "Rejected via Lark"})
    if action_type == "offer":
        return extend_offer(job_id, {"app_id": app_id, "salary_sar": value.get("salary") or 0})
    return err("unknown_action", 400)


# --------------------------------------------------------------------------
# Router
# --------------------------------------------------------------------------

ROUTES_DOC = [
    "GET  /health",
    "GET  /stats",
    "GET  /organizations?type=&status=&q=",
    "POST /organizations",
    "GET  /organizations/:id",
    "GET  /jobs?facility=&status=&type=&specialty=&q=",
    "POST /jobs",
    "GET  /jobs/:id",
    "POST /jobs/:id/close",
    "POST /jobs/:id/apply",
    "GET  /jobs/:id/pipeline",
    "GET  /applications?job=&applicant=&status=",
    "POST /applications/:id/review",
    "POST /jobs/:id/offer",
    "POST /offers/:id/respond",
    "POST /credentials",
    "POST /credentials/:id/verify",
    "POST /webhook/lark",
    "POST /webhook/n8n",
]


def route(method, path, q, body):
    # --- meta ---
    if path == "/health":
        db_ok = True
        try:
            query("SELECT 1", one=True)
        except Exception:
            db_ok = False
        return json_response(
            {
                "status": "ok" if db_ok else "degraded",
                "service": SERVICE,
                "version": VERSION,
                "db": "ok" if db_ok else "down",
                "ts": now_iso(),
            }
        )
    if path in ("/", "/docs"):
        return json_response({"ok": True, "service": SERVICE, "version": VERSION, "routes": ROUTES_DOC})
    if path == "/stats" and method == "GET":
        return global_stats()

    # --- organizations ---
    if path == "/organizations" and method == "GET":
        return list_organizations(q)
    if path == "/organizations" and method == "POST":
        return create_organization(body)
    m = re.match(r"^/organizations/([^/]+)$", path)
    if m and method == "GET":
        return get_organization(m.group(1))

    # --- jobs ---
    if path == "/jobs" and method == "GET":
        return list_jobs(q)
    if path == "/jobs" and method == "POST":
        return create_job(body)
    m = re.match(r"^/jobs/([^/]+)$", path)
    if m and method == "GET":
        return get_job(m.group(1))
    m = re.match(r"^/jobs/([^/]+)/close$", path)
    if m and method == "POST":
        return close_job(m.group(1), body)
    m = re.match(r"^/jobs/([^/]+)/apply$", path)
    if m and method == "POST":
        return apply_to_job(m.group(1), body)
    m = re.match(r"^/jobs/([^/]+)/pipeline$", path)
    if m and method == "GET":
        return get_pipeline(m.group(1))
    m = re.match(r"^/jobs/([^/]+)/offer$", path)
    if m and method == "POST":
        return extend_offer(m.group(1), body)

    # --- applications ---
    if path == "/applications" and method == "GET":
        return list_applications(q)
    m = re.match(r"^/applications/([^/]+)/review$", path)
    if m and method == "POST":
        return review_application(m.group(1), body)

    # --- offers ---
    m = re.match(r"^/offers/([^/]+)/respond$", path)
    if m and method == "POST":
        return respond_to_offer(m.group(1), body)

    # --- credentials ---
    if path == "/credentials" and method == "POST":
        return add_credential(body)
    m = re.match(r"^/credentials/([^/]+)/verify$", path)
    if m and method == "POST":
        return verify_credential(m.group(1), body)

    # --- webhooks ---
    if path == "/webhook/lark" and method == "POST":
        return handle_lark_webhook(body)
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
            length = clamp_int(self.headers.get("Content-Length"), 0, 2_000_000, 0)
            if length:
                raw = self.rfile.read(length)
                try:
                    body = json.loads(raw.decode("utf-8")) if raw else {}
                except (ValueError, UnicodeDecodeError):
                    return self._send(*err("invalid_json", 400))
        try:
            self._send(*route(self.command, path, q, body))
        except psycopg2.Error as e:
            self._send(*err(f"database_error: {e.__class__.__name__}", 500))
        except Exception as e:  # noqa: BLE001 - surface any handler failure as JSON
            self._send(*err(f"internal_error: {e.__class__.__name__}: {e}", 500))

    def do_GET(self):
        self._dispatch()

    def do_HEAD(self):
        self._dispatch()

    def do_POST(self):
        self._dispatch()

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
