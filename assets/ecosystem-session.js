/*
 * BrainSAIT Ecosystem Session Bridge
 * ==================================
 * ONE identity across every BrainSAIT property.
 *
 * Model: the Portal is the identity provider. On portal login it stores the
 * `X-Token` in localStorage under a shared key. Every other BrainSAIT property
 * (store, academy, notebooks, masterlinc) includes THIS script and can, with the
 * user's consent, resolve the unified profile via the Portal API
 * (https://portal.brainsait.de/api/auth/me) — so a single signed-in BrainSAIT
 * identity is recognized everywhere. No third-party cookies, no shared secrets
 * in the page; the token only ever travels to the Portal API over HTTPS.
 *
 * Usage (add before </head> on any property):
 *   <script src="https://brainsait.de/assets/ecosystem-session.js" defer></script>
 * Then: const id = await BrainSAIT.session.resolve();  // {profile_id,name,roles}|null
 */
(function (global) {
  'use strict';
  var KEY = 'brainsait_x_token';
  // ALL identity originates at brainsait.de — the apex is the single origin
  // for auth, profiles, sessions and events (proxied to portal/hub).
  var PORTAL_ME = 'https://brainsait.de/api/auth/me';
  var PORTAL_LOGIN = 'https://brainsait.de/api/auth/login';
  var PORTAL_PROFILE = 'https://brainsait.de/profile/';

  function readToken() {
    try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; }
  }
  function writeToken(t) {
    try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch (e) {}
  }

  var BrainSAIT = global.BrainSAIT || (global.BrainSAIT = {});
  BrainSAIT.session = {
    KEY: KEY,
    /* Called by the Portal after a successful login. */
    publish: function (token) { writeToken(token); return true; },
    /* Silent single-sign-on: if a Portal token exists, resolve the identity. */
    resolve: function () {
      var tok = readToken();
      if (!tok) return Promise.resolve(null);
      return fetch(PORTAL_ME, { headers: { 'X-Token': tok } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j) { writeToken(''); return null; }
          return { profile_id: j.profile_id, name: j.name, roles: j.roles, portal: j.portal };
        })
        .catch(function () { return null; });
    },
    /* Helper used by the storefront: attach the unified profile id to a checkout. */
    attachTo: function (payload) {
      var tok = readToken();
      if (!tok) return Promise.resolve(payload);
      return fetch(PORTAL_ME, { headers: { 'X-Token': tok } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && j.profile_id) payload.customer_profile_id = j.profile_id;
          return payload;
        })
        .catch(function () { return payload; });
    },
    login: function (email, password) {
      return fetch(PORTAL_LOGIN, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.token) writeToken(j.token);
        return j;
      });
    },
    logout: function () { writeToken(''); }
  };
  // Best-effort: announce readiness so hosts can personalize.
  document.addEventListener('DOMContentLoaded', function () {
    BrainSAIT.session.resolve().then(function (id) {
      if (id) document.dispatchEvent(new CustomEvent('brainsait:identity', { detail: id }));
    });
  });
})(window);
