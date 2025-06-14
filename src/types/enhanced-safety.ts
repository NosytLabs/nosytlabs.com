/**
 * Enhanced Type Safety Definitions
 * Provides strict type definitions and utility types for better type safety
 * 
 * @fileoverview Enhanced TypeScript type definitions
 * @module types/enhanced-safety
 * @version 1.0.0
 * @author NosytLabs Team
 */

import type { ReactNode, HTMLAttributes } from 'react';

// ========== UTILITY TYPES ==========

/**
 * Make specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Strict string literals that prevent typos
 */
export type StrictString<T extends string> = T;

/**
 * Non-empty string type
 */
export type NonEmptyString = string & { readonly __brand: unique symbol };

/**
 * Positive number type
 */
export type PositiveNumber = number & { readonly __brand: unique symbol };

/**
 * Email string type
 */
export type EmailString = string & { readonly __brand: unique symbol };

/**
 * URL string type
 */
export type URLString = string & { readonly __brand: unique symbol };

/**
 * Safe object type that prevents any
 */
export type SafeObject = Record<string, unknown>;

/**
 * Async result type for better error handling
 */
export type AsyncResult<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

/**
 * Validation result type
 */
export type ValidationResult<T> = 
  | { valid: true; data: T; errors?: never }
  | { valid: false; data?: never; errors: ValidationError[] };

// ========== ERROR TYPES ==========

/**
 * Structured validation error
 */
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: SafeObject;
    timestamp: string;
    traceId?: string;
  };
  success: false;
}

/**
 * API success response structure
 */
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}

/**
 * Combined API response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ========== FORM TYPES ==========

/**
 * Form field state
 */
export interface FormFieldState<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

/**
 * Form state
 */
export interface FormState<T extends SafeObject> {
  fields: {
    [K in keyof T]: FormFieldState<T[K]>;
  };
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
  errors: ValidationError[];
}

/**
 * Form validation rules
 */
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  asyncValidation?: (value: T) => Promise<string | null>;
}

// ========== COMPONENT TYPES ==========

/**
 * Enhanced component props with strict typing
 */
export interface EnhancedBaseProps extends HTMLAttributes<HTMLElement> {
  /** Component identifier */
  id?: NonEmptyString;
  /** CSS class names */
  className?: string;
  /** Test identifier for testing */
  'data-testid'?: NonEmptyString;
  /** Accessibility label */
  'aria-label'?: NonEmptyString;
  /** Accessibility description */
  'aria-describedby'?: NonEmptyString;
}

/**
 * Component variant types with strict typing
 */
export type ComponentVariant = StrictString<
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
>;

/**
 * Component size types
 */
export type ComponentSize = StrictString<'xs' | 'sm' | 'md' | 'lg' | 'xl'>;

/**
 * Loading state type
 */
export type LoadingState = StrictString<'idle' | 'loading' | 'success' | 'error'>;

/**
 * Enhanced button props with strict typing
 */
export interface EnhancedButtonProps extends EnhancedBaseProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  disabled?: boolean;
  href?: URLString;
  external?: boolean;
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ========== DATA TYPES ==========

/**
 * Enhanced project type with strict validation
 */
export interface EnhancedProject {
  id: NonEmptyString;
  title: NonEmptyString;
  description: NonEmptyString;
  slug: NonEmptyString;
  status: StrictString<'planning' | 'in-progress' | 'completed' | 'on-hold'>;
  priority: StrictString<'low' | 'medium' | 'high' | 'urgent'>;
  tags: NonEmptyString[];
  technologies: NonEmptyString[];
  startDate: Date;
  endDate?: Date;
  estimatedHours?: PositiveNumber;
  actualHours?: PositiveNumber;
  budget?: PositiveNumber;
  client?: {
    name: NonEmptyString;
    email: EmailString;
    company?: NonEmptyString;
  };
  repository?: {
    url: URLString;
    branch?: NonEmptyString;
  };
  deployment?: {
    url: URLString;
    environment: StrictString<'development' | 'staging' | 'production'>;
  };
  images?: URLString[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enhanced service type
 */
export interface EnhancedService {
  id: NonEmptyString;
  name: NonEmptyString;
  description: NonEmptyString;
  slug: NonEmptyString;
  category: StrictString<
    | 'web-development'
    | 'mobile-development'
    | 'ai-integration'
    | 'consulting'
    | 'design'
    | 'maintenance'
  >;
  pricing: {
    type: StrictString<'fixed' | 'hourly' | 'custom'>;
    amount?: PositiveNumber;
    currency?: StrictString<'USD' | 'EUR' | 'GBP'>;
    description?: NonEmptyString;
  };
  duration?: {
    min: PositiveNumber;
    max: PositiveNumber;
    unit: StrictString<'hours' | 'days' | 'weeks' | 'months'>;
  };
  features: NonEmptyString[];
  technologies: NonEmptyString[];
  deliverables: NonEmptyString[];
  prerequisites?: NonEmptyString[];
  available: boolean;
  featured: boolean;
  order: PositiveNumber;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enhanced contact form data
 */
export interface EnhancedContactForm {
  name: NonEmptyString;
  email: EmailString;
  subject?: NonEmptyString;
  message: NonEmptyString;
  serviceType?: NonEmptyString;
  budget?: StrictString<
    | 'under-5k'
    | '5k-10k'
    | '10k-25k'
    | '25k-50k'
    | 'over-50k'
    | 'discuss'
  >;
  timeline?: StrictString<
    | 'asap'
    | '1-month'
    | '2-3-months'
    | '3-6-months'
    | 'flexible'
  >;
  referralSource?: StrictString<
    | 'search'
    | 'social'
    | 'referral'
    | 'advertising'
    | 'other'
  >;
  consent: true; // Must be true for GDPR compliance
  marketingOptIn?: boolean;
}

// ========== TYPE GUARDS ==========

/**
 * Type guard for non-empty string
 */
export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard for positive number
 */
export function isPositiveNumber(value: unknown): value is PositiveNumber {
  return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value);
}

/**
 * Type guard for valid email
 */
export function isEmailString(value: unknown): value is EmailString {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof value === 'string' && emailRegex.test(value);
}

/**
 * Type guard for valid URL
 */
export function isURLString(value: unknown): value is URLString {
  try {
    new URL(value as string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard for API success response
 */
export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard for API error response
 */
export function isApiErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}

// ========== VALIDATION UTILITIES ==========

/**
 * Create a non-empty string with validation
 */
export function createNonEmptyString(value: string): ValidationResult<NonEmptyString> {
  if (!isNonEmptyString(value)) {
    return {
      valid: false,
      errors: [{
        field: 'value',
        code: 'EMPTY_STRING',
        message: 'String cannot be empty',
        value,
      }],
    };
  }
  return { valid: true, data: value };
}

/**
 * Create a positive number with validation
 */
export function createPositiveNumber(value: number): ValidationResult<PositiveNumber> {
  if (!isPositiveNumber(value)) {
    return {
      valid: false,
      errors: [{
        field: 'value',
        code: 'INVALID_POSITIVE_NUMBER',
        message: 'Number must be positive',
        value,
      }],
    };
  }
  return { valid: true, data: value };
}

/**
 * Create an email string with validation
 */
export function createEmailString(value: string): ValidationResult<EmailString> {
  if (!isEmailString(value)) {
    return {
      valid: false,
      errors: [{
        field: 'value',
        code: 'INVALID_EMAIL',
        message: 'Invalid email format',
        value,
      }],
    };
  }
  return { valid: true, data: value };
}

/**
 * Create a URL string with validation
 */
export function createURLString(value: string): ValidationResult<URLString> {
  if (!isURLString(value)) {
    return {
      valid: false,
      errors: [{
        field: 'value',
        code: 'INVALID_URL',
        message: 'Invalid URL format',
        value,
      }],
    };
  }
  return { valid: true, data: value };
}

export default {
  // Type guards
  isNonEmptyString,
  isPositiveNumber,
  isEmailString,
  isURLString,
  isApiSuccessResponse,
  isApiErrorResponse,
  
  // Validation utilities
  createNonEmptyString,
  createPositiveNumber,
  createEmailString,
  createURLString,
};
