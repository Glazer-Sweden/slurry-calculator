/*
  === SERVICE WORKER VERSION 9 ===

  IMPORTANT:
  - This file must be named sw-v9.js
  - CACHE_NAME must match the version number
  - index.html must register this file:
        navigator.serviceWorker.register("/slurry-calculator/sw-v9.js");

  When you release Version 10:
  - Duplicate this file as sw-v10.js
  - Update CACHE_NAME to "slurry-cache-v10"
  - Update index.html to register sw-v10.js
*/

// Expose version to the client
const APP_VERSION = "9.0";

const CACHE_NAME = "slurry-cache-v9";

const urlsToCache = [
  "/slurry-calculator/",

/*  "/slurry-calculator", 
"/slurry-calculator/"
"/slurry-calculator"
These behave the same on GitHub Pages, but keeping both is harmless.
If you want to simplify, you can remove the second one — but it’s not required.*/

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

  // Network-first for navigations (index.html)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put("/slurry-calculator/index.html", clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match("/slurry-calculator/index.html");
        })
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Respond to version requests from the page
self.addEventListener("message", event => {
  if (event.data === "GET_VERSION") {
    event.source.postMessage({ version: APP_VERSION });
  }
});


