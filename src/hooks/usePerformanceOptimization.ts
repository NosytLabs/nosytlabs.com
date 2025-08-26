/**
 * Performance optimization hook for Core Web Vitals
 * Integrates monitoring, optimization strategies, and real-time feedback
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  webVitalsMonitor, 
  budgetChecker, 
  trackWebVitals, 
  getPerformanceReport,
  checkPerformanceBudget,
  PERFORMANCE_THRESHOLDS 
} from '@/utils/performance/core-web-vitals';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  score: number;
  isLoading: boolean;
  violations: string[];
  recommendations: string[];
  isOptimized: boolean;
}

interface PerformanceOptimizations {
  preloadCriticalResources: () => void;
  optimizeImages: () => void;
  enableServiceWorker: () => Promise<boolean>;
  measurePerformance: () => void;
  generateReport: () => any;
}

export const usePerformanceOptimization = (): [
  PerformanceState,
  PerformanceOptimizations
] => {
  const [state, setState] = useState<PerformanceState>({
    metrics: {},
    score: 0,
    isLoading: true,
    violations: [],
    recommendations: [],
    isOptimized: false,
  });

  const metricsRef = useRef<PerformanceMetrics>({});
  const observerRef = useRef<(() => void) | null>(null);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Start tracking Web Vitals
    const unsubscribe = trackWebVitals((metric) => {
      metricsRef.current = {
        ...metricsRef.current,
        [metric.name.toLowerCase()]: metric.value,
      };

      setState(prev => ({
        ...prev,
        metrics: metricsRef.current,
        score: calculatePerformanceScore(metricsRef.current),
      }));
    });

    observerRef.current = unsubscribe;

    // Check performance budget after initial load
    const checkBudget = async () => {
      try {
        const budgetResult = await checkPerformanceBudget();
        setState(prev => ({
          ...prev,
          violations: budgetResult.violations,
          recommendations: budgetResult.recommendations,
          isOptimized: budgetResult.passed,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error checking performance budget:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Wait for page load before checking budget
    if (document.readyState === 'complete') {
      setTimeout(checkBudget, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(checkBudget, 1000);
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current();
      }
    };
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (typeof window === 'undefined') return;

    const criticalResources = [
      { href: '/assets/css/critical.css', as: 'style' },
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { href: '/api/services', as: 'fetch' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      
      // Add to head if not already present
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        document.head.appendChild(link);
      }
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.nosytlabs.com',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      
      if (!document.querySelector(`link[href="${domain}"]`)) {
        document.head.appendChild(link);
      }
    });
  }, []);

  // Optimize images for better LCP
  const optimizeImages = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Find all images and optimize them
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Add loading strategy based on position
      if (index < 3) {
        // First 3 images are likely above-the-fold
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.classList.add('optimize-lcp');
      } else {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }

      // Ensure aspect ratio to prevent CLS
      if (img.width && img.height) {
        img.style.aspectRatio = `${img.width} / ${img.height}`;
      }

      // Add optimization classes
      img.classList.add('optimize-cls');
    });

    // Optimize background images
    const elementsWithBgImages = document.querySelectorAll('[style*="background-image"]');
    elementsWithBgImages.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.contentVisibility = 'auto';
      htmlElement.style.contain = 'layout style paint';
    });
  }, []);

  // Enable service worker for caching
  const enableServiceWorker = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, refresh the page
              console.log('New content available, refreshing...');
              window.location.reload();
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }, []);

  // Measure current performance
  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Measure resource loading times
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    const measurements = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalResources: resources.length,
      slowResources: resources.filter(r => r.duration > 1000).length,
      largeResources: resources.filter(r => (r.transferSize || 0) > 100000).length,
    };

    console.log('Performance measurements:', measurements);

    // Send measurements to service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PERFORMANCE_REPORT',
        metrics: measurements,
      });
    }
  }, []);

  // Generate comprehensive performance report
  const generateReport = useCallback(() => {
    const report = getPerformanceReport();
    const currentMetrics = metricsRef.current;

    return {
      ...report,
      currentMetrics,
      optimizationStatus: {
        lcp: currentMetrics.lcp ? currentMetrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.GOOD : null,
        fid: currentMetrics.fid ? currentMetrics.fid <= PERFORMANCE_THRESHOLDS.FID.GOOD : null,
        cls: currentMetrics.cls ? currentMetrics.cls <= PERFORMANCE_THRESHOLDS.CLS.GOOD : null,
        fcp: currentMetrics.fcp ? currentMetrics.fcp <= PERFORMANCE_THRESHOLDS.FCP.GOOD : null,
        ttfb: currentMetrics.ttfb ? currentMetrics.ttfb <= PERFORMANCE_THRESHOLDS.TTFB.GOOD : null,
      },
      recommendations: generateOptimizationRecommendations(currentMetrics),
    };
  }, []);

  return [
    state,
    {
      preloadCriticalResources,
      optimizeImages,
      enableServiceWorker,
      measurePerformance,
      generateReport,
    },
  ];
};

// Helper function to calculate performance score
function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const scores: number[] = [];

  if (metrics.lcp !== undefined) {
    if (metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.GOOD) scores.push(100);
    else if (metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.NEEDS_IMPROVEMENT) scores.push(50);
    else scores.push(0);
  }

  if (metrics.fid !== undefined) {
    if (metrics.fid <= PERFORMANCE_THRESHOLDS.FID.GOOD) scores.push(100);
    else if (metrics.fid <= PERFORMANCE_THRESHOLDS.FID.NEEDS_IMPROVEMENT) scores.push(50);
    else scores.push(0);
  }

  if (metrics.cls !== undefined) {
    if (metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.GOOD) scores.push(100);
    else if (metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.NEEDS_IMPROVEMENT) scores.push(50);
    else scores.push(0);
  }

  if (metrics.fcp !== undefined) {
    if (metrics.fcp <= PERFORMANCE_THRESHOLDS.FCP.GOOD) scores.push(100);
    else if (metrics.fcp <= PERFORMANCE_THRESHOLDS.FCP.NEEDS_IMPROVEMENT) scores.push(50);
    else scores.push(0);
  }

  if (metrics.ttfb !== undefined) {
    if (metrics.ttfb <= PERFORMANCE_THRESHOLDS.TTFB.GOOD) scores.push(100);
    else if (metrics.ttfb <= PERFORMANCE_THRESHOLDS.TTFB.NEEDS_IMPROVEMENT) scores.push(50);
    else scores.push(0);
  }

  return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
}

// Generate optimization recommendations based on metrics
function generateOptimizationRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.LCP.GOOD) {
    recommendations.push('Optimize Largest Contentful Paint by compressing images and preloading critical resources');
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.FID.GOOD) {
    recommendations.push('Reduce First Input Delay by optimizing JavaScript execution and using code splitting');
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.CLS.GOOD) {
    recommendations.push('Minimize Cumulative Layout Shift by setting explicit dimensions for images and reserving space for dynamic content');
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_THRESHOLDS.FCP.GOOD) {
    recommendations.push('Improve First Contentful Paint by eliminating render-blocking resources and optimizing critical CSS');
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_THRESHOLDS.TTFB.GOOD) {
    recommendations.push('Reduce Time to First Byte by optimizing server response times and using a CDN');
  }

  return recommendations;
}

export default usePerformanceOptimization;