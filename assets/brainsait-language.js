(() => {
  const supported = ['ar', 'en'];
  const storageKey = 'brainsait-language';
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  const language = supported.includes(requested) ? requested : supported.includes(saved) ? saved : document.documentElement.lang;
  const pairs = window.brainsaitTranslations || [];
  const translations = new Map();
  pairs.forEach(([en, ar]) => { translations.set(en, {en, ar}); translations.set(ar, {en, ar}); });
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script,style,[data-language-switch]')) continue;
    const original = node.textContent;
    const text = original.trim();
    if (translations.has(text)) nodes.push({node, original, text, pair: translations.get(text)});
  }
  const attributes=[];
  document.querySelectorAll('[aria-label],[alt],[title]').forEach(el=>{
    ['aria-label','alt','title'].forEach(name=>{
      const value=el.getAttribute(name);
      if(translations.has(value))attributes.push({el,name,pair:translations.get(value)});
    });
  });
  function apply(lang) {
    if (!supported.includes(lang)) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    nodes.forEach(({node, original, text, pair}) => { node.textContent = original.replace(text, pair[lang]); });
    attributes.forEach(({el,name,pair})=>el.setAttribute(name,pair[lang]));
    document.querySelectorAll('[data-language]').forEach(el => { el.hidden = el.dataset.language !== lang; });
    document.querySelectorAll('[data-language-switch]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.languageSwitch === lang)); });
    document.querySelectorAll('[data-localized-direction]').forEach(el => { el.dir = document.documentElement.dir; el.lang = lang; });
    try { localStorage.setItem(storageKey, lang); } catch {}
    window.dispatchEvent(new CustomEvent('brainsait-language', {detail: {lang}}));
  }
  document.querySelectorAll('[data-language-switch]').forEach(button => { button.addEventListener('click', () => apply(button.dataset.languageSwitch)); });
  window.brainsaitSetLanguage = apply;
  apply(language);
})();
