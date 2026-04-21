const CACHE_NAME = 'offline-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/index.html',
        '/index_css1.css',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Handle page navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});