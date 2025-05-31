const CACHE_VERSION = '4.0';
const STATIC_CACHE = `static-cache-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-v${CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-v${CACHE_VERSION}`;
const API_CACHE = `api-cache-v${CACHE_VERSION}`;
const FONT_CACHE = `font-cache-v${CACHE_VERSION}`;

// Critical assets to cache immediately (optimized list)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/assets/js/module-loader.js',
    '/assets/js/core.min.js',
    '/assets/js/performance.min.js',
    '/assets/optimized/critical.css',
    '/assets/optimized/main.css',
    '/images/nosytlabs-logo-2025.svg',
    '/images/hero-poster.webp',
    '/fonts/ms-sans-serif.woff2'
];

// Assets to prefetch on idle
const PREFETCH_ASSETS = [
    '/assets/js/ui.min.js',
    '/assets/optimized/components.css',
    '/projects.html',
    '/contact.html',
    '/passive-income.html'
];

// Cache strategies configuration
const CACHE_STRATEGIES = {
    // Cache first for static assets
    static: {
        cacheName: STATIC_CACHE,
        strategy: 'cache-first',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 100
    },
    // Network first for HTML pages
    pages: {
        cacheName: DYNAMIC_CACHE,
        strategy: 'network-first',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        maxEntries: 50
    },
    // Cache first for images with long expiry
    images: {
        cacheName: IMAGE_CACHE,
        strategy: 'cache-first',
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        maxEntries: 200
    },
    // Network first for API calls with short cache
    api: {
        cacheName: API_CACHE,
        strategy: 'network-first',
        maxAge: 5 * 60 * 1000, // 5 minutes
        maxEntries: 50
    },
    // Cache first for fonts
    fonts: {
        cacheName: FONT_CACHE,
        strategy: 'cache-first',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxEntries: 20
    }
};

// Assets to prefetch after install
const PREFETCH_ASSETS = [
    '/services',
    '/projects',
    '/contact',
    '/images/windows95-bg.png',
    '/nosytos95'
];

// Sound files to cache
const SOUND_ASSETS = [
    // Duck Hunt sounds
    '/sounds/duck-hunt/shot.mp3',
    '/sounds/duck-hunt/quack.mp3',
    '/sounds/duck-hunt/fall.mp3',
    '/sounds/duck-hunt/level-up.mp3',
    '/audio/gun-shot.mp3',
    '/audio/quack.mp3',
    '/audio/duck-falling.mp3',
    '/audio/game-start.mp3',
    '/audio/level-up.mp3',
    '/audio/game-over.mp3',
    '/audio/dog-laugh.mp3',
    '/audio/dog-bark.mp3',
    '/audio/duck-flap.mp3',
    '/audio/round-clear.mp3',
    '/audio/empty-gun.mp3',
    '/audio/reload.mp3',
    '/audio/menu-select.mp3',

    // Windows 95 sounds
    '/sounds/win95/startup.mp3',
    '/sounds/win95/shutdown.mp3',
    '/sounds/win95/error.mp3',
    '/sounds/win95/notify.mp3',
    '/sounds/win95/click.mp3',
    '/sounds/win95/close.mp3',
    '/sounds/win95/maximize.mp3',
    '/sounds/win95/minimize.mp3',
    '/sounds/win95/menu.mp3',
    '/sounds/win95/chimes.mp3',
    '/sounds/win95/ding.mp3',
    '/sounds/win95/recycle.mp3',
    '/sounds/win95/tada.mp3',
    '/sounds/win95/question.mp3',
    '/sounds/win95/exclamation.mp3',
    '/sounds/win95/critical.mp3'
];

// Install event - cache static assets, sound files, and prefetch important routes
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE)
                .then(cache => cache.addAll(STATIC_ASSETS)),
            // Cache sound assets
            caches.open(SOUND_CACHE)
                .then(cache => {
                    console.log('[Service Worker] Caching sound files');
                    return cache.addAll(SOUND_ASSETS);
                })
                .catch(error => {
                    console.error('[Service Worker] Error caching sound files:', error);
                    // Continue even if sound caching fails
                    return Promise.resolve();
                }),
            // Prefetch additional assets
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(PREFETCH_ASSETS))
        ]).then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheAllowlist = [STATIC_CACHE, DYNAMIC_CACHE, SYNC_CACHE, SOUND_CACHE];

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
    const url = new URL(request.url);

    // Skip non-GET requests unless they're form submissions
    if (request.method !== 'GET') {
        if (request.method === 'POST' && request.headers.get('content-type')?.includes('form')) {
            event.respondWith(handleFormSubmit(request));
        }
        return;
    }

    // Handle sound files - Cache First with Network Fallback
    if (url.pathname.includes('/sounds/') || url.pathname.includes('/audio/')) {
        event.respondWith(handleSoundRequest(request));
        return;
    }

    // Handle static assets - Cache First
    if (STATIC_ASSETS.includes(url.pathname)) {
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

// Special handling for sound requests with fallbacks
async function handleSoundRequest(request) {
    // Track performance metrics
    performanceMetrics.requests++;

    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        return cachedResponse;
    }

    performanceMetrics.cacheMisses++;

    // Try to fetch from network
    try {
        const networkResponse = await fetch(request);

        // Cache the response if successful
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(SOUND_CACHE);
            cache.put(request, responseToCache);
            console.log('[Service Worker] Cached sound file:', request.url);
        }

        return networkResponse;
    } catch (error) {
        performanceMetrics.errors++;
        console.error('[Service Worker] Sound fetch failed:', error, request.url);

        // Try to find a fallback sound
        const fallbackUrl = getFallbackSoundUrl(request.url);
        if (fallbackUrl) {
            console.log('[Service Worker] Trying fallback sound:', fallbackUrl);
            const fallbackRequest = new Request(fallbackUrl);
            const fallbackResponse = await caches.match(fallbackRequest);

            if (fallbackResponse) {
                return fallbackResponse;
            }

            // Try to fetch the fallback from network
            try {
                const fallbackNetworkResponse = await fetch(fallbackRequest);
                if (fallbackNetworkResponse.ok) {
                    const responseToCache = fallbackNetworkResponse.clone();
                    const cache = await caches.open(SOUND_CACHE);
                    cache.put(fallbackRequest, responseToCache);
                }
                return fallbackNetworkResponse;
            } catch (fallbackError) {
                console.error('[Service Worker] Fallback sound fetch failed:', fallbackError);
            }
        }

        // Return a placeholder silent audio if all else fails
        return new Response('', {
            status: 200,
            headers: new Headers({
                'Content-Type': 'audio/mp3'
            })
        });
    }
}

// Get fallback sound URL based on the original URL
function getFallbackSoundUrl(url) {
    // Map of primary sounds to fallback sounds
    const soundMap = {
        '/sounds/duck-hunt/shot.mp3': '/audio/gun-shot.mp3',
        '/sounds/duck-hunt/quack.mp3': '/audio/quack.mp3',
        '/sounds/duck-hunt/fall.mp3': '/audio/duck-falling.mp3',
        '/sounds/duck-hunt/level-up.mp3': '/audio/level-up.mp3',
        '/sounds/win95/startup.mp3': '/sounds/win95/startup.wav',
        '/sounds/win95/error.mp3': '/sounds/win95/error.wav',
        '/sounds/win95/notify.mp3': '/sounds/win95/notify.wav'
    };

    return soundMap[url] || null;
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
