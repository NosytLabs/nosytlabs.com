import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 nosyt-focus nosyt-button-vibrant",
  {
    variants: {
      variant: {
        primary: "bg-brand-blue-500 text-white hover:bg-brand-blue-600 hover:shadow-[0_8px_25px_-5px_rgba(0,123,255,0.4)] nosyt-glow-blue",
        secondary: "bg-brand-orange-500 text-white hover:bg-brand-orange-600 hover:shadow-[0_8px_25px_-5px_rgba(253,126,20,0.4)] nosyt-glow-orange",
        outline: "border-2 border-brand-blue-500 bg-transparent text-brand-blue-500 hover:bg-brand-blue-500 hover:text-white hover:shadow-[0_8px_25px_-5px_rgba(0,123,255,0.3)] dark:border-brand-blue-400 dark:text-brand-blue-400 dark:hover:bg-brand-blue-400 dark:hover:text-white",
        ghost: "bg-transparent text-neutral-700 hover:bg-brand-blue-50 hover:text-brand-blue-600 dark:text-neutral-300 dark:hover:bg-brand-blue-900/20 dark:hover:text-brand-blue-400",
        link: "bg-transparent text-brand-blue-500 underline-offset-4 hover:underline hover:text-brand-blue-600",
        success: "bg-brand-green-500 text-white hover:bg-brand-green-600 hover:shadow-[0_8px_25px_-5px_rgba(107,142,35,0.4)]",
        danger: "bg-brand-red-500 text-white hover:bg-brand-red-600 hover:shadow-[0_8px_25px_-5px_rgba(220,53,69,0.4)]",
        gradient: "bg-gradient-to-r from-brand-blue-500 to-brand-ethereal-500 text-white hover:from-brand-blue-600 hover:to-brand-ethereal-600 hover:shadow-[0_8px_25px_-5px_rgba(0,123,255,0.4)]",
      },
      size: {
        default: "px-6 py-3 text-base min-h-[2.75rem]",
        sm: "px-4 py-2 text-sm min-h-[2.25rem]",
        lg: "px-8 py-4 text-lg min-h-[3.25rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
  
  // Shimmer-specific props for compatibility
  shimmerColor?: string
  shimmerSize?: string
  shimmerDuration?: string
  
  // Animation props from consolidated button
  animated?: boolean
  
  // Children prop for explicit typing
  children?: React.ReactNode
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ className, variant, size, asChild = false, href, animated = false, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? "a" : "button"
    
    // Extract button-only props when using as anchor
    const {
      disabled,
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
      name,
      type,
      value,
      ...restProps
    } = props as any
    
    const componentProps = href
      ? { href, ...restProps }
      : { disabled, form, formAction, formEncType, formMethod, formNoValidate, formTarget, name, type, value, ...restProps }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          animated && "nosyt-hover-lift"
        )}
        ref={href || asChild ? undefined : (ref as any)}
        {...(componentProps as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

// Legacy compatibility button components
export const NosytButton = Button;
export const NosytSecondaryButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="secondary" ref={ref} />
));
export const NosytOutlineButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="outline" ref={ref} />
));

export const ShinyButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="gradient" ref={ref} />
));
export const ShimmerButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="gradient" ref={ref} />
));

export const PrimaryButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="primary" ref={ref} />
));
export const SecondaryButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="secondary" ref={ref} />
));
export const OutlineButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <Button {...props} variant="outline" ref={ref} />
));

// Set display names for debugging
NosytButton.displayName = "NosytButton";
NosytSecondaryButton.displayName = "NosytSecondaryButton";
NosytOutlineButton.displayName = "NosytOutlineButton";
ShinyButton.displayName = "ShinyButton";
ShimmerButton.displayName = "ShimmerButton";
PrimaryButton.displayName = "PrimaryButton";
SecondaryButton.displayName = "SecondaryButton";
OutlineButton.displayName = "OutlineButton";