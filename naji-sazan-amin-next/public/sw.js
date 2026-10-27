const CACHE_NAME = 'nsa-v1';
const MAX_ASSETS = 80;

function isImmutable(pathname) {
  return pathname.startsWith('/_next/static/') || /-[a-f0-9]{8}\.[a-z0-9]+$/i.test(pathname);
}

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ASSETS) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ASSETS).map((key) => cache.delete(key)));
}

async function put(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  await trimCache(cache);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await put(request, response);
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match('/404.html')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await put(request, response);
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(async (response) => {
      await put(request, response);
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImmutable(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
