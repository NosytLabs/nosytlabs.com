import React, { forwardRef, useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoadingFallback } from './loading-fallback';
import { Skeleton } from './skeleton';
import { ChevronRight, ExternalLink } from 'lucide-react';

const cardVariants = cva(
  [
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    'transition-all duration-300 ease-out transform-gpu will-change-transform',
    'relative overflow-hidden',
    'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0',
    'before:transition-opacity before:duration-300',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border',
          'hover:shadow-lg hover:shadow-black/10 hover:-translate-y-2 hover:scale-[1.02]',
          'hover:before:opacity-100',
        ],
        elevated: [
          'shadow-lg border-border/50',
          'hover:shadow-xl hover:shadow-black/20 hover:-translate-y-3 hover:scale-[1.03]',
          'hover:before:opacity-100',
        ],
        outlined: [
          'border-2 border-border',
        ],
        ghost: [
          'border-transparent shadow-none',
          'hover:bg-surface-secondary hover:shadow-md hover:scale-[1.01]',
          'hover:before:opacity-100',
        ],
        gradient: [
          'border-border bg-gradient-to-br from-background to-surface-secondary',
        ],
        interactive: [
          'cursor-pointer border-border',
          'hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/50 hover:scale-[1.02]',
          'active:translate-y-0 active:shadow-sm active:scale-100',
          'hover:before:opacity-100',
        ],
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        glow: 'hover:shadow-lg hover:shadow-primary/20',
        scale: 'hover:scale-[1.02]',
        border: 'hover:border-primary',
      },
      interactive: {
        true: 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hover: 'none',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean;
  skeleton?: boolean;
  animated?: boolean;
  clickable?: boolean;
  href?: string;
  external?: boolean;
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, interactive, loading, skeleton, animated = false, clickable = false, href, external = false, asChild, children, onClick, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, size, hover: 'none', interactive: false }), className)}
          {...props}
        >
          <LoadingFallback variant="card" />
        </div>
      );
    }

    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, size, hover: 'none', interactive: false }), className)}
          {...props}
        >
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (href) {
        if (external) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      }
      onClick?.(e);
    };

    const Comp = asChild ? 'div' : 'div';
    const CardComponent = href ? 'a' : Comp;
    const cardProps = href ? { href, ...(external && { target: '_blank', rel: 'noopener noreferrer' }) } : {};

    return (
      <CardComponent
        ref={ref as any}
        className={cn(
          cardVariants({ variant, size, hover, interactive }),
          animated && 'animate-fadeIn',
          (clickable || href) && 'cursor-pointer',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={href || clickable ? handleClick : onClick}
        {...cardProps}
        {...props}
      >
        {children}
        {href && external && (
          <ExternalLink className={cn(
            'absolute top-3 right-3 h-4 w-4 text-muted-foreground',
            'transition-all duration-200',
            isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          )} />
        )}
        {(clickable || href) && !external && (
          <ChevronRight className={cn(
            'absolute top-1/2 right-3 h-4 w-4 text-muted-foreground -translate-y-1/2',
            'transition-all duration-200',
            isHovered ? 'opacity-100 translate-x-1' : 'opacity-0 translate-x-0'
          )} />
        )}
      </CardComponent>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animated?: boolean;
  }
>(({ className, animated = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 pb-4',
      animated && 'animate-slideInDown',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-text-primary', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animated?: boolean;
    delay?: number;
  }
>(({ className, animated = false, delay = 0, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      'pt-0',
      animated && 'animate-fadeIn',
      className
    )} 
    style={animated ? { animationDelay: `${delay}ms` } : undefined}
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animated?: boolean;
    delay?: number;
  }
>(({ className, animated = false, delay = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4',
      animated && 'animate-slideInUp',
      className
    )}
    style={animated ? { animationDelay: `${delay}ms` } : undefined}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Enhanced Card Components
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string;
    alt: string;
    aspectRatio?: 'square' | 'video' | 'wide';
    loading?: boolean;
  }
>(({ className, src, alt, aspectRatio = 'video', loading, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-t-lg',
        {
          'aspect-square': aspectRatio === 'square',
          'aspect-video': aspectRatio === 'video',
          'aspect-[21/9]': aspectRatio === 'wide',
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  );
});
CardImage.displayName = 'CardImage';

const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'left' | 'center' | 'right' | 'between';
  }
>(({ className, align = 'right', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex gap-2 pt-4',
      {
        'justify-start': align === 'left',
        'justify-center': align === 'center',
        'justify-end': align === 'right',
        'justify-between': align === 'between',
      },
      className
    )}
    {...props}
  />
));
CardActions.displayName = 'CardActions';

const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }
>(({ className, variant = 'default', position = 'top-right', children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'absolute z-10 rounded-full px-2 py-1 text-xs font-medium',
      {
        'bg-background text-text-primary border border-border': variant === 'default',
        'bg-primary text-white': variant === 'primary',
        'bg-success text-white': variant === 'success',
        'bg-warning text-white': variant === 'warning',
        'bg-error text-white': variant === 'error',
      },
      {
        'top-2 left-2': position === 'top-left',
        'top-2 right-2': position === 'top-right',
        'bottom-2 left-2': position === 'bottom-left',
        'bottom-2 right-2': position === 'bottom-right',
      },
      className
    )}
    {...props}
  >
    {children}
  </span>
));
CardBadge.displayName = 'CardBadge';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardActions,
  CardBadge,
  cardVariants,
};