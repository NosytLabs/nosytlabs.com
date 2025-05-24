/**
 * Service Worker for NosytLabs Website
 * Provides offline functionality, caching, and performance optimization
 */

const CACHE_NAME = 'nosytlabs-v1.0.0';
const STATIC_CACHE = 'nosytlabs-static-v1.0.0';
const DYNAMIC_CACHE = 'nosytlabs-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/blog',
  '/contact',
  '/nosytos95',
  '/passive-income',
  '/3d-printing',
  '/offline.html',
  // Core CSS and JS files will be added dynamically
];

// Assets to cache on first request
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:css|js)$/,
    /\.(?:woff|woff2|ttf|eot)$/,
  ],
  
  // Network first for dynamic content
  NETWORK_FIRST: [
    /\/api\//,
    /\/blog\//,
    /\/admin\//,
  ],
  
  // Stale while revalidate for pages
  STALE_WHILE_REVALIDATE: [
    /\.(?:html)$/,
    /\/$/,
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (unless they're for assets)
  if (url.origin !== location.origin && !isAssetRequest(request)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Handle different types of requests
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Determine caching strategy
    if (shouldUseCacheFirst(request)) {
      return await cacheFirst(request);
    } else if (shouldUseNetworkFirst(request)) {
      return await networkFirst(request);
    } else {
      return await staleWhileRevalidate(request);
    }
  } catch (error) {
    console.error('Request handling failed:', error);
    return await handleOffline(request);
  }
}

// Cache first strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return await handleOffline(request);
  }
}

// Network first strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || handleOffline(request);
  }
}

// Stale while revalidate strategy - for pages
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => null);
  
  return cachedResponse || networkResponsePromise || handleOffline(request);
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
  
  // For images, return a placeholder
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b7280">Image Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Offline', { status: 503 });
}

// Utility functions
function shouldUseCacheFirst(request) {
  return CACHE_STRATEGIES.CACHE_FIRST.some(pattern => pattern.test(request.url));
}

function shouldUseNetworkFirst(request) {
  return CACHE_STRATEGIES.NETWORK_FIRST.some(pattern => pattern.test(request.url));
}

function isAssetRequest(request) {
  return request.destination === 'image' || 
         request.destination === 'script' || 
         request.destination === 'style' ||
         request.destination === 'font';
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Sync pending contact form submissions
async function syncContactForms() {
  try {
    const db = await openDB();
    const pendingForms = await getAllPendingForms(db);
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deletePendingForm(db, form.id);
          console.log('✅ Synced pending form submission');
        }
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline form storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NosytLabsDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingForms')) {
        db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getAllPendingForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readonly');
    const store = transaction.objectStore('pendingForms');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deletePendingForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readwrite');
    const store = transaction.objectStore('pendingForms');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    data: data.url,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/images/icons/dismiss-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' && event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    // Log performance metrics for monitoring
    console.log('📊 Performance metrics:', event.data.metrics);
  }
});
