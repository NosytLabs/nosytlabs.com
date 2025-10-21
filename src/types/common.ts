/**
 * Common Type Definitions
 * 
 * Shared types used across multiple modules in the application.
 * 
 * @module types/common
 */

// ========================================
// BASIC TYPES
// ========================================

/**
 * Generic ID type
 */
export type ID = string | number;

/**
 * Timestamp type
 */
export type Timestamp = number;

/**
 * ISO date string
 */
export type ISODateString = string;

// ========================================
// UTILITY TYPES
// ========================================

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Maybe type
 */
export type Maybe<T> = T | null | undefined;

// ========================================
// COMMON ENUMS
// ========================================

/**
 * Size variants
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Status types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Direction types
 */
export type Direction = 'horizontal' | 'vertical';

/**
 * Position types
 */
export type Position = 'top' | 'right' | 'bottom' | 'left';

/**
 * Alignment types
 */
export type Alignment = 'left' | 'center' | 'right' | 'justify';

// ========================================
// COMMON INTERFACES
// ========================================

/**
 * Base entity interface
 */
export interface BaseEntity {
  id: ID;
  createdAt: Date | ISODateString;
  updatedAt: Date | ISODateString;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  [key: string]: unknown;
}

/**
 * Search parameters
 */
export interface SearchParams extends PaginationParams, SortParams {
  query?: string;
  filters?: FilterParams;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Loading state
 */
export interface LoadingState<T = unknown> {
  isLoading: boolean;
  error?: string | null;
  data?: T;
}

/**
 * Async state
 */
export interface AsyncState<T = unknown, E = Error> {
  status: Status;
  data?: T;
  error?: E;
}

// ========================================
// CALLBACK TYPES
// ========================================

/**
 * Generic callback
 */
export type Callback<T = void> = (value: T) => void;

/**
 * Async callback
 */
export type AsyncCallback<T = void> = (value: T) => Promise<void>;

/**
 * Error callback
 */
export type ErrorCallback = (error: Error) => void;

/**
 * Success callback
 */
export type SuccessCallback<T = unknown> = (data: T) => void;
