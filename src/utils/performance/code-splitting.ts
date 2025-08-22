/**
 * Code Splitting Utilities
 * Dynamic component loading and bundle optimization
 */

import React, { type ComponentType, type LazyExoticComponent, Suspense, createElement } from 'react';

/**
 * Configuration for dynamic imports
 */
export interface DynamicImportConfig {
  /** Preload the component when conditions are met */
  preload?: boolean;
  /** Delay before preloading (ms) */
  preloadDelay?: number;
  /** Preload on hover */
  preloadOnHover?: boolean;
  /** Preload on viewport intersection */
  preloadOnIntersection?: boolean;
  /** Custom loading component */
  fallback?: React.ComponentType;
  /** Error boundary component */
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** Retry attempts on load failure */
  retryAttempts?: number;
  /** Retry delay (ms) */
  retryDelay?: number;
}

/**
 * Component loading state
 */
interface LoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Cache for loaded components
 */
const componentCache = new Map<string, Promise<{ default: ComponentType<any> }>>();
const preloadCache = new Set<string>();

/**
 * Default loading component
 */
const DefaultFallback: React.FC = () => 
  createElement('div', { className: 'flex items-center justify-center p-8' },
    createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' })
  );

/**
 * Default error boundary component
 */
const DefaultErrorBoundary: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => 
  createElement('div', { className: 'flex flex-col items-center justify-center p-8 text-center' },
    createElement('div', { className: 'text-red-600 mb-4' },
      createElement('svg', { className: 'w-12 h-12 mx-auto mb-2', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' })
      ),
      createElement('p', { className: 'text-sm font-medium' }, 'Failed to load component'),
      createElement('p', { className: 'text-xs text-gray-500 mt-1' }, error.message)
    ),
    createElement('button', {
      onClick: retry,
      className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm'
    }, 'Retry')
  );

/**
 * Create a dynamically imported component with advanced features
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  config: DynamicImportConfig = {}
): LazyExoticComponent<ComponentType<T>> {
  const {
    preload = false,
    preloadDelay = 0,
    preloadOnHover = false,
    preloadOnIntersection = false,
    fallback: CustomFallback = DefaultFallback,
    errorBoundary: CustomErrorBoundary = DefaultErrorBoundary,
    retryAttempts = 3,
    retryDelay = 1000,
  } = config;

  // Generate a unique key for caching
  const cacheKey = importFn.toString();

  /**
   * Enhanced import function with retry logic
   */
  const enhancedImportFn = async (): Promise<{ default: ComponentType<T> }> => {
    // Check cache first
    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey)!;
    }

    let lastError: Error | undefined;
    let attempts = 0;

    while (attempts <= retryAttempts) {
      try {
        const modulePromise = importFn();
        componentCache.set(cacheKey, modulePromise);
        return await modulePromise;
      } catch (error) {
        lastError = error as Error;
        attempts++;

        if (attempts <= retryAttempts) {
          // Wait before retrying
          await new Promise<void>(resolve => {
            setTimeout(() => resolve(), retryDelay * attempts);
          });
          // Remove failed promise from cache
          componentCache.delete(cacheKey);
        }
      }
    }

    throw new Error(lastError?.message || 'Component loading failed');
  };

  // Create lazy component
  const LazyComponent = React.lazy(enhancedImportFn);

  // Preload logic
  if (preload && !preloadCache.has(cacheKey)) {
    preloadCache.add(cacheKey);
    
    if (preloadDelay > 0) {
      setTimeout(() => {
        enhancedImportFn().catch(() => {});
      }, preloadDelay);
    } else {
      enhancedImportFn().catch(() => {});
    }
  }

  // Return enhanced component with error boundary
  return React.forwardRef<any, T>((props, ref) => {
    const [loadingState, setLoadingState] = React.useState<LoadingState>({
      isLoading: false,
      isLoaded: false,
      error: null,
      retryCount: 0,
    });

    const elementRef = React.useRef<HTMLDivElement>(null);

    /**
     * Preload on hover
     */
    const handleMouseEnter = React.useCallback(() => {
      if (preloadOnHover && !preloadCache.has(cacheKey)) {
        preloadCache.add(cacheKey);
        enhancedImportFn().catch(() => {});
      }
    }, []);

    /**
     * Preload on intersection
     */
    React.useEffect(() => {
      if (!preloadOnIntersection || preloadCache.has(cacheKey)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            preloadCache.add(cacheKey);
            enhancedImportFn().catch(() => {});
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, []);

    /**
     * Retry loading
     */
    const retry = React.useCallback(() => {
      setLoadingState(prev => ({
        ...prev,
        error: null,
        retryCount: prev.retryCount + 1,
      }));
      
      // Clear cache to force reload
      componentCache.delete(cacheKey);
    }, []);

    // Loading states are handled automatically by Suspense

    if (loadingState.error) {
      return createElement(CustomErrorBoundary, {
        error: loadingState.error,
        retry,
      });
    }

    return createElement('div', {
        ref: elementRef,
        onMouseEnter: handleMouseEnter,
        className: 'dynamic-component-wrapper'
      },
      createElement(Suspense, { fallback: createElement(CustomFallback) },
        createElement(LazyComponent as any, { ...props, ref })
      )
    );
  }) as LazyExoticComponent<ComponentType<T>>;
}

/**
 * Preload a component
 */
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>
): Promise<{ default: ComponentType<any> }> {
  const cacheKey = importFn.toString();
  
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }

  const modulePromise = importFn();
  componentCache.set(cacheKey, modulePromise);
  preloadCache.add(cacheKey);
  
  return modulePromise;
}

/**
 * Preload multiple components
 */
export function preloadComponents(
  importFns: Array<() => Promise<{ default: ComponentType<any> }>>
): Promise<Array<{ default: ComponentType<any> }>> {
  return Promise.all(importFns.map(preloadComponent));
}

/**
 * Clear component cache
 */
export function clearComponentCache(): void {
  componentCache.clear();
  preloadCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  cached: number;
  preloaded: number;
  totalSize: number;
} {
  return {
    cached: componentCache.size,
    preloaded: preloadCache.size,
    totalSize: componentCache.size + preloadCache.size,
  };
}

/**
 * Route-based code splitting helper
 */
export function createRouteComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  return createDynamicComponent(importFn, {
    preload: false,
    preloadOnIntersection: true,
    preloadOnHover: true,
    retryAttempts: 2,
    retryDelay: 500,
  });
}

/**
 * Feature-based code splitting helper
 */
export function createFeatureComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  return createDynamicComponent(importFn, {
    preload: false,
    preloadOnHover: true,
    retryAttempts: 3,
    retryDelay: 1000,
  });
}

/**
 * Critical component (loads immediately)
 */
export function createCriticalComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  return createDynamicComponent(importFn, {
    preload: true,
    preloadDelay: 0,
    retryAttempts: 5,
    retryDelay: 500,
  });
}

/**
 * Non-critical component (loads on demand)
 */
export function createNonCriticalComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyExoticComponent<ComponentType<T>> {
  return createDynamicComponent(importFn, {
    preload: false,
    preloadOnIntersection: true,
    retryAttempts: 2,
    retryDelay: 2000,
  });
}

export default {
  createDynamicComponent,
  preloadComponent,
  preloadComponents,
  clearComponentCache,
  getCacheStats,
  createRouteComponent,
  createFeatureComponent,
  createCriticalComponent,
  createNonCriticalComponent,
};