/**
 * Optimized Component Loader
 * Integrates with existing performance utilities for lazy loading in Astro + React
 */

import React, { useEffect, useState, useRef } from 'react';
import { DynamicComponentLoader } from '../../utils/performance/bundle-optimizer';
import { LoadingFallback, EnhancedSpinner, AdaptiveLoader, InlineLoader, FullPageLoader } from '../ui/loading-fallback';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OptimizedComponentProps {
  /** Component import function */
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  /** Unique component name for caching */
  componentName: string;
  /** Loading priority */
  priority?: 'high' | 'medium' | 'low';
  /** Preload on hover */
  preloadOnHover?: boolean;
  /** Preload delay in ms */
  preloadDelay?: number;
  /** Custom loading component */
  fallback?: React.ComponentType;
  /** Props to pass to the loaded component */
  componentProps?: Record<string, any>;
  /** Custom error boundary */
  onError?: (error: Error) => void;
  /** Loading variant */
  loadingVariant?: 'skeleton' | 'spinner' | 'adaptive' | 'inline' | 'fullpage';
  /** Skeleton variant for loading state */
  skeletonVariant?: 'card' | 'text' | 'avatar' | 'button' | 'hero' | 'grid' | 'table' | 'form';
  /** Enable intersection observer for lazy loading */
  enableIntersectionObserver?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Timeout for adaptive loading */
  timeout?: number;
  /** Retry attempts on error */
  retryAttempts?: number;
  /** Animation variant */
  animation?: 'pulse' | 'wave' | 'shimmer' | 'bounce';
  /** Enable shimmer effect */
  shimmer?: boolean;
  /** Custom className */
  className?: string;
  /** Loading callbacks */
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  /** Visibility threshold for intersection observer */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

/**
 * Optimized component loader with intelligent preloading and caching
 */
export const OptimizedComponent: React.FC<OptimizedComponentProps> = ({
  importFn,
  componentName,
  priority = 'medium',
  preloadOnHover = false,
  preloadDelay = 0,
  fallback,
  componentProps = {},
  onError,
  loadingVariant = 'adaptive',
  skeletonVariant = 'card',
  enableIntersectionObserver = true,
  loadingText = 'Loading component...',
  showProgress = false,
  timeout = 2000,
  retryAttempts = 3,
  animation = 'shimmer',
  shimmer = true,
  className,
  onLoadStart,
  onLoadComplete,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isVisible, setIsVisible] = useState(!enableIntersectionObserver);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableIntersectionObserver || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [enableIntersectionObserver, isVisible, threshold, rootMargin]);

  // Progress simulation for better UX
  useEffect(() => {
    if (isLoading && showProgress) {
      setProgress(0);
      setLoadStartTime(Date.now());
      
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const elapsed = Date.now() - loadStartTime;
          const expectedDuration = timeout;
          const calculatedProgress = Math.min((elapsed / expectedDuration) * 90, 90);
          return Math.max(prev, calculatedProgress);
        });
      }, 100);
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isLoading, showProgress, timeout, loadStartTime]);

  // Load component when visible
  useEffect(() => {
    if (!isVisible) return undefined;

    const loadComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(0);
        onLoadStart?.();
        
        const loadedComponent = await DynamicComponentLoader.loadComponent(
          importFn,
          componentName,
          {
            priority,
            preload: priority === 'high',
            timeout: timeout * 5, // Give more time for actual loading
            ...(onError && { onError })
          }
        );
        
        setComponent(() => loadedComponent);
        setProgress(100);
        onLoadComplete?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load component');
        setError(error);
        setProgress(0);
        onError?.(error);
        
        // Auto-retry logic
        if (retryCount < retryAttempts) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            loadComponent();
          }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
        }
      } finally {
        setIsLoading(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    };

    if (preloadDelay > 0) {
      const timer = setTimeout(loadComponent, preloadDelay);
      return () => clearTimeout(timer);
    } else {
      loadComponent();
      return undefined;
    }
  }, [isVisible, importFn, componentName, priority, preloadDelay, onError, retryCount, retryAttempts, timeout, onLoadStart, onLoadComplete]);

  // Preload on hover
  const handleMouseEnter = () => {
    if (preloadOnHover && !Component && !isLoading) {
      DynamicComponentLoader.preloadComponent(importFn, componentName);
    }
  };

  // Manual retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setIsLoading(true);
  };

  // Render placeholder when not visible
  if (!isVisible) {
    return (
      <div ref={containerRef} className={cn('min-h-[200px] flex items-center justify-center', className)}>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Component will load when visible</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={cn('p-6 border border-destructive/20 rounded-lg bg-destructive/5', className)}>
        <div className="flex items-center space-x-2 text-destructive mb-3">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Failed to load component</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {retryCount < retryAttempts && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </button>
            )}
            <span className="text-xs text-muted-foreground">
              Attempt {retryCount + 1} of {retryAttempts + 1}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Component: {componentName}
          </span>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading || !Component) {
    if (fallback) {
      const LoadingComponent = fallback;
      return (
        <div ref={containerRef} onMouseEnter={handleMouseEnter} className={className}>
          <LoadingComponent />
        </div>
      );
    }

    const renderLoadingState = () => {
      switch (loadingVariant) {
        case 'spinner':
          return (
            <div className="flex items-center justify-center p-8">
              <EnhancedSpinner size="lg" variant="primary" />
            </div>
          );
        
        case 'inline':
          return (
            <div className="p-4">
              <InlineLoader text={loadingText} size="md" variant="dots" />
            </div>
          );
        
        case 'fullpage':
          return (
            <FullPageLoader 
              title={loadingText}
              subtitle={`Loading ${componentName}`}
              progress={showProgress ? progress : undefined}
            />
          );
        
        case 'adaptive':
          return (
            <AdaptiveLoader 
              isLoading={isLoading} 
              timeout={timeout}
              fallback={() => (
                <div className="p-8 text-center space-y-4">
                  <EnhancedSpinner size="xl" variant="primary" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{loadingText}</p>
                    <p className="text-xs text-muted-foreground">Component: {componentName}</p>
                    {showProgress && (
                      <div className="w-48 mx-auto">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            >
              {null}
            </AdaptiveLoader>
          );
        
        case 'skeleton':
        default:
          return (
            <LoadingFallback 
              variant={skeletonVariant} 
              animation={animation}
              shimmer={shimmer}
              showProgress={showProgress}
              progress={progress}
            />
          );
      }
    };

    return (
      <div ref={containerRef} onMouseEnter={handleMouseEnter} className={className}>
        {renderLoadingState()}
      </div>
    );
  }

  // Render loaded component
  return (
    <div ref={containerRef} onMouseEnter={handleMouseEnter}>
      <Component {...componentProps} />
    </div>
  );
};

/**
 * Higher-order component for creating optimized lazy components
 */
export function createOptimizedComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  componentName: string,
  options: Partial<OptimizedComponentProps> = {}
) {
  return React.forwardRef<HTMLDivElement, T & Partial<OptimizedComponentProps>>(
    (props, ref) => {
      const { componentProps, ...loaderProps } = props;
      
      return (
        <div ref={ref}>
          <OptimizedComponent
            importFn={importFn}
            componentName={componentName}
            componentProps={componentProps || props}
            {...options}
            {...loaderProps}
          />
        </div>
      );
    }
  );
}

/**
 * Utility for creating route-based lazy components
 */
export function createRouteComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  routeName: string
) {
  return createOptimizedComponent(importFn, `route-${routeName}`, {
    priority: 'high',
    enableIntersectionObserver: false,
    skeletonVariant: 'card',
  });
}

/**
 * Utility for creating feature-based lazy components
 */
export function createFeatureComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  featureName: string
) {
  return createOptimizedComponent(importFn, `feature-${featureName}`, {
    priority: 'medium',
    preloadOnHover: true,
    enableIntersectionObserver: true,
    skeletonVariant: 'card',
  });
}

export default OptimizedComponent;