import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-background px-3 py-2 text-sm',
    'transition-all duration-300 ease-out transform-gpu will-change-transform',
    'placeholder:text-muted-foreground placeholder:transition-colors placeholder:duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'hover:shadow-sm hover:-translate-y-0.5 focus:translate-y-0 focus:shadow-md',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border',
          'focus-visible:ring-primary focus-visible:border-primary',
          'hover:border-border-hover hover:bg-surface-secondary/30',
          'focus:border-primary focus:bg-background focus:shadow-primary/10',
        ],
        error: [
          'border-error bg-error/5',
          'focus-visible:ring-error focus-visible:border-error',
          'hover:border-error hover:bg-error/10 hover:shadow-error/20',
          'focus:shadow-error/20 animate-shake',
        ],
        success: [
          'border-success bg-success/5',
          'focus-visible:ring-success focus-visible:border-success',
          'hover:border-success hover:bg-success/10 hover:shadow-success/20',
          'focus:shadow-success/20',
        ],
        warning: [
          'border-warning bg-warning/5',
          'focus-visible:ring-warning focus-visible:border-warning',
          'hover:border-warning',
        ],
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  loading?: boolean;
  containerClassName?: string;
  animated?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  onValidate?: (value: string) => boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    type = 'text',
    label,
    error,
    success,
    warning,
    helperText,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    loading = false,
    containerClassName,
    animated = true,
    showCharacterCount = false,
    maxLength,
    onValidate,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [charCount, setCharCount] = useState(0);

    const [hasInteracted, setHasInteracted] = useState(false);

    // Determine the current variant based on validation states
    const currentVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
    
    // Determine the input type
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    // Handle validation and character counting
    useEffect(() => {
      const value = props.value?.toString() || '';
      setCharCount(value.length);
      
      if (onValidate && hasInteracted) {
        setIsValid(onValidate(value));
      }
    }, [props.value, onValidate, hasInteracted]);

    // Get the appropriate icon for validation states
    const getValidationIcon = () => {
      if (loading) {
        return (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        );
      }
      if (error) return <AlertCircle className="h-4 w-4 text-error animate-pulse" />;
      if (success || isValid) return <CheckCircle className="h-4 w-4 text-success animate-bounce" />;
      if (warning) return <AlertCircle className="h-4 w-4 text-warning animate-pulse" />;
      return null;
    };

    const validationIcon = getValidationIcon();

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-error' : success ? 'text-success' : warning ? 'text-warning' : 'text-text-primary',
            isFocused && !error && !success && !warning && 'text-primary'
          )}>
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: currentVariant, size }),
              leftIcon && 'pl-10',
              (rightIcon || validationIcon || showPasswordToggle) && 'pr-10',
              isFocused && 'ring-2 ring-offset-2',
              error && isFocused && 'ring-error',
              success && isFocused && 'ring-success',
              warning && isFocused && 'ring-warning',
              !error && !success && !warning && isFocused && 'ring-primary',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            onFocus={(e) => {
              setIsFocused(true);
              setHasInteracted(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasInteracted(true);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Validation Icon */}
            {validationIcon}
            
            {/* Custom Right Icon */}
            {rightIcon && !validationIcon && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
            
            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-text-primary transition-colors duration-200 p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <div className="flex justify-between items-center">
          {(error || success || warning || helperText) && (
            <div className={cn(
              'text-xs transition-all duration-300 transform',
              error ? 'text-error animate-slideInLeft' : success || isValid ? 'text-success animate-slideInLeft' : warning ? 'text-warning animate-slideInLeft' : 'text-muted-foreground',
              animated && 'animate-fadeIn'
            )}>
              {error || success || warning || helperText}
            </div>
          )}
          
          {/* Character Count */}
          {showCharacterCount && maxLength && (
            <div className={cn(
              'text-xs transition-colors duration-200',
              charCount > maxLength * 0.9 ? 'text-warning' : charCount === maxLength ? 'text-error' : 'text-muted-foreground'
            )}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };