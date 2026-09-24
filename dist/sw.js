const CACHE_NAME = 'imland-static-v8';
const PRECACHE = [
  '/',
  '/index.html',
  '/404.html',
  '/il-progetto.html',
  '/radio.html',
  '/podcast.html',
  '/my-podcast.html',
  '/eventi.html',
  '/member.html',
  '/news.html',
  '/contatti.html',
  '/faq.html',
  '/download.html',
  '/auth.html',
  '/privacy.html',
  '/cookie.html',
  '/termini.html',
  '/aggiorna-password.html',
  '/styles-v37.css',
  '/auth.css',
  '/contact.css',
  '/floating-actions.css',
  '/home-sections.css',
  '/news.css',
  '/download.css',
  '/member-dome.css',
  '/member-map.css',
  '/review-bento.css',
  '/navigation.css',
  '/typography.css',
  '/newsletter.css',
  '/script-v59.js',
  '/content-sync.js',
  '/podcast-episodes.js',
  '/forms.js',
  '/form-config.js',
  '/auth-config.js',
  '/auth-client.js',
  '/assets/logos/imland-experience.png',
  '/assets/logos/pwa-icon.svg',
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
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match('/404.html')));
    return;
  }
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
