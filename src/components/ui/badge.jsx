import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 touch-target",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs min-h-[var(--space-8)]",
        md: "px-2.5 py-1 text-sm min-h-[var(--space-9)]",
        lg: "px-3 py-1.5 text-base min-h-[var(--space-11)]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Mobile-responsive badge styles
const mobileBadgeStyles = `
  /* Fluid typography for badges */
  .badge-sm { font-size: clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem); }
  .badge-md { font-size: clamp(0.75rem, 0.6rem + 0.4vw, 0.875rem); }
  .badge-lg { font-size: clamp(0.875rem, 0.7rem + 0.5vw, 1rem); }

  /* Touch-friendly interactions */
  .badge-touch-target {
    min-height: var(--space-11);
    min-width: var(--space-11);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }

  /* Container queries for component-level responsiveness */
  @container (max-width: 400px) {
    .badge-sm { font-size: 0.625rem; min-height: var(--space-8); }
    .badge-md { font-size: 0.75rem; min-height: var(--space-9); }
    .badge-lg { font-size: 0.875rem; min-height: var(--space-10); }
  }

  /* Mobile optimizations */
  @media (max-width: var(--breakpoint-md)) {
    .badge-sm { min-height: var(--space-9); padding: 0.25rem 0.5rem; }
    .badge-md { min-height: var(--space-10); padding: 0.375rem 0.75rem; }
    .badge-lg { min-height: var(--space-12); padding: 0.5rem 1rem; }

    /* Touch feedback */
    .badge-touch-target:active {
      transform: scale(0.95);
      transition: transform 0.1s ease;
    }
  }

  /* Extra small screens */
  @media (max-width: var(--breakpoint-xs)) {
    .badge-sm { font-size: 0.625rem; min-height: var(--space-8); }
    .badge-md { font-size: 0.75rem; min-height: var(--space-9); }
    .badge-lg { font-size: 0.875rem; min-height: var(--space-11); }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .badge-touch-target:hover {
      transform: none;
    }

    .badge-touch-target:active {
      background-color: var(--color-black-alpha-10);
      transform: scale(0.95);
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .badge-touch-target {
      transition: none;
    }

    .badge-touch-target:active {
      transform: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .badge-touch-target {
      border-width: var(--space-0-5); /* 2px -> 4px for grid alignment */
    }
  }
`;

function Badge({
  className,
  variant,
  size,
  ...props
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileBadgeStyles }} />
      <div className={cn(badgeVariants({ variant, size }), 'badge-touch-target', className)} {...props} />
    </>
  );
}

export { Badge, badgeVariants }
