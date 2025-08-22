import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import React, { useEffect } from "react";
import { applyResponsiveTouchTargets, applyInteractionStates } from "../../utils/unified-accessibility";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-sm hover:shadow-md",
        danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm hover:shadow-md",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 active:scale-[0.98] shadow-sm hover:shadow-md",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-xl",
        AI: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 active:scale-[0.98] shadow-lg hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        neural: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white hover:from-purple-700 hover:via-pink-700 hover:to-red-600 active:scale-[0.98] shadow-lg hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        quantum: "bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white hover:from-indigo-700 hover:via-cyan-700 hover:to-teal-600 active:scale-[0.98] shadow-lg hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        glow: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-blue-500/25",
        neon: "bg-black border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/50 active:scale-[0.98]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-[0.98] shadow-lg",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
        xxl: "h-14 px-10 text-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // Enhanced AI-powered features
  aiPowered?: boolean;
  neuralNetwork?: boolean;
  quantumComputing?: boolean;
  glowEffect?: boolean;
  pulseAnimation?: boolean;
  // Accessibility enhancements
  ariaLabel?: string;
  tooltipText?: string;
  // Animation controls
  disableAnimations?: boolean;
  // Astro compatibility
  'data-astro-cid'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText = "Loading...",
      leftIcon,
      rightIcon,
      aiPowered,
      neuralNetwork,
      quantumComputing,
      glowEffect,
      pulseAnimation,
      ariaLabel,
      tooltipText,
      disableAnimations,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    // Auto-select AI variants based on props
    const finalVariant = aiPowered ? "AI" : neuralNetwork ? "neural" : quantumComputing ? "quantum" : variant;
    
    // Build dynamic classes for effects
    const effectClasses = [
      glowEffect && "hover:shadow-2xl hover:shadow-current/25",
      pulseAnimation && !disableAnimations && "animate-pulse",
      disableAnimations && "transition-none",
    ].filter(Boolean).join(" ");
    
    useEffect(() => {
      // Apply responsive touch targets and interaction states
      if (ref && typeof ref === 'object' && ref.current) {
        applyResponsiveTouchTargets(ref.current);
        applyInteractionStates(ref.current);
      }
    }, [ref]);

    return (
      <Comp
        className={`${buttonVariants({ variant: finalVariant, size })} ${effectClasses} ${className || ""}`}
        ref={ref}
        disabled={disabled || loading}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        title={tooltipText}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2 relative z-10">{leftIcon}</span>}
        <span className="relative z-10">{loading ? loadingText : children}</span>
        {!loading && rightIcon && <span className="ml-2 relative z-10">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// Export button variant utilities for external use
export const getButtonVariant = (props: Pick<ButtonProps, 'aiPowered' | 'neuralNetwork' | 'quantumComputing' | 'variant'>) => {
  return props.aiPowered ? "AI" : props.neuralNetwork ? "neural" : props.quantumComputing ? "quantum" : props.variant || "primary";
};

export { Button, buttonVariants };
