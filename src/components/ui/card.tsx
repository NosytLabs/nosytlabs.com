import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-border bg-card hover:shadow-md',
        elevated: 'shadow-lg border-border/50 bg-card hover:shadow-xl',
        outline: 'border-2 border-border bg-transparent hover:bg-card/50',
        ghost: 'border-transparent bg-transparent shadow-none hover:bg-card/30',
        gradient: 'bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-lg',
        glass: 'bg-card/80 backdrop-blur-sm border-border/30 hover:bg-card/90',
        neural: 'bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 border-purple-200 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-red-950/50 dark:border-purple-800 hover:shadow-lg hover:shadow-purple-500/25',
        quantum: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 dark:from-blue-950/50 dark:via-cyan-950/50 dark:to-teal-950/50 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-500/25',
        ai: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200 dark:from-cyan-950/50 dark:via-blue-950/50 dark:to-indigo-950/50 dark:border-cyan-800 hover:shadow-lg hover:shadow-cyan-500/25',
        neon: 'bg-black border border-cyan-400 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/50',
        frosted: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20',
        premium: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-950/50 dark:to-yellow-950/50 dark:border-amber-800 hover:shadow-lg hover:shadow-amber-500/25',
      },
      size: {
        xs: 'p-3',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
        xxl: 'p-12',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]',
        false: '',
      },
      glow: {
        true: 'shadow-lg hover:shadow-2xl',
        false: '',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      glow: false,
      pulse: false,
      rounded: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  // Structured content props
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  metadata?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  // Enhanced AI-powered features
  aiPowered?: boolean;
  neuralNetwork?: boolean;
  quantumComputing?: boolean;
  // Animation controls
  disableAnimations?: boolean;
  // Accessibility enhancements
  ariaLabel?: string;
  role?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      glow,
      pulse,
      rounded,
      title,
      description,
      image,
      imageAlt,
      actions,
      metadata,
      header,
      footer,
      aiPowered,
      neuralNetwork,
      quantumComputing,
      disableAnimations,
      ariaLabel,
      role,
      children,
      ...props
    },
    ref
  ) => {
    // Auto-select AI variants based on props
    const finalVariant = aiPowered
      ? "ai"
      : neuralNetwork
      ? "neural"
      : quantumComputing
      ? "quantum"
      : variant;

    // Build dynamic classes for animations
    const animationClasses = [
      disableAnimations && "transition-none",
    ].filter(Boolean).join(" ");

    // If structured content is provided, render it
    if (title || description || image || actions || metadata || header || footer) {
      return (
        <div
          ref={ref}
          className={`${cardVariants({
            variant: finalVariant,
            size,
            interactive,
            glow,
            pulse: pulse && !disableAnimations,
            rounded,
          })} ${animationClasses} ${className || ""}`}
          aria-label={ariaLabel}
          role={role || (interactive ? "button" : undefined)}
          {...props}
        >
          {header && (
            <div className="mb-4 border-b border-border/50 pb-4">
              {header}
            </div>
          )}
          {image && (
            <div className="mb-4 -mx-6 -mt-6">
              <img
                src={image}
                alt={imageAlt || title || "Card image"}
                className={`w-full h-48 object-cover ${rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-t-2xl' : rounded === 'lg' ? 'rounded-t-xl' : 'rounded-t-lg'}`}
              />
            </div>
          )}
          {metadata && (
            <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
              {metadata}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold mb-2 text-card-foreground leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
          )}
          {children && (
            <div className="flex-1">{children}</div>
          )}
          {actions && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
              {actions}
            </div>
          )}
          {footer && (
            <div className="mt-4 pt-4 border-t border-border/50">
              {footer}
            </div>
          )}
        </div>
      );
    }

    // Otherwise, render as a simple container
    return (
      <div
        ref={ref}
        className={`${cardVariants({
          variant: finalVariant,
          size,
          interactive,
          glow,
          pulse: pulse && !disableAnimations,
          rounded,
        })} ${animationClasses} ${className || ""}`}
        aria-label={ariaLabel}
        role={role || (interactive ? "button" : undefined)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-text',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-muted leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
