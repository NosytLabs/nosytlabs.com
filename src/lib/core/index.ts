/**
 * Core Utilities Module
 *
 * Consolidated core utilities including general utilities, validation, and formatting.
 * This module provides a single entry point for all core functionality.
 *
 * @module core
 */

// Export all utilities
export * from "./utils";
export * from "./validation";
export * from "./formatting";

// Re-export commonly used utilities for convenience
export {
  // String utilities
  capitalize,
  toKebabCase,
  toCamelCase,
  toPascalCase,
  truncate,

  // Number utilities
  clamp,
  formatFileSize,

  // Browser utilities
  isBrowser,
  generateId,

  // Object utilities
  deepClone,
  deepMerge,
  pick,
  omit,

  // Array utilities
  unique,
  chunk,
  shuffle,

  // Delay utilities
  sleep,
  debounce,
  throttle,

  // CSS utilities
  cn,
} from "./utils";

export {
  // Validation
  Validator,
  validateEmailAddress,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateLengthRange,
  validatePattern,
  validateName,
  validateMin,
  validateMax,
  validateRange,
  validateUrl,
  validateCustom,

  // Types
  type ValidationResult,
  type ValidationRule,
} from "./validation";

export {
  // Date formatting
  formatDate,
  formatDateTime,
  formatRelativeTime,

  // Number formatting
  formatNumber,
  formatPercentage,
  formatDecimal,
  formatCompactNumber,

  // Currency formatting
  formatCurrency,

  // Phone formatting
  formatPhoneNumber,

  // Text formatting
  formatTitleCase,
  formatSentenceCase,
  pluralize,

  // List formatting
  formatList,
} from "./formatting";
