import { z } from 'zod';

/**
 * Comprehensive input validation schemas for all API endpoints
 * Includes sanitization, security measures, and proper error handling
 */

// Common validation patterns
const patterns = {
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must not exceed 254 characters')
    .toLowerCase()
    .trim(),
    
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-'.,]+$/, 'Name contains invalid characters')
    .trim(),
    
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must not exceed 200 characters')
    .regex(/^[^<>"'&]+$/, 'Subject contains invalid characters')
    .trim(),
    
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .regex(/^[^<>"'&]*$/, 'Message contains invalid characters')
    .trim(),
    
  phone: z.string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
    
  company: z.string()
    .max(100, 'Company name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-'.,&]+$/, 'Company name contains invalid characters')
    .trim()
    .optional()
    .or(z.literal('')),
    
  website: z.string()
    .url('Please enter a valid website URL')
    .max(255, 'Website URL must not exceed 255 characters')
    .optional()
    .or(z.literal('')),
    
  budget: z.string()
    .regex(/^[0-9,\$\s\-]+$/, 'Budget contains invalid characters')
    .max(50, 'Budget must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
    
  timeline: z.string()
    .max(100, 'Timeline must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-.,]+$/, 'Timeline contains invalid characters')
    .optional()
    .or(z.literal('')),
};

// Contact form validation schema
export const contactFormSchema = z.object({
  name: patterns.name,
  email: patterns.email,
  subject: patterns.subject,
  message: patterns.message,
  phone: patterns.phone,
  company: patterns.company,
  service: z.enum([
    'web-development',
    'mobile-development', 
    'ui-ux-design',
    'consulting',
    'maintenance',
    'other'
  ]).optional(),
  // Honeypot field for spam protection
  website: z.string().max(0, 'Spam detected').optional(),
  // CSRF token
  _token: z.string().min(1, 'Security token is required'),
  // Consent checkbox
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy'
  }),
}).strict(); // Reject unknown fields

// Newsletter subscription validation schema
export const newsletterSchema = z.object({
  email: patterns.email,
  name: patterns.name.optional(),
  // Preferences
  interests: z.array(z.enum([
    'web-development',
    'mobile-development',
    'design-trends',
    'tech-news',
    'case-studies',
    'tutorials'
  ])).max(6, 'Too many interests selected').optional(),
  // Honeypot field
  website: z.string().max(0, 'Spam detected').optional(),
  // CSRF token
  _token: z.string().min(1, 'Security token is required'),
  // Double opt-in confirmation
  source: z.enum(['website', 'social', 'referral', 'other']).optional(),
}).strict();

// Project inquiry validation schema
export const projectInquirySchema = z.object({
  // Contact information
  name: patterns.name,
  email: patterns.email,
  phone: patterns.phone,
  company: patterns.company,
  website: patterns.website,
  
  // Project details
  projectType: z.enum([
    'website',
    'web-application',
    'mobile-app',
    'e-commerce',
    'redesign',
    'maintenance',
    'consulting',
    'other'
  ]),
  
  projectDescription: z.string()
    .min(20, 'Project description must be at least 20 characters')
    .max(2000, 'Project description must not exceed 2000 characters')
    .regex(/^[^<>"'&]*$/, 'Description contains invalid characters')
    .trim(),
    
  budget: patterns.budget,
  timeline: patterns.timeline,
  
  // Additional requirements
  features: z.array(z.string().max(100)).max(20, 'Too many features listed').optional(),
  
  // Files/attachments (just metadata, actual files handled separately)
  attachments: z.array(z.object({
    name: z.string().max(255),
    size: z.number().max(10485760), // 10MB max
    type: z.string().regex(/^[a-zA-Z0-9\/\-]+$/)
  })).max(5, 'Too many attachments').optional(),
  
  // Honeypot field
  honeypot: z.string().max(0, 'Spam detected').optional(),
  
  // CSRF token
  _token: z.string().min(1, 'Security token is required'),
  
  // Consent
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy'
  }),
  
  // Marketing consent (optional)
  marketingConsent: z.boolean().optional(),
}).strict();

// Admin authentication schema
export const adminAuthSchema = z.object({
  email: patterns.email,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  _token: z.string().min(1, 'Security token is required'),
}).strict();

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().max(255, 'Filename too long'),
    size: z.number().max(10485760, 'File size must not exceed 10MB'),
    type: z.string().regex(
      /^(image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(plain|csv))$/,
      'Invalid file type'
    ),
  }),
  _token: z.string().min(1, 'Security token is required'),
}).strict();

// Search/filter validation schema
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

// API key validation schema
export const apiKeySchema = z.object({
  key: z.string().min(32, 'Invalid API key format'),
  permissions: z.array(z.enum(['read', 'write', 'admin'])).optional(),
}).strict();

/**
 * Sanitizes input by removing potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input: any): any {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>"'&]/g, '') // Remove HTML/script injection chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Validates and sanitizes form data
 * @param {object} data - Form data to validate
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {object} Validated and sanitized data
 * @throws {Error} If validation fails
 */
export function validateAndSanitize<T>(data: any, schema: z.ZodSchema<T>): T {
  try {
    // Pre-sanitize string fields
    const sanitizedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    }
    
    // Validate with schema
    const validatedData = schema.parse(sanitizedData);
    
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      });
      
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

/**
 * Rate limiting validation
 * @param {string} identifier - IP address or user identifier
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} Whether request is within limits
 */
export function validateRateLimit(_identifier: string, _maxRequests: number = 100, _windowMs: number = 900000): boolean {
  // This would typically use Redis or in-memory store
  // For now, return true (implement with actual rate limiting middleware)
  return true;
}

/**
 * CSRF token validation
 * @param {string} token - CSRF token to validate
 * @param {string} secret - CSRF secret
 * @returns {boolean} Whether token is valid
 */
export function validateCSRFToken(token: string, _secret: string): boolean {
  // This would typically use JWT or similar token validation
  // Implementation depends on CSRF protection strategy
  return Boolean(token && token.length > 0);
}

/**
 * Content Security Policy validation for user-generated content
 * @param {string} content - Content to validate
 * @returns {boolean} Whether content passes CSP checks
 */
export function validateCSP(content: string): boolean {
  // Check for potentially dangerous content
  const dangerousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
}

interface FileUploadResult {
  isValid: boolean;
  errors: string[];
}

interface FileObject {
  type: string;
  size: number;
  name: string;
}

/**
 * Validates file uploads for security
 * @param {object} file - File object to validate
 * @returns {object} Validation result
 */
export function validateFileUpload(file: FileObject): FileUploadResult {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const errors = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  if (file.size > maxSize) {
    errors.push('File size exceeds 10MB limit');
  }
  
  // Check for potentially dangerous filenames
  if (/[<>:"/\\|?*]/.test(file.name)) {
    errors.push('Filename contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export all schemas for easy access
export const schemas = {
  contactForm: contactFormSchema,
  newsletter: newsletterSchema,
  projectInquiry: projectInquirySchema,
  adminAuth: adminAuthSchema,
  fileUpload: fileUploadSchema,
  search: searchSchema,
  apiKey: apiKeySchema,
};

export default schemas;