// Vita — minimal service worker.
// Sadece "yüklenebilir" (installable) PWA kriterini karşılamak için bir fetch
// handler'ı var; sayfalar oturuma ve aileye özel olduğundan bilinçli olarak
// hiçbir şeyi cache'lemiyor (yanlış ailenin verisini cache'den sızdırma riski).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
