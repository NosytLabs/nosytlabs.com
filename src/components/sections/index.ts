// Section Components
export { Hero, heroVariants, type HeroProps } from './Hero';
export { Services, servicesVariants, type ServicesProps, type Service } from './Services';
export { Stats, statsVariants, type StatsProps, type Stat } from './Stats';
export { CTA, ctaVariants, type CTAProps } from './CTA';

// Re-export common types for convenience
export type {
  VariantProps
} from 'class-variance-authority';