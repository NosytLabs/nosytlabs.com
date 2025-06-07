/**
 * @fileoverview Types Barrel Export
 * 
 * Central export point for all TypeScript type definitions
 * to enable clean type imports across the application.
 * 
 * @module types
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

// ========== TYPE EXPORTS ==========
// Re-export all types from type definition files
export type * from './astro.d.ts';

// ========== COMMON TYPE DEFINITIONS ==========
// Define commonly used types for the application

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

/**
 * Common component props for Astro components
 */
export interface BaseComponentProps {
  class?: string;
  id?: string;
  'data-testid'?: string;
}

/**
 * Animation configuration type
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
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
 * Size variant type for components
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
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
