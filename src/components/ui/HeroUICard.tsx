import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import type { CardProps } from "@heroui/react";

interface HeroUICardProps extends CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  hoverable?: boolean;
  pressable?: boolean;
}

/**
 * HeroUI Card wrapper with NOSYT Labs styling
 * Provides consistent card design across the site
 */
export function HeroUICard({
  header,
  footer,
  children,
  hoverable = false,
  pressable = false,
  className,
  ...props
}: HeroUICardProps) {
  return (
    <Card
      isHoverable={hoverable}
      isPressable={pressable}
      className={`border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 ${className || ""}`}
      {...props}
    >
      {header && (
        <CardHeader className="flex gap-3">
          {header}
        </CardHeader>
      )}
      <CardBody className="flex-grow">
        {children}
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-border/50 pt-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default HeroUICard;
