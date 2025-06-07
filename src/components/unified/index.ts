/**
 * Unified Components Index for NosytLabs - 2025 Refactored
 * Centralized exports for all unified components
 * Provides clean import paths and better tree-shaking
 */

// Core unified components
export { default as Navigation } from './Navigation.astro';
export { default as HeroSection } from './HeroSection.astro';
export { default as Card } from './Card.astro';

// Import for default export
import NavigationComponent from './Navigation.astro';
import HeroSectionComponent from './HeroSection.astro';
import CardComponent from './Card.astro';

// Component type definitions for TypeScript support
export interface NavigationProps {
  currentPath?: string;
  variant?: 'modern' | 'retro' | 'minimal';
  isRetroMode?: boolean;
  className?: string;
  showMobileMenu?: boolean;
  logoVariant?: 'full' | 'icon' | 'text';
}

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'showcase';
  layout?: 'standard' | 'full-height' | 'compact';
  backgroundImage?: string;
  backgroundVideo?: string;
  showParticles?: boolean;
  showFloatingElements?: boolean;
  primaryCTA?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
    external?: boolean;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
    external?: boolean;
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  showStats?: boolean;
  className?: string;
  theme?: 'light' | 'dark' | 'gradient';
  animationStyle?: 'fade' | 'slide' | 'scale' | 'none';
}

export interface CardProps {
  title: string;
  description?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  icon?: string;
  variant?: 'default' | 'service' | 'project' | 'blog' | 'feature' | 'stat';
  layout?: 'vertical' | 'horizontal' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expandable?: boolean;
  flippable?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  badge?: {
    text: string;
    variant?: 'new' | 'hot' | 'featured' | 'coming-soon';
  };
  category?: string;
  tags?: string[];
  stats?: Array<{
    label: string;
    value: string;
  }>;
  primaryAction?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
    external?: boolean;
  };
  secondaryAction?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
    external?: boolean;
  };
  className?: string;
  theme?: 'light' | 'dark' | 'gradient' | 'glass';
  borderColor?: string;
  date?: string;
  author?: string;
  readTime?: string;
}

// Component composition helpers
export const createServiceCard = (props: Partial<CardProps>) => ({
  variant: 'service' as const,
  hoverable: true,
  theme: 'glass' as const,
  ...props
});

export const createProjectCard = (props: Partial<CardProps>) => ({
  variant: 'project' as const,
  hoverable: true,
  clickable: true,
  theme: 'glass' as const,
  ...props
});

export const createBlogCard = (props: Partial<CardProps>) => ({
  variant: 'blog' as const,
  hoverable: true,
  clickable: true,
  layout: 'vertical' as const,
  ...props
});

export const createFeatureCard = (props: Partial<CardProps>) => ({
  variant: 'feature' as const,
  hoverable: true,
  theme: 'gradient' as const,
  ...props
});

export const createStatCard = (props: Partial<CardProps>) => ({
  variant: 'stat' as const,
  size: 'sm' as const,
  theme: 'glass' as const,
  ...props
});

// Layout composition helpers
export const createHeroWithStats = (props: Partial<HeroSectionProps>) => ({
  variant: 'default' as const,
  showStats: true,
  showParticles: true,
  showFloatingElements: true,
  theme: 'gradient' as const,
  ...props
});

export const createSplitHero = (props: Partial<HeroSectionProps>) => ({
  variant: 'split' as const,
  layout: 'standard' as const,
  showParticles: true,
  theme: 'gradient' as const,
  ...props
});

export const createMinimalHero = (props: Partial<HeroSectionProps>) => ({
  variant: 'minimal' as const,
  layout: 'compact' as const,
  showParticles: false,
  showFloatingElements: false,
  theme: 'light' as const,
  ...props
});

// Navigation composition helpers
export const createModernNavigation = (props: Partial<NavigationProps>) => ({
  variant: 'modern' as const,
  showMobileMenu: true,
  logoVariant: 'full' as const,
  ...props
});

export const createRetroNavigation = (props: Partial<NavigationProps>) => ({
  variant: 'retro' as const,
  isRetroMode: true,
  logoVariant: 'text' as const,
  ...props
});

export const createMinimalNavigation = (props: Partial<NavigationProps>) => ({
  variant: 'minimal' as const,
  logoVariant: 'icon' as const,
  ...props
});

// Utility functions for component management
export const getComponentVariants = () => ({
  navigation: ['modern', 'retro', 'minimal'],
  hero: ['default', 'centered', 'split', 'minimal', 'showcase'],
  card: ['default', 'service', 'project', 'blog', 'feature', 'stat']
});

export const getComponentThemes = () => ({
  navigation: ['light', 'dark'],
  hero: ['light', 'dark', 'gradient'],
  card: ['light', 'dark', 'gradient', 'glass']
});

export const getComponentSizes = () => ({
  card: ['sm', 'md', 'lg', 'xl'],
  hero: ['compact', 'standard', 'full-height']
});

// Component validation helpers
export const validateNavigationProps = (props: NavigationProps): boolean => {
  const validVariants = getComponentVariants().navigation;
  return !props.variant || validVariants.includes(props.variant);
};

export const validateHeroProps = (props: HeroSectionProps): boolean => {
  const validVariants = getComponentVariants().hero;
  const validThemes = getComponentThemes().hero;
  
  return (
    (!props.variant || validVariants.includes(props.variant)) &&
    (!props.theme || validThemes.includes(props.theme))
  );
};

export const validateCardProps = (props: CardProps): boolean => {
  const validVariants = getComponentVariants().card;
  const validThemes = getComponentThemes().card;
  const validSizes = getComponentSizes().card;
  
  return (
    (!props.variant || validVariants.includes(props.variant)) &&
    (!props.theme || validThemes.includes(props.theme)) &&
    (!props.size || validSizes.includes(props.size))
  );
};

// Component factory functions
export class ComponentFactory {
  static createCard(type: 'service' | 'project' | 'blog' | 'feature' | 'stat', props: Partial<CardProps>) {
    const factories = {
      service: createServiceCard,
      project: createProjectCard,
      blog: createBlogCard,
      feature: createFeatureCard,
      stat: createStatCard
    };
    
    return factories[type](props);
  }
  
  static createHero(type: 'default' | 'split' | 'minimal', props: Partial<HeroSectionProps>) {
    const factories = {
      default: createHeroWithStats,
      split: createSplitHero,
      minimal: createMinimalHero
    };
    
    return factories[type](props);
  }
  
  static createNavigation(type: 'modern' | 'retro' | 'minimal', props: Partial<NavigationProps>) {
    const factories = {
      modern: createModernNavigation,
      retro: createRetroNavigation,
      minimal: createMinimalNavigation
    };
    
    return factories[type](props);
  }
}

// Component registry for dynamic loading
export const ComponentRegistry = {
  navigation: {
    modern: () => import('./Navigation.astro'),
    retro: () => import('./Navigation.astro'),
    minimal: () => import('./Navigation.astro')
  },
  hero: {
    default: () => import('./HeroSection.astro'),
    centered: () => import('./HeroSection.astro'),
    split: () => import('./HeroSection.astro'),
    minimal: () => import('./HeroSection.astro'),
    showcase: () => import('./HeroSection.astro')
  },
  card: {
    default: () => import('./Card.astro'),
    service: () => import('./Card.astro'),
    project: () => import('./Card.astro'),
    blog: () => import('./Card.astro'),
    feature: () => import('./Card.astro'),
    stat: () => import('./Card.astro')
  }
};

// Performance monitoring
export const ComponentMetrics = {
  trackComponentUsage: (componentName: string, variant: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_usage', {
        component_name: componentName,
        component_variant: variant,
        event_category: 'UI Components'
      });
    }
  },
  
  trackComponentPerformance: (componentName: string, loadTime: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_performance', {
        component_name: componentName,
        load_time: loadTime,
        event_category: 'Performance'
      });
    }
  }
};

// Export all for convenience
export default {
  Navigation: NavigationComponent,
  HeroSection: HeroSectionComponent,
  Card: CardComponent,
  ComponentFactory,
  ComponentRegistry,
  ComponentMetrics,
  createServiceCard,
  createProjectCard,
  createBlogCard,
  createFeatureCard,
  createStatCard,
  createHeroWithStats,
  createSplitHero,
  createMinimalHero,
  createModernNavigation,
  createRetroNavigation,
  createMinimalNavigation
};
