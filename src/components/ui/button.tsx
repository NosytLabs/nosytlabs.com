import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoadingFallback } from './loading-fallback';
import { Loader2 } from 'lucide-react';

// Create buttonVariants using cva for consistency with other components
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium',
    'transition-all duration-300 ease-out transform-gpu will-change-transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    'hover:scale-105 active:scale-95',
    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    'before:translate-x-[-100%] before:transition-transform before:duration-700',
    'hover:before:translate-x-[100%]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow-md',
          'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25',
          'focus-visible:ring-primary',
          'active:bg-primary/95',
        ],
        primary: [
          'bg-primary text-primary-foreground shadow-md',
          'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25',
          'focus-visible:ring-primary',
          'active:bg-primary/95',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80 hover:shadow-md hover:shadow-secondary/25',
          'focus-visible:ring-secondary',
          'active:bg-secondary/90',
        ],
        outline: [
          'border border-border bg-background text-foreground',
          'hover:bg-surface-secondary hover:text-foreground hover:border-primary/50',
          'focus-visible:ring-primary',
          'active:bg-surface-secondary/80',
        ],
        ghost: [
          'text-foreground',
          'hover:bg-surface-secondary hover:text-foreground',
          'focus-visible:ring-primary',
          'active:bg-surface-secondary/80',
        ],
        destructive: [
          'bg-error text-error-foreground shadow-md',
          'hover:bg-error/90 hover:shadow-lg hover:shadow-error/25',
          'focus-visible:ring-error',
          'active:bg-error/95',
        ],
        gradient: [
          'bg-gradient-to-r from-primary to-secondary text-white shadow-sm',
          'hover:shadow-lg hover:-translate-y-0.5 hover:scale-105',
          'focus-visible:ring-primary',
          'active:translate-y-0 active:scale-100',
        ],
        glow: [
          'bg-primary text-white shadow-sm',
          'hover:shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5',
          'focus-visible:ring-primary',
          'active:translate-y-0',
        ],
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
      },
      animation: {
        none: '',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        wiggle: 'hover:animate-wiggle',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      animation: 'none',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    ripple?: boolean;
    pulse?: boolean;
    glow?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    animation = 'none',
    loading = false,
    ripple = true,
    pulse = false,
    glow = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    fullWidth = false,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [isPressed, setIsPressed] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());
    const isDisabled = disabled || loading;
    
    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        rippleTimeouts.current.forEach(timeout => clearTimeout(timeout));
      };
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Create ripple effect
      if (ripple) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };

        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        const timeout = setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
          rippleTimeouts.current.delete(timeout);
        }, 600);
        rippleTimeouts.current.add(timeout);
      }

      onClick?.(event);
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsPressed(false);
    };
    
    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          buttonVariants({ variant, size, animation }),
          fullWidth && 'w-full',
          pulse && 'animate-pulse',
          glow && 'shadow-lg shadow-primary/50 hover:shadow-primary/75',
          isPressed && 'scale-95',
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Loading spinner */}
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
          </div>
        ) : (
          <>
            {/* Left icon */}
            {leftIcon && (
              <span className="flex-shrink-0">
                {leftIcon}
              </span>
            )}
            
            {/* Button content */}
            {children}
            
            {/* Right icon */}
            {rightIcon && (
              <span className="flex-shrink-0">
                {rightIcon}
              </span>
            )}
          </>
        )}
        
        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;