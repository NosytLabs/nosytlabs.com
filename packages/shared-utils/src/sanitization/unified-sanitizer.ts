// Unified Sanitizer - Consolidates input-sanitizer.ts, log-sanitizer.ts, and content-safety.ts
// This file eliminates duplication and provides a single source of truth for sanitization operations

import type { ContentSafetyResult, SanitizationOptions } from './types';

// ===== CONSTANTS =====

const SUSPICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=\s*["']?[^"']*["']?/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
  /document\.write/gi,
  /innerHTML\s*=/gi
];

const BLOCKED_KEYWORDS = [
  'eval', 'function', 'constructor', 'prototype', '__proto__',
  'setTimeout', 'setInterval', 'document.write', 'innerHTML',
  'spam', 'malware', 'virus', 'phishing', 'scam'
];

const SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'key', 'auth', 'credential',
  'api_key', 'apikey', 'access_token', 'refresh_token',
  'private_key', 'public_key', 'session_id', 'csrf_token',
  'jwt', 'bearer', 'authorization', 'x-api-key'
];

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
const SSN_REGEX = /\b\d{3}-?\d{2}-?\d{4}\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;

// ===== INPUT SANITIZATION =====

export function sanitizeInput(input: string | null | undefined, options: SanitizationOptions = {}): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Remove or escape HTML if requested
  if (options.removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else if (options.escapeHtml !== false) {
    sanitized = escapeHtml(sanitized);
  }

  // Remove script tags and dangerous content
  if (options.removeScripts !== false) {
    // Remove script tags and their content completely
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove any remaining script-related content
    sanitized = sanitized.replace(/alert\s*\(/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '');
  }

  // Limit length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
}

export function escapeHtml(html: string | null | undefined): string {
  if (!html) {
    return '';
  }
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeObject(obj: Record<string, unknown>, options: SanitizationOptions = {}): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, options);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value, options);
    } else if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function sanitizeArray(arr: unknown[], options: SanitizationOptions = {}): unknown[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.map(item => {
    if (typeof item === 'string') {
      return sanitizeInput(item, options);
    } else if (Array.isArray(item)) {
      return sanitizeArray(item, options);
    } else if (item && typeof item === 'object' && !Array.isArray(item) && item.constructor === Object) {
      return sanitizeObject(item as Record<string, unknown>, options);
    }
    return item;
  });
}

export function sanitizeHtml(html: string | null | undefined, options: SanitizationOptions = {}): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove dangerous attributes
  sanitized = sanitized.replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');

  // Allow only safe attributes
  if (options.allowedAttributes) {
    // Implementation would depend on specific requirements
  }

  return sanitized;
}

export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];
  const sanitized = url.trim();

  for (const protocol of dangerousProtocols) {
    if (sanitized.toLowerCase().startsWith(protocol)) {
      return '';
    }
  }

  // Only allow http, https, and relative URLs
  if (!/^(https?:\/\/|\/|\.\/|#)/.test(sanitized)) {
    return '';
  }

  return sanitized;
}

// ===== LOG SANITIZATION =====

export function sanitizeLogData(data: unknown, options: { maskSensitive?: boolean; maxDepth?: number } = {}): unknown {
  const { maskSensitive = true, maxDepth = 10 } = options;

  function sanitizeValue(value: unknown, depth: number = 0): unknown {
    if (depth > maxDepth) {
      return '[Max Depth Exceeded]';
    }

    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return maskSensitive ? maskSensitiveString(value) : value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => sanitizeValue(item, depth + 1));
    }

    if (typeof value === 'object') {
      const sanitized: Record<string, unknown> = {};
      
      for (const [key, val] of Object.entries(value)) {
        if (maskSensitive && isSensitiveField(key)) {
          sanitized[key] = maskString(String(val));
        } else {
          sanitized[key] = sanitizeValue(val, depth + 1);
        }
      }
      
      return sanitized;
    }

    if (typeof value === 'function') {
      return '[Function]';
    }

    return String(value);
  }

  return sanitizeValue(data);
}

export function sanitizeLogMessage(message: string, options: { maskSensitive?: boolean } = {}): string {
  if (!message || typeof message !== 'string') {
    return '';
  }

  let sanitized = message;

  if (options.maskSensitive !== false) {
    sanitized = maskSensitiveString(sanitized);
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  return sanitized;
}

// ===== CONTENT SAFETY =====

export function checkContentSafety(content: string, options: SanitizationOptions = {}): ContentSafetyResult {
  if (!content || typeof content !== 'string') {
    return {
      isSafe: true,
      score: 0,
      reason: 'Empty or invalid content',
      issues: []
    };
  }

  if (options.blockContent) {
    return {
      isSafe: false,
      reason: 'Content blocking enabled',
      score: 0,
      issues: []
    };
  }

  let score = 0;
  const issues: string[] = [];

  // Check for suspicious patterns
  SUSPICIOUS_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      score += matches.length * 60;
      issues.push('Script injection detected');
    }
  });

  // Check for blocked keywords
  const lowerContent = content.toLowerCase();
  BLOCKED_KEYWORDS.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      score += 30;
      issues.push(`Blocked keyword detected: ${keyword}`);
    }
  });

  // Check content length
  if (content.length > 10000) {
    score += 20;
    issues.push('Content too long');
  }

  // Check for excessive special characters
  const specialCharCount = (content.match(/[<>{}[\]()]/g) || []).length;
  if (specialCharCount > content.length * 0.1) {
    score += 15;
    issues.push('Excessive special characters');
  }

  const threshold = options.safetyThreshold || 50;
  const isSafe = score < threshold;

  return {
    isSafe,
    score,
    reason: isSafe ? 'Content appears safe' : 'Content flagged as potentially unsafe',
    issues
  };
}

export function sanitizeWithSafetyCheck(input: string, options: SanitizationOptions = {}): ContentSafetyResult & { content?: string; wasBlocked?: boolean } {
  const safetyResult = checkContentSafety(input, options);
  
  if (!safetyResult.isSafe && options.blockUnsafeContent) {
    return {
      ...safetyResult,
      content: '',
      wasBlocked: true
    };
  }

  const sanitizedContent = sanitizeInput(input, options);
  
  return {
    ...safetyResult,
    content: sanitizedContent,
    wasBlocked: false
  };
}

// ===== HELPER FUNCTIONS =====


export function unescapeHtml(text: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  };

  return text.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, match => htmlUnescapes[match]);
}

export function stripTags(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return html.replace(/<[^>]*>/g, '');
}

export function allowedTagsFilter(html: string, allowedTags: string[] = []): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  if (allowedTags.length === 0) {
    return stripTags(html);
  }

  // Create regex pattern for allowed tags
  const allowedPattern = allowedTags.join('|');
  const tagRegex = new RegExp(`<(?!/?(?:${allowedPattern})\\b)[^>]*>`, 'gi');
  
  return html.replace(tagRegex, '');
}

export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    return 'file';
  }

  // Remove path separators and dangerous characters
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
  
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    const name = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = name.substring(0, 255 - ext.length) + ext;
  }
  
  // Ensure it's not empty after sanitization
  if (!sanitized || sanitized === '') {
    sanitized = 'file';
  }
  
  return sanitized;
}

function isSensitiveField(fieldName: string): boolean {
  const lowerFieldName = fieldName.toLowerCase();
  return SENSITIVE_FIELDS.some(sensitive => lowerFieldName.includes(sensitive));
}

function maskString(value: string, visibleChars: number = 4): string {
  if (!value || value.length <= visibleChars) {
    return '*'.repeat(value?.length || 0);
  }
  
  const start = value.substring(0, Math.floor(visibleChars / 2));
  const end = value.substring(value.length - Math.floor(visibleChars / 2));
  const middle = '*'.repeat(Math.max(0, value.length - visibleChars));
  
  return start + middle + end;
}

function maskSensitiveString(text: string): string {
  let masked = text;

  // Mask emails
  masked = masked.replace(EMAIL_REGEX, (match) => {
    const [local, domain] = match.split('@');
    return `${local.charAt(0)}***@${domain}`;
  });

  // Mask phone numbers
  masked = masked.replace(PHONE_REGEX, '***-***-****');

  // Mask SSNs
  masked = masked.replace(SSN_REGEX, '***-**-****');

  // Mask credit card numbers
  masked = masked.replace(CREDIT_CARD_REGEX, '**** **** **** ****');

  return masked;
}

// Export legacy function names for backward compatibility
export {
  sanitizeInput as sanitize,
  sanitizeLogData as sanitizeLog,
  checkContentSafety as contentSafety
};