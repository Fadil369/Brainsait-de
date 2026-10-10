/* BrainSAIT Ecosystem Nav — unified cross-domain bar (BSD-2026-07 Art. 2 & 15.4)
 * Include with: <script src="/assets/ecosystem-nav.js" defer></script>
 * Renders a slim premium bar (navy/gold) linking every core domain. RTL-aware. */
(function () {
  // ALL ecosystem entry points originate at brainsait.de. The brand mark links
  // home to the apex; every other property is reachable from there.
  var HOME = "https://brainsait.de";
  var domains = [
    { label: "Home", ar: "الرئيسية", url: HOME },
    { label: "Store", ar: "المتجر", url: HOME + "/store" },
    { label: "Marketplace", ar: "السوق", url: "https://market.brainsait.de" },
    { label: "Capsules", ar: "الكبسولات", url: "https://notebooks.brainsait.de" },
    { label: "Academy", ar: "الأكاديمية", url: "https://academy.brainsait.de" },
    { label: "Portal", ar: "البوابة", url: HOME + "/portal" },
    { label: "MOM Food", ar: "موم فود", url: "https://momfood.de" },
    { label: "Governance", ar: "الحوكمة", url: HOME + "/governance/" }
  ];
  var isAr = (document.documentElement.lang || "").indexOf("ar") === 0;
  var here = location.hostname.replace(/^www\./, "");
  var bar = document.createElement("nav");
  bar.id = "bs-eco-nav";
  bar.setAttribute("aria-label", "BrainSAIT ecosystem");
  var css = document.createElement("style");
  css.textContent =
    "#bs-eco-nav{position:sticky;top:0;z-index:99990;background:#0b1f3a;border-bottom:2px solid #c9a227;" +
    "font:500 13px/1 Tajawal,-apple-system,sans-serif;padding:0 12px;display:flex;align-items:center;" +
    "gap:2px;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}" +
    "#bs-eco-nav a{color:#f7f2e7;text-decoration:none;padding:9px 10px;border-radius:4px;display:inline-block}" +
    "#bs-eco-nav a:hover{background:#122a4d;color:#e3c565}" +
    "#bs-eco-nav a.bs-here{color:#e3c565;font-weight:700;border-bottom:2px solid #c9a227;border-radius:0}" +
    "#bs-eco-nav .bs-mark{color:#c9a227;font-weight:700;padding:9px 8px 9px 4px;letter-spacing:.08em}";
  document.head.appendChild(css);
  var mark = document.createElement("a");
  mark.className = "bs-mark";
  mark.href = HOME;
  mark.textContent = "◈";
  mark.title = "BrainSAIT — all starts from brainsait.de (OID 1.3.6.1.4.1.61026)";
  bar.appendChild(mark);
  domains.forEach(function (d) {
    var a = document.createElement("a");
    a.href = d.url;
    a.textContent = isAr ? d.ar : d.label;
    var host = d.url.replace(/^https:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
    if (here === host || (host !== "brainsait.de" && here.indexOf(host) !== -1)) a.className = "bs-here";
    bar.appendChild(a);
  });
  function mount() { document.body.insertBefore(bar, document.body.firstChild); }
  if (document.body) { mount(); } else { document.addEventListener("DOMContentLoaded", mount); }
})();
