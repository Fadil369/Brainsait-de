// chain.js — screens 14 and 15, and the chainRows() reducer behind them.
//
//   /bpr/slots/:id/chain/         trust chain        GET /slots/:id/chain
//   /bpr/slots/:id/delegations/   delegation register GET /slots/:id/delegations
//
// R3: GET /slots/:id/chain returns one level. `parent` is a raw row, not a
// nested chain, and A→B→C is therefore three sibling rows. chainRows() returns
// a flat array and there is no code path here that could produce a nested row —
// the shape itself is the guarantee, not a rendering convention.

import { getJSON } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import { registryUrl, banners, byId, chip, fieldList, link, list, nameOrConsent, notice, section } from './ui.js';

const ROOT = 'bpr-root';

// ---------------------------------------------------------------------------
// chainRows — the whole of the trust chain as sibling rows
// ---------------------------------------------------------------------------

// A delegation carries its scope either parsed (`scope`) or as a string
// (`scope_json`). A string that will not parse is no scope, not a crash.
function readScope(delegation) {
  if (delegation && delegation.scope && typeof delegation.scope === 'object') {
    return delegation.scope;
  }
  const raw = delegation && delegation.scope_json;
  if (typeof raw !== 'string' || raw === '') return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

// The badge is derived from `signed` and from nothing else.
//
// It is deliberately NOT derived from `sig_error`. A delegation that was never
// meant to be signed legitimately carries consent_sig: null AND sig_error: null,
// so an error-keyed badge would invent an unsigned mark on a document that
// simply has no signature field, and would equally be unable to tell "unsigned
// on purpose" from "signature failed to verify".
function delegationBadge(delegation) {
  return Number(delegation?.signed) === 1 ? 'signed' : 'unsigned';
}

export function chainRows(chain) {
  const source = chain && typeof chain === 'object' ? chain : {};
  const rows = [];

  // `record` is the party exactly as the registry sent it. The chain payload
  // carries no consent field at all, and that has to survive into the row: the
  // renderer decides whether a name may be published by reading the consent
  // fields off the record, so a row that copied only the name would have
  // thrown away the evidence the decision needs.
  if (source.org) {
    rows.push({
      kind: 'org',
      spid: source.org.spid ?? null,
      name: source.org.name ?? null,
      trustLevel: source.org.trust_level ?? null,
      status: source.org.status ?? null,
      record: source.org,
    });
  }

  if (source.holder) {
    rows.push({
      kind: 'holder',
      spid: source.holder.spid ?? null,
      name: source.holder.name ?? null,
      trustLevel: source.holder.trust_level ?? null,
      status: source.holder.status ?? null,
      record: source.holder,
    });
  }

  // Present only when the chain actually names one. `parent` is a raw row and
  // is emitted as a sibling — never expanded into a second chain.
  if (source.parent) {
    rows.push({
      kind: 'parent',
      id: source.parent.id ?? null,
      title: source.parent.title ?? null,
      state: source.parent.state ?? null,
    });
  }

  const delegations = Array.isArray(source.delegations) ? source.delegations : [];
  for (const delegation of delegations) {
    const scope = readScope(delegation);
    rows.push({
      kind: 'delegation',
      id: delegation?.id ?? null,
      from: delegation?.from_spid ?? null,
      to: delegation?.to_spid ?? null,
      state: delegation?.state ?? null,
      createdAt: delegation?.created_at ?? null,
      signed: Number(delegation?.signed) === 1 ? 1 : 0,
      badge: delegationBadge(delegation),
      // Carried through untouched so a reader can see whether a signature was
      // ever attempted, without that fact deciding the badge.
      sigError: delegation?.sig_error ?? null,
      tasks: Array.isArray(scope.tasks) ? scope.tasks : [],
      internal: scope.internal === true,
      expires: scope.expires ?? null,
    });
  }

  if (source.verify_qr) {
    rows.push({
      kind: 'qr',
      href: String(source.verify_qr),
      slotId: source.slot ? source.slot.id : null,
    });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Screen 14 — the chain as a credential document
// ---------------------------------------------------------------------------

function partyRow(row, roleKey, lang) {
  return el('div', { class: 'doc-row', 'data-kind': row.kind },
    el('p', { class: 'doc-role' },
      el('span', { class: 'doc-seal' }, t(roleKey, lang)),
      ' ',
      row.spid
        ? link(`/bpr/p/${row.spid}/`, row.spid)
        : t('common.not_stated', lang)),
    // R1, read through the single consent gate. The chain endpoint answers with
    // a populated holder.name and org.name and no consent field whatever, so a
    // name rendered from `row.name` here would be published on this screen while
    // the directory withholds the same SPID. nameOrConsent() asks the record
    // whether it positively consented; it did not, so it reads consent pending.
    el('p', { class: 'doc-party' }, nameOrConsent(row.record ?? {}, lang)),
    el('p', { class: 'muted small' },
      `${t('common.trust', lang)}: ${row.trustLevel || t('common.not_stated', lang)}`,
      row.status ? ` · ${row.status}` : ''),
  );
}

function delegationRow(row, lang) {
  const stamp = row.badge === 'signed'
    ? el('span', { class: 'doc-seal', 'data-signed': '1' }, t('chain.stamp_signed', lang))
    : el('span', { class: 'doc-seal', 'data-signed': '0' }, t('chain.stamp_unsigned', lang));

  return el('div', { class: 'doc-row', 'data-kind': 'delegation' },
    el('p', { class: 'doc-role' },
      el('span', { class: 'doc-role-label' }, t('chain.delegation', lang)),
      ' ', stamp),
    fieldList([
      ['delegations.col.id', row.id || t('common.not_stated', lang)],
      ['chain.delegated_from', row.from || t('common.not_stated', lang)],
      ['chain.delegated_to', row.to || t('common.not_stated', lang)],
      ['delegations.col.tasks', row.tasks.length ? row.tasks.join(' · ') : t('delegations.no_tasks', lang)],
      ['delegations.col.internal', t(row.internal ? 'common.yes' : 'common.no', lang)],
      ['delegations.col.expires', row.expires || t('common.not_stated', lang)],
      ['delegations.col.signature', row.badge === 'signed'
        ? t('chain.stamp_signed', lang)
        : t('chain.stamp_unsigned', lang)],
    ], lang),
  );
}

function renderChain(data, { lang }) {
  const { id, chain } = data;
  const rows = chainRows(chain.state === 'STALE' ? {} : chain.data);
  const slot = chain.state === 'STALE' ? null : chain.data?.slot;

  if (!rows.length) {
    return [
      ...banners(chain),
      el('h1', null, t('registry.chain', lang)),
      el('h2', null, id || '—'),
      notice(t('chain.not_found', lang, { id: id || '—' })),
      el('p', null, link(`/bpr/slots/${id}/`, t('slots.back', lang))),
    ];
  }

  const body = [];
  for (const row of rows) {
    if (row.kind === 'org') body.push(partyRow(row, 'chain.org', lang));
    else if (row.kind === 'holder') body.push(partyRow(row, 'chain.holder', lang));
    else if (row.kind === 'parent') {
      body.push(el('div', { class: 'doc-row', 'data-kind': 'parent' },
        el('p', { class: 'doc-role' },
          el('span', { class: 'doc-role-label' }, t('chain.parent', lang)), ' ',
          link(`/bpr/slots/${row.id}/`, row.title || row.id),
          row.state ? ' ' : null, row.state ? chip(row.state) : null)));
    } else if (row.kind === 'delegation') body.push(delegationRow(row, lang));
    else if (row.kind === 'qr') {
      body.push(el('div', { class: 'doc-row', 'data-kind': 'qr' },
        el('p', { class: 'doc-role' },
          el('span', { class: 'doc-role-label' }, t('chain.qr', lang))),
        el('p', null, link(row.href, row.href)),
        el('p', { class: 'muted small' }, t('chain.qr_hint', lang))));
    }
  }

  const delegations = rows.filter((r) => r.kind === 'delegation');

  return [
    ...banners(chain),
    el('h1', null, t('registry.chain', lang)),
    // The document container does the work here: this screen is a credential,
    // not a card grid.
    el('article', { class: 'doc', id: 'chain-document' },
      el('div', { class: 'doc-head' },
        el('h2', null, slot && slot.title ? slot.title : t('chain.doc_title', lang)),
        el('p', { class: 'muted small' }, slot && slot.id ? slot.id : (id || ''))),
      ...body,
      delegations.length
        ? el('p', { class: 'doc-foot muted small' }, t('chain.stamp_note', lang))
        : null,
      el('p', { class: 'doc-foot' },
        link(`/bpr/slots/${id}/delegations/`, t('registry.delegations', lang)),
        ' · ',
        link(`/bpr/slots/${id}/`, t('slots.back', lang))),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Screen 15 — the delegation register
// ---------------------------------------------------------------------------

function delegationTable(rows, lang) {
  return el('table', null,
    el('thead', null, el('tr', null,
      el('th', null, t('delegations.col.id', lang)),
      el('th', null, t('delegations.col.from', lang)),
      el('th', null, t('delegations.col.to', lang)),
      el('th', null, t('delegations.col.tasks', lang)),
      el('th', null, t('delegations.col.internal', lang)),
      el('th', null, t('delegations.col.expires', lang)),
      el('th', null, t('delegations.col.signature', lang)),
    )),
    el('tbody', null, ...rows.map((row) => el('tr', { 'data-delegation': row.id, 'data-signed': String(row.signed) },
      el('td', null, el('code', null, row.id || t('common.not_stated', lang))),
      el('td', null, row.from || t('common.not_stated', lang)),
      el('td', null, row.to || t('common.not_stated', lang)),
      el('td', null, row.tasks.length ? row.tasks.join(' · ') : t('delegations.no_tasks', lang)),
      el('td', null, t(row.internal ? 'common.yes' : 'common.no', lang)),
      el('td', null, row.expires || t('common.not_stated', lang)),
      el('td', null, chip(
        t(row.badge === 'signed' ? 'chain.stamp_signed' : 'chain.stamp_unsigned', lang),
        row.badge === 'signed' ? 'ok' : null)),
    ))),
  );
}

function renderDelegations(data, { lang }) {
  const { id, register } = data;
  const payload = register.state === 'STALE' ? null : register.data;
  // The register endpoint answers {slot_id, delegations[]}; the chain endpoint
  // answers {delegations[]} too, so both shapes are accepted.
  const raw = payload && Array.isArray(payload.delegations)
    ? payload.delegations
    : [];
  const rows = chainRows({ delegations: raw }).filter((r) => r.kind === 'delegation');

  if (register.state === 'STALE') {
    return [
      ...banners(register),
      el('h1', null, t('registry.delegations', lang)),
      el('h2', null, id || '—'),
      notice(t('delegations.not_found', lang, { id: id || '—' })),
      el('p', null, link(`/bpr/slots/${id}/chain/`, t('registry.chain', lang))),
    ];
  }

  return [
    ...banners(register),
    el('h1', null, t('registry.delegations', lang)),
    el('h2', { 'data-slot': (payload && payload.slot_id) || id }, (payload && payload.slot_id) || id || ''),
    el('p', { class: 'lede' }, t('delegations.lede', lang)),
    rows.length
      ? delegationTable(rows, lang)
      : el('p', { class: 'muted' }, t('delegations.empty', lang)),
    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/slots/${id}/chain/`, t('registry.chain', lang))),
        el('li', null, link(`/bpr/slots/${id}/`, t('slots.back', lang))),
      ]),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

export function slotIdFromPath() {
  const parts = (globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf('slots');
  const next = at >= 0 ? parts[at + 1] : null;
  return next ? decodeURIComponent(next) : '';
}

function prepare(viewKey, lang) {
  document.title = pageTitle(viewKey, lang) || document.title;
  applyLang(document.documentElement, lang);
  const target = byId(ROOT);
  applyLang(target, lang);
  return target;
}

export async function bootChain() {
  const lang = currentLang();
  const target = prepare('registry.chain', lang);
  const id = slotIdFromPath();
  const chain = id
    ? await getJSON(registryUrl(`/slots/${encodeURIComponent(id)}/chain`))
    : { state: 'STALE', data: null, fetchedAt: null, error: 'no_id' };
  mount(target, 'chain', { id, chain });
}

export async function bootDelegations() {
  const lang = currentLang();
  const target = prepare('registry.delegations', lang);
  const id = slotIdFromPath();
  const register = id
    ? await getJSON(registryUrl(`/slots/${encodeURIComponent(id)}/delegations`))
    : { state: 'STALE', data: null, fetchedAt: null, error: 'no_id' };
  mount(target, 'delegations', { id, register });
}

registerView('chain', renderChain);
registerView('delegations', renderDelegations);
