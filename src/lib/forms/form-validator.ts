/**
 * Unified Form Validation Utility
 * 
 * Consolidates form validation logic to eliminate duplication
 * between contact.astro and contact.ts implementations.
 */

import { validateEmail as validateEmailShared } from '@nosytlabs/shared-utils/validation/email-validator';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a name field
 */
export function validateName(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (value.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (value.trim().length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }
  
  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(value.trim())) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
}

/**
 * Validates an email field using shared validation utility
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!validateEmailShared(value)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Validates a subject field
 */
export function validateSubject(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Please select a subject' };
  }
  
  if (value.length < 5) {
    return { isValid: false, error: 'Subject must be at least 5 characters' };
  }
  
  if (value.length > 200) {
    return { isValid: false, error: 'Subject must be less than 200 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validates a service selection field
 */
export function validateService(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Please select a service' };
  }
  
  return { isValid: true };
}

/**
 * Validates a message field
 */
export function validateMessage(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Message is required' };
  }
  
  if (value.length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters' };
  }
  
  if (value.length > 5000) {
    return { isValid: false, error: 'Message must be less than 5000 characters' };
  }
  
  return { isValid: true };
}

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
}

/**
 * Unified contact form validation
 */
export function validateContactForm(data: ContactFormData): FormValidationResult {
  const errors: Record<string, string> = {};
  
  const nameResult = validateName(data.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.error!;
  }
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error!;
  }
  
  const subjectResult = validateSubject(data.subject);
  if (!subjectResult.isValid) {
    errors.subject = subjectResult.error!;
  }
  
  const serviceResult = validateService(data.service);
  if (!serviceResult.isValid) {
    errors.service = serviceResult.error!;
  }
  
  const messageResult = validateMessage(data.message);
  if (!messageResult.isValid) {
    errors.message = messageResult.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Field validators object for client-side use
 * Compatible with existing contact.astro implementation
 */
export const fieldValidators = {
  name: validateName,
  email: validateEmail,
  subject: validateSubject,
  service: validateService,
  message: validateMessage
};

/**
 * Utility function to get validation error for a single field
 */
export function getFieldError(fieldName: keyof ContactFormData, value: string): string {
  const validator = fieldValidators[fieldName];
  if (!validator) return '';
  
  const result = validator(value);
  return result.isValid ? '' : result.error || '';
}
