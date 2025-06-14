/**
 * Unified Component Interface Standards - NosytLabs 2025
 * Standardized component interfaces following established patterns
 * 
 * @fileoverview Central type definitions for consistent component interfaces
 * @module types/unified-components
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

import { BaseComponentProps } from './global';

// ========== CORE COMPONENT STANDARDS ==========

/**
 * Standard component sizes following NosytLabs design system
 */
export type StandardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Standard component variants for consistent theming
 */
export type StandardVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'minimal';

/**
 * Standard theme options aligned with NosytLabs branding
 */
export type StandardTheme = 'default' | 'modern' | 'retro' | 'glassmorphism' | 'win95' | 'nosytlabs';

/**
 * Standard animation types for consistent motion design
 */
export type StandardAnimation = 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spin';

/**
 * Standard loading states for interactive components
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Responsive configuration following established breakpoint system
 */
export interface ResponsiveValue<T = number | string> {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// ========== ENHANCED BASE INTERFACES ==========

/**
 * Enhanced base props extending existing BaseComponentProps
 * Maintains backward compatibility while adding standardization
 */
export interface EnhancedBaseProps extends BaseComponentProps {
  /** Component variant for consistent theming */
  variant?: StandardVariant;
  /** Component size following design system */
  size?: StandardSize;
  /** Theme variant for specialized styling */
  theme?: StandardTheme;
  /** Loading state for interactive feedback */
  loading?: boolean;
  /** Disabled state for form controls */
  disabled?: boolean;
  /** Full width display option */
  fullWidth?: boolean;
  /** Animation type for motion design */
  animation?: StandardAnimation;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Test identifier for automated testing */
  testId?: string;
}

/**
 * Interactive component props for clickable elements
 */
export interface InteractiveProps extends EnhancedBaseProps {
  /** Click handler with proper typing */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Hover handler for enhanced interactions */
  onHover?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Focus handler for keyboard navigation */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Blur handler for form validation */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Keyboard handler for accessibility */
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

/**
 * Form component props for input elements
 */
export interface FormComponentProps extends EnhancedBaseProps {
  /** Field label for accessibility */
  label?: string;
  /** Error message for validation feedback */
  error?: string;
  /** Help text for user guidance */
  helpText?: string;
  /** Required field indicator */
  required?: boolean;
  /** Placeholder text for inputs */
  placeholder?: string;
  /** Field name for form submission */
  name?: string;
  /** Field value for controlled components */
  value?: string | number | boolean;
  /** Default value for uncontrolled components */
  defaultValue?: string | number | boolean;
}

/**
 * Layout component props for structural elements
 */
export interface LayoutComponentProps extends EnhancedBaseProps {
  /** Responsive column configuration */
  columns?: ResponsiveValue<number>;
  /** Gap size between elements */
  gap?: StandardSize | 'none';
  /** Alignment configuration */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justification configuration */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Padding configuration */
  padding?: StandardSize | 'none';
  /** Margin configuration */
  margin?: StandardSize | 'none';
}

/**
 * Media component props for images and videos
 */
export interface MediaComponentProps extends EnhancedBaseProps {
  /** Media source URL */
  src: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Media title for tooltips */
  title?: string;
  /** Aspect ratio configuration */
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9' | 'auto';
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  /** Lazy loading configuration */
  lazy?: boolean;
  /** Placeholder while loading */
  placeholder?: string;
}

// ========== COMPONENT-SPECIFIC INTERFACES ==========

/**
 * Navigation component props following established patterns
 */
export interface StandardNavigationProps extends EnhancedBaseProps {
  /** Current page path for active state */
  currentPath?: string;
  /** Mobile menu visibility */
  showMobileMenu?: boolean;
  /** Logo variant display */
  logoVariant?: 'full' | 'icon' | 'text';
  /** Retro mode for NosytOS compatibility */
  isRetroMode?: boolean;
  /** Navigation items configuration */
  items?: Array<{
    name: string;
    href: string;
    icon?: string;
    external?: boolean;
    children?: Array<{ name: string; href: string; icon?: string }>;
  }>;
}

/**
 * Hero section props following established patterns
 */
export interface StandardHeroProps extends EnhancedBaseProps {
  /** Hero title text */
  title?: string;
  /** Hero subtitle text */
  subtitle?: string;
  /** Hero description text */
  description?: string;
  /** Background image or video */
  background?: string;
  /** Call-to-action buttons */
  cta?: Array<{
    text: string;
    href: string;
    variant?: StandardVariant;
    icon?: string;
    external?: boolean;
  }>;
  /** Statistics display */
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  /** Layout variant */
  layout?: 'centered' | 'split' | 'minimal' | 'showcase';
}

/**
 * Card component props following established patterns
 */
export interface StandardCardProps extends EnhancedBaseProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Card image */
  image?: string;
  /** Card link destination */
  href?: string;
  /** External link indicator */
  external?: boolean;
  /** Featured card styling */
  featured?: boolean;
  /** Interactive hover effects */
  interactive?: boolean;
  /** Card badge text */
  badge?: string;
  /** Card tags */
  tags?: string[];
  /** Card metadata */
  metadata?: {
    date?: string;
    author?: string;
    category?: string;
    readTime?: string;
  };
}

// ========== UTILITY TYPES ==========

/**
 * Extract props from component type for composition
 */
export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;

/**
 * Make certain props required while keeping others optional
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Omit certain props from component interface
 */
export type OmitProps<T, K extends keyof T> = Omit<T, K>;

/**
 * Merge two component prop interfaces
 */
export type MergeProps<T, U> = T & U;

// ========== VALIDATION HELPERS ==========

/**
 * Component prop validation utilities
 */
export const ComponentValidation = {
  /** Validate size prop */
  isValidSize: (size: string): size is StandardSize => {
    return ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(size);
  },
  
  /** Validate variant prop */
  isValidVariant: (variant: string): variant is StandardVariant => {
    return ['primary', 'secondary', 'outline', 'ghost', 'minimal'].includes(variant);
  },
  
  /** Validate theme prop */
  isValidTheme: (theme: string): theme is StandardTheme => {
    return ['default', 'modern', 'retro', 'glassmorphism', 'win95', 'nosytlabs'].includes(theme);
  },
  
  /** Validate animation prop */
  isValidAnimation: (animation: string): animation is StandardAnimation => {
    return ['none', 'fade', 'slide', 'scale', 'bounce', 'spin'].includes(animation);
  }
} as const;

// Export all types for easy importing
export type {
  BaseComponentProps,
  EnhancedBaseProps,
  InteractiveProps,
  FormComponentProps,
  LayoutComponentProps,
  MediaComponentProps,
  StandardNavigationProps,
  StandardHeroProps,
  StandardCardProps
};
