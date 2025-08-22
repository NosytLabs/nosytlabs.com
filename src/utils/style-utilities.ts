/**
 * Unified Style Utilities
 * Minimal critical CSS that doesn't conflict with Tailwind CSS
 */

/**
 * Critical CSS for above-the-fold content optimization
 * Kept minimal to avoid conflicts with Tailwind CSS
 */
export const CRITICAL_CSS = `
/* Minimal Critical CSS - Let Tailwind handle styling */
html {
  scroll-behavior: smooth;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Only essential accessibility styles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus\\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

/**
 * Get critical CSS for specific page types
 */
export function getCriticalCSS(
  _pageType: 'home' | 'services' | 'contact' | 'default' = 'default'
) {
  // Return minimal critical CSS for all page types
  return CRITICAL_CSS;
}

/**
 * Minify CSS by removing unnecessary whitespace and comments
 */
export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
    .replace(/;\s*/g, ';') // Remove spaces after semicolon
    .replace(/,\s*/g, ',') // Remove spaces after comma
    .trim();
}

/**
 * Extract critical CSS for above-the-fold content
 */
export function extractCriticalCSS(_html: string, _css: string): string {
  // Return minimal critical CSS to avoid conflicts
  return CRITICAL_CSS;
}

/**
 * Preload critical CSS files (removed - using inline critical CSS instead)
 */
export function preloadCriticalCSS(): string {
  // Critical CSS is now inlined in the HTML head for better performance
  return '';
}

/**
 * Load non-critical CSS asynchronously (removed - using Tailwind instead)
 */
export function loadNonCriticalCSS(): string {
  // No longer loading separate CSS files - Tailwind handles all styling
  return '';
}

/**
 * CSS loading optimization script (simplified - Tailwind handles styling)
 */
export const CSS_LOADING_SCRIPT = `
  // Minimal CSS loading optimization
  (function() {
    // Ensure fonts are loaded properly
    if ('fonts' in document) {
      document.fonts.ready.then(function() {
        document.body.classList.add('fonts-loaded');
      });
    }
  })();
`;

/**
 * Purge unused CSS classes (simplified version)
 * In production, use tools like PurgeCSS or UnCSS
 */
export function purgeUnusedCSS(css: string, usedClasses: string[]): string {
  const lines = css.split('\n');
  const purgedLines: string[] = [];
  let inRule = false;
  let currentRule = '';
  let ruleUsed = false;

  for (const line of lines) {
    if (line.includes('{')) {
      inRule = true;
      currentRule = line;
      // Check if any used class is in this rule
      ruleUsed = usedClasses.some(cls => line.includes(`.${cls}`));
    } else if (line.includes('}') && inRule) {
      if (ruleUsed) {
        purgedLines.push(currentRule);
        purgedLines.push(line);
      }
      inRule = false;
      currentRule = '';
      ruleUsed = false;
    } else if (inRule && ruleUsed) {
      purgedLines.push(line);
    } else if (!inRule) {
      purgedLines.push(line);
    }
  }

  return purgedLines.join('\n');
}

/**
 * Generate resource hints for better performance
 */
export function generateResourceHints(): string {
  return `
    <!-- DNS prefetch for external resources -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    
    <!-- Preconnect to critical third-party origins -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  `;
}

/**
 * Generate preload links for critical resources
 */
export function generatePreloadLinks(
  options: { fonts?: string[]; images?: string[] } = {}
): string {
  const { fonts = [], images = [] } = options;

  let preloadLinks = '';

  // Preload fonts with correct paths
  fonts.forEach(font => {
    preloadLinks += `<link rel="preload" href="/assets/fonts/${font}" as="font" type="font/woff2" crossorigin>\n`;
  });

  // Preload images with correct paths
  images.forEach(image => {
    preloadLinks += `<link rel="preload" href="/images/${image}" as="image">\n`;
  });

  return preloadLinks;
}

/**
 * Optimize font loading
 */
export function optimizeFontLoading(): string {
  return `
    <style>
      /* Font display optimization */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/assets/fonts/Inter-Regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/assets/fonts/Inter-Bold.woff2') format('woff2');
      }
    </style>
  `;
}

/**
 * Generate inline critical CSS
 */
export function generateInlineCriticalCSS(pageType: string = 'default'): string {
  const criticalCSS = getCriticalCSS(pageType as any);
  const minifiedCSS = minifyCSS(criticalCSS);

  return `<style>${minifiedCSS}</style>`;
}

/**
 * Check if CSS should be inlined based on size
 */
export function shouldInlineCSS(css: string, maxSize: number = 14000): boolean {
  return css.length <= maxSize;
}

/**
 * Generate CSS loading strategy
 */
export function generateCSSLoadingStrategy(criticalCSS: string, nonCriticalCSS: string[]): string {
  const shouldInline = shouldInlineCSS(criticalCSS);

  let strategy = '';

  if (shouldInline) {
    strategy += generateInlineCriticalCSS();
  } else {
    strategy += '<link rel="stylesheet" href="/css/main.css">';
  }

  // Load non-critical CSS asynchronously
  nonCriticalCSS.forEach(cssFile => {
    strategy += `<link rel="preload" href="${cssFile}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
    strategy += `<noscript><link rel="stylesheet" href="${cssFile}"></noscript>`;
  });

  return strategy;
}
