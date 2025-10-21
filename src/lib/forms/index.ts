/**
 * Forms Module
 * 
 * Form validation and submission utilities for handling
 * form data, validation, and third-party service integration.
 * 
 * @module forms
 */

// Export all form utilities
export * from './form-validator';
export * from './form-service';

// Re-export commonly used utilities for convenience
export {
  validateName as validateFormName,
  validateEmail as validateFormEmail,
  validateSubject,
  validateService,
  validateMessage,
  validateContactForm,
  fieldValidators,
  getFieldError,
  type ValidationResult as FormValidationResult,
  type FormValidationResult as FormValidationResults,
  type ContactFormData
} from './form-validator';

export {
  submitContactForm,
  submitNewsletterSubscription,
  type FormSubmissionResult,
  type FormServiceConfig
} from './form-service';
