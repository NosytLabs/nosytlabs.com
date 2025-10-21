/**
 * Link Utilities
 *
 * Utilities for creating and managing internal and external links
 *
 * @module utils/links
 */

// Re-export the createInternalLink function from constants
export { createInternalLink } from "@/lib/constants";

/**
 * Creates an external link with proper attributes
 *
 * @param url - The external URL
 * @param options - Link options
 * @returns External link attributes
 */
export function createExternalLink(
  url: string,
  options: {
    target?: string;
    rel?: string;
  } = {},
) {
  return {
    href: url,
    target: options.target || "_blank",
    rel: options.rel || "noopener noreferrer",
  };
}

/**
 * Checks if a URL is external
 *
 * @param url - URL to check
 * @returns True if external, false if internal
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    // If URL parsing fails, assume it's internal
    return false;
  }
}

/**
 * Normalizes a URL path
 *
 * @param path - Path to normalize
 * @returns Normalized path
 */
export function normalizePath(path: string): string {
  // Remove double slashes and ensure proper format
  return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}
