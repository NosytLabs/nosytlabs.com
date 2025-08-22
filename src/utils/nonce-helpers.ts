/**
 * Nonce Helpers for Astro Components
 * Provides utilities for using CSP nonces in components
 */

import type { APIContext } from 'astro';

/**
 * Get nonce from Astro context
 * Safely handles prerendered pages where request context may not be available
 */
export function getNonce(Astro?: APIContext): string {
  if (!Astro || !Astro.locals) {
    // For prerendered pages, return empty string or generate a static nonce
    return '';
  }
  return (Astro.locals as any).nonce || '';
}

/**
 * Create nonce attribute string for inline scripts
 */
export function nonceAttr(Astro: APIContext): string {
  const nonce = getNonce(Astro);
  return nonce ? `nonce="${nonce}"` : '';
}

/**
 * Create nonce object for script/style tags
 */
export function nonceProps(Astro: APIContext): { nonce?: string } {
  const nonce = getNonce(Astro);
  return nonce ? { nonce } : {};
}

/**
 * Generate inline script with nonce
 */
export function createNonceScript(Astro: APIContext, scriptContent: string): string {
  const nonce = getNonce(Astro);
  const nonceAttr = nonce ? ` nonce="${nonce}"` : '';
  return `<script${nonceAttr}>${scriptContent}</script>`;
}

/**
 * Generate inline style with nonce
 */
export function createNonceStyle(_Astro: APIContext, styleContent: string): string {
  const nonce = getNonce(_Astro);
  const nonceAttr = nonce ? ` nonce="${nonce}"` : '';
  return `<style${nonceAttr}>${styleContent}</style>`;
}

/**
 * CSP-safe script loader
 */
export function loadScript(
  Astro: APIContext,
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    type?: string;
    integrity?: string;
    crossorigin?: string;
  } = {}
): string {
  const nonce = getNonce(Astro);
  const nonceAttr = nonce ? ` nonce="${nonce}"` : '';

  const attributes = [
    `src="${src}"`,
    nonceAttr,
    options.async ? 'async' : '',
    options.defer ? 'defer' : '',
    options.type ? `type="${options.type}"` : '',
    options.integrity ? `integrity="${options.integrity}"` : '',
    options.crossorigin ? `crossorigin="${options.crossorigin}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<script ${attributes}></script>`;
}

/**
 * CSP-safe stylesheet loader
 */
export function loadStylesheet(
  _Astro: APIContext,
  href: string,
  options: {
    media?: string;
    integrity?: string;
    crossorigin?: string;
  } = {}
): string {
  const attributes = [
    'rel="stylesheet"',
    `href="${href}"`,
    options.media ? `media="${options.media}"` : '',
    options.integrity ? `integrity="${options.integrity}"` : '',
    options.crossorigin ? `crossorigin="${options.crossorigin}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<link ${attributes}>`;
}



/**
 * Validate that a nonce is properly formatted
 */
export function validateNonce(nonce: string): boolean {
  // Base64 encoded 16-byte nonce should be 24 characters
  return /^[A-Za-z0-9+/]{22}==$/.test(nonce);
}

/**
 * CSP-safe event handler attachment
 * Returns a script that safely attaches event handlers
 */
export function attachEventHandler(
  Astro: APIContext,
  config: {
    selector: string;
    event: string;
    handler: string;
    options?: string;
  }
): string {
  const { selector, event, handler, options = '' } = config;

  const script = `
    document.addEventListener('DOMContentLoaded', function() {
      const elements = document.querySelectorAll('${selector}');
      elements.forEach(function(element) {
        element.addEventListener('${event}', ${handler}${options ? `, ${options}` : ''});
      });
    });
  `;

  return createNonceScript(Astro, script);
}

/**
 * CSP-safe dynamic content loader
 */
export function createContentLoader(
  Astro: APIContext,
  config: {
    containerId: string;
    loadFunction: string;
    errorHandler?: string;
  }
): string {
  const { containerId, loadFunction, errorHandler = 'console.error' } = config;

  const script = `
    (function() {
      const container = document.getElementById('${containerId}');
      if (!container) return;
      
      try {
        ${loadFunction}
      } catch (error) {
        ${errorHandler}('Content loading error:', error);
      }
    })();
  `;

  return createNonceScript(Astro, script);
}

/**
 * Generate CSP report URI meta tag
 */
export function cspReportUri(reportUri: string): string {
  return `<meta http-equiv="Content-Security-Policy" content="report-uri ${reportUri}">`;
}

/**
 * Helper to create CSP-compliant analytics scripts
 */
export function createAnalyticsScript(
  Astro: APIContext,
  config: {
    trackingId?: string;
    customEvents?: Record<string, any>;
  }
): string {
  const { trackingId, customEvents = {} } = config;

  if (!trackingId && Object.keys(customEvents).length === 0) {
    return '';
  }

  const script = `
    // CSP-compliant analytics
    (function() {
      ${
        trackingId
          ? `
        // Initialize tracking with ID: ${trackingId}
        if (typeof gtag !== 'undefined') {
          gtag('config', '${trackingId}');
        }
      `
          : ''
      }
      
      ${
        Object.keys(customEvents).length > 0
          ? `
        // Custom events
        const customEvents = ${JSON.stringify(customEvents)};
        Object.entries(customEvents).forEach(([event, data]) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
          }
        });
      `
          : ''
      }
    })();
  `;

  return createNonceScript(Astro, script);
}
