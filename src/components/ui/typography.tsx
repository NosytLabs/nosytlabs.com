import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const typographyVariants = cva("transition-colors duration-200", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl",
      h2: "scroll-m-20 border-b border-border/50 pb-2 text-3xl font-semibold tracking-tight first:mt-0 lg:text-4xl",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight lg:text-xl",
      h6: "scroll-m-20 text-base font-semibold tracking-tight lg:text-lg",
      body: "leading-7 [&:not(:first-child)]:mt-6",
      bodyLarge: "text-lg leading-8 [&:not(:first-child)]:mt-6",
      bodySmall: "text-sm leading-6 [&:not(:first-child)]:mt-4",
      caption: "text-sm text-muted-foreground leading-5",
      label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold border border-border/50",
      lead: "text-xl text-muted-foreground leading-8 lg:text-2xl",
      muted: "text-sm text-muted-foreground leading-5",
      quote: "mt-6 border-l-2 border-border pl-6 italic text-muted-foreground",
      display: "text-5xl font-black tracking-tight lg:text-6xl xl:text-7xl",
      subtitle: "text-lg font-medium text-muted-foreground leading-7",
      overline: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "body",
    align: "left",
    weight: "normal",
    color: "default",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof typographyVariants>, 'color'> {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  // Explicitly type color to avoid string | undefined issues
  color?: "default" | "muted" | "primary" | "secondary" | "accent" | "destructive" | "success" | "warning" | "info";
  // Accessibility enhancements
  ariaLevel?: number;
  // Animation controls
  disableAnimations?: boolean;
  // Gradient text effect
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className, 
    variant, 
    align, 
    weight, 
    color,
    as, 
    ariaLevel,
    disableAnimations,
    gradient,
    gradientFrom = "from-primary",
    gradientTo = "to-secondary",
    children, 
    ...props 
  }, ref) => {
    // Determine the HTML element to render
    const Component = as || getDefaultElement(variant);

    // Build dynamic classes
    const animationClasses = [
      disableAnimations && "transition-none",
      gradient && `bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`,
    ].filter(Boolean).join(" ");

    // Add aria-level for headings if not specified
    const headingLevel = ariaLevel || getHeadingLevel(variant);
    const accessibilityProps = headingLevel ? { 'aria-level': headingLevel } : {};

    const combinedClassName = `${typographyVariants({ variant, align, weight, color })} ${animationClasses} ${className || ""}`;

    return React.createElement(
      Component,
      {
        ref,
        className: combinedClassName,
        ...accessibilityProps,
        ...props,
      },
      children
    );
  }
);

// Helper function to get default HTML element based on variant
function getDefaultElement(variant?: string | null): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "code":
      return "code";
    case "quote":
      return "blockquote";
    case "display":
      return "h1";
    case "overline":
      return "span";
    case "lead":
    case "body":
    case "bodyLarge":
    case "bodySmall":
    case "subtitle":
    case "muted":
      return "p";
    case "caption":
    case "label":
      return "span";
    default:
      return "p";
  }
}

// Helper function to get heading level for accessibility
function getHeadingLevel(variant?: string | null): number | undefined {
  switch (variant) {
    case "h1":
    case "display":
      return 1;
    case "h2":
      return 2;
    case "h3":
      return 3;
    case "h4":
      return 4;
    case "h5":
      return 5;
    case "h6":
      return 6;
    default:
      return undefined;
  }
}

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
