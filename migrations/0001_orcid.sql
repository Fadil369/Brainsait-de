-- Migration 0001: ORCID researcher identifier integration (local BPR registry)
-- Stores authenticated ORCID connections per provider SPID.
-- ORCID connection proves account control only; never a clinical licence badge.

ALTER TABLE bpr_partners ADD COLUMN IF NOT EXISTS orcid_id VARCHAR(25);
ALTER TABLE bpr_partners ADD COLUMN IF NOT EXISTS orcid_verified_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS bpr_orcid_links (
  id SERIAL PRIMARY KEY,
  spid VARCHAR(50) NOT NULL REFERENCES bpr_partners(spid) ON DELETE CASCADE,
  orcid_id VARCHAR(25) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_scope TEXT,
  token_expires_at TIMESTAMP,
  linked_at TIMESTAMP NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP,
  UNIQUE(spid),
  UNIQUE(orcid_id)
);
CREATE INDEX IF NOT EXISTS idx_bpr_orcid_links_spid ON bpr_orcid_links(spid);
CREATE INDEX IF NOT EXISTS idx_bpr_orcid_links_orcid ON bpr_orcid_links(orcid_id);
CREATE INDEX IF NOT EXISTS idx_bpr_partners_orcid_id ON bpr_partners(orcid_id);

CREATE TABLE IF NOT EXISTS bpr_orcid_profile (
  spid VARCHAR(50) PRIMARY KEY REFERENCES bpr_partners(spid) ON DELETE CASCADE,
  orcid_id VARCHAR(25) NOT NULL,
  orcid_uri TEXT,
  display_name_en TEXT,
  display_name_ar TEXT,
  other_names TEXT,
  country TEXT,
  researcher_urls TEXT,
  consent_granted_at TIMESTAMP,
  synced_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS bpr_research_contribution (
  id VARCHAR(50) PRIMARY KEY,
  spid VARCHAR(50) NOT NULL REFERENCES bpr_partners(spid) ON DELETE CASCADE,
  source TEXT NOT NULL,
  source_put_code TEXT,
  type TEXT NOT NULL,
  title_en TEXT,
  title_ar TEXT,
  date_from TEXT,
  date_to TEXT,
  external_url TEXT,
  claim_label TEXT NOT NULL,
  verified_by TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bpr_ai_contribution (
  id VARCHAR(50) PRIMARY KEY,
  spid VARCHAR(50) NOT NULL REFERENCES bpr_partners(spid) ON DELETE CASCADE,
  role TEXT NOT NULL,
  project_name_en TEXT,
  project_name_ar TEXT,
  evidence_url TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
