// views-partner.js — screens 18, 19 and 20 (task 11).
//
//   /bpr/partner/               GET /partner/:spid
//   /bpr/partner/provisioning/  GET /provision/:spid
//   /bpr/network/               GET /network
//
// One rule runs through all three, and it is the reason this file looks the way
// it does: these screens treat every array the registry returns as an OPEN SET.
//
// Provisioning already proves why. Production carries a step called
// `auto_provisioned` that is absent from the worker's PROVISION_STEPS constant.
// A page that iterated a hardcoded five-step list would have rendered four fifths
// of that record and reported "complete" — a confident, well-designed, wrong
// answer. So nothing here counts steps, indexes into them, or assumes an order.
// What comes back is rendered; a name with no translation renders under its own
// registry token rather than being dropped.

import { getJSON } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import {
  registryUrl, banners, byId, chip, fieldList, link, list,
  nameOrConsent, notice, section, slotChip,
} from './ui.js';

const ROOT = 'bpr-root';

// Same reason as the consent screen: the route is fixed, so an arriving link
// with no identifier still shows a real member instead of an empty page.
const DEFAULT_SPID = 'SA-PHY-000001';

function requestedSpid() {
  const asked = new URLSearchParams(String(globalThis.location?.search || ''));
  return (asked.get('spid') || DEFAULT_SPID).trim().toUpperCase();
}

// ---------------------------------------------------------------------------
// Open-set vocabulary
// ---------------------------------------------------------------------------

// A registry token that has a translation is shown in the reader's language and
// keeps its token visible. A token with no translation is shown under its token
// alone. Nothing is ever dropped for want of a translation, and nothing is ever
// invented to fill one.
function token(raw, lang, prefix = '') {
  const key = `${prefix}${raw}`;
  const label = t(key, lang);
  if (label === null) return raw === null || raw === undefined ? '' : String(raw);
  return el('span', null, label, ' ', el('code', { class: 'token' }, raw));
}

// The status of a provisioning step. A status the registry invents later gets a
// neutral chip and its own token, which is honest: an unknown status is not a
// failure, but it is not a success either.
const STATUS_TONE = { done: 'ok', failed: 'err', pending: 'warn', skipped: null };

function statusChip(raw, lang) {
  const label = t(`provstatus.${raw}`, lang) ?? (raw === null || raw === undefined ? '' : String(raw));
  const tone = Object.prototype.hasOwnProperty.call(STATUS_TONE, raw) ? STATUS_TONE[raw] : null;
  return chip(label, tone);
}

// ---------------------------------------------------------------------------
// Provisioning steps — the shared renderer
// ---------------------------------------------------------------------------

// detail is a free-form object of whatever the step recorded (a DID, a Shopify
// handle, an ERP id). It is printed as a key/value contract rather than being
// parsed, because the field names are the contract and this page is not the
// thing that defines them.
function stepDetail(detail, lang) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) return null;
  const rows = Object.entries(detail).filter(([, v]) =>
    v !== null && v !== undefined && v !== '' && typeof v !== 'object');
  if (!rows.length) return null;

  const dl = el('dl', { class: 'doc-field' });
  for (const [key, value] of rows) {
    dl.appendChild(el('dt', null, el('code', null, key)));
    dl.appendChild(el('dd', null, typeof value === 'boolean'
      ? t(value ? 'common.yes' : 'common.no', lang)
      : String(value)));
  }
  return el('details', null,
    el('summary', null, t('prov.detail', lang)),
    dl);
}

export function stepRow(step, lang) {
  if (!step || typeof step !== 'object') return null;
  const name = step.step ?? step.id ?? '—';
  return el('li', { class: 'step-row', 'data-step': String(name), 'data-status': String(step.status ?? '') },
    el('span', { class: 'step-name' }, token(name, lang, 'provstep.')),
    statusChip(step.status, lang),
    step.at ? el('time', { class: 'step-at', datetime: String(step.at) }, String(step.at)) : null,
    stepDetail(step.detail, lang),
  );
}

// `complete` is rendered as the registry states it. It is not recomputed from
// the step list, because the registry may have a completion rule this page does
// not know about, and a page that second-guesses it would be inventing a claim.
// `complete` is three-valued on purpose: true, false, or null for "the registry
// did not state it". Only the boolean cases render a verdict. Deriving it from
// the step count would let this page report a provision complete on the strength
// of a list it happened to receive.
function provisionSteps(steps, complete, lang) {
  const list_ = Array.isArray(steps) ? steps : [];
  const stated = complete === true || complete === false;
  return [
    stated
      ? el('p', null, chip(complete ? t('prov.complete', lang) : t('prov.incomplete', lang),
          complete ? 'ok' : 'warn'))
      : null,
    stated
      ? el('p', { class: 'muted' }, complete ? t('prov.complete_yes', lang) : t('prov.complete_no', lang))
      : null,
    list_.length
      ? el('ol', { class: 'steps-open' }, ...list_.map((s) => stepRow(s, lang)).filter(Boolean))
      : el('p', { class: 'muted' }, t('prov.no_steps', lang)),
    el('p', { class: 'muted small' }, t('prov.lede', lang)),
  ];
}

// ---------------------------------------------------------------------------
// Screen 18 — partner
// ---------------------------------------------------------------------------

function slotLine(slot, lang) {
  return el('li', null,
    link(`/bpr/slots/${slot.id}/`, slot.title || slot.id),
    ' ',
    slot.state ? slotChip(slot.state, lang) : null);
}

function delegationLine(d, lang) {
  return el('li', null,
    el('code', null, d.id || '—'),
    ' ',
    link(`/bpr/p/${d.from_spid}/`, d.from_spid || '—'),
    ' → ',
    link(`/bpr/p/${d.to_spid}/`, d.to_spid || '—'),
    d.state ? el('span', { class: 'muted small' }, ` ${d.state}`) : null);
}

// The network block on a partner record is one provider's peering facts. It is
// read for the same fields as the network screen so the two cannot disagree.
function networkRows(n, lang) {
  if (!n || typeof n !== 'object') return null;
  return [
    ['net.ix_name', plainOr(n.ix_name, lang)],
    ['net.asn', el('code', null, n.ix_asn || t('common.not_stated', lang))],
    ['net.peering', token(n.peering_type, lang, 'peering.')],
    ['net.facility', plainOr(n.facility, lang)],
    ['net.uptime', plainOr(n.uptime_sla, lang)],
    ['net.peers', String(n.peer_count ?? '—')],
    ['net.bandwidth', Number.isFinite(Number(n.bandwidth_gbps))
      ? t('net.gbps', lang, { n: n.bandwidth_gbps }) : t('common.not_stated', lang)],
    ['net.ipv6', t(n.ipv6_enabled ? 'common.yes' : 'common.no', lang)],
    ['net.verified', verifiedCell(n, lang)],
  ];
}

function plainOr(value, lang) {
  if (value === null || value === undefined || value === '') return t('common.not_stated', lang);
  return String(value);
}

// `verified` is read from the record and only from the record. A partner on a
// BIAL-H2 trust level that has never been verified as a peering participant
// still reads unverified here, which is the whole point.
function verifiedCell(n, lang) {
  // Fail closed: only an explicit positive signal verifies. Absence of the
  // field is NOT evidence of verification — same rule as claims.js isPublishable.
  const isVerified = n.verified === true || n.verified === 1 || n.verified === '1';
  return isVerified
    ? chip(t('net.verified', lang), 'ok')
    : el('span', null, chip(t('verify.unverified', lang), null), ' ',
        el('span', { class: 'muted small' }, t('net.unverified', lang)));
}

function renderPartner(data, { lang }) {
  const { spid, partner } = data;

  if (!spid) {
    return [...banners(partner),
      el('h1', null, t('registry.partner', lang)),
      notice(t('consent.not_found', lang, { spid: '—' }))];
  }

  const p = partner.state === 'STALE' ? null : partner.data;
  if (!p || (p.spid && p.spid !== spid)) {
    return [
      ...banners(partner),
      el('h1', null, t('registry.partner', lang)),
      el('h2', { 'data-spid-requested': spid }, spid),
      notice(t('consent.not_found', lang, { spid })),
      el('p', null, link('/bpr/directory/', t('registry.directory', lang))),
    ];
  }

  const held = Array.isArray(p.slots_held) ? p.slots_held : [];
  const published = Array.isArray(p.slots_published) ? p.slots_published : [];
  const delegations = Array.isArray(p.delegations) ? p.delegations : [];
  const ledger = p.ledger && typeof p.ledger === 'object' ? p.ledger : null;
  const steps = Array.isArray(p.provisioning) ? p.provisioning : [];

  return [
    ...banners(partner),
    el('h1', null, t('registry.partner', lang)),
    el('p', { class: 'lede' }, t('partner.lede', lang)),

    section('common.spid', lang,
      fieldList([
        ['common.spid', el('code', null, spid)],
        ['dossier.name', nameOrConsent(p.member || p, lang)],
        ['common.trust', plainOr((p.member && p.member.trust_level) || p.trust_level, lang)],
        ['common.status', chip((p.member && p.member.status) || p.status || t('common.not_stated', lang))],
      ], lang),
    ),

    section('partner.slots_held', lang,
      held.length ? list(held.map((s) => slotLine(s, lang))) : el('p', { class: 'muted' }, t('partner.no_slots', lang))),

    section('partner.slots_published', lang,
      published.length ? list(published.map((s) => slotLine(s, lang))) : el('p', { class: 'muted' }, t('partner.no_published', lang))),

    section('partner.delegations', lang,
      delegations.length ? list(delegations.map((d) => delegationLine(d, lang)))
        : el('p', { class: 'muted' }, t('partner.no_delegations', lang))),

    ledger
      ? section('partner.ledger', lang,
          fieldList([
            ['partner.balance', Number.isFinite(Number(ledger.balance_sar))
              ? `${ledger.balance_sar} ${t('common.sar', lang)}`
              : t('common.not_stated', lang)],
          ], lang))
      : null,

    section('partner.network', lang,
      networkRows(p.network, lang)
        ? fieldList(networkRows(p.network, lang), lang)
        : el('p', { class: 'muted' }, t('common.not_stated', lang))),

    // Open set: every step that came back, in the order it came back.
    section('partner.provisioning', lang, ...provisionSteps(steps, null, lang)),

    section('partner.links', lang,
      list([
        el('li', null, link(`/bpr/p/${spid}/`, t('directory.open_dossier', lang))),
        el('li', null, link(`/bpr/passport/${spid}/`, t('registry.passport', lang))),
        el('li', null, link(`/bpr/partner/provisioning/?spid=${encodeURIComponent(spid)}`, t('registry.provisioning', lang))),
      ])),
  ];
}

// ---------------------------------------------------------------------------
// Screen 19 — provisioning
// ---------------------------------------------------------------------------

function renderProvisioning(data, { lang }) {
  const { spid, provision } = data;

  if (!spid) {
    return [...banners(provision),
      el('h1', null, t('registry.provisioning', lang)),
      notice(t('consent.not_found', lang, { spid: '—' }))];
  }

  const p = provision.state === 'STALE' ? null : provision.data;
  if (!p || (p.spid && p.spid !== spid)) {
    return [
      ...banners(provision),
      el('h1', null, t('registry.provisioning', lang)),
      el('h2', { 'data-spid-requested': spid }, spid),
      notice(t('consent.not_found', lang, { spid })),
    ];
  }

  const steps = Array.isArray(p.steps) ? p.steps : [];

  return [
    ...banners(provision),
    el('h1', null, t('registry.provisioning', lang)),
    el('p', { class: 'lede' }, t('prov.lede', lang)),
    el('p', { class: 'muted' }, el('code', null, spid)),
    ...provisionSteps(steps, typeof p.complete === 'boolean' ? p.complete : null, lang),
    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/partner/?spid=${encodeURIComponent(spid)}`, t('registry.partner', lang))),
        el('li', null, link(`/bpr/p/${spid}/`, t('directory.open_dossier', lang))),
      ])),
  ];
}

// ---------------------------------------------------------------------------
// Screen 20 — network
// ---------------------------------------------------------------------------

// The name column reads through nameOrConsent() like every other name on the
// site, so it needs no special case here. Worth saying out loud, because GET
// /network is the second surface that answers with business_name populated and
// no consent field at all: before claims.js failed closed, this cell published
// "Heart & Vascular Institute" for a member the registry withholds on /members.
export function providerRow(provider, lang) {
  const n = provider || {};
  return el('tr', { 'data-spid': String(n.spid || ''), 'data-verified': String(n.verified === true || n.verified === 1 || n.verified === '1') },
    el('td', null, link(`/bpr/p/${n.spid}/`, nameOrConsent(n, lang))),
    el('td', null, n.ix_name ? String(n.ix_name) : t('common.not_stated', lang)),
    el('td', null, el('code', null, n.ix_asn || t('common.not_stated', lang))),
    el('td', null, token(n.peering_type, lang, 'peering.')),
    el('td', null, n.facility ? String(n.facility) : t('common.not_stated', lang)),
    el('td', null, n.uptime_sla ? String(n.uptime_sla) : t('common.not_stated', lang)),
    el('td', null, String(n.peer_count ?? '—')),
    el('td', null, Number.isFinite(Number(n.bandwidth_gbps))
      ? t('net.gbps', lang, { n: n.bandwidth_gbps }) : t('common.not_stated', lang)),
    // The column that must never borrow a tone from trust_level.
    el('td', null, verifiedCell(n, lang)),
  );
}

function renderNetwork(data, { lang }) {
  const { network } = data;
  const payload = network.state === 'STALE' ? null : network.data;
  const providers = payload && Array.isArray(payload.providers) ? payload.providers : [];
  const declaredTotal = payload ? payload.total : null;

  return [
    ...banners(network),
    el('h1', null, t('registry.network', lang)),
    el('p', { class: 'lede' }, t('net.lede', lang)),
    el('p', { class: 'muted', id: 'net-count' },
      t('net.count', lang, { count: providers.length })),
    // If the registry's declared total and its array disagree, both are shown.
    // Silently picking one would hide a real disagreement in the source.
    declaredTotal !== null && Number(declaredTotal) !== providers.length
      ? notice(t('net.total_mismatch', lang, { total: declaredTotal, shown: providers.length }))
      : null,
    providers.length
      ? el('table', { id: 'net-table' },
          el('thead', null, el('tr', null,
            el('th', null, t('dossier.name', lang)),
            el('th', null, t('net.ix_name', lang)),
            el('th', null, t('net.asn', lang)),
            el('th', null, t('net.peering', lang)),
            el('th', null, t('net.facility', lang)),
            el('th', null, t('net.uptime', lang)),
            el('th', null, t('net.peers', lang)),
            el('th', null, t('net.bandwidth', lang)),
            el('th', null, t('net.verified', lang)),
          )),
          el('tbody', { id: 'net-body' }, ...providers.map((p) => providerRow(p, lang))),
        )
      : el('p', { class: 'muted' }, t('net.no_providers', lang)),
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

export async function bootPartner() {
  const lang = currentLang();
  const target = prepare('registry.partner', lang);
  const spid = requestedSpid();
  const partner = await getJSON(registryUrl(`/partner/${encodeURIComponent(spid)}`));
  mount(target, 'partner', { spid, partner });
}

export async function bootProvisioning() {
  const lang = currentLang();
  const target = prepare('registry.provisioning', lang);
  const spid = requestedSpid();
  const provision = await getJSON(registryUrl(`/provision/${encodeURIComponent(spid)}`));
  mount(target, 'provisioning', { spid, provision });
}

export async function bootNetwork() {
  const lang = currentLang();
  const target = prepare('registry.network', lang);
  const network = await getJSON(registryUrl('/network'));
  mount(target, 'network', { network });
}

registerView('partner', renderPartner);
registerView('provisioning', renderProvisioning);
registerView('network', renderNetwork);
