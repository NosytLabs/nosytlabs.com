/**
 * StatItem Component
 * Individual stat item for lazy loading optimization
 */

import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '../ui/typography';
import { Card } from '../ui/card';
import type { Stat } from './Stats';

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

export interface StatItemProps {
  stat: Stat;
  showCard?: boolean;
  cardVariant?: string;
  disableAnimations?: boolean | undefined;
  animateOnView?: boolean;
  index: number;
  staggerDelay: number;
}

/**
 * Individual stat item component optimized for lazy loading
 */
export const StatItem: React.FC<StatItemProps> = ({
  stat,
  showCard,
  cardVariant,
  disableAnimations,
  animateOnView,
  index,
  staggerDelay
}) => {
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

export default StatItem;