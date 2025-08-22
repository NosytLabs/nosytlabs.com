/**
 * Unified Validation Utilities
 *
 * Consolidates validation logic with integrated sanitization,
 * providing a clean API for all form and input validation needs.
 */

import { z } from 'zod';
import { sanitizers, sanitizeInput, type SanitizationOptions } from '../sanitization/index.js';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (_value: string) => string | null;
  sanitization?: SanitizationOptions;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: Record<string, string>;
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  required?: boolean;
}

/**
 * Default validation rules for common form fields
 */
export const defaultValidationRules: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    sanitization: { allowedChars: /[a-zA-Z0-9\s.'\-]/ },
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    sanitization: { allowedChars: /[a-zA-Z0-9._%+-@]/ },
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    sanitization: { preserveSpaces: true },
  },
  phone: {
    pattern: /^[\+]?[\d\s\-\(\)\.]{10,}$/,
    maxLength: 20,
    sanitization: { allowedChars: /[\d\s\-\(\)\.\+]/ },
  },
  company: {
    maxLength: 100,
    sanitization: { allowedChars: /[a-zA-Z0-9\s.'\-&]/ },
  },
  website: {
    pattern: /^https?:\/\/.+/,
    maxLength: 255,
    sanitization: { allowedChars: /[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/ },
  },
};

/**
 * Standard error messages for validation failures
 */
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  pattern: 'Please enter a valid format',
  phone: 'Please enter a valid phone number',
  website: 'Please enter a valid website URL (including http:// or https://)',
  file: {
    required: 'Please select a file',
    size: (maxMB: number) => `File size must be less than ${maxMB}MB`,
    type: (types: string[]) => `File type not supported. Allowed types: ${types.join(', ')}`,
  },
};

/**
 * Validates a single form field with integrated sanitization
 */
export function validateField(
  fieldName: string,
  value: string,
  rules: ValidationRule = {}
): { error: ValidationError | null; sanitizedValue: string } {
  const mergedRules = { ...defaultValidationRules[fieldName], ...rules };

  // Sanitize the input first
  const sanitizationResult = sanitizeInput(value, mergedRules.sanitization);
  const sanitizedValue = sanitizationResult.sanitized;

  // Check required
  if (mergedRules.required && !sanitizedValue.trim()) {
    return {
      error: {
        field: fieldName,
        message: validationMessages.required,
        code: 'REQUIRED',
      },
      sanitizedValue,
    };
  }

  // Skip other validations if field is empty and not required
  if (!sanitizedValue.trim() && !mergedRules.required) {
    return { error: null, sanitizedValue };
  }

  // Check minimum length
  if (mergedRules.minLength && sanitizedValue.trim().length < mergedRules.minLength) {
    return {
      error: {
        field: fieldName,
        message: validationMessages.minLength(mergedRules.minLength),
        code: 'MIN_LENGTH',
      },
      sanitizedValue,
    };
  }

  // Check maximum length
  if (mergedRules.maxLength && sanitizedValue.trim().length > mergedRules.maxLength) {
    return {
      error: {
        field: fieldName,
        message: validationMessages.maxLength(mergedRules.maxLength),
        code: 'MAX_LENGTH',
      },
      sanitizedValue,
    };
  }

  // Check pattern
  if (mergedRules.pattern && !mergedRules.pattern.test(sanitizedValue.trim())) {
    let message = validationMessages.pattern;
    let code = 'PATTERN';

    if (fieldName === 'email') {
      message = validationMessages.email;
      code = 'INVALID_EMAIL';
    } else if (fieldName === 'phone') {
      message = validationMessages.phone;
      code = 'INVALID_PHONE';
    } else if (fieldName === 'website') {
      message = validationMessages.website;
      code = 'INVALID_URL';
    }

    return {
      error: {
        field: fieldName,
        message,
        code,
      },
      sanitizedValue,
    };
  }

  // Check custom validation
  if (mergedRules.custom) {
    const customError = mergedRules.custom(sanitizedValue.trim());
    if (customError) {
      return {
        error: {
          field: fieldName,
          message: customError,
          code: 'CUSTOM',
        },
        sanitizedValue,
      };
    }
  }

  return { error: null, sanitizedValue };
}

/**
 * Validates an entire form data object with sanitization
 */
export function validateForm(
  formData: Record<string, string>,
  fieldRules: Record<string, ValidationRule> = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const sanitizedData: Record<string, string> = {};

  Object.entries(formData).forEach(([fieldName, value]) => {
    const { error, sanitizedValue } = validateField(fieldName, value, fieldRules[fieldName]);

    sanitizedData[fieldName] = sanitizedValue;

    if (error) {
      errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

/**
 * File validation utilities
 */
export function validateFile(
  file: File | null,
  options: FileValidationOptions = {}
): ValidationError | null {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    required = false,
  } = options;

  if (!file) {
    return required
      ? {
          field: 'file',
          message: validationMessages.file.required,
          code: 'FILE_REQUIRED',
        }
      : null;
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeInMB = Math.round(maxSize / (1024 * 1024));
    return {
      field: 'file',
      message: validationMessages.file.size(sizeInMB),
      code: 'FILE_TOO_LARGE',
    };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const isAllowedType = allowedTypes.some(type => fileName.endsWith(type.toLowerCase()));

  if (!isAllowedType) {
    return {
      field: 'file',
      message: validationMessages.file.type(allowedTypes),
      code: 'INVALID_FILE_TYPE',
    };
  }

  return null;
}

/**
 * Debounced validation for real-time feedback
 */
export function createDebouncedValidator(
  callback: (_fieldName: string, _value: string, _error: ValidationError | null) => void,
  delay: number = 300
) {
  const timeouts = new Map<string, NodeJS.Timeout>();

  return (fieldName: string, value: string, rules?: ValidationRule) => {
    const existingTimeout = timeouts.get(fieldName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      const { error } = validateField(fieldName, value, rules);
      callback(fieldName, value, error);
      timeouts.delete(fieldName);
    }, delay);

    timeouts.set(fieldName, timeout);
  };
}

/**
 * Zod validation schemas for common form types
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be no more than 100 characters long')
    .transform(val => sanitizers.name(val)),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be no more than 255 characters long')
    .transform(val => sanitizers.email(val)),
  company: z
    .string()
    .max(100, 'Organization name must be no more than 100 characters long')
    .transform(val => sanitizers.name(val))
    .optional(),
  phone: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)\.]{10,}$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be no more than 20 characters long')
    .transform(val => sanitizers.phone(val))
    .optional(),
  service: z.enum(['web-development', 'ai-integration', 'consulting'], {
    errorMap: () => ({ message: 'Please select a service' }),
  }),
  projectBudget: z.string().optional(),
  timeline: z.string().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message must be no more than 2000 characters long')
    .transform(val => sanitizers.message(val)),
  source: z.string().default('contact-form'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Validate contact form data using Zod schema
 */
export function validateContactForm(data: unknown): {
  success: boolean;
  data?: ContactFormData;
  errors?: ValidationError[];
} {
  try {
    const validatedData = contactFormSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        success: false,
        errors: validationErrors,
      };
    }

    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed', code: 'UNKNOWN' }],
    };
  }
}

/**
 * Extract form data from FormData or form element
 */
export function extractFormData(source: FormData | HTMLFormElement): Record<string, string> {
  const formData = source instanceof FormData ? source : new FormData(source);
  const data: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      data[key] = value;
    }
  });

  return data;
}

// Export specialized validators
export const validators = {
  email: (email: string) => validateField('email', email),
  name: (name: string) => validateField('name', name),
  phone: (phone: string) => validateField('phone', phone),
  message: (message: string) => validateField('message', message),
  website: (url: string) => validateField('website', url),
};

export default {
  validateField,
  validateForm,
  validateFile,
  validateContactForm,
  validators,
  createDebouncedValidator,
  extractFormData,
};
