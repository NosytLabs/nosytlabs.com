/**
 * Unified Sanitization Utilities
 *
 * Consolidates all input sanitization logic to eliminate code duplication
 * between form-validation.ts and input-sanitization.ts while providing
 * a clean, type-safe API for all sanitization needs.
 */

import { logger } from '../logger.js';

// HTML entities for escaping
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// Security patterns configuration
const SECURITY_PATTERNS = {
  dangerous: [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /file:/gi,
  ],

  htmlTags: [
    'form',
    'input',
    'button',
    'select',
    'textarea',
    'link',
    'meta',
    'title',
    'head',
    'body',
    'html',
    'b',
    'i',
    'u',
    'strong',
    'em',
    'span',
    'div',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'img',
    'br',
    'hr',
    'ul',
    'ol',
    'li',
    'table',
    'tr',
    'td',
    'th',
  ],

  sqlInjection: [
    /DROP\s+TABLE/gi,
    /UNION\s+SELECT/gi,
    /INSERT\s+INTO/gi,
    /DELETE\s+FROM/gi,
    /UPDATE\s+SET/gi,
    /ALTER\s+TABLE/gi,
    /CREATE\s+TABLE/gi,
    /EXEC\s*\(/gi,
    /EXECUTE\s*\(/gi,
    /('|(\-\-)|(;)|(\||\|)|(\*|\*))/gi,
  ],

  commandInjection: [
    /rm\s+-rf/gi,
    /cat\s+\/etc/gi,
    /whoami/gi,
    /passwd/gi,
    /sudo/gi,
    /chmod/gi,
    /chown/gi,
  ],

  ldapInjection: [/objectClass/gi, /\(\|\(/g, /\)\(\|/g, /uid=/gi, /cn=/gi],

  nosqlInjection: [/\$\w+/g],
};

/**
 * Sanitization options interface
 */
export interface SanitizationOptions {
  escapeHtml?: boolean;
  stripDangerous?: boolean;
  detectThreats?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
  preserveSpaces?: boolean;
  logThreats?: boolean;
}

/**
 * Sanitization result with metadata
 */
export interface SanitizationResult {
  sanitized: string;
  threats: Array<{ type: string; pattern: string }>;
  isClean: boolean;
  originalLength: number;
  finalLength: number;
}

/**
 * Core HTML entity escaping
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }

  return input.replace(/[&<>"'`=\/]/g, match => HTML_ENTITIES[match] || match);
}

/**
 * Detect security threats in input
 */
export function detectThreats(input: string): Array<{ type: string; pattern: string }> {
  const threats: Array<{ type: string; pattern: string }> = [];

  // Check for dangerous patterns
  SECURITY_PATTERNS.dangerous.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push({ type: 'dangerous_html', pattern: pattern.toString() });
    }
  });

  // Check for SQL injection
  SECURITY_PATTERNS.sqlInjection.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push({ type: 'sql_injection', pattern: pattern.toString() });
    }
  });

  // Check for command injection
  SECURITY_PATTERNS.commandInjection.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push({ type: 'command_injection', pattern: pattern.toString() });
    }
  });

  // Check for LDAP injection
  SECURITY_PATTERNS.ldapInjection.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push({ type: 'ldap_injection', pattern: pattern.toString() });
    }
  });

  // Check for NoSQL injection
  SECURITY_PATTERNS.nosqlInjection.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push({ type: 'nosql_injection', pattern: pattern.toString() });
    }
  });

  return threats;
}

/**
 * Remove dangerous content from input
 */
export function stripDangerousContent(input: string, preserveSpaces = true): string {
  let sanitized = input;

  // Remove dangerous patterns with their content
  SECURITY_PATTERNS.dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, preserveSpaces ? ' ' : '');
  });

  // Remove HTML tags but preserve content
  SECURITY_PATTERNS.htmlTags.forEach(tag => {
    const openTagRegex = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    const closeTagRegex = new RegExp(`</${tag}>`, 'gi');
    sanitized = sanitized.replace(openTagRegex, preserveSpaces ? ' ' : '');
    sanitized = sanitized.replace(closeTagRegex, preserveSpaces ? ' ' : '');
  });

  // Remove injection patterns
  [
    ...SECURITY_PATTERNS.sqlInjection,
    ...SECURITY_PATTERNS.commandInjection,
    ...SECURITY_PATTERNS.ldapInjection,
    ...SECURITY_PATTERNS.nosqlInjection,
  ].forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove path traversal patterns
  sanitized = sanitized.replace(/\.\.[\/\\]/g, '');

  // Remove dangerous command characters
  sanitized = sanitized.replace(/[;&|`${}]/g, '');

  // Clean up multiple spaces if preserving spaces
  if (preserveSpaces) {
    sanitized = sanitized.replace(/\s+/g, ' ');
  }

  return sanitized.trim();
}

/**
 * Comprehensive input sanitization with detailed result
 */
export function sanitizeInput(
  input: string,
  options: SanitizationOptions = {}
): SanitizationResult {
  const {
    escapeHtml: shouldEscapeHtml = true,
    stripDangerous = true,
    detectThreats: shouldDetectThreats = true,
    maxLength,
    allowedChars,
    preserveSpaces = true,
    logThreats = true,
  } = options;

  if (typeof input !== 'string') {
    input = String(input);
  }

  const originalLength = input.length;
  let sanitized = input.trim();
  const threatsDetected: Array<{ type: string; pattern: string }> = [];

  // Detect threats before sanitization
  if (shouldDetectThreats) {
    const threats = detectThreats(sanitized);
    threatsDetected.push(...threats);

    if (threats.length > 0 && logThreats) {
      logger.warn('Security threats detected in input', {
        threats,
        inputLength: originalLength,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Strip dangerous content
  if (stripDangerous) {
    sanitized = stripDangerousContent(sanitized, preserveSpaces);
  }

  // Apply character whitelist
  if (allowedChars) {
    const beforeFilter = sanitized.length;
    sanitized = sanitized.replace(new RegExp(`[^${allowedChars.source}]`, 'g'), '');

    if (sanitized.length !== beforeFilter && logThreats) {
      logger.info('Characters filtered by whitelist', {
        originalLength: beforeFilter,
        filteredLength: sanitized.length,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Apply length limit
  if (maxLength && sanitized.length > maxLength) {
    if (logThreats) {
      logger.info('Input truncated due to length limit', {
        originalLength: sanitized.length,
        maxLength,
        timestamp: new Date().toISOString(),
      });
    }
    sanitized = sanitized.substring(0, maxLength);
  }

  // Escape HTML entities
  if (shouldEscapeHtml) {
    sanitized = escapeHtml(sanitized);
  }

  return {
    sanitized,
    threats: threatsDetected,
    isClean: threatsDetected.length === 0,
    originalLength,
    finalLength: sanitized.length,
  };
}

/**
 * Quick sanitization for simple use cases
 */
export function sanitize(input: string, options?: SanitizationOptions): string {
  return sanitizeInput(input, options).sanitized;
}

// Specialized sanitization functions
export const sanitizers = {
  email: (email: string) =>
    sanitize(email, {
      maxLength: 254,
      allowedChars: /[a-zA-Z0-9._%+-@]/,
    }),

  name: (name: string) =>
    sanitize(name, {
      maxLength: 100,
      allowedChars: /[a-zA-Z0-9\s.'\-]/,
    }),

  phone: (phone: string) =>
    sanitize(phone, {
      maxLength: 20,
      allowedChars: /[\d\s\-\(\)\.\+]/,
    }),

  message: (message: string) =>
    sanitize(message, {
      maxLength: 2000,
      preserveSpaces: true,
    }),

  url: (url: string) =>
    sanitize(url, {
      maxLength: 255,
      allowedChars: /[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/,
    }),
};

/**
 * Sanitize form data object
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Apply field-specific sanitization based on field name
      if (key.includes('email')) {
        sanitized[key] = sanitizers.email(value);
      } else if (key.includes('name')) {
        sanitized[key] = sanitizers.name(value);
      } else if (key.includes('phone')) {
        sanitized[key] = sanitizers.phone(value);
      } else if (key.includes('message') || key.includes('description')) {
        sanitized[key] = sanitizers.message(value);
      } else if (key.includes('url') || key.includes('website')) {
        sanitized[key] = sanitizers.url(value);
      } else {
        sanitized[key] = sanitize(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => (typeof item === 'string' ? sanitize(item) : item));
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize any object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitize(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

export default {
  sanitize,
  sanitizeInput,
  sanitizers,
  sanitizeFormData,
  sanitizeObject,
  escapeHtml,
  detectThreats,
  stripDangerousContent,
};
