const CACHE_NAME = "slurry-cache-v5"; // bump this every update

// Cache all entry points so the app loads offline reliably
const urlsToCache = [
  "/slurry-calculator/",
  "/slurry-calculator",
  "./",
  "/slurry-calculator/index.html",

  // If you ever add external CSS/JS files, keep them here
  "/slurry-calculator/styles.css",
  "/slurry-calculator/script.js",

  // Icons & manifest
  "/slurry-calculator/icons/icon-192.png",
  "/slurry-calculator/icons/icon-512.png",
  "/slurry-calculator/manifest.json"
];

// INSTALL — cache everything & activate immediately
self.addEventListener("install", event => {
  self.skipWaiting(); // activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE — clean old caches & take control of all tabs
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      self.clients.claim() // take control immediately
    ])
  );
});

// FETCH — cache-first strategy for full offline support
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
