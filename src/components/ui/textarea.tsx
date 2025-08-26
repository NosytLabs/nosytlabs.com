import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Loader2, Maximize2, Minimize2 } from 'lucide-react';

const textareaVariants = cva(
  [
    'flex w-full rounded-lg border bg-background px-3 py-2 text-sm',
    'transition-all duration-300 ease-out transform-gpu will-change-transform resize-none',
    'placeholder:text-muted-foreground placeholder:transition-colors placeholder:duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'hover:shadow-sm focus:shadow-md',
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
      },
      size: {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  required?: boolean;
  loading?: boolean;
  containerClassName?: string;
  animated?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  expandable?: boolean;
  onValidate?: (value: string) => boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    variant,
    size,
    label,
    error,
    success,
    warning,
    helperText,
    required = false,
    rows = 4,
    loading = false,
    containerClassName,
    animated = true,
    showCharacterCount = false,
    maxLength,
    autoResize = false,
    expandable = false,
    onValidate,
    disabled,
    ...props 
  }, ref) => {
    const [, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine the variant based on props
    const currentVariant = error ? 'error' : success ? 'success' : variant;

    // Handle validation and character counting
    useEffect(() => {
      const value = props.value?.toString() || '';
      setCharCount(value.length);
      
      if (onValidate && hasInteracted) {
        setIsValid(onValidate(value));
      }
    }, [props.value, onValidate, hasInteracted]);

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [props.value, autoResize]);

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

    const handleToggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
    
    return (
      <div 
        ref={containerRef}
        className={cn(
          'space-y-2 transition-all duration-300',
          isExpanded && 'fixed inset-4 z-50 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-2xl',
          containerClassName
        )}
      >
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={props.id}
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                error ? 'text-error' : success || isValid ? 'text-success' : warning ? 'text-warning' : 'text-foreground'
              )}
            >
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </label>
            
            {/* Expand/Collapse Button */}
            {expandable && (
              <button
                type="button"
                onClick={handleToggleExpand}
                className={cn(
                  'p-1 rounded-md transition-all duration-200',
                  'hover:bg-surface-secondary hover:scale-110',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
                )}
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={(node) => {
              if (textareaRef.current !== node) {
                (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
              }
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
              }
            }}
            className={cn(
              textareaVariants({ variant: currentVariant, size }),
              isExpanded && 'h-full min-h-[300px] resize-none',
              autoResize && 'resize-none overflow-hidden',
              className
            )}
            rows={isExpanded ? undefined : rows}
            disabled={disabled || loading}
            maxLength={maxLength}
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

          {/* Validation Icon */}
          {(loading || error || success || warning || isValid !== null) && (
            <div className="absolute right-3 top-3 flex items-center">
              {getValidationIcon()}
            </div>
          )}
        </div>
        {/* Helper Text / Error Message / Character Count */}
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
        
        {/* Expanded Mode Overlay */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
            onClick={handleToggleExpand}
          />
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };