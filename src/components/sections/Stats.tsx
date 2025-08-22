import { cva, type VariantProps } from "class-variance-authority";
import React, { useEffect, useRef, useState } from "react";
import { Typography } from "../ui/typography";
import { Card } from "../ui/card";

const statsVariants = cva(
  "py-16 md:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5",
        ai: "bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20",
        neural: "bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20",
        quantum: "bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20",
      },
      layout: {
        inline: "flex flex-wrap justify-center items-center gap-8 md:gap-16",
        grid: "grid",
        cards: "grid gap-6",
      },
      columns: {
        "2": "grid-cols-1 md:grid-cols-2",
        "3": "grid-cols-1 md:grid-cols-3",
        "4": "grid-cols-2 md:grid-cols-4",
        "5": "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        "6": "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "grid",
      columns: "4",
    },
  }
);

export interface Stat {
  id: string;
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  animated?: boolean;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

export interface StatsProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof statsVariants> {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  stats: Stat[];
  // Visual options
  showCards?: boolean;
  cardVariant?: "default" | "elevated" | "outline" | "ghost";
  // Animation controls
  disableAnimations?: boolean;
  animateOnView?: boolean;
  staggerDelay?: number;
  // Accessibility
  ariaLabel?: string;
}

// Counter animation hook
const useCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const countRef = useRef(start);
  const frameRef = useRef<number>();

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = countRef.current;
    const difference = end - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + difference * easeOut);
      
      countRef.current = current;
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { count, startAnimation, isAnimating };
};

// Individual stat component
const StatItem: React.FC<{
  stat: Stat;
  showCard?: boolean;
  cardVariant?: string;
  disableAnimations?: boolean | undefined;
  animateOnView?: boolean;
  index: number;
  staggerDelay: number;
}> = ({ stat, showCard, cardVariant, disableAnimations, animateOnView, index, staggerDelay }) => {
  // Removed unused isVisible state
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Extract numeric value for animation
  const numericValue = typeof stat.value === 'number' ? stat.value : 
    parseInt(stat.value.toString().replace(/[^0-9]/g, '')) || 0;
  
  const { count, startAnimation } = useCounter(numericValue, 2000);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer for animation on view
  useEffect(() => {
    if (!animateOnView || disableAnimations) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasAnimated) {
          if (stat.animated !== false) {
            startAnimation();
          }
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [animateOnView, disableAnimations, hasAnimated, startAnimation, stat.animated]);

  // Start animation immediately if not animating on view
  useEffect(() => {
    if (!animateOnView && stat.animated !== false && !hasAnimated) {
      startAnimation();
      setHasAnimated(true);
    }
  }, [animateOnView, startAnimation, stat.animated, hasAnimated]);

  const displayValue = stat.animated !== false && hasAnimated ? 
    stat.value.toString().replace(/\d+/, count.toString()) : stat.value;

  const colorClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const content = (
    <div
      ref={elementRef}
      className={`text-center space-y-2 ${
        !disableAnimations ? `animate-in slide-in-from-bottom-4 duration-700` : ""
      }`}
      style={{
        animationDelay: !disableAnimations ? `${index * staggerDelay}ms` : undefined,
      }}
    >
      {/* Icon */}
      {stat.icon && (
        <div className="flex justify-center mb-3 text-primary">
          {stat.icon}
        </div>
      )}

      {/* Value */}
      <div className="space-y-1">
        <Typography
          variant="h1"
          className={`font-bold ${colorClasses[stat.color || "primary"]}`}
        >
          {stat.prefix}{displayValue}{stat.suffix}
        </Typography>
        
        <Typography
          variant="label"
          className="text-muted-foreground font-medium uppercase tracking-wider"
        >
          {stat.label}
        </Typography>
      </div>

      {/* Description */}
      {stat.description && (
        <Typography
          variant="caption"
          className="text-muted-foreground max-w-xs mx-auto"
        >
          {stat.description}
        </Typography>
      )}
    </div>
  );

  if (showCard) {
    return (
      <Card
        variant={cardVariant as any}
        className="p-6 h-full"
      >
        {content}
      </Card>
    );
  }

  return content;
};

const Stats = React.forwardRef<HTMLElement, StatsProps>(
  (
    {
      className,
      variant,
      layout,
      columns,
      title,
      subtitle,
      description,
      stats,
      showCards,
      cardVariant = "elevated",
      disableAnimations,
      animateOnView = true,
      staggerDelay = 100,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Animation classes
    const animationClasses = [
      !disableAnimations && "animate-in fade-in duration-1000",
    ].filter(Boolean).join(" ");

    const layoutClasses = layout === "cards" ? 
      `${statsVariants({ layout, columns })}` : 
      statsVariants({ layout, columns });

    return (
      <section
        ref={ref}
        className={`${statsVariants({ variant })} ${animationClasses} ${className || ""}`}
        aria-label={ariaLabel || "Statistics section"}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          {(title || subtitle || description) && (
            <div className={`text-center mb-16 max-w-3xl mx-auto ${
              !disableAnimations ? "animate-in slide-in-from-top-4 duration-700" : ""
            }`}>
              {subtitle && (
                <Typography
                  variant="overline"
                  className="text-primary mb-4 font-semibold tracking-wider"
                >
                  {subtitle}
                </Typography>
              )}
              
              {title && (
                <Typography
                  variant="h1"
                  className="mb-6"
                >
                  {title}
                </Typography>
              )}
              
              {description && (
                <Typography
                  variant="bodyLarge"
                  className="text-muted-foreground"
                >
                  {description}
                </Typography>
              )}
            </div>
          )}

          {/* Stats */}
          <div className={layoutClasses}>
            {stats.map((stat, index) => (
              <StatItem
                key={stat.id}
                stat={stat}
                showCard={showCards || layout === "cards"}
                cardVariant={cardVariant}
                disableAnimations={disableAnimations}
                animateOnView={animateOnView}
                index={index}
                staggerDelay={staggerDelay}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

Stats.displayName = "Stats";

export { Stats, statsVariants };