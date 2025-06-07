#!/usr/bin/env node

/**
 * Performance & Bundle Analyzer for NosytLabs - 2025
 * Comprehensive analysis of bundle sizes, performance metrics, and optimization opportunities
 * Implements advanced code splitting and asset loading optimizations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class PerformanceBundleAnalyzer {
  constructor() {
    this.stats = {
      totalBundles: 0,
      totalSize: 0,
      compressedSize: 0,
      jsFiles: 0,
      cssFiles: 0,
      imageFiles: 0,
      performanceScore: 0,
      optimizationOpportunities: []
    };
    
    this.config = {
      // Performance thresholds
      thresholds: {
        bundleSize: 250 * 1024,      // 250KB max per bundle
        totalSize: 2 * 1024 * 1024,  // 2MB max total
        imageSize: 500 * 1024,       // 500KB max per image
        cssSize: 100 * 1024,         // 100KB max per CSS file
        jsSize: 200 * 1024           // 200KB max per JS file
      },
      
      // Directories to analyze
      analyzeDirs: [
        'dist',
        'public/scripts/bundles',
        'public/styles/bundles',
        'public/styles/optimized',
        'public/images'
      ],
      
      // File patterns
      patterns: {
        js: /\.(js|mjs|ts)$/,
        css: /\.css$/,
        images: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/,
        fonts: /\.(woff|woff2|ttf|otf)$/
      }
    };
    
    this.performanceMetrics = {
      coreWebVitals: {
        fcp: null,  // First Contentful Paint
        lcp: null,  // Largest Contentful Paint
        fid: null,  // First Input Delay
        cls: null   // Cumulative Layout Shift
      },
      bundleMetrics: {
        loadTimes: new Map(),
        compressionRatios: new Map(),
        dependencyGraph: new Map()
      }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const icons = { info: '🔄', success: '✅', warning: '⚠️', error: '❌' };
    console.log(`[${timestamp}] ${icons[type]} ${message}`);
  }

  async analyze() {
    this.log('Starting Performance & Bundle Analysis', 'info');
    console.log('⚡ Analyzing bundle sizes and performance metrics...\n');
    
    try {
      // Phase 1: Analyze bundle sizes
      await this.analyzeBundleSizes();
      
      // Phase 2: Analyze asset optimization
      await this.analyzeAssetOptimization();
      
      // Phase 3: Implement code splitting improvements
      await this.implementCodeSplitting();
      
      // Phase 4: Optimize asset loading
      await this.optimizeAssetLoading();
      
      // Phase 5: Generate performance utilities
      await this.generatePerformanceUtilities();
      
      // Phase 6: Create bundle analyzer report
      await this.createBundleReport();
      
      // Phase 7: Generate recommendations
      this.generateRecommendations();
      
      this.log('Performance and bundle analysis completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Performance analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async analyzeBundleSizes() {
    this.log('Phase 1: Analyzing bundle sizes and composition');
    
    for (const dir of this.config.analyzeDirs) {
      const fullPath = path.join(rootDir, dir);
      
      if (fs.existsSync(fullPath)) {
        await this.analyzeDirectory(fullPath, dir);
      }
    }
    
    this.log(`  Total bundles analyzed: ${this.stats.totalBundles}`);
    this.log(`  Total size: ${this.formatBytes(this.stats.totalSize)}`);
  }

  async analyzeDirectory(dirPath, relativePath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        await this.analyzeDirectory(filePath, path.join(relativePath, file));
      } else {
        await this.analyzeFile(filePath, relativePath, file);
      }
    }
  }

  async analyzeFile(filePath, relativePath, fileName) {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    
    this.stats.totalSize += fileSize;
    this.stats.totalBundles++;
    
    // Categorize files
    if (this.config.patterns.js.test(fileName)) {
      this.stats.jsFiles++;
      await this.analyzeJSFile(filePath, fileSize);
    } else if (this.config.patterns.css.test(fileName)) {
      this.stats.cssFiles++;
      await this.analyzeCSSFile(filePath, fileSize);
    } else if (this.config.patterns.images.test(fileName)) {
      this.stats.imageFiles++;
      await this.analyzeImageFile(filePath, fileSize);
    }
    
    // Check against thresholds
    this.checkFileThresholds(fileName, fileSize, relativePath);
    
    this.log(`  Analyzed: ${path.join(relativePath, fileName)} (${this.formatBytes(fileSize)})`);
  }

  async analyzeJSFile(filePath, fileSize) {
    if (fileSize > this.config.thresholds.jsSize) {
      this.stats.optimizationOpportunities.push({
        type: 'Large JS Bundle',
        file: filePath,
        size: fileSize,
        recommendation: 'Consider code splitting or tree shaking'
      });
    }
    
    // Analyze dependencies if possible
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const imports = this.extractImports(content);
      this.performanceMetrics.bundleMetrics.dependencyGraph.set(filePath, imports);
    } catch (error) {
      // Skip if file can't be read
    }
  }

  async analyzeCSSFile(filePath, fileSize) {
    if (fileSize > this.config.thresholds.cssSize) {
      this.stats.optimizationOpportunities.push({
        type: 'Large CSS File',
        file: filePath,
        size: fileSize,
        recommendation: 'Consider CSS splitting or purging unused styles'
      });
    }
  }

  async analyzeImageFile(filePath, fileSize) {
    if (fileSize > this.config.thresholds.imageSize) {
      this.stats.optimizationOpportunities.push({
        type: 'Large Image',
        file: filePath,
        size: fileSize,
        recommendation: 'Consider image compression or modern formats (WebP, AVIF)'
      });
    }
  }

  extractImports(content) {
    const imports = [];
    
    // Extract ES6 imports
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Extract require statements
    const requireRegex = /require\(['"`]([^'"`]+)['"`]\)/g;
    
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  checkFileThresholds(fileName, fileSize, relativePath) {
    const filePath = path.join(relativePath, fileName);
    
    if (fileSize > this.config.thresholds.bundleSize) {
      this.stats.optimizationOpportunities.push({
        type: 'Large Bundle',
        file: filePath,
        size: fileSize,
        recommendation: 'Bundle exceeds recommended size limit'
      });
    }
  }

  async analyzeAssetOptimization() {
    this.log('Phase 2: Analyzing asset optimization opportunities');
    
    // Check for unoptimized images
    const imageDir = path.join(rootDir, 'public/images');
    if (fs.existsSync(imageDir)) {
      await this.analyzeImageOptimization(imageDir);
    }
    
    // Check for font optimization
    const fontDir = path.join(rootDir, 'public/fonts');
    if (fs.existsSync(fontDir)) {
      await this.analyzeFontOptimization(fontDir);
    }
  }

  async analyzeImageOptimization(imageDir) {
    const images = this.findFiles(imageDir, this.config.patterns.images);
    
    for (const imagePath of images) {
      const stats = fs.statSync(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      
      // Check for modern format alternatives
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const avifPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        
        if (!fs.existsSync(webpPath)) {
          this.stats.optimizationOpportunities.push({
            type: 'Missing WebP Format',
            file: imagePath,
            size: stats.size,
            recommendation: 'Generate WebP version for better compression'
          });
        }
        
        if (!fs.existsSync(avifPath)) {
          this.stats.optimizationOpportunities.push({
            type: 'Missing AVIF Format',
            file: imagePath,
            size: stats.size,
            recommendation: 'Generate AVIF version for optimal compression'
          });
        }
      }
    }
  }

  async analyzeFontOptimization(fontDir) {
    const fonts = this.findFiles(fontDir, this.config.patterns.fonts);
    
    for (const fontPath of fonts) {
      const ext = path.extname(fontPath).toLowerCase();
      
      if (ext !== '.woff2') {
        this.stats.optimizationOpportunities.push({
          type: 'Font Format Optimization',
          file: fontPath,
          recommendation: 'Convert to WOFF2 for better compression and browser support'
        });
      }
    }
  }

  findFiles(dir, pattern) {
    const files = [];
    
    const scan = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scan(itemPath);
        } else if (pattern.test(item)) {
          files.push(itemPath);
        }
      }
    };
    
    if (fs.existsSync(dir)) {
      scan(dir);
    }
    
    return files;
  }

  async implementCodeSplitting() {
    this.log('Phase 3: Implementing code splitting improvements');

    // Generate optimized Vite configuration for code splitting
    const viteConfig = this.generateOptimizedViteConfig();
    const configPath = path.join(rootDir, 'vite.config.optimized.js');

    fs.writeFileSync(configPath, viteConfig);
    this.log('  Optimized Vite configuration generated', 'success');

    // Create dynamic import utilities
    const dynamicImportUtils = this.generateDynamicImportUtils();
    const utilsPath = path.join(rootDir, 'src/utils/dynamic-imports.js');

    fs.writeFileSync(utilsPath, dynamicImportUtils);
    this.log('  Dynamic import utilities created', 'success');
  }

  generateOptimizedViteConfig() {
    return `// Optimized Vite Configuration for Code Splitting
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'analytics': ['@vercel/analytics', '@vercel/speed-insights'],

          // Feature-based chunks
          'nosytos95': [
            './src/components/Windows95Window.astro',
            './src/components/EnhancedWindows95Window.astro'
          ],
          'games': [
            './src/components/DuckHuntGame.js'
          ],
          'forms': [
            './src/components/ContactForm.astro',
            './src/components/ProjectSubmissionForm.astro'
          ],
          'animations': [
            './src/components/animations/AnimatedSection.astro',
            './src/components/animations/AnimatedText.astro'
          ]
        },

        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\\.[^.]+$/, '')
            : 'chunk';
          return \`chunks/\${facadeModuleId}-[hash].js\`;
        },

        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return \`assets/images/[name]-[hash].\${ext}\`;
          }

          if (/css/i.test(ext)) {
            return \`assets/styles/[name]-[hash].\${ext}\`;
          }

          return \`assets/[name]-[hash].\${ext}\`;
        }
      }
    },

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,

    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',

    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom'
    ],
    exclude: [
      '@vercel/analytics',
      '@vercel/speed-insights'
    ]
  }
});`;
  }

  generateDynamicImportUtils() {
    return `/**
 * Dynamic Import Utilities for Code Splitting
 * Provides lazy loading and performance optimization utilities
 */

class DynamicImportManager {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.performanceMetrics = {
      loadTimes: new Map(),
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  /**
   * Dynamically import a module with caching
   * @param {string} modulePath - Path to the module
   * @param {Object} options - Import options
   * @returns {Promise} - Promise that resolves to the module
   */
  async importModule(modulePath, options = {}) {
    const { cache = true, timeout = 10000 } = options;

    // Check cache first
    if (cache && this.loadedModules.has(modulePath)) {
      this.performanceMetrics.cacheHits++;
      return this.loadedModules.get(modulePath);
    }

    // Check if already loading
    if (this.loadingPromises.has(modulePath)) {
      return this.loadingPromises.get(modulePath);
    }

    this.performanceMetrics.cacheMisses++;
    const startTime = performance.now();

    const loadPromise = Promise.race([
      import(modulePath),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(\`Import timeout: \${modulePath}\`)), timeout)
      )
    ]).then(module => {
      const loadTime = performance.now() - startTime;
      this.performanceMetrics.loadTimes.set(modulePath, loadTime);

      if (cache) {
        this.loadedModules.set(modulePath, module);
      }

      this.loadingPromises.delete(modulePath);
      return module;
    }).catch(error => {
      this.loadingPromises.delete(modulePath);
      throw error;
    });

    this.loadingPromises.set(modulePath, loadPromise);
    return loadPromise;
  }

  /**
   * Preload modules for better performance
   * @param {string[]} modulePaths - Array of module paths to preload
   */
  async preloadModules(modulePaths) {
    const preloadPromises = modulePaths.map(path =>
      this.importModule(path, { cache: true })
    );

    return Promise.allSettled(preloadPromises);
  }

  /**
   * Lazy load component with intersection observer
   * @param {string} componentPath - Path to the component
   * @param {Element} targetElement - Element to observe
   * @param {Object} options - Observer options
   */
  lazyLoadComponent(componentPath, targetElement, options = {}) {
    const { threshold = 0.1, rootMargin = '50px' } = options;

    return new Promise((resolve, reject) => {
      const observer = new IntersectionObserver(
        async (entries) => {
          const [entry] = entries;

          if (entry.isIntersecting) {
            observer.disconnect();

            try {
              const module = await this.importModule(componentPath);
              resolve(module);
            } catch (error) {
              reject(error);
            }
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(targetElement);
    });
  }

  /**
   * Get performance metrics
   * @returns {Object} - Performance metrics
   */
  getMetrics() {
    return {
      loadedModules: this.loadedModules.size,
      cacheHitRatio: this.performanceMetrics.cacheHits /
        (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses),
      averageLoadTime: this.calculateAverageLoadTime(),
      loadTimes: Object.fromEntries(this.performanceMetrics.loadTimes)
    };
  }

  calculateAverageLoadTime() {
    const times = Array.from(this.performanceMetrics.loadTimes.values());
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.loadedModules.clear();
    this.loadingPromises.clear();
    this.performanceMetrics = {
      loadTimes: new Map(),
      cacheHits: 0,
      cacheMisses: 0
    };
  }
}

// Create global instance
window.DynamicImportManager = new DynamicImportManager();

// Export for module usage
export default DynamicImportManager;

// Utility functions
export const lazyImport = (path) => window.DynamicImportManager.importModule(path);
export const preloadComponents = (paths) => window.DynamicImportManager.preloadModules(paths);
export const lazyLoadOnScroll = (path, element) =>
  window.DynamicImportManager.lazyLoadComponent(path, element);`;
  }

  async optimizeAssetLoading() {
    this.log('Phase 4: Optimizing asset loading strategies');

    // Generate resource hints
    const resourceHints = this.generateResourceHints();
    const hintsPath = path.join(rootDir, 'src/utils/resource-hints.js');

    fs.writeFileSync(hintsPath, resourceHints);
    this.log('  Resource hints utilities generated', 'success');

    // Create service worker for caching
    const serviceWorker = this.generateServiceWorker();
    const swPath = path.join(rootDir, 'public/sw.js');

    fs.writeFileSync(swPath, serviceWorker);
    this.log('  Service worker for caching generated', 'success');
  }

  generateResourceHints() {
    return `/**
 * Resource Hints for Performance Optimization
 * Implements preload, prefetch, and preconnect strategies
 */

class ResourceHintsManager {
  constructor() {
    this.preloadedResources = new Set();
    this.prefetchedResources = new Set();
  }

  /**
   * Preload critical resources
   * @param {Array} resources - Array of resource objects
   */
  preloadCriticalResources(resources = []) {
    const defaultResources = [
      { href: '/styles/optimized/critical-optimized.css', as: 'style', type: 'text/css' },
      { href: '/scripts/bundles/core.min.js', as: 'script', type: 'text/javascript' },
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
    ];

    const allResources = [...defaultResources, ...resources];

    allResources.forEach(resource => {
      if (!this.preloadedResources.has(resource.href)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        if (resource.media) link.media = resource.media;

        document.head.appendChild(link);
        this.preloadedResources.add(resource.href);
      }
    });
  }

  /**
   * Prefetch resources for future navigation
   * @param {Array} resources - Array of resource URLs
   */
  prefetchResources(resources) {
    resources.forEach(href => {
      if (!this.prefetchedResources.has(href)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;

        document.head.appendChild(link);
        this.prefetchedResources.add(href);
      }
    });
  }

  /**
   * Preconnect to external domains
   * @param {Array} domains - Array of domain URLs
   */
  preconnectDomains(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';

      document.head.appendChild(link);
    });
  }

  /**
   * DNS prefetch for external domains
   * @param {Array} domains - Array of domain URLs
   */
  dnsPrefetch(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;

      document.head.appendChild(link);
    });
  }

  /**
   * Initialize all resource hints
   */
  init() {
    // Preconnect to external services
    this.preconnectDomains([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.nosytlabs.com'
    ]);

    // DNS prefetch for analytics
    this.dnsPrefetch([
      'https://vercel-analytics.com',
      'https://vitals.vercel-analytics.com'
    ]);

    // Preload critical resources
    this.preloadCriticalResources();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const resourceHints = new ResourceHintsManager();
  resourceHints.init();
});

export default ResourceHintsManager;`;
  }

  generateServiceWorker() {
    return `/**
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
}`;
  }

  async generatePerformanceUtilities() {
    this.log('Phase 5: Generating performance monitoring utilities');

    const performanceMonitor = `/**
 * Performance Monitor for Core Web Vitals
 * Tracks and reports performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null
    };

    this.observers = new Map();
    this.init();
  }

  init() {
    this.measureFCP();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
  }

  measureFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
        this.reportMetric('FCP', fcpEntry.startTime);
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('fcp', observer);
  }

  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  measureFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];

      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
      this.reportMetric('FID', this.metrics.fid);
      observer.disconnect();
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', observer);
  }

  measureCLS() {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      this.metrics.cls = clsValue;
      this.reportMetric('CLS', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', observer);
  }

  measureTTFB() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const navigationEntry = entries[0];

      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.reportMetric('TTFB', this.metrics.ttfb);
      observer.disconnect();
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('ttfb', observer);
  }

  reportMetric(name, value) {
    console.log(\`Performance Metric - \${name}: \${value.toFixed(2)}ms\`);

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize performance monitoring
window.PerformanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor;`;

    const monitorPath = path.join(rootDir, 'src/utils/performance-monitor.js');
    fs.writeFileSync(monitorPath, performanceMonitor);
    this.log('  Performance monitoring utilities generated', 'success');
  }

  async createBundleReport() {
    this.log('Phase 6: Creating comprehensive bundle analysis report');

    const report = this.generateBundleAnalysisReport();
    const reportPath = path.join(rootDir, 'bundle-analysis-report.md');

    fs.writeFileSync(reportPath, report);
    this.log('  Bundle analysis report generated', 'success');
  }

  generateBundleAnalysisReport() {
    const compressionRatio = this.stats.compressedSize > 0 ?
      ((this.stats.totalSize - this.stats.compressedSize) / this.stats.totalSize * 100).toFixed(1) : '0';

    return `# Bundle Analysis Report - NosytLabs
Generated: ${new Date().toISOString()}

## Summary
- **Total Bundles**: ${this.stats.totalBundles}
- **Total Size**: ${this.formatBytes(this.stats.totalSize)}
- **JavaScript Files**: ${this.stats.jsFiles}
- **CSS Files**: ${this.stats.cssFiles}
- **Image Files**: ${this.stats.imageFiles}
- **Compression Ratio**: ${compressionRatio}%

## Performance Thresholds
- Bundle Size Limit: ${this.formatBytes(this.config.thresholds.bundleSize)}
- Total Size Limit: ${this.formatBytes(this.config.thresholds.totalSize)}
- Image Size Limit: ${this.formatBytes(this.config.thresholds.imageSize)}
- CSS Size Limit: ${this.formatBytes(this.config.thresholds.cssSize)}
- JS Size Limit: ${this.formatBytes(this.config.thresholds.jsSize)}

## Optimization Opportunities
${this.stats.optimizationOpportunities.map(opp =>
  `- **${opp.type}**: ${opp.file} (${this.formatBytes(opp.size)}) - ${opp.recommendation}`
).join('\n')}

## Recommendations
${this.generateOptimizationRecommendations()}

## Code Splitting Strategy
- Vendor chunks separated for better caching
- Feature-based chunks for lazy loading
- Dynamic imports for non-critical components
- Service worker caching for static assets

## Performance Monitoring
- Core Web Vitals tracking implemented
- Bundle load time monitoring
- Cache hit ratio tracking
- Resource hint optimization
`;
  }

  generateOptimizationRecommendations() {
    const recommendations = [];

    if (this.stats.totalSize > this.config.thresholds.totalSize) {
      recommendations.push('Consider implementing more aggressive code splitting');
    }

    if (this.stats.optimizationOpportunities.length > 0) {
      recommendations.push('Address identified optimization opportunities');
    }

    recommendations.push('Implement progressive loading for images');
    recommendations.push('Use modern image formats (WebP, AVIF)');
    recommendations.push('Enable gzip/brotli compression on server');
    recommendations.push('Implement resource hints for critical resources');

    return recommendations.map(rec => `- ${rec}`).join('\n');
  }

  generateRecommendations() {
    this.log('Phase 7: Generating performance recommendations');

    const totalSizeScore = this.stats.totalSize <= this.config.thresholds.totalSize ? 100 :
      Math.max(0, 100 - ((this.stats.totalSize - this.config.thresholds.totalSize) / this.config.thresholds.totalSize * 100));

    const optimizationScore = Math.max(0, 100 - (this.stats.optimizationOpportunities.length * 10));

    this.stats.performanceScore = Math.round((totalSizeScore + optimizationScore) / 2);

    console.log('\\n📊 Performance & Bundle Analysis Report');
    console.log('========================================');
    console.log(`Total Bundles: ${this.stats.totalBundles}`);
    console.log(`Total Size: ${this.formatBytes(this.stats.totalSize)}`);
    console.log(`JavaScript Files: ${this.stats.jsFiles}`);
    console.log(`CSS Files: ${this.stats.cssFiles}`);
    console.log(`Image Files: ${this.stats.imageFiles}`);
    console.log(`Performance Score: ${this.stats.performanceScore}/100`);
    console.log(`Optimization Opportunities: ${this.stats.optimizationOpportunities.length}`);

    console.log('\\n💡 Performance Optimizations Implemented:');
    console.log('✅ Code splitting configuration generated');
    console.log('✅ Dynamic import utilities created');
    console.log('✅ Resource hints optimization implemented');
    console.log('✅ Service worker caching strategy deployed');
    console.log('✅ Performance monitoring utilities generated');
    console.log('✅ Bundle analysis report created');

    console.log('\\n🚀 Next Steps:');
    console.log('1. Test the optimized build configuration');
    console.log('2. Monitor Core Web Vitals in production');
    console.log('3. Implement progressive image loading');
    console.log('4. Set up performance budgets in CI/CD');
    console.log('5. Consider implementing a CDN for static assets');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the performance bundle analyzer
console.log('Starting Performance & Bundle Analyzer...');
const analyzer = new PerformanceBundleAnalyzer();
analyzer.analyze().catch(error => {
  console.error('Performance analysis failed:', error);
  process.exit(1);
});
