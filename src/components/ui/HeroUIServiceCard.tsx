import React from "react";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { getServiceIcon } from "@/lib/icons/serviceIcons";

interface HeroUIServiceCardProps {
  title: string;
  description: string;
  features: string[];
  price?: string;
  icon?: string;
  href: string;
}

export const HeroUIServiceCard: React.FC<HeroUIServiceCardProps> = ({
  title,
  description,
  features,
  price,
  icon,
  href,
}) => {
  return (
    <Card
      className="w-full h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/30 group"
      isPressable
    >
      <CardBody className="p-8 md:p-10 relative overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon with enhanced styling */}
        <div className="w-16 h-16 md:w-[72px] md:h-[72px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
          <div className="text-primary text-3xl">{getServiceIcon(icon)}</div>
          {/* Pulse effect on hover */}
          <div className="absolute inset-0 bg-primary/20 rounded-xl scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>

        {/* Title with hover effect */}
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 relative z-10">
          {title}
          {/* Underline animation */}
          <div className="h-0.5 bg-gradient-to-r from-primary to-accent mt-1 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </h3>

        {/* Description */}
        <p className="text-default-600 mb-4 line-clamp-3 leading-relaxed relative z-10">
          {description}
        </p>

        {/* Enhanced features list */}
        <div className="space-y-3 mb-6 relative z-10">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm group/item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-2 h-2 bg-success rounded-full group-hover/item:scale-125 transition-transform duration-200" />
              <span className="text-default-600 group-hover/item:text-foreground transition-colors duration-200">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Enhanced price display */}
        {price && (
          <div className="mb-6 relative z-10">
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {price}
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter className="p-8 md:p-10 pt-0 relative z-10">
        <a
          href={href}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-xl transition-all duration-300 group/btn min-h-[48px]"
        >
          Learn More
          <svg
            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200"
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
        </a>
      </CardFooter>
    </Card>
  );
};
