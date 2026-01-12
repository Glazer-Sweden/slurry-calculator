const CACHE_NAME = "slurry-cache-v7";

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
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

