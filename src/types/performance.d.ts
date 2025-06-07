/**
 * Performance-related type definitions
 */

// Enhanced PerformanceEntry types
export interface PerformanceNavigationTimingExtended extends PerformanceNavigationTiming {
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  loadEventStart: number;
  loadEventEnd: number;
}

// Resource hint types
export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  crossorigin?: boolean | string;
  as?: string;
  type?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  dns: number;
  tcp: number;
  ttfb: number;
  download: number;
  dom: number;
  load: number;
}

// Core Web Vitals
export interface CoreWebVitals {
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
}

// Performance targets
export interface PerformanceTargets {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
}

// Performance observer entry types
export interface LCPEntry extends PerformanceEntry {
  startTime: number;
  size: number;
  element?: Element;
}

export interface FIDEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
}

export interface CLSEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Image optimization types
export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  lazy?: boolean;
  placeholder?: boolean;
}

// Bundle analysis types
export interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  type: 'js' | 'css' | 'asset';
}

// Performance monitoring configuration
export interface PerformanceConfig {
  enableCoreWebVitals: boolean;
  enableResourceTiming: boolean;
  enableUserTiming: boolean;
  reportingEndpoint?: string;
  sampleRate?: number;
}
