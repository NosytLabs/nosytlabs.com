import { cva } from "class-variance-authority";
import React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        outline: "text-foreground border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
        // AI-themed variants
        ai: "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
        neural: "border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600",
        quantum: "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
        // Modern variants
        neon: "border-transparent bg-black text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]",
        glass: "border-white/20 bg-white/10 text-foreground backdrop-blur-sm hover:bg-white/20",
        gradient: "border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600",
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Explicitly type variant props to avoid string | undefined issues
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" | "ghost" | "ai" | "neural" | "quantum" | "neon" | "glass" | "gradient";
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  rounded?: "none" | "sm" | "default" | "lg" | "xl";
  // Content props
  children?: React.ReactNode;
  // Visual enhancements
  dot?: boolean;
  pulse?: boolean;
  glow?: boolean;
  // Interaction
  clickable?: boolean;
  onRemove?: () => void;
  // Animation controls
  disableAnimations?: boolean;
  // Accessibility
  ariaLabel?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      children,
      dot,
      pulse,
      glow,
      clickable,
      onRemove,
      disableAnimations,
      ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    // Build dynamic classes
    const dynamicClasses = [
      pulse && !disableAnimations && "animate-pulse",
      glow && "shadow-lg",
      clickable && "cursor-pointer hover:scale-105 active:scale-95",
      disableAnimations && "transition-none",
    ].filter(Boolean).join(" ");

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (clickable && onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref}
        className={`${badgeVariants({ variant, size, rounded })} ${dynamicClasses} ${className || ""}`}
        onClick={handleClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
        {...props}
      >
        {dot && (
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove badge"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };