# BrainSAIT Health Exchange

The public web platform for **[brainsait.de](https://brainsait.de)** — a Saudi-focused
healthcare operating system and marketplace connecting providers, payers, developers,
and patients. Built with Next.js 14 (App Router).

## Features

- **Marketplace** — healthcare products, AI solutions, cloud integrations, and an
  academy of bilingual (Arabic/English) e-courses.
- **NPHIES-aware workflows** — DRG grouping, claims, eligibility, and prior-auth
  surfaces backed by the BrainSAIT gateway.
- **Payments** — SADAD integration on the web, plus a Telegram storefront
  (`@brainsait_bot`) for e-course enrollment.
- **Bilingual & RTL** — first-class Arabic support.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3001
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local dev server on port 3001 |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Serve the standalone build |
| `npm run lint` | ESLint |

## Configuration

All configuration is via environment variables — **no secrets are committed**.
See [`.env.example`](./.env.example) for the full list. Key groups:

- `NEXT_PUBLIC_*` — public site/gateway URLs (safe to expose to the browser).
- `BRAINSAIT_GATEWAY_URL` / `FHIR_GATEWAY_URL` / `NPHIES_GATEWAY_URL` — backend services.
- `SADAD_*` — payment provider (webhook verification requires `SADAD_WEBHOOK_SECRET`).
- `ADMIN_USER` / `ADMIN_PASSWORD` / `ADMIN_API_TOKEN` — gate the `/admin` surface.

The `/admin` pages and the SADAD verify/reject routes are protected by
[`src/middleware.ts`](./src/middleware.ts) and **fail closed** when their
credentials are not configured.

## Deployment

Runs as a systemd-managed standalone Next.js server behind Caddy (TLS, HSTS, CSP)
on `brainsait.de`. Build with `npm run build`, serve `.next/standalone/server.js`.

## License

See [LICENSE](./LICENSE).
