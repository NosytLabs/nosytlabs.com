import React from "react";
import { cn } from "@/lib/utils";

interface NosytButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'shiny' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  // Shimmer-specific props
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  // Animation props
  animated?: boolean;
}

/**
 * Consolidated NosytLabs Button Component
 * Replaces ShinyButton, ShimmerButton, and other similar button components
 * Provides all button variants used throughout the application
 */
export const NosytButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, NosytButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      href,
      className,
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      animated = false,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    const variantClasses = {
      primary: "nosyt-btn-primary",
      secondary: "nosyt-btn-secondary", 
      outline: "nosyt-btn-outline",
      shiny: "group relative overflow-hidden rounded-md bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:scale-95",
      shimmer: "group relative z-0 cursor-pointer overflow-hidden whitespace-nowrap border border-white/10 text-white dark:text-black"
    };

    const Component = href ? 'a' : 'button';
    const componentProps = href ? { href } : props;

    if (variant === 'shimmer') {
      return (
        <Component
          style={
            {
              "--spread": "90deg",
              "--shimmer-color": shimmerColor,
              "--radius": "100px",
              "--speed": shimmerDuration,
              "--cut": shimmerSize,
              "--bg": "rgba(0, 0, 0, 1)",
            } as React.CSSProperties
          }
          className={cn(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],            "[background:var(--bg)] [border-radius:var(--radius)]",
            "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
            className,
          )}          // @ts-ignore - Complex polymorphic component ref typing
          ref={href ? undefined : ref}
          {...componentProps}
        >
          {/* Shimmer container */}
          <div
            className={cn(
              "absolute inset-0 overflow-visible opacity-75",
              "[background-image:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]",
              "[background-size:calc(100%-var(--cut))_calc(100%-var(--cut))]",
              "[background-position:center_center]",
              "[background-repeat:no-repeat]",
              "[animation:shimmer_var(--speed)_infinite_linear]",
            )}
          />
          <span className="relative z-10">{children}</span>
        </Component>
      );
    }

    if (variant === 'shiny') {
      return (
        <Component          className={cn(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            className,
          )}
          // @ts-ignore - Complex polymorphic component ref typing
          ref={href ? undefined : ref}
          {...componentProps}
        >
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 -top-[2px] mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute -inset-px rounded-md bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-30" />
        </Component>
      );
    }

    return (      <Component
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          animated && "nosyt-hover-lift",
          className,
        )}
        // @ts-ignore - Complex polymorphic component ref typing
        ref={href ? undefined : ref}
        {...componentProps}
      >
        {children}
      </Component>
    );
  },
);

NosytButton.displayName = "NosytButton";

// Export individual variants for backward compatibility
export const ShinyButton = (props: Omit<NosytButtonProps, 'variant'>) => (
  <NosytButton variant="shiny" {...props} />
);

export const ShimmerButton = (props: Omit<NosytButtonProps, 'variant'>) => (
  <NosytButton variant="shimmer" {...props} />
);

export const PrimaryButton = (props: Omit<NosytButtonProps, 'variant'>) => (
  <NosytButton variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<NosytButtonProps, 'variant'>) => (
  <NosytButton variant="secondary" {...props} />
);

export const OutlineButton = (props: Omit<NosytButtonProps, 'variant'>) => (
  <NosytButton variant="outline" {...props} />
);
