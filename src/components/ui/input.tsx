import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/utils";
import { applyResponsiveTouchTargets, applyInteractionStates } from "../../utils/unified-accessibility";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input hover:border-input/80 focus-visible:border-ring",
        error: "border-destructive bg-destructive/5 focus-visible:ring-destructive hover:border-destructive/80",
        success: "border-green-500 bg-green-50 dark:bg-green-950/20 focus-visible:ring-green-500 hover:border-green-600",
        warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 focus-visible:ring-yellow-500 hover:border-yellow-600",
        ghost: "border-transparent bg-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-input",
        filled: "border-transparent bg-muted hover:bg-muted/80 focus-visible:bg-background focus-visible:border-ring",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-5 text-lg",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // Explicitly type variant props to avoid string | undefined issues
  variant?: "default" | "error" | "success" | "warning" | "ghost" | "filled";
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  rounded?: "none" | "sm" | "default" | "lg" | "xl" | "full";
  // Label and helper text
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  // Visual indicators
  required?: boolean;
  showRequiredIndicator?: boolean;
  // Icons and addons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  // Loading state
  loading?: boolean;
  // Animation controls
  disableAnimations?: boolean;
  // Enhanced accessibility
  ariaDescribedBy?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      size,
      rounded,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      required,
      showRequiredIndicator = true,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      loading,
      disableAnimations,
      ariaDescribedBy,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;

    // Determine variant based on validation state
    const effectiveVariant = errorMessage
      ? "error"
      : successMessage
      ? "success"
      : warningMessage
      ? "warning"
      : variant;

    // Build aria-describedby IDs
    const describedByIds = [
      helperText && helperTextId,
      errorMessage && errorId,
      successMessage && successId,
      warningMessage && warningId,
      ariaDescribedBy
    ].filter(Boolean).join(' ');

    const helperId = helperTextId;

    // Apply accessibility enhancements
    React.useEffect(() => {
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        applyResponsiveTouchTargets(inputElement);
        applyInteractionStates(inputElement);
      }
    }, [inputId]);

    // Note: hasAddons and hasIcons variables removed as they were unused

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              errorMessage ? 'text-critical' : 'text-text-muted'
            )}
          >
            {label}
            {required && showRequiredIndicator && (
              <span
                className="ml-1 text-critical"
                aria-label="required"
                title="This field is required"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={type}
            id={inputId}
            required={required}
            aria-required={required ? 'true' : undefined}
            aria-invalid={!!errorMessage ? 'true' : 'false'}
            aria-describedby={describedByIds || undefined}
            className={cn(
              inputVariants({ variant: effectiveVariant, size, rounded }),
              errorMessage && 'pr-10', // Space for error icon
              successMessage && 'pr-10', // Space for success icon
              className
            )}
            {...props}
          />

          {/* Error Icon */}
          {errorMessage && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-critical"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Success Icon */}
          {successMessage && !errorMessage && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-success"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !errorMessage && !successMessage && (
          <p id={helperId} className="text-sm text-text-muted">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p
            id={errorId}
            className="text-sm text-critical flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </p>
        )}

        {/* Success Message */}
        {successMessage && !errorMessage && (
          <p
            id={successId}
            className="text-sm text-success flex items-center gap-1"
            role="status"
            aria-live="polite"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
