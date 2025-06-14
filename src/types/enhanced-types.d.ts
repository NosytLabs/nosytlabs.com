/**
 * Enhanced Type Definitions for NosytLabs
 * Comprehensive type system for better code quality and developer experience
 */

// ========== UTILITY TYPES ==========

/** Make all properties of T optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Make all properties of T required recursively */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/** Extract keys of T that are of type U */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/** Make specific keys K of T optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific keys K of T required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Create a union of all possible paths through an object */
export type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/** Get the type at a specific path in an object */
export type PathValue<T, P extends Paths<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Paths<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

// ========== BRANDED TYPES ==========

/** Create a branded type for better type safety */
export type Brand<T, B> = T & { __brand: B };

export type EmailAddress = Brand<string, 'EmailAddress'>;
export type PhoneNumber = Brand<string, 'PhoneNumber'>;
export type URL = Brand<string, 'URL'>;
export type HexColor = Brand<string, 'HexColor'>;
export type Timestamp = Brand<number, 'Timestamp'>;
export type UserId = Brand<string, 'UserId'>;
export type SessionId = Brand<string, 'SessionId'>;

// ========== RESULT TYPES ==========

/** Result type for operations that can fail */
export type Result<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

/** Async result type */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/** Option type for values that may not exist */
export type Option<T> = T | null | undefined;

/** Non-null option type */
export type Some<T> = NonNullable<T>;

// ========== API TYPES ==========

/** Standard API response structure */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Timestamp;
    requestId: string;
    version: string;
  };
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** API request configuration */
export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// ========== COMPONENT TYPES ==========

/** Base props for all components */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  style?: React.CSSProperties | string;
}

/** Props for components that can be disabled */
export interface DisableableProps {
  disabled?: boolean;
  loading?: boolean;
}

/** Props for components with variants */
export interface VariantProps<T extends string = string> {
  variant?: T;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/** Props for interactive components */
export interface InteractiveProps extends BaseComponentProps, DisableableProps {
  onClick?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  tabIndex?: number;
  role?: string;
}

// ========== FORM TYPES ==========

/** Form field configuration */
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: T) => string | null;
  };
  options?: Array<{ label: string; value: any }>;
}

/** Form validation result */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}

/** Form state */
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<keyof T, string[]>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// ========== PERFORMANCE TYPES ==========

/** Core Web Vitals metrics */
export interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

/** Performance thresholds */
export interface PerformanceThresholds {
  good: number;
  needsImprovement: number;
  poor: number;
}

/** Performance score */
export interface PerformanceScore {
  overall: number;
  metrics: Record<keyof CoreWebVitals, {
    value: number;
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }>;
}

// ========== ACCESSIBILITY TYPES ==========

/** ARIA attributes */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-pressed'?: boolean;
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-selected'?: boolean;
  role?: string;
}

/** Accessibility compliance levels */
export type AccessibilityLevel = 'A' | 'AA' | 'AAA';

/** Accessibility audit result */
export interface AccessibilityAudit {
  level: AccessibilityLevel;
  violations: Array<{
    rule: string;
    severity: 'minor' | 'moderate' | 'serious' | 'critical';
    element: string;
    message: string;
    helpUrl?: string;
  }>;
  passes: number;
  incomplete: number;
}

// ========== THEME TYPES ==========

/** Color palette */
export interface ColorPalette {
  primary: {
    50: HexColor;
    100: HexColor;
    200: HexColor;
    300: HexColor;
    400: HexColor;
    500: HexColor;
    600: HexColor;
    700: HexColor;
    800: HexColor;
    900: HexColor;
  };
  secondary: ColorPalette['primary'];
  gray: ColorPalette['primary'];
  success: HexColor;
  warning: HexColor;
  error: HexColor;
  info: HexColor;
}

/** Typography scale */
export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

/** Spacing scale */
export interface SpacingScale {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

/** Complete theme configuration */
export interface ThemeConfig {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// ========== ANALYTICS TYPES ==========

/** Analytics event */
export interface AnalyticsEvent {
  name: string;
  category: 'user_interaction' | 'performance' | 'error' | 'business';
  properties?: Record<string, any>;
  timestamp: Timestamp;
  userId?: UserId;
  sessionId: SessionId;
}

/** User session data */
export interface UserSession {
  id: SessionId;
  userId?: UserId;
  startTime: Timestamp;
  lastActivity: Timestamp;
  pageViews: number;
  events: AnalyticsEvent[];
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    os: string;
    browser: string;
    screenResolution: string;
  };
  location?: {
    country: string;
    region: string;
    city: string;
  };
}

// ========== CONTENT TYPES ==========

/** SEO metadata */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: URL;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: URL;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  structuredData?: Record<string, any>;
}
