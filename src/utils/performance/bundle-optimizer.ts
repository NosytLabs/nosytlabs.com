/**
 * Bundle Optimizer
 * Phase 2 Performance Enhancement: Advanced bundle splitting and dynamic loading strategies
 */

import * as React from 'react';
import { logger } from '../logger';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ComponentLoadingOptions {
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
  timeout?: number;
  fallback?: React.ComponentType;
  onError?: (error: Error) => void;
}

export interface ChunkLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  component?: React.ComponentType;
  error?: Error;
}

export interface CriticalResource {
  type: 'css' | 'js' | 'font';
  href: string;
  priority: 'high' | 'medium' | 'low';
  media?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}

// ============================================================================
// DYNAMIC COMPONENT LOADER
// ============================================================================

/**
 * Enhanced dynamic component loader with intelligent preloading
 */
export class DynamicComponentLoader {
  private static loadingCache = new Map<string, Promise<React.ComponentType>>();
  private static componentCache = new Map<string, React.ComponentType>();
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  /**
   * Load component dynamically with caching and error handling
   */
  static async loadComponent(
    importFn: () => Promise<{ default: React.ComponentType }>,
    componentName: string,
    options: ComponentLoadingOptions = {}
  ): Promise<React.ComponentType> {
    // Return cached component if available
    if (this.componentCache.has(componentName)) {
      return this.componentCache.get(componentName)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingCache.has(componentName)) {
      return this.loadingCache.get(componentName)!;
    }

    // Create loading promise with timeout
    const loadingPromise = this.createLoadingPromise(importFn, componentName, options);
    this.loadingCache.set(componentName, loadingPromise);

    try {
      const component = await loadingPromise;
      this.componentCache.set(componentName, component);
      this.loadingCache.delete(componentName);
      return component;
    } catch (error) {
      this.loadingCache.delete(componentName);
      throw error;
    }
  }

  private static async createLoadingPromise(
    importFn: () => Promise<{ default: React.ComponentType }>,
    componentName: string,
    options: ComponentLoadingOptions
  ): Promise<React.ComponentType> {
    const timeout = options.timeout || 10000; // 10 second default timeout

    return Promise.race([
      importFn().then(module => {
        logger.info(`Successfully loaded component: ${componentName}`, 'DynamicComponentLoader');
        return module.default;
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          const error = new Error(`Component loading timeout: ${componentName}`);
          options.onError?.(error);
          reject(error);
        }, timeout);
        // Explicitly return void to satisfy no-promise-executor-return rule
        return;
      }),
    ]).catch(error => {
      logger.error(`Failed to load component: ${componentName}`, error, 'DynamicComponentLoader');
      options.onError?.(error);

      // Return fallback component if available
      if (options.fallback) {
        return options.fallback;
      }

      throw error;
    });
  }

  /**
   * Preload component for future use
   */
  static preloadComponent(
    importFn: () => Promise<{ default: React.ComponentType }>,
    componentName: string,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    if (this.componentCache.has(componentName) || this.loadingCache.has(componentName)) {
      return; // Already loaded or loading
    }

    // Add to preload queue based on priority
    const queueItem = `${priority}:${componentName}`;
    if (!this.preloadQueue.includes(queueItem)) {
      this.preloadQueue.push(queueItem);
      this.processPreloadQueue();
    }

    // Store import function for later use
    (this as any)[`_import_${componentName}`] = importFn;
  }

  private static async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    // Sort by priority
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const [aPriority] = a.split(':');
      const [bPriority] = b.split(':');
      return (
        priorityOrder[bPriority as keyof typeof priorityOrder] -
        priorityOrder[aPriority as keyof typeof priorityOrder]
      );
    });

    while (this.preloadQueue.length > 0) {
      const queueItem = this.preloadQueue.shift()!;
      const [, componentName] = queueItem.split(':');
      
      if (!componentName) continue;
      
      const importFn = (this as any)[`_import_${componentName}`];
  
      if (importFn) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await this.loadComponent(importFn, componentName, { priority: 'low' });
        } catch (_error) {
          // Silently handle preload errors
          logger.warn(`Preload failed for component: ${componentName}`, 'DynamicComponentLoader');
        }
      }
  
      // Add delay to avoid blocking main thread
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(resolve, 50);
        return;
      });
    }

    this.isPreloading = false;
  }

  /**
   * Clear component cache (useful for development)
   */
  static clearCache(): void {
    this.componentCache.clear();
    this.loadingCache.clear();
    this.preloadQueue.length = 0;
  }
}

// ============================================================================
// CRITICAL RESOURCE MANAGER
// ============================================================================

/**
 * Manages critical CSS and resource loading for optimal performance
 */
export class CriticalResourceManager {
  private static loadedResources = new Set<string>();
  // CSS management arrays - used for tracking loaded resources
  private static criticalCSS: string[] = [];
  private static deferredCSS: string[] = [];

  /**
   * Load critical CSS inline for immediate rendering
   */
  static inlineCriticalCSS(css: string): void {
    if (typeof document === 'undefined') return;

    // Track critical CSS
    this.criticalCSS.push(css);

    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);

    logger.info('Critical CSS inlined', 'CriticalResourceManager');
  }

  /**
   * Load non-critical CSS asynchronously
   */
  static loadDeferredCSS(href: string, media: string = 'all'): void {
    if (typeof document === 'undefined' || this.loadedResources.has(href)) {
      return;
    }

    // Track deferred CSS
    this.deferredCSS.push(href);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
      link.media = media;
      this.loadedResources.add(href);
    };

    document.head.appendChild(link);
    logger.info(`Deferred CSS loaded: ${href}`, 'CriticalResourceManager');
  }

  /**
   * Preload critical resources based on priority
   */
  static preloadCriticalResources(resources: CriticalResource[]): void {
    if (typeof document === 'undefined') return;

    // Sort by priority
    const sortedResources = resources.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    sortedResources.forEach(resource => {
      if (this.loadedResources.has(resource.href)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;

      switch (resource.type) {
        case 'css':
          link.as = 'style';
          if (resource.media) link.media = resource.media;
          break;
        case 'js':
          link.as = 'script';
          break;
        case 'font':
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = resource.crossorigin || 'anonymous';
          break;
      }

      document.head.appendChild(link);
      this.loadedResources.add(resource.href);
    });

    logger.info(
      `Preloaded ${sortedResources.length} critical resources`,
      'CriticalResourceManager'
    );
  }

  /**
   * Extract critical CSS for above-the-fold content
   */
  static extractCriticalCSS(selectors: string[]): string {
    if (typeof document === 'undefined') return '';

    const criticalRules: string[] = [];

    // Get all stylesheets
    Array.from(document.styleSheets).forEach(stylesheet => {
      try {
        Array.from(stylesheet.cssRules || []).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            // Check if rule applies to critical selectors
            const matchesCritical = selectors.some(selector =>
              rule.selectorText.includes(selector)
            );

            if (matchesCritical) {
              criticalRules.push(rule.cssText);
            }
          }
        });
      } catch (_error) {
        // Handle cross-origin stylesheet access errors
        logger.warn('Cannot access stylesheet rules (cross-origin)', 'CriticalResourceManager');
      }
    });

    return criticalRules.join('\n');
  }
}

// ============================================================================
// INTELLIGENT PREFETCHING
// ============================================================================

/**
 * Intelligent prefetching based on user behavior and connection quality
 */
export class IntelligentPrefetcher {
  private static prefetchQueue: string[] = [];
  private static userInteractionHistory: string[] = [];
  private static isPrefetching = false;

  /**
   * Add route to prefetch queue based on user interaction patterns
   */
  static addToPrefetchQueue(route: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    if (this.prefetchQueue.includes(route)) return;

    // Check connection quality
    if (!this.shouldPrefetch()) {
      logger.info(
        `Skipping prefetch for ${route} due to connection constraints`,
        'IntelligentPrefetcher'
      );
      return;
    }

    // Add to queue with priority prefix
    this.prefetchQueue.push(`${priority}:${route}`);
    this.processPrefetchQueue();
  }

  private static shouldPrefetch(): boolean {
    if (typeof navigator === 'undefined') return true;

    const connection = (navigator as any).connection;
    if (!connection) return true;

    // Don't prefetch on slow connections or data saver mode
    if (
      connection.saveData ||
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    ) {
      return false;
    }

    return true;
  }

  private static async processPrefetchQueue(): Promise<void> {
    if (this.isPrefetching || this.prefetchQueue.length === 0) return;

    this.isPrefetching = true;

    // Sort by priority
    this.prefetchQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const [aPriority] = a.split(':');
      const [bPriority] = b.split(':');
      return (
        priorityOrder[bPriority as keyof typeof priorityOrder] -
        priorityOrder[aPriority as keyof typeof priorityOrder]
      );
    });

    while (this.prefetchQueue.length > 0) {
       
      const queueItem = this.prefetchQueue.shift()!;
      const [, route] = queueItem.split(':');

      if (route) {
        // eslint-disable-next-line no-await-in-loop
        await this.prefetchRoute(route);
      }

      // Add delay between prefetches
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(resolve, 100);
        return;
      });
    }

    this.isPrefetching = false;
  }

  private static async prefetchRoute(route: string): Promise<void> {
    try {
      if (typeof document === 'undefined') return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);

      logger.info(`Prefetched route: ${route}`, 'IntelligentPrefetcher');
    } catch (error) {
      logger.error(`Failed to prefetch route: ${route}`, error instanceof Error ? error : { error }, 'IntelligentPrefetcher');
    }
  }

  /**
   * Track user interactions to predict future navigation
   */
  static trackUserInteraction(route: string): void {
    this.userInteractionHistory.push(route);

    // Keep only recent history (last 10 interactions)
    if (this.userInteractionHistory.length > 10) {
      this.userInteractionHistory.shift();
    }

    // Predict and prefetch likely next routes
    this.predictAndPrefetch();
  }

  private static predictAndPrefetch(): void {
    // Simple prediction based on common patterns
    const currentRoute = this.userInteractionHistory[this.userInteractionHistory.length - 1];
    if (!currentRoute) return;

    // Define common navigation patterns
    const navigationPatterns: Record<string, string[]> = {
      '/': ['/services', '/projects', '/contact'],
      '/services': ['/projects', '/contact'],
      '/projects': ['/contact', '/services'],
      '/blog': ['/blog/[slug]', '/contact'],
    };

    const likelyRoutes = navigationPatterns[currentRoute] || [];
    likelyRoutes.forEach((route: string) => {
      this.addToPrefetchQueue(route, 'low');
    });
  }
}

// ============================================================================
// CHUNK OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Utilities for optimizing chunk loading and caching
 */
export class ChunkOptimizer {
  /**
   * Generate optimized chunk configuration for Vite/Rollup
   */
  static generateOptimizedChunks() {
    return {
      // Core framework chunks
      'react-core': ['react', 'react-dom'],
      'react-router': ['react-router-dom', '@reach/router'],

      // UI library chunks
      'ui-primitives': [
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-slot',
        '@radix-ui/react-icons',
      ],
      'ui-icons': ['lucide-react', '@heroicons/react'],

      // Form handling
      forms: ['react-hook-form', '@hookform/resolvers', 'zod'],

      // Animation libraries
      animation: ['framer-motion', '@react-spring/web'],

      // Utility libraries
      utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],

      // Analytics and monitoring
      analytics: ['@vercel/analytics', '@vercel/speed-insights'],

      // Development tools (excluded in production)
      'dev-tools': ['@tanstack/react-query-devtools'],
    };
  }

  /**
   * Calculate optimal chunk sizes based on usage patterns
   */
  static calculateOptimalChunkSizes(dependencies: Record<string, string>): Record<string, number> {
    const chunkSizes: Record<string, number> = {};

    // Estimated sizes in KB (these would be measured in real implementation)
    const estimatedSizes: Record<string, number> = {
      react: 45,
      'react-dom': 130,
      'framer-motion': 180,
      '@radix-ui/react-dialog': 25,
      'lucide-react': 60,
      'tailwind-merge': 8,
      zod: 55,
    };

    Object.keys(dependencies).forEach(dep => {
      chunkSizes[dep] = estimatedSizes[dep] || 20; // Default estimate
    });

    return chunkSizes;
  }

  /**
   * Generate cache-optimized file naming strategy
   */
  static generateCacheOptimizedNaming() {
    return {
      // Chunk naming for optimal caching
      chunkFileNames: (chunkInfo: { facadeModuleId?: string; name?: string }) => {
        const facadeModuleId = chunkInfo.facadeModuleId;

        if (facadeModuleId) {
          // Use content-based naming for better caching
          if (facadeModuleId.includes('node_modules')) {
            return 'vendor/[name]-[hash].js';
          }
          if (facadeModuleId.includes('components')) {
            return 'components/[name]-[hash].js';
          }
          if (facadeModuleId.includes('pages')) {
            return 'pages/[name]-[hash].js';
          }
        }

        return 'chunks/[name]-[hash].js';
      },

      // Asset naming for optimal caching
      assetFileNames: (assetInfo: { name: string }) => {
        const info = assetInfo.name.split('.');
        const ext = info[info.length - 1] || '';

        if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
          return 'assets/images/[name]-[hash][extname]';
        }
        if (/css/i.test(ext)) {
          return 'assets/css/[name]-[hash][extname]';
        }
        if (/woff2?|ttf|eot/i.test(ext)) {
          return 'assets/fonts/[name]-[hash][extname]';
        }

        return 'assets/[name]-[hash][extname]';
      },
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  DynamicComponentLoader,
  CriticalResourceManager,
  IntelligentPrefetcher,
  ChunkOptimizer,
};
