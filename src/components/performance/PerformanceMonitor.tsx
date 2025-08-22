/**
 * Performance Monitor Component
 * Real-time performance monitoring and optimization
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createAnimationSystem, type PerformanceMetrics as AnimationMetrics } from '../../utils/performance/animation-system';

interface PerformanceData {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Animation metrics
  animations: AnimationMetrics;
  
  // Resource metrics
  resources: {
    images: number;
    scripts: number;
    stylesheets: number;
    totalSize: number;
  };
  
  // Performance score
  score: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showDebugInfo?: boolean;
  onPerformanceUpdate?: (data: PerformanceData) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  showDebugInfo = false,
  onPerformanceUpdate,
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    animations: {
      animationsActive: 0,
      frameRate: 60,
      droppedFrames: 0,
      gpuAccelerated: 0,
      reducedMotion: false,
    },
    resources: {
      images: 0,
      scripts: 0,
      stylesheets: 0,
      totalSize: 0,
    },
    score: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  /**
   * Calculate performance score based on metrics
   */
  const calculatePerformanceScore = useCallback((data: Partial<PerformanceData>): number => {
    let score = 100;
    
    // LCP scoring (0-40 points)
    if (data.lcp !== null && data.lcp !== undefined) {
      if (data.lcp > 4000) score -= 40;
      else if (data.lcp > 2500) score -= 20;
      else if (data.lcp > 1200) score -= 10;
    }
    
    // FID scoring (0-25 points)
    if (data.fid !== null && data.fid !== undefined) {
      if (data.fid > 300) score -= 25;
      else if (data.fid > 100) score -= 15;
      else if (data.fid > 50) score -= 5;
    }
    
    // CLS scoring (0-25 points)
    if (data.cls !== null && data.cls !== undefined) {
      if (data.cls > 0.25) score -= 25;
      else if (data.cls > 0.1) score -= 15;
      else if (data.cls > 0.05) score -= 5;
    }
    
    // Animation performance (0-10 points)
    if (data.animations) {
      if (data.animations.frameRate < 30) score -= 10;
      else if (data.animations.frameRate < 50) score -= 5;
      
      if (data.animations.droppedFrames > 10) score -= 5;
    }
    
    return Math.max(0, Math.round(score));
  }, []);

  /**
   * Measure Core Web Vitals
   */
  const measureCoreWebVitals = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      setPerformanceData(prev => {
        const updated = { ...prev, lcp: lastEntry.startTime };
        updated.score = calculatePerformanceScore(updated);
        return updated;
      });
    });
    
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // FID Observer
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setPerformanceData(prev => {
          const updated = { ...prev, fid: entry.processingStart - entry.startTime };
          updated.score = calculatePerformanceScore(updated);
          return updated;
        });
      });
    });
    
    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID observation not supported');
    }

    // CLS Observer
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      setPerformanceData(prev => {
        const updated = { ...prev, cls: clsValue };
        updated.score = calculatePerformanceScore(updated);
        return updated;
      });
    });
    
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS observation not supported');
    }

    // Navigation timing for FCP and TTFB
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === 'navigation') {
          setPerformanceData(prev => {
            const updated = {
              ...prev,
              ttfb: entry.responseStart - entry.requestStart,
              fcp: entry.loadEventEnd - entry.navigationStart,
            };
            updated.score = calculatePerformanceScore(updated);
            return updated;
          });
        }
      });
    });
    
    try {
      navigationObserver.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      console.warn('Navigation timing not supported');
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, [calculatePerformanceScore]);

  /**
   * Measure resource metrics
   */
  const measureResourceMetrics = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const metrics = {
      images: 0,
      scripts: 0,
      stylesheets: 0,
      totalSize: 0,
    };
    
    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      metrics.totalSize += size;
      
      if (resource.initiatorType === 'img') {
        metrics.images++;
      } else if (resource.initiatorType === 'script') {
        metrics.scripts++;
      } else if (resource.initiatorType === 'link' && resource.name.includes('.css')) {
        metrics.stylesheets++;
      }
    });
    
    setPerformanceData(prev => ({
      ...prev,
      resources: metrics,
    }));
  }, []);

  /**
   * Update animation metrics
   */
  const updateAnimationMetrics = useCallback(() => {
    const animationSystem = createAnimationSystem();
    const metrics = animationSystem.getMetrics();
    
    setPerformanceData(prev => {
      const updated = { ...prev, animations: metrics };
      updated.score = calculatePerformanceScore(updated);
      return updated;
    });
  }, [calculatePerformanceScore]);

  /**
   * Initialize performance monitoring
   */
  useEffect(() => {
    if (!enabled) return;

    const cleanup = measureCoreWebVitals();
    measureResourceMetrics();
    
    // Update animation metrics periodically
    const animationInterval = setInterval(updateAnimationMetrics, 1000);
    
    // Update resource metrics periodically
    const resourceInterval = setInterval(measureResourceMetrics, 5000);

    return () => {
      cleanup?.();
      clearInterval(animationInterval);
      clearInterval(resourceInterval);
    };
  }, [enabled, measureCoreWebVitals, measureResourceMetrics, updateAnimationMetrics]);

  /**
   * Notify parent component of performance updates
   */
  useEffect(() => {
    if (onPerformanceUpdate) {
      onPerformanceUpdate(performanceData);
    }
  }, [performanceData, onPerformanceUpdate]);

  /**
   * Toggle debug info visibility
   */
  const toggleDebugInfo = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  /**
   * Get performance status color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Format metrics for display
   */
  const formatMetric = (value: number | null, unit: string = 'ms'): string => {
    if (value === null) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  if (!enabled) return null;

  return (
    <>
      {/* Performance Score Badge */}
      <div 
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onClick={toggleDebugInfo}
        title="Click to toggle performance details"
      >
        <div className={`
          px-3 py-2 rounded-full shadow-lg backdrop-blur-sm
          bg-white/90 border border-gray-200
          transition-all duration-300 hover:scale-105
          ${getScoreColor(performanceData.score)}
        `}>
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>Perf: {performanceData.score}</span>
          </div>
        </div>
      </div>

      {/* Debug Info Panel */}
      {showDebugInfo && isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-80">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
              <button
                onClick={toggleDebugInfo}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close performance monitor"
              >
                ×
              </button>
            </div>
            
            {/* Performance Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Score</span>
                <span className={`text-lg font-bold ${getScoreColor(performanceData.score)}`}>
                  {performanceData.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    performanceData.score >= 90 ? 'bg-green-500' :
                    performanceData.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${performanceData.score}%` }}
                />
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">LCP:</span>
                  <span className={performanceData.lcp && performanceData.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                    {formatMetric(performanceData.lcp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FID:</span>
                  <span className={performanceData.fid && performanceData.fid > 100 ? 'text-red-600' : 'text-green-600'}>
                    {formatMetric(performanceData.fid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CLS:</span>
                  <span className={performanceData.cls && performanceData.cls > 0.1 ? 'text-red-600' : 'text-green-600'}>
                    {formatMetric(performanceData.cls, '')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TTFB:</span>
                  <span className={performanceData.ttfb && performanceData.ttfb > 600 ? 'text-red-600' : 'text-green-600'}>
                    {formatMetric(performanceData.ttfb)}
                  </span>
                </div>
              </div>
            </div>

            {/* Animation Metrics */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Animations</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span>{performanceData.animations.animationsActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FPS:</span>
                  <span className={performanceData.animations.frameRate < 50 ? 'text-red-600' : 'text-green-600'}>
                    {Math.round(performanceData.animations.frameRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPU:</span>
                  <span>{performanceData.animations.gpuAccelerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dropped:</span>
                  <span className={performanceData.animations.droppedFrames > 5 ? 'text-red-600' : 'text-green-600'}>
                    {performanceData.animations.droppedFrames}
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span>{performanceData.resources.images}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scripts:</span>
                  <span>{performanceData.resources.scripts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CSS:</span>
                  <span>{performanceData.resources.stylesheets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span>{Math.round(performanceData.resources.totalSize / 1024)}KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;