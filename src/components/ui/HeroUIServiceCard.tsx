import { Card, CardBody } from "@heroui/react";
import { HeroUIButton } from "./HeroUIButton";

interface HeroUIServiceCardProps {
  title: string;
  description: string;
  features?: string[];
  price?: string;
  icon?: string;
  href?: string;
}

const iconMap: Record<string, string> = {
  "web-development":
    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  "mobile-development":
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  "ai-integration":
    "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z",
  code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
};

/**
 * Service Card using HeroUI components
 * Replaces the custom ServiceCard.astro with HeroUI-based implementation
 */
export function HeroUIServiceCard({
  title,
  description,
  features = [],
  price,
  icon = "code",
  href,
}: HeroUIServiceCardProps) {
  const iconPath = iconMap[icon] || iconMap["code"];
  const truncatedDescription =
    description.length > 150
      ? description.substring(0, 147) + "..."
      : description;
  const limitedFeatures = features.slice(0, 4);

  return (
    <Card
      isHoverable
      isPressable
      className="group h-full border-2 border-default-200/60 bg-gradient-to-br from-content1 via-content1/95 to-default-50/80 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
    >
      {/* Enhanced decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

      <CardBody className="relative z-10 flex flex-col gap-5 p-6 md:p-8 h-full">
        {/* Enhanced Icon */}
        <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-accent transition-colors duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path d={iconPath} />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-grow">
          {truncatedDescription}
        </p>

        {/* Features */}
        {limitedFeatures.length > 0 && (
          <ul className="space-y-3 my-5">
            {limitedFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm font-medium group/item"
              >
                <div className="flex-shrink-0 w-6 h-6 mt-0.5 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-foreground/95 group-hover/item:text-foreground transition-colors leading-snug pt-0.5">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        {price && (
          <div className="mt-8 pt-8 border-t-2 border-border/40">
            <p className="text-xs font-semibold text-muted-foreground mb-3 tracking-wide uppercase">Starting Price</p>
            <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent block mb-2">
              {price}
            </span>
            <p className="text-sm text-muted-foreground mt-2">Custom quotes available for all projects</p>
          </div>
        )}

        {/* CTA Button */}
        {href && (
          <HeroUIButton
            href={href}
            variant="gradient"
            className="w-full mt-4"
            size="lg"
            endContent={
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
          >
            Learn More
          </HeroUIButton>
        )}
      </CardBody>

      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
    </Card>
  );
}

export default HeroUIServiceCard;
