import { useEffect, useRef, useState } from 'react';
import performanceMonitor, { type PerformanceConfig } from '../services/performance-monitoring';

interface UsePerformanceMonitoringOptions extends PerformanceConfig {
  enabled?: boolean;
  autoInit?: boolean;
}

interface PerformanceStats {
  lcp?: { value: number; rating: string; timestamp: number };
  fid?: { value: number; rating: string; timestamp: number };
  cls?: { value: number; rating: string; timestamp: number };
  fcp?: { value: number; rating: string; timestamp: number };
  ttfb?: { value: number; rating: string; timestamp: number };
}

export function usePerformanceMonitoring(options: UsePerformanceMonitoringOptions = {}) {
  const {
    enabled = true,
    autoInit = true,
    ...config
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState<PerformanceStats>({});
  const configRef = useRef(config);

  // Update config ref when options change
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize performance monitoring
  useEffect(() => {
    if (!enabled || !autoInit || isInitialized) {
      return;
    }

    // Configure the performance monitor
    if (Object.keys(configRef.current).length > 0) {
      // Create new instance with custom config if needed
      // For now, we'll use the singleton with default config
    }

    performanceMonitor.init();
    setIsInitialized(true);

    // Update stats periodically
    const updateStats = () => {
      const summary = performanceMonitor.getPerformanceSummary();
      setStats(summary);
    };

    // Initial stats update
    updateStats();

    // Set up periodic updates
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [enabled, autoInit, isInitialized]);

  // Manual initialization function
  const initialize = () => {
    if (!isInitialized) {
      performanceMonitor.init();
      setIsInitialized(true);
    }
  };

  // Track custom metrics
  const trackCustomMetric = (name: string, value: number, additionalData?: Record<string, any>) => {
    if (isInitialized) {
      performanceMonitor.trackCustomMetric(name, value, additionalData);
    }
  };

  // Get stored metrics
  const getStoredMetrics = () => {
    return performanceMonitor.getStoredMetrics();
  };

  // Clear stored metrics
  const clearStoredMetrics = () => {
    performanceMonitor.clearStoredMetrics();
  };

  // Get performance summary
  const getPerformanceSummary = () => {
    return performanceMonitor.getPerformanceSummary();
  };

  return {
    isInitialized,
    stats,
    initialize,
    trackCustomMetric,
    getStoredMetrics,
    clearStoredMetrics,
    getPerformanceSummary
  };
}

// Hook for tracking specific performance events
export function usePerformanceTracker() {
  const trackPageLoad = (pageName: string, loadTime: number) => {
    performanceMonitor.trackCustomMetric('page-load', loadTime, {
      pageName,
      timestamp: Date.now()
    });
  };

  const trackUserInteraction = (action: string, duration: number) => {
    performanceMonitor.trackCustomMetric('user-interaction', duration, {
      action,
      timestamp: Date.now()
    });
  };

  const trackAPICall = (endpoint: string, duration: number, status: number) => {
    performanceMonitor.trackCustomMetric('api-call', duration, {
      endpoint,
      status,
      timestamp: Date.now()
    });
  };

  const trackResourceLoad = (resourceType: string, duration: number, size?: number) => {
    performanceMonitor.trackCustomMetric('resource-load', duration, {
      resourceType,
      size,
      timestamp: Date.now()
    });
  };

  return {
    trackPageLoad,
    trackUserInteraction,
    trackAPICall,
    trackResourceLoad
  };
}

// Hook for performance alerts
export function usePerformanceAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async (timeRange: string = '1h') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/performance-metrics/alerts?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch performance alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Refresh alerts every 5 minutes
    const interval = setInterval(() => fetchAlerts(), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    loading,
    fetchAlerts
  };
}