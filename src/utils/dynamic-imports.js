/**
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
        setTimeout(() => reject(new Error(`Import timeout: ${modulePath}`)), timeout)
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
  window.DynamicImportManager.lazyLoadComponent(path, element);