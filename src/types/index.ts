/**
 * @fileoverview Consolidated Types Barrel Export
 *
 * Central export point for all TypeScript type definitions,
 * ensuring a single source of truth and improved maintainability.
 *
 * @module types
 * @version 2.0.0
 * @author NosytLabs Team
 * @since 2025-06-16
 */


// Global types for the project
declare global {
  // Window extensions for NosytLabs utilities
  interface Window {
    NosytUtils?: any;
    NosytLabs?: any;
    announceToScreenReader?: (message: string) => void;
    formValidation?: any; // For EnhancedFormValidation
    enhancedEffects?: any; // For EnhancedEffects
    blogSystem?: any; // For BlogSystem
    testSentryError?: () => void; // For Sentry test button
  }
  
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_SITE_URL?: string;
      SUPABASE_URL?: string; // Added for Supabase config
      SUPABASE_ANON_KEY?: string; // Added for Supabase config
      SUPABASE_SERVICE_ROLE_KEY?: string; // Added for Supabase config
      DATABASE_URL?: string; // Added for Neon config
      POSTGRES_URL?: string; // Added for Neon config
    }
  }
}

// ========== COMMON TYPE DEFINITIONS ==========

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

/**
 * Base props that all components should extend
 */
export interface BaseComponentProps {
  class?: string;
  className?: string; // Added for consistency
  id?: string;
  'data-testid'?: string;
  style?: string; // Added for consistency
}

/**
 * Enhanced base props with common interactive features
 */
export interface EnhancedBaseProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

/**
 * Standardized variant system for consistent theming
 */
export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'minimal'
  | 'featured';

/**
 * Standardized size system
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Common states for interactive components
 */
export interface ComponentState {
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

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
 * Animation configuration type
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  type?: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom'; // Added type
  direction?: 'up' | 'down' | 'left' | 'right'; // Added direction
}

/**
 * Theme configuration type
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Responsive breakpoint type
 */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variant type for components
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Loading state type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Navigation item structure
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

/**
 * Project data structure
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  category?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

/**
 * Blog post data structure
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  tags: string[];
  featured?: boolean;
  image?: string;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  preferences?: UserPreferences;
}

/**
 * User preferences structure
 */
export interface UserPreferences {
  theme: Theme;
  language: string;
  notifications: boolean;
  animations: boolean;
}

/**
 * Form field configuration
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'tel' | 'url' | 'file'; // Added tel, url, file
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: string | RegExp; // Changed to allow RegExp
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null; // Added custom validation
  };
  helpText?: string; // Added helpText
  icon?: string; // Added icon
  rows?: number; // Added for textarea
  cols?: number; // Added for textarea
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'; // Added for textarea
}

/**
 * SEO metadata structure
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
}

/**
 * Standard layout component props
 */
export interface LayoutProps extends BaseComponentProps {
  columns?: ResponsiveValue<number>;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Props for interactive components (buttons, links, etc.)
 */
export interface InteractiveProps extends EnhancedBaseProps {
  onClick?: () => void;
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  external?: boolean;
  download?: string;
}

/**
 * Props for form components
 */
export interface FormProps extends EnhancedBaseProps {
  name?: string;
  value?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  help?: string;
  label?: string;
}

/**
 * Props for card components
 */
export interface CardProps extends EnhancedBaseProps {
  title?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  hoverable?: boolean;
  theme?: 'default' | 'glass' | 'dark' | 'gradient';
}

/**
 * Props for navigation components
 */
export interface NavigationProps extends EnhancedBaseProps {
  currentPath?: string;
  showMobileMenu?: boolean;
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
    href?: string;
  };
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
  isRetroMode?: boolean;
}

/**
 * Props for hero section components
 */
export interface HeroProps extends EnhancedBaseProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: {
    type: 'image' | 'video' | 'gradient' | 'pattern';
    src?: string;
    overlay?: boolean;
    opacity?: number;
  };
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  animation?: {
    enabled: boolean;
    type?: 'fade' | 'slide' | 'scale' | 'bounce';
    delay?: number;
    duration?: number;
  };
}

/**
 * Props for animated components
 */
export interface AnimationProps extends BaseComponentProps {
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' | 'bounce' | 'spin';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

/**
 * Props for image components
 */
export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  srcset?: string;
  placeholder?: string;
  fallback?: string;
}

/**
 * Error boundary state
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: {
    componentStack: string;
    timestamp: Date;
    userAgent?: string;
  };
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  fallback?: any; // ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
  reportErrors?: boolean;
  retryable?: boolean;
}

/**
 * Accessibility requirements
 */
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
  tabIndex?: number;
}

/**
 * Keyboard navigation support
 */
export interface KeyboardNavigationProps {
  onKeyDown?: (event: KeyboardEvent) => void;
  focusable?: boolean;
  focusOnMount?: boolean;
  returnFocus?: boolean;
}

/**
 * Form submission data
 */
export interface FormSubmission {
  id: string;
  formType: string;
  data: Record<string, any>;
  metadata: {
    submittedAt: Date;
    userAgent?: string;
    referrer?: string;
    source?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * Content item with rich metadata
 */
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: 'blog' | 'case-study' | 'tutorial' | 'news' | 'project';
  status: 'draft' | 'published' | 'archived';
  metadata: {
    publishedAt?: Date;
    updatedAt: Date;
    author: string;
    tags: string[];
    categories: string[];
    readingTime?: number;
    featured?: boolean;
  };
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords: string[];
  };
  media: {
    featuredImage?: string;
    gallery?: string[];
    video?: string;
  };
}

/**
 * Service category enumeration
 */
export type ServiceCategory =
  | 'web-development'
  | 'mobile-development'
  | 'ai-integration'
  | 'consulting'
  | 'design'
  | 'automation'
  | 'maintenance';

/**
 * Project status types
 */
export type ProjectStatus =
  | 'planning'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'on-hold';

/**
 * Priority levels
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Service item with enhanced type safety
 */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ServiceCategory;
  features: string[];
  pricing: {
    startingPrice: number;
    currency: 'USD' | 'EUR' | 'GBP';
    priceLabel: string;
    priceType: 'fixed' | 'hourly' | 'project';
  };
  timeline: {
    min: number;
    max: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
    label: string;
  };
  metadata: {
    popular?: boolean;
    featured?: boolean;
    new?: boolean;
    comingSoon?: boolean;
  };
  links: {
    href: string;
    cta: string;
    external?: boolean;
  };
  visual: {
    icon: any; // ComponentType<{ className?: string }>;
    backgroundGradient?: string;
    primaryColor?: string;
    image?: string;
  };
  seo: {
    slug: string;
    keywords: string[];
    metaDescription?: string;
    ogImage?: string;
  };
}

/**
 * Service collection with filtering and sorting
 */
export interface ServiceCollection {
  services: ServiceItem[];
  categories: ServiceCategory[];
  filters: {
    category?: ServiceCategory;
    priceRange?: [number, number];
    timeline?: [number, number];
    features?: string[];
  };
  sorting: {
    field: keyof ServiceItem;
    direction: 'asc' | 'desc';
  };
}

/**
 * Grid layout configuration
 */
export interface GridConfig {
  columns: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap: ComponentSize;
  autoRows?: string;
}

/**
 * Component composition props
 */
export interface ComposableProps extends EnhancedBaseProps {
  children?: any; // ReactNode;
  as?: any; // keyof JSX.IntrinsicElements | ComponentType<any>;
  animate?: AnimationConfig;
  grid?: GridConfig;
}
