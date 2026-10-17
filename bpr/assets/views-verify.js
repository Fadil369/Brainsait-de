// views-verify.js — screens 4, 5 and 6 (task 6).
//
//   /bpr/passport/:spid/   trust passport     GET /verify/:spid?format=json
//                                           +  GET /oid/verify/:spid
//                                           +  GET /api/profiles/:spid
//                                           +  GET /slots/:id/chain   (verify_qr)
//   /bpr/verify/           verify a credential GET /verify/:spid?format=json
//   /bpr/verify/phone/     verify at the bedside   same read, one big answer
//
// Three rules govern every page in this file.
//
//  1. The consent rule. All nine members currently return identity withheld, so
//     every name goes through nameOrConsent() and reads "Consent pending".
//     Never blank, never a load error, never a placeholder.
//
//  2. The contrast rule. --stamp (#ea580c, 3.06:1) is decorative. Every accent
//     that carries words here is --stamp-text (#b3410a, 4.90:1). The only rule
//     that may use --stamp on these screens is a rule with no font-size.
//
//  3. The touch rule. The bedside screen is a 44px-target screen: a colleague
//     holding a phone one-handed at the bedside verifies a stranger, so every
//     control is at least 44px on its short axis.

import { getJSON } from './adapter.js';
import { assertClaimCeiling } from './claims.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import {
  registryUrl, banners, byId, chip, fieldList, link, list,
  nameOrConsent, notice, rungText, section, verificationChip,
} from './ui.js';

const ROOT = 'bpr-root';

// verify.brainsait.de is where a credential re-reads from. It is the registry's
// own host, not a host this page controls.
const VERIFY_HOST = '/bpr/api';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Reads a member's SPID out of the URL. Both screens live under a path segment
// that names them, so the token after that segment is the identifier — which
// keeps the passport working for any SPID, not only the one in the scaffold.
export function segmentAfter(marker) {
  const parts = String(globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf(marker);
  if (at < 0) return '';
  const next = parts[at + 1];
  return next ? decodeURIComponent(next) : '';
}

function plain(value, lang) {
  if (value === null || value === undefined || value === '') return t('common.not_stated', lang);
  return String(value);
}

function code(value, lang) {
  const shown = plain(value, lang);
  return shown === t('common.not_stated', lang) ? shown : el('code', null, shown);
}

// A field that carries words in both languages shows the active language and,
// beneath it, the other. This is what makes a Saudi-first document readable by
// an English-reading supervisor without a language switch mid-triage.
function bilingualPair(activeText, otherText, lang) {
  const nodes = [activeText];
  if (otherText && otherText !== activeText) {
    nodes.push(el('span', {
      class: 'doc-alt',
      lang: lang === 'ar' ? 'en' : 'ar',
      dir: lang === 'ar' ? 'ltr' : 'rtl',
    }, otherText));
  }
  return nodes;
}

function yesNo(value, lang) {
  return chip(t(value ? 'common.yes' : 'common.no', lang), value ? 'ok' : null);
}

// ---------------------------------------------------------------------------
// Screen 4 — trust passport
// ---------------------------------------------------------------------------

// The passport's verification target is the registry's chain endpoint for the
// slot this member holds, because a chain is what a second party can re-read.
// A member holding no slot has no chain, so the target falls back to the
// member's own credential address. Neither is invented: one is returned by
// /slots/:id/chain, the other is the verify host plus an identifier we were
// given.
function passportTarget(chain, spid) {
  const fromChain = chain && chain.state !== 'STALE' && chain.data && chain.data.verify_qr;
  return fromChain || `${VERIFY_HOST}/${encodeURIComponent(spid)}`;
}

function passportBody(verify, oid, chain, lang) {
  const v = verify.state === 'STALE' ? null : (verify.data || {});
  const o = oid.state === 'STALE' ? null : (oid.data || {});
  if (!v && !o) return null;

  // Both endpoints describe the same withholding under different field names
  // (subject_identity_withheld vs identity_withheld); claims.js already treats
  // them as one thing, so the reason is read off whichever answered.
  const claim = { ...(v || {}), ...(o || {}) };
  const withheldReason = (v && v.withheld_reason) || (o && o.withheld_reason) || null;

  return [
    el('p', { class: 'lede' }, t('passport.lede', lang)),
    el('div', { class: 'doc' },
      el('div', { class: 'doc-head' },
        el('h1', { class: 'passport-id', 'data-spid': claim.spid || '' },
          claim.spid || t('registry.passport', lang)),
        el('span', { class: 'passport-stamp', 'data-verified': String(Boolean(claim.verified)) },
          verificationChip(claim, lang)),
      ),
      el('p', { class: 'passport-name' }, nameOrConsent(claim, lang)),
      withheldReason
        ? el('p', { class: 'passport-withheld' },
            el('strong', null, `${t('passport.withheld_reason', lang)}: `),
            withheldReason)
        : null,
      fieldList([
        ['common.spid', code(claim.spid, lang)],
        ['common.oid', code(o && o.oid, lang)],
        ['common.buid', code(o && o.buid, lang)],
        ['dossier.canonical', o && o.canonical
          ? link(o.canonical, o.canonical)
          : t('common.not_stated', lang)],
        ['passport.jurisdiction', code(o && o.jurisdiction, lang)],
        ['passport.class', code(o && o.class, lang)],
        ['common.trust', plain(v && v.trust_level, lang)],
        ['verify.state', bilingualPair(plain(v && v.verification_label, lang), null, lang)],
        ['verify.badge_label', verificationChip(claim, lang)],
        ['verify.recorded_at', code(v && v.registered_at, lang)],
        ['passport.valid', o ? (o.valid ? t('common.yes', lang) : t('common.no', lang))
          : t('common.not_stated', lang)],
      ], lang),
      el('p', { class: 'passport-rung' }, rungText(claim, lang)),
      el('div', { class: 'passport-qr' },
        el('h2', { class: 'card-title' }, t('passport.qr', lang)),
        el('p', null, link(passportTarget(chain, claim.spid || ''), passportTarget(chain, claim.spid || ''))),
        el('p', { class: 'muted small' }, t('passport.qr_hint', lang)),
      ),
      el('p', { class: 'doc-foot' }, t('passport.foot', lang)),
    ),
  ];
}

function renderPassport(data, { lang }) {
  const { spid, verify, oid, chain } = data;

  if (!spid) {
    return [...banners(verify, oid),
      el('h1', null, t('registry.passport', lang)),
      notice(t('passport.no_spid', lang))];
  }

  const v = verify.state === 'STALE' ? null : (verify.data || {});
  const o = oid.state === 'STALE' ? null : (oid.data || {});

  // A 200 carrying somebody else's SPID is not this passport. So is a 200 with
  // no SPID at all. Neither renders as an empty document.
  const answered = [v, o].filter(Boolean);
  const mismatch = answered.length > 0 && answered.every((r) => r.spid && r.spid !== spid);
  if (!answered.length || mismatch) {
    return [
      ...banners(verify, oid),
      el('h1', null, t('registry.passport', lang)),
      el('h2', { 'data-spid-requested': spid }, spid),
      notice(mismatch
        ? t('verify.result_mismatch', lang, { spid })
        : t('passport.not_found', lang, { spid })),
      el('p', { class: 'muted' }, t('verify.result_none_hint', lang)),
      el('p', null, link('/bpr/verify/', t('registry.verify', lang))),
    ];
  }

  return [
    ...banners(verify, oid, chain),
    ...passportBody(verify, oid, chain, lang),
    el('p', null, link(`/bpr/p/${spid}/`, t('directory.open_dossier', lang))),
  ];
}

// ---------------------------------------------------------------------------
// Screen 5 — verify
// ---------------------------------------------------------------------------

// Exported so the verdict can be exercised without a DOM event: the only moving
// part worth pinning is "which words does the record earn", not the wiring.
//
// One gate. The registry's `verified` is its own claim, set at rung 3 ("only
// after a regulator check", per its _contract); assertClaimCeiling is this
// site's claim, and only rung === maxRung earns a verified badge. Reading the
// registry field alone put a green "the evidence supports this claim" chip one
// line above a badge reading "registered" or "none" — the screen contradicting
// itself with both halves correct.
//
// So a verdict is positive only when both agree, and where they disagree the
// stricter one wins in whichever direction that is: the registry's silence is
// never promoted into a claim just because the ceiling would have allowed one.
export function verdictOf(record) {
  if (!record || typeof record !== 'object') return null;
  const ceiling = assertClaimCeiling(record);
  if (record.verified === false) return 'false';
  if (record.verified === true) return ceiling.verified ? 'true' : 'false';
  return null;
}

export function verificationBlock(record, { lang, spid }) {
  if (!record) {
    return [
      notice(t('verify.result_none', lang, { spid })),
      el('p', { class: 'muted' }, t('verify.result_none_hint', lang)),
      el('p', null, link('/bpr/directory/', t('registry.directory', lang))),
    ];
  }

  const verdict = verdictOf(record);
  const ceilingClaim = record;

  return [
    notice(t(`verify.verdict_${verdict}`, lang), verdict === 'true' ? 'ok' : 'warn'),
    fieldList([
      ['common.spid', el('code', null, record.spid || spid)],
      ['dossier.name', nameOrConsent(record, lang)],
      ['common.trust', plain(record.trust_level, lang)],
      ['verify.membership', record.membership_active
        ? t('verify.membership_active', lang) : t('verify.membership_inactive', lang)],
      ['verify.credentials', yesNo(record.credentials_verified, lang)],
      ['verify.public_profile', yesNo(record.public_profile, lang)],
      ['verify.consent_source', plain(record.consent_source, lang)],
      ['verify.recorded_at', plain(record.registered_at, lang)],
    ], lang),
    section('verify.ladder_position', lang,
      el('p', null, chip(record.verification_label || t('verify.unverified', lang),
        verdict === 'true' ? 'ok' : null)),
      el('p', { class: 'muted' }, rungText(ceilingClaim, lang)),
      el('p', null, link('/bpr/trust/ladder/', t('verify.ladder_cta', lang))),
    ),
    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/passport/${record.spid || spid}/`, t('verify.passport_link', lang))),
        el('li', null, link(`/bpr/p/${record.spid || spid}/`, t('directory.open_dossier', lang))),
      ]),
    ),
  ];
}

function renderVerify(data, { lang }) {
  const { verify } = data;

  const form = el('form', { class: 'card verify-form', id: 'verify-form' },
    el('p', null,
      el('label', { for: 'verify-spid' }, t('verify.input_label', lang)), ' ',
      el('input', {
        id: 'verify-spid', name: 'spid', type: 'text', autocomplete: 'off',
        placeholder: t('verify.input_placeholder', lang),
      })),
    el('p', null, el('button', { id: 'verify-submit', type: 'submit' }, t('verify.cta', lang))),
  );

  return [
    ...banners(verify),
    el('h1', null, t('registry.verify', lang)),
    el('p', { class: 'lede' }, t('verify.lede', lang)),
    el('div', { id: 'verify-result' },
      // The ?spid= deep link is answered on load, so a link can be shared.
      verify && verify.data ? verificationBlock(verify.data, { lang, spid: verify.data.spid }) : null),
    form,
  ];
}

// ---------------------------------------------------------------------------
// Screen 6 — verify by phone (390x844)
// ---------------------------------------------------------------------------

// The answer is a verdict and a rung, and nothing else may compete with it. The
// ladder context stays below the fold, on purpose.
export function phoneBlock(record, { lang, spid }) {
  if (!record) {
    return [notice(t('phone.result_none', lang), 'err')];
  }

  const verdict = verdictOf(record);
  const rung = Number(record.verification_rung);
  const max = Number(record.verification_max_rung);

  return [
    el('div', {
      class: 'phone-answer',
      'data-verdict': verdict || 'unknown',
      'data-spid': record.spid || spid,
    },
      el('p', { class: 'phone-answer-label' }, t('phone.answer_label', lang)),
      // The single largest element on the page: the state, as one word set.
      el('p', { class: 'phone-answer-state' },
        verdict === 'true'
          ? t('verify.verdict_true', lang)
          : verdict === 'false'
            ? t('verify.verdict_false', lang)
            : t('verify.answer_waiting', lang)),
      el('p', { class: 'phone-answer-rung' },
        `${t('phone.rung_readout', lang)} `,
        el('strong', null, Number.isFinite(rung) ? `${rung} / ${Number.isFinite(max) ? max : '—'}` : '—')),
      el('p', { class: 'phone-answer-badge' },
        verificationChip(record, lang)),
      el('p', { class: 'phone-answer-name' },
        el('span', { class: 'phone-answer-name-label' }, `${t('phone.withheld_readout', lang)} `),
        nameOrConsent(record, lang)),
    ),
    el('p', { class: 'muted small phone-tip' }, t('phone.large_answer_tip', lang)),
  ];
}

function renderPhone(data, { lang }) {
  const { verify } = data;

  const form = el('form', { class: 'card phone-form', id: 'phone-form' },
    el('p', null,
      el('label', { for: 'phone-spid' }, t('phone.input_label', lang)), ' ',
      el('input', {
        id: 'phone-spid', name: 'spid', type: 'text', autocomplete: 'off',
        inputmode: 'latin', autocapitalize: 'characters', spellcheck: 'false',
        placeholder: t('verify.input_placeholder', lang),
      })),
    el('p', null, el('button', { id: 'phone-submit', type: 'submit' }, t('phone.cta', lang))),
  );

  return [
    ...banners(verify),
    el('h1', { class: 'phone-title' }, t('registry.verify_phone', lang)),
    el('p', { class: 'lede phone-lede' }, t('phone.lede', lang)),
    el('div', { id: 'phone-result' },
      verify && verify.data
        ? phoneBlock(verify.data, { lang, spid: verify.data.spid })
        : [notice(t('phone.answer_waiting', lang))]),
    form,
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

// A verifier types one identifier and expects one answer. Shared by screens 5
// and 6 so both screens answer identically for the same input.
export async function runLookup(target, { formId, inputId, resultId, lang, render, empty }) {
  const form = target.querySelector(`#${formId}`);
  const input = target.querySelector(`#${inputId}`);
  const out = target.querySelector(`#${resultId}`);
  if (!out) return null;

  const spid = String((input && input.value) || '').trim().toUpperCase();
  if (!spid) {
    out.replaceChildren(...empty(lang));
    return null;
  }

  out.replaceChildren(el('p', { class: 'muted' }, t('common.loading', lang)));
  const verify = await getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`));

  // Same rule as the ladder: a 200 for a different record, or none at all, is
  // "no such member" — never "some member".
  const record = verify.state === 'STALE' || !verify.data || verify.data.spid !== spid
    ? null
    : verify.data;

  out.replaceChildren(...(record
    ? render(record, { lang, spid })
    : empty(lang, spid)));
  if (input) input.value = spid;
  return record;
}

const emptyVerify = (lang, spid) => verificationBlock(null, { lang, spid: spid || '—' });
const emptyPhone = (lang) => [notice(t('phone.answer_waiting', lang))];

function wireLookup(target, options) {
  const form = target.querySelector(`#${options.formId}`);
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    await runLookup(target, options);
  });
}

export async function bootPassport() {
  const lang = currentLang();
  const target = prepare('registry.passport', lang);
  const spid = segmentAfter('passport');

  if (!spid) {
    mount(target, 'passport', { spid: '', verify: null, oid: null, chain: null });
    return;
  }

  const [verify, oid, profile] = await Promise.all([
    getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`)),
    getJSON(registryUrl(`/oid/verify/${encodeURIComponent(spid)}`)),
    getJSON(registryUrl(`/api/profiles/${encodeURIComponent(spid)}`)),
  ]);

  // A chain exists per slot, not per member. Read the first held slot so the
  // passport points at a chain the registry actually serves; a member holding
  // none falls through to the credential address instead.
  const held = profile.state !== 'STALE' && profile.data && Array.isArray(profile.data.slots_held)
    ? profile.data.slots_held.find((s) => s && s.id)
    : null;
  const chain = held
    ? await getJSON(registryUrl(`/slots/${encodeURIComponent(held.id)}/chain`))
    : null;

  mount(target, 'passport', { spid, verify, oid, chain });
}

export async function bootVerify() {
  const lang = currentLang();
  const target = prepare('registry.verify', lang);

  const asked = String(globalThis.location?.search || '');
  const spid = new URLSearchParams(asked).get('spid');
  const verify = spid
    ? await getJSON(registryUrl(`/verify/${encodeURIComponent(spid.trim().toUpperCase())}?format=json`))
    : null;

  mount(target, 'verify', { verify });
  wireLookup(target, {
    formId: 'verify-form', inputId: 'verify-spid', resultId: 'verify-result',
    lang, render: verificationBlock, empty: emptyVerify,
  });
}

export async function bootPhone() {
  const lang = currentLang();
  const target = prepare('registry.verify_phone', lang);

  const asked = String(globalThis.location?.search || '');
  const spid = new URLSearchParams(asked).get('spid');
  const verify = spid
    ? await getJSON(registryUrl(`/verify/${encodeURIComponent(spid.trim().toUpperCase())}?format=json`))
    : null;

  mount(target, 'phone', { verify });
  wireLookup(target, {
    formId: 'phone-form', inputId: 'phone-spid', resultId: 'phone-result',
    lang, render: phoneBlock, empty: emptyPhone,
  });
}

registerView('passport', renderPassport);
registerView('verify', renderVerify);
registerView('phone', renderPhone);
