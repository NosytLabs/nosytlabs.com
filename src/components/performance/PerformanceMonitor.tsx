/**
 * Performance Monitor Component
 * Displays real-time Core Web Vitals metrics and optimization status
 */

import React, { useEffect, useState } from 'react';
import { Activity, Zap, Eye, Clock, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  autoHide?: boolean;
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = false,
  position = 'bottom-right',
  autoHide = true,
  className = '',
}) => {
  const [performanceState, optimizations] = usePerformanceOptimization();
  const [isVisible, setIsVisible] = useState(!autoHide);
  const [isExpanded, setIsExpanded] = useState(showDetails);

  // Auto-hide in production unless explicitly shown
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && autoHide) {
      setIsVisible(false);
    }
  }, [autoHide]);

  // Initialize optimizations on mount
  useEffect(() => {
    optimizations.preloadCriticalResources();
    optimizations.optimizeImages();
    optimizations.enableServiceWorker();
    
    // Measure performance after a delay
    const timer = setTimeout(() => {
      optimizations.measurePerformance();
    }, 2000);

    return () => clearTimeout(timer);
  }, [optimizations]);

  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricStatus = (value: number | undefined, thresholds: { good: number; needsImprovement: number }) => {
    if (value === undefined) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 },
  };

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} ${className}`}
      style={{ fontFamily: 'monospace' }}
    >
      <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-lg border border-gray-700">
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Gauge className={`w-5 h-5 ${getScoreColor(performanceState.score)}`} />
            <span className="text-sm font-medium">
              Performance: {performanceState.score}/100
            </span>
          </div>
          <div className="flex items-center gap-1">
            {performanceState.isLoading && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
            <span className="text-xs text-gray-400">
              {isExpanded ? '−' : '+'}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-700">
            {/* Core Web Vitals */}
            <div className="p-3 space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Core Web Vitals
              </h4>
              
              {/* LCP */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(getMetricStatus(performanceState.metrics.lcp, thresholds.lcp))}
                  <span>LCP</span>
                </div>
                <span className={getScoreColor(performanceState.metrics.lcp ? (performanceState.metrics.lcp <= 2500 ? 100 : 50) : 0)}>
                  {performanceState.metrics.lcp ? `${(performanceState.metrics.lcp / 1000).toFixed(2)}s` : '—'}
                </span>
              </div>

              {/* FID */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(getMetricStatus(performanceState.metrics.fid, thresholds.fid))}
                  <span>FID</span>
                </div>
                <span className={getScoreColor(performanceState.metrics.fid ? (performanceState.metrics.fid <= 100 ? 100 : 50) : 0)}>
                  {performanceState.metrics.fid ? `${performanceState.metrics.fid.toFixed(0)}ms` : '—'}
                </span>
              </div>

              {/* CLS */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(getMetricStatus(performanceState.metrics.cls, thresholds.cls))}
                  <span>CLS</span>
                </div>
                <span className={getScoreColor(performanceState.metrics.cls ? (performanceState.metrics.cls <= 0.1 ? 100 : 50) : 0)}>
                  {performanceState.metrics.cls ? performanceState.metrics.cls.toFixed(3) : '—'}
                </span>
              </div>

              {/* FCP */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(getMetricStatus(performanceState.metrics.fcp, thresholds.fcp))}
                  <span>FCP</span>
                </div>
                <span className={getScoreColor(performanceState.metrics.fcp ? (performanceState.metrics.fcp <= 1800 ? 100 : 50) : 0)}>
                  {performanceState.metrics.fcp ? `${(performanceState.metrics.fcp / 1000).toFixed(2)}s` : '—'}
                </span>
              </div>

              {/* TTFB */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(getMetricStatus(performanceState.metrics.ttfb, thresholds.ttfb))}
                  <span>TTFB</span>
                </div>
                <span className={getScoreColor(performanceState.metrics.ttfb ? (performanceState.metrics.ttfb <= 800 ? 100 : 50) : 0)}>
                  {performanceState.metrics.ttfb ? `${performanceState.metrics.ttfb.toFixed(0)}ms` : '—'}
                </span>
              </div>
            </div>

            {/* Violations */}
            {performanceState.violations.length > 0 && (
              <div className="border-t border-gray-700 p-3">
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">
                  Issues ({performanceState.violations.length})
                </h4>
                <div className="space-y-1">
                  {performanceState.violations.slice(0, 3).map((violation, index) => (
                    <div key={index} className="text-xs text-red-300 flex items-start gap-1">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{violation}</span>
                    </div>
                  ))}
                  {performanceState.violations.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{performanceState.violations.length - 3} more issues
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {performanceState.recommendations.length > 0 && (
              <div className="border-t border-gray-700 p-3">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  Recommendations
                </h4>
                <div className="space-y-1">
                  {performanceState.recommendations.slice(0, 2).map((recommendation, index) => (
                    <div key={index} className="text-xs text-blue-300 flex items-start gap-1">
                      <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-700 p-3">
              <div className="flex gap-2">
                <button
                  onClick={() => optimizations.measurePerformance()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-2 rounded transition-colors"
                >
                  <Activity className="w-3 h-3 inline mr-1" />
                  Measure
                </button>
                <button
                  onClick={() => {
                    const report = optimizations.generateReport();
                    console.log('Performance Report:', report);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1.5 px-2 rounded transition-colors"
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;