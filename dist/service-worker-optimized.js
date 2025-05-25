// Enhanced Service Worker for NosytLabs Website
// Provides offline functionality, advanced caching strategies, and performance optimization

const CACHE_VERSION = 'v4.0.0';
const STATIC_CACHE = `nosytlabs-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `nosytlabs-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `nosytlabs-images-${CACHE_VERSION}`;
const API_CACHE = `nosytlabs-api-${CACHE_VERSION}`;
const FONT_CACHE = `nosytlabs-fonts-${CACHE_VERSION}`;

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles/global.css',
  '/scripts/main.js',
  '/images/nosytlabs-logo-2025.svg',
  '/images/favicon.svg',
  '/site.webmanifest'
];

// Assets to prefetch after critical assets are cached
const PREFETCH_ASSETS = [
  '/about.html',
  '/services.html',
  '/projects.html',
  '/contact.html',
  '/blog.html'
];

// Game assets (lazy loaded)
const GAME_ASSETS = [
  '/scripts/nosyt-duck-hunt.js',
  '/scripts/nosyt-window-manager.js',
  '/nosytos95.html',
  '/audio/gun-shot.mp3',
  '/audio/quack.mp3',
  '/audio/duck-falling.mp3'
];

// Cache configuration
const CACHE_CONFIG = {
  [STATIC_CACHE]: {
    maxEntries: 100,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    strategy: CACHE_STRATEGIES.CACHE_FIRST
  },
  [DYNAMIC_CACHE]: {
    maxEntries: 50,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
  },
  [IMAGE_CACHE]: {
    maxEntries: 200,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    strategy: CACHE_STRATEGIES.CACHE_FIRST
  },
  [API_CACHE]: {
    maxEntries: 20,
    maxAgeSeconds: 5 * 60, // 5 minutes
    strategy: CACHE_STRATEGIES.NETWORK_FIRST
  },
  [FONT_CACHE]: {
    maxEntries: 10,
    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
    strategy: CACHE_STRATEGIES.CACHE_FIRST
  }
};

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      cacheAssets(STATIC_CACHE, CRITICAL_ASSETS),
      self.skipWaiting()
    ]).then(() => {
      console.log('[SW] Critical assets cached');
      // Prefetch additional assets in background
      prefetchAssets();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      cleanupOldCaches(),
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service worker activated');
    })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/nosytlabs-logo-2025.svg',
      badge: '/images/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle request based on URL and resource type
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // API requests
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(request);
    }
    
    // Images
    if (isImageRequest(request)) {
      return handleImageRequest(request);
    }
    
    // Fonts
    if (isFontRequest(request)) {
      return handleFontRequest(request);
    }
    
    // CSS and JS
    if (isStaticAsset(request)) {
      return handleStaticAsset(request);
    }
    
    // HTML pages
    if (isPageRequest(request)) {
      return handlePageRequest(request);
    }
    
    // External resources
    if (url.origin !== self.location.origin) {
      return handleExternalRequest(request);
    }
    
    // Default: network first
    return fetch(request);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    return handleOfflineRequest(request);
  }
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached version and update in background
    updateImageInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
      cleanupCache(IMAGE_CACHE);
    }
    
    return response;
  } catch (error) {
    // Return fallback image
    return getFallbackImage();
  }
}

// Handle font requests with cache-first strategy
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Handle page requests with stale-while-revalidate strategy
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch fresh content
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
      cleanupCache(DYNAMIC_CACHE);
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    fetchPromise; // Update in background
    return cachedResponse;
  }
  
  // Wait for network if no cache
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Return offline page as fallback
  return getOfflinePage();
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // For external resources, fail silently
    return new Response('', { status: 204 });
  }
}

// Handle offline requests
async function handleOfflineRequest(request) {
  if (isPageRequest(request)) {
    return getOfflinePage();
  }
  
  if (isImageRequest(request)) {
    return getFallbackImage();
  }
  
  throw new Error('Offline');
}

// Utility functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname);
}

function isFontRequest(request) {
  return request.destination === 'font' ||
         /\.(woff|woff2|ttf|otf)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         /\.(js|css)$/i.test(new URL(request.url).pathname);
}

function isPageRequest(request) {
  return request.destination === 'document' ||
         request.headers.get('accept')?.includes('text/html');
}

// Cache management functions
async function cacheAssets(cacheName, assets) {
  const cache = await caches.open(cacheName);
  
  const cachePromises = assets.map(async asset => {
    try {
      const response = await fetch(asset);
      if (response.ok) {
        await cache.put(asset, response);
      }
    } catch (error) {
      console.warn(`[SW] Failed to cache ${asset}:`, error);
    }
  });
  
  await Promise.allSettled(cachePromises);
}

async function prefetchAssets() {
  // Prefetch additional assets in background
  setTimeout(() => {
    cacheAssets(STATIC_CACHE, PREFETCH_ASSETS);
  }, 1000);
  
  // Prefetch game assets when idle
  if ('requestIdleCallback' in self) {
    self.requestIdleCallback(() => {
      cacheAssets(STATIC_CACHE, GAME_ASSETS);
    });
  }
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = Object.values(CACHE_CONFIG).map(config => config.name);
  
  const deletePromises = cacheNames
    .filter(cacheName => !currentCaches.includes(cacheName))
    .map(cacheName => caches.delete(cacheName));
  
  await Promise.all(deletePromises);
}

async function cleanupCache(cacheName) {
  const config = CACHE_CONFIG[cacheName];
  if (!config) return;
  
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > config.maxEntries) {
    const sortedKeys = keys.sort((a, b) => {
      // Sort by last accessed time (if available)
      return new Date(a.headers.get('date') || 0) - new Date(b.headers.get('date') || 0);
    });
    
    const keysToDelete = sortedKeys.slice(0, keys.length - config.maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

async function updateImageInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    // Ignore background update errors
  }
}

async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  return cache.match('/offline.html') || new Response('Offline', { status: 503 });
}

async function getFallbackImage() {
  const cache = await caches.open(STATIC_CACHE);
  return cache.match('/images/placeholder.svg') || 
         new Response('', { status: 204 });
}

async function doBackgroundSync() {
  // Handle background sync tasks
  console.log('[SW] Performing background sync...');
  
  // Sync analytics data
  try {
    const analyticsData = await getStoredAnalyticsData();
    if (analyticsData.length > 0) {
      await sendAnalyticsData(analyticsData);
      await clearStoredAnalyticsData();
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function getStoredAnalyticsData() {
  // Implementation would depend on your storage strategy
  return [];
}

async function sendAnalyticsData(data) {
  // Send stored analytics data to server
  return fetch('/api/analytics/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function clearStoredAnalyticsData() {
  // Clear stored analytics data after successful sync
}

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then(stats => {
      event.ports[0].postMessage(stats);
    });
  }
});

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = keys.length;
  }
  
  return stats;
}

console.log('[SW] Service worker script loaded');
