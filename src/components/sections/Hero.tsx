import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { Badge } from "../ui/badge";

const heroVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        gradient: "bg-gradient-to-br from-background via-background to-muted/20",
        ai: "bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20",
        neural: "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20",
        quantum: "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20",
      },
      size: {
        sm: "py-12 md:py-16",
        default: "py-16 md:py-24",
        lg: "py-24 md:py-32",
        xl: "py-32 md:py-40",
        full: "min-h-screen flex items-center",
      },
      alignment: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      alignment: "center",
    },
  }
);

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {
  // Content
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  // Actions
  primaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "AI" | "neural" | "quantum";
  };
  secondaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "outline" | "ghost" | "link";
  };
  // Visual elements
  backgroundPattern?: boolean;
  particles?: boolean;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  // Animation controls
  disableAnimations?: boolean;
  // Accessibility
  ariaLabel?: string;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      badge,
      title,
      subtitle,
      description,
      primaryAction,
      secondaryAction,
      backgroundPattern,
      particles,
      stats,
      disableAnimations,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Animation classes
    const animationClasses = [
      !disableAnimations && "animate-in fade-in duration-1000",
    ].filter(Boolean).join(" ");

    return (
      <section
        ref={ref}
        className={`${heroVariants({ variant, size, alignment })} ${animationClasses} ${className || ""}`}
        aria-label={ariaLabel || "Hero section"}
        {...props}
      >
        {/* Background Pattern */}
        {backgroundPattern && (
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]" />
          </div>
        )}

        {/* Particles Effect */}
        {particles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-primary/20 rounded-full ${
                  !disableAnimations ? "animate-pulse" : ""
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className={`max-w-4xl ${
            alignment === "center" ? "mx-auto" : 
            alignment === "right" ? "ml-auto" : ""
          }`}>
            {/* Badge */}
            {badge && (
              <div className={`mb-6 ${
                !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-200" : ""
              }`}>
                <Badge variant="ai" size="lg">
                  {badge}
                </Badge>
              </div>
            )}

            {/* Title */}
            <div className={`mb-6 ${
              !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-300" : ""
            }`}>
              <Typography
                variant="display"
                className="mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                gradient
                gradientFrom="from-blue-600"
                gradientTo="to-purple-600"
              >
                {title}
              </Typography>
              
              {subtitle && (
                <Typography
                  variant="h2"
                  className="text-muted-foreground font-normal"
                >
                  {subtitle}
                </Typography>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className={`mb-8 ${
                !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-400" : ""
              }`}>
                <Typography
                  variant="bodyLarge"
                  className="text-muted-foreground max-w-2xl"
                >
                  {description}
                </Typography>
              </div>
            )}

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
              <div className={`flex flex-col sm:flex-row gap-4 mb-12 ${
                alignment === "center" ? "justify-center" :
                alignment === "right" ? "justify-end" : "justify-start"
              } ${
                !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-500" : ""
              }`}>
                {primaryAction && (
                  <Button
                    variant={primaryAction.variant || "AI"}
                    size="lg"
                    onClick={primaryAction.onClick}
                    className="min-w-[160px]"
                  >
                    {primaryAction.text}
                  </Button>
                )}
                
                {secondaryAction && (
                  <Button
                    variant={secondaryAction.variant || "outline"}
                    size="lg"
                    onClick={secondaryAction.onClick}
                    className="min-w-[160px]"
                  >
                    {secondaryAction.text}
                  </Button>
                )}
              </div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 ${
                alignment === "center" ? "justify-items-center" :
                alignment === "right" ? "justify-items-end" : "justify-items-start"
              } ${
                !disableAnimations ? "animate-in slide-in-from-bottom-4 duration-700 delay-600" : ""
              }`}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <Typography
                      variant="h2"
                      className="font-bold text-primary mb-1"
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-muted-foreground uppercase tracking-wide"
                    >
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero, heroVariants };