// ui.js — presentational helpers shared by every BPR screen.
//
// Nothing here decides policy. Claims go through claims.js, states go through
// adapter.js, and every word goes through i18n.js. This module only arranges
// what those three already decided.

import { stateChip } from './adapter.js';
import { assertClaimCeiling } from './claims.js';
import { el, statusBanner } from './render.js';
import { t } from './i18n.js';

export const REGISTRY = '/bpr/api';

export function registryUrl(path) {
  return `${REGISTRY}${path.startsWith('/') ? path : `/${path}`}`;
}

const TONE_CLASS = { live: 'chip-ok', ok: 'chip-ok', warn: 'chip-warn', err: 'chip-err', idle: '' };

// A chip carries a word and an optional tone. `tone` is never inferred from the
// word: an unrecognised state has no tone and says so, rather than borrowing one.
export function chip(label, tone = null) {
  const cls = ['chip'];
  const known = tone !== null && Object.prototype.hasOwnProperty.call(TONE_CLASS, tone);
  if (known && TONE_CLASS[tone]) cls.push(TONE_CLASS[tone]);
  return el('span', { class: cls.join(' ') }, label);
}

// The only legal way a slot state reaches a page: stateChip decides both the
// word and the tone, and an unrecognised state renders as "unrecognised" rather
// than being guessed at.
export function slotChip(state, lang) {
  const entry = stateChip('slot', state);
  if (!entry) {
    return el('span', { class: 'chip chip-err', 'data-unknown-state': String(state ?? '') },
      t('common.state_unknown', lang));
  }
  return chip(t(`slotstate.${entry.label}`, lang) ?? entry.label, entry.tone);
}

// R1: an identity the payload has not positively consented to publish renders as
// "Consent pending" — never blank, never as a load error. This is the function
// every name on the site goes through.
//
// It fails closed because claims.js does: `consent` is "granted" only on a
// positive signal, so a record with no consent field at all lands here as
// pending. Do not add a local shortcut around this call — the gate is meant to
// be reachable from exactly one place.
export function nameOrConsent(record, lang) {
  const ceiling = assertClaimCeiling(record ?? {});
  if (ceiling.consent === 'pending') return t('consent.pending', lang);
  const name = record && (record.business_name || record.name);
  return name || t('common.not_stated', lang);
}

// The verification badge, straight off the claim ceiling. A withheld identity
// gets no badge at any rung — that decision lives in claims.js, not here.
export function verificationChip(record, lang) {
  const ceiling = assertClaimCeiling(record ?? {});
  return chip(t(`verify.badge.${ceiling.badge}`, lang) ?? ceiling.badge, ceiling.badge === 'verified' ? 'ok' : null);
}

export function rungText(record, lang) {
  const ceiling = assertClaimCeiling(record ?? {});
  return t('verify.rung_of', lang, { rung: ceiling.rung, max: ceiling.maxRung });
}

// One banner per fetch. A hidden (LIVE / UNVERIFIED) banner collapses to
// nothing; a STALE one stays loud. Several fetches mean several banners — the
// reader is told which reading failed, not merely that something did.
export function banners(...results) {
  return results.filter(Boolean).map((result) => statusBanner(result));
}

export function link(href, text, extra = {}) {
  return el('a', { href, ...extra }, text);
}

export function section(titleKey, lang, ...children) {
  return el('section', { class: 'card' },
    el('h2', { class: 'card-title' }, t(titleKey, lang)),
    ...children.filter(Boolean));
}

// A definition list of label/value pairs. Values are pre-rendered nodes or
// strings; labels are i18n keys so a page never spells out English.
export function fieldList(pairs, lang) {
  const dl = el('dl', { class: 'doc-field' });
  for (const [labelKey, value, vars] of pairs) {
    if (value === null || value === undefined) continue;
    dl.appendChild(el('dt', null, t(labelKey, lang, vars) ?? labelKey));
    const dd = el('dd');
    if (Array.isArray(value)) dd.append(...value);
    else dd.append(value && value.nodeType ? value : String(value));
    dl.appendChild(dd);
  }
  return dl;
}

export function list(items, ordered = false) {
  const node = el(ordered ? 'ol' : 'ul');
  for (const item of items) node.appendChild(item);
  return node;
}

export function notice(textNode, tone = 'warn') {
  return el('p', { class: `chip chip-${tone}` }, textNode);
}

export function byId(id) {
  return document.getElementById(id);
}
