// Nosyt Labs Service Worker
const CACHE_NAME = 'nosytlabs-v10';
const urlsToCache = [
  '/',
  '/about',
  '/team',
  '/services',
  '/projects',
  '/blog',
  '/pricing',
  '/contact',
  '/book-a-consultation',
  // Removed '/styles/final-optimized.css' as it is not served directly by the dev server
  '/images/favicon.svg',
  '/images/og-image.jpg',
  '/images/twitter-image.jpg',
  '/images/blog-index-og.jpg',
  '/images/blog/ai-coding-2025.svg',
  '/brand/logos/logo-primary.svg',
  '/brand/logos/logo-monochrome-black.svg',
  '/brand/logos/logo-monochrome-white.svg',
  '/brand/logos/logomark.svg',
  '/icons/web-development.svg',
  '/icons/ai-integration.svg',
  '/icons/ecommerce.svg',
  '/icons/consulting.svg',
  '/icons/mobile-app.svg',
  '/icons/ui-ux-design.svg',
  '/images/blog/webp/ai-coding-2025.webp',
  // Removed corrupted PNG from cache list
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip caching for requests to external domains
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        // Fetch from network
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();
          
          // Cache the response for future use
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});