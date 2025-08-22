/**
 * Performance Optimization Utilities
 * Phase 2 Performance Enhancement: Centralized exports for all performance optimizations
 */

// Import values and types for local usage and re-export
import {
  ProgressiveImageLoader,
  EnhancedImagePreloader,
  FormatSupportCache,
  ConnectionAwareLoader,
} from './optimized-image-loader';
import type {
  ImageLoadingOptions,
  FormatSupport,
  ProgressiveImageState,
} from './optimized-image-loader';

import {
  DynamicComponentLoader,
  CriticalResourceManager,
  IntelligentPrefetcher,
  ChunkOptimizer,
} from './bundle-optimizer';
import type {
  ComponentLoadingOptions,
  ChunkLoadingState,
  CriticalResource,
} from './bundle-optimizer';

import {
  OptimizedResponsiveCalculator,
  FormValidationOptimizer,
  ResponsiveMemoCache,
  DebouncedEventHandler,
} from './responsive-optimizer';
import type {
  OptimizedResponsiveState,
  ResponsiveObserverOptions,
  ViewportMetrics,
  PerformanceMetrics,
} from './responsive-optimizer';

// Re-exports for consumers
export {
  ProgressiveImageLoader,
  EnhancedImagePreloader,
  FormatSupportCache,
  ConnectionAwareLoader,
};
export type { ImageLoadingOptions, FormatSupport, ProgressiveImageState };

export {
  DynamicComponentLoader,
  CriticalResourceManager,
  IntelligentPrefetcher,
  ChunkOptimizer,
};
export type { ComponentLoadingOptions, ChunkLoadingState, CriticalResource };

export {
  OptimizedResponsiveCalculator,
  FormValidationOptimizer,
  ResponsiveMemoCache,
  DebouncedEventHandler,
};
export type {
  OptimizedResponsiveState,
  ResponsiveObserverOptions,
  ViewportMetrics,
  PerformanceMetrics,
};

// Convenience factory functions
export const createOptimizedImageLoader = () => {
  return {
    progressive: ProgressiveImageLoader,
    preloader: EnhancedImagePreloader,
    formatCache: FormatSupportCache.getInstance(),
    connectionAware: ConnectionAwareLoader.getInstance(),
  };
};

export const createOptimizedBundleLoader = () => {
  return {
    components: DynamicComponentLoader,
    resources: CriticalResourceManager,
    prefetcher: IntelligentPrefetcher,
    chunks: ChunkOptimizer,
  };
};

export const createOptimizedResponsiveManager = (options?: ResponsiveObserverOptions) => {
  return {
    calculator: OptimizedResponsiveCalculator.getInstance(options),
    formValidator: FormValidationOptimizer.getInstance(),
    cache: ResponsiveMemoCache.getInstance(),
    eventHandler: new DebouncedEventHandler(),
  };
};

// Performance monitoring utilities
export const getPerformanceMetrics = () => {
  const calculator = OptimizedResponsiveCalculator.getInstance();
  const formatCache = FormatSupportCache.getInstance();

  return {
    responsive: calculator.getPerformanceMetrics(),
    imageCache: (formatCache as any).getStats ? (formatCache as any).getStats() : null,
    timestamp: Date.now(),
  };
};

// Cleanup utilities
export const cleanupPerformanceOptimizations = () => {
  ProgressiveImageLoader.cleanup();
  DynamicComponentLoader.clearCache();
  OptimizedResponsiveCalculator.getInstance().reset();
  FormValidationOptimizer.getInstance().clearCache();
};

// Export all performance utilities
export * from './optimized-image-loader';
export * from './bundle-optimizer';
export * from './responsive-optimizer';
export * from './critical-css';
export * from './animation-system';
export * from './code-splitting';

// Export performance components
export { PerformanceMonitor } from '../../components/performance/PerformanceMonitor';
export { LazyImage, useImagePreloader } from '../../components/performance/LazyImage';

// Export performance hooks
export { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// Default export with all utilities
export default {
  // Image optimization
  image: createOptimizedImageLoader(),

  // Bundle optimization
  bundle: createOptimizedBundleLoader(),

  // Responsive optimization
  responsive: createOptimizedResponsiveManager(),

  // Utilities
  getMetrics: getPerformanceMetrics,
  cleanup: cleanupPerformanceOptimizations,
};
