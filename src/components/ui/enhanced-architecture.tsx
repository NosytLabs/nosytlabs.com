import React from "react";
import { cn } from "@/lib/utils";
import type { ResponsiveValue } from "@/types/component-props";

// ========== SERVICE CARD ARCHITECTURE ==========

/**
 * Service item data structure - extracted for reusability
 */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  price: string;
  timeline: string;
  popular?: boolean;
  className?: string;
  backgroundGradient?: string;
  category?: 'development' | 'design' | 'consulting' | 'automation';
}

/**
 * Props for individual service cards
 */
interface ServiceCardProps {
  service: ServiceItem;
  variant?: 'default' | 'featured' | 'minimal';
  onClick?: (service: ServiceItem) => void;
  className?: string;
  [key: string]: any; // Allow spreading of other props
}

/**
 * Reusable Service Card Component
 * Extracted from NosytLabsBentoServices for better modularity
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  variant = 'default',
  onClick,
  className,
  ...props
}) => {
  const {
    name,
    description,
    icon: Icon,
    features,
    price,
    timeline,
    popular,
    backgroundGradient
  } = service;

  const handleClick = () => {
    onClick?.(service);
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-xl overflow-hidden",
        "border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        variant === 'featured' && "ring-2 ring-orange-500",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* Background */}
      <div className={cn(
        "absolute inset-0 opacity-60",
        backgroundGradient || "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
      )} />

      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <div className="nosyt-badge-sm">
            <Star className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="nosyt-icon-circle-sm">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 mb-4">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing and Timeline */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeline}
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {price}
          </div>
        </div>

        {/* CTA Button */}
        <button className="nosyt-btn-secondary w-full">
          {service.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

// ========== SERVICES GRID COMPONENT ==========

interface ServicesGridProps {
  services: ServiceItem[];
  columns?: ResponsiveValue<number>;
  onServiceClick?: (service: ServiceItem) => void;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  className?: string;
  [key: string]: any; // Allow spreading of other props
}

/**
 * Reusable Services Grid Component
 * Replaces the monolithic NosytLabsBentoServices component
 */
export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  columns = { default: 1, md: 2, lg: 3 },
  onServiceClick,
  title = "Our Services",
  subtitle = "Professional development solutions for your business",
  showHeader = true,
  className,
  ...props
}) => {
  return (
    <section className={cn("py-24 nosyt-gradient-section", className)} {...props}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="nosyt-badge mb-6">
              <Zap className="w-4 h-4" />
              {title}
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Professional Development Solutions
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div className={cn(
          "grid gap-6",
          // Responsive grid classes based on columns prop
          typeof columns === 'number' 
            ? `grid-cols-${columns}`
            : `grid-cols-1 md:grid-cols-${columns.md || 2} lg:grid-cols-${columns.lg || 3}`
        )}>          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              {...(onServiceClick && { onClick: onServiceClick })}
              variant={service.popular ? 'featured' : 'default'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ========== FORM FIELD ARCHITECTURE ==========

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  options?: { value: string; label: string }[];
  error?: string;
  helpText?: string;
  className?: string;
  [key: string]: any; // Allow spreading of other props
}

/**
 * Reusable Form Field Component
 * Standardizes form field patterns across the application
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  icon: Icon,
  options,
  error,
  helpText,
  className,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const fieldClasses = cn(
    "w-full pr-4 py-3 border rounded-lg transition-colors",
    "focus:ring-2 focus:ring-nosyt-purple focus:border-transparent",
    "dark:bg-gray-800 dark:border-nosyt-purple/30",
    Icon ? "pl-10" : "pl-4",
    error ? "border-red-500 focus:ring-red-500" : "border-nosyt-purple/20"
  );

  return (
    <div className={cn("form-group", className)} {...props}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={cn(fieldClasses, "min-h-[120px] resize-vertical")}
            rows={4}
          />
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={fieldClasses}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={fieldClasses}
          />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

// Export icons used by components
import { Zap, Star, CheckCircle, Clock, ArrowRight } from "lucide-react";
