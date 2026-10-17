// views-slots.js — screens 12, 13 and 16.
//
//   /bpr/slots/          marketplace     GET /slots
//   /bpr/slots/:id/      slot detail     GET /slots/:id
//   /bpr/slots/:id/tree/ sub-slot tree   GET /slots
//
// The marketplace shell doubles as the detail shell: nginx falls an unknown
// /bpr/slots/<id>/ back to slots/index.html, and the id is read from
// location.pathname. That is why an unknown id renders a 200 page that says
// "the registry holds no slot with that identifier" instead of a slot that was
// never there.

import { getJSON, slotStates, stateChip } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import {
  registryUrl, banners, byId, fieldList, link, list, nameOrConsent, notice, section, slotChip,
} from './ui.js';

const ROOT = 'bpr-root';

export function slotIdFromPath() {
  const parts = (globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf('slots');
  if (at < 0) return '';
  const next = parts[at + 1];
  return next ? decodeURIComponent(next) : '';
}

// A price is a number and a currency. An absent price is "not stated", never a
// zero that reads as free.
function price(value, lang) {
  if (value === null || value === undefined || value === '') {
    return t('common.not_stated', lang);
  }
  return `${value} ${t('common.sar', lang)}`;
}

// A manifest and a requirements block are machine-readable contracts. Their
// field names are the contract, so they are shown as written; only the values
// that need a word (booleans) go through i18n.
function contractBlock(titleKey, contract, lang) {
  if (!contract || typeof contract !== 'object') return null;
  const rows = [];
  for (const [key, value] of Object.entries(contract)) {
    let shown;
    if (typeof value === 'boolean') shown = t(value ? 'common.yes' : 'common.no', lang);
    else if (Array.isArray(value)) shown = value.length ? value.join(' · ') : t('common.not_stated', lang);
    else if (value === null || value === undefined || value === '') shown = t('common.not_stated', lang);
    else shown = String(value);
    rows.push(el('dt', null, el('code', null, key)));
    rows.push(el('dd', null, shown));
  }
  if (rows.length === 0) return null;
  const dl = el('dl', { class: 'doc-field' });
  dl.append(...rows);
  return section(titleKey, lang, dl);
}

// ---------------------------------------------------------------------------
// Screen 12 — slots marketplace
// ---------------------------------------------------------------------------

function distinct(values) {
  return [...new Set(values.filter((v) => v !== null && v !== undefined && v !== ''))];
}

function slotRow(slot, lang) {
  return el('tr', { 'data-slot': slot.id, 'data-slot-state': slot.state ?? '' },
    el('td', null, link(`/bpr/slots/${slot.id}/`, slot.title || slot.id)),
    el('td', null, el('code', null, slot.specialty || '—')),
    el('td', null, el('code', null, slot.slot_type || '—')),
    el('td', null, orgCell(slot, lang)),
    el('td', null, price(slot.price_integration_sar, lang)),
    el('td', null, price(slot.price_monthly_sar, lang)),
    el('td', null, slotChip(slot.state, lang)),
  );
}

function slotTable(rows, lang) {
  return el('table', { id: 'slot-table' },
    el('thead', null, el('tr', null,
      el('th', null, t('common.title', lang)),
      el('th', null, t('common.specialty', lang)),
      el('th', null, t('common.slot_type', lang)),
      el('th', null, t('common.organization', lang)),
      el('th', null, t('common.integration_fee', lang)),
      el('th', null, t('common.monthly_fee', lang)),
      el('th', null, t('common.state', lang)),
    )),
    el('tbody', { id: 'slot-body' }, ...rows.map((s) => slotRow(s, lang))),
  );
}

// A filter option spells a slot state, so it renders the state the same legal
// way every other place does: stateChip decides the word, i18n decides the
// language.
function stateLabel(value, lang) {
  const entry = stateChip('slot', value);
  if (!entry) return value;
  return t(`slotstate.${entry.label}`, lang) ?? entry.label;
}

function filterSelect(id, labelKey, options, lang, renderOption) {
  const select = el('select', { id },
    el('option', { value: '' }, t('common.all', lang)),
    ...options.map((value) => el('option', { value }, renderOption ? renderOption(value, lang) : value)));
  return el('p', null, el('label', { for: id }, t(labelKey, lang)), ' ', select);
}

function renderSlots(data, { lang }) {
  const { slots } = data;
  const list_ = (slots.state === 'STALE' || !slots.data || !Array.isArray(slots.data.slots))
    ? []
    : slots.data.slots;

  const stateOptions = distinct(list_.map((s) => s.state));
  const typeOptions = distinct(list_.map((s) => s.slot_type));

  const controls = el('div', { class: 'card', id: 'slot-filters' },
    filterSelect('filter-state', 'slots.filter.state', stateOptions, lang, stateLabel),
    filterSelect('filter-type', 'slots.filter.type', typeOptions, lang),
    el('p', null,
      el('label', { for: 'filter-specialty' }, t('slots.filter.specialty', lang)), ' ',
      el('input', {
        id: 'filter-specialty', type: 'search', autocomplete: 'off',
        placeholder: t('slots.filter.specialty_placeholder', lang),
      })),
    el('p', null, el('button', { id: 'filter-reset', type: 'button' }, t('slots.filter.reset', lang))),
  );

  return [
    ...banners(slots),
    el('h1', null, t('registry.slots', lang)),
    el('p', { class: 'lede' }, t('slots.lede', lang)),
    el('p', { class: 'muted', id: 'slot-count' },
      t('slots.count', lang, { count: list_.length })),
    list_.length ? controls : null,
    list_.length
      ? slotTable(list_, lang)
      : el('p', { class: 'muted' },
          slots.state === 'STALE' ? t('slots.empty_registry', lang) : t('slots.empty', lang)),
  ];
}

// Client-side filtering over the one reading the page already took. Specialty
// is free text upstream, so it is a substring filter and not a constrained list.
export function filterSlots(all, { state = '', type = '', specialty = '' } = {}) {
  const needle = String(specialty).trim().toLowerCase();
  return all.filter((s) => {
    if (state && s.state !== state) return false;
    if (type && s.slot_type !== type) return false;
    if (needle && !String(s.specialty || '').toLowerCase().includes(needle)) return false;
    return true;
  });
}

function wireFilters(target, all, lang) {
  const body = target.querySelector('#slot-body');
  if (!body) return;
  const count = target.querySelector('#slot-count');
  const stateSel = target.querySelector('#filter-state');
  const typeSel = target.querySelector('#filter-type');
  const specInput = target.querySelector('#filter-specialty');

  const apply = () => {
    const state = stateSel ? stateSel.value : '';
    const type = typeSel ? typeSel.value : '';
    const needle = specInput ? specInput.value : '';

    const shown = filterSlots(all, { state, type, specialty: needle });

    body.replaceChildren(...shown.map((s) => slotRow(s, lang)));
    if (count) {
      count.textContent = shown.length === all.length
        ? t('slots.count', lang, { count: all.length })
        : t('slots.filtered_count', lang, { shown: shown.length, total: all.length });
    }
  };

  for (const node of [stateSel, typeSel]) if (node) node.addEventListener('change', apply);
  if (specInput) specInput.addEventListener('input', apply);
  const reset = target.querySelector('#filter-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      if (stateSel) stateSel.value = '';
      if (typeSel) typeSel.value = '';
      if (specInput) specInput.value = '';
      apply();
    });
  }
}

// ---------------------------------------------------------------------------
// Screen 13 — slot detail
// ---------------------------------------------------------------------------

function renderSlot(data, { lang }) {
  const { id, slot } = data;

  if (!id) {
    return [...banners(slot),
      el('h1', null, t('registry.slots', lang)),
      notice(t('slots.not_found', lang, { id: '—' }))];
  }

  // GET /slots/:id answers {slot: {...}} — the slot is one level down. A 200
  // with no slot in it is still "not found", not an empty slot.
  const s = slot.state === 'STALE' ? null
    : (slot.data && slot.data.slot ? slot.data.slot : null);
  if (!s) {
    // The registry answered with nothing for this id. That is reported as
    // exactly that — never padded with a plausible-looking slot.
    return [
      ...banners(slot),
      el('h1', null, t('registry.slots', lang)),
      el('h2', { 'data-slot-requested': id }, id),
      notice(t('slots.not_found', lang, { id })),
      el('p', { class: 'muted' }, t('slots.not_found_hint', lang)),
      el('p', null, link('/bpr/slots/', t('slots.back', lang))),
    ];
  }

  const holder = s.holder_spid
    ? link(`/bpr/p/${s.holder_spid}/`, s.holder_spid)
    : t('common.unassigned', lang);

  return [
    ...banners(slot),
    el('h1', null, s.title || t('registry.slots', lang)),
    el('p', { class: 'muted', 'data-slot': s.id }, t('slots.detail_lede', lang, { id: s.id })),
    fieldList([
      ['common.oid', el('code', null, s.id)],
      ['common.specialty', el('code', null, s.specialty || t('common.not_stated', lang))],
      ['common.slot_type', el('code', null, s.slot_type || t('common.not_stated', lang))],
      ['common.organization', orgCell(s, lang)],
      ['common.holder', holder],
      ['common.integration_fee', price(s.price_integration_sar, lang)],
      ['common.monthly_fee', price(s.price_monthly_sar, lang)],
      ['common.state', slotChip(s.state, lang)],
    ], lang),
    contractBlock('slots.manifest', s.manifest, lang),
    contractBlock('slots.requirements', s.requirements, lang),
    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/slots/${s.id}/chain/`, t('slots.chain_link', lang))),
        el('li', null, link(`/bpr/slots/${s.id}/delegations/`, t('registry.delegations', lang))),
        el('li', null, link(`/bpr/slots/${s.id}/tree/`, t('slots.tree_link', lang))),
        el('li', null, link('/bpr/slots/', t('slots.back', lang))),
      ]),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Screen 16 — sub-slot tree (task 9). The only screen that nests; built from
// parent_slot and nothing else.
// ---------------------------------------------------------------------------

// Children are found by parent_slot === id, at every level. `seen` stops a
// malformed payload that points a slot at one of its own ancestors from
// recursing forever — the registry is trusted for facts, not for shape.
function treeBranch(node, all, lang, seen = new Set()) {
  if (seen.has(node.id)) {
    return el('li', null, el('p', { class: 'muted small' }, node.id));
  }
  const next = new Set(seen).add(node.id);
  const kids = all.filter((c) => c && c.parent_slot === node.id && !next.has(c.id));
  return el('li', null,
    el('div', null,
      el('strong', null, link(`/bpr/slots/${node.id}/`, node.title || node.id)),
      ' ',
      slotChip(node.state, lang)),
    kids.length
      ? el('ul', null, ...kids.map((c) => treeBranch(c, all, lang, next)))
      : el('p', { class: 'muted small' }, t('tree.no_children', lang)),
  );
}

function renderTree(data, { lang }) {
  const { id, slots } = data;
  const all = (slots.state === 'STALE' || !slots.data || !Array.isArray(slots.data.slots))
    ? []
    : slots.data.slots;

  if (!id || !all.some((s) => s.id === id)) {
    return [
      ...banners(slots),
      el('h1', null, t('registry.tree', lang)),
      el('h2', null, id || '—'),
      notice(t('tree.not_found', lang, { id: id || '—' })),
      el('p', null, link('/bpr/slots/', t('slots.back', lang))),
    ];
  }

  const group = slotStates(all).find((g) => g.parent.id === id);
  if (!group) {
    const self = all.find((s) => s.id === id);
    const parent = all.find((s) => s.id === self.parent_slot);
    return [
      ...banners(slots),
      el('h1', null, t('registry.tree', lang)),
      el('p', { class: 'lede' }, t('tree.lede', lang)),
      notice(t('tree.not_a_parent', lang, { id })),
      parent ? fieldList([['tree.parent_row', link(`/bpr/slots/${parent.id}/`, parent.id)]], lang) : null,
    ];
  }

  return [
    ...banners(slots),
    el('h1', null, t('registry.tree', lang)),
    el('h2', { 'data-slot': id }, group.parent.title || id),
    el('p', { class: 'lede' }, t('tree.lede', lang)),
    section('tree.children', lang,
      el('p', { class: 'muted' }, t('slots.count', lang, { count: group.children.length })),
      el('ul', null, treeBranch(group.parent, all, lang))),
    el('p', null, link(`/bpr/slots/${id}/`, t('slots.back', lang))),
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

export async function bootSlots() {
  const lang = currentLang();
  const id = slotIdFromPath();

  if (id) {
    const target = prepare('registry.slots', lang);
    const slot = await getJSON(registryUrl(`/slots/${encodeURIComponent(id)}`));
    mount(target, 'slot', { id, slot });
    return;
  }

  const target = prepare('registry.slots', lang);
  const slots = await getJSON(registryUrl('/slots'));
  mount(target, 'slots', { slots });
  const all = (slots.state !== 'STALE' && slots.data && Array.isArray(slots.data.slots))
    ? slots.data.slots
    : [];
  wireFilters(target, all, lang);
}

export async function bootSlotTree() {
  const lang = currentLang();
  const target = prepare('registry.tree', lang);
  const id = slotIdFromPath();
  const slots = await getJSON(registryUrl('/slots'));
  mount(target, 'tree', { id, slots });
}

registerView('slots', renderSlots);
registerView('slot', renderSlot);
registerView('tree', renderTree);

// The org name is a withheld identity on /members and /verify, and /slots ships
// it with no flag. Fail closed: show the organisation only when it carries a
// positive publication signal, otherwise the consent-pending state.
function orgCell(slot, lang) {
  if (!slot.org_name && !slot.org_spid) return t('common.not_stated', lang);
  return nameOrConsent({ business_name: slot.org_name }, lang);
}
