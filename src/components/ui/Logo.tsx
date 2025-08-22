import React from 'react';
import { cn } from '../../lib/utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = 'md', variant = 'full', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12',
    };

    return (
      <div
        className={cn(
          'flex items-center font-bold text-primary',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {variant === 'full' ? (
          <span className="text-2xl">NosytLabs</span>
        ) : (
          <span className="text-2xl">N</span>
        )}
      </div>
    );
  }
);

Logo.displayName = 'Logo';