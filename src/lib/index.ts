/**
 * Main Library Index
 *
 * Central export point for all library utilities and components.
 * This file provides a unified interface for accessing all functionality
 * across the application.
 *
 * @module lib
 */

// ========================================
// CORE UTILITIES
// ========================================

export {
  cn,
  capitalize,
  toKebabCase,
  toCamelCase,
  clamp,
  formatFileSize,
  isBrowser,
  generateId,
  deepClone,
  deepMerge,
  unique,
  chunk,
  sleep,
  debounce,
  throttle,
  Validator,
  validateEmail,
  validateRequired,
  formatDate,
  formatCurrency,
  formatNumber,
  pluralize,
} from "./core";
export type { ValidationResult as CoreValidationResult } from "./core";

// ========================================
// UTILITIES
// ========================================

export * from "./core/utils";

// ========================================
// BLOG UTILITIES
// ========================================

export * from "./blog-utils";

// ========================================
// ANIMATIONS
// ========================================

export * from "./animations";

// ========================================
// API UTILITIES
// ========================================

export * from "./api";

// ========================================
// FORM UTILITIES
// ========================================

export {
  validateFormName,
  validateFormEmail,
  validateSubject,
  validateService,
  validateMessage,
  validateContactForm,
  fieldValidators,
  getFieldError,
  submitContactForm,
} from "./forms";
export type { FormValidationResult, ContactFormData } from "./forms";

// ========================================
// THEME MANAGEMENT
// ========================================

// Re-export from shared-utils to maintain backward compatibility
export * from "@shared-utils/theme";

// ========================================
// CONSTANTS
// ========================================

export * from "./constants";

// ========================================
// COMMONLY USED EXPORTS
// ========================================

// Core utilities - already exported above

// Validation - already exported above

// Formatting - already exported above

// Performance
export { PerformanceMonitor, CacheManager, BrowserCache } from "./performance";

// Error handling
export { ErrorHandler, safeAsync, withErrorTracking } from "./error-handling";

// Animations
export {
  UnifiedAnimationManager,
  UnifiedIntersectionAnimator,
  StaggeredAnimator,
  ButtonAnimator,
  createAnimationManager,
  createDefaultAnimationManager,
} from "./animations";

// API
export {
  createAPIResponse,
  createErrorResponse,
  createSuccessResponse,
  withAPIMiddleware,
} from "./api";

// Theme (re-exported from shared-utils)
export {
  ThemeManager,
  initThemeManagement,
  themeUtils,
  getThemeManager,
} from "@shared-utils/theme";

// Export toggleTheme as a standalone function for backward compatibility
import { themeUtils as _themeUtils } from "@shared-utils/theme";
export const toggleTheme = _themeUtils.toggleTheme;

// Constants
export {
  SITE_CONFIG,
  COMPANY_INFO,
  createInternalLink,
  createImagePath,
} from "./constants";
