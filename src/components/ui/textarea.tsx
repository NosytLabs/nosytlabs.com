import { cva } from "class-variance-authority";
import React from "react";
import { applyResponsiveTouchTargets, applyInteractionStates } from "../../utils/unified-accessibility";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-background text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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
        xs: "min-h-[60px] px-2 py-1 text-xs",
        sm: "min-h-[70px] px-2 py-2 text-xs",
        default: "min-h-[80px] px-3 py-2 text-sm",
        lg: "min-h-[120px] px-4 py-3 text-base",
        xl: "min-h-[160px] px-5 py-4 text-lg",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      resize: "vertical",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Explicitly type variant props to avoid string | undefined issues
  variant?: "default" | "error" | "success" | "warning";
  size?: "sm" | "default" | "lg";
  rounded?: "none" | "sm" | "default" | "lg" | "xl";
  resize?: "none" | "vertical" | "horizontal" | "both";
  // Label and helper text
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  // Visual indicators
  required?: boolean;
  showRequiredIndicator?: boolean;
  // Character count
  maxLength?: number;
  showCharacterCount?: boolean;
  // Auto-resize functionality
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  // Animation controls
  disableAnimations?: boolean;
  // Enhanced accessibility
  ariaDescribedBy?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      resize,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      required,
      showRequiredIndicator = true,
      showCharacterCount = false,
      maxLength,
      autoResize = false,
      minRows = 3,
      maxRows,
      disableAnimations,
      ariaDescribedBy,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const helperTextId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const successId = `${textareaId}-success`;
    const warningId = `${textareaId}-warning`;
    const countId = `${textareaId}-count`;
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [characterCount, setCharacterCount] = React.useState(0);

    // Determine variant based on validation state
    const finalVariant = errorMessage
      ? "error"
      : successMessage
      ? "success"
      : warningMessage
      ? "warning"
      : variant;

    // Build dynamic classes for animations
    const animationClasses = [
      disableAnimations && "transition-none",
    ].filter(Boolean).join(" ");

    // Auto-resize functionality
    const handleAutoResize = React.useCallback((element: HTMLTextAreaElement) => {
      if (!autoResize) return;
      
      element.style.height = 'auto';
      const scrollHeight = element.scrollHeight;
      const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 20;
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
      
      element.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }, [autoResize, minRows, maxRows]);

    // Apply accessibility enhancements
    React.useEffect(() => {
      const textareaElement = document.getElementById(textareaId) as HTMLTextAreaElement;
      if (textareaElement) {
        applyResponsiveTouchTargets(textareaElement);
        applyInteractionStates(textareaElement);
      }
    }, [textareaId]);

    // Handle character count and auto-resize
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      // Update character count
      if (showCharacterCount) {
        setCharacterCount(value.length);
      }
      
      // Handle auto-resize
      handleAutoResize(e.target);
      
      // Call original onChange
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Initialize character count and auto-resize
    React.useEffect(() => {
      const element = textareaRef.current;
      if (!element) return;
      
      if (showCharacterCount) {
        // Handle controlled components
        if (typeof props.value === 'string') {
          setCharacterCount(props.value.length);
        } else {
          // Handle uncontrolled components
          setCharacterCount(element.value.length);
        }
      }
      
      // Apply auto-resize on mount
      if (autoResize) {
        handleAutoResize(element);
      }
    }, [showCharacterCount, props.value, autoResize, handleAutoResize]);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
          >
            {label}
            {required && showRequiredIndicator && (
              <span className="text-destructive" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={node => {
              // Handle both callback and object refs
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }

              (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }}
            id={textareaId}
            required={required}
            disabled={props.disabled}
            // Don't use HTML maxLength when showCharacterCount is true to allow visual feedback
            maxLength={showCharacterCount ? undefined : maxLength}
            rows={autoResize ? minRows : props.rows}
            aria-describedby={
              [
                helperText && helperTextId,
                errorMessage && errorId,
                successMessage && successId,
                warningMessage && warningId,
                showCharacterCount && countId,
                ariaDescribedBy
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={`${textareaVariants({ 
              variant: finalVariant, 
              size, 
              rounded,
              resize: autoResize ? 'none' : resize 
            })} ${animationClasses} ${className || ""}`}
            onChange={handleChange}
            {...props}
          />
        </div>

        {/* Character Count */}
        {showCharacterCount && (
          <div
            id={countId}
            className={`text-sm text-right ${
              maxLength && characterCount >= maxLength
                ? 'text-destructive font-medium'
                : maxLength && characterCount >= maxLength * 0.9
                  ? 'text-yellow-600'
                  : 'text-muted-foreground'
            }`}
            aria-live="polite"
          >
            {characterCount}
            {maxLength && ` / ${maxLength}`}
            <span className="sr-only">
              {maxLength
                ? `${characterCount} of ${maxLength} characters used`
                : `${characterCount} characters entered`}
            </span>
          </div>
        )}

        {/* Helper Text */}
        {helperText && (
          <p id={helperTextId} className="text-sm text-muted-foreground flex items-center gap-1">
            {helperText}
          </p>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <p id={errorId} className="text-sm text-destructive flex items-center gap-1">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
        
        {/* Success Message */}
        {successMessage && (
          <p id={successId} className="text-sm text-green-600 flex items-center gap-1">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </p>
        )}
        
        {/* Warning Message */}
        {warningMessage && (
          <p id={warningId} className="text-sm text-yellow-600 flex items-center gap-1">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {warningMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
