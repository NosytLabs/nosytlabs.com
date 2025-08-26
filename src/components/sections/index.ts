// Section Components
export { OptimizedServices, type OptimizedServicesProps } from './OptimizedServices';
export { ServiceCard, type ServiceCardProps } from './ServiceCard';
export { OptimizedStats, type OptimizedStatsProps } from './OptimizedStats';
export { StatItem, type StatItemProps } from './StatItem';
export { CTA, ctaVariants, type CTAProps } from './CTA';

// Re-export common types for convenience
export type {
  VariantProps
} from 'class-variance-authority';

// Export types that were previously exported from the deleted files
export type { Service } from './OptimizedServices';
export type { Stat } from './OptimizedStats';