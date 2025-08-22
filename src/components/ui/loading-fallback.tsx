import { cva } from "class-variance-authority";
import React from "react";

const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "animate-spin",
        dots: "space-x-1",
        pulse: "animate-pulse",
        skeleton: "animate-pulse bg-muted rounded",
        wave: "overflow-hidden",
        bars: "space-x-1",
        neural: "relative",
        quantum: "relative animate-pulse",
      },
      size: {
        xs: "h-4 w-4",
        sm: "h-6 w-6",
        default: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        full: "h-full w-full",
      },
      color: {
        default: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        ai: "text-blue-500",
        neural: "text-cyan-500",
        quantum: "text-purple-500",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "default",
      color: "default",
    },
  }
);

export interface LoadingFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Content
  text?: string;
  description?: string;
  // Variant props
  variant?: "spinner" | "dots" | "pulse" | "skeleton" | "wave" | "bars" | "neural" | "quantum";
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "full";
  // Explicitly type color to avoid string | undefined issues
  color?: "default" | "primary" | "secondary" | "accent" | "ai" | "neural" | "quantum";
  // Behavior
  fullScreen?: boolean;
  overlay?: boolean;
  // Animation controls
  disableAnimations?: boolean;
  // Accessibility
  ariaLabel?: string;
}

const LoadingFallback = React.forwardRef<HTMLDivElement, LoadingFallbackProps>(
  (
    {
      className,
      variant,
      size,
      color,
      text,
      description,
      fullScreen,
      overlay,
      disableAnimations,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const containerClasses = [
      fullScreen && "fixed inset-0 z-50",
      overlay && "bg-background/80 backdrop-blur-sm",
      !fullScreen && "p-4",
      disableAnimations && "[&_*]:!animate-none",
    ].filter(Boolean).join(" ");

    const renderLoadingIcon = () => {
      switch (variant) {
        case "spinner":
          return (
            <svg
              className={loadingVariants({ variant, size, color })}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );

        case "dots":
          return (
            <div className={`flex ${loadingVariants({ variant, size: "default", color: "default" })}`}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full bg-current animate-bounce ${color === "default" ? "text-muted-foreground" : `text-${color}`}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          );

        case "pulse":
          return (
            <div className={`rounded-full bg-current ${loadingVariants({ variant, size, color })}`} />
          );

        case "skeleton":
          return (
            <div className={loadingVariants({ variant, size, color: "default" })} />
          );

        case "wave":
          return (
            <div className={`relative ${loadingVariants({ variant, size: "default", color: "default" })}`}>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-1 bg-current animate-pulse ${color === "default" ? "text-muted-foreground" : `text-${color}`}`}
                    style={{
                      height: `${20 + Math.sin(i * 0.5) * 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          );

        case "bars":
          return (
            <div className={`flex ${loadingVariants({ variant, size: "default", color: "default" })}`}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-6 bg-current animate-pulse ${color === "default" ? "text-muted-foreground" : `text-${color}`}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          );

        case "neural":
          return (
            <div className={`relative ${loadingVariants({ variant, size, color })}`}>
              <div className="absolute inset-0 rounded-full border-2 border-current opacity-25" />
              <div className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border border-current opacity-50" />
              <div className="absolute inset-4 rounded-full bg-current opacity-75 animate-pulse" />
            </div>
          );

        case "quantum":
          return (
            <div className={`relative ${loadingVariants({ variant, size, color })}`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-75" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-25" />
            </div>
          );

        default:
          return (
            <svg
              className={loadingVariants({ variant: "spinner", size, color })}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center space-y-2 ${containerClasses} ${className || ""}`}
        role="status"
        aria-label={ariaLabel || "Loading"}
        {...props}
      >
        {renderLoadingIcon()}
        
        {text && (
          <p className="text-sm font-medium text-foreground animate-pulse">
            {text}
          </p>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {description}
          </p>
        )}
        
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

LoadingFallback.displayName = "LoadingFallback";

export { LoadingFallback, loadingVariants };