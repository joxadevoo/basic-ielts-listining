const CACHE_NAME = 'ielts-listening-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './tracks.js',
  './favicon.svg',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Only handle HTTP/HTTPS schemes (exclude chrome-extension://, data://, etc.)
  if (!e.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(e.request.url);

  // Bypass cache-first for large media files (.mp3, .pdf) to prevent range request/quota errors
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.pdf')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network-First (falling back to cache) for core application assets
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Do not cache non-successful responses or cross-origin requests
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
