/**
 * Global Type Definitions for NosytLabs - 2025
 * Comprehensive type safety for the entire application
 */

// Window extensions
declare global {
  interface Window {
    CSSBundleLoader?: any;
    OptimizedCSSLoader?: any;
    DynamicImportManager?: any;
    PerformanceMonitor?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: {
    basic?: number;
    premium?: number;
    enterprise?: number;
  };
}

// Performance Types
export interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export interface BundleMetrics {
  loadTimes: Map<string, number>;
  compressionRatios: Map<string, number>;
  dependencyGraph: Map<string, string[]>;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'default' | 'win95' | 'nosytlabs' | 'custom';

export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  customColors?: Record<string, string>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReport {
  error: AppError;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  data: T;
  timestamp: Date;
}

export type EventHandler<T = any> = (event: CustomEvent<T>) => void;

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// Export all types
export * from './components';
export * from './api';
export * from './theme';
export * from './performance';