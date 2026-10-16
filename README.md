# bpr-stack — BrainSAIT Provider Registry service stack

Local-only HTTP services behind the BPR surface. **No Cloudflare, no pricing
exposed.** Every port is published on `127.0.0.1` only and reached exclusively
by host nginx `proxy_pass` rules — the containers refuse external hosts by
construction.

This directory is the **canonical, human-authored source**. See
[Deployment topology](#deployment-topology) for how it reaches production.

---

## Services

| Service | Port (loopback) | Purpose | DB env prefix |
|---|---|---|---|
| `bpr-hiring` | `127.0.0.1:9640` | Provider hiring / recruitment pipeline | `BPR_HIRING_*` |
| `bpr-partner` | `127.0.0.1:9641` | Partner onboarding + partner records | `BPR_PARTNER_*` |
| `bpr-registry-local` | `127.0.0.1:9642` | Local registry mirror served by `brainsait.de/bpr/` | `BPR_REGISTRY_*` |
| `bpr-linkedin` | `127.0.0.1:9643` | LinkedIn identity corroboration layer | `BPR_LINKEDIN_*` |

All four share one image, `brainsait/bpr-python:1.0`, built from `Dockerfile`
(`python:3.12-slim-bookworm` + `psycopg2-binary`). Each container runs exactly
one script: `python3 /app/services/bpr-<name>.py`.

### Health

Each service exposes `GET /health` on its own port, and each container has a
compose `healthcheck` polling it every 10s (timeout 5s, 5 retries, 5s start
period). Verify:

```bash
for p in 9640 9641 9642 9643; do
  printf '%s -> %s\n' "$p" "$(curl -fsS "http://127.0.0.1:$p/health" || echo FAIL)"
done
docker ps --filter name=bpr- --format '{{.Names}}\t{{.Status}}'
```

---

## Deployment topology

**Production runs from Coolify, not from this directory.**

```
~/brainsait/bpr-stack/            ← canonical source (this repo)
        │  coolify.resourceName=bpr-stack
        ▼
Coolify project "brainsait-unified" / env "production"
  resource UUID: iqjjmcak1uqxkwpfy2wiity3
        │
        ▼
/data/coolify/services/iqjjmcak1uqxkwpfy2wiity3/docker-compose.yml   (generated)
        │  docker compose up
        ▼
containers  bpr-<name>-iqjjmcak1uqxkwpfy2wiity3   on 127.0.0.1:9640-9643
        │
        ▼
nginx  /etc/nginx/conf.d/*.conf   proxy_pass http://127.0.0.1:964x
```

The Coolify compose file is a **mechanical superset** of `docker-compose.yml`
here. Verified identical in substance; the only differences are Coolify's own
additions:

- `container_name` suffixed with the resource UUID
- injected `COOLIFY_*` and `SERVICE_NAME_*` env vars
- `coolify.*` labels
- a second network (`iqjjmcak1uqxkwpfy2wiity3`) alongside `bpr`
- `.env` appended to each `env_file`
- YAML reflowed to block style

Nothing service-affecting differs. `tools/check-drift.sh` re-verifies this.

### Deploying a change

Editing a file here does **not** affect production by itself. Either:

- **Preferred — through Coolify:** push the change, then redeploy the
  `bpr-stack` resource in the Coolify UI so the image is rebuilt and the
  containers are recreated.
- **Local compose run** (for a standalone copy, not production):
  ```bash
  docker build -t brainsait/bpr-python:1.0 .
  docker compose up -d
  ```
  Note the compose file here pins `container_name: bpr-<name>`, which will
  collide with the Coolify-managed containers. Use a distinct project name
  (`docker compose -p bpr-local ...`) if you ever run both.

---

## nginx routing

Reverse proxies live in `/etc/nginx/conf.d/` (not `sites-enabled/`):

| Config | Target |
|---|---|
| `brainsait.de.conf` (`:52`) | `127.0.0.1:9642/` — registry shell |
| `brainsait.de.conf` (`:63`) | `127.0.0.1:9643/linkedin/` — LinkedIn OAuth redirect target |
| `brainsait.de.conf` (`:115`) | `127.0.0.1:9640/` — hiring |
| `brainsait.de.conf` (`:140`, `:149`) | `127.0.0.1:9641/` — partner |
| `bpr-hiring.brainsait.de.conf` | `127.0.0.1:9640` — hiring surface |
| `linkedin-lark-automation.brainsait.de.conf` | `127.0.0.1:9643` — LinkedIn identity layer |

---

## Configuration & secrets

Secrets are **not** in this repo. `docker-compose.yml` points `env_file:` at
mode-600 files that live outside it:

```
/home/fadil369/.hermes/secrets/bpr-hiring.env
/home/fadil369/.hermes/secrets/bpr-partner.env
/home/fadil369/.hermes/secrets/bpr-registry-local.env
/home/fadil369/.hermes/secrets/bpr-linkedin.env
```

Each service reads its own `<PREFIX>_*` variables. Non-secret values (DB host,
n8n URL, hub URL) are set inline in `docker-compose.yml` under `environment:`.

Services reach infrastructure over the external `braincore` bridge network, so
`braincore-postgres` and `brainsait-n8n` resolve by name. The hub is reached
via the docker bridge gateway `http://172.18.0.1:9601`.

> A prior compromise on this host (see `~/AGENTS.md`, C2 containment) means
> every secret that has ever lived on this box should be treated as exposed.
> Rotate before relying on these for anything new.

---

## Migrations

`migrations/*.sql`, applied in order to the BPR database. They are deliberately
excluded from the Docker build (`.dockerignore`) — schema is applied to the
database, not baked into the image.

Current head: **`0009_linkedin_identity.sql`**, which creates
`bpr_linkedin` (one row per provider, FK → `bpr_partners.spid`, `ON DELETE
CASCADE`) and `bpr_linkedin_states` (PKCE OAuth state, 15-minute expiry).
`bpr-linkedin` stores OAuth access/refresh tokens in this table.

Apply with the host-postgres port mapping (`127.0.0.1:5433` → container 5432):

```bash
PGPASSWORD=... psql -h 127.0.0.1 -p 5433 -U <user> -d <db> \
  -f migrations/0009_linkedin_identity.sql
```

### LinkedIn is identity corroboration only

`0009` exists to **corroborate** a provider identity that is already
established through the registry. LinkedIn is **not** a licensure source and
must never be presented as one — any surface rendering LinkedIn data requires
the SCFHS disclaimer. Do not add features that imply LinkedIn confers
professional standing.

---

## Relationship to `~/brainsait/ops/`

`~/brainsait/ops/` is a separate git repo (`branch: master`, **no remote**)
holding operational tooling, evidence, and per-service directories:

```
ops/bpr-hiring/  ops/bpr-partner/  ops/bpr-registry-local/  ops/bpr-linkedin/
```

Each contains a `service.py` that is a **near-duplicate** of the corresponding
`services/bpr-*.py` here. Verified relationship:

| Pair | Divergence |
|---|---|
| `bpr-linkedin.py` ↔ `ops/bpr-linkedin/service.py` | **byte-identical** |
| `bpr-registry-local.py` ↔ `ops/bpr-registry-local/service.py` | one line — `main()` bind address |
| `bpr-partner.py` ↔ `ops/bpr-partner/service.py` | one line — `main()` bind address |
| `bpr-hiring.py` ↔ `ops/bpr-hiring/service.py` | one line — `main()` bind address |

### ⚠ The bind-address difference is intentional — do not "fix" it

| Context | Bind address | Why |
|---|---|---|
| **This stack** (containers) | `0.0.0.0` | A process inside a container must listen on all interfaces for Docker's host→container port publishing to reach it. |
| **`ops/` copies** (native) | `127.0.0.1` | Run directly on the host, so loopback-only is the correct, tighter posture. |

Binding the container copies to `127.0.0.1` would make every port mapping
silently dead. Aligning the `ops/` copies to `0.0.0.0` would needlessly expose
them. **These are two deployment modes, not drift.**

This repo is the one to edit. Treat `ops/bpr-*/service.py` as historical
copies unless deliberately re-synced.

---

## Drift detection

`tools/check-drift.sh` is read-only and answers four questions:

1. Does on-disk source match what is running inside each container?
2. Do the `ops/` copies still differ only by the bind address?
3. Does the Coolify compose still match this `docker-compose.yml` in substance?
4. Are all four services healthy?

```bash
~/brainsait/bpr-stack/tools/check-drift.sh
```

Exit `0` = no drift, `1` = drift or a failed health check.

---

## Layout

```
bpr-stack/
├── docker-compose.yml          # canonical 4-service compose
├── Dockerfile                  # python:3.12-slim + psycopg2-binary
├── .dockerignore               # deploy/, migrations/, *.md, .git
├── README.md
├── deploy/                     # (empty) reserved for deploy tooling
├── migrations/
│   └── 0009_linkedin_identity.sql
├── services/
│   ├── bpr-hiring.py
│   ├── bpr-partner.py
│   ├── bpr-registry-local.py
│   └── bpr-linkedin.py
└── tools/
    └── check-drift.sh          # read-only drift + health check
```