/**
 * Optimized Stats Component
 * Enhanced version with lazy loading and performance optimizations
 */

import React, { Suspense, lazy, useMemo } from 'react';
// import { cva } from 'class-variance-authority'; // Unused for now
import { type VariantProps } from "class-variance-authority";
import { OptimizedComponent } from '../performance/OptimizedComponentLoader';
import { LoadingFallback } from '../ui/loading-fallback';
import { statsVariants, type Stat } from './Stats';
import { Typography } from '../ui/typography';

// Lazy load individual stat item for better performance
const LazyStatItem = lazy(() => 
  import('./StatItem').then(module => ({ default: module.StatItem }))
);

export interface OptimizedStatsProps
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
  
  // Performance options
  enableLazyLoading?: boolean;
  preloadOnHover?: boolean;
  chunkSize?: number;
  priority?: 'high' | 'medium' | 'low';
  
  // Accessibility
  ariaLabel?: string;
}

/**
 * Optimized Stats component with lazy loading and performance enhancements
 */
export const OptimizedStats = React.forwardRef<HTMLElement, OptimizedStatsProps>(
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
      enableLazyLoading = true,
      preloadOnHover = true,
      chunkSize = 4,
      priority = 'medium',
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Chunk stats for better performance
    const chunkedStats = useMemo(() => {
      if (!enableLazyLoading) return [stats];
      
      const chunks: Stat[][] = [];
      for (let i = 0; i < stats.length; i += chunkSize) {
        chunks.push(stats.slice(i, i + chunkSize));
      }
      return chunks;
    }, [stats, chunkSize, enableLazyLoading]);

    // Animation classes
    const animationClasses = [
      !disableAnimations && "animate-in fade-in duration-1000",
    ].filter(Boolean).join(" ");

    const layoutClasses = layout === "cards" ? 
      `${statsVariants({ layout, columns })}` : 
      statsVariants({ layout, columns });

    // Render individual stat item
    const renderStatItem = (stat: Stat, index: number) => {
      if (!enableLazyLoading) {
        return (
          <Suspense key={stat.id} fallback={
            <LoadingFallback 
              variant="card" 
              className="h-32" 
            />
          }>
            <LazyStatItem
              stat={stat}
              showCard={showCards || layout === "cards"}
              cardVariant={cardVariant}
              disableAnimations={disableAnimations}
              animateOnView={animateOnView}
              index={index}
              staggerDelay={staggerDelay}
            />
          </Suspense>
        );
      }

      return (
        <OptimizedComponent
          key={stat.id}
          importFn={() => import("./StatItem").then(m => ({ default: m.StatItem }))}
          componentName={`stat-${stat.id}`}
          priority={priority}
          preloadOnHover={preloadOnHover}
          fallback={LoadingFallback}
          componentProps={{
            stat,
            showCard: showCards || layout === "cards",
            cardVariant,
            disableAnimations,
            animateOnView,
            index,
            staggerDelay
          }}
          skeletonVariant="card"
        />
      );
    };

    // Render chunked stats
    const renderChunkedStats = () => {
      if (!enableLazyLoading) {
        return stats.map((stat, index) => renderStatItem(stat, index));
      }

      return chunkedStats.map((chunk, chunkIndex) => (
        <React.Fragment key={`chunk-${chunkIndex}`}>
          {chunk.map((stat, statIndex) => {
            const globalIndex = chunkIndex * chunkSize + statIndex;
            return renderStatItem(stat, globalIndex);
          })}
        </React.Fragment>
      ));
    };

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
            {renderChunkedStats()}
          </div>
        </div>
      </section>
    );
  }
);

OptimizedStats.displayName = "OptimizedStats";

export default OptimizedStats;