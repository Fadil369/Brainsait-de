# BRAINSAIT OS — Ecosystem Map (live)

> A verified map of the BrainSAIT operating system: every site, service, tool and
> the real connections between them. Updated 2026-08-11 · verified end-to-end.

---

## 1. System Overview

```
                    ┌─────────────────────────────────────────────┐
                    │           HETZNER VPS (this box)            │
                    │   /opt/brainsait · /home/fadil369/.hermes    │
                    └───────────────┬─────────────────────────────┘
                                    │
        ┌───────────────┬───────────┼───────────────┬───────────────┐
        ▼               ▼           ▼               ▼               ▼
   Integration Hub   Hermes       n8n            Forge          MASTERLINC
   (hub.js :9600)  (hermes :9119) (20 wf)     (forge :9620)   (orchestrator :9800)
        │               │           │               │               │
        ▼               ▼           ▼               ▼               ▼
    Airtable       Telegram     Shopify        Cloudflare      GitHub
    (BOS base)   (bots/widgets) (124 prods)  (146 workers)   (repos/actions)
        │               │           │               │               │
        ▼               ▼           ▼               ▼               ▼
   BOS control       Resend       Store SPA      Worker AI +     Canonva /
   plane          (email)     (fadil369.github.io)  Gateway +    covers
                                 AutoRAG + Search
```

---

## 2. Sites & Portals

### 2.1 Public web
| Domain | Role | Backend |
|---|---|---|
| `brainsait.de` | Corporate apex + BOS dashboard | static `/var/www/brainsait-apex` (nginx) |
| `portal.brainsait.de` | User portal — accounts, profiles, sessions | Python uvicorn `:9610` |
| `store.brainsait.de` | Shopify storefront (124 products, PayPal) | Shopify |
| `fadil369.github.io` | BrainSAIT Store SPA (Learn·Build·Solutions, AR/EN) | Vite → GitHub Pages |
| `market.brainsait.de` | Marketplace | Python `:9400` |
| `learn.brainsait.de` | Learning site | static `/var/www/learn.brainsait.de` |
| `academy.brainsait.de` | Academy | Python `:9750` |
| `forge.brainsait.de` | **Launch Forge** incubation engine | Python `:9620` (tunnel→nginx) |
| `masterlinc.de`, `masterlinc.brainsait.de` | MASTERLINC orchestrator | Python `:9800` |
| `beos.masterlinc.de` | BEOS dashboard | Python `:9550` |
| `notebooks.brainsait.de` | Knowledge capsules | Python `:9500` |
| `hermes.brainsait.de` | Hermes gateway | Hermes `:9119` |
| `hub.brainsait.de` | Integration hub / webhooks | Node `:9600` |
| `nphies.de`, `nphies.brainsait.de` | NPHIES claim service | Python `:9090` |
| `abeer / alhamra / edu / sibaiti / naracafe.de / momfood / wathq` | Client solutions | nginx + apps |

### 2.2 Shopify
- Store: `store.brainsait.de` (myshopify `f3rbxp-n1`)
- **124 products**, prices 5–24,999 SAR
- **33 customer accounts** with role tags: `brainSAIT-member`, `verified`, `customer`, `student`, `employee`, `developer`, `partner`
- Admin API scope: read/write products, orders, customers, inventory, fulfillment, themes, script tags
- Incubation Program: single "Edition: Standard" variant @ **9,630 SAR** (offer; standard 14,900)

### 2.3 Storefront SPA (fadil369.github.io)
- Repo: `Fadil369/fadil369.github.io` (deployed via GitHub Pages, `npm run deploy`)
- Stages: Learn (37 titles) · Build (Incubation) · Solutions (28 demos)
- Analytics: **GTM-TP24GSTF** · **GA4 G-75ZCDM8R74** · **Meta Pixel 850048551165707**

---

## 3. Integration Hub (`hub.js`, port 9600)
Central router + event bus + webhook host.

### 3.1 Webhooks / API endpoints (verified)
| Endpoint | Purpose |
|---|---|
| `POST /telegram/webhook` | Hermes bot (HMAC `X-Telegram-Bot-Api-Secret-Token`) |
| `POST /telegram/relay` | Bot relay (multi-bot) |
| `POST /telegram/forge` | **Launch Forge bot** — command bridge |
| `POST /telegram/send` | Outbound message |
| `POST /automation/record` | n8n runs → Airtable Automations |
| `POST /forge/publish` | Forge events → n8n orchestrator |
| `POST /newsletter/*` | Resend newsletter subscribe/send/unsubscribe |
| `POST /profile/*` | Profile upsert/document/status |
| `POST /event/purchase-fulfilled` | Purchase events |
| `GET /session/me` | Session lookup |
| `GET /catalog`, `/profiles`, `/profile/list` | Catalog + profiles API |

### 3.2 Verified connection: Hub → Airtable
`POST /automation/record` writes into Airtable `Automations` table. **Tested ✓**

---

## 4. Launch Forge (`forge.brainsait.de`, port 9620)
BEOS incubation engine — 5-day idea→launch, 14-day account cycle.

### 4.1 Components
```
forge/
├── core/forge_core.py      state machine, ForgeScore, RBAC, idempotency, promos
├── bot/forge_gateway.py    HTTP API + Mini-App UI server (9620)
├── ui/                     Mini-App-ready dashboard (auto-login via Telegram initData)
├── scripts/setup-forge-bot.py   one-command bot wiring
├── workflows/forge-orchestration.json  n8n import template
├── policies/ · schemas/ · templates/
```

### 4.2 Endpoints (verified)
| Endpoint | Purpose |
|---|---|
| `POST /forge/register` | Manual founder register |
| `POST /forge/login` | Telegram Login Widget (HMAC) — **tested ✓** |
| `POST /forge/init` | Telegram Mini App initData — **tested ✓** |
| `POST /forge/command` | startup/status/day/standup/blocker/launch/coach |
| `POST /forge/score` | Deterministic ForgeScore (7 dims, 100 pts) |
| `POST /forge/event` | Audit trail → Airtable Forge Events — **tested ✓** |
| `POST /forge/account` | 14-day lifecycle status |
| `POST /forge/graduate` | Graduation + certificate (key-gated) |
| `POST /promo/validate` · `/promo/price` · `/promo/activate` · `/promo/generate` | Promo codes |

### 4.3 Airtable control plane (Forge tables)
`Founders · Startups · Forge Sessions · Standups · Blockers · Deployments · Forge Events · Promo Codes`

### 4.4 Telegram
- Bot: **@brainsait_forge_bot** (BrainSAIT_Forge) — token in `FORGE_BOT_TOKEN`
- Webhook: `https://hub.brainsait.de/telegram/forge` (HMAC) — **tested ✓**
- Menu button: **🚀 Launch Forge** → Mini App `https://forge.brainsait.de` — **set ✓**
- Commands: `/start /startup /day /status /standup /blocker /score /coach /promo /launch /app /help`
- AI coaching via Cloudflare Worker AI (see §7)

---

## 5. Automation

### 5.1 n8n (podman container, `127.0.0.1:5678`)
**20 workflows, 12 active:**
- BrainSAIT — Ecosystem Health Digest
- BrainSAIT — New Order Fanout (PayPal + Shopify + Telegram)
- Shopify Orders → License Issuance → Delivery
- BrainSAIT — Claim Webhook (NPHIES Eligibility Alert)
- BrainSAIT — Weekly Newsletter Digest
- BrainSAIT Commerce — Catalog Backbone
- BrainSAIT Commerce — Health & Inventory Monitor
- BrainSAIT Commerce — Drive to R2 Asset Runway
- BrainSAIT Commerce — Asset Manifest Reconciliation
- BrainSAIT — Launch Campaign Lead Capture
- BrainSAIT — DeepSeek API Chat (MCP Tools)
- BrainSAIT — DeepSeek AI Chat (MCP Tools)

### 5.2 Cron (this box)
| Schedule | Job |
|---|---|
| `30 3 * * *` | KB backfill (`kb.py`) |
| `*/5 * * * *` | n8n executions → Airtable Automations |
| `*/5 * * * *` | Shopify fulfillment poll |
| `*/5 * * * *` | `/opt/brainsait/scripts/health-check.sh` |
| `0 */6 * * *` | Naracafe DB backup |

### 5.3 Hermes
- Gateway `:9119` + `:8644` — CLI/agent layer, outbound notifications.

---

## 6. Data & Records (Airtable BOS base `appLZE2iVPr417DVN`)
### 6.1 Commerce tables
`Contacts · Orders · Products · Content Pipeline · Design Registry · Assets · Fulfillment Failures · Automations`

### 6.2 Forge tables (control plane)
`Founders · Startups · Forge Sessions · Standups · Blockers · Deployments · Forge Events · Promo Codes`

### 6.3 Verified connections
- Hub → Airtable Automations ✓
- Forge → Airtable Forge Events ✓
- Shopify orders → Airtable Orders (n8n) ✓

---

## 7. Cloudflare (account `d7b995…`)

### 7.1 Workers — 146 deployed
Key mesh:
- **brainsait-ai** — AI assistant + AutoRAG + AI Search gateway (this box's intelligence)
- brainsait-medical-ai, brainsait-orchestrator, brainsait-portal, brainsait-store-delivery, brainsait-nexus, brainsait-product-landing, brainsait-paypal, brainsait-mcp, brainsait-telegram-bot-prod, nphies-gateway, linc-agents, basma-*, hnh-*, masterlinc-portal, fadil369, +120 more

### 7.2 AI Gateway — 7 gateways
`brainsait-ai` (cache TTL 300s, rate-limit 60/min, logs) · oid · brainsait-linc · cagent · openclaw-hetzner · vibesdk-gateway · default

### 7.3 Vectorize (AutoRAG)
`brainsait-kb` (primary, 1024d, cosine) · brainsait-medical · kdp-knowledge-base · basma-partner-index · medical-records-index · tenders-index · brainsait-index

### 7.4 KV
`UNIFIED_SESSIONS · SESSIONS · OID_REGISTRY · brainsait-event-log · brainsait-feature-flags · PARTNER_APPLICATIONS · PORTAL_HEALTH · brainsait-agent-state · sudan-gov-* · momfood-kv · basma-rate-limit · oracle-results`

### 7.5 R2
Drive asset runway, store delivery assets, covers.

### 7.6 Worker AI + AI Search (verified)
- Embeddings: `@cf/baai/bge-m3` (1024d, free tier)
- Chat: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
- Endpoints on `ai-gateway.brainsait.de`: `/v1/assistant` (agentic, tools), `/v1/chat`, `/rag/search`, `/rag/chat`, `/kb/ingest`, `/health`, `/widget.js`
- **Free forever**: Workers AI 10k neurons/day + gateway cache TTL 300s

### 7.7 Verified: Forge → Worker AI
`/coach` routes through `ai-gateway.brainsait.de/v1/assistant` — **tested ✓**

---

## 8. Identity & Accounts
- **Portal** (portal.brainsait.de): customer logins, profiles, sessions (`X-Token`)
- **Shopify**: 33 customer accounts with role tags
- **Telegram**: founder identity via Login Widget / Mini App initData (both HMAC-verified)
- **SSO bridge**: `ecosystem-session.js` (localStorage `brainsait_x_token`) shared across store, portal, academy

---

## 9. Comms & Design
- **Resend**: transactional email + newsletters (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`)
- **Telegram**: hermes bot (main), forge bot (`@brainsait_forge_bot`), login widget, Mini App
- **GitHub**: storefront, brainsait-bos, brainSAIT-oid-system, nphies_gateway, momfood, Canva, offsite backups + Actions/webhooks
- **Canva / design**: 157 cover SVGs in `marketplace/covers/`
- **Analytics**: GTM-TP24GSTF · GA4 G-75ZCDM8R74 · Meta Pixel 850048551165707

---

## 10. Verified End-to-End Flow (incubation example)
```
Founder taps 🚀 Launch Forge (Telegram menu button)
  → Mini App opens at forge.brainsait.de (inside Telegram)
  → /forge/init validates initData (HMAC) → founder auto-registered
  → /startup <name> → Airtable Startups row (DAY0)
  → /day … /standup /blocker → Airtable + Forge Events audit
  → /coach → ai-gateway.brainsait.de (Worker AI + gateway + AutoRAG)
  → promo code → /promo/price → discounted price on storefront
  → /launch → 2-step confirm (RBAC) → deployment → graduation (14-day cycle)
  → every event mirrored to hub /forge/publish → n8n orchestrator
```

---

## 11. Key Credentials (never commit)
Stored in `~/.hermes/.env` (backed up, chmod 600):
`CLOUDFLARE_API_TOKEN · SHOPIFY_ADMIN_TOKEN · AIRTABLE_API_KEY · RESEND_API_KEY · TELEGRAM_BOT_TOKEN · FORGE_BOT_TOKEN · BRAINSAIT_API_KEY · HUB_API_KEY · TELEGRAM_LOGIN_CLIENT_ID/SECRET · HETZNER_*`

> **Security rule:** tokens live in n8n Credentials / env files — never in Git, Airtable, or code.
