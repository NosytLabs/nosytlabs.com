/**
 * Service Worker for NosytLabs - Performance Optimization
 * Implements caching strategies for optimal performance
 */

const CACHE_NAME = 'nosytlabs-v1';
const STATIC_CACHE = 'nosytlabs-static-v1';
const DYNAMIC_CACHE = 'nosytlabs-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/styles/optimized/critical-optimized.css',
  '/styles/optimized/main-optimized.css',
  '/scripts/bundles/core.min.js',
  '/images/nosytlabs-logo-2025.svg',
  '/fonts/inter-var.woff2'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();

            // Determine cache strategy based on resource type
            const cacheStrategy = getCacheStrategy(request.url);

            caches.open(cacheStrategy.cache)
              .then(cache => {
                if (cacheStrategy.shouldCache) {
                  cache.put(request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

/**
 * Determine caching strategy based on resource type
 * @param {string} url - Request URL
 * @returns {Object} - Cache strategy
 */
function getCacheStrategy(url) {
  // Static assets - long-term cache
  if (url.includes('/styles/') || url.includes('/scripts/') || url.includes('/images/')) {
    return {
      cache: STATIC_CACHE,
      shouldCache: true,
      maxAge: 31536000 // 1 year
    };
  }

  // Dynamic content - short-term cache
  return {
    cache: DYNAMIC_CACHE,
    shouldCache: true,
    maxAge: 86400 // 1 day
  };
}