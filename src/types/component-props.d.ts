/**
 * Standardized Component Props Interface System
 * Ensures consistent prop patterns across all components
 * 
 * @fileoverview Component prop type definitions for NosytLabs
 * @module types/component-props
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

// ========== BASE COMPONENT PROPS ==========

/**
 * Base props that all components should extend
 */
export interface BaseComponentProps {
  /** Additional CSS classes */
  class?: string;
  /** Component ID */
  id?: string;
  /** Test identifier for automated testing */
  'data-testid'?: string;
  /** Inline styles */
  style?: string;
}

/**
 * Enhanced base props with common interactive features
 */
export interface EnhancedBaseProps extends BaseComponentProps {
  /** Component variant for theming */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'minimal';
  /** Component size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Accessibility label */
  'aria-label'?: string;
}

// ========== LAYOUT COMPONENT PROPS ==========

/**
 * Responsive value type for layout properties
 */
export type ResponsiveValue<T> = T | {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Standard layout component props
 */
export interface LayoutProps extends BaseComponentProps {
  /** Responsive column configuration */
  columns?: ResponsiveValue<number>;
  /** Gap size between elements */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Alignment configuration */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justification configuration */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Padding configuration */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Margin configuration */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// ========== INTERACTIVE COMPONENT PROPS ==========

/**
 * Props for interactive components (buttons, links, etc.)
 */
export interface InteractiveProps extends EnhancedBaseProps {
  /** Click handler */
  onClick?: () => void;
  /** Hover state */
  hover?: boolean;
  /** Focus state */
  focus?: boolean;
  /** Active state */
  active?: boolean;
  /** External link indicator */
  external?: boolean;
  /** Download attribute for links */
  download?: string;
}

/**
 * Props for form components
 */
export interface FormProps extends EnhancedBaseProps {
  /** Field name */
  name?: string;
  /** Field value */
  value?: string | number | boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Required field indicator */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Help text */
  help?: string;
  /** Field label */
  label?: string;
}

// ========== CONTENT COMPONENT PROPS ==========

/**
 * Props for card components
 */
export interface CardProps extends EnhancedBaseProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Card image */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Card actions */
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  /** Hover effects */
  hoverable?: boolean;
  /** Card theme */
  theme?: 'default' | 'glass' | 'dark' | 'gradient';
}

/**
 * Props for navigation components
 */
export interface NavigationProps extends EnhancedBaseProps {
  /** Current page path for active state */
  currentPath?: string;
  /** Mobile menu visibility */
  showMobileMenu?: boolean;
  /** Logo configuration */
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
    href?: string;
  };
  /** Navigation items */
  items?: Array<{
    name: string;
    href: string;
    icon?: string;
    external?: boolean;
    children?: Array<{
      name: string;
      href: string;
      icon?: string;
    }>;
  }>;
  /** Retro mode for NosytOS compatibility */
  isRetroMode?: boolean;
}

/**
 * Props for hero section components
 */
export interface HeroProps extends EnhancedBaseProps {
  /** Hero title */
  title?: string;
  /** Hero subtitle */
  subtitle?: string;
  /** Hero description */
  description?: string;
  /** Background configuration */
  background?: {
    type: 'image' | 'video' | 'gradient' | 'pattern';
    src?: string;
    overlay?: boolean;
    opacity?: number;
  };
  /** Call-to-action buttons */
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  /** Animation configuration */
  animation?: {
    enabled: boolean;
    type?: 'fade' | 'slide' | 'scale' | 'bounce';
    delay?: number;
    duration?: number;
  };
}

// ========== ANIMATION COMPONENT PROPS ==========

/**
 * Props for animated components
 */
export interface AnimationProps extends BaseComponentProps {
  /** Animation type */
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' | 'bounce' | 'spin';
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Intersection observer threshold */
  threshold?: number;
  /** Run animation only once */
  once?: boolean;
  /** Stagger children animations */
  stagger?: boolean;
  /** Stagger delay between children */
  staggerDelay?: number;
}

// ========== MEDIA COMPONENT PROPS ==========

/**
 * Props for image components
 */
export interface ImageProps extends BaseComponentProps {
  /** Image source */
  src: string;
  /** Alt text */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Lazy loading */
  loading?: 'lazy' | 'eager';
  /** Object fit */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Responsive sizes */
  sizes?: string;
  /** Source set for responsive images */
  srcset?: string;
  /** Placeholder while loading */
  placeholder?: string;
  /** Error fallback */
  fallback?: string;
}

// ========== UTILITY TYPES ==========

/**
 * Extract props from a component type
 */
export type ComponentProps<T> = T extends (props: infer P) => any ? P : never;

/**
 * Make certain props required
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make certain props optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Merge two prop types
 */
export type MergeProps<T, U> = Omit<T, keyof U> & U;

// ========== PROP VALIDATION HELPERS ==========

/**
 * Validation utilities for component props
 */
export const PropValidators = {
  /** Validate size prop */
  isValidSize: (size: string): size is 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    return ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(size);
  },
  
  /** Validate variant prop */
  isValidVariant: (variant: string): variant is 'primary' | 'secondary' | 'outline' | 'ghost' | 'minimal' => {
    return ['primary', 'secondary', 'outline', 'ghost', 'minimal'].includes(variant);
  },
  
  /** Validate animation prop */
  isValidAnimation: (animation: string): animation is 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' | 'bounce' | 'spin' => {
    return ['fade-in', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom-in', 'zoom-out', 'bounce', 'spin'].includes(animation);
  },
  
  /** Validate gap prop */
  isValidGap: (gap: string): gap is 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    return ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(gap);
  }
} as const;

// Export all types for easy importing
export type {
  BaseComponentProps,
  EnhancedBaseProps,
  LayoutProps,
  InteractiveProps,
  FormProps,
  CardProps,
  NavigationProps,
  HeroProps,
  AnimationProps,
  ImageProps,
  ResponsiveValue
};
