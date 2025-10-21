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
// MCP UTILITIES
// ========================================

export * from "./mcp";

// ========================================
// THEME MANAGEMENT
// ========================================

export * from "./theme-manager";

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
export {
  ErrorHandler,
  safeAsync,
  withErrorTracking,
  trackMCPError,
  safeMCPAsync,
} from "./error-handling";

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

// MCP
export { mcpOptimizer, mcpWrapper, optimizedMCPCall } from "./mcp";

// Theme
export {
  ThemeManager,
  initThemeManagement,
  toggleTheme,
} from "./theme-manager";

// Constants
export {
  SITE_CONFIG,
  COMPANY_INFO,
  createInternalLink,
  createImagePath,
} from "./constants";
