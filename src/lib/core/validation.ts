/**
 * Validation Utilities
 *
 * Consolidated validation functions for common data types including
 * email, strings, numbers, URLs, and custom validation rules.
 *
 * @module core/validation
 */

/**
 * Comprehensive validation utilities for forms, data, and user input
 *
 * This module provides a complete set of validation functions for common use cases
 * including email validation, name validation, URL validation, and more.
 * All functions return consistent ValidationResult objects for easy error handling.
 */

// Import shared validation utilities
import { isValidEmail } from "@/lib/utils/validation";

// Re-export shared validation utilities
export { isValidEmail, validateEmail } from "@/lib/utils/validation";

// ========================================
// TYPES
// ========================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Custom validation rule
 */
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean;
  message: string;
}

// ========================================
// EMAIL VALIDATION
// ========================================

/**
 * Validates an email address using shared utility.
 *
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * ```typescript
 * validateEmailAddress('user@example.com')
 * // Returns: { isValid: true }
 *
 * validateEmailAddress('invalid-email')
 * // Returns: { isValid: false, error: 'Please enter a valid email address' }
 * ```
 */
export function validateEmailAddress(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

// ========================================
// STRING VALIDATION
// ========================================

/**
 * Validates that a string is not empty.
 *
 * @param value - String to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateRequired('Hello', 'Name')
 * // Returns: { isValid: true }
 *
 * validateRequired('', 'Name')
 * // Returns: { isValid: false, error: 'Name is required' }
 * ```
 */
export function validateRequired(
  value: string,
  fieldName: string = "Field",
): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

/**
 * Validates minimum string length.
 *
 * @param value - String to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateMinLength('Hello', 3, 'Name')
 * // Returns: { isValid: true }
 *
 * validateMinLength('Hi', 3, 'Name')
 * // Returns: { isValid: false, error: 'Name must be at least 3 characters long' }
 * ```
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string = "Field",
): ValidationResult {
  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long`,
    };
  }
  return { isValid: true };
}

/**
 * Validates maximum string length.
 *
 * @param value - String to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateMaxLength('Hello', 10, 'Name')
 * // Returns: { isValid: true }
 *
 * validateMaxLength('Very long name', 10, 'Name')
 * // Returns: { isValid: false, error: 'Name must be less than 10 characters' }
 * ```
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string = "Field",
): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Validates string length range.
 *
 * @param value - String to validate
 * @param minLength - Minimum required length
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateLengthRange('Hello', 3, 10, 'Name')
 * // Returns: { isValid: true }
 * ```
 */
export function validateLengthRange(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = "Field",
): ValidationResult {
  const minResult = validateMinLength(value, minLength, fieldName);
  if (!minResult.isValid) return minResult;

  const maxResult = validateMaxLength(value, maxLength, fieldName);
  if (!maxResult.isValid) return maxResult;

  return { isValid: true };
}

/**
 * Validates string against a regular expression pattern.
 *
 * @param value - String to validate
 * @param pattern - Regular expression pattern
 * @param errorMessage - Custom error message
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validatePattern('abc123', /^[a-z0-9]+$/, 'Only lowercase letters and numbers allowed')
 * // Returns: { isValid: true }
 *
 * validatePattern('ABC', /^[a-z0-9]+$/, 'Only lowercase letters and numbers allowed')
 * // Returns: { isValid: false, error: 'Only lowercase letters and numbers allowed' }
 * ```
 */
export function validatePattern(
  value: string,
  pattern: RegExp,
  errorMessage: string = "Invalid format",
): ValidationResult {
  if (!pattern.test(value.trim())) {
    return { isValid: false, error: errorMessage };
  }
  return { isValid: true };
}

/**
 * Validates that a string contains only letters, spaces, hyphens, and apostrophes.
 * Useful for name validation.
 *
 * @param value - String to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateName("John O'Brien-Smith")
 * // Returns: { isValid: true }
 *
 * validateName("John123")
 * // Returns: { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
 * ```
 */
export function validateName(
  value: string,
  fieldName: string = "Name",
): ValidationResult {
  const requiredResult = validateRequired(value, fieldName);
  if (!requiredResult.isValid) return requiredResult;

  const lengthResult = validateLengthRange(value, 2, 100, fieldName);
  if (!lengthResult.isValid) return lengthResult;

  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(value.trim())) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
}

// ========================================
// NUMBER VALIDATION
// ========================================

/**
 * Validates minimum number value.
 *
 * @param value - Number to validate
 * @param min - Minimum allowed value
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateMin(10, 5, 'Age')
 * // Returns: { isValid: true }
 *
 * validateMin(3, 5, 'Age')
 * // Returns: { isValid: false, error: 'Age must be at least 5' }
 * ```
 */
export function validateMin(
  value: number,
  min: number,
  fieldName: string = "Value",
): ValidationResult {
  if (value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  return { isValid: true };
}

/**
 * Validates maximum number value.
 *
 * @param value - Number to validate
 * @param max - Maximum allowed value
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateMax(10, 20, 'Age')
 * // Returns: { isValid: true }
 *
 * validateMax(25, 20, 'Age')
 * // Returns: { isValid: false, error: 'Age must be at most 20' }
 * ```
 */
export function validateMax(
  value: number,
  max: number,
  fieldName: string = "Value",
): ValidationResult {
  if (value > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  return { isValid: true };
}

/**
 * Validates number is within a range.
 *
 * @param value - Number to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateRange(15, 10, 20, 'Age')
 * // Returns: { isValid: true }
 *
 * validateRange(25, 10, 20, 'Age')
 * // Returns: { isValid: false, error: 'Age must be between 10 and 20' }
 * ```
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = "Value",
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return { isValid: true };
}

// ========================================
// URL VALIDATION
// ========================================

/**
 * Validates a URL string.
 *
 * @param value - URL string to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateUrl('https://example.com')
 * // Returns: { isValid: true }
 *
 * validateUrl('not-a-url')
 * // Returns: { isValid: false, error: 'Please enter a valid URL' }
 * ```
 */
export function validateUrl(
  value: string,
  fieldName: string = "URL",
): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  try {
    new URL(value);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
}

// ========================================
// CUSTOM VALIDATION
// ========================================

/**
 * Validates a value against a custom validation rule.
 *
 * @param value - Value to validate
 * @param rule - Validation rule to apply
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const passwordRule: ValidationRule<string> = {
 *   validate: (value) => value.length >= 8 && /[A-Z]/.test(value),
 *   message: 'Password must be at least 8 characters and contain an uppercase letter'
 * };
 *
 * validateCustom('Password123', passwordRule)
 * // Returns: { isValid: true }
 * ```
 */
export function validateCustom<T>(
  value: T,
  rule: ValidationRule<T>,
): ValidationResult {
  if (!rule.validate(value)) {
    return { isValid: false, error: rule.message };
  }
  return { isValid: true };
}

// ========================================
// VALIDATOR CLASS
// ========================================

/**
 * Validator class with static methods for all validation types.
 * Provides a unified interface for validation operations.
 *
 * @example
 * ```typescript
 * const emailResult = Validator.email('user@example.com');
 * const nameResult = Validator.name('John Doe');
 * const rangeResult = Validator.range(15, 10, 20);
 * ```
 */
export class Validator {
  // Email validation
  static email(email: string): ValidationResult {
    return validateEmailAddress(email);
  }

  // String validation
  static required(value: string, fieldName?: string): ValidationResult {
    return validateRequired(value, fieldName);
  }

  static minLength(
    value: string,
    minLength: number,
    fieldName?: string,
  ): ValidationResult {
    return validateMinLength(value, minLength, fieldName);
  }

  static maxLength(
    value: string,
    maxLength: number,
    fieldName?: string,
  ): ValidationResult {
    return validateMaxLength(value, maxLength, fieldName);
  }

  static lengthRange(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName?: string,
  ): ValidationResult {
    return validateLengthRange(value, minLength, maxLength, fieldName);
  }

  static pattern(
    value: string,
    pattern: RegExp,
    errorMessage?: string,
  ): ValidationResult {
    return validatePattern(value, pattern, errorMessage);
  }

  static fullName(value: string, fieldName?: string): ValidationResult {
    return validateName(value, fieldName);
  }

  // Number validation
  static min(value: number, min: number, fieldName?: string): ValidationResult {
    return validateMin(value, min, fieldName);
  }

  static max(value: number, max: number, fieldName?: string): ValidationResult {
    return validateMax(value, max, fieldName);
  }

  static range(
    value: number,
    min: number,
    max: number,
    fieldName?: string,
  ): ValidationResult {
    return validateRange(value, min, max, fieldName);
  }

  // URL validation
  static url(value: string, fieldName?: string): ValidationResult {
    return validateUrl(value, fieldName);
  }

  // Custom validation
  static custom<T>(value: T, rule: ValidationRule<T>): ValidationResult {
    return validateCustom(value, rule);
  }
}
