// ServiceWorker for the PWA

const staticSonetelPwa = "sonetel-callback-pwa-v1";
const assets = [
  "/",
  "/index.html",
  "/assets/js/index.js",
  "/assets/js/index.js.map",
  "/assets/sonetel.css",
  "/assets/sonetel.css.map",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticSonetelPwa).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
