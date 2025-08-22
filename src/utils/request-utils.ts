/**
 * Request Utilities
 *
 * This module provides utilities for working with HTTP requests in Astro contexts.
 */

import type { APIContext } from 'astro';

/**
 * Get request headers from Astro APIContext
 * @param context - The Astro API context
 * @returns Headers object from the request
 */
export function getRequestHeaders(context: APIContext): Headers {
  return context.request.headers;
}

/**
 * Get a specific header value from the request
 * @param context - The Astro API context
 * @param headerName - The name of the header to retrieve
 * @returns The header value or null if not found
 */
export function getHeader(context: APIContext, headerName: string): string | null {
  return context.request.headers.get(headerName);
}

/**
 * Get the request method
 * @param context - The Astro API context
 * @returns The HTTP method (GET, POST, etc.)
 */
export function getRequestMethod(context: APIContext): string {
  return context.request.method;
}

/**
 * Get the request URL
 * @param context - The Astro API context
 * @returns The request URL
 */
export function getRequestUrl(context: APIContext): URL {
  return context.url;
}

/**
 * Check if the request is a POST request
 * @param context - The Astro API context
 * @returns True if the request is a POST request
 */
export function isPostRequest(context: APIContext): boolean {
  return context.request.method === 'POST';
}

/**
 * Check if the request is a GET request
 * @param context - The Astro API context
 * @returns True if the request is a GET request
 */
export function isGetRequest(context: APIContext): boolean {
  return context.request.method === 'GET';
}

/**
 * Get the client IP address from the request
 * @param context - The Astro API context
 * @returns The client IP address or null if not available
 */
export function getClientIp(context: APIContext): string | null {
  const headers = context.request.headers;
  
  // Check various headers that might contain the real IP
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];
  
  for (const header of ipHeaders) {
    const value = headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0]?.trim() || null;
    }
  }
  
  return null;
}

/**
 * Get the user agent from the request
 * @param context - The Astro API context
 * @returns The user agent string or null if not available
 */
export function getUserAgent(context: APIContext): string | null {
  return context.request.headers.get('user-agent');
}

/**
 * Check if the request accepts JSON
 * @param context - The Astro API context
 * @returns True if the request accepts JSON
 */
export function acceptsJson(context: APIContext): boolean {
  const acceptHeader = context.request.headers.get('accept');
  return acceptHeader ? acceptHeader.includes('application/json') : false;
}

/**
 * Get the content type of the request
 * @param context - The Astro API context
 * @returns The content type or null if not available
 */
export function getContentType(context: APIContext): string | null {
  return context.request.headers.get('content-type');
}