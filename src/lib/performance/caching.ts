/**
 * Caching Utilities
 *
 * Comprehensive caching strategies including service worker cache,
 * browser storage cache, and cache management utilities.
 *
 * @module performance/caching
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Cache strategy types
 */
export type CacheStrategy =
  | "cache-first"
  | "network-first"
  | "stale-while-revalidate"
  | "network-only"
  | "cache-only";

/**
 * Cache configuration
 */
export interface CacheConfig {
  name: string;
  version: string;
  maxAge: number;
  maxEntries?: number;
  strategy: CacheStrategy;
}

/**
 * Resource cache rule
 */
export interface ResourceCacheRule {
  pattern: RegExp;
  config: CacheConfig;
}

/**
 * Browser cache item
 */
interface BrowserCacheItem<T = unknown> {
  value: T;
  timestamp: number;
  ttl: number;
}

// ========================================
// CACHE MANAGER CLASS
// ========================================

/**
 * Cache Strategy Manager
 * Handles different caching strategies for various resource types.
 *
 * @example
 * ```typescript
 * const manager = new CacheManager();
 * const config = manager.getCacheConfig('/api/users');
 * const headers = manager.generateCacheHeaders('/styles/main.css');
 * ```
 */
export class CacheManager {
  private rules: ResourceCacheRule[] = [];

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Setup default caching rules for different resource types
   */
  private setupDefaultRules(): void {
    this.rules = [
      // Static assets - cache first with long TTL
      {
        pattern: /\.(css|js|woff2?|png|jpg|jpeg|webp|svg|ico)$/,
        config: {
          name: "static-assets",
          version: "1.0.0",
          maxAge: 31536000, // 1 year
          maxEntries: 100,
          strategy: "cache-first",
        },
      },
      // HTML pages - stale while revalidate
      {
        pattern: /\.html?$/,
        config: {
          name: "pages",
          version: "1.0.0",
          maxAge: 86400, // 1 day
          maxEntries: 50,
          strategy: "stale-while-revalidate",
        },
      },
      // API calls - network first
      {
        pattern: /\/api\//,
        config: {
          name: "api",
          version: "1.0.0",
          maxAge: 300, // 5 minutes
          maxEntries: 20,
          strategy: "network-first",
        },
      },
      // Images - cache first with cleanup
      {
        pattern: /\.(png|jpg|jpeg|webp|gif|svg)$/,
        config: {
          name: "images",
          version: "1.0.0",
          maxAge: 2592000, // 30 days
          maxEntries: 200,
          strategy: "cache-first",
        },
      },
    ];
  }

  /**
   * Get cache config for a URL
   *
   * @param url - URL to get config for
   * @returns Cache config or null if no match
   */
  public getCacheConfig(url: string): CacheConfig | null {
    for (const rule of this.rules) {
      if (rule.pattern.test(url)) {
        return rule.config;
      }
    }
    return null;
  }

  /**
   * Add custom cache rule
   *
   * @param pattern - URL pattern to match
   * @param config - Cache configuration
   */
  public addRule(pattern: RegExp, config: CacheConfig): void {
    this.rules.unshift({ pattern, config });
  }

  /**
   * Generate cache headers for HTTP responses
   *
   * @param url - URL to generate headers for
   * @returns Cache headers object
   */
  public generateCacheHeaders(url: string): Record<string, string> {
    const config = this.getCacheConfig(url);
    if (!config) {
      return {
        "Cache-Control": "no-cache",
      };
    }

    const headers: Record<string, string> = {};

    switch (config.strategy) {
      case "cache-first":
        headers["Cache-Control"] =
          `public, max-age=${config.maxAge}, immutable`;
        break;
      case "network-first":
        headers["Cache-Control"] =
          `public, max-age=${config.maxAge}, must-revalidate`;
        break;
      case "stale-while-revalidate":
        headers["Cache-Control"] =
          `public, max-age=${config.maxAge}, stale-while-revalidate=${config.maxAge * 2}`;
        break;
      default:
        headers["Cache-Control"] = `public, max-age=${config.maxAge}`;
    }

    // Add ETag for better cache validation
    headers["ETag"] = `"${config.version}-${Date.now()}"`;

    return headers;
  }
}

// ========================================
// SERVICE WORKER CACHE CLASS
// ========================================

/**
 * Service Worker Cache Manager
 * Handles service worker caching strategies.
 *
 * @example
 * ```typescript
 * const swCache = ServiceWorkerCache.getInstance();
 * await swCache.preloadCriticalResources(['/critical.css', '/app.js']);
 * ```
 */
export class ServiceWorkerCache {
  private static instance: ServiceWorkerCache;
  private cacheManager: CacheManager;

  private constructor() {
    this.cacheManager = new CacheManager();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceWorkerCache {
    if (!ServiceWorkerCache.instance) {
      ServiceWorkerCache.instance = new ServiceWorkerCache();
    }
    return ServiceWorkerCache.instance;
  }

  /**
   * Handle fetch events in service worker
   *
   * @param event - Fetch event
   * @returns Response promise
   */
  public async handleFetch(
    event: Event & { request: Request },
  ): Promise<Response> {
    const url = event.request.url;
    const config = this.cacheManager.getCacheConfig(url);

    if (!config) {
      return fetch(event.request);
    }

    switch (config.strategy) {
      case "cache-first":
        return this.cacheFirst(event.request, config);
      case "network-first":
        return this.networkFirst(event.request, config);
      case "stale-while-revalidate":
        return this.staleWhileRevalidate(event.request, config);
      case "network-only":
        return fetch(event.request);
      case "cache-only":
        return this.cacheOnly(event.request, config);
      default:
        return fetch(event.request);
    }
  }

  /**
   * Cache-first strategy
   */
  private async cacheFirst(
    request: Request,
    config: CacheConfig,
  ): Promise<Response> {
    const cache = await caches.open(config.name);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(request);
      if (response.ok) {
        await this.putInCache(cache, request, response.clone(), config);
      }
      return response;
    } catch (error) {
      console.warn("Network request failed:", error);
      throw error;
    }
  }

  /**
   * Network-first strategy
   */
  private async networkFirst(
    request: Request,
    config: CacheConfig,
  ): Promise<Response> {
    const cache = await caches.open(config.name);

    try {
      const response = await fetch(request);
      if (response.ok) {
        await this.putInCache(cache, request, response.clone(), config);
      }
      return response;
    } catch (error) {
      console.warn("Network request failed, trying cache:", error);
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  /**
   * Stale-while-revalidate strategy
   */
  private async staleWhileRevalidate(
    request: Request,
    config: CacheConfig,
  ): Promise<Response> {
    const cache = await caches.open(config.name);
    const cached = await cache.match(request);

    // Start network request in background
    const networkPromise = fetch(request)
      .then((response) => {
        if (response.ok) {
          this.putInCache(cache, request, response.clone(), config);
        }
        return response;
      })
      .catch((error) => {
        console.warn("Background network request failed:", error);
        return null;
      });

    // Return cached version immediately if available
    if (cached) {
      return cached;
    }

    // Wait for network if no cache
    const networkResponse = await networkPromise;
    if (networkResponse) {
      return networkResponse;
    }

    throw new Error("No cached response and network request failed");
  }

  /**
   * Cache-only strategy
   */
  private async cacheOnly(
    request: Request,
    config: CacheConfig,
  ): Promise<Response> {
    const cache = await caches.open(config.name);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw new Error("Resource not found in cache");
  }

  /**
   * Put response in cache with size management
   */
  private async putInCache(
    cache: Cache,
    request: Request,
    response: Response,
    config: CacheConfig,
  ): Promise<void> {
    // Check cache size and clean up if needed
    if (config.maxEntries) {
      await this.manageCacheSize(cache, config.maxEntries);
    }

    await cache.put(request, response);
  }

  /**
   * Manage cache size by removing old entries
   */
  private async manageCacheSize(
    cache: Cache,
    maxEntries: number,
  ): Promise<void> {
    const keys = await cache.keys();

    if (keys.length >= maxEntries) {
      // Remove oldest entries (simple FIFO)
      const entriesToRemove = keys.slice(0, keys.length - maxEntries + 1);
      await Promise.all(entriesToRemove.map((key) => cache.delete(key)));
    }
  }

  /**
   * Preload critical resources
   *
   * @param urls - URLs to preload
   */
  public async preloadCriticalResources(urls: string[]): Promise<void> {
    const cache = await caches.open("critical-resources");

    const preloadPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn(`Failed to preload ${url}:`, error);
      }
    });

    await Promise.all(preloadPromises);
  }

  /**
   * Clean up old caches
   *
   * @param currentCaches - List of current cache names to keep
   */
  public async cleanupOldCaches(currentCaches: string[]): Promise<void> {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(
      (name) => !currentCaches.includes(name),
    );

    await Promise.all(oldCaches.map((name) => caches.delete(name)));
  }
}

// ========================================
// BROWSER CACHE CLASS
// ========================================

/**
 * Browser Cache Utilities
 * Client-side cache management using localStorage/sessionStorage.
 *
 * @example
 * ```typescript
 * const cache = new BrowserCache();
 * cache.set('user', { name: 'John' }, 3600); // Cache for 1 hour
 * const user = cache.get('user');
 * ```
 */
export class BrowserCache {
  private storage: Storage;
  private prefix: string;

  constructor(
    useSessionStorage: boolean = false,
    prefix: string = "app-cache-",
  ) {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.prefix = prefix;
  }

  /**
   * Set item in cache with expiration
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (0 = no expiration)
   */
  public set<T>(key: string, value: T, ttl: number = 0): void {
    const item: BrowserCacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    try {
      this.storage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to set cache item:", error);
      // Handle quota exceeded
      this.cleanup();
    }
  }

  /**
   * Get item from cache
   *
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  public get<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr) as BrowserCacheItem<T>;

      // Check expiration
      if (item.ttl > 0 && Date.now() - item.timestamp > item.ttl * 1000) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn("Failed to get cache item:", error);
      return null;
    }
  }

  /**
   * Remove item from cache
   *
   * @param key - Cache key
   */
  public remove(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  /**
   * Clear all cache items
   */
  public clear(): void {
    const keys = Object.keys(this.storage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }

  /**
   * Cleanup expired items
   */
  public cleanup(): void {
    const keys = Object.keys(this.storage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const itemStr = this.storage.getItem(key);
        if (itemStr) {
          try {
            const item = JSON.parse(itemStr) as BrowserCacheItem;
            if (item.ttl > 0 && Date.now() - item.timestamp > item.ttl * 1000) {
              this.storage.removeItem(key);
            }
          } catch {
            // Remove corrupted items
            this.storage.removeItem(key);
          }
        }
      }
    });
  }

  /**
   * Check if key exists in cache
   *
   * @param key - Cache key
   * @returns True if key exists and is not expired
   */
  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get all cache keys
   *
   * @returns Array of cache keys (without prefix)
   */
  public keys(): string[] {
    const keys = Object.keys(this.storage);
    return keys
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.substring(this.prefix.length));
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Initialize cache optimization
 *
 * @returns Cache manager and browser cache instances
 */
export function initializeCacheOptimization(): {
  cacheManager: CacheManager;
  browserCache: BrowserCache;
} {
  const cacheManager = new CacheManager();
  const browserCache = new BrowserCache();

  // Setup periodic cleanup
  if (typeof setInterval !== "undefined") {
    setInterval(() => {
      browserCache.cleanup();
    }, 300000); // 5 minutes
  }

  // Register service worker in production only to avoid dev preview conflicts
  if (
    import.meta.env.PROD &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator
  ) {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const swUrl = `${base}/sw.js`;
    const scope = import.meta.env.BASE_URL || "/";
    navigator.serviceWorker.register(swUrl, { scope }).catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  }

  return { cacheManager, browserCache };
}

/**
 * Generate service worker code
 *
 * @returns Service worker code as string
 */
export function generateServiceWorkerCode(): string {
  return `
// Service Worker for Cache Optimization
const CACHE_VERSION = 'v1.2.0';
const CACHE_PREFIX = 'nosyt-labs';

// Cache names
const STATIC_CACHE = \`\${CACHE_PREFIX}-static-\${CACHE_VERSION}\`;
const DYNAMIC_CACHE = \`\${CACHE_PREFIX}-dynamic-\${CACHE_VERSION}\`;
const API_CACHE = \`\${CACHE_PREFIX}-api-\${CACHE_VERSION}\`;
const IMAGE_CACHE = \`\${CACHE_PREFIX}-images-\${CACHE_VERSION}\`;

// Respect base URL from registration scope
const BASE_PATH = (self.registration && self.registration.scope)
  ? new URL(self.registration.scope).pathname.replace(/\/$/, '')
  : '';

// Allow runtime configuration to supply additional critical resources
const EXTRA_CRITICAL = (self as any).__SW_CONFIG__ && Array.isArray((self as any).__SW_CONFIG__.criticalResources)
  ? (self as any).__SW_CONFIG__.criticalResources.map((name: string) => BASE_PATH ? \`\${BASE_PATH}/\${name}\` : \`/\${name}\`)
  : [];

const CRITICAL_RESOURCES = [
  '/',
  '/styles/critical.css',
  '/fonts/inter-var.woff2',
  ...EXTRA_CRITICAL
];

const CURRENT_CACHES = [
  'static-assets',
  'pages',
  'api',
  'images',
  'critical-resources'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith(CACHE_PREFIX) && 
              !Object.values({
                STATIC_CACHE,
                DYNAMIC_CACHE,
                API_CACHE,
                IMAGE_CACHE
              }).includes(cacheName)
            )
            .map(cacheName => {
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') {
    return;
  }
  
  if (url.origin !== location.origin && !isAssetRequest(request)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  try {
    if (isAPIRequest(request)) {
      return await handleAPIRequest(request);
    } else if (isImageRequest(request)) {
      return await handleImageRequest(request);
    } else if (isStaticAsset(request)) {
      return await handleStaticAsset(request);
    } else if (isPageRequest(request)) {
      return await handlePageRequest(request);
    } else {
      return await handleGenericRequest(request);
    }
  } catch (error) {
    console.error('[SW] Request handling error:', error);
    return await handleOfflineFallback(request);
  }
}

async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image request failed:', error);
    throw error;
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset request failed:', error);
    throw error;
  }
}

async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('[SW] Page fetch failed:', error);
    return null;
  });
  
  if (cachedResponse) {
    fetchPromise;
    return cachedResponse;
  }
  
  return await fetchPromise || handleOfflineFallback(request);
}

async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return await handleOfflineFallback(request);
  }
}

async function handleOfflineFallback(request) {
  if (request.destination === 'document') {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    const cachedPage = await cache.match('/') || 
                      await cache.match('/offline.html');
    
    if (cachedPage) {
      return cachedPage;
    }
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
         url.pathname.startsWith('/fonts/') ||
         url.pathname.startsWith('/icons/');
}

function isPageRequest(request) {
  return request.destination === 'document';
}

function isAssetRequest(request) {
  return isImageRequest(request) || isStaticAsset(request);
}

`;
}
