const CACHE_VERSION = '2';
const STATIC_CACHE = `static-cache-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-v${CACHE_VERSION}`;
const SYNC_CACHE = `sync-cache-v${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/styles/main.css',
    '/styles/global.css',
    '/styles/clippy.css',
    '/scripts/main.js',
    '/scripts/enhanced-clippy.js',
    '/images/logo-new.svg',
    '/images/hero-poster.webp',
    '/images/hero-poster.jpg'
];

// Assets to prefetch after install
const PREFETCH_ASSETS = [
    '/services',
    '/projects',
    '/contact',
    '/images/windows95-bg.png'
];

// Install event - cache static assets and prefetch important routes
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE)
                .then(cache => cache.addAll(STATIC_ASSETS)),
            // Prefetch additional assets
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(PREFETCH_ASSETS))
        ]).then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheAllowlist = [STATIC_CACHE, DYNAMIC_CACHE, SYNC_CACHE];
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!cacheAllowlist.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Enable background sync if supported
            'sync' in self.registration ? 
                self.registration.sync.register('syncData') : Promise.resolve(),
            // Enable push notifications if supported
            'pushManager' in self.registration ?
                self.registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
                    )
                }) : Promise.resolve()
        ]).then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    
    // Skip non-GET requests unless they're form submissions
    if (request.method !== 'GET') {
        if (request.method === 'POST' && request.headers.get('content-type')?.includes('form')) {
            event.respondWith(handleFormSubmit(request));
        }
        return;
    }
    
    // Handle static assets - Cache First
    if (STATIC_ASSETS.includes(new URL(request.url).pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => response || fetchAndCache(request, STATIC_CACHE))
        );
        return;
    }
    
    // Handle dynamic content - Network First with Offline Fallback
    event.respondWith(
        fetch(request)
            .then(response => {
                // Clone the response before caching
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then(cache => cache.put(request, responseToCache));
                return response;
            })
            .catch(() => {
                return caches.match(request)
                    .then(response => {
                        if (response) return response;
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        
                        return new Response('Network error', {
                            status: 408,
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'syncData') {
        event.waitUntil(
            caches.open(SYNC_CACHE)
                .then(cache => cache.keys())
                .then(requests => {
                    return Promise.all(
                        requests.map(request => {
                            return cache.match(request)
                                .then(response => response.json())
                                .then(data => {
                                    return fetch(request, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(data)
                                    }).then(() => cache.delete(request));
                                });
                        })
                    );
                })
        );
    }
});

// Push Notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/images/icons/android-chrome-192x192.png',
        badge: '/images/icons/android-chrome-96x96.png',
        timestamp: Date.now(),
        data: {
            url: self.registration.scope
        },
        actions: [
            { action: 'view', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('NosytLabs', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Handle form submissions
async function handleFormSubmit(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        // Store failed submissions in sync cache
        const cache = await caches.open(SYNC_CACHE);
        await cache.put(request.url, new Response(JSON.stringify(await request.json())));
        return new Response(JSON.stringify({ 
            status: 'offline',
            message: 'Your submission will be sent when you\'re back online'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Helper function to fetch and cache
async function fetchAndCache(request, cacheName) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.error('Error fetching and caching:', error);
        throw error;
    }
}

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Performance monitoring
const performanceMetrics = {
    requests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errors: 0
};

// Log metrics every hour
setInterval(() => {
    console.log('Service Worker Metrics:', performanceMetrics);
}, 3600000);

// Handle memory management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_DYNAMIC_CACHE') {
        caches.open(DYNAMIC_CACHE).then(cache => {
            cache.keys().then(requests => {
                if (requests.length > 50) { // Limit cache size
                    requests.slice(0, requests.length - 50).forEach(request => {
                        cache.delete(request);
                    });
                }
            });
        });
    }
});
