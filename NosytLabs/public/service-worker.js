// Service Worker for Nosyt Labs
// This provides offline capabilities and performance enhancements

const CACHE_NAME = 'nosyt-labs-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on service worker install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles/global.css',
  '/styles/terminal-animations.css',
  '/scripts/terminal-background.js',
  '/scripts/terminal-effects.js',
  '/scripts/terminal-interactive.js',
  '/scripts/terminal-boot.js',
  '/images/logo.svg'
];

// Install event - precache key assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For HTML requests - network first, fallback to cache, then offline page
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For non-HTML requests - cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Cache the new response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(error => {
            // Special handling for image requests - return placeholder
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="400" height="300" fill="#1E1E1E" />' +
                '<text x="50%" y="50%" fill="#4CAF50" text-anchor="middle" dominant-baseline="middle" font-family="monospace">Image Offline</text>' +
                '</svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            console.error('Service Worker fetch failed:', error);
            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const title = 'Nosyt Labs';
  const options = {
    body: event.data.text() || 'New notification from Nosyt Labs',
    icon: '/images/logo.svg',
    badge: '/images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});