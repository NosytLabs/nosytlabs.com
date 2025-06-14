/**
 * Component Type Definitions - Enhanced for Consistency
 * Standardized component interfaces following NosytLabs patterns
 */

import { BaseComponentProps } from './global';

// ========== COMMON COMPONENT TYPES ==========

/**
 * Standard size variants used across components
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Standard variant types for interactive components
 */
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'minimal';

/**
 * Standard theme variants for components
 */
export type ComponentTheme = 'default' | 'modern' | 'retro' | 'glassmorphism' | 'win95';

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig<T = number> {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// ========== ENHANCED COMPONENT INTERFACES ==========

export interface ButtonProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  theme?: ComponentTheme;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  external?: boolean;
  featured?: boolean;
  variant?: ComponentVariant;
  size?: ComponentSize;
  theme?: ComponentTheme;
  interactive?: boolean;
  loading?: boolean;
  badge?: string;
  tags?: string[];
  metadata?: {
    date?: string;
    author?: string;
    category?: string;
    readTime?: string;
  };
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ComponentSize;
  variant?: ComponentVariant;
  theme?: ComponentTheme;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  backdrop?: 'blur' | 'dark' | 'light' | 'none';
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  position?: 'center' | 'top' | 'bottom';
  fullScreen?: boolean;
  scrollable?: boolean;
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface TextareaProps extends FormFieldProps {
  value?: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface SelectProps extends FormFieldProps {
  value?: string;
  defaultValue?: string;
  multiple?: boolean;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}