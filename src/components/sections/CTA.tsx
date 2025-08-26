import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const ctaVariants = cva(
  "py-16 md:py-24 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        muted: "bg-muted/50",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
        ai: "bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 text-white",
        neural: "bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 text-white",
        quantum: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white",
        glass: "bg-background/80 backdrop-blur-xl border border-border/50",
      },
      size: {
        sm: "py-12 md:py-16",
        default: "py-16 md:py-24",
        lg: "py-24 md:py-32",
        xl: "py-32 md:py-40",
      },
      alignment: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      layout: {
        simple: "simple",
        card: "card",
        split: "split",
        banner: "banner",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      alignment: "center",
      layout: "simple",
    },
  }
);

export interface CTAProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof ctaVariants> {
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
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "gradient" | "glow";
    size?: "sm" | "md" | "lg";
  };
  secondaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "outline" | "ghost" | "secondary";
    size?: "sm" | "md" | "lg";
  };
  // Visual elements
  image?: string;
  video?: string;
  backgroundPattern?: boolean;
  particles?: boolean;
  urgency?: {
    text: string;
    countdown?: {
      endDate: Date;
      labels?: {
        days?: string;
        hours?: string;
        minutes?: string;
        seconds?: string;
      };
    };
  };
  // Social proof
  testimonial?: {
    text: string;
    author: string;
    role?: string;
    avatar?: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  // Animation controls
  disableAnimations?: boolean;
  // Accessibility
  ariaLabel?: string;
}

// Countdown timer component
const CountdownTimer: React.FC<{
  endDate: Date;
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  disableAnimations?: boolean;
}> = ({ endDate, labels, disableAnimations }) => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex justify-center gap-4 mt-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className={`text-center ${
            !disableAnimations ? "animate-pulse" : ""
          }`}
        >
          <div className="bg-background/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
            <Typography variant="h3" className="font-bold">
              {value.toString().padStart(2, '0')}
            </Typography>
          </div>
          <Typography variant="caption" className="mt-1 opacity-80">
            {labels?.[unit as keyof typeof labels] || unit}
          </Typography>
        </div>
      ))}
    </div>
  );
};

const CTA = React.forwardRef<HTMLElement, CTAProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      layout,
      badge,
      title,
      subtitle,
      description,
      primaryAction,
      secondaryAction,
      image,
      video,
      backgroundPattern,
      particles,
      urgency,
      testimonial,
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

    const isGradientVariant = ['gradient', 'ai', 'neural', 'quantum'].includes(variant || '');
    const textColorClass = isGradientVariant ? 'text-white' : '';

    const renderContent = () => (
      <div className={`max-w-4xl mx-auto ${
    alignment === "center" ? "text-center" : 
    alignment === "right" ? "text-right" : "text-left"
  }`}>
        {/* Badge */}
        {badge && (
          <div className={`mb-6 ${
            !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-200" : ""
          }`}>
            <Badge 
              variant={isGradientVariant ? "outline" : "ai"} 
              size="lg"
              className={isGradientVariant ? "border-white/30 text-white" : ""}
            >
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
            className={`mb-4 ${textColorClass}`}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="h2"
              className={`font-normal ${
                isGradientVariant ? "text-white/80" : "text-muted-foreground"
              }`}
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
              className={`max-w-2xl ${
                isGradientVariant ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {description}
            </Typography>
          </div>
        )}

        {/* Urgency */}
        {urgency && (
          <div className={`mb-8 ${
            !disableAnimations ? "animate-in slide-in-from-top-4 duration-700 delay-450" : ""
          }`}>
            <Typography
              variant="body"
              className={`font-semibold mb-4 ${
                isGradientVariant ? "text-yellow-200" : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {urgency.text}
            </Typography>
            
            {urgency.countdown && (
              <CountdownTimer
                endDate={urgency.countdown.endDate}
                {...(urgency.countdown.labels && { labels: urgency.countdown.labels })}
                {...(disableAnimations !== undefined && { disableAnimations })}
              />
            )}
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
                variant={primaryAction.variant || (isGradientVariant ? "outline" : "primary")}
                size={primaryAction.size || "lg"}
                onClick={primaryAction.onClick}
                className={`min-w-[160px] ${
                  isGradientVariant && primaryAction.variant === "outline" ? 
                  "border-white/30 text-white hover:bg-white/10" : ""
                }`}
              >
                {primaryAction.text}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || "ghost"}
                size={secondaryAction.size || "lg"}
                onClick={secondaryAction.onClick}
                className={`min-w-[160px] ${
                  isGradientVariant ? "text-white/80 hover:text-white hover:bg-white/10" : ""
                }`}
              >
                {secondaryAction.text}
              </Button>
            )}
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 mb-8 ${
            alignment === "center" ? "justify-items-center" :
            alignment === "right" ? "justify-items-end" : "justify-items-start"
          } ${
            !disableAnimations ? "animate-in slide-in-from-bottom-4 duration-700 delay-600" : ""
          }`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <Typography
                  variant="h2"
                  className={`font-bold mb-1 ${
                    isGradientVariant ? "text-white" : "text-primary"
                  }`}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  className={`uppercase tracking-wide ${
                    isGradientVariant ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        )}

        {/* Testimonial */}
        {testimonial && (
          <div className={`max-w-2xl ${
            `mx-auto ${alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"}`
          } ${
            !disableAnimations ? "animate-in slide-in-from-bottom-4 duration-700 delay-700" : ""
          }`}>
            <Card 
              variant="ghost" 
              className={`p-6 ${
                isGradientVariant ? "bg-white/10 backdrop-blur-sm border-white/20" : ""
              }`}
            >
              <Typography
                variant="body"
                className={`italic mb-4 ${
                  isGradientVariant ? "text-white/90" : ""
                }`}
              >
                "{testimonial.text}"
              </Typography>
              
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <Typography
                    variant="label"
                    className={`font-semibold ${
                      isGradientVariant ? "text-white" : ""
                    }`}
                  >
                    {testimonial.author}
                  </Typography>
                  {testimonial.role && (
                    <Typography
                      variant="caption"
                      className={isGradientVariant ? "text-white/70" : "text-muted-foreground"}
                    >
                      {testimonial.role}
                    </Typography>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );

    const renderMedia = () => {
      if (!image && !video) return null;
      
      return (
        <div className={`flex-1 ${
          !disableAnimations ? "animate-in slide-in-from-right-4 duration-700 delay-400" : ""
        }`}>
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          ) : image ? (
            <img
              src={image}
              alt="CTA visual"
              className="w-full h-auto rounded-lg shadow-2xl"
              loading="lazy"
            />
          ) : null}
        </div>
      );
    };

    return (
      <section
        ref={ref}
        className={`${ctaVariants({ variant, size })} ${animationClasses} ${className || ""}`}
        aria-label={ariaLabel || "Call to action section"}
        {...props}
      >
        {/* Background Pattern */}
        {backgroundPattern && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]" />
          </div>
        )}

        {/* Particles Effect */}
        {particles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-white/20 rounded-full ${
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
          {layout === "card" ? (
            <Card variant="elevated" className="p-8 md:p-12 max-w-4xl mx-auto">
              {renderContent()}
            </Card>
          ) : layout === "split" ? (
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                {renderContent()}
              </div>
              {renderMedia()}
            </div>
          ) : layout === "banner" ? (
            <div className="text-center py-8">
              {renderContent()}
            </div>
          ) : (
            renderContent()
          )}
        </div>

        {/* Decorative Elements */}
        {isGradientVariant && (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          </>
        )}
      </section>
    );
  }
);

CTA.displayName = "CTA";

export { CTA, ctaVariants };