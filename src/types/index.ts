// ========================================
// CONSOLIDATED TYPE DEFINITIONS
// ========================================

/**
 * Common component props that extend HTML attributes
 */
export interface BaseComponentProps {
  className?: string
  id?: string
  'data-testid'?: string
}

/**
 * Animation configuration types
 */
export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  iterations?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface TransitionConfig {
  property?: string
  duration?: number
  timing?: string
  delay?: number
}

/**
 * Common UI component interfaces
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'interactive' | 'gradient' | 'primary'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  children?: React.ReactNode
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'accent' | 'muted' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  children?: React.ReactNode
}

/**
 * Form and input types
 */
export interface FormFieldProps extends BaseComponentProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  'aria-required'?: boolean
}

export interface TextareaProps extends FormFieldProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  rows?: number
  cols?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[]
  value?: string | number
  defaultValue?: string | number
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  onChange?: (value: string | number | (string | number)[]) => void
}

/**
 * Navigation and routing types
 */
export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
  external?: boolean
  disabled?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

/**
 * Data and API types
 */
export interface ApiResponse<T = Record<string, unknown>> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiError {
  message: string
  code?: string | number
  field?: string
  details?: Record<string, unknown>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

/**
 * Date and time types
 */
export interface DateRange {
  start: Date
  end: Date
}

export interface TimeRange {
  start: string // HH:MM format
  end: string   // HH:MM format
}

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full' | 'iso' | 'timestamp' | 'relative'
  locale?: string
  timeZone?: string
  includeTime?: boolean
}

/**
 * File and media types
 */
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  url?: string
  preview?: string
}

export interface ImageInfo extends FileInfo {
  width?: number
  height?: number
  alt?: string
}

export interface UploadConfig {
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  maxFiles?: number
}

/**
 * Theme and styling types
 */
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeConfig {
  colors: ThemeColors
  fonts: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  breakpoints: Record<string, string>
}

/**
 * Animation and interaction types
 */
export interface ScrollPosition {
  x: number
  y: number
}

export interface ViewportSize {
  width: number
  height: number
}

export interface MousePosition {
  x: number
  y: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
}

/**
 * Utility types for common patterns
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Variant = 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning' | 'error'
export type Alignment = 'left' | 'center' | 'right' | 'justify'
export type Direction = 'horizontal' | 'vertical'
export type Position = 'top' | 'right' | 'bottom' | 'left'
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Event handler types
 */
export type ClickHandler = (event: React.MouseEvent) => void
export type ChangeHandler<T = string> = (value: T) => void
export type SubmitHandler = (event: React.FormEvent) => void
export type KeyboardHandler = (event: React.KeyboardEvent) => void

/**
 * Generic utility types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Component state types
 */
export interface LoadingState {
  isLoading: boolean
  error?: string | null
  data?: unknown
}

export interface FormState<T = Record<string, unknown>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

/**
 * SEO and metadata types
 */
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Project and service specific types
 */
export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  category?: string
  status?: 'completed' | 'in-progress' | 'planned'
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description: string
  icon?: React.ReactNode
  features: string[]
  price?: {
    amount: number
    currency: string
    period?: string
  }
  popular?: boolean
  category?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  content: string
  rating?: number
  avatar?: string
  featured?: boolean
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  tags: string[]
  category: string
  publishedAt: Date
  updatedAt: Date
  readingTime?: number
  featured?: boolean
  seo?: SEOData
}

/**
 * Contact and communication types
 */
export interface ContactForm {
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
  company?: string
  budget?: string
  timeline?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon?: React.ReactNode
  label?: string
}

/**
 * Analytics and tracking types
 */
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp?: Date
  userId?: string
  sessionId?: string
}

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage?: number
  networkRequests?: number
}
