const CACHE_NAME = 'imland-static-v1';
const PRECACHE = [
  '/styles-v37.css',
  '/navigation.css',
  '/typography.css',
  '/newsletter.css',
  '/script-v59.js',
  '/content-sync.js',
  '/podcast-episodes.js',
  '/forms.js',
  '/assets/logos/imland-experience.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('imland-static-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!/\.(?:css|js|png|jpe?g|webp|svg|woff2?|webmanifest)$/i.test(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(request);
      const refresh = fetch(request).then(response => {
        if (response.ok && response.type === 'basic') cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || refresh;
    })
  );
});
