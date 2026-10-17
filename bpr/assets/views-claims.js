// views-claims.js — screens 7 to 11 (task 12).
//
//   /bpr/claim/        the 4-step claim wizard        (client-side, writes nothing)
//   /bpr/register/     facility registration preview  (shows the arc, mints nothing)
//   /bpr/desk/         slot request queue            GET /requests — operator-only
//   /bpr/case/C-0412/  case file                     (component, fixture-backed)
//   /bpr/peers/        federation                    (component, fixture-backed)
//
// Three of these five screens are about something this site may NOT do, and the
// screen has to say so out loud rather than look capable and be empty:
//
//   claim    assembles a claim and hands it to nobody. Filing is an operator action.
//   register shows the arc a class would fall under. Minting an OID is a registry write.
//   desk     reads an operator-only queue and reports the refusal it actually got.
//
// The remaining two have no public endpoint at all — the registry serves no case
// route and no federation route — so they ship with fixtures behind a notice that
// says they are fixtures. A layout with invented data that reads as real data is
// the failure this whole site is built to avoid.

import { getJSON, stateChip } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import {
  registryUrl, banners, byId, chip, fieldList, link, list,
  nameOrConsent, notice, section, verificationChip,
} from './ui.js';

const ROOT = 'bpr-root';

const DEFAULT_SPID = 'SA-PHY-000001';

// ---------------------------------------------------------------------------
// Shared vocabulary
// ---------------------------------------------------------------------------

function token(raw, lang, prefix = '') {
  const label = t(`${prefix}${raw}`, lang);
  if (label === null) return raw === null || raw === undefined ? '' : String(raw);
  return el('span', null, label, ' ', el('code', { class: 'token' }, raw));
}

function plainOr(value, lang) {
  if (value === null || value === undefined || value === '') return t('common.not_stated', lang);
  return String(value);
}

// ---------------------------------------------------------------------------
// Screen 7 — the claim wizard
// ---------------------------------------------------------------------------

// The evidence list is fixed and known, so it is a closed set here — unlike the
// provisioning steps, which are not. Each entry carries the key it is expected to
// move toward, which is shown so the reader knows the registry, not this page,
// decides what an item is worth.
export const EVIDENCE = [
  { id: 'licence', key: 'claim.evidence.licence' },
  { id: 'national_id', key: 'claim.evidence.national_id' },
  { id: 'facility_letter', key: 'claim.evidence.facility_letter' },
];

const WIZARD_STEPS = ['claim.step.1', 'claim.step.2', 'claim.step.3', 'claim.step.4'];

function stepRail(current, lang) {
  return el('ol', { class: 'steps', id: 'claim-rail' },
    ...WIZARD_STEPS.map((key, index) => el('li', {
      class: 'step',
      'data-state': index === current ? 'current' : (index < current ? 'done' : 'todo'),
    }, `${index + 1}. ${t(key, lang)}`)));
}

function panel(id, index, ...children) {
  return el('div', { class: 'wizard-panel', id, 'data-index': index, hidden: index !== 0 },
    ...children);
}

function renderClaim(data, { lang }) {
  const { verify } = data;
  const record = verify.state === 'STALE' ? null : verify.data;

  const form = el('form', { class: 'card verify-form', id: 'claim-form' },
    el('p', null,
      el('label', { for: 'claim-spid' }, t('claim.input_label', lang)), ' ',
      el('input', {
        id: 'claim-spid', name: 'spid', type: 'text', autocomplete: 'off',
        placeholder: t('verify.input_placeholder', lang),
      })),
    el('p', null, el('button', { id: 'claim-find', type: 'submit' }, t('claim.find_cta', lang))),
  );

  return [
    ...banners(verify),
    el('h1', null, t('registry.claim', lang)),
    el('p', { class: 'lede' }, t('claim.lede', lang)),
    stepRail(0, lang),

    panel('claim-panel-1', 0,
      el('form', { class: 'card verify-form', id: 'claim-find-form' },
        el('p', null,
          el('label', { for: 'claim-spid-1' }, t('claim.input_label', lang)), ' ',
          el('input', {
            id: 'claim-spid-1', name: 'spid', type: 'text', autocomplete: 'off',
            placeholder: t('verify.input_placeholder', lang),
          })),
        el('p', null, el('button', { type: 'submit' }, t('claim.find_cta', lang))),
      ),
      record
        ? el('div', { id: 'claim-found' },
            el('p', { class: 'gate-title' }, nameOrConsent(record, lang)),
            el('p', null, verificationChip(record, lang)),
            el('p', { class: 'muted' }, el('code', null, record.spid)))
        : null,
    ),

    panel('claim-panel-2', 1,
      el('h2', { class: 'card-title' }, t('claim.evidence_title', lang)),
      el('p', { class: 'muted small' }, t('claim.evidence_hint', lang)),
      el('div', { id: 'claim-evidence' },
        ...EVIDENCE.map((item) => el('button', {
          class: 'choice', type: 'button', 'data-evidence': item.id,
          'aria-pressed': 'false',
        }, t(item.key, lang)))),
      el('p', { class: 'muted', id: 'claim-evidence-count' }, t('claim.evidence_none', lang)),
    ),

    panel('claim-panel-3', 2,
      el('h2', { class: 'card-title' }, t('claim.review_title', lang)),
      el('p', null, t('claim.review_body', lang)),
      el('div', { id: 'claim-review' }),
      el('p', null, el('button', { id: 'claim-file', type: 'button' }, t('claim.file_cta', lang))),
    ),

    panel('claim-panel-4', 3,
      el('div', { class: 'gate' },
        el('p', { class: 'gate-title' }, t('claim.filed_title', lang)),
        el('p', null, t('claim.filed_body', lang)),
      ),
    ),

    // The note sits outside the wizard on purpose: it applies to the whole
    // screen, not to one step of it.
    el('div', { class: 'fixture-note' }, t('claim.no_write_note', lang)),
    form,
  ];
}

// Drives the four panels without touching the network after the initial read.
// Everything here is presentation: state lives in this closure and dies with the
// page, which is exactly what "files nothing" has to mean.
export function wireClaimWizard(target, record, lang) {
  const panels = [0, 1, 2, 3].map((i) => target.querySelector(`#claim-panel-${i + 1}`));
  const rail = target.querySelectorAll('#claim-rail .step');
  const chosen = new Set();
  let at = 0;

  const paint = () => {
    panels.forEach((node, i) => { if (node) node.hidden = i !== at; });
    rail.forEach((node, i) => {
      if (!node) return;
      node.setAttribute('data-state', i === at ? 'current' : (i < at ? 'done' : 'todo'));
    });
    target.querySelectorAll('[data-nav]').forEach((node) => {
      node.hidden = Number(node.getAttribute('data-nav')) !== at;
    });
  };

  const count = target.querySelector('#claim-evidence-count');
  for (const button of target.querySelectorAll('[data-evidence]')) {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-evidence');
      if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
      button.setAttribute('aria-pressed', String(chosen.has(id)));
      if (count) {
        count.textContent = chosen.size
          ? t('claim.evidence_selected', lang, { count: chosen.size })
          : t('claim.evidence_none', lang);
      }
    });
  }

  const findForm = target.querySelector('#claim-find-form');
  if (findForm) {
    findForm.addEventListener('submit', (event) => {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();
      if (!record) return;
      at = 1; paint();
    });
  }

  const review = target.querySelector('#claim-review');
  const file = target.querySelector('#claim-file');
  if (file) {
    file.addEventListener('click', () => {
      if (review) {
        const items = EVIDENCE.filter((item) => chosen.has(item.id));
        review.replaceChildren(fieldList([
          ['common.spid', el('code', null, record ? record.spid : '—')],
          ['claim.evidence_title', items.length
            ? list(items.map((i) => el('li', null, t(i.key, lang))))
            : t('claim.evidence_none', lang)],
        ], lang));
      }
      at = 3; paint();
    });
  }

  // Back / next controls are appended here so the step order lives in one place.
  const nav = el('p', { id: 'claim-nav' },
    el('button', { type: 'button', 'data-nav': '0', 'data-move': '-1' }, t('claim.back', lang)),
    ' ',
    el('button', { type: 'button', 'data-nav': '1', 'data-move': '1' }, t('claim.next', lang)),
    ' ',
    el('button', { type: 'button', 'data-nav': '2', 'data-move': '1' }, t('claim.next', lang)),
  );
  const evidence = target.querySelector('#claim-evidence');
  if (evidence && evidence.parentNode) evidence.parentNode.appendChild(nav);
  for (const button of target.querySelectorAll('[data-move]')) {
    button.addEventListener('click', () => {
      const delta = Number(button.getAttribute('data-move'));
      at = Math.min(Math.max(at + delta, 0), 3);
      paint();
    });
  }

  paint();
}

// ---------------------------------------------------------------------------
// Screen 8 — facility registration
// ---------------------------------------------------------------------------

// CLASS_ARCS as the registry allocates it: FAC/CLI/LAB/PHM sit under arc 4, the
// facility arc. Rendered as a mapping the reader can choose from, not as a form
// that pretends to issue.
export const CLASS_ARCS = { FAC: 4, CLI: 4, LAB: 4, PHM: 4 };
const OTHER_ARCS = { ORG: 2, PHY: 3, NUR: 3, PHA: 3 };

function arcPreview(code, lang) {
  const cls = String(code || '').toUpperCase();
  const arc = CLASS_ARCS[cls] ?? OTHER_ARCS[cls] ?? null;
  if (arc === null) return null;
  // Built as a shape, not as an identifier: the sequence number is the registry's
  // to issue, so the leaf is shown as an unfilled placeholder rather than a 1.
  return el('p', { class: 'doc-foot' },
    el('code', { 'data-arc': arc }, `1.3.6.1.4.1.61026.2.${arc}.`),
    el('span', { class: 'muted small' }, ` — ${t('register.no_mint_note', lang)}`));
}

function renderRegister(data, { lang }) {
  const classes = [...Object.keys(CLASS_ARCS), ...Object.keys(OTHER_ARCS)];

  const picker = el('div', { class: 'card', id: 'register-classes' },
    el('h2', { class: 'card-title' }, t('register.type_label', lang)),
    ...classes.map((cls) => el('button', {
      class: 'choice', type: 'button', 'data-class': cls,
      'aria-pressed': String(Object.prototype.hasOwnProperty.call(CLASS_ARCS, cls)),
    },
      t(`register.class.${cls}`, lang), ' ',
      el('code', { class: 'token' }, cls),
    )),
    el('p', { class: 'muted' }, t('register.choose_type', lang)),
  );

  return [
    el('h1', null, t('registry.register', lang)),
    el('p', { class: 'lede' }, t('register.lede', lang)),
    picker,
    section('register.arc_title', lang,
      el('p', null, t('register.arc_body', lang)),
      el('div', { id: 'register-arc' }, arcPreview('FAC', lang)),
    ),
    section('register.form_title', lang,
      fieldList([
        ['register.type_label', t('register.class.FAC', lang)],
        ['register.name_label', t('common.not_stated', lang)],
        ['register.city_label', t('common.not_stated', lang)],
      ], lang),
    ),
    el('div', { class: 'fixture-note' }, t('register.no_mint_note', lang)),
  ];
}

export function wireRegister(target, lang) {
  for (const button of target.querySelectorAll('[data-class]')) {
    button.addEventListener('click', () => {
      const cls = button.getAttribute('data-class');
      for (const other of target.querySelectorAll('[data-class]')) {
        other.setAttribute('aria-pressed', String(other === button));
      }
      const out = target.querySelector('#register-arc');
      if (out) out.replaceChildren(arcPreview(cls, lang) || el('p', { class: 'muted' }, t('common.not_stated', lang)));
    });
  }
}

// ---------------------------------------------------------------------------
// Screen 9 — operator desk
// ---------------------------------------------------------------------------

// The adapter's contract is an object payload, and getJSON() treats a bare array
// as an unexpected payload. /requests is a collection, so a successful read needs
// one narrow fetch that keeps the array — and, more importantly, one that reports
// the status code honestly so this screen can render the refusal it actually got
// rather than a generic "could not load".
async function getRequestQueue(url, { timeoutMs = 6000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    const status = res.status;
    if (status === 401 || status === 403) {
      return { state: 'GATED', status, requests: null, error: 'not_authorised' };
    }
    if (!res.ok) return { state: 'STALE', status, requests: null, error: `http_${status}` };
    let data;
    try { data = await res.json(); } catch { return { state: 'STALE', status, requests: null, error: 'invalid_json' }; }
    const rows = Array.isArray(data) ? data
      : (Array.isArray(data.requests) ? data.requests : null);
    if (!rows) return { state: 'STALE', status, requests: null, error: 'unexpected_payload' };
    return { state: 'OPEN', status, requests: rows, error: null };
  } catch (err) {
    const timedOut = err && err.name === 'AbortError';
    return { state: 'STALE', status: null, requests: null, error: timedOut ? 'timeout' : 'network_error' };
  } finally {
    clearTimeout(timer);
  }
}

// The honest gate. This is the whole screen when the read is refused, and it is
// deliberately not dressed as an empty queue: "you may not look" and "there is
// nothing here" are different facts and a reader must be able to tell them apart.
function deskGate(queue, lang) {
  return el('div', { class: 'gate', id: 'desk-gate' },
    el('p', { class: 'gate-title' }, t('desk.gate_title', lang)),
    el('p', null, t('desk.gate_body', lang)),
    queue.status
      ? el('p', { class: 'muted small' }, t('desk.gate_http', lang, { code: queue.status }))
      : el('p', { class: 'muted small' }, t('desk.gate_http', lang, { code: queue.error || '—' })),
    el('p', { class: 'muted small' }, t('desk.gate_cta', lang)),
  );
}

// A request state reaches this table the same legal way every other state does:
// stateChip decides the word and the tone. An unrecognised state is reported as
// unrecognised rather than being guessed at, because a queue row that guesses is
// a queue row that lies to an operator.
function requestRow(row, lang) {
  const entry = stateChip('request', row.state);
  const stateCell = entry
    ? chip(t(`requeststate.${entry.label}`, lang) ?? entry.label, entry.tone)
    : el('span', { class: 'chip chip-err', 'data-unknown-state': String(row.state ?? '') },
        t('common.state_unknown', lang));

  return el('tr', { 'data-request': String(row.id ?? ''), 'data-state': String(row.state ?? '') },
    el('td', null, el('code', null, row.id || '—')),
    el('td', null, row.slot_id
      ? link(`/bpr/slots/${row.slot_id}/`, row.slot_id)
      : t('common.not_stated', lang)),
    el('td', null, row.requester_spid
      ? link(`/bpr/p/${row.requester_spid}/`, row.requester_spid)
      : t('common.not_stated', lang)),
    el('td', null, stateCell),
    el('td', null, plainOr(row.created_at || row.at, lang)),
  );
}

function renderDesk(data, { lang }) {
  const { queue } = data;

  if (!queue || queue.state !== 'OPEN') return [deskGate(queue || {}, lang)];

  const rows = queue.requests;
  return [
    el('h1', null, t('registry.desk', lang)),
    el('p', { class: 'lede' }, t('desk.lede', lang)),
    el('p', { class: 'muted' }, t('desk.empty', lang).replace(/\.$/, ` (${rows.length})`)),
    el('p', { class: 'muted small' }, t('desk.readonly_note', lang)),
    rows.length
      ? el('table', { id: 'desk-table' },
          el('thead', null, el('tr', null,
            el('th', null, t('desk.col.id', lang)),
            el('th', null, t('desk.col.slot', lang)),
            el('th', null, t('desk.col.requester', lang)),
            el('th', null, t('desk.col.state', lang)),
            el('th', null, t('desk.col.at', lang)),
          )),
          el('tbody', { id: 'desk-body' }, ...rows.map((r) => requestRow(r, lang))),
        )
      : el('p', { class: 'muted' }, t('desk.empty', lang)),
  ];
}

// ---------------------------------------------------------------------------
// Screen 10 — case file (component, fixture-backed)
// ---------------------------------------------------------------------------

// There is no public case endpoint. This is the shape a case takes, shipped so
// the layout can be reviewed, and the notice above the table says so.
export const CASE_FIXTURE = {
  id: 'C-0412',
  kind: 'identity',
  subject: 'SA-PHY-000001',
  ref: 'SA-REF-000412',
  evidence: [],
  status: 'in_review',
  opened: '2026-09-04T00:00:00Z',
  fixture: true,
};

export function caseIdFromPath() {
  const parts = String(globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf('case');
  return at >= 0 && parts[at + 1] ? decodeURIComponent(parts[at + 1]) : '';
}

function renderCase(data, { lang }) {
  const { id, record } = data;
  const c = record && typeof record === 'object' ? record : null;

  if (!id || !c) {
    return [
      el('h1', null, t('registry.case', lang)),
      notice(t('case.not_found', lang, { id: id || '—' })),
    ];
  }

  return [
    el('h1', null, t('registry.case', lang)),
    el('p', { class: 'lede' }, t('case.lede', lang)),
    // The fixture notice is inside the component, above the data, so it cannot
    // be scrolled past before a reader meets a case id that looks real.
    c.fixture ? el('p', { class: 'fixture-note' }, t('case.fixture_note', lang)) : null,
    el('h2', { 'data-case': String(c.id || '') }, c.id || '—'),
    fieldList([
      ['case.id', el('code', null, c.id || '—')],
      ['case.kind', token(c.kind, lang, 'case.kind.')],
      ['case.subject', c.subject ? link(`/bpr/p/${c.subject}/`, c.subject) : t('common.not_stated', lang)],
      ['case.ref', el('code', null, c.ref || t('common.not_stated', lang))],
      ['case.status', token(c.status, lang, 'case.status.')],
      ['case.opened', el('code', null, c.opened || t('common.not_stated', lang))],
    ], lang),
    section('case.evidence', lang,
      Array.isArray(c.evidence) && c.evidence.length
        ? list(c.evidence.map((e) => el('li', null, el('code', null, e))))
        : el('p', { class: 'muted' }, t('case.none', lang))),
    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/p/${c.subject}/`, t('directory.open_dossier', lang))),
        el('li', null, link('/bpr/directory/', t('registry.directory', lang))),
      ])),
  ];
}

// ---------------------------------------------------------------------------
// Screen 11 — federation peers (component, fixture-backed)
// ---------------------------------------------------------------------------

export const PEER_FIXTURE = [
  { id: 'FED-001', registry: 'registry.brainsait.org',
    theirs: { name: 'BrainSAIT', published: true, records: 9, last_sync: '2026-10-01T00:00:00Z' },
    ours: { name: 'BrainSAIT', published: true, records: 9, last_sync: '2026-10-01T00:00:00Z' } },
  { id: 'FED-002', registry: 'registry.example.sa',
    theirs: { name: 'NPHIES KSA', published: false, records: 0, last_sync: null },
    ours: { name: 'NPHIES KSA', published: true, records: 4, last_sync: '2026-09-28T00:00:00Z' } },
  { id: 'FED-003', registry: 'registry.example.ae',
    theirs: { name: 'Gulf Health', published: true, records: 2, last_sync: '2026-09-30T00:00:00Z' },
    ours: { name: 'Gulf Health', published: false, records: 0, last_sync: null } },
  { id: 'FED-004', registry: 'registry.example.eg',
    theirs: { name: 'Nile Care', published: false, records: 0, last_sync: null },
    ours: { name: 'Nile Care', published: false, records: 0, last_sync: null } },
].map((peer) => ({ ...peer, fixture: true, bridge: bridgeState(peer.theirs, peer.ours) }));

// Derived from the two sides rather than declared, so the state cannot drift out
// of step with the facts it describes. An explicit `bridge` on the record still
// wins, because the registry may know something about a bridge that two booleans
// do not capture.
export function bridgeState(theirs, ours) {
  const tPub = Boolean(theirs && theirs.published);
  const oPub = Boolean(ours && ours.published);
  if (tPub && oPub) return 'live';
  if (oPub) return 'waiting_them';
  if (tPub) return 'waiting_us';
  return 'neither';
}

const BRIDGE_TONE = { live: 'ok', waiting_them: 'warn', waiting_us: 'warn', neither: null };

function sideCell(side, lang) {
  if (!side || typeof side !== 'object') return el('span', { class: 'muted' }, t('common.not_stated', lang));
  return el('div', null,
    el('p', null, side.name || t('common.not_stated', lang)),
    el('p', { class: 'muted small' },
      t(side.published ? 'peers.published' : 'peers.not_published', lang),
      side.published ? ' · ' : '',
      side.published ? t('peers.record_count', lang, { count: side.records ?? 0 }) : ''),
    side.last_sync
      ? el('p', { class: 'muted small' }, `${t('peers.last_sync', lang)}: ${side.last_sync}`)
      : null,
  );
}

export function peerCard(peer, lang) {
  const state = peer.bridge || bridgeState(peer.theirs, peer.ours);
  const tone = Object.prototype.hasOwnProperty.call(BRIDGE_TONE, state) ? BRIDGE_TONE[state] : null;
  return el('li', { class: 'peer', 'data-peer': String(peer.id || ''), 'data-bridge': state },
    el('h3', { class: 'card-title' }, peer.registry || peer.id || '—'),
    el('dl', { class: 'doc-field' },
      el('dt', null, t('peers.theirs', lang)),
      el('dd', null, sideCell(peer.theirs, lang)),
      el('dt', null, t('peers.ours', lang)),
      el('dd', null, sideCell(peer.ours, lang)),
      el('dt', null, t('peers.bridge', lang)),
      el('dd', null, chip(t(`peers.state.${state}`, lang) ?? state, tone)),
    ),
  );
}

function renderPeers(data, { lang }) {
  const peers = Array.isArray(data.peers) ? data.peers : [];
  return [
    el('h1', null, t('registry.peers', lang)),
    el('p', { class: 'lede' }, t('peers.lede', lang)),
    peers.some((p) => p && p.fixture) ? el('p', { class: 'fixture-note' }, t('peers.fixture_note', lang)) : null,
    el('p', { class: 'muted' }, t('net.count', lang, { count: peers.length })),
    peers.length
      ? el('ul', { class: 'peer-list', id: 'peer-list' }, ...peers.map((p) => peerCard(p, lang)))
      : el('p', { class: 'muted' }, t('net.no_providers', lang)),
    // Accept / withdraw is an operator action. Rendering it as a button that
    // did nothing would be worse than not rendering it, so the note says what
    // the action is instead.
    el('div', { class: 'fixture-note' }, t('peers.operator_note', lang)),
  ];
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function prepare(viewKey, lang) {
  document.title = pageTitle(viewKey, lang) || document.title;
  applyLang(document.documentElement, lang);
  const target = byId(ROOT);
  applyLang(target, lang);
  return target;
}

function requestedSpid() {
  const asked = new URLSearchParams(String(globalThis.location?.search || ''));
  return (asked.get('spid') || DEFAULT_SPID).trim().toUpperCase();
}

export async function bootClaim() {
  const lang = currentLang();
  const target = prepare('registry.claim', lang);
  const spid = requestedSpid();
  const verify = await getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`));
  const record = verify.state === 'STALE' || !verify.data || verify.data.spid !== spid
    ? null
    : verify.data;
  mount(target, 'claim', { verify });
  wireClaimWizard(target, record, lang);
}

export async function bootRegister() {
  const lang = currentLang();
  const target = prepare('registry.register', lang);
  mount(target, 'register', {});
  wireRegister(target, lang);
}

export async function bootDesk() {
  const lang = currentLang();
  const target = prepare('registry.desk', lang);
  // No credential is attached to this read, and none is asked for. Whatever the
  // registry answers is what the page renders.
  const queue = await getRequestQueue(registryUrl('/requests'));
  mount(target, 'desk', { queue });
}

export async function bootCase() {
  const lang = currentLang();
  const target = prepare('registry.case', lang);
  const id = caseIdFromPath();
  // The fixture is the case the route names, so the component renders a case
  // object the way a real caller would pass one.
  const record = id && id === CASE_FIXTURE.id ? CASE_FIXTURE : null;
  mount(target, 'case', { id, record });
}

export async function bootPeers() {
  const lang = currentLang();
  const target = prepare('registry.peers', lang);
  mount(target, 'peers', { peers: PEER_FIXTURE });
}

registerView('claim', renderClaim);
registerView('register', renderRegister);
registerView('desk', renderDesk);
registerView('case', renderCase);
registerView('peers', renderPeers);
