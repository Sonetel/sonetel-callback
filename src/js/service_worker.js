// ServiceWorker for the PWA

const staticSonetelPwa = "sonetel-callback-pwa-v1";
const assets = [
  "/",
  "/index.html",
  "/assets/js/index.js",
  "/assets/js/index.js.map",
  "/assets/css/sonetel.css",
  "/assets/css/sonetel.css.map",
  "https://fonts.googleapis.com/css?family=Noto+Sans:wght@300;400,500&display=swap",
  "/images/logo.png",
  "/images/info.png",
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
