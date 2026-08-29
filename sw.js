/* =============================================================================
 *  BOYFRIEND.EXE  —  sw.js
 * -----------------------------------------------------------------------------
 *  Minimal cache-first service worker. Caches the app shell on install so the
 *  quiz loads instantly and works offline on mobile. Bumps CACHE on each
 *  deploy (change the version string to invalidate).
 * ========================================================================== */
var CACHE = "boyfriend-exe-v2-json";
var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "favicon.ico",
  "styles/main.css",
  "styles/corruption.css",
  "src/core.js",
  "src/audio.js",
  "src/reactions.js",
  "src/redirect.js",
  "src/hud.js",
  "src/corruption.js",
  "src/chaos.js",
  "src/flow.js",
  "src/namegate.js",
  "src/results.js",
  "src/main.js",
  "data/questions.json",
  "data/content.json",
  "assets/fonts/Chewy.woff2"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var isJsonData = /\/data\/[^/]+\.json(?:$|\?)/.test(req.url);

  if (isJsonData) {
    e.respondWith(
      fetch(req, { cache: "no-store" }).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
