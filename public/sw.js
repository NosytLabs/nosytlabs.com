/**
 * Service Worker for Performance Optimization
 * Implements advanced caching strategies for fonts, images, and static assets
 */

// Cache names with versioning for cache invalidation
const CACHE_VERSION = 'v4.1.0';
const CACHE_NAMES = {
  static: `nosyt-static-${CACHE_VERSION}`,
  fonts: `nosyt-fonts-${CACHE_VERSION}`,
  images: `nosyt-images-${CACHE_VERSION}`,
  dynamic: `nosyt-dynamic-${CACHE_VERSION}`,
  api: `nosyt-api-${CACHE_VERSION}`,
  navigation: `nosyt-navigation-${CACHE_VERSION}`,
  critical: `nosyt-critical-${CACHE_VERSION}`
};

// Dynamically determine base path based on registration scope (works on localhost and production)
const BASE_PATH = (self.registration && self.registration.scope)
  ? new URL(self.registration.scope).pathname.replace(/\/$/, '')
  : '';

// Critical assets to cache immediately with enhanced performance focus
const CRITICAL_ASSETS = [
  BASE_PATH ? `${BASE_PATH}/` : '/',
  BASE_PATH ? `${BASE_PATH}/fonts/inter-latin.woff2` : '/fonts/inter-latin.woff2',
  BASE_PATH ? `${BASE_PATH}/fonts/inter-var.woff2` : '/fonts/inter-var.woff2',
  BASE_PATH ? `${BASE_PATH}/favicon.svg` : '/favicon.svg'
];

// Enhanced cache size limits for better performance
const CACHE_LIMITS = {
  static: 150,
  fonts: 30,
  images: 300,
  dynamic: 100,
  api: 50,
  critical: 20
};

// Performance-optimized cache strategies
const CACHE_STRATEGIES = {
  fonts: 'cache-first',
  images: 'stale-while-revalidate',
  static: 'cache-first',
  api: 'network-first',
  navigation: 'network-first',
  critical: 'cache-first'
};

// Install event - precache critical assets with enhanced error handling
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache critical resources first
      caches.open(CACHE_NAMES.critical)
        .then(cache => cache.addAll(CRITICAL_ASSETS))
        .catch(error => console.warn('Critical cache failed:', error)),
      
      // Preload additional performance assets
      caches.open(CACHE_NAMES.static)
        .then(cache => {
          const additionalAssets = [
            BASE_PATH ? `${BASE_PATH}/site.webmanifest` : '/site.webmanifest'
          ];
          return cache.addAll(additionalAssets);
        })
        .catch(error => console.warn('Static cache failed:', error))
    ]).then(() => {
      // Skip waiting to activate immediately for performance
      return self.skipWaiting();
    })
  );

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const validCacheNames = Object.values(CACHE_NAMES);
        const deletePromises = cacheNames
          .filter(cacheName => !validCacheNames.includes(cacheName))
          .map(cacheName => {
            return caches.delete(cacheName);
          });
        
        return Promise.all(deletePromises);
      })
      .then(() => {
        // Claim clients immediately to take control without a forced reload
        return self.clients.claim();
      })
  );
});

// Allow optional manual upgrade if the client explicitly requests it
// Only allow skipWaiting in specific controlled scenarios to prevent refresh loops
self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'SKIP_WAITING' && data.allowAutoUpdate === true) {
    self.skipWaiting();
  }
});

// Helper function to manage cache size limits
async function manageCacheSize(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > limit) {
    const keysToDelete = keys.slice(0, keys.length - limit);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Helper function for stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
      manageCacheSize(cacheName, CACHE_LIMITS[cacheName.split('-')[1]] || 50);
    }
    return response;
  }).catch(() => null);

  return cachedResponse || await fetchPromise;
}

// Fetch event - implement advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAMES.api).then(cache => {
              cache.put(request, responseClone);
              manageCacheSize(CACHE_NAMES.api, CACHE_LIMITS.api);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Handle font requests with cache-first strategy (long-term caching)
  if (request.destination === 'font' || url.pathname.includes('/fonts/')) {
    event.respondWith(
      caches.open(CACHE_NAMES.fonts).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(fetchResponse => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone());
              manageCacheSize(CACHE_NAMES.fonts, CACHE_LIMITS.fonts);
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle image requests with stale-while-revalidate strategy
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.images));
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAMES.dynamic).then(cache => {
              cache.put(request, responseClone);
              manageCacheSize(CACHE_NAMES.dynamic, CACHE_LIMITS.dynamic);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cacheResponse) => {
            return cacheResponse || caches.match(BASE_PATH ? `${BASE_PATH}/` : '/');
          });
        })
    );
    return;
  }

  // Handle static assets (JS, CSS) with stale-while-revalidate strategy
  if (url.pathname.match(/\.(js|css|woff2|woff|ttf|eot)$/)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.static));
    return;
  }

  // Default: network-first with cache fallback for everything else
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAMES.dynamic).then(cache => {
            cache.put(request, responseClone);
            manageCacheSize(CACHE_NAMES.dynamic, CACHE_LIMITS.dynamic);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync handling
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve()
    );
  }
});

// Push notification handling (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: BASE_PATH ? `${BASE_PATH}/favicon.svg` : '/favicon.svg',
      badge: BASE_PATH ? `${BASE_PATH}/favicon.svg` : '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});