const CACHE_NAME = "slurry-cache-v8";

const urlsToCache = [
  "/slurry-calculator/",
  "/slurry-calculator",
  "./",
  "/slurry-calculator/index.html",

  "/slurry-calculator/styles.css",
  "/slurry-calculator/script.js",

  "/slurry-calculator/icons/icon-192.png",
  "/slurry-calculator/icons/icon-512.png",
  "/slurry-calculator/manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {

  // 🔥 Fix Option A — network‑first for navigations (index.html)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fresh version
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put("/slurry-calculator/index.html", clone);
          });
          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match("/slurry-calculator/index.html");
        })
    );
    return;
  }

  // Default cache‑first for all other requests
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

