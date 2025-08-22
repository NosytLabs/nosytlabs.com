import React from 'react';

export interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

/**
 * LoadingFallback component for displaying loading states
 *
 * Features:
 * - Customizable loading message
 * - Different size options
 * - Full page loading option
 * - Accessible loading indicator
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  size = 'md',
  className = '',
  fullPage = false,
}) => {
  // Size classes for the spinner
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  // Container classes based on fullPage prop
  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-background bg-opacity-80 z-50'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} rounded-full border-outline border-t-primary animate-spin`}
      ></div>
      {message && <p className="mt-2 text-sm text-on-surface">{message}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingFallback;
