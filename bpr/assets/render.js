import { State } from './adapter.js';

// render.js — the page renderer for the static BPR site.
//
// Dependency direction is one-way: adapter.js / claims.js are leaves and never
// import this module, so no cycle is possible. Later work (i18n.js and the page
// tasks) registers *into* this module rather than being imported by it, so
// render.js has no forward dependency on a file that does not exist yet.

// ---------------------------------------------------------------------------
// Minimal element shim
//
// Node has no DOM and we install no packages, so tests cannot use a real
// document. When `document` exists (every browser) the real DOM is used and
// this shim is dead code. The shim implements exactly the surface render.js
// itself relies on — no more — so a passing test exercises the real logic
// rather than a stub written to match the assertion.
// ---------------------------------------------------------------------------

const hasDOM = typeof document !== 'undefined' && typeof document.createElement === 'function';

function camelToData(name) {
  return `data-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

class ShimElement {
  constructor(tagName) {
    this.tagName = String(tagName).toLowerCase();
    this.nodeType = 1;
    this.childNodes = [];
    this.attributes = new Map();
    this.ownerDocument = null;
    this._parent = null;
    this._listeners = new Map();

    const self = this;
    this.dataset = new Proxy({}, {
      get: (_, key) => {
        const v = self.getAttribute(camelToData(String(key)));
        return v === null ? undefined : v;
      },
      set: (_, key, value) => { self.setAttribute(camelToData(String(key)), value); return true; },
      has: (_, key) => self.attributes.has(camelToData(String(key))),
      deleteProperty: (_, key) => { self.attributes.delete(camelToData(String(key))); return true; },
    });

    this.classList = {
      add: (...names) => this._setClasses(this._classes().concat(names.map(String))),
      remove: (...names) => {
        const drop = new Set(names.map(String));
        this._setClasses(this._classes().filter((c) => !drop.has(c)));
      },
      contains: (name) => this._classes().includes(String(name)),
      toggle: (name, force) => {
        const on = force === undefined ? !this.classList.contains(name) : Boolean(force);
        if (on) this.classList.add(name); else this.classList.remove(name);
        return on;
      },
    };
  }

  _classes() {
    return (this.getAttribute('class') || '').split(/\s+/).filter(Boolean);
  }

  _setClasses(list) {
    this.setAttribute('class', [...new Set(list.filter(Boolean))].join(' '));
  }

  get className() { return this.getAttribute('class') || ''; }
  set className(value) { this.setAttribute('class', value); }

  get parentNode() { return this._parent; }
  set parentNode(node) { this._parent = node; }

  get hidden() { return this.attributes.has('hidden'); }
  set hidden(value) {
    if (value === false || value === null || value === undefined) this.attributes.delete('hidden');
    else this.attributes.set('hidden', '');
  }

  setAttribute(name, value) {
    this.attributes.set(
      String(name),
      value === true || value === null || value === undefined ? '' : String(value),
    );
  }

  getAttribute(name) {
    const v = this.attributes.get(String(name));
    return v === undefined ? null : v;
  }

  hasAttribute(name) { return this.attributes.has(String(name)); }
  removeAttribute(name) { this.attributes.delete(String(name)); }

  get children() { return this.childNodes.filter((n) => n.nodeType === 1); }

  _text(value) {
    return { nodeType: 3, textContent: String(value), ownerDocument: this.ownerDocument, parentNode: this };
  }

  appendChild(node) {
    const child = node && node.nodeType ? node : this._text(node);
    child.parentNode = this;
    if (child.ownerDocument === undefined || child.ownerDocument === null) {
      child.ownerDocument = this.ownerDocument;
    }
    this.childNodes.push(child);
    return child;
  }

  append(...nodes) { for (const node of nodes.flat()) this.appendChild(node); }

  replaceChildren(...nodes) { this.childNodes = []; this.append(...nodes); }

  get textContent() {
    return this.childNodes.map((n) => n.textContent).join('');
  }

  set textContent(value) {
    this.childNodes = [];
    if (value !== '' && value !== null && value !== undefined) this.childNodes.push(this._text(value));
  }

  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }

  removeEventListener() {}
  dispatchEvent() { return true; }

  matches(selector) {
    return parseSelector(selector).some((seq) => matchesSequence(this, seq));
  }

  querySelectorAll(selector) {
    const groups = parseSelector(selector);
    const found = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (groups.some((seq) => matchesSequence(child, seq))) found.push(child);
        walk(child);
      }
    };
    walk(this);
    return found;
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

// ---------------------------------------------------------------------------
// Selector matching — tag / #id / .class / [attr] / [attr="v"], joined by a
// descendant or child combinator. Enough for render.js and the screens that
// register into it; deliberately not a general CSS engine.
// ---------------------------------------------------------------------------

function parseCompound(token) {
  const parts = { tag: null, id: null, classes: [], attrs: [] };
  const rest = token.replace(/^([a-zA-Z][\w-]*)/, (m) => { parts.tag = m.toLowerCase(); return ''; });
  const pattern = /#([\w-]+)|\.([\w-]+)|\[([\w-]+)(?:[~^$*|]?=)?\s*["']?([^\]"']*)["']?\]/g;
  let m;
  while ((m = pattern.exec(rest)) !== null) {
    if (m[1]) parts.id = m[1];
    else if (m[2]) parts.classes.push(m[2]);
    else parts.attrs.push({ name: m[3], value: m[4] === undefined ? null : m[4] });
  }
  return parts;
}

function parseSelector(selector) {
  return String(selector)
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => {
      const seq = [];
      let combinator = 'descendant';
      for (const token of group.replace(/>/g, ' > ').split(/\s+/).filter(Boolean)) {
        if (token === '>') { combinator = 'child'; continue; }
        seq.push({ combinator, compound: parseCompound(token) });
        combinator = 'descendant';
      }
      return seq;
    })
    .filter((seq) => seq.length > 0);
}

function matchesCompound(node, parts) {
  if (!node || node.nodeType !== 1) return false;
  if (parts.tag && node.tagName !== parts.tag) return false;
  if (parts.id && node.getAttribute('id') !== parts.id) return false;
  for (const cls of parts.classes) if (!node.classList.contains(cls)) return false;
  for (const attr of parts.attrs) {
    if (!node.hasAttribute(attr.name)) return false;
    if (attr.value !== null && attr.value !== '' && node.getAttribute(attr.name) !== attr.value) return false;
  }
  return true;
}

function matchesSequence(node, seq) {
  if (!matchesCompound(node, seq[seq.length - 1].compound)) return false;
  let current = node;
  for (let i = seq.length - 2; i >= 0; i -= 1) {
    if (seq[i + 1].combinator === 'child') {
      current = current.parentNode;
      if (!matchesCompound(current, seq[i].compound)) return false;
    } else {
      let parent = current.parentNode;
      while (parent && !matchesCompound(parent, seq[i].compound)) parent = parent.parentNode;
      if (!parent) return false;
      current = parent;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Element factory
// ---------------------------------------------------------------------------

function textNode(value) {
  return hasDOM ? document.createTextNode(String(value)) : value;
}

// el('p', { class: 'banner-title', dataset: { i18n: 'x' } }, 'text', child)
export function el(tag, props = null, ...children) {
  const node = hasDOM ? document.createElement(tag) : new ShimElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.setAttribute('class', String(value));
      else if (key === 'dataset') {
        for (const [dataKey, dataValue] of Object.entries(value)) {
          if (dataValue === null || dataValue === undefined) continue;
          node.setAttribute(camelToData(dataKey), String(dataValue));
        }
      } else if (key === 'hidden') node.hidden = Boolean(value);
      else node.setAttribute(key, value === true ? '' : String(value));
    }
  }

  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(child && child.nodeType ? child : textNode(child));
  }
  return node;
}

// ---------------------------------------------------------------------------
// Status banner — the STALE disclosure.
//
// hidden = true for LIVE and UNVERIFIED only. Every other state — including a
// state this module does not recognise — stays visible, because we never claim
// a live reading we did not get.
// ---------------------------------------------------------------------------

const HIDDEN_STATES = new Set([State.LIVE, State.UNVERIFIED]);

const COPY = {
  en: {
    title: 'Live registry unreachable',
    body: 'This record could not be reached from the registry just now. What appears below is the last copy embedded on this page, not a live reading.',
    reason: 'Reason',
    lastRead: 'Last successful read',
  },
  ar: {
    title: 'تعذّر الوصول إلى السجل المباشر',
    body: 'تعذّر الوصول إلى هذا السجل من الخادم الآن. ما يظهر أدناه هو النسخة الأخيرة المضمّنة في الصفحة، وليس قراءة حية.',
    reason: 'السبب',
    lastRead: 'آخر قراءة ناجحة',
  },
};

export function statusBanner(result, { lang = currentLang() } = {}) {
  const state = result && typeof result.state === 'string' ? result.state : 'UNKNOWN';
  const primary = lang === 'ar' ? 'ar' : 'en';

  const banner = el('div', { class: 'banner', 'data-state': state, role: 'status' });

  if (HIDDEN_STATES.has(state)) {
    banner.hidden = true;
    return banner;
  }

  // Only a real timestamp is ever printed. getJSON reports fetchedAt=null on
  // every STALE, so there is nothing to show here and nothing to invent.
  const fetchedAt = result && typeof result.fetchedAt === 'string' ? Date.parse(result.fetchedAt) : NaN;
  const error = result && result.error ? String(result.error) : null;

  const body = el('div', { class: 'banner-body' },
    el('p', { class: 'banner-title' }, COPY[primary].title),
    el('p', { lang: 'en', dir: 'ltr' }, COPY.en.body),
    el('p', { lang: 'ar', dir: 'rtl' }, COPY.ar.body),
  );

  if (error) {
    body.appendChild(el('p', { class: 'banner-meta' },
      el('span', { lang: 'en', dir: 'ltr' }, `${COPY.en.reason}: ${error} `),
      el('span', { lang: 'ar', dir: 'rtl' }, `${COPY.ar.reason}: ${error}`),
    ));
  }

  if (Number.isFinite(fetchedAt)) {
    const iso = new Date(fetchedAt).toISOString();
    body.appendChild(el('p', { class: 'banner-meta' },
      el('span', { lang: 'en', dir: 'ltr' }, `${COPY.en.lastRead}: `),
      el('time', { datetime: iso }, iso),
    ));
  }

  banner.append(
    el('span', { class: 'banner-icon', 'aria-hidden': 'true' }, '⚠'),
    body,
  );

  return banner;
}

// ---------------------------------------------------------------------------
// Language
// ---------------------------------------------------------------------------

export const LANGS = ['en', 'ar'];
const STORAGE_KEY = 'bpr.lang';

function isLang(value) { return value === 'ar' || value === 'en'; }

// ?lang= wins so a shared deep link survives a reload; anything unrecognised is
// ignored rather than rendered.
function langFromQuery() {
  try {
    const search = globalThis.location && globalThis.location.search;
    if (!search) return null;
    const value = new URLSearchParams(search).get('lang');
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

function langFromStorage() {
  try {
    const store = globalThis.localStorage;
    if (!store || typeof store.getItem !== 'function') return null;
    const value = store.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;  // storage throws when disabled; a language is not worth a crash
  }
}

export function currentLang() {
  return langFromQuery() ?? langFromStorage() ?? 'en';
}

let translator = null;

// i18n.js (task 5) registers here. Until then applyLang still sets dir/lang and
// leaves existing copy in place — it never blanks text it cannot translate.
export function registerTranslator(fn) { translator = typeof fn === 'function' ? fn : null; }

export function translate(key, lang) {
  if (!translator) return null;
  try {
    const value = translator(key, lang);
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
}

function langRoot(root) {
  if (!root) return null;
  if (typeof root.setAttribute === 'function') return root;
  if (root.documentElement && typeof root.documentElement.setAttribute === 'function') {
    return root.documentElement;
  }
  return null;
}

export function applyLang(root, lang) {
  const resolved = isLang(lang) ? lang : currentLang();
  const target = langRoot(root);

  if (target) {
    target.setAttribute('lang', resolved);
    target.setAttribute('dir', resolved === 'ar' ? 'rtl' : 'ltr');
  }

  if (!root || typeof root.querySelectorAll !== 'function') return root;

  for (const node of root.querySelectorAll('[data-i18n]')) {
    const key = node.getAttribute('data-i18n');
    if (!key) continue;
    const text = translate(key, resolved);
    if (text !== null) node.textContent = text;
  }

  return root;
}

export function setLang(lang) {
  const resolved = isLang(lang) ? lang : 'en';
  try {
    const store = globalThis.localStorage;
    if (store && typeof store.setItem === 'function') store.setItem(STORAGE_KEY, resolved);
  } catch {
    /* a language choice that cannot be remembered is still applied for this page */
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// mount — registry-driven so later page tasks add screens here, not in here.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Application shell — the topbar and footer wrapping every BPR screen.
//
// Built once per page load and reused across re-renders, so a language switch
// refreshes only the view beneath it. It lives in render.js rather than in any
// one view: the registry product is a set of documents (dossier, passport,
// ledger) inside one chrome, and a document a reader can get lost in is a
// defect of the product, not of the page.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { href: '/bpr/', key: 'nav.registry' },
  { href: '/bpr/directory/', key: 'nav.directory' },
  { href: '/bpr/fadi/', key: 'nav.fadi' },
  { href: '/bpr/farroukh/', key: 'nav.farroukh' },
  { href: '/bpr/organizations/', key: 'nav.orgs' },
  { href: '/bpr/hiring/', key: 'nav.hiring' },
  { href: '/bpr/slots/', key: 'nav.slots' },
  { href: '/bpr/peers/', key: 'nav.peers' },
  { href: '/bpr/claim/', key: 'nav.claim' },
  { href: '/bpr/verify/', key: 'nav.verify' },
  { href: '/bpr/copilot/', key: 'nav.copilot' },
  { href: '/bpr/desk/', key: 'nav.desk' },
];

function currentPath() {
  return String(globalThis.location?.pathname || '/');
}

function buildShell() {
  const lang = currentLang();
  const path = currentPath();

  const bar = el('nav', { class: 'bpr-topbar', 'aria-label': 'BPR navigation' });
  const inner = el('div', { class: 'bpr-topbar-inner' });
  inner.appendChild(el('a', { class: 'bpr-brand', href: '/bpr/' },
    el('span', { class: 'bpr-mark' }, 'BPR'),
    el('span', { class: 'bpr-brand-text' },
      el('span', { 'data-i18n': 'shell.brand' }),
      el('span', { class: 'bpr-brand-sub', 'data-i18n': 'shell.brand_sub' }))));

  const nav = el('div', { class: 'bpr-nav' });
  for (const item of NAV_LINKS) {
    const isActive = path === item.href || (item.href !== '/bpr/' && path.startsWith(item.href));
    nav.appendChild(el('a', {
      href: item.href,
      'data-i18n': item.key,
      ...(isActive ? { 'aria-current': 'page' } : {}),
    }));
  }
  inner.appendChild(nav);

  const actions = el('div', { class: 'bpr-actions' });
  actions.appendChild(el('span', { class: 'bpr-status' },
    el('span', { class: 'dot' }),
    el('span', { 'data-i18n': 'shell.live' })));
  const langBtn = el('button', { class: 'bpr-iconbtn', id: 'bpr-lang', type: 'button' },
    lang === 'ar' ? 'EN' : 'العربية');
  langBtn.setAttribute('aria-label', 'Switch language / اللغة');
  langBtn.addEventListener('click', () => {
    const next = currentLang() === 'ar' ? 'en' : 'ar';
    setLang(next);
    applyLang(globalThis.document.documentElement, next);
    langBtn.textContent = next === 'ar' ? 'EN' : 'العربية';
    reRender();
  });
  actions.appendChild(langBtn);

  const themeBtn = el('button', { class: 'bpr-iconbtn', id: 'bpr-theme', type: 'button', 'aria-pressed': 'false' }, '☾');
  themeBtn.setAttribute('aria-label', 'Switch theme / المظهر');
  const applyTheme = (light) => {
    const root = globalThis.document.documentElement;
    if (light) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    themeBtn.textContent = light ? '☀' : '☾';
    themeBtn.setAttribute('aria-pressed', String(light));
    try { globalThis.localStorage.setItem('bpr.theme', light ? 'light' : 'dark'); } catch { /* private mode */ }
  };
  themeBtn.addEventListener('click', () => {
    applyTheme(globalThis.document.documentElement.getAttribute('data-theme') !== 'light');
  });
  let light = false;
  try { light = globalThis.localStorage.getItem('bpr.theme') === 'light'; } catch { /* private mode */ }
  applyTheme(light);
  actions.appendChild(themeBtn);
  inner.appendChild(actions);
  bar.appendChild(inner);

  const page = el('div', { class: 'bpr-page', id: 'bpr-content' });

  const foot = el('footer', { class: 'bpr-foot' });
  foot.appendChild(el('span', null,
    el('span', { 'data-i18n': 'shell.foot' }), ' · ', 'IANA PEN 61026 · FHIR R4 · IDN/LGR'));
  const links = el('span');
  const footLinks = [['/bpr/', 'nav.registry'], ['/command/', 'shell.command'], ['/partner/', 'shell.partner']];
  footLinks.forEach(([href, key], i) => {
    if (i) links.appendChild(el('span', null, ' · '));
    links.appendChild(el('a', { href, 'data-i18n': key }));
  });
  foot.appendChild(links);

  const wrap = el('div', { id: 'bpr-shell' });
  wrap.appendChild(bar);
  wrap.appendChild(page);
  wrap.appendChild(foot);
  applyLang(wrap, lang);
  return wrap;
}

const views = new Map();

export function registerView(name, renderer) {
  if (typeof renderer === 'function') views.set(String(name), renderer);
}

let lastTarget = null;
let lastView = null;
let lastData = null;
let contentNode = null;

// Re-draw the current screen without re-fetching. The language toggle uses it:
// the shell is reused, so its own copy is translated in place too.
export function reRender() {
  if (!lastTarget || !lastView) return null;
  const out = mount(lastTarget, lastView, lastData);
  const shell = lastTarget.querySelector('#bpr-shell');
  if (shell) applyLang(shell, currentLang());
  return out;
}

function appendTo(target, node) {
  target.appendChild(node && node.nodeType ? node : textNode(node));
}

export function mount(target, view, data = null) {
  if (!target) throw new TypeError('mount: target element is required');
  const name = String(view);
  const lang = currentLang();
  const renderer = views.get(name);

  // The shell is the page chrome: rebuilt only when this is a fresh load, so a
  // re-mount (language switch) replaces the document inside the same topbar.
  if (!target.querySelector('#bpr-shell')) {
    target.replaceChildren();
    target.appendChild(buildShell());
  }
  contentNode = target.querySelector('#bpr-content');
  if (!contentNode) {
    target.replaceChildren();
    target.appendChild(buildShell());
    contentNode = target.querySelector('#bpr-content');
  }
  contentNode.replaceChildren();

  lastTarget = target;
  lastView = name;
  lastData = data;

  if (!renderer) {
    // An unknown screen must never render as an empty page: that reads as
    // "nothing to show" and hides the fact that the screen is missing.
    appendTo(contentNode, el('p', { class: 'muted', 'data-state': 'UNRENDERED' },
      lang === 'ar' ? `الشاشة غير متاحة: ${name}` : `Screen unavailable: ${name}`));
    return target;
  }

  const produced = renderer(data, { lang });
  for (const node of [produced].flat()) {
    if (node === null || node === undefined || node === false) continue;
    appendTo(contentNode, node);
  }

  applyLang(contentNode, lang);
  return target;
}

export { ShimElement };