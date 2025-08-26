/**
 * Unified Validation and Sanitization System
 * 
 * Consolidates all validation schemas, sanitization utilities, and security measures
 * into a single, comprehensive system for production-ready input handling.
 */

import { z } from 'zod';
import { sanitizeInput, detectThreats, type SanitizationOptions } from './sanitization/index';

// =============================================================================
// CORE VALIDATION PATTERNS
// =============================================================================

const createSanitizedString = (options: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  errorMessage?: string;
  sanitizationOptions?: SanitizationOptions;
}) => {
  return z.string()
    .transform((val) => {
      const result = sanitizeInput(val, options.sanitizationOptions);
      if (!result.isClean) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'Input contains potentially dangerous content',
            path: [],
          },
        ]);
      }
      return result.sanitized.trim();
    })
    .refine((val) => {
      if (options.minLength && val.length < options.minLength) {
        return false;
      }
      if (options.maxLength && val.length > options.maxLength) {
        return false;
      }
      if (options.pattern && !options.pattern.test(val)) {
        return false;
      }
      return true;
    }, {
      message: options.errorMessage || 'Invalid input format',
    });
};

// Core validation patterns with integrated sanitization
export const validationPatterns = {
  email: createSanitizedString({
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address',
    sanitizationOptions: {
      escapeHtml: true,
      stripDangerous: true,
      detectThreats: true,
      allowedChars: /^[a-zA-Z0-9._%+-@]+$/,
    },
  }).transform(val => val.toLowerCase()),

  name: createSanitizedString({
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'.,]+$/,
    errorMessage: 'Name contains invalid characters',
    sanitizationOptions: {
      escapeHtml: true,
      stripDangerous: true,
      detectThreats: true,
      preserveSpaces: true,
    },
  }),

  subject: createSanitizedString({
    minLength: 1,
    maxLength: 200,
    pattern: /^[^<>"'&]+$/,
    errorMessage: 'Subject contains invalid characters',
    sanitizationOptions: {
      escapeHtml: true,
      stripDangerous: true,
      detectThreats: true,
      preserveSpaces: true,
    },
  }),

  message: createSanitizedString({
    minLength: 10,
    maxLength: 5000,
    pattern: /^[^<>"'&]*$/,
    errorMessage: 'Message contains invalid characters',
    sanitizationOptions: {
      escapeHtml: true,
      stripDangerous: true,
      detectThreats: true,
      preserveSpaces: true,
    },
  }),

  phone: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return val;
      const result = sanitizeInput(val, {
        allowedChars: /^[\+\d\s\-\(\)\.]+$/,
        stripDangerous: true,
      });
      return result.sanitized;
    })
    .refine((val) => {
      if (!val) return true;
      return /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(val);
    }, {
      message: 'Please enter a valid phone number',
    }),

  company: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return val;
      const result = sanitizeInput(val, {
        escapeHtml: true,
        stripDangerous: true,
        maxLength: 100,
        allowedChars: /^[a-zA-Z0-9\s\-'.,&]+$/,
      });
      return result.sanitized.trim();
    }),

  website: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return val;
      const result = sanitizeInput(val, {
        escapeHtml: true,
        stripDangerous: true,
        maxLength: 255,
      });
      return result.sanitized;
    })
    .refine((val) => {
      if (!val) return true;
      return /^https?:\/\/.+/.test(val);
    }, {
      message: 'Please enter a valid website URL',
    }),

  budget: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return val;
      const result = sanitizeInput(val, {
        allowedChars: /^[0-9,\$\s\-]+$/,
        maxLength: 50,
      });
      return result.sanitized;
    }),

  timeline: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return val;
      const result = sanitizeInput(val, {
        allowedChars: /^[a-zA-Z0-9\s\-.,]+$/,
        maxLength: 100,
      });
      return result.sanitized;
    }),

  // Security fields
  honeypot: z.string().max(0, 'Spam detected').optional(),
  csrfToken: z.string().min(1, 'Security token is required'),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy'
  }),
};

// =============================================================================
// UNIFIED VALIDATION SCHEMAS
// =============================================================================

// Contact form schema
export const contactFormSchema = z.object({
  name: validationPatterns.name,
  email: validationPatterns.email,
  subject: validationPatterns.subject,
  message: validationPatterns.message,
  phone: validationPatterns.phone,
  company: validationPatterns.company,
  service: z.enum([
    'web-development',
    'mobile-development',
    'ui-ux-design',
    'consulting',
    'maintenance',
    'other'
  ]).optional(),
  website: validationPatterns.honeypot, // Honeypot field
  _token: validationPatterns.csrfToken,
  consent: validationPatterns.consent,
}).strict();

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: validationPatterns.email,
  name: validationPatterns.name.optional(),
  interests: z.array(z.enum([
    'web-development',
    'mobile-development',
    'design-trends',
    'tech-news',
    'case-studies',
    'tutorials'
  ])).max(6, 'Too many interests selected').optional(),
  website: validationPatterns.honeypot, // Honeypot field
  _token: validationPatterns.csrfToken,
  source: z.enum(['website', 'social', 'referral', 'other']).optional(),
}).strict();



// Booking inquiry schema (enhanced)
export const bookingInquirySchema = z.object({
  // Contact information
  name: validationPatterns.name,
  email: validationPatterns.email,
  phone: validationPatterns.phone,
  company: validationPatterns.company,
  
  // Booking details
  serviceType: z.enum([
    'consultation',
    'project-planning',
    'technical-review',
    'strategy-session',
    'other'
  ]),
  
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  alternativeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  alternativeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
  
  duration: z.enum(['30', '60', '90', '120']), // minutes
  timezone: z.string().max(50),
  
  // Meeting details
  meetingType: z.enum(['video-call', 'phone-call', 'in-person']),
  agenda: createSanitizedString({
    minLength: 10,
    maxLength: 1000,
    sanitizationOptions: {
      escapeHtml: true,
      stripDangerous: true,
      preserveSpaces: true,
    },
  }),
  
  // Security fields
  honeypot: validationPatterns.honeypot,
  _token: validationPatterns.csrfToken,
  consent: validationPatterns.consent,
}).strict();

// --- BEGIN: Server-side compatibility schemas for booking ---
// Accepts the legacy/alternate fields coming from various booking forms (e.g., UnifiedContactForm)
export const legacyBookingSchema = z.object({
  // Minimal contact
  name: validationPatterns.name,
  email: validationPatterns.email,
  phone: validationPatterns.phone.optional(),
  company: validationPatterns.company.optional(),

  // Legacy/alternate booking details
  consultationType: z.string().min(1).max(100).optional(),
  businessSize: z.string().min(1).max(100).optional(),
  currentChallenges: z.union([
    z.array(z.string().max(200)),
    z.string().max(1000)
  ]).optional(),
  goals: z.union([
    z.array(z.string().max(200)),
    z.string().max(1000)
  ]).optional(),
  projectGoals: z.array(z.string().max(200)).optional(),

  // Time and meeting preferences (legacy names)
  preferredMeetingType: z.string().max(100).optional(),
  preferredTimeframe: z.string().max(100).optional(),
  meetingDuration: z.enum(['15','30','45','60','90','120']).optional(),
  timezone: z.string().max(50).optional(),

  // Overlaps with enhanced schema (optional here)
  serviceType: z.string().max(100).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  meetingType: z.string().max(100).optional(),
  duration: z.string().max(3).optional(),
  agenda: z.string().max(2000).optional(),
  additionalNotes: z.string().max(2000).optional(),

  // Security fields optional in legacy
  honeypot: validationPatterns.honeypot.optional(),
  _token: validationPatterns.csrfToken.optional(),
  consent: z.boolean().optional(),
}).passthrough();

// Enhanced server schema allows additional optional fields while keeping core bookingInquiry required
export const enhancedServerBookingSchema = bookingInquirySchema.extend({
  consultationType: z.string().min(1).max(100).optional(),
  businessSize: z.string().min(1).max(100).optional(),
  currentChallenges: z.array(z.string().max(200)).optional(),
  goals: z.array(z.string().max(200)).optional(),
  projectGoals: z.array(z.string().max(200)).optional(),
  budgetRange: z.string().max(50).optional(),
  urgency: z.string().max(50).optional(),
  referralSource: z.string().max(100).optional(),
  previousExperience: z.string().max(100).optional(),
  additionalNotes: z.string().max(2000).optional(),
  termsAccepted: z.boolean().optional(),
}).passthrough();

// Union schema to accept either enhanced standard booking payload or legacy/alt payload
export const compositeBookingSchema = z.union([
  enhancedServerBookingSchema,
  legacyBookingSchema,
]);
// --- END: Server-side compatibility schemas for booking ---

// Admin authentication schema
export const adminAuthSchema = z.object({
  email: validationPatterns.email,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  _token: validationPatterns.csrfToken,
}).strict();

// File upload schema
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().max(255, 'Filename too long'),
    size: z.number().max(10485760, 'File size must not exceed 10MB'),
    type: z.string().regex(
      /^(image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(plain|csv))$/,
      'Invalid file type'
    ),
  }),
  _token: validationPatterns.csrfToken,
}).strict();

// Search/filter schema
export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-.,!?]+$/, 'Search query contains invalid characters')
    .trim()
    .optional(),
  category: z.enum(['all', 'web', 'mobile', 'design', 'consulting']).optional(),
  sort: z.enum(['date', 'relevance', 'title']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0 && n <= 1000).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0 && n <= 100).optional(),
}).strict();

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validates and sanitizes form data with comprehensive error handling
 */
export async function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{
  success: boolean;
  data?: T;
  errors?: Array<{ field: string; message: string; code?: string }>;
  threats?: Array<{ type: string; pattern: string }>;
}> {
  try {
    // First, detect any security threats in the raw data
    const threats: Array<{ type: string; pattern: string }> = [];
    
    if (typeof data === 'object' && data !== null) {
      for (const [, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          const detectedThreats = detectThreats(value);
          threats.push(...detectedThreats);
        }
      }
    }
    
    // Parse and validate the data
    const validatedData = await schema.parseAsync(data);
    
    const result: {
      success: boolean;
      data?: T;
      errors?: Array<{ field: string; message: string; code?: string }>;
      threats?: Array<{ type: string; pattern: string }>;
    } = {
      success: true,
      data: validatedData,
    };
    
    if (threats.length > 0) {
      result.threats = threats;
    }
    
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      
      return {
        success: false,
        errors,
      };
    }
    
    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
}

/**
 * Quick validation for single fields
 */
export function validateField(
  fieldName: keyof typeof validationPatterns,
  value: string
): { isValid: boolean; sanitizedValue?: string; error?: string } {
  try {
    const pattern = validationPatterns[fieldName];
    const result = pattern.parse(value);
    return {
      isValid: true,
      sanitizedValue: typeof result === 'string' ? result : String(result),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return {
      isValid: false,
      error: 'Validation failed',
    };
  }
}

// Export all schemas for easy access
export const schemas = {
  contactForm: contactFormSchema,
  newsletter: newsletterSchema,
  bookingInquiry: bookingInquirySchema,
  adminAuth: adminAuthSchema,
  fileUpload: fileUploadSchema,
  search: searchSchema,
};

// Export validation patterns for reuse
export { validationPatterns as patterns };