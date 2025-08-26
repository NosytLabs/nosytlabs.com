/**
 * Loading Fallback Components
 * Provides consistent loading states across the application
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';
// Removed unused imports

interface LoadingFallbackProps {
  /** Loading variant */
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'hero' | 'grid' | 'table' | 'form';
  /** Custom className */
  className?: string | undefined;
  /** Number of items for grid variant */
  count?: number;
  /** Show loading text */
  showText?: boolean;
  /** Custom loading text */
  text?: string;
  /** Enable shimmer effect */
  shimmer?: boolean;
  /** Loading animation type */
  animation?: 'pulse' | 'wave' | 'shimmer' | 'bounce';
  /** Show progress indicator */
  showProgress?: boolean;
  /** Progress value (0-100) */
  progress?: number;
}

/**
 * Versatile loading fallback component
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  variant = 'card',
  className,
  count = 3,
  showText = false,
  text = 'Loading...',
  // shimmer = true, // Removed unused parameter
  animation = 'pulse',
  showProgress = false,
  progress = 0,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Animate progress
  useEffect(() => {
    if (showProgress && progress > currentProgress) {
      const timer = setTimeout(() => {
        setCurrentProgress(prev => Math.min(prev + 1, progress));
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [progress, currentProgress, showProgress]);

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const renderVariant = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-4 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        );

      case 'avatar':
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        );

      case 'button':
        return <Skeleton className="h-10 w-24 rounded-md" />;

      case 'card':
      default:
        return (
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        );
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'wave':
        return 'animate-wave';
      case 'shimmer':
        return 'animate-shimmer';
      case 'bounce':
        return 'animate-bounce-subtle';
      case 'pulse':
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className={cn(getAnimationClass(), className)}>
      {renderVariant()}
      {showText && (
        <div className="flex items-center justify-center mt-4 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <EnhancedSpinner size="sm" variant="primary" />
            <span className="text-sm text-muted-foreground">
              {text}{dots}
            </span>
          </div>
        </div>
      )}
      {showProgress && (
        <div className="mt-4 space-y-2 animate-slideInUp">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Loading...</span>
            <span>{currentProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${currentProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Specialized loading components
 */
export const HeroLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="hero" className={className} />
);

export const GridLoading: React.FC<{ className?: string; count?: number }> = ({ 
  className, 
  count = 6 
}) => (
  <LoadingFallback variant="grid" className={className} count={count} />
);

export const CardLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="card" className={className} />
);

export const TextLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="text" className={className} />
);

export const AvatarLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="avatar" className={className} />
);

export const ButtonLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="button" className={className} />
);

export const TableLoading: React.FC<{ className?: string; rows?: number }> = ({ 
  className, 
  rows = 5 
}) => (
  <LoadingFallback variant="table" className={className} count={rows} />
);

export const FormLoading: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingFallback variant="form" className={className} />
);

/**
 * Specialized loading states for different contexts
 */
export const InlineLoader: React.FC<{
  text?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'dots';
  className?: string;
}> = ({ text = 'Loading...', size = 'sm', variant = 'dots', className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <EnhancedSpinner size={size} variant={variant} />
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
);

export const FullPageLoader: React.FC<{
  title?: string;
  subtitle?: string;
  progress?: number;
}> = ({ title = 'Loading...', subtitle, progress }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center space-y-4 p-8">
      <EnhancedSpinner size="xl" variant="primary" />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {progress !== undefined && (
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

/**
 * Smart loading component that adapts based on loading time
 */
export const AdaptiveLoader: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ComponentType;
  timeout?: number;
}> = ({ isLoading, children, fallback: Fallback, timeout = 2000 }) => {
  const [showDetailedLoader, setShowDetailedLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowDetailedLoader(true);
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      setShowDetailedLoader(false);
    }
    return undefined;
  }, [isLoading, timeout]);

  if (!isLoading) return <>{children}</>;

  if (showDetailedLoader && Fallback) {
    return <Fallback />;
  }

  return <EnhancedSpinner size="md" variant="primary" />;
};

/**
 * Enhanced loading spinner component with multiple variants
 */
export const EnhancedSpinner: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent' | 'dots' | 'pulse' | 'bars';
  className?: string;
}> = ({ size = 'md', variant = 'primary', className }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            <div className={cn('rounded-full bg-primary animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
            <div className={cn('rounded-full bg-primary animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
            <div className={cn('rounded-full bg-primary animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn('rounded-full bg-primary animate-pulse', sizeClasses[size], className)} />
        );
      
      case 'bars':
        return (
          <div className={cn('flex space-x-1', className)}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className={cn('bg-primary animate-pulse', `w-1 h-${size === 'xs' ? '3' : size === 'sm' ? '4' : size === 'md' ? '6' : size === 'lg' ? '8' : '12'}`)} 
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        );
      
      case 'secondary':
        return (
          <div className={cn('animate-spin rounded-full border-2 border-secondary border-t-transparent', sizeClasses[size], className)} />
        );
      
      case 'accent':
        return (
          <div className={cn('animate-spin rounded-full border-2 border-accent border-t-transparent', sizeClasses[size], className)} />
        );
      
      case 'primary':
      default:
        return (
          <div className={cn('animate-spin rounded-full border-2 border-primary border-t-transparent', sizeClasses[size], className)} />
        );
    }
  };

  return renderSpinner();
};

/**
 * Legacy loading spinner component (maintained for backward compatibility)
 */
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  return <EnhancedSpinner size={size} variant="primary" {...(className && { className })} />;
};

export default LoadingFallback;