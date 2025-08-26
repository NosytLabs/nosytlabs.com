/**
 * Optimized Services Component
 * Enhanced version with lazy loading and performance optimizations
 */

import { cva, type VariantProps } from "class-variance-authority";
import React, { useMemo } from "react";
import { OptimizedComponent } from "../performance/OptimizedComponentLoader";
import { Typography } from "../ui/typography";
import { GridLoading } from "../ui/loading-fallback";
import type { Service } from "./Services";

const servicesVariants = cva(
  "py-16 md:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-b from-background to-muted/20",
        ai: "bg-gradient-to-br from-background via-background-muted/50 to-background/80 backdrop-blur-sm",
        glass: "bg-gradient-glass backdrop-blur-md border border-border/20",
      },
      layout: {
        grid: "grid",
        masonry: "columns",
        carousel: "flex overflow-x-auto",
      },
      columns: {
        "1": "grid-cols-1",
        "2": "grid-cols-1 md:grid-cols-2",
        "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "grid",
      columns: "3",
    },
  }
);

export interface OptimizedServicesProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof servicesVariants> {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  services: Service[];
  // Visual options
  showPricing?: boolean;
  showFeatures?: boolean;
  cardVariant?: "default" | "elevated" | "outlined" | "ghost" | "gradient";
  // Animation controls
  disableAnimations?: boolean;
  staggerDelay?: number;
  // Performance options
  enableLazyLoading?: boolean;
  preloadOnHover?: boolean;
  chunkSize?: number;
  // Accessibility
  ariaLabel?: string;
}

/**
 * Lazy-loaded Service Card Component
 */
const LazyServiceCard = React.lazy(() => 
  import("./ServiceCard").then(module => ({ default: module.ServiceCard }))
);

/**
 * Optimized Services Component with lazy loading
 */
const OptimizedServices = React.forwardRef<HTMLElement, OptimizedServicesProps>(
  (
    {
      className,
      variant,
      layout,
      columns,
      title,
      subtitle,
      description,
      services,
      showPricing,
      showFeatures,
      cardVariant = "elevated",
      disableAnimations,
      staggerDelay = 100,
      enableLazyLoading = true,
      preloadOnHover = true,
      chunkSize = 6,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Memoize layout classes
    const layoutClasses = useMemo(() => {
      const gridClasses = layout === "grid" ? servicesVariants({ layout, columns }) : "";
      const masonryClasses = layout === "masonry" ? `columns-1 md:columns-2 lg:columns-${columns}` : "";
      const carouselClasses = layout === "carousel" ? "flex gap-6 overflow-x-auto pb-4" : "";
      
      return {
        grid: `${gridClasses} gap-6`,
        masonry: `${masonryClasses} gap-6`,
        carousel: carouselClasses,
      };
    }, [layout, columns]);

    // Animation classes
    const animationClasses = useMemo(() => [
      !disableAnimations && "animate-in fade-in duration-1000",
    ].filter(Boolean).join(" "), [disableAnimations]);

    // Chunk services for better performance
    const serviceChunks = useMemo(() => {
      if (!enableLazyLoading) return [services];
      
      const chunks = [];
      for (let i = 0; i < services.length; i += chunkSize) {
        chunks.push(services.slice(i, i + chunkSize));
      }
      return chunks;
    }, [services, chunkSize, enableLazyLoading]);

    const renderServiceCard = (service: Service, index: number, chunkIndex: number = 0) => {
      const cardProps = {
        service,
        showPricing,
        showFeatures,
        cardVariant,
        disableAnimations,
        layout: layout || undefined,
      };

      const cardClassName = `${
        layout === "masonry" ? "break-inside-avoid mb-6" :
        layout === "carousel" ? "flex-shrink-0 w-80" : ""
      } ${
        !disableAnimations ? `animate-in slide-in-from-bottom-4 duration-700` : ""
      }`;

      const cardStyle = {
        animationDelay: !disableAnimations ? `${(chunkIndex * chunkSize + index) * staggerDelay}ms` : undefined,
      };

      if (enableLazyLoading) {
        return (
          <div key={service.id} className={cardClassName} style={cardStyle}>
            <OptimizedComponent
              importFn={() => import("./ServiceCard").then(m => ({ default: m.ServiceCard }))}
              componentName={`service-card-${service.id}`}
              priority={index < 3 ? "high" : "medium"}
              preloadOnHover={preloadOnHover}
              enableIntersectionObserver={index >= 3}
              componentProps={cardProps}
              skeletonVariant="card"
            />
          </div>
        );
      }

      return (
        <div key={service.id} className={cardClassName} style={cardStyle}>
          <React.Suspense fallback={<GridLoading count={1} />}>
            <LazyServiceCard {...cardProps} />
          </React.Suspense>
        </div>
      );
    };

    return (
      <section
        ref={ref}
        className={`${servicesVariants({ variant })} ${animationClasses} ${className || ""}`}
        aria-label={ariaLabel || "Services section"}
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

          {/* Services Grid/Layout */}
          <div className={layoutClasses[layout as keyof typeof layoutClasses]}>
            {enableLazyLoading ? (
              // Render chunked services for better performance
              serviceChunks.map((chunk, chunkIndex) => (
                <React.Fragment key={`chunk-${chunkIndex}`}>
                  {chunk.map((service, index) => 
                    renderServiceCard(service, index, chunkIndex)
                  )}
                </React.Fragment>
              ))
            ) : (
              // Render all services at once
              services.map((service, index) => renderServiceCard(service, index))
            )}
          </div>
        </div>
      </section>
    );
  }
);

OptimizedServices.displayName = "OptimizedServices";

export { OptimizedServices, servicesVariants };