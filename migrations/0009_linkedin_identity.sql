-- BPR LinkedIn identity layer (0009) — 2026-10-14
-- LinkedIn is an IDENTITY CORROBORATION source for the BPR trust ladder.
-- It is NOT professional licensure (that remains SCFHS). Every surface that
-- renders this data must carry that disclaimer.

CREATE TABLE IF NOT EXISTS bpr_linkedin (
    spid           varchar(50) PRIMARY KEY REFERENCES bpr_partners(spid) ON DELETE CASCADE,
    linkedin_sub   varchar(60) NOT NULL,           -- urn:li:person:<sub> person id
    full_name      text,
    email          varchar(200),
    picture_url    text,
    headline       text,
    locale         varchar(20),
    profile_url    text,
    access_token   text,                           -- short-lived (~60d); revocable at LinkedIn settings
    refresh_token  text,                           -- long-lived (~1y)
    expires_at     timestamptz,
    verified_at    timestamptz NOT NULL DEFAULT now(),
    raw_json       jsonb,
    updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS bpr_linkedin_sub_uidx ON bpr_linkedin(linkedin_sub);
CREATE INDEX IF NOT EXISTS bpr_linkedin_verified_idx ON bpr_linkedin(verified_at DESC);

-- OAuth state (PKCE): short-lived, one row per in-flight authorization.
CREATE TABLE IF NOT EXISTS bpr_linkedin_states (
    state       varchar(64) PRIMARY KEY,
    spid        varchar(50) NOT NULL,
    verifier    varchar(128) NOT NULL,             -- PKCE code_verifier (never rendered)
    return_to   text,                              -- where to land after callback
    created_at  timestamptz NOT NULL DEFAULT now(),
    expires_at  timestamptz NOT NULL DEFAULT now() + interval '15 minutes'
);

CREATE INDEX IF NOT EXISTS bpr_linkedin_states_expiry_idx ON bpr_linkedin_states(expires_at);

-- Per-organisation grouped view of linkedin-verified members (grouping).
CREATE OR REPLACE VIEW bpr_org_linkedin AS
SELECT p.organisation,
       COUNT(*) FILTER (WHERE l.spid IS NOT NULL) AS linkedin_verified,
       COUNT(*)                                        AS members
FROM bpr_partners p
LEFT JOIN bpr_linkedin l ON l.spid = p.spid
GROUP BY p.organisation;
