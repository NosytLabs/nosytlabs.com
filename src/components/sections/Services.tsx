import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Card } from "../ui/card";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const servicesVariants = cva(
  "py-16 md:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-b from-background to-muted/20",
        ai: "bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10",
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

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  badge?: string;
  features?: string[];
  price?: {
    amount: string;
    period?: string;
    currency?: string;
  };
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "success" | "danger" | "warning" | "gradient" | "AI" | "neural" | "quantum" | "glow" | "neon" | "glass";
  };
  popular?: boolean;
  comingSoon?: boolean;
}

export interface ServicesProps
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
  cardVariant?: "default" | "elevated" | "outline" | "ai" | "neural" | "quantum";
  // Animation controls
  disableAnimations?: boolean;
  staggerDelay?: number;
  // Accessibility
  ariaLabel?: string;
}

const Services = React.forwardRef<HTMLElement, ServicesProps>(
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
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Animation classes
    const animationClasses = [
      !disableAnimations && "animate-in fade-in duration-1000",
    ].filter(Boolean).join(" ");

    const gridClasses = layout === "grid" ? servicesVariants({ layout, columns }) : "";
    const masonryClasses = layout === "masonry" ? `columns-1 md:columns-2 lg:columns-${columns}` : "";
    const carouselClasses = layout === "carousel" ? "flex gap-6 overflow-x-auto pb-4" : "";

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
          <div className={`${
            layout === "grid" ? `${gridClasses} gap-6` :
            layout === "masonry" ? `${masonryClasses} gap-6` :
            carouselClasses
          }`}>
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`${
                  layout === "masonry" ? "break-inside-avoid mb-6" :
                  layout === "carousel" ? "flex-shrink-0 w-80" : ""
                } ${
                  !disableAnimations ? `animate-in slide-in-from-bottom-4 duration-700` : ""
                }`}
                style={{
                  animationDelay: !disableAnimations ? `${index * staggerDelay}ms` : undefined,
                }}
              >
                <Card
                  variant={service.popular ? "ai" : cardVariant}
                  size="default"
                  className={`h-full relative ${
                    service.popular ? "ring-2 ring-primary/20 shadow-lg" : ""
                  } ${
                    service.comingSoon ? "opacity-75" : ""
                  }`}
                  glow={service.popular}
                  pulse={service.popular && !disableAnimations}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="ai" size="sm">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Coming Soon Badge */}
                  {service.comingSoon && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="outline" size="sm">
                        Coming Soon
                      </Badge>
                    </div>
                  )}

                  {/* Service Badge */}
                  {service.badge && (
                    <div className="mb-4">
                      <Badge variant="neural" size="sm">
                        {service.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  {service.icon && (
                    <div className="mb-4 text-primary">
                      {service.icon}
                    </div>
                  )}

                  {/* Image */}
                  {service.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-4">
                    <Typography variant="h3" className="font-semibold">
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body"
                      className="text-muted-foreground"
                    >
                      {service.description}
                    </Typography>

                    {/* Features */}
                    {showFeatures && service.features && service.features.length > 0 && (
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Pricing */}
                    {showPricing && service.price && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-baseline gap-1">
                          <Typography variant="h2" className="font-bold text-primary">
                            {service.price.currency || "$"}{service.price.amount}
                          </Typography>
                          {service.price.period && (
                            <Typography
                              variant="caption"
                              className="text-muted-foreground"
                            >
                              /{service.price.period}
                            </Typography>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    {service.action && (
                      <div className="pt-4">
                        <Button
                          variant={service.action.variant || "primary"}
                          size="default"
                          onClick={service.action.onClick}
                          disabled={service.comingSoon}
                          className="w-full"
                        >
                          {service.comingSoon ? "Coming Soon" : service.action.text}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

Services.displayName = "Services";

export { Services, servicesVariants };