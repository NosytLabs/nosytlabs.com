/**
 * Optimized Performance Hook
 * Enhanced performance monitoring and optimization utilities
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  DynamicComponentLoader,
  CriticalResourceManager,
  IntelligentPrefetcher,
} from '../utils/performance/bundle-optimizer';
import { usePerformanceOptimization } from './usePerformanceOptimization';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Bundle metrics
  bundleSize?: number;
  chunkCount?: number;
  loadTime?: number;
  
  // Component metrics
  componentsLoaded?: number;
  componentsPreloaded?: number;
  cacheHitRate?: number;
}

interface OptimizationRecommendations {
  criticalResources: string[];
  preloadCandidates: string[];
  bundleOptimizations: string[];
  performanceIssues: string[];
}

interface UseOptimizedPerformanceOptions {
  enableMetrics?: boolean;
  enablePrefetching?: boolean;
  enableCriticalResourceManagement?: boolean;
  reportingInterval?: number;
}

/**
 * Enhanced performance optimization hook
 */
export function useOptimizedPerformance(options: UseOptimizedPerformanceOptions = {}) {
  const {
    enableMetrics = true,
    enablePrefetching = true,
    enableCriticalResourceManagement = true,
    reportingInterval = 5000,
  } = options;

  // Use existing performance optimization hook
  const basePerformance = usePerformanceOptimization();
  
  // Enhanced metrics state
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [recommendations, setRecommendations] = useState<OptimizationRecommendations>({
    criticalResources: [],
    preloadCandidates: [],
    bundleOptimizations: [],
    performanceIssues: [],
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Initialize performance managers
  const criticalResourceManager = useMemo(() => 
    enableCriticalResourceManagement ? new CriticalResourceManager() : null,
    [enableCriticalResourceManagement]
  );

  const intelligentPrefetcher = useMemo(() => 
    enablePrefetching ? new IntelligentPrefetcher() : null,
    [enablePrefetching]
  );

  // Collect Core Web Vitals
  const collectWebVitals = useCallback(() => {
    if (!enableMetrics || typeof window === 'undefined') return;

    // Use Performance Observer API for accurate metrics
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Navigation timing
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        if (nav && nav.responseStart && nav.fetchStart && nav.requestStart && nav.loadEventEnd) {
          setMetrics(prev => ({
            ...prev,
            fcp: nav.responseStart - nav.fetchStart,
            ttfb: nav.responseStart - nav.requestStart,
            loadTime: nav.loadEventEnd - nav.fetchStart,
          }));
        }
      }
    }
  }, [enableMetrics]);

  // Collect bundle metrics
  const collectBundleMetrics = useCallback(async () => {
    if (!enableMetrics) return;

    try {
      // Get cache stats from code-splitting module
      const cacheStats = { size: 0, hitRate: 0 }; // Placeholder since getCacheStats is not available on DynamicComponentLoader
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsResources = resourceEntries.filter(entry => 
        entry.name && (entry.name.includes('.js') || entry.name.includes('.mjs'))
      );
      
      setMetrics(prev => ({
        ...prev,
        chunkCount: jsResources.length,
        componentsLoaded: cacheStats.size,
        cacheHitRate: cacheStats.hitRate || 0,
      }));
    } catch (error) {
      console.warn('Failed to collect bundle metrics:', error);
    }
  }, [enableMetrics]);

  // Generate optimization recommendations
  const generateRecommendations = useCallback(() => {
    const newRecommendations: OptimizationRecommendations = {
      criticalResources: [],
      preloadCandidates: [],
      bundleOptimizations: [],
      performanceIssues: [],
    };

    // Analyze Core Web Vitals
    if (metrics.lcp && metrics.lcp > 2500) {
      newRecommendations.performanceIssues.push('LCP is above 2.5s - consider optimizing largest content element');
      newRecommendations.criticalResources.push('hero-image', 'main-content');
    }

    if (metrics.fid && metrics.fid > 100) {
      newRecommendations.performanceIssues.push('FID is above 100ms - consider reducing JavaScript execution time');
      newRecommendations.bundleOptimizations.push('code-splitting', 'lazy-loading');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      newRecommendations.performanceIssues.push('CLS is above 0.1 - ensure proper image dimensions and avoid layout shifts');
    }

    // Analyze bundle performance
    if (metrics.chunkCount && metrics.chunkCount > 10) {
      newRecommendations.bundleOptimizations.push('chunk-consolidation');
    }

    if (metrics.cacheHitRate && metrics.cacheHitRate < 0.8) {
      newRecommendations.bundleOptimizations.push('improve-caching-strategy');
    }

    // Suggest preload candidates based on user behavior
    if (intelligentPrefetcher) {
      // IntelligentPrefetcher doesn't have getCommonNavigationPatterns method
      const commonRoutes: string[] = []; // Placeholder
      newRecommendations.preloadCandidates.push(...commonRoutes.slice(0, 3));
    }

    setRecommendations(newRecommendations);
  }, [metrics, intelligentPrefetcher]);

  // Apply optimizations
  const applyOptimizations = useCallback(async () => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    
    try {
      // Apply critical resource optimizations
      if (criticalResourceManager && recommendations.criticalResources.length > 0) {
        // CriticalResourceManager.preloadCriticalResources is a static method
        const criticalResources = recommendations.criticalResources.map(resource => ({
          type: 'js' as const,
          href: resource,
          priority: 'high' as const
        }));
        CriticalResourceManager.preloadCriticalResources(criticalResources);
      }

      // Enable intelligent prefetching
      if (intelligentPrefetcher && recommendations.preloadCandidates.length > 0) {
        recommendations.preloadCandidates.forEach(route => {
          IntelligentPrefetcher.addToPrefetchQueue(route, 'medium');
        });
      }

      // Apply bundle optimizations
      if (recommendations.bundleOptimizations.includes('lazy-loading')) {
        // Enable lazy loading for images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          img.setAttribute('loading', 'lazy');
        });
      }
    } catch (error) {
      console.error('Failed to apply optimizations:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [isOptimizing, recommendations, criticalResourceManager, intelligentPrefetcher]);

  // Preload component
  const preloadComponent = useCallback(async (
    importFn: () => Promise<any>,
    componentName: string
  ) => {
    try {
      await DynamicComponentLoader.preloadComponent(importFn, componentName);
    } catch (error) {
      console.warn(`Failed to preload component ${componentName}:`, error);
    }
  }, []);

  // Load component with optimization
  const loadOptimizedComponent = useCallback(async (
    importFn: () => Promise<any>,
    componentName: string,
    options: { priority?: 'high' | 'medium' | 'low'; timeout?: number } = {}
  ) => {
    try {
      return await DynamicComponentLoader.loadComponent(importFn, componentName, {
        priority: options.priority || 'medium',
        timeout: options.timeout || 10000,
        preload: options.priority === 'high',
      });
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      throw error;
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    if (!enableMetrics) return;

    collectWebVitals();
    collectBundleMetrics();

    const interval = setInterval(() => {
      collectBundleMetrics();
      generateRecommendations();
    }, reportingInterval);

    return () => clearInterval(interval);
  }, [collectWebVitals, collectBundleMetrics, generateRecommendations, reportingInterval, enableMetrics]);

  // Performance score calculation
  const performanceScore = useMemo(() => {
    let score = 100;
    
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 30;
      else if (metrics.lcp > 2500) score -= 15;
    }
    
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 25;
      else if (metrics.fid > 100) score -= 10;
    }
    
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 20;
      else if (metrics.cls > 0.1) score -= 10;
    }
    
    return Math.max(0, score);
  }, [metrics]);

  return {
    // Enhanced metrics
    metrics: {
      ...basePerformance.metrics,
      ...metrics,
      performanceScore,
    },
    
    // Recommendations
    recommendations,
    
    // Actions
    applyOptimizations,
    preloadComponent,
    loadOptimizedComponent,
    
    // State
    isOptimizing,
    
    // Utilities
    criticalResourceManager,
    intelligentPrefetcher,
  };
}

export default useOptimizedPerformance;