/**
 * Service Card Component
 * Individual service card for lazy loading
 */

import React from "react";
import { Card } from "../ui/card";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Service } from "./Services";

export interface ServiceCardProps {
  service: Service;
  showPricing?: boolean | undefined;
  showFeatures?: boolean | undefined;
  cardVariant?: "default" | "elevated" | "outlined" | "ghost" | "gradient";
  disableAnimations?: boolean | undefined;
  layout?: "grid" | "masonry" | "carousel" | undefined;
  className?: string;
}

/**
 * Individual Service Card Component
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  showPricing,
  showFeatures,
  cardVariant = "elevated",
  disableAnimations: _disableAnimations,
  layout: _layout,
  className,
}) => {
  return (
    <Card
      variant={service.popular ? "gradient" : cardVariant}
      size="md"
      className={`h-full relative ${
        service.popular ? "ring-2 ring-primary/20 shadow-lg" : ""
      } ${
        service.comingSoon ? "opacity-75" : ""
      } ${className || ""}`}
      hover={service.popular ? "glow" : "none"}
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
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
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
              size="md"
              onClick={service.action.onClick}
              disabled={service.comingSoon}
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {service.comingSoon ? "Coming Soon" : service.action.text}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;