/**
 * Service Worker for Core Web Vitals optimization
 * Implements advanced caching strategies for better performance
 */

const CACHE_NAME = 'nosytlabs-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';
const API_CACHE = 'api-v1';

// Cache duration in milliseconds
const CACHE_DURATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  DYNAMIC: 24 * 60 * 60 * 1000,    // 1 day
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 5 * 60 * 1000,              // 5 minutes
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/assets/css/critical.css',
  '/fonts/inter-var.woff2',
  '/manifest.json',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/assets/js/',
  '/assets/css/',
  '/assets/fonts/',
  '/assets/images/icons/',
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/contact',
  '/api/services',
  '/api/portfolio',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE &&
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== IMAGE_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Main request handler with different strategies
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Critical resources - Cache First with Network Fallback
    if (isCriticalResource(pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }
    
    // Strategy 2: Static assets - Cache First with Network Fallback
    if (isStaticAsset(pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }
    
    // Strategy 3: Images - Cache First with WebP/AVIF optimization
    if (isImageRequest(pathname)) {
      return await imageOptimizationStrategy(request);
    }
    
    // Strategy 4: API requests - Network First with Cache Fallback
    if (isApiRequest(pathname)) {
      return await networkFirstStrategy(request, API_CACHE);
    }
    
    // Strategy 5: HTML pages - Stale While Revalidate
    if (isHtmlRequest(request)) {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE);
    }
    
    // Default: Network only
    return await fetch(request);
    
  } catch (error) {
    console.error('Service Worker fetch error:', error);
    
    // Fallback for HTML requests
    if (isHtmlRequest(request)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match('/');
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return a basic error response
    return new Response('Network error', {
      status: 408,
      statusText: 'Network timeout',
    });
  }
}

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version even if expired
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network First Strategy - for API requests
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy - for HTML pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return await networkResponsePromise || new Response('Offline', { status: 503 });
}

// Image Optimization Strategy - with format negotiation
async function imageOptimizationStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const url = new URL(request.url);
  
  // Check for cached version first
  const cachedResponse = await cache.match(request);
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    // Try to get optimized format based on Accept header
    const acceptHeader = request.headers.get('Accept') || '';
    let optimizedRequest = request;
    
    // If browser supports modern formats, try to get them
    if (acceptHeader.includes('image/avif')) {
      optimizedRequest = new Request(
        url.pathname.replace(/\.(jpg|jpeg|png)$/i, '.avif') + url.search,
        { headers: request.headers }
      );
    } else if (acceptHeader.includes('image/webp')) {
      optimizedRequest = new Request(
        url.pathname.replace(/\.(jpg|jpeg|png)$/i, '.webp') + url.search,
        { headers: request.headers }
      );
    }
    
    let networkResponse;
    
    // Try optimized format first, fallback to original
    try {
      networkResponse = await fetch(optimizedRequest);
      if (!networkResponse.ok) {
        throw new Error('Optimized format not available');
      }
    } catch {
      networkResponse = await fetch(request);
    }
    
    if (networkResponse.ok) {
      // Cache the response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if available
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions
function isCriticalResource(pathname) {
  return CRITICAL_RESOURCES.some(resource => pathname === resource || pathname.startsWith(resource));
}

function isStaticAsset(pathname) {
  return STATIC_ASSETS.some(asset => pathname.startsWith(asset)) ||
         /\.(js|css|woff2?|ttf|otf|eot)$/i.test(pathname);
}

function isImageRequest(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(pathname);
}

function isApiRequest(pathname) {
  return pathname.startsWith('/api/') || 
         CACHEABLE_APIS.some(api => pathname.startsWith(api));
}

function isHtmlRequest(request) {
  const acceptHeader = request.headers.get('Accept') || '';
  return acceptHeader.includes('text/html');
}

function isExpired(response) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader).getTime();
  const now = Date.now();
  const age = now - responseDate;
  
  // Determine cache duration based on content type
  const contentType = response.headers.get('content-type') || '';
  let maxAge = CACHE_DURATION.DYNAMIC;
  
  if (contentType.includes('image/')) {
    maxAge = CACHE_DURATION.IMAGES;
  } else if (contentType.includes('application/javascript') || 
             contentType.includes('text/css')) {
    maxAge = CACHE_DURATION.STATIC;
  } else if (contentType.includes('application/json')) {
    maxAge = CACHE_DURATION.API;
  }
  
  return age > maxAge;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Retry failed requests when connection is restored
  console.log('Background sync triggered');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/icons/icon-192x192.png',
      badge: '/assets/images/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1,
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/assets/images/icons/checkmark.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/icons/xmark.png',
        },
      ],
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/services')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    // Handle performance reports from the main thread
    console.log('Performance report received:', event.data.metrics);
  }
});