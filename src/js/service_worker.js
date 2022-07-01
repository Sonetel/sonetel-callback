// ServiceWorker for the PWA

const staticSonetelPwa = "sonetel-callback-v1";
const assets = [
  "/",
  "/index.html",
  "/assets/js/index.js",
  "/assets/js/index.js.map",
  "/assets/css/sonetel.css",
  "/assets/css/sonetel.css.map",
  "https://fonts.googleapis.com/css?family=Noto+Sans:wght@300;400,500&display=swap",
  "https://fonts.gstatic.com/s/notosans/v27/o-0NIpQlx3QUlC5A4PNjFhdVZNyB.woff2",
  "https://fonts.gstatic.com/s/notosans/v27/o-0NIpQlx3QUlC5A4PNjFhdVatyB1Wk.woff2",
  "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr5TRA.woff2",
  "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr6zRAW_0.woff2",
  "/images/logo.png",
  "/images/info.png"
];

// Install the service worker
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticSonetelPwa).then(cache => {
      //console.log('caching assets');
      cache.addAll(assets);
    })
  );
});

// Activate event
self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticSonetelPwa)
        .map(key => caches.delete(key))
        )
    })
  );

});


// fetch event
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
