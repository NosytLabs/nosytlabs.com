/* No-op Service Worker for dev: silences /sw.js 404s and unregisters any prior SW */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const reg = self.registration;
      // Unregister any previously installed service worker for this scope
      await reg.unregister();
      // Reload controlled clients so they detach from the old SW
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    } catch (_) {
      // swallow errors in dev
    }
  })());
});
