// views-consent.js — screen 21, consent capture (task 10).
//
//   /bpr/consent/   GET /verify/:spid?format=json   (the consent record)
//                   GET /partner/:spid              (where identity is nested)
//
// This is the empowerment unlock, so it has to be honest in both directions: it
// must tell a member exactly what is being held back, and it must not pretend a
// tick box here changed anything at the registry.
//
// It changes nothing. Recording consent is a registry write that requires
// operator access, and that write is made server-side by an operator holding it.
// This page stages the acknowledgement locally and says so plainly. There is no
// token here, there is no endpoint here that writes, and there is deliberately
// no code path that could add one.

import { getJSON } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import { consentState, describeWithheld, isRedactedName } from './consent.js';
import {
  registryUrl, banners, byId, chip, fieldList, link, list, notice, section,
  rungText, verificationChip,
} from './ui.js';

const ROOT = 'bpr-root';

// The member this screen opens on when the URL carries no identifier. It is the
// registry's own seeded member and exists so the screen is never blank on
// arrival; every link into it carries an explicit SPID.
const DEFAULT_SPID = 'SA-PHY-000001';

// ---------------------------------------------------------------------------
// The withheld-field list
// ---------------------------------------------------------------------------

// Each field is named as the registry named it — that is the contract the member
// is being shown — and tagged with whether the identity rule is what took it. A
// field the rule would have taken and a field that was simply never filled in
// are not the same thing, and telling a member their record is being hidden when
// it is merely empty would be its own kind of dishonesty.
function fieldChips(fields, lang) {
  if (!fields.length) return el('p', { class: 'muted' }, t('consent.no_fields', lang));
  return el('ul', { class: 'field-chips' }, ...fields.map((path) => el('li', null,
    el('code', null, path),
    ' ',
    isRedactedName(String(path).split('.').pop())
      ? chip(t('consent.field_redacted', lang), 'warn')
      : chip(t('consent.field_unpopulated', lang)),
  )));
}

// The registry's own words when it offered a reason, labelled as such. When it
// did not, the page says that instead of printing a default sentence as though
// the registry had written it.
function reasonNode(state, lang) {
  if (state.reasonSource === 'registry') {
    return el('div', null,
      el('p', null, state.reason),
      el('p', { class: 'muted small' }, t('consent.reason_source', lang)));
  }
  return el('div', null,
    notice(t('consent.reason_default', lang)),
    el('p', { class: 'muted small' }, t('consent.reason_inferred', lang)));
}

// consent_source is a small closed vocabulary and each value means something
// different about who decided. Only one of them publishes, so it is spelled out
// rather than echoed.
function sourceNode(source, lang) {
  if (source === 'subject_acknowledged') {
    return el('p', null, t('consent.source_acknowledged', lang));
  }
  if (source === 'operator_asserted') {
    return el('p', null, t('consent.source_operator_asserted', lang));
  }
  if (!source) return el('p', { class: 'muted' }, t('consent.source_none', lang));
  return el('p', null, t('consent.source_other', lang, { source }));
}

// ---------------------------------------------------------------------------
// The acknowledgement control
// ---------------------------------------------------------------------------

// Deliberately inert against the registry. Ticking records the choice in this
// document only, and the notice that appears says exactly that — so nobody can
// walk away believing a name was published.
function acknowledgementBlock(spid, lang) {
  const staged = el('div', { id: 'ack-staged', hidden: true },
    el('p', { class: 'gate-title' }, t('consent.ack_staged_title', lang)),
    el('p', null, t('consent.ack_staged_body', lang)),
  );

  const box = el('input', {
    type: 'checkbox', id: 'ack-box', 'data-spid': spid || '',
  });

  const ack = el('div', { class: 'ack' }, box,
    el('label', { for: 'ack-box' }, t('consent.ack_label', lang)));

  box.addEventListener('change', () => {
    staged.hidden = !box.checked;
  });

  return [
    section('consent.ack_title', lang,
      el('p', null, t('consent.ack_body', lang)),
      ack,
      staged,
    ),
    // The operator note. It names no credential and offers no field to enter
    // one, because this page has no write path to protect.
    el('div', { class: 'gate' },
      el('p', { class: 'gate-title' }, t('consent.ack_title', lang)),
      el('p', null, t('consent.ack_operator_note', lang)),
      el('p', { class: 'muted small' }, t('consent.ack_operator_cta', lang)),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Screen 21 — consent capture
// ---------------------------------------------------------------------------

function renderConsent(data, { lang }) {
  const { spid, verify, partner } = data;

  if (!spid) {
    return [...banners(verify, partner),
      el('h1', null, t('registry.consent', lang)),
      notice(t('consent.not_found', lang, { spid: '—' }))];
  }

  // /verify is the consent record: it carries consent_source, withheld_reason
  // and the verification axes. /partner is where identity is nested, so its own
  // enumeration is shown as a second group rather than merged into the first —
  // two different reads, two different lists, neither pretending to be the other.
  const record = verify.state === 'STALE' ? null : verify.data;
  if (!record || (record.spid && record.spid !== spid)) {
    return [
      ...banners(verify, partner),
      el('h1', null, t('registry.consent', lang)),
      el('h2', { 'data-spid-requested': spid }, spid),
      notice(t('consent.not_found', lang, { spid })),
      el('p', null, link('/bpr/directory/', t('registry.directory', lang))),
    ];
  }

  const state = consentState(record);
  const credentialFields = describeWithheld(record);
  const partnerFields = partner.state === 'STALE'
    ? null
    : describeWithheld(partner.data);

  return [
    ...banners(verify, partner),
    el('h1', null, t('registry.consent', lang)),
    el('p', { class: 'lede' }, t('consent.screen_lede', lang)),

    section('consent.state_label', lang,
      fieldList([
        ['common.spid', el('code', null, spid)],
        ['consent.state_label', state.withheld
          ? chip(t('consent.pending', lang), 'warn')
          : chip(t('consent.granted', lang), 'ok')],
        ['consent.source_label', sourceNode(state.consentSource, lang)],
        ['consent.public_profile', state.publicProfile
          ? t('common.yes', lang) : t('common.no', lang)],
        ['common.trust', record.trust_level || t('common.not_stated', lang)],
        ['verify.badge_label', verificationChip(record, lang)],
      ], lang),
      el('p', { class: 'muted' }, rungText(record, lang)),
      el('h3', null, t('consent.reason_label', lang)),
      reasonNode({ ...state, reason: credentialFields.reason,
        reasonSource: credentialFields.reasonSource }, lang),
    ),

    section('consent.credential_fields', lang,
      el('p', { class: 'muted' },
        t('consent.field_count', lang, { count: credentialFields.fields.length })),
      fieldChips(credentialFields.fields, lang),
    ),

    partnerFields
      ? section('consent.partner_fields', lang,
          el('p', { class: 'muted' },
            t('consent.field_count', lang, { count: partnerFields.fields.length })),
          fieldChips(partnerFields.fields, lang))
      : null,

    section('consent.does_title', lang,
      list([
        el('li', null, t('consent.does_1', lang)),
        el('li', null, t('consent.does_2', lang)),
        el('li', null, t('consent.does_3', lang)),
      ])),

    section('consent.doesnot_title', lang,
      list([
        el('li', null, t('consent.doesnot_1', lang)),
        el('li', null, t('consent.doesnot_2', lang)),
        el('li', null, t('consent.doesnot_3', lang)),
        el('li', null, t('consent.doesnot_4', lang)),
      ])),

    ...acknowledgementBlock(spid, lang),

    el('nav', { class: 'card' },
      list([
        el('li', null, link(`/bpr/p/${spid}/`, t('directory.open_dossier', lang))),
        el('li', null, link(`/bpr/passport/${spid}/`, t('registry.passport', lang))),
        el('li', null, link('/bpr/verify/', t('registry.verify', lang))),
      ]),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

export async function bootConsent() {
  const lang = currentLang();
  document.title = pageTitle('registry.consent', lang) || document.title;
  applyLang(document.documentElement, lang);
  const target = byId(ROOT);
  applyLang(target, lang);

  const asked = new URLSearchParams(String(globalThis.location?.search || ''));
  const spid = (asked.get('spid') || DEFAULT_SPID).trim().toUpperCase();

  const [verify, partner] = await Promise.all([
    getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`)),
    getJSON(registryUrl(`/partner/${encodeURIComponent(spid)}`)),
  ]);

  mount(target, 'consent', { spid, verify, partner });
}

registerView('consent', renderConsent);
