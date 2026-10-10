# brainsait.de

The published source of [brainsait.de](https://brainsait.de) — the BrainSAIT "Nerve Center".

This repository is the site itself. There is no build step: what is committed here is exactly
what the server serves from `/var/www/brainsait-apex`.

## What is here

| Path | What it is |
|---|---|
| `index.html` | Main hub — ecosystem landing page with a live service pulse |
| `bpr/` | Provider identity workspace (SPID / OID / Arabic label checks) |
| `bpr/designs/` | BPR platform UI design showcase — 24 screens, two directions |
| `credentials/` | Evidence library — public documents with SHA-256 and stated boundaries |
| `governance/`, `knowledge/`, `documents/` | Governance, knowledge products, and public PDFs |
| `dashboard/`, `developers/`, `dev-onboard/`, `academy/`, `value/`, `96/` | Supporting surfaces |
| `assets/` | Shared stylesheets, scripts, translations, images |
| `sitemap.xml`, `robots.txt` | Search-engine directives |

## BPR design showcase

`bpr/designs/` publishes 24 design screens extracted from the original design bundle, kept
**byte-identical** to the artist's export. They live in two version folders because the two
directions reuse the same screen names:

```
bpr/designs/index.html        gallery: filter, search, thumbnails, full-size viewer, v1↔v2 compare
bpr/designs/screen.html       single screen, full size  (?v=v1|v2&f=<file>)
bpr/designs/compare.html      two screens side by side (?p=<1-12>)
bpr/designs/v1/*.dc.html      12 screens — "Saudi healthcare identity you can verify"
bpr/designs/v2/*.dc.html      12 screens — "Every provider, on the record."
bpr/designs/thumbs/           rendered 720×450 previews
```

Each screen keeps its original internal navigation, so links like `Directory.dc.html` resolve
within their own version folder. `Licence.dc.html` and `LicenceAR.dc.html` are linked by the
designs but were never delivered; they are honest stub pages rather than dead links.

**These screens are design explorations, not the live platform.** The live BPR surface is what
`/bpr/` links to.

## Editing and publishing

The live directory is the deployment target:

```bash
rsync -a --delete --exclude='.git' --exclude='.superdesign' --exclude='*.bak*' \
  ./ /var/www/brainsait-apex/
```

Then verify:

```bash
curl -sI https://brainsait.de/ | head -1
curl -sI https://brainsait.de/bpr/designs/ | head -1
```

Bilingual behaviour (Arabic / English) is data-driven: pages carry a `words` dictionary or a
`window.brainsaitTranslations` list of `[en, ar]` pairs, applied by `assets/brainsait-language.js`.
Add a new string by adding it to the dictionary — not by hard-coding markup.

## History note

Before 2026-10-10 this repository held an unrelated Next.js application
("Health Exchange frontend"). That history is preserved on the
`archive/nextjs-frontend` branch; `main` is the live static site.