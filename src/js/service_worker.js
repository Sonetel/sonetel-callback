// ServiceWorker for the PWA

const staticSonetelPwa = "sonetel-callback-pwa-v1";
const assets = [
  "/",
  "/index.html",
  //"/sonetel.js",
  "/assets/style.css",
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
