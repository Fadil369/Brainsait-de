#!/usr/bin/env python3
"""
bpr-linkedin — LinkedIn identity layer for the BrainSAIT Provider Registry.

LinkedIn is used for IDENTITY CORROBORATION only: a member connects their
LinkedIn account, LinkedIn attests the account holder's name / email /
picture, and the registry records that binding. It does NOT confer
professional licensure (that stays with SCFHS) and every consumer must
render that distinction.

  GET  /health
  GET  /linkedin/auth?spid=<spid>[&return=<path>]      -> 302 LinkedIn consent (PKCE)
  GET  /linkedin/callback?code&state                   -> token + userinfo -> DB -> 302 return
  GET  /linkedin/status?spid=<spid>                    -> {linked, ...} (no secrets)
  GET  /linkedin/evidence?spid=<spid>                  -> dossier evidence block (no tokens)
  POST /linkedin/disconnect {spid}                     -> revoke + delete binding (admin key)
  GET  /                                                 -> route doc

Stdlib + psycopg2, supervised Python mesh service on port 9643.
"""

import base64
import hashlib
import json
import os
import re
import secrets
import sys
import time
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, quote, unquote, urlencode

import psycopg2
import psycopg2.extras

PORT = int(os.environ.get("BPR_LINKEDIN_PORT", "9643"))
DB_DSN = os.environ.get("BPR_LINKEDIN_DSN") or (
    "host={} port={} dbname={} user={} password={}".format(
        os.environ.get("BPR_LINKEDIN_DB_HOST", "127.0.0.1"),
        os.environ.get("BPR_LINKEDIN_DB_PORT", "5433"),
        os.environ.get("BPR_LINKEDIN_DB_NAME", "braincore"),
        os.environ.get("BPR_LINKEDIN_DB_USER", "braincore"),
        os.environ.get("BPR_LINKEDIN_DB_PASS", ""),
    )
)

SERVICE = "bpr-linkedin"
VERSION = "1.0.0"

LINKEDIN_CLIENT_ID = os.environ.get("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.environ.get("LINKEDIN_CLIENT_SECRET", "")
# MUST stay byte-identical to the redirect registered in the LinkedIn portal.
REDIRECT_URI = os.environ.get("LINKEDIN_REDIRECT_URI",
                              "https://linkedin-lark-automation.brainsait.de/linkedin/callback")
SCOPES = "openid profile email"

AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
USERINFO_URL = "https://api.linkedin.com/v2/userinfo"

N8N_BASE = os.environ.get("BPR_LINKEDIN_N8N", "http://127.0.0.1:5678")
ADMIN_TOKEN = os.environ.get("BPR_LINKEDIN_ADMIN_TOKEN", "")

SPID_RE = re.compile(r"^SA-[A-Z]{3}-\d{6}$")
MAX_STATE_BYTES = 64


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def log(msg):
    sys.stderr.write(f"[{SERVICE}] {msg}\n")
    sys.stderr.flush()


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
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            conn.commit()
    finally:
        conn.close()


def json_response(obj, status=200):
    body = json.dumps(obj, indent=2, default=str).encode()
    return status, body, {"Content-Type": "application/json",
                          "Access-Control-Allow-Origin": "*"}


def html_response(body, status=200, headers=None):
    h = {"Content-Type": "text/html; charset=utf-8",
         "Access-Control-Allow-Origin": "*"}
    if headers:
        h.update(headers)
    return status, body.encode(), h


def redirect(location):
    return 302, b"", {"Location": location}


def err(code, status, **extra):
    return json_response({"ok": False, "error": code, **extra}, status)


# --------------------------------------------------------------------------
# identity
# --------------------------------------------------------------------------

def resolve_spid(raw):
    s = unquote(raw or "").strip()
    up = s.upper()
    if up in ("FADI", "FADI-ALGHAREEB", "DR-FADI-ALGHAREEB"):
        return "SA-PHY-000001"
    if up in ("FARROUKH", "FARROUKH-RAZA", "DR-FARROUKH-RAZA", "SA-PHY-000027"):
        return "SA-PHY-000021"
    if up in ("FADIL", "MOHAMED-ELFADIL"):
        return "SA-PHY-000002"
    return up if SPID_RE.match(up) else s


def partner_exists(spid):
    return query("SELECT spid FROM bpr_partners WHERE spid = %s", (spid,), one=True) is not None


def linkedin_row(spid):
    return query("SELECT * FROM bpr_linkedin WHERE spid = %s", (spid,), one=True)


# --------------------------------------------------------------------------
# LinkedIn HTTP
# --------------------------------------------------------------------------

def http_post_form(url, form):
    body = urlencode(form).encode()
    req = _request(url, data=body)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    return _open(req)


def http_get_json(url, access_token):
    req = _request(url)
    req.add_header("Authorization", f"Bearer {access_token}")
    return _open(req)


def _request(url, data=None):
    import urllib.request
    return urllib.request.Request(url, data=data, method="GET" if data is None else "POST")


def _open(req):
    import urllib.request
    import urllib.error
    try:
        r = urllib.request.urlopen(req, timeout=15)
        return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except Exception:
            return e.code, {}
    except Exception as e:
        return 0, {"_transport_error": str(e)}


def pkce_s256(verifier):
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")


def refresh_if_needed(row):
    if not row:
        return row
    exp = row.get("expires_at")
    if exp and exp > datetime.now(timezone.utc) + timedelta(minutes=5):
        return row
    if not row.get("refresh_token"):
        return row
    status, data = http_post_form(TOKEN_URL, {
        "grant_type": "refresh_token",
        "refresh_token": row["refresh_token"],
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    })
    if status == 200 and data.get("access_token"):
        expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=int(data.get("expires_in", 5184000)))
        execute(
            "UPDATE bpr_linkedin SET access_token=%s, refresh_token=COALESCE(%s, refresh_token),"
            " expires_at=%s, updated_at=now() WHERE spid=%s",
            (data["access_token"], data.get("refresh_token"), expires_at, row["spid"]),
        )
        row = dict(row)
        row["access_token"] = data["access_token"]
        row["expires_at"] = expires_at
    return row


def fetch_userinfo(access_token):
    status, data = http_get_json(USERINFO_URL, access_token)
    if status != 200:
        return None, data
    sub = data.get("sub")
    if not sub:
        return None, data
    return {
        "linkedin_sub": sub,
        "full_name": (data.get("name") or "").strip() or None,
        "email": (data.get("email") or "").strip() or None,
        "email_verified": data.get("email_verified"),
        "picture_url": (data.get("picture") or "").strip() or None,
        "locale": data.get("locale"),
        "raw": data,
    }, None


# --------------------------------------------------------------------------
# routes
# --------------------------------------------------------------------------

def health():
    try:
        query("SELECT 1", one=True)
        dbok = True
    except Exception:
        dbok = False
    return json_response({"status": "ok" if dbok else "degraded", "service": SERVICE,
                          "version": VERSION, "db": "ok" if dbok else "down",
                          "linkedin_configured": bool(LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET),
                          "redirect_uri": REDIRECT_URI, "ts": now_iso()})


def auth_start(qs):
    spid = resolve_spid((qs.get("spid") or [""])[0])
    if not spid or not SPID_RE.match(spid):
        return err("spid_required", 400, example="/linkedin/auth?spid=SA-PHY-000001")
    if not partner_exists(spid):
        return err("unknown_spid", 404, spid=spid)
    if not (LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET):
        return err("linkedin_not_configured", 503,
                   note="LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET missing")

    verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode().rstrip("=")
    state = base64.urlsafe_b64encode(secrets.token_bytes(24)).decode().rstrip("=")
    if len(state) > MAX_STATE_BYTES:
        state = state[:MAX_STATE_BYTES]
    return_to = (qs.get("return") or ["/bpr/p/%s/" % spid])[0]
    if not return_to.startswith("/"):
        return_to = "/bpr/p/%s/" % spid

    execute(
        "INSERT INTO bpr_linkedin_states (state, spid, verifier, return_to)"
        " VALUES (%s, %s, %s, %s)",
        (state, spid, verifier, return_to),
    )
    params = urlencode({
        "response_type": "code",
        "client_id": LINKEDIN_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "state": state,
        "scope": SCOPES,
        "code_challenge": pkce_s256(verifier),
        "code_challenge_method": "S256",
    })
    return redirect(f"{AUTH_URL}?{params}")


def auth_callback(qs):
    code = (qs.get("code") or [""])[0]
    state = (qs.get("state") or [""])[0]
    if (qs.get("error") or [""])[0]:
        desc = (qs.get("error_description") or [""])[0]
        return html_response(
            "<h1>LinkedIn authorization declined</h1><p>%s — %s</p>"
            "<p><a href=\"/bpr/\">Back to the registry</a></p>" % (
                (qs.get("error") or [""])[0], desc), 400)
    if not code or not state:
        return err("missing_code_or_state", 400)

    row = query(
        "DELETE FROM bpr_linkedin_states WHERE state=%s AND expires_at > now()"
        " RETURNING spid, verifier, return_to", (state,), one=True)
    if not row:
        return html_response(
            "<h1>Link expired or already used</h1>"
            "<p><a href=\"/bpr/p/\">Open your dossier</a> to retry.</p>", 400)

    spid, verifier = row["spid"], row["verifier"]
    status, data = http_post_form(TOKEN_URL, {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
        "code_verifier": verifier,
    })
    if status != 200 or not data.get("access_token"):
        log(f"token exchange failed for {spid}: {status} {str(data)[:200]}")
        return html_response(
            "<h1>LinkedIn token exchange failed</h1>"
            "<p>The authorization was not completed. Please retry.</p>"
            "<p><a href=\"/bpr/p/%s/\">Back to your dossier</a></p>" % spid, 502)

    info, raw = fetch_userinfo(data["access_token"])
    if not info:
        log(f"userinfo failed for {spid}: {str(raw)[:200]}")
        return html_response(
            "<h1>Could not read LinkedIn profile</h1>"
            "<p>Authorization succeeded but the profile read failed. "
            "Ensure the 'openid profile email' scopes are granted.</p>"
            "<p><a href=\"/bpr/p/%s/\">Back to your dossier</a></p>" % spid, 502)

    # One LinkedIn identity may not back two registry identities (anti-impersonation).
    clash = query("SELECT spid FROM bpr_linkedin WHERE linkedin_sub=%s AND spid<>%s",
                  (info["linkedin_sub"], spid), one=True)
    if clash:
        log(f"sub clash {info['linkedin_sub']} bound to {clash['spid']}, rejected for {spid}")
        return html_response(
            "<h1>This LinkedIn account is already linked</h1>"
            "<p>LinkedIn identity <code>%s</code> is already bound to <code>%s</code>. "
            "One LinkedIn account cannot corroborate two registry identities.</p>"
            "<p><a href=\"/bpr/p/%s/\">Back to your dossier</a></p>" % (
                info["linkedin_sub"], clash["spid"], spid), 409)

    expires_at = datetime.now(timezone.utc) + timedelta(
        seconds=int(data.get("expires_in", 5184000)))
    profile_url = "https://www.linkedin.com/in/%s" % info["linkedin_sub"]
    execute(
        """
        INSERT INTO bpr_linkedin (spid, linkedin_sub, full_name, email, picture_url,
                                  headline, locale, profile_url, access_token,
                                  refresh_token, expires_at, verified_at, raw_json, updated_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now(),%s,now())
        ON CONFLICT (spid) DO UPDATE SET
          linkedin_sub=EXCLUDED.linkedin_sub, full_name=EXCLUDED.full_name,
          email=EXCLUDED.email, picture_url=EXCLUDED.picture_url,
          headline=EXCLUDED.headline, locale=EXCLUDED.locale,
          profile_url=EXCLUDED.profile_url, access_token=EXCLUDED.access_token,
          refresh_token=COALESCE(EXCLUDED.refresh_token, bpr_linkedin.refresh_token),
          expires_at=EXCLUDED.expires_at, verified_at=now(),
          raw_json=EXCLUDED.raw_json, updated_at=now()
        """,
        (spid, info["linkedin_sub"], info["full_name"], info["email"], info["picture_url"],
         None, info["locale"], profile_url, data["access_token"],
         data.get("refresh_token"), expires_at, json.dumps(info["raw"])),
    )
    execute("UPDATE bpr_partners SET linkedin_verified = true, verified_at = now() WHERE spid = %s",
            (spid,))

    notify("partner.linkedin_verified", {
        "spid": spid, "linkedin_sub": info["linkedin_sub"],
        "full_name": info["full_name"] or "", "email": info["email"] or "",
        "profile_url": profile_url,
    })

    ret = row["return_to"] or "/bpr/p/%s/" % spid
    sep = "&" if "?" in ret else "?"
    return redirect(f"{ret}{sep}linkedin=verified")


def linkedin_status(qs):
    spid = resolve_spid((qs.get("spid") or [""])[0])
    if not spid:
        return err("spid_required", 400)
    row = linkedin_row(spid)
    if not row:
        return json_response({"ok": True, "linked": False, "spid": spid})
    exp = row.get("expires_at")
    return json_response({
        "ok": True, "linked": True, "spid": spid,
        "linkedin_sub": row["linkedin_sub"],
        "full_name": row.get("full_name"),
        "email": row.get("email"),
        "picture_url": row.get("picture_url"),
        "profile_url": row.get("profile_url"),
        "verified_at": row.get("verified_at"),
        "token_expired": bool(exp and exp < datetime.now(timezone.utc)),
        "notice": "Identity corroboration via LinkedIn — does not replace professional licensure (SCFHS).",
    })


def linkedin_evidence(qs):
    spid = resolve_spid((qs.get("spid") or [""])[0])
    if not spid:
        return err("spid_required", 400)
    row = linkedin_row(spid)
    if not row:
        return json_response({"ok": True, "linked": False, "spid": spid})
    row = refresh_if_needed(row)
    return json_response({
        "ok": True, "linked": True, "spid": spid,
        "source": "linkedin-openid-connect",
        "subject": row["linkedin_sub"],
        "name": row.get("full_name"),
        "email": row.get("email"),
        "picture": row.get("picture_url"),
        "profile": row.get("profile_url"),
        "verified_at": row.get("verified_at"),
        "bound_to": "identity corroboration only — professional licensure remains with SCFHS",
    })


def linkedin_disconnect(body, headers):
    if not ADMIN_TOKEN:
        return err("admin_token_not_configured", 503)
    if (headers.get("x-admin-token") or "") != ADMIN_TOKEN:
        return err("unauthorized", 401)
    spid = resolve_spid((body or {}).get("spid"))
    if not spid:
        return err("spid_required", 400)
    row = linkedin_row(spid)
    if row:
        execute("DELETE FROM bpr_linkedin WHERE spid=%s", (spid,))
        execute("UPDATE bpr_partners SET linkedin_verified = false WHERE spid=%s", (spid,))
        notify("partner.linkedin_disconnected", {"spid": spid, "linkedin_sub": row["linkedin_sub"]})
    return json_response({"ok": True, "spid": spid, "disconnected": bool(row)})


def notify(event, payload):
    """Fire the n8n notification webhook (dotted events, one webhook)."""
    try:
        import urllib.request
        data = json.dumps({"event": event, "service": SERVICE,
                           "ts": now_iso(), "payload": payload}).encode()
        req = urllib.request.Request(f"{N8N_BASE.rstrip('/')}/webhook/bpr-partner/notify",
                                     data=data, method="POST")
        req.add_header("Content-Type", "application/json")
        urllib.request.urlopen(req, timeout=3).read()
    except Exception as e:
        log(f"notify {event} failed: {e}")


ROUTES_DOC = [
    "GET  /health",
    "GET  /linkedin/auth?spid=<spid>&return=<path>",
    "GET  /linkedin/callback?code&state",
    "GET  /linkedin/status?spid=<spid>",
    "GET  /linkedin/evidence?spid=<spid>",
    "POST /linkedin/disconnect {spid}  (X-Admin-Token)",
]


def route(method, path, qs, body=None, headers=None):
    if path == "/health":
        return health()
    if path in ("/", "/docs"):
        return json_response({"ok": True, "service": SERVICE, "version": VERSION,
                              "routes": ROUTES_DOC, "redirect_uri": REDIRECT_URI})
    if path == "/linkedin/auth":
        return auth_start(qs)
    if path == "/linkedin/callback":
        return auth_callback(qs)
    if path == "/linkedin/status":
        return linkedin_status(qs)
    if path == "/linkedin/evidence":
        return linkedin_evidence(qs)
    if path == "/linkedin/disconnect" and method == "POST":
        return linkedin_disconnect(body or {}, headers or {})
    return err("not_found", 404, routes=ROUTES_DOC)


# --------------------------------------------------------------------------
# HTTP server
# --------------------------------------------------------------------------

class Handler(BaseHTTPRequestHandler):
    server_version = f"{SERVICE}/{VERSION}"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        log("%s %s" % (self.address_string(), fmt % args))

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers",
                         "Content-Type, X-Admin-Token, X-Hub-Key")

    def _emit(self, result):
        status, body, headers = result
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self._cors()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if body:
            self.wfile.write(body)

    def _read_body(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            n = 0
        if n <= 0:
            return {}
        raw = self.rfile.read(min(n, 65536))
        try:
            return json.loads(raw.decode())
        except Exception:
            return {}

    def _dispatch(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        body = self._read_body() if self.command in ("POST", "PUT") else {}
        try:
            result = route(self.command, parsed.path, qs, body,
                           {k.lower(): v for k, v in self.headers.items()})
        except Exception as e:
            log(f"error {self.command} {self.path}: {e}")
            result = err("internal", 500, detail=str(e)[:200])
        self._emit(result)

    do_GET = do_POST = do_HEAD = _dispatch

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()


def main():
    if not LINKEDIN_CLIENT_ID:
        log("WARNING: LINKEDIN_CLIENT_ID is not set — /linkedin/auth will 503")
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    log(f"{SERVICE} v{VERSION} listening on :{PORT} (redirect_uri={REDIRECT_URI})")
    srv.serve_forever()


if __name__ == "__main__":
    main()
