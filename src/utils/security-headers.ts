/**
 * Enhanced Security Headers Utility
 * Provides comprehensive security headers with nonce-based CSP
 */

import type { APIContext } from 'astro';
import { getSecurityConfig } from '../config/security.ts';
import type { SecurityConfig as BaseSecurityConfig } from '../config/security.ts';

/**
 * Generate a cryptographically secure nonce for CSP
 * Uses Web Crypto API for browser and Node.js compatibility
 */
export function generateNonce(): string {
  // Use Web Crypto API which works in both browser and Node.js
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : 
                   (typeof globalThis !== 'undefined' && globalThis.crypto) ? globalThis.crypto : null;
  
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint8Array(16);
    cryptoObj.getRandomValues(array);
    
    // Convert to base64 without Buffer
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < array.length; i += 3) {
      const a = array[i] ?? 0;
      const b = array[i + 1] ?? 0;
      const c = array[i + 2] ?? 0;
      
      result += chars[a >> 2];
      result += chars[((a & 3) << 4) | (b >> 4)];
      result += chars[((b & 15) << 2) | (c >> 6)];
      result += chars[c & 63];
    }
    
    // Add padding
    while (result.length % 4) {
      result += '=';
    }
    
    return result;
  } else {
    // Fallback for environments without crypto - use Math.random
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < 22; i++) {
      result += chars.charAt(Math.floor(Math.random() * 64));
    }
    return result + '==';
  }
}

/**
 * Security header configuration
 */
export interface SecurityConfig {
  nonce?: string;
  isDevelopment?: boolean;
  allowInlineStyles?: boolean;
  additionalScriptSources?: string[];
  additionalStyleSources?: string[];
  additionalImageSources?: string[];
  additionalConnectSources?: string[];
}

export interface SecurityContext {
  nonce: string;
  requestId: string;
  timestamp: Date;
  clientIP?: string;
  userAgent?: string;
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'Content-Security-Policy-Report-Only'?: string;
  'Strict-Transport-Security'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
  'X-Request-ID'?: string;
  'X-Security-Nonce'?: string;
  'Cache-Control'?: string;
  'X-Security-Event'?: string;
}

/**
 * Generate Content Security Policy with nonce support
 */
export function generateCSP(config: SecurityConfig = {}): string {
  const baseSecurityConfig = getSecurityConfig();
  const {
    nonce,
    isDevelopment = false,
    allowInlineStyles = false,
    additionalScriptSources = [],
    additionalStyleSources = [],
    additionalImageSources = [],
    additionalConnectSources = [],
  } = config;

  // Check if CSP is enabled in security config
  if (!baseSecurityConfig.csp?.enabled) {
    return '';
  }

  // Start with base directives from security config
  const baseDirectives = baseSecurityConfig.csp.directives || {};

  // Build CSP directives, merging config with additional sources
  const directives: Record<string, string[] | undefined> = {
    'default-src': baseDirectives.defaultSrc || ["'self'"],
    'script-src': [
      ...(baseDirectives.scriptSrc || ["'self'"]),
      // Vercel Analytics
      'https://va.vercel-scripts.com',
      'https://vitals.vercel-insights.com',
      // Add nonce if provided
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      // Development mode allowances
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      ...additionalScriptSources,
    ],
    'style-src': [
      ...(baseDirectives.styleSrc || ["'self'"]),
      // Allow inline styles only if explicitly enabled or in development
      ...(allowInlineStyles || isDevelopment ? ["'unsafe-inline'"] : []),
      // Add nonce for styles if provided
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      ...additionalStyleSources,
    ],
    'img-src': [
      ...(baseDirectives.imgSrc || ["'self'", 'data:', 'https:', 'blob:']),
      ...additionalImageSources,
    ],
    'font-src': baseDirectives.fontSrc || ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'connect-src': [
      ...(baseDirectives.connectSrc || ["'self'"]),
      'https://va.vercel-scripts.com',
      'https://vitals.vercel-insights.com',
      // WebSocket for development
      ...(isDevelopment ? ['ws:', 'wss:'] : []),
      ...additionalConnectSources,
    ],
    'frame-src': baseDirectives.frameSrc || ["'none'"],
    'frame-ancestors': baseDirectives.frameAncestors || ["'none'"],
    'object-src': baseDirectives.objectSrc || ["'none'"],
    'base-uri': baseDirectives.baseUri || ["'self'"],
    'form-action': baseDirectives.formAction || ["'self'"],
    'manifest-src': baseDirectives.manifestSrc || ["'self'"],
    'media-src': baseDirectives.mediaSrc || ["'self'"],
    'worker-src': baseDirectives.workerSrc || ["'self'", 'blob:'],
    'child-src': baseDirectives.childSrc || ["'none'"],
    'upgrade-insecure-requests': baseDirectives.upgradeInsecureRequests ? [''] : undefined,
  };

  // Convert directives to CSP string
  return Object.entries(directives)
    .filter(([_, sources]) => sources !== undefined)
    .map(([directive, sources]) => {
      if (directive === 'upgrade-insecure-requests') {
        return directive;
      }
      if (sources!.length === 0) {
        return directive;
      }
      return `${directive} ${sources!.join(' ')}`;
    })
    .join('; ');
}

/**
 * Generate all security headers
 */
export function generateSecurityHeaders(config: SecurityConfig = {}): Record<string, string> {
  return {
    // Enforce HTTPS with HSTS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Restrict browser features
    'Permissions-Policy':
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',

    // Cross-Origin isolation policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',

    // Content Security Policy
    'Content-Security-Policy': generateCSP({
      ...config,
      additionalScriptSources: [
        "'self'",
        'https://analytics.nosytlabs.com',
        'https://cdn.nosytlabs.com',
        ...(config.additionalScriptSources || []),
      ],
      additionalStyleSources: [
        "'self'",
        'https://fonts.googleapis.com',
        ...(config.additionalStyleSources || []),
      ],
      additionalImageSources: [
        "'self'",
        'data:',
        'https:',
        ...(config.additionalImageSources || []),
      ],
      additionalConnectSources: [
        "'self'",
        'https://api.nosytlabs.com',
        ...(config.additionalConnectSources || []),
      ],
    }),
  };
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: Response, config: SecurityConfig = {}): Response {
  const headers = generateSecurityHeaders(config);

  // Only add headers that aren't already set
  Object.entries(headers).forEach(([name, value]) => {
    if (!response.headers.has(name)) {
      response.headers.set(name, value);
    }
  });

  return response;
}

/**
 * Generate enhanced security headers
 */
export function addEnhancedSecurityHeaders(
  response: Response,
  context: SecurityContext,
  options: {
    isAPI?: boolean;
    cacheControl?: string;
    securityEvent?: string;
    config?: BaseSecurityConfig;
  } = {}
): Response {
  const { isAPI = false, cacheControl, securityEvent, config } = options;
  const securityConfig = config || getSecurityConfig();
  const isDevelopment = import.meta.env.MODE === 'development';

  const headers: SecurityHeaders = {};

  // CSP with nonce
  if (securityConfig.csp?.enabled) {
    const cspHeader = securityConfig.csp.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
    headers[cspHeader] = generateCSP({ nonce: context.nonce, isDevelopment });
  }

  // HSTS
  if (securityConfig.headers?.hsts?.enabled && !isDevelopment) {
    const hsts = securityConfig.headers.hsts;
    let hstsValue = `max-age=${hsts.maxAge}`;
    if (hsts.includeSubDomains) hstsValue += '; includeSubDomains';
    if (hsts.preload) hstsValue += '; preload';
    headers['Strict-Transport-Security'] = hstsValue;
  }

  // Apply configured headers
  if (securityConfig.headers?.xFrameOptions) {
    headers['X-Frame-Options'] = securityConfig.headers.xFrameOptions;
  }
  if (securityConfig.headers?.xContentTypeOptions) {
    headers['X-Content-Type-Options'] = securityConfig.headers.xContentTypeOptions;
  }
  if (securityConfig.headers?.referrerPolicy) {
    headers['Referrer-Policy'] = securityConfig.headers.referrerPolicy;
  }
  if (securityConfig.headers?.permissionsPolicy) {
    headers['Permissions-Policy'] = securityConfig.headers.permissionsPolicy;
  }
  if (securityConfig.headers?.crossOriginEmbedderPolicy) {
    headers['Cross-Origin-Embedder-Policy'] = securityConfig.headers.crossOriginEmbedderPolicy;
  }
  if (securityConfig.headers?.crossOriginOpenerPolicy) {
    headers['Cross-Origin-Opener-Policy'] = securityConfig.headers.crossOriginOpenerPolicy;
  }
  if (securityConfig.headers?.crossOriginResourcePolicy) {
    headers['Cross-Origin-Resource-Policy'] = securityConfig.headers.crossOriginResourcePolicy;
  }

  // Request tracking
  headers['X-Request-ID'] = context.requestId;
  headers['X-Security-Nonce'] = context.nonce;

  // Cache control
  headers['Cache-Control'] =
    cacheControl || (isAPI ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600');

  // Security event logging
  if (securityEvent) {
    headers['X-Security-Event'] = securityEvent;
  }

  // Apply headers to response
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  return response;
}

/**
 * Create nonce-aware context for Astro components
 */
export function createSecurityContext(context: APIContext): {
  nonce: string;
  cspHeader: string;
  securityHeaders: Record<string, string>;
} {
  const nonce = generateNonce();
  const isDevelopment = import.meta.env.DEV;

  // Security context removed as it was unused

  const config: SecurityConfig = {
    nonce,
    isDevelopment,
    allowInlineStyles: isDevelopment, // Allow inline styles in development
  };

  const securityHeaders = generateSecurityHeaders(config);

  // Store nonce in context for use in templates
  context.locals.nonce = nonce;
  context.locals.securityHeaders = securityHeaders;

  return {
    nonce,
    cspHeader: securityHeaders['Content-Security-Policy'] ?? '',
    securityHeaders,
  };
}

/**
 * Validate CSP nonce format
 */
export function isValidNonce(nonce: string): boolean {
  // Base64 encoded 16-byte nonce should be 24 characters
  return /^[A-Za-z0-9+/]{22}==$/.test(nonce);
}

/**
 * Security header presets for different environments
 */
export const SECURITY_PRESETS = {
  development: {
    isDevelopment: true,
    allowInlineStyles: true,
    additionalScriptSources: ["'unsafe-eval'"] as string[],
    additionalConnectSources: ['ws:', 'wss:'] as string[],
  },

  production: {
    isDevelopment: false,
    allowInlineStyles: false,
    additionalScriptSources: [] as string[],
    additionalConnectSources: [] as string[],
  },

  strict: {
    isDevelopment: false,
    allowInlineStyles: false,
    additionalScriptSources: [] as string[],
    additionalStyleSources: [] as string[],
    additionalImageSources: [] as string[],
    additionalConnectSources: [] as string[],
  },
};

/**
 * Get security preset by name
 */
export function getSecurityPreset(preset: keyof typeof SECURITY_PRESETS): Partial<SecurityConfig> {
  return SECURITY_PRESETS[preset] as Partial<SecurityConfig>;
}
