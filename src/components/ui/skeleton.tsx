import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true
}) => {
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    animate && 'animate-pulse',
    {
      'rounded-full': variant === 'circular',
      'rounded-md': variant === 'rounded',
      'rounded-sm': variant === 'rectangular',
      'rounded': variant === 'text'
    },
    className
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              'h-4',
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={index === lines - 1 ? { ...style, width: '75%' } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={baseClasses}
      style={{
        ...style,
        ...(variant === 'text' && { height: height || '1rem' }),
        ...(variant === 'circular' && { aspectRatio: '1' })
      }}
    />
  );
};

// Predefined skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border rounded-lg space-y-4', className)}>
    <Skeleton variant="rectangular" height={200} className="w-full" />
    <div className="space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" lines={3} />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width={80} />
      <Skeleton variant="rounded" width={100} height={36} />
    </div>
  </div>
);

export const ServiceCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border rounded-lg space-y-4', className)}>
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={16} className="mt-1" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width={100} />
      <Skeleton variant="rounded" width={120} height={40} />
    </div>
  </div>
);

export const FormSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6', className)}>
    <div className="space-y-2">
      <Skeleton variant="text" width={100} height={16} />
      <Skeleton variant="rounded" height={40} className="w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width={80} height={16} />
      <Skeleton variant="rounded" height={40} className="w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width={120} height={16} />
      <Skeleton variant="rounded" height={120} className="w-full" />
    </div>
    <Skeleton variant="rounded" width={150} height={44} />
  </div>
);

export const NavigationSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-between p-4', className)}>
    <Skeleton variant="text" width={120} height={32} />
    <div className="flex items-center gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="text" width={80} height={20} />
      ))}
    </div>
    <Skeleton variant="rounded" width={100} height={36} />
  </div>
);

export default Skeleton;