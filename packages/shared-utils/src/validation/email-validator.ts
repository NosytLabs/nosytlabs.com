/**
 * Email Validation Utility
 *
 * Consolidated email validation functions to eliminate duplication
 * between contact.ts and Footer.astro implementations.
 */

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - The email string to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Comprehensive email regex that handles most valid email formats
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const trimmedEmail = email.trim();

  // Additional validation to prevent consecutive dots and other edge cases
  if (
    trimmedEmail.includes("..") ||
    trimmedEmail.startsWith(".") ||
    trimmedEmail.endsWith(".") ||
    trimmedEmail.startsWith("@") ||
    trimmedEmail.endsWith("@") ||
    trimmedEmail.indexOf("@") !== trimmedEmail.lastIndexOf("@")
  ) {
    return false;
  }

  return emailRegex.test(trimmedEmail);
}

/**
 * Validates email using HTML5 native validation (for DOM elements)
 * @param emailInput - HTMLInputElement with email type
 * @returns boolean indicating if email is valid
 */
export function validateEmailInput(emailInput: HTMLInputElement): boolean {
  if (!emailInput || emailInput.type !== "email") {
    return false;
  }

  return emailInput.checkValidity();
}

/**
 * Comprehensive email validation that combines regex and HTML5 validation
 * @param email - Email string or HTMLInputElement
 * @returns boolean indicating if email is valid
 */
export function validateEmail(email: string | HTMLInputElement): boolean {
  if (typeof email === "string") {
    return isValidEmail(email);
  } else if (email instanceof HTMLInputElement) {
    return validateEmailInput(email) && isValidEmail(email.value);
  }

  return false;
}

/**
 * Sanitizes email input by trimming whitespace and converting to lowercase
 * @param email - The email string to sanitize
 * @returns sanitized email string
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
}

/**
 * Email validation result interface
 */
export interface EmailValidationResult {
  isValid: boolean;
  email: string;
  error?: string;
}

/**
 * Validates and sanitizes email with detailed result
 * @param email - The email string to validate
 * @returns EmailValidationResult with validation details
 */
export function validateEmailWithResult(email: string): EmailValidationResult {
  const sanitizedEmail = sanitizeEmail(email);

  if (!sanitizedEmail) {
    return {
      isValid: false,
      email: sanitizedEmail,
      error: "Email is required",
    };
  }

  const isValid = isValidEmail(sanitizedEmail);

  if (isValid) {
    return {
      isValid: true,
      email: sanitizedEmail,
    };
  } else {
    return {
      isValid: false,
      email: sanitizedEmail,
      error: "Please enter a valid email address",
    };
  }
}
