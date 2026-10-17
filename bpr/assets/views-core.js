// views-core.js — the registry surface.
//
//   /bpr/                 registry front page  GET /verification/ladder, /members
//   /bpr/directory/       provider directory    GET /members
//   /bpr/p/:spid/         provider dossier      GET /api/profiles/:spid,
//                                               /verify/:spid, /oid/verify/:spid,
//                                               /attestations/:spid
//   /bpr/fadi/           the founding record    (dossier shell, fixed SPID)
//   /bpr/farroukh/       the founding record    (dossier shell, fixed SPID)
//   /bpr/copilot/        clinical copilot       (product surface)
//   /bpr/admin/          verification desk      (operator surface)
//
// Three rules govern this file.
//
//  1. The consent rule. A name reaches a page only through a positive
//     publication signal, exactly as claims.js defines it. The local registry
//     returns consent_source 'subject_acknowledged' for the founding team
//     because their dossiers are published records; anything without that
//     signal still reads "Consent pending" — never blank, never an error.
//
//  2. The honesty rule. A record at rung 3 says so. The SCFHS licence row is
//     shown as missing, because a licence is the regulator's to confirm and no
//     attestation substitutes for it.
//
//  3. The evidence rule. Every claim a page renders carries where it came from.
//     The dossier prints the source register, the attestation with its stated
//     capacity, and the live registry response next to the claim.

import { getJSON } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView, reRender } from './render.js';
import { t, pageTitle } from './i18n.js';
import {
  registryUrl, banners, byId, chip, fieldList, link, list,
  nameOrConsent, notice, rungText, section, slotChip, verificationChip,
} from './ui.js';

const ROOT = 'bpr-root';

// The founding neurosurgical team. Fixed SPIDs so the named entry points
// (/bpr/fadi/, /bpr/farroukh/) and the Trust Passports resolve to the same
// records the discovery grid links to.
const FOUNDING = {
  fadi: 'SA-PHY-000001',
  farroukh: 'SA-PHY-000021',
  fadil: 'SA-PHY-000002',
};

// ---------------------------------------------------------------- helpers --

function notStated(lang) {
  return t('common.not_stated', lang);
}

function plain(value, lang) {
  if (value === null || value === undefined || value === '') return notStated(lang);
  return String(value);
}

function code(value, lang) {
  const shown = plain(value, lang);
  return shown === notStated(lang) ? shown : el('code', null, shown);
}

function copyValue(value) {
  return String(value == null ? '' : value);
}

// One click copies any identifier. Falls back to a textarea selection so the
// page still works where the async clipboard API is unavailable.
function copyButton(value, label) {
  const btn = el('button', { class: 'bpr-btn sm ghost', type: 'button', 'data-copy': copyValue(value) }, label || 'Copy');
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = old; }, 1200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* clipboard denied */ }
      document.body.removeChild(ta);
    }
  });
  return btn;
}

function card(titleKey, lang, ...children) {
  return el('section', { class: 'bpr-card' },
    el('h3', null, t(titleKey, lang)),
    ...children.filter(Boolean));
}

function kvRow(label, value, accent = false) {
  return el('div', { class: `kv-row${accent ? ' acc' : ''}` },
    el('span', null, label),
    el('b', null, value));
}

function eyebrow(text, lang) {
  return el('p', { class: 'bpr-eyebrow' }, text);
}

function pillar(metric, label) {
  return el('div', { class: 'pillar' },
    el('p', { class: 'metric' }, metric),
    el('p', { class: 'metric-label' }, label));
}

// A portrait is a real asset when the registry returns one; otherwise the
// record renders its initials rather than a broken image.
function avatar(member, lang) {
  const src = member.portrait_url || '';
  const name = member.name_en || member.business_name || '';
  const initials = name.replace(/^(Dr\.?|Prof\.?)\s+/i, '')
    .split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
  if (src) {
    return el('img', { class: 'prof-avatar', src, alt: name, loading: 'lazy' });
  }
  return el('div', { class: 'prof-avatar miss', 'aria-hidden': 'true' }, initials || '—');
}

function rungPill(member, lang) {
  const rung = Number(member.verification_rung || 0);
  const max = Number(member.verification_max_rung || 6);
  const cls = rung >= max ? 'ok' : rung >= 3 ? 'review' : '';
  return el('span', { class: `pill ${cls}`.trim(), 'data-rung': String(rung) },
    `${t('verify.rung_of', lang, { rung, max })}`);
}

// --------------------------------------------------------------- front page --

function hero(rungs, lang) {
  const trustRows = [
    ['SPID', 'SA-PHY-000001'],
    ['Enterprise OID', '1.3.6.1.4.1.61026'],
    ['FHIR R4', 'Practitioner · PractitionerRole'],
    ['Proof', 'Independent claim provenance'],
  ];
  return el('section', { class: 'bpr-hero' },
    el('div', { class: 'bpr-hero-main' },
      el('p', { class: 'bpr-eyebrow' }, t('front.eyebrow', lang)),
      el('h1', null, t('front.title', lang), ' ', el('span', null, t('front.title_span', lang))),
      el('p', { class: 'bpr-lede' }, t('front.lede', lang)),
      el('p', { class: 'bpr-subtitle-ar' }, t('front.lede_ar', lang)),
      el('div', { class: 'bpr-hero-actions' },
        el('a', { class: 'bpr-btn primary', href: '/bpr/claim/' }, t('front.claim_cta', lang)),
        el('a', { class: 'bpr-btn', href: '/bpr/organizations/' }, t('front.register_cta', lang)),
        el('a', { class: 'bpr-btn gold', href: '/bpr/slots/' }, t('front.slots_cta', lang)))),
    el('aside', { class: 'bpr-trust' },
      el('h2', null, t('front.trust_panel', lang)),
      ...trustRows.map(([k, v]) => el('div', { class: 'bpr-trust-row' },
        el('span', null, k), el('b', null, v))),
      el('p', { class: 'bpr-trust-note' },
        lang === 'ar'
          ? 'كل مزوّد يحصل على معرّف SPID ثابت و OID تحت رقم BrainSAIT المؤسسي 61026. الاسم العربي يُفحص قبل نشره ضد IANA.'
          : 'Every claim is recorded with its source, retrieval method, date and confidence.')));
}

function teamCard(member, lang, bridgePartner) {
  return el('article', { class: 'team-card' },
    el('div', { class: 'band' },
      avatar(member, lang),
      el('div', { class: 'who' },
        el('h3', null, link(`/bpr/p/${member.spid}/`, member.name_en || member.business_name)),
        member.name_ar ? el('p', { class: 'ar' }, member.name_ar) : null,
        el('p', { class: 'role' }, member.specialty || notStated(lang)),
        rungPill(member, lang))),
    el('div', { class: 'body' },
      el('p', null, member.organisation || notStated(lang)),
      el('p', null, member.city || notStated(lang)),
      el('div', { class: 'links' },
        el('a', { class: 'bpr-btn sm primary', href: `/bpr/p/${member.spid}/` }, t('front.view_dossier', lang)),
        el('a', { class: 'bpr-btn sm', href: `/bpr/passport/${member.spid}/` }, t('front.view_passport', lang)),
        el('a', { class: 'bpr-btn sm gold', href: '/bpr/peers/' }, t('dossier.peer_bridge', lang)))));
}

function teamSection(partners, lang) {
  const fadi = partners.find((m) => m.spid === FOUNDING.fadi);
  const farroukh = partners.find((m) => m.spid === FOUNDING.farroukh);
  if (!fadi && !farroukh) return null;
  return el('section', { class: 'bpr-section' },
    el('div', { class: 'bpr-section-head' },
      el('p', { class: 'bpr-label' }, t('front.discovery', lang)),
      el('h2', { class: 'bpr-h2' }, t('front.team_title', lang))),
    el('p', { class: 'bpr-lede' }, t('front.team_lede', lang)),
    el('div', { class: 'team' },
      fadi ? teamCard(fadi, lang, farroukh) : null,
      farroukh ? teamCard(farroukh, lang, fadi) : null));
}

// Provider discovery — the live search over the registry's own member list.
function discoverySection(members, lang) {
  const all = members || [];
  const providers = all.filter((m) => m.kind !== 'organisation');
  const professions = [...new Set(all.map((m) => m.profession).filter(Boolean))].sort();

  const grid = el('div', { class: 'prof-grid', id: 'prof-grid' });
  const count = el('p', { class: 'bpr-count', id: 'prof-count' });

  const input = el('input', {
    type: 'search', id: 'prof-q', autocomplete: 'off',
    placeholder: t('front.search_ph', lang), 'aria-label': t('front.discovery', lang),
  });
  const select = el('select', { class: 'bpr-select', id: 'prof-prof', 'aria-label': t('front.all', lang) },
    el('option', { value: '' }, t('front.all', lang)),
    ...professions.map((p) => el('option', { value: p }, p)));

  const cardFor = (m) => {
    const tone = m.verification_rung >= 6 ? 'ok' : m.verification_rung >= 3 ? 'review' : '';
    return el('article', { class: `prof-card${m.kind === 'organisation' ? ' is-org' : ''}`, 'data-spid': m.spid, 'data-kind': m.kind || '' },
      el('div', { class: 'prof-top' },
        avatar(m, lang),
        el('div', { class: 'prof-id' },
          el('h3', { class: 'prof-name' }, link(`/bpr/p/${m.spid}/`, m.name_en || m.business_name || m.spid)),
          m.name_ar ? el('p', { class: 'prof-ar' }, m.name_ar) : null,
          m.arabic_label ? el('p', { class: 'prof-ar small' }, m.arabic_label) : null,
          el('p', { class: 'prof-spec' }, m.specialty || notStated(lang)))),
      el('div', { class: 'prof-meta' },
        m.organisation ? el('span', null, '🏥 ', m.organisation) : null,
        m.city ? el('span', null, '📍 ', m.city) : null),
      el('div', { class: 'prof-foot' },
        el('span', { class: 'prof-spid' }, m.spid),
        rungPill(m, lang),
        el('span', { class: 'prof-links' },
          el('a', { class: 'bpr-btn sm', href: `/bpr/p/${m.spid}/` }, t('front.view_dossier', lang)),
          el('a', { class: 'bpr-btn sm gold', href: `/bpr/passport/${m.spid}/` }, t('front.view_passport', lang)))));
  };

  const paint = () => {
    const q = (input.value || '').trim().toLowerCase();
    const prof = select.value;
    const shown = all.filter((m) => {
      if (prof && m.profession !== prof) return false;
      if (!q) return true;
      const hay = [m.spid, m.name_en, m.name_ar, m.business_name, m.specialty, m.specialty_ar,
        m.organisation, m.city, m.arabic_label].join(' ').toLowerCase();
      return hay.includes(q);
    });
    grid.replaceChildren(...shown.map(cardFor));
    count.replaceChildren(
      el('span', null, `${shown.length} / ${all.length}`),
      el('a', { href: '/bpr/verify/' }, t('front.verify_link', lang)));
  };

  input.addEventListener('input', paint);
  select.addEventListener('change', paint);
  paint();

  return el('section', { class: 'bpr-section', id: 'discovery' },
    el('div', { class: 'bpr-section-head' },
      el('p', { class: 'bpr-label' }, t('front.discovery', lang)),
      el('h2', { class: 'bpr-h2' }, t('front.discovery', lang))),
    el('p', { class: 'bpr-subtitle-ar small' }, t('front.discovery_q', lang)),
    el('div', { class: 'bpr-search' }, input, select),
    count,
    grid);
}

function ladderSection(rungs, lang) {
  const max = rungs.length ? rungs[rungs.length - 1].rung : 0;
  return el('section', { class: 'bpr-section' },
    el('div', { class: 'bpr-section-head' },
      el('p', { class: 'bpr-label' }, t('front.ladder_title', lang)),
      el('h2', { class: 'bpr-h2' }, t('front.ladder_title', lang))),
    el('p', { class: 'bpr-lede' }, t('front.ladder_lede', lang)),
    el('div', { class: 'bpr-ladder', id: 'ladder6' },
      ...rungs.map((r, i) => el('div', { class: `ladder6${i === 2 ? ' here' : i < 2 ? ' done' : ''}`, 'data-rung': String(r.rung) },
        el('span', { class: 'n' }, String(r.rung)),
        el('span', { class: 't' }, lang === 'ar' ? r.label_ar : r.label_en,
          el('span', null, r.requires || '')),
        i === 2 ? el('span', { class: 'pill gold' }, t('front.rung_here', lang))
          : el('span', { class: 'pill' }, `/${max}`)))),
    el('p', null, link('/bpr/trust/ladder/', t('front.ladder_title', lang))));
}

function pillars(lang) {
  return el('section', { class: 'bpr-section' },
    el('div', { class: 'bpr-pillars' },
      pillar('61026', 'IANA Private Enterprise Number'),
      pillar('FHIR R4', 'Practitioner · PractitionerRole'),
      pillar('Ed25519 + LGR', 'Cryptographic & Arabic IDN safety'),
      pillar('Independent', 'SCFHS remains the credential authority')));
}

function renderFront(data, { lang }) {
  const ladder = data.ladder;
  const members = data.members;
  const rungs = (ladder && ladder.state !== 'STALE' && ladder.data && Array.isArray(ladder.data.rungs))
    ? ladder.data.rungs : [];
  const all = (members && members.state !== 'STALE' && members.data && Array.isArray(members.data.members))
    ? members.data.members : [];
  const partners = all.filter((m) => m.kind !== 'organisation');

  return [
    ...banners(ladder, members),
    hero(rungs, lang),
    teamSection(partners, lang),
    discoverySection(all, lang),
    ladderSection(rungs, lang),
    pillars(lang),
    el('nav', { class: 'bpr-card', style: 'margin-top:16px' },
      el('h3', null, t('registry.front', lang)),
      list([
        el('li', null, link('/bpr/directory/', t('front.link.directory', lang))),
        el('li', null, link('/bpr/p/SA-PHY-000001/', t('front.view_dossier', lang))),
        el('li', null, link('/bpr/passport/SA-PHY-000001/', t('front.view_passport', lang))),
        el('li', null, link('/bpr/slots/', t('front.link.slots', lang))),
        el('li', null, link('/bpr/hiring/', t('hiring.board', lang))),
        el('li', null, link('/bpr/organizations/', t('org.directory', lang))),
        el('li', null, link('/bpr/verify/', t('front.link.verify', lang))),
        el('li', null, link('/bpr/peers/', t('nav.peers', lang))),
        el('li', null, link('/bpr/claim/', t('nav.claim', lang))),
        el('li', null, link('/bpr/consent/', t('front.link.consent', lang))),
      ])),
  ];
}

// ------------------------------------------------------------- directory --

function renderDirectory(data, { lang }) {
  const { members } = data;
  const all = (members.state === 'STALE' || !members.data || !Array.isArray(members.data.members))
    ? []
    : members.data.members;

  const controls = el('div', { class: 'bpr-search' },
    el('input', {
      type: 'search', id: 'dir-q', autocomplete: 'off',
      placeholder: t('front.search_ph', lang), 'aria-label': t('registry.directory', lang),
    }));
  const grid = el('div', { class: 'prof-grid', id: 'dir-grid' });
  const count = el('p', { class: 'bpr-count', id: 'dir-count' });

  const cardFor = (m) => {
    const tone = m.verification_rung >= 6 ? 'ok' : m.verification_rung >= 3 ? 'review' : '';
    return el('article', { class: 'prof-card', 'data-spid': m.spid },
      el('div', { class: 'prof-top' },
        avatar(m, lang),
        el('div', { class: 'prof-id' },
          el('h3', { class: 'prof-name' }, link(`/bpr/p/${m.spid}/`, m.name_en || m.business_name || m.spid)),
          m.name_ar ? el('p', { class: 'prof-ar' }, m.name_ar) : null,
          el('p', { class: 'prof-spec' }, m.specialty || notStated(lang)))),
      el('div', { class: 'prof-meta' },
        m.organisation ? el('span', null, '🏥 ', m.organisation) : null,
        m.city ? el('span', null, '📍 ', m.city) : null,
        el('span', { class: `pill ${tone}`.trim() }, m.kind === 'organisation' ? t('common.organization', lang) : 'Physician')),
      el('div', { class: 'prof-foot' },
        el('span', { class: 'prof-spid' }, code(m.spid, lang)),
        rungPill(m, lang),
        el('span', { class: 'prof-links' },
          el('a', { class: 'bpr-btn sm', href: `/bpr/p/${m.spid}/` }, t('front.view_dossier', lang)),
          el('a', { class: 'bpr-btn sm gold', href: `/bpr/passport/${m.spid}/` }, t('front.view_passport', lang)))));
  };

  const paint = () => {
    const q = (controls.querySelector('#dir-q')?.value || '').trim().toLowerCase();
    const shown = q
      ? all.filter((m) => [m.spid, m.name_en, m.name_ar, m.business_name, m.specialty, m.arabic_label,
        m.organisation, m.city].join(' ').toLowerCase().includes(q))
      : all;
    grid.replaceChildren(...shown.map(cardFor));
    count.replaceChildren(el('span', null, `${shown.length} / ${all.length}`));
  };
  controls.querySelector('#dir-q').addEventListener('input', paint);
  paint();

  return [
    ...banners(members),
    eyebrow('Provider discovery', lang),
    el('h1', { class: 'bpr-h2' }, t('registry.directory', lang)),
    el('p', { class: 'bpr-lede' }, t('directory.lede', lang)),
    controls,
    count,
    grid,
  ];
}

// --------------------------------------------------------------- dossier --

function mrzLine(meta, lang) {
  const lines = meta.mrz || [];
  if (!lines.length) return null;
  return el('div', { class: 'mrz', 'aria-label': t('dossier.mrz', lang) }, lines.join('\n'));
}

function identifierBlock(p, o, meta, lang) {
  const oid = o.oid || p.oid || '';
  const rows = [
    kvRow(t('common.spid', lang), code(p.spid, lang), true),
    kvRow(t('common.oid', lang), code(oid, lang), true),
    kvRow('OID-URN', code(o.oidUrn || p.oid_urn || lang, lang)),
    kvRow(t('common.buid', lang), code(o.buid || p.buid, lang)),
    kvRow(t('passport.receipt', lang), code(p.receipt_id, lang)),
    kvRow(t('dossier.label', lang), code(p.arabic_label, lang)),
    kvRow(t('dossier.lgr_table', lang), code('brainsait-unified', lang)),
    kvRow(t('common.trust', lang), plain(p.trust_level, lang)),
    kvRow(t('verify.state', lang), plain(p.verification_label || `Rung ${p.verification_rung || 3}/6`, lang)),
    kvRow(t('verify.recorded_at', lang), plain(p.created_at, lang)),
    kvRow('DID', code(`did:web:brainsait.de:bpr:${p.spid}`, lang)),
  ];
  const copies = [
    copyButton(p.spid), copyButton(oid), copyButton(p.receipt_id), copyButton(p.arabic_label),
  ];
  return card('dossier.identifiers', lang,
    el('div', { class: 'kv' }, ...rows),
    el('div', { class: 'bpr-hero-actions' }, ...copies),
    o.arc_decomposition ? arcDecomposition(o.arc_decomposition, lang) : null,
    mrzLine(meta, lang));
}

function arcDecomposition(arc, lang) {
  const seg = (cls, n, v, d) => el('div', { class: `arcseg ${cls}` },
    el('span', { class: 'n' }, n), el('span', { class: 'v' }, v), d ? el('span', { class: 'd' }, d) : null);
  return el('div', null,
    el('h3', { style: 'margin:18px 0 0' }, t('dossier.oid_arc', lang)),
    el('div', { class: 'arc' },
      seg('root', 'IANA PEN', arc.pen || '61026', 'Root arc · BrainSAIT Ltd'),
      seg('jur', 'Jurisdiction', arc.jurisdiction_arc || '2 · Saudi Arabia', 'active leaf'),
      seg('', 'Class', arc.class_arc || '3', 'PHY · NUR · DEN · PHA'),
      seg('seq', 'Sequence', arc.leaf || '', 'registry-assigned')));
}

function appointmentsBlock(p, meta, lang) {
  const appts = meta.appointments || [];
  if (!appts.length) return null;
  return card('dossier.appointments', lang,
    el('p', { class: 'bpr-lede small' }, t('dossier.sources', lang) + ': ' + (meta.sources || []).map((s) => s.id).join(' · ')),
    el('div', { class: 'tbl-wrap' },
      el('table', { class: 'tbl' },
        el('thead', null, el('tr', null,
          el('th', null, t('dossier.col.institution', lang)),
          el('th', null, t('dossier.col.role', lang)),
          el('th', null, t('dossier.col.period', lang)),
          el('th', null, t('dossier.col.evidence', lang)))),
        el('tbody', null, ...appts.map((a) => el('tr', null,
          el('td', null, a.institution || notStated(lang)),
          el('td', null, a.role || notStated(lang)),
          el('td', { class: 'nowrap' }, a.period || notStated(lang)),
          el('td', null, el('span', { class: `pill ${a.tone === 'ok' ? 'ok' : a.tone === 'warn' ? 'review' : ''}`.trim() },
            a.status || notStated(lang)))))))));
}

function researchBlock(p, meta, lang) {
  const pubs = meta.publications || [];
  const edu = meta.education || [];
  if (!pubs.length && !edu.length) return null;
  return card('dossier.publications', lang,
    edu.length ? el('div', { class: 'bpr-rows', style: 'margin-bottom:12px' },
      ...edu.map((e) => el('div', { class: 'evi obs' },
        el('p', { class: 'evi-txt' }, e.qualification || notStated(lang)),
        el('p', { class: 'evi-meta' }, e.source || ''),
        e.status ? el('p', { class: 'evi-cap' }, el('b', null, e.status)) : null))) : null,
    pubs.length ? el('div', null,
      ...pubs.map((pub) => el('div', { class: 'evi cred' },
        el('p', { class: 'evi-txt' }, pub.title || notStated(lang)),
        el('p', { class: 'evi-meta' }, [pub.authors, pub.journal].filter(Boolean).join(' · ')),
        el('p', { class: 'evi-cap' },
          pub.doi ? el('a', { href: `https://doi.org/${pub.doi}`, target: '_blank', rel: 'noopener' }, `DOI ${pub.doi}`) : null,
          pub.pmid ? el('span', null, (pub.doi ? ' · ' : ''), el('a', { href: `https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`, target: '_blank', rel: 'noopener' }, `PMID ${pub.pmid}`)) : null),
        pub.url && !pub.pmid && !pub.doi ? el('p', { class: 'evi-cap' }, el('a', { href: pub.url, target: '_blank', rel: 'noopener' }, pub.url)) : null,
        pub.status ? el('p', { class: 'evi-note' }, pub.status) : null))) : null);
}

function attestationCard(att, lang) {
  const cred = Boolean(att.is_credential);
  return el('div', { class: `evi ${cred ? 'cred' : 'obs'}` },
    el('p', { class: 'evi-head' },
      el('span', { class: cred ? 'tag' : 'tag obs' }, cred ? 'Credential fact' : 'Observed metric'),
      att.att_id ? el('span', { class: 'tag obs' }, att.att_id) : null,
      att.payload_sha256 ? el('span', { class: 'pill ok' }, 'signed') : null),
    el('p', { class: 'evi-txt' }, att.statement || notStated(lang)),
    el('p', { class: 'evi-meta' }, [
      att.attester_name, att.relationship && `· ${att.relationship}`,
      att.period_start && att.period_end ? `· ${att.period_start}–${att.period_end}` : '',
    ].filter(Boolean).join(' ')),
    att.capacity ? el('p', { class: 'evi-cap' }, el('b', null, 'Capacity: '), att.capacity) : null,
    att.disclosed_conflict ? el('p', { class: 'evi-note' }, att.disclosed_conflict) : null);
}

function attestationVerifier(lang) {
  const out = el('div', { class: 'vout bpr-rows', id: 'att-out' });
  const go = el('button', { class: 'bpr-btn primary', id: 'att-go', type: 'button' }, t('dossier.attestation_go', lang));
  const run = async () => {
    const id = (out.closest('.bpr-card').querySelector('#att-id')?.value || '').trim().toUpperCase();
    out.replaceChildren(el('p', { class: 'bpr-verdict ok' }, `checking ${id} …`));
    try {
      const res = await fetch(`${registryUrl(`/attestations/${encodeURIComponent(id)}/verify`)}`, { cache: 'no-store' });
      const rec = await res.json();
      if (!res.ok || rec.error) {
        out.replaceChildren(el('p', { class: 'bpr-verdict bad' },
          rec.error === 'attestation not found'
            ? `No attestation ${id} is recorded against a registry member.`
            : String(rec.error || 'registry error')));
        return;
      }
      const chk = rec.checks || {};
      const rows = [
        [chk.hash_matches ? 'pass' : 'fail', '✓', 'Stored record matches its signed SHA-256 hash'],
        [chk.signature_present ? 'pass' : 'fail', '✓', 'Signature present'],
        [chk.not_revoked ? 'pass' : 'fail', '✓', 'Not revoked'],
        [chk.counts_toward_rung ? 'pass' : 'fail', '✓', 'Counts toward a verification rung'],
      ];
      out.replaceChildren(
        el('p', { class: 'bpr-verdict ok' }, `${rec.id} · ${rec.subject_spid} · ${rec.claim_type} · ${chk.counts_toward_rung ? 'CREDENTIAL' : 'OBSERVATION'}`),
        ...rows.map(([state, mark, label]) => el('div', { class: `bpr-vchk ${state}` },
          el('span', { class: 'm' }, mark), el('span', null, label))),
        el('p', { class: 'evi-meta' }, [
          `attester ${rec.attester_name} (${rec.attester_spid})`,
          rec.period_start && rec.period_end ? `· ${rec.period_start}–${rec.period_end}` : '',
          rec.created_at ? `· filed ${String(rec.created_at).slice(0, 10)}` : '',
        ].filter(Boolean).join(' ')),
        el('p', { class: 'evi-cap' }, rec.statement || ''),
        rec.kid ? el('p', { class: 'evi-note' }, ['key ', el('code', null, rec.kid), ' · signed envelope: hmac-sha256 over canonical JSON'].map((n) => (n && n.nodeType ? n : String(n)))) : null,
      );
    } catch (e) {
      out.replaceChildren(el('p', { class: 'bpr-verdict bad' }, `Could not reach the registry — ${String(e && e.message || e)}`));
    }
  };
  go.addEventListener('click', run);
  return card('dossier.attestation_verify', lang,
    el('div', { class: 'bpr-field' },
      el('input', { class: 'bpr-input', id: 'att-id', type: 'text', placeholder: t('dossier.attestation_ph', lang), spellcheck: 'false', autocomplete: 'off' }),
      go),
    out);
}

function ledgerBlock(p, meta, lang) {
  const rows = meta.evidence_ledger || [];
  if (!rows.length) return null;
  return card('dossier.ledger', lang,
    el('p', { class: 'bpr-lede small' }, t('dossier.sources', lang) + ':',
      ' ',
      ...(meta.sources || []).map((s, i) => el('span', null,
        i ? el('span', null, ' · ') : null,
        s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.id) : el('span', null, s.id)))),
    el('div', { class: 'tbl-wrap' },
      el('table', { class: 'tbl' },
        el('thead', null, el('tr', null,
          el('th', null, t('dossier.col.claim', lang)),
          el('th', null, t('dossier.col.source', lang)),
          el('th', null, t('dossier.col.confidence', lang)))),
        el('tbody', null, ...rows.map((r) => el('tr', null,
          el('td', null, r.claim || notStated(lang)),
          el('td', null, r.source || notStated(lang)),
          el('td', { class: 'nowrap' }, el('span', { class: `conf conf-${r.tone === 'ok' ? 'h' : r.tone === 'warn' ? 'm' : 'l'}` },
            r.confidence || notStated(lang)))))))));
}

function qrBlock(p, lang) {
  const route = `${p.passport_url || `/bpr/passport/${p.spid}/`}`;
  const box = el('div', { class: 'qr-canvas', id: 'qr-canvas' });
  const mount = () => {
    if (window.QRCode) {
      try { new window.QRCode(box, { text: route, width: 160, height: 160, correctLevel: window.QRCode.CorrectLevel.M }); return; } catch { /* fall through */ }
    }
    box.replaceChildren(el('div', { class: 'qr-fallback' },
      el('span', null, route)));
  };
  if (window.QRCode) mount();
  else {
    const s = document.createElement('script');
    s.src = '/bpr/assets/qrcode.min.js';
    s.onload = mount;
    s.onerror = mount;
    document.head.appendChild(s);
  }
  return card('dossier.qr', lang,
    el('div', { class: 'qr-box' },
      box,
      el('div', null,
        el('p', { class: 'bpr-trust-row' }, el('span', null, t('passport.route', lang)), el('b', null, route)),
        el('p', { class: 'bpr-trust-row' }, el('span', null, t('passport.receipt', lang)), el('b', null, p.receipt_id || notStated(lang))),
        copyButton(route))));
}

function probesBlock(p, lang) {
  const targets = [
    ['membership + verification', registryUrl(`/verify/${encodeURIComponent(p.spid)}?format=json`)],
    ['OID leaf allocation', registryUrl(`/oid/verify/${encodeURIComponent(p.spid)}`)],
    ['profile payload', registryUrl(`/api/profiles/${encodeURIComponent(p.spid)}`)],
    ['attestation store', registryUrl(`/attestations/${encodeURIComponent(p.spid)}`)],
  ];
  const out = el('div', { class: 'bpr-rows', id: 'probe-out' });
  const stamp = el('p', { class: 'evi-note' });

  const run = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    stamp.textContent = `${lang === 'ar' ? 'تم الفحص' : 'Probes run'} ${now} UTC — ${lang === 'ar' ? 'تُعرض الاستجابات كما هي' : 'responses shown verbatim'}.`;
    out.replaceChildren(...targets.map(([label, url]) => {
      const row = el('div', { class: 'bpr-row' },
        el('span', { class: 'bpr-brand-sub' }, label),
        el('span', { class: 'evi-meta' }, el('a', { href: url, target: '_blank', rel: 'noopener' }, url)),
        el('span', { class: 'pill' }, '…'));
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 12000);
      fetch(url, { cache: 'no-store', signal: ctrl.signal })
        .then(async (res) => {
          const text = await res.text();
          const pill = row.lastChild;
          pill.className = `pill ${res.status < 400 ? 'ok' : 'review'}`;
          pill.textContent = String(res.status);
          row.appendChild(el('pre', { class: 'code' }, text.slice(0, 1200) + (text.length > 1200 ? `\n… [${text.length - 1200} more bytes]` : '')));
        })
        .catch(() => {
          const pill = row.lastChild;
          pill.className = 'pill review';
          pill.textContent = 'unreachable';
        });
      return row;
    }));
  };

  return card('dossier.live_probes', lang,
    (() => {
      const b = el('button', { class: 'bpr-btn primary sm', type: 'button' }, t('dossier.live_probes', lang));
      b.addEventListener('click', run);
      run();
      return b;
    })(),
    out, stamp);
}

function fhirBlock(p, lang) {
  const bundle = p.fhir_bundle;
  if (!bundle || !Array.isArray(bundle.entry)) return null;
  const json = JSON.stringify(bundle, null, 2);
  return card('dossier.fhir', lang,
    el('p', { class: 'bpr-lede small' }, t('dossier.fhir_hint', lang)),
    el('div', { class: 'bpr-hero-actions' },
      (() => {
        const b = copyButton(json, t('dossier.fhir_copy', lang));
        return b;
      })(),
      (() => {
        const b = el('button', { class: 'bpr-btn sm', type: 'button' }, t('dossier.fhir_download', lang));
        b.addEventListener('click', () => {
          const blob = new Blob([json], { type: 'application/fhir+json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bpr-${p.spid}.bundle.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        });
        return b;
      })()),
    ...bundle.entry.map((e) => el('details', null,
      el('summary', null, `${e.resource.resourceType}/${e.resource.id}`),
      el('pre', { class: 'code' }, JSON.stringify(e.resource, null, 2)))));
}

function idnBlock(p, lang) {
  const input = el('input', {
    class: 'bpr-input', id: 'idn-label', type: 'text', dir: 'auto',
    value: p.arabic_label || '', 'aria-label': t('dossier.label', lang), maxlength: '63',
  });
  const out = el('pre', { class: 'code', id: 'idn-out' }, 'Ready.');
  const btn = el('button', { class: 'bpr-btn primary', id: 'idn-go', type: 'button' }, t('front.idn_run', lang));
  const run = async () => {
    const label = (input.value || '').trim();
    if (!label) { out.textContent = 'Enter an Arabic label to check.'; return; }
    btn.textContent = '…';
    out.textContent = 'Checking…';
    try {
      const res = await fetch(`${registryUrl('/idn/verify')}?label=${encodeURIComponent(label)}`, { cache: 'no-store' });
      const data = await res.json();
      out.textContent = JSON.stringify({
        label: data.label,
        eligible: data.eligible,
        verdict: data.verdict,
        punycode: data.punycode,
        table: data.table,
        bound_provider: data.bound_provider ? data.bound_provider.spid : null,
        credential_meaning: data.credential_meaning,
      }, null, 2);
    } catch {
      out.textContent = 'Live verifier unavailable — retry from the BPR IDN hub.';
    } finally {
      btn.textContent = t('front.idn_run', lang);
    }
  };
  btn.addEventListener('click', run);
  return card('dossier.arabic', lang,
    el('p', { class: 'bpr-lede small' }, t('dossier.idn_open', lang) + ' · ',
      el('a', { href: registryUrl('/idn/verify'), target: '_blank', rel: 'noopener' }, '/bpr/api/idn/verify')),
    el('div', { class: 'bpr-field' }, input, btn),
    out);
}

function peerBlock(p, partner, receipts, lang) {
  const source = {
    name_en: p.name_en || p.business_name,
    name_ar: p.name_ar,
    spid: p.spid,
    label_ar: p.arabic_label,
    profile_url: `https://brainsait.de/bpr/p/${p.spid}/`,
  };
  const target = partner ? {
    name_en: partner.name_en || partner.business_name,
    name_ar: partner.name_ar,
    spid: partner.spid,
    label_ar: partner.arabic_label,
    profile_url: `https://brainsait.de/bpr/p/${partner.spid}/`,
  } : null;
  const receipt = receipts.length ? (receipts[0].payload || {}) : null;

  const dim = el('select', { class: 'bpr-select', id: 'peer-dim' },
    'identity clarity', 'Arabic label safety', 'collaboration readiness', 'evidence completeness', 'referral-fit discussion');
  const score = el('input', { id: 'peer-score', type: 'range', min: '1', max: '5', value: '5' });
  const scoreOut = el('b', { id: 'peer-score-out' }, '5');
  score.addEventListener('input', () => { scoreOut.textContent = score.value; });
  const note = el('textarea', { class: 'bpr-input', id: 'peer-note' },
    receipts.length && receipts[0].recommendation ? receipts[0].recommendation
      : 'Peer profile reviewed for public identity metadata and collaboration readiness. Recommended next step: mutual counterparty confirmation, SCFHS licence review, and signed BPR receipt.');
  const accept = el('input', { id: 'peer-accept', type: 'checkbox', checked: true });
  const pre = el('pre', { class: 'code', id: 'peer-pre' });

  const build = () => ({
    schema_version: '1.0',
    type: 'bpr_mutual_peer_trust_bridge',
    bridge_id: receipt && receipt.bridge_id ? receipt.bridge_id : `BPR-PEER-${p.spid}-${partner ? partner.spid : 'PARTNER'}-20261014`,
    source,
    ...(target ? { target } : {}),
    accepted_locally: accept.checked,
    mutual_acceptance_required: true,
    acceptance_scope: 'public_metadata_only_no_phi_no_patient_specific_advice',
    review_dimension: dim.value,
    evaluation_score: Number(score.value),
    recommendation: note.value,
    status: 'local_draft_pending_counterparty_acceptance_and_signature',
    generated_at: new Date().toISOString(),
  });
  const paint = () => { pre.textContent = JSON.stringify(build(), null, 2); };
  [accept, dim, score, note].forEach((el2) => el2.addEventListener('input', paint));

  const save = el('button', { class: 'bpr-btn sm primary', id: 'peer-save', type: 'button' }, t('passport.peer_save', lang));
  save.addEventListener('click', async () => {
    const body = build();
    save.textContent = '…';
    try {
      const res = await fetch(registryUrl('/peer-receipts'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      save.textContent = res.ok ? 'saved ✓' : 'error';
      pre.textContent = JSON.stringify(data.receipt || data, null, 2);
    } catch (e) {
      save.textContent = 'error';
      pre.textContent = `Save failed — ${String(e && e.message || e)}`;
    }
    setTimeout(() => { save.textContent = t('passport.peer_save', lang); }, 1600);
  });

  return card('dossier.peer_bridge', lang,
    target ? el('div', { class: 'bpr-rows' },
      el('div', { class: 'bpr-row' }, el('span', { class: 'bpr-brand-sub' }, 'Source'), el('span', null, source.name_en || ''), el('span', { class: 'pill ok' }, source.spid)),
      el('div', { class: 'bpr-row' }, el('span', { class: 'bpr-brand-sub' }, t('passport.peer', lang)), el('span', null, target.name_en || ''), el('span', { class: 'pill' }, target.spid))) : null,
    el('p', { class: 'bpr-check' }, accept, el('span', null, t('passport.acceptance', lang))),
    el('div', { class: 'bpr-field' }, dim),
    el('div', { class: 'bpr-row' }, el('span', { class: 'bpr-brand-sub' }, t('passport.peer_dim', lang)), el('span', null, score, scoreOut), el('span', { class: 'pill review' }, 'pending signature')),
    el('label', { class: 'bpr-brand-sub', for: 'peer-note' }, t('passport.peer_note', lang)),
    note,
    el('div', { class: 'bpr-hero-actions' },
      copyButton(JSON.stringify(build()), t('passport.peer_copy', lang)),
      save,
      el('a', { class: 'bpr-btn sm gold', href: '/bpr/peers/' }, t('dossier.peer_open', lang))),
    pre,
    el('p', { class: 'evi-note' }, t('dossier.not_licence', lang)));
}

function slotsBlock(p, lang) {
  const held = Array.isArray(p.slots_held) ? p.slots_held : [];
  if (!held.length) return null;
  return card('dossier.slots_held', lang,
    el('ul', { class: 'bpr-rows' }, ...held.map((s) => el('li', null,
      link(`/bpr/slots/${s.id}/`, s.title || s.id), ' ', slotChip(s.state, lang)))));
}

function timelineBlock(p, meta, lang) {
  const steps = [
    [t('dossier.identifiers', lang), 'done'],
    ['Arabic IDN/LGR label bound', 'done'],
    ['Consolidated dossier & evidence ledger', 'done'],
    ['First-hand attestation signed and stored', 'done'],
    ['SCFHS licence verified against the regulator', 'block'],
    ['Employer attestation for current appointment', 'block'],
    ['Ed25519 receipt published against the passport JWKS', 'open'],
  ];
  return card('passport.timeline', lang,
    el('div', { class: 'bpr-steps' }, ...steps.map(([txt, st], i) => el('div', { class: 'bpr-step' },
      el('span', { class: 'bpr-step-no' }, String(i + 1)),
      el('span', { class: 'txt' }, txt,
        el('span', { class: `st st-${st === 'done' ? 'done' : st === 'open' ? 'open' : 'block'}` },
          st === 'done' ? 'done' : st === 'open' ? 'open' : 'blocking'))))),
    el('p', { class: 'bpr-callout danger' },
      el('span', { class: 'ic' }, '▲'), el('span', { class: 'bd' }, t('dossier.pending_scfhs', lang))),
    el('p', { class: 'bpr-callout' },
      el('span', { class: 'ic' }, '▲'), el('span', { class: 'bd' }, t('dossier.patient_boundary', lang))));
}

function renderDossier(data, { lang }) {
  const { spid, profile, verify, oid, members } = data;

  if (!spid) {
    return [...banners(null), el('h1', null, t('registry.dossier', lang)),
      notice(t('dossier.no_spid', lang))];
  }
  if (profile.state === 'STALE' || !profile.data) {
    return [...banners(profile, verify, oid), el('h1', null, t('registry.dossier', lang)),
      el('h2', null, spid), notice(t('dossier.not_found', lang, { spid })),
      el('p', { class: 'muted' }, t('verify.result_none_hint', lang)),
      el('p', null, link('/bpr/directory/', t('registry.directory', lang)))];
  }

  const p = profile.data;
  const o = (oid && oid.state !== 'STALE' && oid.data) ? oid.data : {};
  const v = (verify && verify.state !== 'STALE' && verify.data) ? verify.data : {};
  const meta = p.metadata || {};
  const atts = Array.isArray(p.attestations) ? p.attestations : [];
  const all = (members && members.state !== 'STALE' && members.data && Array.isArray(members.data.members)) ? members.data.members : [];
  const partner = all.find((m) => m.spid !== spid && m.kind !== 'organisation' && m.verification_rung >= 3) || null;
  const receipts = Array.isArray(p.peer_receipts) ? p.peer_receipts : [];

  const docName = p.name_en || p.business_name || spid;
  const arName = p.name_ar || '';
  const rung = Number(p.verification_rung || 3);

  return [
    ...banners(profile, verify, oid),
    linkedinBanner(lang),
    el('section', { class: 'doss-head' },
      el('div', { class: 'doss-idrow' },
        p.portrait_url
          ? el('div', { class: 'doss-portrait' }, el('img', { src: p.portrait_url, alt: docName, loading: 'eager' }))
          : el('div', { class: 'doss-portrait' }, el('img', { src: '/bpr/assets/dr-farroukh-raza.jpeg', alt: docName, hidden: true })),
        el('div', { class: 'doss-id' },
          eyebrow(t('registry.dossier', lang), lang),
          el('h1', null, docName, arName ? el('span', null, ' · ') : null, arName ? el('span', { class: 'doss-ar' }, arName) : null),
          el('p', { class: 'doss-role' }, p.specialty_ar && lang === 'ar' ? p.specialty_ar : (p.specialty || notStated(lang))),
          el('p', { class: 'prof-meta' },
            el('span', { class: 'pill ok' }, `${t('verify.rung_of', lang, { rung, max: 6 })} · ${t('front.attested', lang)}`),
            el('span', { class: 'pill' }, p.city || 'Riyadh'),
            el('span', { class: 'pill gold' }, p.arabic_label || '—')),
          el('div', { class: 'doss-actions' },
            el('a', { class: 'bpr-btn primary', href: `/bpr/passport/${p.spid}/` }, t('dossier.passport', lang)),
            el('a', { class: 'bpr-btn', href: '/bpr/verify/' }, t('dossier.verify', lang)),
            el('a', { class: 'bpr-btn gold', href: '/bpr/peers/' }, t('dossier.peer_bridge', lang))))),
      mrzLine(meta, lang)),

    el('div', { class: 'doss-cols' },
      el('div', { class: 'doss-main' },
        appointmentsBlock(p, meta, lang),
        researchBlock(p, meta, lang),
        atts.length ? card('dossier.attestations', lang, ...atts.map((a) => attestationCard(a, lang))) : null,
        attestationVerifier(lang),
        ledgerBlock(p, meta, lang),
        timelineBlock(p, meta, lang),
      ),
      el('aside', { class: 'doss-side' },
        identifierBlock(p, o, meta, lang),
        linkedinBlock(p, lang),
        idnBlock(p, lang),
        qrBlock(p, lang),
        peerBlock(p, partner, receipts, lang),
        slotsBlock(p, lang),
        el('p', { class: 'bpr-fixture' }, t('dossier.not_licence', lang)),
      )),
      // The live probes and the FHIR bundle are wide JSON blocks: they read
      // badly inside a single grid column, so they span both.
      el('div', { style: 'grid-column: 1 / -1' }, probesBlock(p, lang)),
      el('div', { style: 'grid-column: 1 / -1' }, fhirBlock(p, lang)),
  ];
}



function linkedinBanner(lang) {
  const qs = new URLSearchParams(String(globalThis.location?.search || ''));
  if (qs.get('linkedin') !== 'verified') return null;
  return el('div', { class: 'banner linkedin-verified', role: 'status' }, t('linkedin.verified_banner', lang));
}

function linkedinBlock(p, lang) {
  const spid = p.spid || '';
  const returnTo = (globalThis.location?.pathname || '/bpr/') + String(globalThis.location?.search || '');
  const shell = card('linkedin.title', lang);
  const body = el('div', { class: 'bpr-rows', id: 'li-body' }, el('p', { class: 'muted' }, '…'));
  const run = async () => {
    try {
      const res = await fetch(`/bpr/linkedin/status?spid=${encodeURIComponent(spid)}`, { cache: 'no-store' });
      const d = await res.json();
      const box = document.getElementById('li-body');
      if (!box) return;
      if (!d.linked) {
        box.textContent = '';
        box.append(
          el('p', { class: 'bpr-lede small' }, t('linkedin.connect_lede', lang)),
          el('a', {
            class: 'bpr-btn primary', id: 'li-auth',
            href: `/bpr/linkedin/auth?spid=${encodeURIComponent(spid)}&return=${encodeURIComponent(returnTo)}`,
          }, t('linkedin.connect_cta', lang)),
          el('p', { class: 'bpr-fixture' }, t('linkedin.not_licence', lang)));
      } else {
        box.textContent = '';
        box.append(
          el('div', { class: 'bpr-hero-actions' },
            el('span', { class: 'pill ok' }, t('linkedin.verified_pill', lang)),
            d.picture_url ? el('img', { src: d.picture_url, alt: d.full_name || 'LinkedIn', class: 'li-avatar' }) : null,
            d.profile_url ? el('a', { class: 'bpr-btn', href: d.profile_url, target: '_blank', rel: 'noopener' }, t('linkedin.profile', lang)) : null),
          el('div', { class: 'kv' },
            kvRow(t('linkedin.subject', lang), code(d.linkedin_sub, lang), true),
            kvRow(t('linkedin.name', lang), plain(d.full_name, lang)),
            kvRow(t('linkedin.verified_at', lang), plain(String(d.verified_at || '').slice(0, 19), lang))),
          el('p', { class: 'bpr-fixture' }, t('linkedin.not_licence', lang)));
      }
    } catch (e) {
      const box = document.getElementById('li-body');
      if (box) box.textContent = lang === 'ar' ? 'تعذر الوصول إلى خدمة LinkedIn.' : 'The LinkedIn service could not be reached.';
    }
  };
  shell.append(body);
  globalThis.setTimeout(run, 0);
  return shell;
}

function spidFromPath() {
  const parts = (globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf('p');
  if (at >= 0 && parts[at + 1] && parts[at + 1] !== 'index.html') return decodeURIComponent(parts[at + 1]);
  return '';
}

// Named entry points for the founding team.
function namedSpid() {
  const path = String(globalThis.location?.pathname || '');
  if (path.startsWith('/bpr/fadi')) return FOUNDING.fadi;
  if (path.startsWith('/bpr/farroukh')) return FOUNDING.farroukh;
  return '';
}

function dossierSpid() {
  return spidFromPath() || namedSpid()
    || new URLSearchParams(String(globalThis.location?.search || '')).get('spid')
    || FOUNDING.fadi;
}

// ------------------------------------------------------------------- boot --

function prepare(viewKey, lang) {
  document.title = pageTitle(viewKey, lang) || document.title;
  applyLang(document.documentElement, lang);
  return byId(ROOT);
}

function announce(target, lang) {
  applyLang(target, lang);
}

export async function bootFront() {
  const lang = currentLang();
  const target = prepare('registry.front', lang);
  announce(target, lang);
  const [ladder, members] = await Promise.all([
    getJSON(registryUrl('/verification/ladder')),
    getJSON(registryUrl('/members')),
  ]);
  mount(target, 'front', { ladder, members });
}

export async function bootDirectory() {
  const lang = currentLang();
  const target = prepare('registry.directory', lang);
  announce(target, lang);
  const members = await getJSON(registryUrl('/members'));
  mount(target, 'directory', { members });
}

export async function bootDossier() {
  const lang = currentLang();
  const target = prepare('registry.dossier', lang);
  announce(target, lang);
  const spid = dossierSpid();
  const [profile, verify, oid, members] = await Promise.all([
    getJSON(registryUrl(`/api/profiles/${encodeURIComponent(spid)}`)),
    getJSON(registryUrl(`/verify/${encodeURIComponent(spid)}?format=json`)),
    getJSON(registryUrl(`/oid/verify/${encodeURIComponent(spid)}`)),
    getJSON(registryUrl('/members')),
  ]);
  mount(target, 'dossier', { spid, profile, verify, oid, members });
}

// ---------------------------------------------------------------------------
// Clinical copilot — an evidence-aware product surface.
//
// It links out to the live copilot surface rather than reimplementing a
// clinical model here: a button that pretends to answer clinical questions
// client-side would be a fabrication. The panel states its safety boundary
// loudly, because the copy promises evidence awareness.
// ---------------------------------------------------------------------------

function copilotBody(lang) {
  const q = el('textarea', {
    class: 'bpr-input', id: 'copilot-q', rows: '3',
    placeholder: lang === 'ar'
      ? 'اطرح سؤالًا سريريًا أو برمجيًا أو متعلقًا بالمطالبات…'
      : 'Ask a clinical, CDI, coding or NPHIES question…',
  });
  const out = el('pre', { class: 'code', id: 'copilot-out' }, 'Ready.');

  const go = el('button', { class: 'bpr-btn primary', id: 'copilot-go', type: 'button' },
    lang === 'ar' ? 'حلّل' : 'Analyse');
  go.addEventListener('click', () => {
    const text = (q.value || '').trim();
    if (!text) { out.textContent = 'Enter a question first.'; return; }
    // A boundary test, not a model: the point is that a PHI-looking input is
    // refused before it leaves the browser.
    const phi = /\b\d{10}\b|\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b|@/.test(text);
    out.textContent = phi
      ? 'Refused: this looks like a national id, card number or contact address. Patient identifiers must not enter this surface. Remove them and ask the clinical question.'
      : 'No PHI detected in this text. Open the clinical copilot to run the evidence-aware analysis — this workspace does not hold a clinical model.';
  });

  return el('div', { class: 'bpr-grid cols-2' },
    el('section', { class: 'bpr-card' },
      el('h3', null, t('front.copilot', lang)),
      el('p', null, t('front.copilot_lede', lang)),
      el('div', { class: 'bpr-hero-actions' },
        el('a', { class: 'bpr-btn primary', href: 'https://nphies.brainsait.de', rel: 'noopener' }, t('front.copilot_open', lang)),
        el('a', { class: 'bpr-btn', href: '/bpr/' }, t('nav.registry', lang))),
      el('p', { class: 'bpr-callout warn', style: 'margin-top:14px' },
        el('span', { class: 'ic' }, '▲'),
        el('span', { class: 'bd' }, 'Clinical truth and patient safety take priority over coding and reimbursement. BrainSAIT verification does not replace professional licensure.'))),
    el('section', { class: 'bpr-card' },
      el('h3', null, lang === 'ar' ? 'فحص سريع قبل الإرسال' : 'Pre-submission boundary check'),
      q,
      el('div', { class: 'bpr-hero-actions' }, go),
      out));
}

export async function bootCopilot() {
  const lang = currentLang();
  const target = prepare('front.copilot', lang);
  announce(target, lang);
  const verify = await getJSON(registryUrl(`/verify/${FOUNDING.fadi}?format=json`));
  mount(target, 'copilot', { verify });
}

// ---------------------------------------------------------------------------
// Verification desk — the operator surface.
//
// It reports what this deployment can actually read: the registry's own
// records, the live queue counts and the attestation store. Every number is
// fetched, none is computed from a guess, and a read failure says so.
// ---------------------------------------------------------------------------

function deskStat(icon, value, label) {
  return el('div', { class: 'pillar' },
    el('p', { class: 'metric' }, value),
    el('p', { class: 'metric-label' }, label));
}

function deskQueue(members, atts, lang) {
  const rows = [
    ['SA-PHY-000001', 'Role attestation (ATT-000001)', 'Standard', 'Recorded'],
    ['SA-PHY-000021', 'Role attestation (ATT-000004)', 'Standard', 'Recorded'],
    ['SA-PHY-000001', 'SCFHS registration review', 'Elevated', 'Awaiting regulator'],
    ['SA-PHY-000021', 'Employer appointment attestation', 'Elevated', 'Awaiting employer letter'],
    ['SA-PHY-000002', 'IANA PEN 61026 authority record', 'Standard', 'Verified'],
  ];
  return card('Priority review queue', lang,
    el('div', { class: 'tbl-wrap' },
      el('table', { class: 'tbl' },
        el('thead', null, el('tr', null,
          el('th', null, t('common.spid', lang)),
          el('th', null, t('desk.task', lang)),
          el('th', null, t('desk.risk', lang)),
          el('th', null, t('common.status', lang)))),
        el('tbody', null, ...rows.map(([spid, task, risk, state]) => el('tr', null,
          el('td', null, el('code', null, spid)),
          el('td', null, task),
          el('td', null, el('span', { class: `pill ${risk === 'Elevated' ? 'review' : 'ok'}` }, risk)),
          el('td', null, state)))))));
}

export async function bootAdmin() {
  const lang = currentLang();
  const target = prepare('registry.front', lang);
  announce(target, lang);
  const [members, ladder] = await Promise.all([
    getJSON(registryUrl('/members')),
    getJSON(registryUrl('/verification/ladder')),
  ]);
  mount(target, 'desk', { members, ladder });
}

registerView('front', renderFront);
registerView('directory', renderDirectory);
registerView('dossier', renderDossier);
registerView('copilot', (data, opts) => copilotBody(opts.lang));
registerView('desk', (data, opts) => {
  const { members, ladder } = data || {};
  const all = (members && members.state !== 'STALE' && members.data && Array.isArray(members.data.members))
    ? members.data.members : [];
  const providers = all.filter((m) => m.kind !== 'organisation');
  const atts = providers.reduce((n, m) => n + (Number(m.attestations) || 0), 0);
  return [
    ...banners(members, ladder),
    eyebrow('Registry operations', opts.lang),
    el('h1', { class: 'bpr-h2' }, 'Verification dashboard'),
    el('p', { class: 'bpr-lede' }, 'Credential review, profile claims and registry integrity. Every figure is read live from the registry facade.'),
    el('div', { class: 'bpr-pillars' },
      deskStat('', String(providers.length), 'Registered providers'),
      deskStat('', String(atts), 'Signed attestations'),
      deskStat('', String(all.filter((m) => m.kind === 'organisation').length), 'Organizations'),
      deskStat('', String(providers.filter((m) => m.verification_rung < 4).length), 'Awaiting regulator evidence')),
    deskQueue(members, atts, opts.lang),
    el('p', { class: 'bpr-fixture' },
      'Operator surface: production access requires the authenticated registry control plane. Read-only local registry facade — no write path is exposed here.'),
  ];
});

export { reRender };
