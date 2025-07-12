import { type ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import { Icon } from "@/components/ui/icon";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[24rem] grid-responsive gap-6 place-content-start container-query-section",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  iconName,
  description,
  cta,
  price,
  timeline,
  features,
  onClick,
}: {
  name: string;
  className: string;
  background: ReactNode;
  iconName: string;
  description: string;
  cta: string;
  price: string;
  timeline: string;
  features: string[];
  onClick?: () => void;
}) => (
  <div
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
      // light styles
      "bg-white backdrop-blur-glass [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      // Enhanced hover effects with vibrant colors
      "nosyt-card-hover transition-all duration-300 ease-out",
      "hover:shadow-[0_20px_40px_-5px_rgba(0,123,255,0.15)] dark:hover:shadow-[0_20px_40px_-5px_rgba(0,123,255,0.25)]",
      "hover:border-brand-blue-200 dark:hover:border-brand-blue-400/30",
      className,
    )}
    onClick={onClick}
  >
    {background}
    
    {/* Enhanced gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-500/0 via-brand-ethereal-500/0 to-brand-orange-500/0 transition-all duration-500 group-hover:from-brand-blue-500/5 group-hover:via-brand-ethereal-500/3 group-hover:to-brand-orange-500/5 pointer-events-none" />
    
    {/* Main content */}
    <div className="z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-2 pointer-events-none">
      <Icon
        name={iconName}
        size={48}
        className="origin-left transform-gpu text-neutral-700 dark:text-neutral-300 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-brand-blue-500 nosyt-icon-bounce"
      />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 transition-colors duration-300 group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400 transition-colors duration-300 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">{description}</p>
    </div>
    
    {/* Enhanced pricing and features section */}
    <div className="z-10 flex transform-gpu flex-col gap-4 p-6 transition-all duration-300 group-hover:translate-y-1 pointer-events-none">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400">
          {price}
        </div>
        <div className="flex items-center gap-1 text-brand-orange-500 text-sm font-semibold transition-all duration-300 group-hover:text-brand-orange-600 group-hover:scale-105">
          <Icon name="clock" size={16} className="transition-transform duration-300 group-hover:rotate-12" />
          {timeline}
        </div>
      </div>
      <ul className="space-y-2" role="list">
        {features.map((feature, index) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:text-gray-800 dark:group-hover:text-gray-200"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Icon
              name="checkCircle"
              size={16}
              className="text-brand-green-500 flex-shrink-0 transition-all duration-300 group-hover:text-brand-green-400 group-hover:scale-110"
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>

    {/* Enhanced CTA button with vibrant styling */}
    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none",
      )}
    >
      <div className="rounded-full bg-gradient-to-r from-brand-blue-500 to-brand-ethereal-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:from-brand-blue-600 hover:to-brand-ethereal-600 hover:shadow-[0_8px_25px_-5px_rgba(0,123,255,0.4)] min-h-[44px] min-w-[44px] flex items-center justify-center pointer-events-none nosyt-button-vibrant">
        {cta}
      </div>
    </div>
    
    {/* Enhanced overlay with subtle color shift */}
    <div className="absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-brand-blue-500/[0.02] group-hover:via-transparent group-hover:to-brand-ethereal-500/[0.02] pointer-events-none" />
  </div>
);

export { BentoCard, BentoGrid };
