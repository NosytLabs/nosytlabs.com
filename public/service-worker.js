// Nosyt Labs Enhanced Service Worker
const CACHE_VERSION = 'v12';
const STATIC_CACHE = `nosytlabs-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `nosytlabs-dynamic-${CACHE_VERSION}`;
const IMAGES_CACHE = `nosytlabs-images-${CACHE_VERSION}`;
const FONTS_CACHE = `nosytlabs-fonts-${CACHE_VERSION}`;

// Critical resources - cached immediately
const CRITICAL_RESOURCES = [
  '/',
  '/about',
  '/team',
  '/services',
  '/projects',
  '/blog',
  '/pricing',
  '/contact',
  '/book-a-consultation',
  '/images/favicon.svg',
  '/images/og-image.jpg',
  '/images/twitter-image.jpg',
  '/images/blog-index-og.jpg',
  '/brand/logos/logo-primary.svg',
  '/brand/logos/logo-monochrome-black.svg',
  '/brand/logos/logo-monochrome-white.svg',
  '/brand/logos/logomark.svg',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Static assets - cached with medium priority
const STATIC_ASSETS = [
  '/icons/web-development.svg',
  '/icons/ai-integration.svg',
  '/icons/ecommerce.svg',
  '/icons/consulting.svg',
  '/icons/mobile-app.svg',
  '/icons/ui-ux-design.svg',
  '/images/blog/ai-coding-2025.svg',
  '/images/blog/webp/ai-coding-2025.webp'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network - for static assets
  CACHE_FIRST: 'cache-first',
  // Network first, then cache - for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate - for frequently updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Utility functions for cache management
const isImageRequest = (url) => {
  return url.includes('/images/') || url.includes('/icons/') ||
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url);
};

const isFontRequest = (url) => {
  return url.includes('/fonts/') || /\.(woff|woff2|ttf|otf)$/i.test(url);
};

const isStaticAsset = (url) => {
  return url.includes('/assets/') || /\.(css|js|json)$/i.test(url);
};

const shouldCache = (url) => {
  // Don't cache external requests or API calls
  if (!url.startsWith(self.location.origin)) return false;
  if (url.includes('/api/')) return false;
  if (url.includes('?')) return false; // Don't cache query parameters
  return true;
};

// Strip conditional cache headers to avoid 304 responses breaking resources
const cleanRequest = (request) => {
  try {
    const headers = new Headers(request.headers);
    headers.delete('If-None-Match');
    headers.delete('If-Modified-Since');
    return new Request(request.url, {
      method: request.method,
      headers,
      mode: request.mode,
      credentials: request.credentials,
      cache: 'default',
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
    });
  } catch (e) {
    // Fallback if constructing a new Request fails
    return request;
  }
};

// Cache strategy implementations
const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(cleanRequest(request));
    // If server says Not Modified, prefer returning cached copy when available
    if (response.status === 304) {
      const cached304 = await cache.match(request);
      if (cached304) return cached304;
    }
    if (response.ok && shouldCache(request.url)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    // Fallback to cached if present
    if (cached) return cached;
    throw error;
  }
};

const networkFirst = async (request, cacheName) => {
  try {
    const response = await fetch(cleanRequest(request));
    if (response.status === 304) {
      const cache = await caches.open(cacheName);
      const cached = await cache.match(request);
      if (cached) return cached;
    }
    if (response.ok && shouldCache(request.url)) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Start fetching new version in background (strip conditional headers)
  const fetchPromise = fetch(cleanRequest(request)).then(response => {
    // If 304, do not overwrite cache; simply keep existing cached response
    if (response.status === 304) {
      return response;
    }
    if (response.ok && shouldCache(request.url)) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore fetch errors for background updates
  });

  // Return cached version immediately if available
  if (cached) {
    return cached;
  }

  // If no cached version, wait for network
  return fetchPromise;
};

// Install event - cache critical resources immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
    ])
  );

  // Force activation of new service worker
  self.skipWaiting();
});

// Enhanced fetch event with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Skip API requests
  if (url.pathname.includes('/api/')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Images - Cache first strategy
    if (isImageRequest(request.url)) {
      return await cacheFirst(request, IMAGES_CACHE);
    }

    // Fonts - Cache first strategy with longer TTL
    if (isFontRequest(request.url)) {
      return await cacheFirst(request, FONTS_CACHE);
    }

    // Static assets (CSS, JS) - Stale while revalidate
    if (isStaticAsset(request.url)) {
      return await staleWhileRevalidate(request, STATIC_CACHE);
    }

    // HTML pages - Network first for fresh content
    if (request.destination === 'document') {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Default - Network first with fallback to cache
    return await networkFirst(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('Request failed:', error);

    // Try to return cached version as fallback
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const offlineCache = await caches.open(STATIC_CACHE);
      const offlinePage = await offlineCache.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }

    throw error;
  }
}

// Enhanced activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGES_CACHE, FONTS_CACHE];

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (currentCaches.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Claim all clients immediately
      self.clients.claim(),

      // Notify clients about the new service worker
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      })
    ])
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle background sync operations
      Promise.resolve()
    );
  }
});

// Push notification handler (for future PWA features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});