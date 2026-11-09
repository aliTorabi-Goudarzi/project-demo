'use client';

import { useEffect } from 'react';

// The site used to ship an offline-caching service worker (public/sw.js). It
// served hashed assets cache-first and tried to store every response in the
// Cache API — including the hero video's 206 Partial Content responses, which
// the Cache API rejects. The rejected promise failed the media request, so the
// hero stayed on its poster after every normal reload while a hard reload
// (which bypasses the worker) played it.
//
// The worker is gone; browsers that still have it installed would keep failing
// the hero, so remove any registration (and its caches) once and reload into a
// page with no controller.
const RESET_FLAG = 'nsa-sw-reset';

export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const container = navigator.serviceWorker;
    const controlled = Boolean(container.controller);

    container
      .getRegistrations()
      .then(async (registrations) => {
        const staleCaches = 'caches' in window ? await caches.keys() : [];
        if (registrations.length === 0 && staleCaches.length === 0) return;

        await Promise.all(registrations.map((registration) => registration.unregister()));
        await Promise.all(staleCaches.map((key) => caches.delete(key)));

        if (controlled && sessionStorage.getItem(RESET_FLAG) !== '1') {
          sessionStorage.setItem(RESET_FLAG, '1');
          window.location.reload();
        }
      })
      .catch(() => undefined);
  }, []);

  return null;
}
