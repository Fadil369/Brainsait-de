// ladder.js — screen 17, the verification ladder.
//
//   /bpr/trust/ladder/   GET /verification/ladder
//
// A rung is the most a record may claim. This module never promotes one: a
// rung is 'filled' because the registry reported that rung, and for no other
// reason.

import { getJSON } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import { registryUrl, banners, byId, chip, link, notice } from './ui.js';

const ROOT = 'bpr-root';

// ---------------------------------------------------------------------------
// ladderMarks — which rungs are filled, available or unreached
// ---------------------------------------------------------------------------

// memberRung is what the registry said about one member. It is not a target and
// not a wish:
//   rung  <  memberRung   available  — below where this member stands
//   rung  == memberRung   filled     — reached, but only when memberRung > 0,
//                                     because rung 0 means "no membership row"
//   rung  >  memberRung   unreached  — beyond this member
// A rung number outside the ladder, or absent, marks nothing. That is
// deliberate: an out-of-range number must never ink the top rung and imply a
// claim the registry did not make.
export function ladderMarks(rungs, memberRung) {
  const list = Array.isArray(rungs) ? rungs : [];
  const n = Number(memberRung);
  const inRange = Number.isFinite(n) && list.some((r) => r.rung === n) && n > 0;
  const at = inRange ? n : null;

  return list.map((rung) => {
    const state = at === null ? 'unreached'
      : rung.rung < at ? 'available'
      : rung.rung === at ? 'filled'
      : 'unreached';
    return {
      rung: rung.rung,
      state,
      labelEn: rung.label_en ?? null,
      labelAr: rung.label_ar ?? null,
      requires: rung.requires ?? null,
      rungState: rung.state ?? null,
    };
  });
}

const STATE_KEY = {
  filled: 'ladder.state_filled',
  available: 'ladder.state_available',
  unreached: 'ladder.state_unreached',
};

// ---------------------------------------------------------------------------
// Screen 17 — the stamped ladder
// ---------------------------------------------------------------------------

function rungRow(mark, lang) {
  const label = lang === 'ar' ? mark.labelAr : mark.labelEn;
  const other = lang === 'ar' ? mark.labelEn : mark.labelAr;

  return el('li', {
    class: 'rung',
    'data-rung': String(mark.rung),
    'data-state': mark.state,
  },
    el('div', { class: 'rung-head' },
      el('span', { class: 'rung-number' }, `#${mark.rung}`),
      el('span', { class: 'rung-label' }, label || ''),
      other ? el('span', { class: 'rung-alt', lang: lang === 'ar' ? 'en' : 'ar',
        dir: lang === 'ar' ? 'ltr' : 'rtl' }, other) : null,
    ),
    mark.requires ? el('p', { class: 'rung-requires muted small' }, mark.requires) : null,
    el('p', { class: 'rung-state' }, chip(t(STATE_KEY[mark.state], lang), mark.state === 'filled' ? 'ok' : null)),
  );
}

function renderLadder(data, { lang }) {
  const { ladder } = data;
  const rungs = ladder.state === 'STALE'
    ? []
    : ((ladder.data && Array.isArray(ladder.data.rungs)) ? ladder.data.rungs : []);

  const form = el('form', { class: 'card ladder-form', id: 'ladder-form' },
    el('p', null,
      el('label', { for: 'ladder-spid' }, t('ladder.search_label', lang)), ' ',
      el('input', {
        id: 'ladder-spid', name: 'spid', type: 'text', autocomplete: 'off',
        placeholder: t('ladder.search_placeholder', lang),
      })),
    el('p', null, el('button', { id: 'ladder-submit', type: 'submit' }, t('ladder.search_cta', lang))),
    el('p', { class: 'muted small' }, t('ladder.search_hint', lang)),
  );

  return [
    ...banners(ladder),
    el('h1', null, t('registry.ladder', lang)),
    el('p', { class: 'lede' }, t('ladder.lede', lang)),
    el('ol', { class: 'ladder', id: 'ladder-list' },
      ...rungs.map((rung) => rungRow(ladderMarks(rungs, null).find((m) => m.rung === rung.rung), lang))),
    form,
    el('div', { id: 'ladder-result' }),
  ];
}

// Marks one member's rung and leaves the rest of the ladder as it was.
function applyMarks(root, rungs, memberRung, lang) {
  const marks = ladderMarks(rungs, memberRung);
  for (const mark of marks) {
    const node = root.querySelector(`[data-rung="${mark.rung}"]`);
    if (!node) continue;
    node.setAttribute('data-state', mark.state);
    const stateNode = node.querySelector('.rung-state');
    if (stateNode) {
      stateNode.replaceChildren(chip(t(STATE_KEY[mark.state], lang), mark.state === 'filled' ? 'ok' : null));
    }
  }
  return marks;
}

function clearMarks(root, rungs) {
  for (const mark of ladderMarks(rungs, null)) {
    const node = root.querySelector(`[data-rung="${mark.rung}"]`);
    if (node) node.setAttribute('data-state', mark.state);
  }
}

function report(root, node, text, tone) {
  node.replaceChildren(tone ? notice(text, tone) : el('p', { class: 'muted' }, text));
}

// Exported so the lookup can be exercised without dispatching a DOM event: the
// ladder's only moving part is "which rung does this SPID stand on", and that
// is worth pinning.
export async function lookupMember(target, rungs, rawSpid, lang = currentLang()) {
  const out = target.querySelector('#ladder-result');
  const spid = String(rawSpid || '').trim().toUpperCase();
  if (!out || !spid) return null;

  report(target, out, t('common.loading', lang));
  const result = await getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`));
  const record = result.state === 'STALE' ? null : result.data;

  // A 200 for a different record, or no record at all, is "no such member" —
  // never "some member", never a rung borrowed from another answer.
  if (!record || record.spid !== spid) {
    clearMarks(target, rungs);
    report(target, out, t('ladder.result_none', lang, { spid }), 'warn');
    return null;
  }

  const rung = Number(record.verification_rung);
  const max = Number(record.verification_max_rung);
  applyMarks(target, rungs, Number.isFinite(rung) ? rung : null, lang);

  out.replaceChildren(
    el('p', null, t('ladder.result_found', lang, {
      spid,
      rung: Number.isFinite(rung) ? rung : '\u2014',
      max: Number.isFinite(max) ? max : '\u2014',
      state: record.verification_label || t('verify.unverified', lang),
    })),
    el('p', null, link(`/bpr/p/${spid}/`, t('directory.open_dossier', lang))),
  );
  return { spid, rung, max, record };
}

function wireLookup(target, rungs) {
  const form = target.querySelector('#ladder-form');
  const input = target.querySelector('#ladder-spid');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    await lookupMember(target, rungs, input ? input.value : '');
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

export async function bootLadder() {
  const lang = currentLang();
  document.title = pageTitle('registry.ladder', lang) || document.title;
  applyLang(document.documentElement, lang);
  const target = byId(ROOT);
  applyLang(target, lang);

  const ladder = await getJSON(registryUrl('/verification/ladder'));
  mount(target, 'ladder', { ladder });

  const rungs = ladder.state === 'STALE'
    ? []
    : ((ladder.data && Array.isArray(ladder.data.rungs)) ? ladder.data.rungs : []);
  wireLookup(target, rungs);
}

registerView('ladder', renderLadder);
