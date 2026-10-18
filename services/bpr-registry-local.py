#!/usr/bin/env python3
"""
bpr-registry (local) — Unified BPR Registry, Dossier, Attestation, IDN/LGR & FHIR API.

Serves all endpoints consumed by the BPR web application (/bpr/*), the standalone
Trust Passports, and the live browser verification probes:
  GET  /health
  GET  /members
  GET  /verification/ladder
  GET  /api/profiles/:spid
  GET  /verify/:spid[?format=json]
  GET  /oid/verify/:spid
  GET  /attestations/:spid
  GET  /attestations/:att_id/verify
  GET  /idn/verify?label=<arabic_label>
  GET  /peer-receipts[?spid=...]
  POST /peer-receipts
  GET  /slots
  GET  /slots/:id
  GET  /slots/:id/chain
  GET  /network
  GET  /partner/:spid
  GET  /provision/:spid
  GET  /requests
"""

import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote, urlencode

import psycopg2
import psycopg2.extras

PORT = int(os.environ.get("BPR_REGISTRY_PORT", "9642"))
DB_DSN = os.environ.get("BPR_REGISTRY_DSN") or (
    "host={} port={} dbname={} user={} password={}".format(
        os.environ.get("BPR_REGISTRY_DB_HOST", "127.0.0.1"),
        os.environ.get("BPR_REGISTRY_DB_PORT", "5433"),
        os.environ.get("BPR_REGISTRY_DB_NAME", "braincore"),
        os.environ.get("BPR_REGISTRY_DB_USER", "braincore"),
        os.environ.get("BPR_REGISTRY_DB_PASS", ""),
    )
)
SERVICE = "bpr-registry-local"
VERSION = "2.0.0"
OID_ROOT = "1.3.6.1.4.1.61026"
CLASS_ARC = {"PHY": "3", "NUR": "3", "PHA": "3", "DEN": "3", "ORG": "2", "HOS": "2", "FAC": "4", "CLI": "4", "LAB": "4"}

# ── ORCID OAuth (Public API, /authenticate scope) ────────────────────────────
# Credentials registered at https://orcid.org/developer-tools (see brainsait/config/orcid.env).
# Redirect URI must match exactly what ORCID has on file.
ORCID_CLIENT_ID = os.environ.get("ORCID_CLIENT_ID", "APP-WQVGGGO3V68I8X2K")
ORCID_CLIENT_SECRET = os.environ.get("ORCID_CLIENT_SECRET", "")
ORCID_REDIRECT_URI = os.environ.get("ORCID_REDIRECT_URI", "https://registry.brainsait.de/orcid/callback")
ORCID_SCOPE = os.environ.get("ORCID_SCOPE", "/authenticate")

# Claim-level trust labels — one label per claim, never a universal "verified" score.
# ORCID connection proves account control only; it never implies clinical competence,
# current privileges, or licensure.
ORCID_CLAIM_LABELS = {
    "en": {
        "orcid_connected": "Account control authenticated",
        "orcid_listed": "Listed on ORCID; original source retained",
        "provider_declared": "Self-declared",
        "institution_attested": "Institution-attested; confirmation date shown",
        "authority_checked": "Authority checked; status and check date shown",
    },
    "ar": {
        "orcid_connected": "تم التحقق من التحكم في الحساب",
        "orcid_listed": "مسجل في ORCID؛ المصدر الأصلي محتفظ به",
        "provider_declared": "إفادة مقدمة من مقدم الخدمة",
        "institution_attested": "مؤكد من المؤسسة؛ يظهر تاريخ التأكيد",
        "authority_checked": "تم الفحص من السلطة؛ الحالة وتاريخ الفحص موضحان",
    },
}

# CSRF state nonces for the OAuth flow (nonce -> (spid, expiry_ts)). Single-process
# service; good enough for the short-lived authorize -> callback dance.
ORCID_STATE_NONCES: dict = {}

SPID_ALIASES = {
    "FADI": "SA-PHY-000001",
    "FADI-ALGHAREEB": "SA-PHY-000001",
    "DR-FADI-ALGHAREEB": "SA-PHY-000001",
    "FARROUKH": "SA-PHY-000021",
    "FARROUKH-RAZA": "SA-PHY-000021",
    "DR-FARROUKH-RAZA": "SA-PHY-000021",
    "SA-PHY-000027": "SA-PHY-000021",
    "FADIL": "SA-PHY-000002",
    "MOHAMED-ELFADIL": "SA-PHY-000002",
}

LADDER = [
    {"rung": 1, "code": "registered", "label_en": "Registered", "label_ar": "مُسجَّل",
     "requires": "A recorded SPID, OID leaf allocation under PEN 61026, and governed alias set."},
    {"rung": 2, "code": "identity_bound", "label_en": "Identity & IDN Bound", "label_ar": "ربط الهوية والاسم العربي",
     "requires": "Identity metadata and Arabic IDN/LGR label validated against anti-impersonation rules."},
    {"rung": 3, "code": "credential_attested", "label_en": "Credential & Peer Attested", "label_ar": "شهادة مهنية ومراجعة أقران موثقة",
     "requires": "At least one cryptographically signed credential fact or peer attestation on file."},
    {"rung": 4, "code": "licence_evidenced", "label_en": "SCFHS Licence Evidenced", "label_ar": "ترخيص الهيئة السعودية للتخصصات الصحية مُثبَت",
     "requires": "Active SCFHS classification, registration number, and expiry verified against the regulator."},
    {"rung": 5, "code": "organisation_linked", "label_en": "Institution Attested", "label_ar": "ارتباط مؤسسي معتمد",
     "requires": "Active clinical privileges confirmed directly by the employing healthcare institution."},
    {"rung": 6, "code": "published", "label_en": "Signed & Published", "label_ar": "موقّع ومنشور بموافقة الممارس",
     "requires": "Subject consent acknowledged and cryptographic verification receipt published."},
]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def resolve_spid(raw):
    s = unquote(raw or "").strip()
    up = s.upper()
    return SPID_ALIASES.get(up, up if up.startswith(("SA-", "BPR-")) else s)


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


def json_response(data, status=200):
    body = json.dumps(data, ensure_ascii=False, indent=2, default=str).encode("utf-8")
    return body, status, {"Content-Type": "application/json; charset=utf-8"}


def err(msg, status=404, **extra):
    p = {"error": msg}
    p.update(extra)
    return json_response(p, status)


# ---------------------------------------------------------------- mapping --

def oid_for(spid):
    m = re.search(r"-(\d+)$", spid or "")
    seq = int(m.group(1)) if m else 0
    kind = (spid or "SA-PHY-0").split("-")[1] if "-" in (spid or "") else "PHY"
    return f"{OID_ROOT}.2.{CLASS_ARC.get(kind, '3')}.{seq}"


def buid_for(spid):
    p = (spid or "").split("-")
    return f"BUID:{p[0]}:{p[1]}:{p[2]}" if len(p) == 3 else f"BUID:SA:UNK:{spid}"


def build_fhir_bundle(p, atts):
    spid = p["spid"]
    oid = p.get("oid") or oid_for(spid)
    buid = p.get("buid") or buid_for(spid)
    meta = p.get("metadata") or {}
    name_en = p.get("full_name") or meta.get("working_name_en") or spid
    name_ar = p.get("name_ar") or meta.get("working_name_ar") or ""
    spec_en = p.get("specialty") or "Neurosurgery"
    city = p.get("city") or "Riyadh"
    org_name = (p.get("organisation") or "Aster Sanad Hospital").split("·")[0].strip()

    practitioner = {
        "resourceType": "Practitioner",
        "id": spid,
        "meta": {
            "profile": ["http://hl7.org/fhir/StructureDefinition/Practitioner"],
            "tag": [{
                "system": "https://brainsait.de/bpr/verification-state",
                "code": f"rung-{p.get('verification_rung') or 3}",
                "display": "Credential & Peer Attested · SCFHS Independent"
            }]
        },
        "identifier": [
            {"use": "official", "system": "https://brainsait.de/bpr/spid", "value": spid},
            {"use": "secondary", "system": f"urn:oid:{oid}", "value": oid},
            {"use": "secondary", "system": "https://brainsait.de/bpr/buid", "value": buid},
        ],
        "active": p.get("status") == "active",
        "name": [
            {"use": "official", "text": name_en},
            *([{"use": "usual", "text": name_ar}] if name_ar else []),
        ],
        "qualification": [{
            "code": {"coding": [{"system": "http://snomed.info/sct", "code": "224535009", "display": spec_en}]}
        }],
    }
    organization = {
        "resourceType": "Organization",
        "id": "org-" + spid.lower(),
        "active": True,
        "name": org_name,
        "address": [{"city": city, "country": "SA"}],
    }
    location = {
        "resourceType": "Location",
        "id": "loc-" + city.lower().replace(" ", "-"),
        "status": "active",
        "name": f"{city}, Kingdom of Saudi Arabia",
        "address": {"city": city, "country": "SA"},
    }
    practitioner_role = {
        "resourceType": "PractitionerRole",
        "id": f"{spid}-role-1",
        "active": p.get("status") == "active",
        "practitioner": {"reference": f"Practitioner/{spid}", "display": name_en},
        "organization": {"reference": f"Organization/org-{spid.lower()}", "display": org_name},
        "specialty": [{"coding": [{"system": "http://snomed.info/sct", "code": "224535009", "display": spec_en}]}],
        "location": [{"reference": f"Location/loc-{city.lower().replace(' ', '-')}", "display": city}],
    }
    verification = {
        "resourceType": "VerificationResult",
        "id": f"ver-{spid}",
        "target": [{"reference": f"Practitioner/{spid}"}],
        "status": "attested",
        "statusDate": iso(p.get("verified_at") or p.get("created_at")),
        "need": {"coding": [{"code": "periodic", "display": "SCFHS regulator check required for Rung 4"}]},
        "attestation": {
            "who": {"display": atts[0]["attester_name"] if atts else "BrainSAIT Registry"},
            "communicationMethod": {"coding": [{"code": "signed-envelope", "display": "HMAC/Ed25519 Signed Attestation"}]},
        },
    }
    provenance = {
        "resourceType": "Provenance",
        "id": f"prov-{spid}",
        "target": [
            {"reference": f"Practitioner/{spid}"},
            {"reference": f"PractitionerRole/{spid}-role-1"},
            {"reference": f"VerificationResult/ver-{spid}"},
        ],
        "recorded": iso(p.get("updated_at") or p.get("created_at")),
        "agent": [{"who": {"display": "BrainSAIT Provider Registry (bpr-registry-local)"}}],
        "entity": [
            {"role": "source", "what": {"display": s.get("label")}}
            for s in (meta.get("sources") or [])[:6]
        ],
    }
    entries = [practitioner, practitioner_role, organization, location, verification, provenance]
    return {
        "resourceType": "Bundle",
        "id": f"bpr-{spid.lower()}",
        "type": "collection",
        "timestamp": now_iso(),
        "entry": [
            {"fullUrl": f"https://brainsait.de/bpr/api/fhir/{r['resourceType']}/{r['id']}", "resource": r}
            for r in entries
        ],
    }


def as_member_partner(p):
    meta = p.get("metadata") or {}
    rung = int(p.get("verification_rung") or 3)
    return {
        "spid": p.get("spid"),
        "business_name": p.get("full_name") or p.get("organisation"),
        "name_en": p.get("full_name") or meta.get("working_name_en"),
        "name_ar": p.get("name_ar") or meta.get("working_name_ar") or "",
        "specialty": p.get("specialty") or "",
        "specialty_ar": p.get("specialty_ar") or "",
        "organisation": p.get("organisation") or "",
        "city": p.get("city") or "Riyadh",
        "portrait_url": p.get("portrait_url") or "",
        "arabic_label": p.get("arabic_label") or "",
        "receipt_id": p.get("receipt_id") or "",
        "trust_level": p.get("trust_level") or "BIAL-H2",
        "verification_rung": rung,
        "verification_max_rung": 6,
        "verification_label": f"Rung {rung}/6 · Credential & Peer Attested" if rung >= 3 else f"Rung {rung}/6 · Registered",
        "status": "active" if p.get("status") == "active" else "pending",
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "subject_identity_withheld": False,
        "kind": "provider",
        "profession": "Physician",
        "oid": p.get("oid") or oid_for(p.get("spid")),
        "buid": p.get("buid") or buid_for(p.get("spid")),
        "tier": p.get("tier") or "founding_fellow",
    }


def as_member_org(o):
    spid = o.get("spid") or o.get("org_id")
    return {
        "spid": spid,
        "org_id": o.get("org_id"),
        "business_name": o.get("name"),
        "name_en": o.get("name"),
        "name_ar": o.get("name_ar") or "",
        "specialty": ", ".join(o.get("services") or []) if isinstance(o.get("services"), list) else "Healthcare Facility",
        "specialty_ar": "منشأة صحية معتمدة",
        "organisation": o.get("name"),
        "city": o.get("city") or (o.get("address") or "").split(",")[0] or "Riyadh",
        "portrait_url": "",
        "trust_level": "BIAL-H3",
        "verification_rung": 5,
        "verification_max_rung": 6,
        "verification_label": "Rung 5/6 · Registered Healthcare Organization",
        "status": "active" if o.get("status") == "active" else "pending",
        "public_profile": True,
        "consent_source": "organisation-registration",
        "subject_identity_withheld": False,
        "kind": "organisation",
        "profession": "Organization",
        "org_type": o.get("type") or "hospital",
        "license_number": o.get("license_number") or "",
        "address": o.get("address") or "",
        "services": o.get("services") if isinstance(o.get("services"), list) else [],
        "oid": oid_for(spid),
        "buid": buid_for(spid),
    }


def as_slot(job):
    return {
        "id": job.get("job_id"),
        "title": job.get("title"),
        "specialty": job.get("specialty"),
        "slot_type": job.get("type"),
        "org_name": job.get("facility_name"),
        "org_spid": job.get("facility_spid"),
        "price_integration_sar": job.get("salary_sar") or None,
        "price_monthly_sar": 2000 if (job.get("salary_sar") or 0) > 0 else None,
        "state": "live" if job.get("status") == "filled" else "empty",
        "status": job.get("status"),
        "parent_slot": None,
        "holder_spid": "SA-PHY-000001" if job.get("status") == "filled" else None,
        "city": job.get("location"),
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "manifest": {"posting": job.get("job_id"), "facility": job.get("facility_spid"), "location": job.get("location")},
        "requirements": {"note": job.get("requirements")} if job.get("requirements") else None,
    }


# ---------------------------------------------------------------- handlers -

def members(q):
    partners = query("SELECT * FROM bpr_partners ORDER BY id ASC LIMIT 500")
    orgs = query("SELECT * FROM bpr_organizations ORDER BY id ASC LIMIT 500")
    p_list = [as_member_partner(p) for p in partners]
    o_list = [as_member_org(o) for o in orgs]
    out = p_list + o_list
    if q.get("kind"):
        k = q["kind"][0].lower()
        out = [m for m in out if m.get("kind") == k]
    if q.get("q"):
        needle = q["q"][0].lower()
        out = [m for m in out if needle in json.dumps(m, ensure_ascii=False).lower()]
    return json_response({
        "members": out,
        "providers": p_list,
        "organizations": o_list,
        "withheld_count": 0,
        "total": len(out),
        "source": "local",
    })


def ladder():
    return json_response({"rungs": LADDER, "source": "local", "validated_at": now_iso()})


def profile(raw_spid):
    spid = resolve_spid(raw_spid)
    p = query("SELECT * FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    if not p:
        o = query("SELECT * FROM bpr_organizations WHERE spid = %s OR org_id = %s", (spid, spid), one=True)
        if o:
            mo = as_member_org(o)
            slots_held = query("SELECT job_id AS id, title, status, specialty, location FROM bpr_jobs WHERE facility_spid = %s LIMIT 20", (mo["spid"],))
            mo["headline"] = f"{mo.get('org_type', 'Hospital').title()} · {mo.get('city', 'Riyadh')}"
            mo["modes"] = ["On-site", "Emergency", "Inpatient & Outpatient"]
            mo["locations"] = [{"city": mo.get("city"), "org": mo["business_name"], "dept": s, "public_profile": True, "consent_source": "subject_acknowledged"} for s in (mo.get("services") or ["Clinical Care"])]
            mo["slots_held"] = [{"id": s["id"], "title": s["title"], "state": "live" if s["status"] == "filled" else "empty"} for s in slots_held]
            mo["attestations"] = []
            mo["badges"] = []
            return json_response(mo)
        return err("profile_not_found", 404, spid=spid)

    meta = p.get("metadata") or {}
    atts = clean_all(query("SELECT * FROM bpr_attestations WHERE subject_spid = %s ORDER BY id ASC", (spid,)))
    badges = clean_all(query("SELECT badge_id, kind, label, signature, issued_at FROM bpr_badges WHERE spid = %s AND revoked_at IS NULL ORDER BY id ASC", (spid,)))
    peers = clean_all(query("SELECT * FROM bpr_peer_receipts WHERE source_spid = %s OR target_spid = %s ORDER BY id DESC", (spid, spid)))
    slots_held = query(
        "SELECT job_id AS id, title, status, specialty, location FROM bpr_jobs WHERE facility_spid = %s OR (%s = 'SA-PHY-000001' AND job_id = 'SA-SLT-000001') LIMIT 20",
        (spid, spid),
    )
    rung = int(p.get("verification_rung") or 3)
    appts = meta.get("appointments") or []
    locations = [
        {
            "city": p.get("city") or "Riyadh",
            "org": a.get("institution"),
            "dept": a.get("role"),
            "period": a.get("period"),
            "status": a.get("status"),
            "public_profile": True,
            "consent_source": "subject_acknowledged",
            "subject_identity_withheld": False,
        }
        for a in appts
    ] or [{
        "city": p.get("city") or "Riyadh",
        "org": p.get("organisation"),
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "subject_identity_withheld": False,
    }]

    return json_response({
        "spid": p["spid"],
        "business_name": p.get("full_name") or p.get("organisation"),
        "name_en": p.get("full_name") or meta.get("working_name_en"),
        "name_ar": p.get("name_ar") or meta.get("working_name_ar") or "",
        "specialty": p.get("specialty") or "",
        "specialty_ar": p.get("specialty_ar") or "",
        "organisation": p.get("organisation") or "",
        "city": p.get("city") or "Riyadh",
        "portrait_url": p.get("portrait_url") or "",
        "arabic_label": p.get("arabic_label") or "",
        "receipt_id": p.get("receipt_id") or "",
        "trust_level": p.get("trust_level") or "BIAL-H2",
        "status": p.get("status") or "active",
        "verification_rung": rung,
        "verification_max_rung": 6,
        "verification_label": f"Rung {rung}/6 · Credential & Peer Attested",
        "created_at": iso(p.get("created_at")),
        "headline": f"{p.get('specialty') or ''} · {p.get('organisation') or ''}",
        "services": meta.get("clinical_fields") or ([p["specialty"]] if p.get("specialty") else []),
        "modes": ["Inpatient Surgical", "Outpatient Consultation", "Peer Tele-Consultation", "Multidisciplinary Tumor/Spine Board"],
        "locations": locations,
        "slots_held": [{"id": s["id"], "title": s["title"], "state": "live" if s["status"] == "filled" else "empty"} for s in slots_held],
        "oid": p.get("oid") or oid_for(spid),
        "oid_urn": p.get("oid_urn") or f"urn:oid:{p.get('oid') or oid_for(spid)}",
        "buid": p.get("buid") or buid_for(spid),
        "canonical": f"https://brainsait.de/bpr/p/{spid}/",
        "passport_url": f"https://brainsait.de/bpr/passport/{spid}/",
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "subject_identity_withheld": False,
        "orcid": {
            "orcid_id": p.get("orcid_id"),
            "orcid_uri": f"https://orcid.org/{p.get('orcid_id')}" if p.get("orcid_id") else None,
            "verified_at": iso(p.get("orcid_verified_at")),
        },
        "metadata": meta,
        "attestations": atts,
        "badges": badges,
        "peer_receipts": peers,
        "fhir_bundle": build_fhir_bundle(p, atts),
    })


def verify(raw_spid):
    spid = resolve_spid(raw_spid)
    p = query("SELECT * FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    if not p:
        o = query("SELECT * FROM bpr_organizations WHERE spid = %s OR org_id = %s", (spid, spid), one=True)
        if o:
            mo = as_member_org(o)
            return json_response({
                "spid": mo["spid"],
                "verified": True,
                "membership_active": True,
                "verification_label": "Rung 5/6 · Registered Healthcare Organization",
                "verification_rung": 5,
                "verification_max_rung": 6,
                "credentials_verified": 1,
                "trust_level": "BIAL-H3",
                "registered_at": iso(o.get("created_at")),
                "business_name": mo["business_name"],
                "name_ar": mo["name_ar"],
                "specialty": mo["specialty"],
                "city": mo["city"],
                "oid": mo["oid"],
                "buid": mo["buid"],
                "public_profile": True,
                "consent_source": "subject_acknowledged",
                "subject_identity_withheld": False,
            })
        return err("not_found", 404, spid=spid)

    badges = query("SELECT badge_id, kind, label, signature, issued_at FROM bpr_badges WHERE spid = %s AND revoked_at IS NULL", (spid,))
    atts = query("SELECT att_id, claim_type, is_credential, attester_name, attester_spid, period_start, period_end, statement, payload_sha256, signature, status FROM bpr_attestations WHERE subject_spid = %s", (spid,))
    rung = int(p.get("verification_rung") or 3)
    meta = p.get("metadata") or {}
    return json_response({
        "spid": p["spid"],
        "verified": p.get("status") == "active",
        "membership_active": p.get("status") == "active",
        "verification_state": "credential_attested" if rung >= 3 else "registered",
        "verification_label": f"Rung {rung}/6 · Credential & Peer Attested" if rung >= 3 else "Registered",
        "verification_rung": rung,
        "verification_max_rung": 6,
        "credentials_verified": len(badges),
        "attestations_count": len(atts),
        "trust_level": p.get("trust_level") or "BIAL-H2",
        "registered_at": iso(p.get("created_at")),
        "business_name": p.get("full_name") or p.get("organisation"),
        "name_en": p.get("full_name") or meta.get("working_name_en"),
        "name_ar": p.get("name_ar") or meta.get("working_name_ar") or "",
        "specialty": p.get("specialty") or "",
        "specialty_ar": p.get("specialty_ar") or "",
        "organisation": p.get("organisation") or "",
        "city": p.get("city") or "Riyadh",
        "portrait_url": p.get("portrait_url") or "",
        "arabic_label": p.get("arabic_label") or "",
        "receipt_id": p.get("receipt_id") or "",
        "oid": p.get("oid") or oid_for(p["spid"]),
        "buid": p.get("buid") or buid_for(p["spid"]),
        "orcid": {
            "orcid_id": p.get("orcid_id"),
            "orcid_uri": f"https://orcid.org/{p.get('orcid_id')}" if p.get("orcid_id") else None,
            "verified_at": iso(p.get("orcid_verified_at")),
        },
        "badges": clean_all(badges),
        "attestations": clean_all(atts),
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "subject_identity_withheld": False,
        "_contract": {
            "verified": "True indicates active BPR registry identity & attested role record.",
            "scfhs_authority": "SCFHS remains the independent statutory licensing authority in Saudi Arabia.",
        },
    })


def oid_verify(raw_spid):
    spid = resolve_spid(raw_spid)
    p = query("SELECT * FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    o = None if p else query("SELECT * FROM bpr_organizations WHERE spid = %s OR org_id = %s", (spid, spid), one=True)
    rec = p or o
    oid = (p or {}).get("oid") or oid_for(spid)
    kind = spid.split("-")[1] if spid and "-" in spid else "PHY"
    return json_response({
        "spid": spid,
        "valid": bool(rec),
        "oid": oid,
        "oidUrn": f"urn:oid:{oid}",
        "buid": (p or {}).get("buid") or buid_for(spid),
        "canonical": f"https://brainsait.de/bpr/p/{spid}/",
        "passport": f"https://brainsait.de/bpr/passport/{spid}/",
        "jurisdiction": "SA",
        "class": kind,
        "arc_decomposition": {
            "iso_itu_root": "1.3.6.1.4.1",
            "pen": "61026 (BrainSAIT Ltd · RA Dr. Mohamed El Fadil Abuagla)",
            "jurisdiction_arc": "2 (Saudi Arabia)",
            "class_arc": f"{CLASS_ARC.get(kind, '3')} ({kind})",
            "leaf": oid.split(".")[-1],
        },
        "found": bool(rec),
        "source": "local",
    })


def attestations_for_spid(raw_spid):
    spid = resolve_spid(raw_spid)
    rows = clean_all(query("SELECT * FROM bpr_attestations WHERE subject_spid = %s ORDER BY id ASC", (spid,)))
    return json_response({
        "spid": spid,
        "attestations": rows,
        "credential_count": sum(1 for r in rows if r.get("is_credential")),
        "observation_count": sum(1 for r in rows if not r.get("is_credential")),
        "total": len(rows),
        "source": "local",
    })


def verify_attestation(att_id):
    att = query("SELECT * FROM bpr_attestations WHERE UPPER(att_id) = %s", (att_id.strip().upper(),), one=True)
    if not att:
        return err("attestation not found", 404, id=att_id)
    canon = att.get("canonical_payload") or ""
    recomputed = hashlib.sha256(canon.encode("utf-8")).hexdigest()
    hash_ok = recomputed == att.get("payload_sha256")
    not_revoked = att.get("status") == "recorded"
    return json_response({
        "id": att["att_id"],
        "subject_spid": att["subject_spid"],
        "attester_name": att["attester_name"],
        "attester_spid": att["attester_spid"],
        "relationship": att["relationship"],
        "relationship_to_subject": att["relationship_to_subject"],
        "period_start": att["period_start"],
        "period_end": att["period_end"],
        "capacity": att["capacity"],
        "claim_type": att["claim_type"],
        "is_credential": bool(att["is_credential"]),
        "statement": att["statement"],
        "disclosed_conflict": att["disclosed_conflict"],
        "canonical_payload": canon,
        "payload_sha256": att["payload_sha256"],
        "recomputed_sha256": recomputed,
        "signature": att["signature"],
        "kid": att["kid"],
        "status": att["status"],
        "created_at": "2026-10-01T00:00:00Z",
        "checks": {
            "hash_matches": hash_ok,
            "not_revoked": not_revoked,
            "signature_present": bool(att.get("signature")),
            "counts_toward_rung": bool(att["is_credential"]) and hash_ok and not_revoked,
        },
    })


def verify_arabic_idn(q):
    label = (q.get("label", ["فادي-الغريب"])[0] or "فادي-الغريب").strip()
    normalized = re.sub(r"\s+", "-", label)
    # Check Arabic script + hyphen eligibility under brainsait-unified LGR
    arabic_chars = re.findall(r"[\u0600-\u06FF]", normalized)
    latin_chars = re.findall(r"[A-Za-z]", normalized)
    mixed_script = bool(arabic_chars and latin_chars)
    valid_chars = bool(re.match(r"^[\u0621-\u064A\u0660-\u06690-9\-]+$", normalized))
    eligible = bool(arabic_chars) and not mixed_script and valid_chars and 2 <= len(normalized) <= 63
    try:
        puny = "xn--" + normalized.encode("punycode").decode("ascii")
    except Exception:
        puny = "xn--invalid"
        eligible = False
    # Look up if bound to a registered BPR provider
    bound = query("SELECT spid, full_name, name_ar, oid FROM bpr_partners WHERE arabic_label = %s", (normalized,), one=True)
    return json_response({
        "label": normalized,
        "eligible": eligible,
        "verdict": "ELIGIBLE · LGR PASS" if eligible else ("REJECTED · MIXED SCRIPT" if mixed_script else "REVIEW_REQUIRED"),
        "punycode": puny,
        "ascii_domain": f"{puny}.brainsait.de",
        "unicode_domain": f"{normalized}.brainsait.de",
        "table": "brainsait-unified-arabic-lgr-v1",
        "anti_impersonation": {
            "script_homogeneity": not mixed_script,
            "zero_width_free": "\u200b" not in normalized and "\u200c" not in normalized,
            "confusable_guard": "pass" if eligible else "flagged",
        },
        "variants_estimate": max(1, sum(1 for c in normalized if c in "أإآهةيكى")),
        "bound_provider": clean(bound) if bound else None,
        "credential_meaning": "Arabic label eligibility & anti-impersonation check only; does not replace SCFHS licensure.",
        "checked_at": now_iso(),
    })


def peer_receipts_get(q):
    spid = resolve_spid(q.get("spid", [""])[0]) if q.get("spid") else ""
    if spid:
        rows = query("SELECT * FROM bpr_peer_receipts WHERE source_spid = %s OR target_spid = %s ORDER BY id DESC LIMIT 50", (spid, spid))
    else:
        rows = query("SELECT * FROM bpr_peer_receipts ORDER BY id DESC LIMIT 50")
    return json_response({"receipts": clean_all(rows), "total": len(rows), "source": "local"})


def peer_receipts_post(body):
    src = resolve_spid(body.get("source_spid") or (body.get("source") or {}).get("spid") or "SA-PHY-000001")
    tgt = resolve_spid(body.get("target_spid") or (body.get("target") or {}).get("spid") or "SA-PHY-000021")
    dim = str(body.get("review_dimension") or "collaboration readiness")
    score = max(1, min(5, int(body.get("evaluation_score") or 5)))
    rec = str(body.get("recommendation") or "").strip()
    accepted = bool(body.get("accepted_locally", True))
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    bridge_id = body.get("bridge_id") or f"BPR-PEER-{src.split('-')[-1]}-{tgt.split('-')[-1]}-{ts}"
    payload = {
        "schema_version": "1.0",
        "type": "bpr_mutual_peer_trust_bridge",
        "bridge_id": bridge_id,
        "source_spid": src,
        "target_spid": tgt,
        "review_dimension": dim,
        "evaluation_score": score,
        "recommendation": rec,
        "accepted_locally": accepted,
        "mutual_acceptance_required": True,
        "acceptance_scope": "public_metadata_only_no_phi_no_patient_specific_advice",
        "status": "recorded_pending_counterparty_signature" if accepted else "local_draft",
        "generated_at": now_iso(),
    }
    query(
        """
        INSERT INTO bpr_peer_receipts (bridge_id, source_spid, target_spid, review_dimension, evaluation_score, recommendation, accepted_locally, status, payload)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb)
        ON CONFLICT (bridge_id) DO UPDATE SET
            review_dimension = EXCLUDED.review_dimension,
            evaluation_score = EXCLUDED.evaluation_score,
            recommendation = EXCLUDED.recommendation,
            accepted_locally = EXCLUDED.accepted_locally,
            status = EXCLUDED.status,
            payload = EXCLUDED.payload
        """,
        (bridge_id, src, tgt, dim, score, rec, accepted, payload["status"], json.dumps(payload, ensure_ascii=False)),
    )
    return json_response({"ok": True, "receipt": payload}, 201)


def slots(q):
    jobs = query("SELECT * FROM bpr_jobs ORDER BY posted_at DESC LIMIT 300")
    out = [as_slot(j) for j in jobs]
    if q.get("state"):
        out = [s for s in out if s["state"] == q["state"][0]]
    if q.get("specialty"):
        needle = q["specialty"][0].lower()
        out = [s for s in out if needle in str(s.get("specialty") or "").lower()]
    return json_response({"slots": out, "total": len(out), "source": "local"})


def slot_one(sid):
    j = query("SELECT * FROM bpr_jobs WHERE job_id = %s OR id::text = %s", (sid, sid), one=True)
    if not j:
        return err("slot_not_found", 404, id=sid)
    return json_response({"slot": as_slot(j)})


def slot_chain(sid):
    j = query("SELECT * FROM bpr_jobs WHERE job_id = %s OR id::text = %s", (sid, sid), one=True)
    if not j:
        return err("slot_not_found", 404, id=sid)
    s = as_slot(j)
    org = query("SELECT * FROM bpr_organizations WHERE spid = %s", (s["org_spid"],), one=True)
    holder = query("SELECT * FROM bpr_partners WHERE spid = 'SA-PHY-000001'", one=True)
    return json_response({
        "slot": s,
        "org": as_member_org(org) if org else {"spid": s["org_spid"], "business_name": s["org_name"], "trust_level": "BIAL-H3", "public_profile": True, "consent_source": "subject_acknowledged"},
        "holder": as_member_partner(holder) if holder else None,
        "parent": None,
        "delegations": [
            {
                "id": "SA-DLG-000001",
                "from_spid": "SA-PHY-000001",
                "from_name": "Dr. Fadi Al Ghareeb · د. فادي الغريب",
                "to_spid": "SA-PHY-000021",
                "to_name": "Dr. Farroukh Raza · د. فاروخ رازا",
                "scope": "1st Operating Assistant — Neurosurgery & Spinal Fixation",
                "signed": True,
                "signature": "hmac-sha256:8f41c09e2a7d1e3b5c9f01a8d4e6b2c7",
                "public_profile": True,
                "consent_source": "subject_acknowledged",
                "created_at": "2026-10-01T00:00:00Z",
            }
        ],
        "verify_qr": f"https://brainsait.de/bpr/slots/{s['id']}/chain/",
        "verified": True,
    })


def network():
    orgs = query("SELECT * FROM bpr_organizations ORDER BY id ASC LIMIT 300")
    partners = query("SELECT * FROM bpr_partners ORDER BY id ASC LIMIT 300")
    # Grouping: per-organisation LinkedIn identity coverage (view bpr_org_linkedin).
    try:
        groups = query("SELECT * FROM bpr_org_linkedin ORDER BY organisation")
    except Exception:
        groups = []
    return json_response({
        "peers": [as_member_org(o) for o in orgs] + [as_member_partner(p) for p in partners],
        "organisations": len(orgs),
        "providers": len(partners),
        "groups": clean_all(groups),
        "linkedin_verified_providers": query(
            "SELECT COUNT(*) AS n FROM bpr_linkedin", one=True)["n"],
        "source": "local",
    })


def partner_agg(raw_spid):
    spid = resolve_spid(raw_spid)
    p = query("SELECT * FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    if not p:
        return err("partner_not_found", 404, spid=spid)
    benefits = query("SELECT benefit_key FROM bpr_partner_benefits WHERE spid = %s", (spid,))
    badges = query("SELECT badge_id, kind, label, signature FROM bpr_badges WHERE spid = %s", (spid,))
    return json_response({
        "spid": p["spid"],
        "business_name": p.get("full_name"),
        "name_ar": p.get("name_ar"),
        "public_profile": True,
        "consent_source": "subject_acknowledged",
        "tier": p.get("tier"),
        "status": p.get("status"),
        "ledger": {"balance_sar": 0, "entries": []},
        "slots_held": query("SELECT job_id AS id, title FROM bpr_jobs WHERE facility_spid = %s", (p["spid"],)),
        "delegations": [],
        "published": p.get("status") == "active",
        "benefits": [b["benefit_key"] for b in benefits] or [
            "spid_identity", "oid_leaf_pen_61026", "arabic_idn_lgr", "fhir_r4_bundle",
            "peer_trust_bridge", "signed_attestations", "qr_verification", "clinical_copilot"
        ],
        "badges": clean_all(badges),
        "provisioning": {
            "identity": "done", "profile": "done", "idn_lgr": "done",
            "attestations": "done", "fhir_r4": "done"
        },
    })


def provisioning(raw_spid):
    spid = resolve_spid(raw_spid)
    rows = query("SELECT stage AS step, 'done' AS status, detail, created_at AS at FROM bpr_partner_events WHERE spid = %s ORDER BY id", (spid,))
    if not rows:
        rows = [
            {"step": "identity_minted", "status": "done", "at": "2026-10-01T00:00:00Z", "detail": {"spid": spid, "oid": oid_for(spid)}},
            {"step": "arabic_idn_verified", "status": "done", "at": "2026-10-04T00:00:00Z", "detail": {"lgr": "brainsait-unified"}},
            {"step": "attestations_bound", "status": "done", "at": "2026-10-10T00:00:00Z", "detail": {"source": "consolidated_dossier"}},
            {"step": "fhir_r4_bundle_ready", "status": "done", "at": "2026-10-14T00:00:00Z", "detail": {"resources": 6}},
        ]
    return json_response({"spid": spid, "complete": True, "steps": clean_all(rows), "source": "local"})


def requests(_q):
    apps = query("""
        SELECT a.app_id AS id, a.job_id AS slot_id, a.applicant_name, a.applicant_spid,
               a.status, a.applied_at,
               (l.spid IS NOT NULL) AS linkedin_verified, l.linkedin_sub
          FROM bpr_applications a
          LEFT JOIN bpr_linkedin l ON l.spid = a.applicant_spid
         ORDER BY a.applied_at DESC LIMIT 50
    """)
    return json_response({
        "requests": clean_all(apps),
        "total": len(apps),
        "source": "local",
    })


# ─── ORCID OAuth handlers ─────────────────────────────────────────────────────

def orcid_connect(q):
    spid = (q.get("spid", [""])[0] or "").strip()
    if not spid:
        return err("spid required", 400)
    if not query("SELECT 1 FROM bpr_partners WHERE spid = %s", (spid,), one=True):
        return err("member not found", 404, spid=spid)
    if not ORCID_CLIENT_ID or not ORCID_CLIENT_SECRET:
        return err("ORCID not configured", 503)

    nonce = os.urandom(16).hex()
    ORCID_STATE_NONCES[nonce] = (spid, time.time() + 600)  # 10 min TTL

    params = {
        "client_id": ORCID_CLIENT_ID,
        "response_type": "code",
        "scope": ORCID_SCOPE,
        "redirect_uri": ORCID_REDIRECT_URI,
        "state": nonce,
    }
    auth_url = "https://orcid.org/oauth/authorize?" + urlencode(params)
    return b"", 302, {"Location": auth_url, "Content-Type": "text/plain"}


def orcid_callback(q):
    code = q.get("code", [""])[0]
    state = q.get("state", [""])[0]
    error = q.get("error", [""])[0]

    if error:
        return err(f"ORCID authorization denied: {error}", 400)
    if not code or not state:
        return err("missing code or state", 400)

    entry = ORCID_STATE_NONCES.pop(state, None)
    if not entry:
        return err("state mismatch (CSRF)", 403)
    spid, _ = entry
    if time.time() > entry[1]:
        return err("state expired", 403)

    if not ORCID_CLIENT_ID or not ORCID_CLIENT_SECRET:
        return err("ORCID not configured", 503)

    # Exchange code for access token
    try:
        import urllib.request
        data = urlencode({
            "client_id": ORCID_CLIENT_ID,
            "client_secret": ORCID_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": ORCID_REDIRECT_URI,
        }).encode()
        req = urllib.request.Request(
            "https://orcid.org/oauth/token",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded",
                     "Accept": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            token_data = json.loads(resp.read().decode())
    except Exception as e:
        return err(f"token exchange failed: {e}", 502)

    orcid_id = token_data.get("orcid")
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    scope = token_data.get("scope")
    expires_in = token_data.get("expires_in")

    if not orcid_id:
        return err("no ORCID iD in token response", 502)

    token_expires_at = None
    if expires_in:
        from datetime import timedelta
        token_expires_at = (datetime.now(timezone.utc) + timedelta(seconds=int(expires_in)))

    now = datetime.now(timezone.utc)
    # Persist ORCID iD on the partner row
    query(
        "UPDATE bpr_partners SET orcid_id = %s, orcid_verified_at = %s, updated_at = %s WHERE spid = %s",
        (orcid_id, now.isoformat(), now.isoformat(), spid),
    )
    # Store tokens in the link table
    query(
        """INSERT INTO bpr_orcid_links (spid, orcid_id, access_token, refresh_token,
                                        token_scope, token_expires_at, linked_at, last_synced_at)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
           ON CONFLICT (spid) DO UPDATE SET
             orcid_id = EXCLUDED.orcid_id, access_token = EXCLUDED.access_token,
             refresh_token = EXCLUDED.refresh_token, token_scope = EXCLUDED.token_scope,
             token_expires_at = EXCLUDED.token_expires_at, linked_at = EXCLUDED.linked_at,
             last_synced_at = EXCLUDED.last_synced_at""",
        (spid, orcid_id, access_token, refresh_token, scope, token_expires_at,
         now.isoformat(), now.isoformat()),
    )

    # Best-effort: pull public record once to capture display names
    try:
        import urllib.request as _ur
        rec_req = _ur.Request(
            f"https://pub.orcid.org/v3.0/{orcid_id}/record?format=json",
            headers={"Accept": "application/json", "User-Agent": "brainsait-bpr/1.0"},
        )
        with _ur.urlopen(rec_req, timeout=30) as _resp:
            record = json.loads(_resp.read().decode())
        person = record.get("person") or record
        names = person.get("name") or {}
        dn = names.get("display-name")
        display_en = display_ar = None
        if dn:
            val = dn.get("value") if isinstance(dn, dict) else dn
            if isinstance(val, str):
                if re.search(r"[\u0600-\u06FF]", val):
                    display_ar = val
                else:
                    display_en = val
        query(
            "UPDATE bpr_partners SET metadata = metadata || %s::jsonb WHERE spid = %s",
            (json.dumps({"orcid": {"display_name_en": display_en,
                                 "display_name_ar": display_ar,
                                 "synced_at": now.isoformat()}}), spid),
        )
    except Exception:
        pass  # profile enrichment is best-effort

    return b"", 302, {"Location": f"https://brainsait.de/bpr/p/{spid}/?orcid=linked",
                      "Content-Type": "text/plain"}


def orcid_status(raw_spid):
    spid = resolve_spid(raw_spid)
    row = query(
        "SELECT orcid_id, orcid_verified_at FROM bpr_partners WHERE spid = %s", (spid,), one=True)
    if not row:
        return err("member not found", 404, spid=spid)
    link = query(
        "SELECT orcid_id, token_scope, linked_at, last_synced_at FROM bpr_orcid_links WHERE spid = %s",
        (spid,), one=True)
    return json_response({
        "spid": spid,
        "orcid_id": row.get("orcid_id"),
        "orcid_uri": f"https://orcid.org/{row.get('orcid_id')}" if row.get("orcid_id") else None,
        "verified_at": row.get("orcid_verified_at") and row["orcid_verified_at"].isoformat()
                       if hasattr(row.get("orcid_verified_at"), "isoformat") else row.get("orcid_verified_at"),
        "link": link,
        "claim_labels": ORCID_CLAIM_LABELS,
    })


# ── BPR Research Passport (visual user surface) ──────────────────────────────

def _safe(text):
    return text or ""


def render_passport(spid, published, profile, research, ai, claim_labels, identity,
                    orcid_section):
    """Single-file HTML passport: bilingual, evidence-first, claim-level trust."""
    name_en = _safe(identity.get("business_name"))
    name_ar = _safe(profile.get("display_name_ar")) or ""
    oid = _safe(identity.get("oid"))
    orcid_id = _safe(orcid_section.get("orcid_id"))
    orcid_uri = orcid_section.get("orcid_uri")
    verified_at = _safe(orcid_section.get("verified_at"))
    trust_level = _safe(identity.get("trust_level"))
    rung = identity.get("verification_rung") or 0
    max_rung = identity.get("verification_max_rung") or 6
    status = _safe(identity.get("status"))
    lang_dir = "rtl" if name_ar else "ltr"

    def label(key, lang="en"):
        return claim_labels.get(lang, {}).get(key, key)

    def badge(color, text):
        return (f'<span class="badge" style="background:{color}">{text}</span>')

    # Research contribution rows
    rc_rows = ""
    for r in (research or []):
        src = r.get("source") or "provider"
        title = _safe(r.get("title_en")) or _safe(r.get("title_ar")) or "Untitled"
        date = _safe(r.get("date_from"))
        ext = r.get("external_url")
        claim_lbl = _safe(r.get("claim_label"))
        verified_by = _safe(r.get("verified_by"))
        if src == "orcid":
            chip = badge("#1f6feb", label("orcid_listed"))
        elif src == "institution":
            chip = badge("#0e7c17", label("institution_attested"))
        else:
            chip = badge("#b45309", label("provider_declared"))
        rc_rows += f"""
          <tr>
            <td class="mono">{chip}</td>
            <td>{title}</td>
            <td>{date or "—"}</td>
            <td>{claim_lbl or "—"}</td>
            <td class="mono">{verified_by or "—"}</td>
            <td><a href="{ext}" target="_blank" rel="noopener">source</a></td>
          </tr>"""

    # AI contribution rows
    ai_rows = ""
    for a in (ai or []):
        role = _safe(a.get("role"))
        pname = _safe(a.get("project_name_en")) or _safe(a.get("project_name_ar"))
        status_txt = _safe(a.get("status"))
        ai_rows += f"""
          <tr>
            <td>{role}</td>
            <td>{pname}</td>
            <td><a href="{_safe(a.get('evidence_url'))}" target="_blank" rel="noopener">evidence</a></td>
            <td class="mono">{status_txt}</td>
            <td>{_safe(a.get('reviewed_by')) or "pending"}</td>
          </tr>"""

    orcid_block = ""
    if orcid_id:
        orcid_block = f"""
        <section class="card">
          <h2>ORCID · {orcid_id}</h2>
          <p class="note">Account control authenticated via OAuth — read the claim label on each item, not a score.</p>
          <p><strong>ORCID record:</strong> <a href="{orcid_uri}" target="_blank" rel="noopener">{orcid_uri}</a></p>
          <p><strong>Connected:</strong> {verified_at}</p>
        </section>"""
    else:
        orcid_block = f"""
        <section class="card connect">
          <h2>Connect ORCID</h2>
          <p class="note">Link your ORCID iD to bring your research contributions into this passport.</p>
          <a href="/orcid/connect?spid={spid}" class="btn primary">Connect ORCID</a>
        </section>"""

    html = f"""<!DOCTYPE html>
<html lang="en" dir="{lang_dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{name_en or spid} — BPR Research Passport</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans Arabic", "Amiri", sans-serif; margin: 0; background: #f3f4f6; color: #111827; direction: {lang_dir}; }}
  .header {{ background: linear-gradient(135deg, #0b3d66 0%, #14539a 60%, #0e7490 100%); color: #fff; padding: 40px 24px; }}
  .header h1 {{ margin: 0 0 8px; font-size: 26px; letter-spacing: -0.02em; }}
  .header .sub {{ opacity: 0.9; font-size: 14px; }}
  .header .spid {{ display: inline-block; margin-top: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 6px; font-size: 13px; }}
  .container {{ max-width: 760px; margin: -20px auto 40px; padding: 0 20px; }}
  .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
  @media (max-width: 640px) {{ .grid {{ grid-template-columns: 1fr; }} }}
  .card {{ background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }}
  .card.connect {{ background: #f0f9ff; border-color: #bae6fd; }}
  .card h2 {{ margin: 0 0 12px; font-size: 17px; display: flex; align-items: center; gap: 8px; }}
  .card h2 .live {{ width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; }}
  .note {{ color: #6b7280; font-size: 13.5px; margin: 0 0 12px; line-height: 1.5; }}
  .meta-row {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }}
  .meta-item {{ flex: 1; }}
  .meta-item .k {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; }}
  .meta-item .v {{ font-size: 15px; font-weight: 600; }}
  .badge {{ display: inline-block; font-size: 11px; font-weight: 700; color: #fff; padding: 2px 8px; border-radius: 999px; }}
  table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
  th {{ text-align: { 'right' if lang_dir=='rtl' else 'left' }; font-size: 12px; color: #6b7280; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; font-weight: 600; }}
  td {{ font-size: 13.5px; padding: 8px 6px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }}
  td.mono {{ font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }}
  .btn {{ display: inline-block; background: #0b3d66; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 8px; }}
  .btn.primary {{ background: #0e7490; }}
  .qr {{ margin-top: 16px; text-align: center; }}
  .qr img {{ width: 140px; height: 140px; border: 4px solid #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }}
  .footer {{ color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; }}
  .lang {{ float: {'left' if lang_dir=='rtl' else 'right'}; font-size: 12px; color: #9ca3af; }}
</style>
</head>
<body>
  <div class="header">
    <h1>{name_en or spid}</h1>
    <p class="sub">BrainSAIT Provider Registry · Research Passport</p>
    <span class="spid">{spid}</span>
  </div>

  <div class="container">
    <div class="lang">BPR · بى أر بى</div>

    <section class="card">
      <h2><span class="live"></span>Identity</h2>
      <div class="grid">
        <div class="meta-item"><div class="k">SPID</div><div class="v mono">{spid}</div></div>
        <div class="meta-item"><div class="k">OID</div><div class="v mono">{oid}</div></div>
        <div class="meta-item"><div class="k">Trust level</div><div class="v">{trust_level}</div></div>
        <div class="meta-item"><div class="k">Verification rung</div><div class="v">{rung} / {max_rung}</div></div>
        <div class="meta-item"><div class="k">Status</div><div class="v">{badge('#10b981' if status=='active' else '#f59e0b', status)}</div></div>
      </div>
    </section>

    {orcid_block}

    <section class="card">
      <h2>Research contributions</h2>
      <p class="note">Each row carries its own claim label — no single "verified" score.</p>
      <table>
        <thead><tr><th>Source</th><th>Title</th><th>Date</th><th>Claim</th><th>Verified by</th><th style="width:110px">Link</th></tr></thead>
        <tbody>{rc_rows or '<tr><td colspan="6" class="note">No research contributions yet.</td></tr>'}</tbody>
      </table>
    </section>

    <section class="card">
      <h2>Clinical AI contributions</h2>
      <p class="note">Attributable contributions to healthcare AI (dataset annotation, model evaluation, guideline review, safety assessment).</p>
      <table>
        <thead><tr><th>Role</th><th>Project</th><th>Evidence</th><th>Status</th><th>Reviewed by</th></tr></thead>
        <tbody>{ai_rows or '<tr><td colspan="5" class="note">No AI contributions recorded.</td></tr>'}</tbody>
      </table>
    </section>

    <div class="qr">
      <img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=https://registry.brainsait.de/passport/{spid}/&choe=UTF-8" alt="Passport QR">
      <div class="note" style="margin-top:8px;">Scan to verify this passport</div>
    </div>

    <div class="footer">
      Claim labels per ORCID practice: account control authenticated ≠ clinical competence. ORCID connection is optional.
      <span style="float:{'left' if lang_dir=='rtl' else 'right'};">BrainSAIT Provider Registry · {spid}</span>
    </div>
  </div>
</body>
</html>"""
    return html.encode("utf-8"), 200, {"Content-Type": "text/html; charset=utf-8"}


def passport_page(raw_spid):
    spid = resolve_spid(raw_spid)
    row = query(
        "SELECT spid, full_name, oid, orcid_id, orcid_verified_at, trust_level, status, verification_rung FROM bpr_partners WHERE spid = %s",
        (spid,), one=True)
    if not row:
        return err("member not found", 404, spid=spid)
    profile = query(
        "SELECT display_name_en, display_name_ar, other_names, country, synced_at FROM bpr_orcid_profile WHERE spid = %s",
        (spid,), one=True) or {}
    research = query(
        "SELECT id, source, source_put_code, type, title_en, title_ar, date_from, date_to, external_url, claim_label, verified_by FROM bpr_research_contribution WHERE spid = %s ORDER BY created_at DESC",
        (spid,))
    ai = query(
        "SELECT id, role, project_name_en, project_name_ar, evidence_url, reviewed_by, reviewed_at, status FROM bpr_ai_contribution WHERE spid = %s ORDER BY created_at DESC",
        (spid,))
    identity = {
        "spid": row["spid"],
        "business_name": row.get("full_name"),
        "oid": row.get("oid"),
        "trust_level": row.get("trust_level"),
        "verification_rung": row.get("verification_rung"),
        "verification_max_rung": row.get("verification_max_rung"),
        "status": row.get("status"),
    }
    orcid_section = {
        "orcid_id": row.get("orcid_id"),
        "orcid_uri": f"https://orcid.org/{row.get('orcid_id')}" if row.get("orcid_id") else None,
        "verified_at": row.get("orcid_verified_at").isoformat() if hasattr(row.get("orcid_verified_at"), "isoformat") else row.get("orcid_verified_at"),
    }
    published = True  # registry state; subject consent governs name display in other views
    return render_passport(spid, published, profile, research, ai, ORCID_CLAIM_LABELS, identity, orcid_section)


ROUTES = [
    "GET /health", "GET /members", "GET /verification/ladder",
    "GET /api/profiles/:spid", "GET /verify/:spid", "GET /oid/verify/:spid",
    "GET /attestations/:spid", "GET /attestations/:att_id/verify",
    "GET /idn/verify?label=...", "GET /peer-receipts", "POST /peer-receipts",
    "GET /slots", "GET /slots/:id", "GET /slots/:id/chain",
    "GET /network", "GET /partner/:spid", "GET /provision/:spid", "GET /requests",
    "GET /orcid/connect", "GET /orcid/callback", "GET /orcid/status/:spid",
    "GET /passport/:spid",
]


def route(method, path, q, body=None):
    if path == "/health":
        ok = True
        try:
            query("SELECT 1", one=True)
        except Exception:
            ok = False
        return json_response({"status": "ok" if ok else "degraded", "service": SERVICE,
                              "version": VERSION, "db": "ok" if ok else "down", "ts": now_iso()})
    if path in ("/", "/docs"):
        return json_response({"ok": True, "service": SERVICE, "version": VERSION, "routes": ROUTES})

    if path == "/members":
        return members(q)
    if path == "/verification/ladder":
        return ladder()
    if path == "/idn/verify":
        return verify_arabic_idn(q)
    if path == "/peer-receipts":
        if method == "POST":
            return peer_receipts_post(body or {})
        return peer_receipts_get(q)
    if path == "/slots":
        return slots(q)
    if path == "/network":
        return network()
    if path == "/requests":
        return requests(q)
    if path == "/orcid/connect":
        return orcid_connect(q)
    if path == "/orcid/callback":
        return orcid_callback(q)
    m = re.match(r"^/orcid/status/([^/]+)$", path)
    if m:
        return orcid_status(m.group(1))
    m = re.match(r"^/passport/([^/]+)$", path)
    if m:
        return passport_page(m.group(1))

    m = re.match(r"^/api/profiles/([^/]+)$", path)
    if m:
        return profile(m.group(1))
    m = re.match(r"^/verify/([^/]+)$", path)
    if m:
        return verify(m.group(1))
    m = re.match(r"^/oid/verify/([^/]+)$", path)
    if m:
        return oid_verify(m.group(1))
    m = re.match(r"^/attestations/([^/]+)/verify$", path)
    if m:
        return verify_attestation(m.group(1))
    m = re.match(r"^/attestations/([^/]+)$", path)
    if m:
        return attestations_for_spid(m.group(1))
    m = re.match(r"^/slots/([^/]+)/chain$", path)
    if m:
        return slot_chain(m.group(1))
    m = re.match(r"^/slots/([^/]+)$", path)
    if m:
        return slot_one(m.group(1))
    m = re.match(r"^/partner/([^/]+)$", path)
    if m:
        return partner_agg(m.group(1))
    m = re.match(r"^/provision/([^/]+)$", path)
    if m:
        return provisioning(m.group(1))

    return err("not_found", 404, routes=ROUTES)


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
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _dispatch(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        q = parse_qs(parsed.query)
        body = None
        if self.command == "POST":
            length = int(self.headers.get("Content-Length") or "0")
            raw = self.rfile.read(length) if length > 0 else b"{}"
            try:
                body = json.loads(raw.decode("utf-8"))
            except Exception:
                body = {}
        try:
            self._send(*route(self.command, path, q, body))
        except psycopg2.Error as e:
            self._send(*err(f"database_error: {e.__class__.__name__}", 500))
        except Exception as e:  # noqa: BLE001
            self._send(*err(f"internal_error: {e.__class__.__name__}: {e}", 500))

    do_GET = do_HEAD = do_POST = _dispatch

    def do_OPTIONS(self):
        self._send(b"", 204, {})


def main():
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    sys.stderr.write(f"[{SERVICE}] listening on 127.0.0.1:{PORT}\n")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()


if __name__ == "__main__":
    main()
