// views-hiring.js — slot, hiring and organizing screens.
//
//   /bpr/hiring/            job board        GET  /jobs?status=&type=&specialty=&q=
//   /bpr/hiring/:jobId/     job detail       GET  /jobs/:id
//                                           POST /jobs/:id/apply
//   /bpr/organizations/     org directory    GET  /organizations?type=&q=
//   /bpr/organizations/:id/ org dossier      GET  /organizations/:id
//
// These screens read the local bpr-hiring mesh service (bpr-hiring.brainsait.de),
// which is backed by braincore-postgres. Unlike the registry screens — where every
// identity is consent-gated — an organisation here is the *poster*, so its name is
// published by the act of posting. Names are still rendered through the same
// helpers so a missing name reads "Not stated" rather than blank.

import { getJSON, stateChip } from './adapter.js';
import { el, applyLang, currentLang, mount, registerView } from './render.js';
import { t, pageTitle } from './i18n.js';
import { banners, byId, chip, fieldList, link, list, notice, section } from './ui.js';

const ROOT = 'bpr-root';

export const HIRING_API = 'https://bpr-hiring.brainsait.de';

export function hiringUrl(path) {
  return `${HIRING_API}${path.startsWith('/') ? path : `/${path}`}`;
}

// A hiring state reaches a page the same legal way a slot state does: stateChip
// decides the word and the tone, and an unrecognised value says so.
function hiringChip(entityClass, value, lang) {
  const entry = stateChip(entityClass, value);
  if (!entry) {
    return el('span', { class: 'chip chip-err', 'data-unknown-state': String(value ?? '') },
      t('common.state_unknown', lang));
  }
  return chip(t(`${entityClass}state.${entry.label}`, lang) ?? entry.label, entry.tone);
}

function pathId(segment) {
  const parts = (globalThis.location?.pathname || '').split('/').filter(Boolean);
  const at = parts.indexOf(segment);
  return at >= 0 && parts[at + 1] ? decodeURIComponent(parts[at + 1]) : '';
}

export function jobIdFromPath() {
  return pathId('hiring');
}

export function orgIdFromPath() {
  return pathId('organizations');
}

// A salary is a number and a currency; an absent salary is "not stated", never a
// zero that reads as unpaid work.
function money(value, lang) {
  // A posting with no salary is 'not stated'. A literal 0 read as an
  // unpaid role, which is a different claim.
  if (value === null || value === undefined || value === '' || Number(value) === 0) {
    return t('common.not_stated', lang);
  }
  return `${value} ${t('common.sar', lang)}`;
}

function textOr(value, lang) {
  if (value === null || value === undefined || value === '') return t('common.not_stated', lang);
  return String(value);
}

// ---------------------------------------------------------------------------
// Screen — job board
// ---------------------------------------------------------------------------

function distinct(values) {
  return [...new Set(values.filter((v) => v !== null && v !== undefined && v !== ''))];
}

function jobRow(job, lang) {
  return el('tr', { 'data-job': job.job_id, 'data-job-status': job.status ?? '' },
    el('td', null, link(`/bpr/hiring/${job.job_id}/`, job.title || job.job_id)),
    el('td', null, el('code', null, job.specialty || '—')),
    el('td', null, el('code', null, job.type || '—')),
    el('td', null, textOr(job.facility_name || job.facility_spid, lang)),
    el('td', null, textOr(job.location, lang)),
    el('td', null, money(job.salary_sar, lang)),
    el('td', null, hiringChip('job', job.status, lang)),
  );
}

function jobTable(rows, lang) {
  return el('table', { id: 'job-table' },
    el('thead', null, el('tr', null,
      el('th', null, t('common.title', lang)),
      el('th', null, t('common.specialty', lang)),
      el('th', null, t('hiring.type', lang)),
      el('th', null, t('common.organization', lang)),
      el('th', null, t('hiring.location', lang)),
      el('th', null, t('hiring.salary', lang)),
      el('th', null, t('common.status', lang)),
    )),
    el('tbody', { id: 'job-body' }, ...rows.map((j) => jobRow(j, lang))),
  );
}

function stateLabel(entityClass, value, lang) {
  const entry = stateChip(entityClass, value);
  if (!entry) return value;
  return t(`${entityClass}state.${entry.label}`, lang) ?? entry.label;
}

function filterSelect(id, labelKey, options, lang, renderOption) {
  const select = el('select', { id },
    el('option', { value: '' }, t('common.all', lang)),
    ...options.map((value) => el('option', { value }, renderOption ? renderOption(value, lang) : value)));
  return el('p', null, el('label', { for: id }, t(labelKey, lang)), ' ', select);
}

function renderJobs(data, { lang }) {
  const { jobs, stats } = data;
  const rows = (jobs.state === 'STALE' || !jobs.data || !Array.isArray(jobs.data.jobs))
    ? []
    : jobs.data.jobs;

  const statusOptions = distinct(rows.map((j) => j.status));
  const typeOptions = distinct(rows.map((j) => j.type));

  const controls = el('div', { class: 'card filter-row', id: 'job-filters' },
    filterSelect('filter-job-status', 'hiring.filter.status', statusOptions, lang,
      (v, l) => stateLabel('job', v, l)),
    filterSelect('filter-job-type', 'hiring.filter.type', typeOptions, lang),
    el('span', { class: 'filter-grow' },
      el('label', { for: 'filter-job-q', class: 'sr-only' }, t('hiring.filter.q', lang)),
      el('input', {
        id: 'filter-job-q', type: 'search', autocomplete: 'off',
        placeholder: t('hiring.filter.q_placeholder', lang),
      })),
    el('button', { id: 'filter-job-reset', type: 'button', class: 'btn' }, t('hiring.filter.reset', lang)),
  );

  const s = (stats.state === 'STALE' || !stats.data || !stats.data.stats) ? null : stats.data.stats;

  return [
    ...banners(jobs, stats),
    el('h1', null, t('hiring.board', lang)),
    el('p', { class: 'lede' }, t('hiring.lede', lang)),
    s
      ? el('p', { class: 'muted' },
          t('hiring.summary', lang, {
            open: s.open_jobs, jobs: s.jobs, apps: s.applications, orgs: s.organizations,
          }))
      : null,
    // The summary above already states the posting count; a second identical
    // line was pure duplication. Kept as the live filter target, just silent
    // until a filter actually narrows the list.
    el('p', { class: 'muted', id: 'job-count' },
      s ? '' : t('hiring.count', lang, { count: rows.length })),
    rows.length ? controls : null,
    rows.length
      ? jobTable(rows, lang)
      : el('p', { class: 'muted' },
          jobs.state === 'STALE' ? t('hiring.empty_service', lang) : t('hiring.empty', lang)),
    el('nav', { class: 'card' },
      list([
        el('li', null, link('/bpr/organizations/', t('hiring.link.orgs', lang))),
        el('li', null, link('/bpr/slots/', t('front.link.slots', lang))),
      ]),
    ),
  ];
}

export function filterJobs(all, { status = '', type = '', q = '' } = {}) {
  const needle = String(q).trim().toLowerCase();
  return all.filter((j) => {
    if (status && j.status !== status) return false;
    if (type && j.type !== type) return false;
    if (needle) {
      const hay = [j.title, j.specialty, j.location, j.facility_name, j.requirements]
        .map((v) => String(v || '').toLowerCase()).join(' ');
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

function wireFilters(target, all, lang) {
  const body = target.querySelector('#job-body');
  if (!body) return;
  const count = target.querySelector('#job-count');
  const statusSel = target.querySelector('#filter-job-status');
  const typeSel = target.querySelector('#filter-job-type');
  const qInput = target.querySelector('#filter-job-q');

  const apply = () => {
    const shown = filterJobs(all, {
      status: statusSel ? statusSel.value : '',
      type: typeSel ? typeSel.value : '',
      q: qInput ? qInput.value : '',
    });
    body.replaceChildren(...shown.map((j) => jobRow(j, lang)));
    if (count) {
      count.textContent = shown.length === all.length
        ? t('hiring.count', lang, { count: all.length })
        : t('hiring.filtered_count', lang, { shown: shown.length, total: all.length });
    }
  };

  for (const node of [statusSel, typeSel]) if (node) node.addEventListener('change', apply);
  if (qInput) qInput.addEventListener('input', apply);
  const reset = target.querySelector('#filter-job-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      if (statusSel) statusSel.value = '';
      if (typeSel) typeSel.value = '';
      if (qInput) qInput.value = '';
      apply();
    });
  }
}

// ---------------------------------------------------------------------------
// Screen — job detail + apply
// ---------------------------------------------------------------------------

function applyForm(jobId, lang) {
  const form = el('form', { id: 'apply-form', class: 'card' },
    el('h2', { class: 'card-title' }, t('hiring.apply.title', lang)),
    el('p', null,
      el('label', { for: 'apply-spid' }, t('hiring.apply.spid', lang)), ' ',
      el('input', { id: 'apply-spid', name: 'applicant_spid', type: 'text', required: 'required',
        placeholder: 'SA-PHY-000001', autocomplete: 'off' })),
    el('p', null,
      el('label', { for: 'apply-name' }, t('hiring.apply.name', lang)), ' ',
      el('input', { id: 'apply-name', name: 'applicant_name', type: 'text', autocomplete: 'name' })),
    el('p', null,
      el('label', { for: 'apply-message' }, t('hiring.apply.message', lang)), ' ',
      el('textarea', { id: 'apply-message', name: 'message', rows: '3' })),
    el('p', null,
      el('button', { type: 'submit' }, t('hiring.apply.submit', lang))),
    el('p', { id: 'apply-status', class: 'muted', role: 'status' }, ''),
  );
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const status = form.querySelector('#apply-status');
    const payload = {
      applicant_spid: form.querySelector('#apply-spid').value.trim(),
      applicant_name: form.querySelector('#apply-name').value.trim(),
      message: form.querySelector('#apply-message').value.trim(),
    };
    if (!payload.applicant_spid) {
      status.textContent = t('hiring.apply.need_spid', lang);
      return;
    }
    status.textContent = t('hiring.apply.sending', lang);
    try {
      const res = await fetch(hiringUrl(`/jobs/${encodeURIComponent(jobId)}/apply`), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        status.textContent = t('hiring.apply.ok', lang, { id: body.application?.app_id || '' });
      } else {
        status.textContent = t('hiring.apply.failed', lang, { error: body.error || `http_${res.status}` });
      }
    } catch (err) {
      status.textContent = t('hiring.apply.failed', lang, { error: 'network_error' });
    }
  });
  return form;
}

function renderJob(data, { lang }) {
  const { jobId, job } = data;

  if (!jobId) {
    return [...banners(job),
      el('h1', null, t('hiring.board', lang)),
      notice(t('hiring.not_found', lang, { id: '—' }))];
  }

  const j = job.state === 'STALE' ? null : (job.data && job.data.job ? job.data.job : null);
  if (!j) {
    return [
      ...banners(job),
      el('h1', null, t('hiring.board', lang)),
      el('h2', { 'data-job-requested': jobId }, jobId),
      notice(t('hiring.not_found', lang, { id: jobId })),
      el('p', null, link('/bpr/hiring/', t('hiring.back', lang))),
    ];
  }

  const apps = Array.isArray(j.applications) ? j.applications : [];

  return [
    ...banners(job),
    el('h1', null, j.title || t('hiring.board', lang)),
    el('p', { class: 'muted', 'data-job': j.job_id },
      t('hiring.detail_lede', lang, { id: j.job_id })),
    fieldList([
      ['common.organization', j.facility_spid
        ? link(`/bpr/organizations/${j.facility_spid}/`, j.facility_name || j.facility_spid)
        : t('common.not_stated', lang)],
      ['hiring.type', el('code', null, j.type || t('common.not_stated', lang))],
      ['common.specialty', el('code', null, j.specialty || t('common.not_stated', lang))],
      ['hiring.location', textOr(j.location, lang)],
      ['hiring.salary', money(j.salary_sar, lang)],
      ['common.status', hiringChip('job', j.status, lang)],
      ['hiring.posted_at', textOr(j.posted_at, lang)],
      ['hiring.expires_at', textOr(j.expires_at, lang)],
    ], lang),
    j.requirements
      ? section('hiring.requirements', lang, el('p', null, j.requirements))
      : null,
    section('hiring.pipeline', lang,
      el('p', { class: 'muted' }, t('hiring.applications_count', lang, { count: j.applications_total || apps.length })),
      apps.length
        ? el('ul', null, ...apps.map((a) => el('li', null,
            el('code', null, a.applicant_spid),
            ' ',
            hiringChip('application', a.status, lang),
            a.score ? el('span', { class: 'muted' }, ` · ${t('hiring.score', lang)}: ${a.score}`) : null)))
        : el('p', { class: 'muted' }, t('common.not_stated', lang)),
    ),
    j.status === 'open' ? applyForm(j.job_id, lang) : null,
    el('p', null, link('/bpr/hiring/', t('hiring.back', lang))),
  ];
}

// ---------------------------------------------------------------------------
// Screen — organisations (facilities, government, provider orgs)
// ---------------------------------------------------------------------------

function orgRow(org, lang) {
  return el('tr', { 'data-org': org.org_id, 'data-org-type': org.type ?? '' },
    el('td', null, link(`/bpr/organizations/${org.org_id}/`, org.name || org.org_id)),
    el('td', null, el('code', null, org.type || '—')),
    el('td', null, el('code', null, org.spid || '—')),
    el('td', null, el('code', null, org.license_number || '—')),
    el('td', null, chip(org.status || t('common.not_stated', lang))),
  );
}

function renderOrganizations(data, { lang }) {
  const { orgs } = data;
  const rows = (orgs.state === 'STALE' || !orgs.data || !Array.isArray(orgs.data.organizations))
    ? []
    : orgs.data.organizations;

  const table = el('table', { id: 'org-table' },
    el('thead', null, el('tr', null,
      el('th', null, t('org.name', lang)),
      el('th', null, t('org.type', lang)),
      el('th', null, t('common.spid', lang)),
      el('th', null, t('org.license', lang)),
      el('th', null, t('common.status', lang)),
    )),
    el('tbody', { id: 'org-body' }, ...rows.map((o) => orgRow(o, lang))),
  );

  return [
    ...banners(orgs),
    el('h1', null, t('org.directory', lang)),
    el('p', { class: 'lede' }, t('org.lede', lang)),
    el('p', { class: 'muted' }, t('org.count', lang, { count: rows.length })),
    rows.length ? table : el('p', { class: 'muted' },
      orgs.state === 'STALE' ? t('hiring.empty_service', lang) : t('org.empty', lang)),
    el('p', null, link('/bpr/hiring/', t('hiring.board', lang))),
  ];
}

function renderOrganization(data, { lang }) {
  const { orgId, org } = data;
  const o = org.state === 'STALE' ? null
    : (org.data && org.data.organization ? org.data.organization : null);
  if (!o) {
    return [
      ...banners(org),
      el('h1', null, t('org.directory', lang)),
      el('h2', null, orgId || '—'),
      notice(t('org.not_found', lang, { id: orgId || '—' })),
      el('p', null, link('/bpr/organizations/', t('org.directory', lang))),
    ];
  }
  const jobs = Array.isArray(o.jobs) ? o.jobs : [];
  return [
    ...banners(org),
    el('h1', null, o.name),
    el('p', { class: 'muted' }, t('org.detail_lede', lang, { id: o.org_id })),
    fieldList([
      ['org.type', el('code', null, o.type || t('common.not_stated', lang))],
      ['common.spid', o.spid ? el('code', null, o.spid) : t('common.not_stated', lang)],
      ['org.license', textOr(o.license_number, lang)],
      ['org.license_expiry', textOr(o.license_expiry, lang)],
      ['org.contact_email', textOr(o.contact_email, lang)],
      ['org.contact_phone', textOr(o.contact_phone, lang)],
      ['common.status', chip(o.status || t('common.not_stated', lang))],
    ], lang),
    section('org.postings', lang,
      el('p', { class: 'muted' }, t('org.open_jobs', lang, { count: o.open_jobs || 0 })),
      jobs.length
        ? el('ul', null, ...jobs.map((j) => el('li', null,
            link(`/bpr/hiring/${j.job_id}/`, j.title || j.job_id), ' ',
            hiringChip('job', j.status, lang))))
        : el('p', { class: 'muted' }, t('common.not_stated', lang)),
    ),
    el('p', null, link('/bpr/organizations/', t('org.directory', lang))),
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

export async function bootHiring() {
  const lang = currentLang();
  const id = jobIdFromPath();

  if (id) {
    const target = prepare('hiring.board', lang);
    const job = await getJSON(hiringUrl(`/jobs/${encodeURIComponent(id)}`));
    mount(target, 'job', { jobId: id, job });
    return;
  }

  const target = prepare('hiring.board', lang);
  const [jobs, stats] = await Promise.all([
    getJSON(hiringUrl('/jobs')),
    getJSON(hiringUrl('/stats')),
  ]);
  mount(target, 'jobs', { jobs, stats });
  const all = (jobs.state !== 'STALE' && jobs.data && Array.isArray(jobs.data.jobs))
    ? jobs.data.jobs : [];
  wireFilters(target, all, lang);
}

export async function bootOrganizations() {
  const lang = currentLang();
  const id = orgIdFromPath();

  if (id) {
    const target = prepare('org.directory', lang);
    const org = await getJSON(hiringUrl(`/organizations/${encodeURIComponent(id)}`));
    mount(target, 'organization', { orgId: id, org });
    return;
  }

  const target = prepare('org.directory', lang);
  const orgs = await getJSON(hiringUrl('/organizations'));
  mount(target, 'organizations', { orgs });
}

registerView('jobs', renderJobs);
registerView('job', renderJob);
registerView('organizations', renderOrganizations);
registerView('organization', renderOrganization);
