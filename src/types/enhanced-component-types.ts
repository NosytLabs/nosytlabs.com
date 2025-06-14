/**
 * Enhanced Component Props and Interfaces
 * Provides better type safety and component composition patterns
 * 
 * @fileoverview Enhanced component architecture types
 * @module types/enhanced-components
 * @version 2.0.0
 * @author NosytLabs Team
 */

import type { ReactNode, ComponentType } from 'react';

// ========== ENHANCED BASE TYPES ==========

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
 * Enhanced base props with better type safety
 */
export interface EnhancedComponentProps {
  /** Component identifier */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Component variant */
  variant?: ComponentVariant;
  /** Component size */
  size?: ComponentSize;
  /** Component state */
  state?: ComponentState;
  /** Accessibility props */
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// ========== BUSINESS DOMAIN TYPES ==========

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

// ========== SERVICE DOMAIN TYPES ==========

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
    icon: ComponentType<{ className?: string }>;
    backgroundGradient?: string;
    primaryColor?: string;
    image?: string;
  };
  seo: {
    slug: string;
    keywords: string[];
    metaDescription?: string;
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

// ========== FORM DOMAIN TYPES ==========

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'password' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  validation: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
  ui: {
    placeholder?: string;
    helpText?: string;
    icon?: ComponentType<{ className?: string }>;
    options?: Array<{ value: string; label: string }>;
    rows?: number; // for textarea
  };
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

// ========== CONTENT DOMAIN TYPES ==========

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

// ========== UI COMPOSITION TYPES ==========

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
 * Animation configuration
 */
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom';
  duration: number;
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Component composition props
 */
export interface ComposableProps extends EnhancedComponentProps {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  animate?: AnimationConfig;
  grid?: GridConfig;
}

// ========== ERROR HANDLING TYPES ==========

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
  fallback?: ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
  reportErrors?: boolean;
  retryable?: boolean;
}

// ========== ACCESSIBILITY TYPES ==========

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
