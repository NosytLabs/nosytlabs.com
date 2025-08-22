/**
 * Critical CSS Extraction and Inlining System
 * Optimizes initial page load by inlining critical styles
 */

export interface CriticalCSSConfig {
  viewport: {
    width: number;
    height: number;
  };
  inlineThreshold: number; // KB
  extractors: string[];
  ignore: string[];
}

export const DEFAULT_CRITICAL_CONFIG: CriticalCSSConfig = {
  viewport: {
    width: 1200,
    height: 900,
  },
  inlineThreshold: 14, // 14KB for HTTP/2 push
  extractors: [
    // Critical selectors that should always be inlined
    'html',
    'body',
    '.hero-section',
    '.navigation',
    '.header',
    '.loading-spinner',
    '.critical-content',
    // Design tokens
    ':root',
    '[data-theme]',
    // Above-the-fold content
    '.container',
    '.grid',
    '.flex',
    // Typography essentials
    'h1', 'h2', 'h3',
    '.text-primary',
    '.text-secondary',
    // Button essentials
    '.btn',
    '.btn-primary',
    '.btn-secondary',
  ],
  ignore: [
    // Non-critical animations
    '@keyframes',
    '.animate-',
    // Below-the-fold components
    '.footer',
    '.testimonials',
    '.blog-content',
    // Interactive states that aren't immediately visible
    ':hover',
    ':focus-visible',
    '.modal',
    '.dropdown',
  ],
};

/**
 * Critical CSS Manager
 * Handles extraction and inlining of critical styles
 */
export class CriticalCSSManager {
  private static instance: CriticalCSSManager;
  private config: CriticalCSSConfig;
  private criticalStyles: Map<string, string> = new Map();
  private extractedRules: Set<string> = new Set();

  private constructor(config: CriticalCSSConfig = DEFAULT_CRITICAL_CONFIG) {
    this.config = config;
  }

  static getInstance(config?: CriticalCSSConfig): CriticalCSSManager {
    if (!CriticalCSSManager.instance) {
      CriticalCSSManager.instance = new CriticalCSSManager(config);
    }
    return CriticalCSSManager.instance;
  }

  /**
   * Extract critical CSS from stylesheets
   */
  extractCriticalCSS(stylesheets: string[]): string {
    const criticalRules: string[] = [];
    
    stylesheets.forEach(css => {
      const rules = this.parseCSS(css);
      
      rules.forEach(rule => {
        if (this.isCriticalRule(rule)) {
          criticalRules.push(rule);
          this.extractedRules.add(rule);
        }
      });
    });

    const criticalCSS = criticalRules.join('\n');
    
    // Check size threshold
    const sizeKB = new Blob([criticalCSS]).size / 1024;
    if (sizeKB > this.config.inlineThreshold) {
      console.warn(`Critical CSS size (${sizeKB.toFixed(2)}KB) exceeds threshold (${this.config.inlineThreshold}KB)`);
    }

    return this.optimizeCriticalCSS(criticalCSS);
  }

  /**
   * Parse CSS into individual rules
   */
  private parseCSS(css: string): string[] {
    const rules: string[] = [];
    let currentRule = '';
    let braceCount = 0;
    let inComment = false;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      const nextChar = css[i + 1];

      // Handle comments
      if (!inString && char === '/' && nextChar === '*') {
        inComment = true;
        i++; // Skip next char
        continue;
      }
      if (inComment && char === '*' && nextChar === '/') {
        inComment = false;
        i++; // Skip next char
        continue;
      }
      if (inComment) continue;

      // Handle strings
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && css[i - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }

      currentRule += char;

      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            rules.push(currentRule.trim());
            currentRule = '';
          }
        }
      }
    }

    return rules.filter(rule => rule.length > 0);
  }

  /**
   * Check if a CSS rule is critical
   */
  private isCriticalRule(rule: string): boolean {
    // Check ignore patterns first
    for (const ignorePattern of this.config.ignore) {
      if (rule.includes(ignorePattern)) {
        return false;
      }
    }

    // Check critical extractors
    for (const extractor of this.config.extractors) {
      if (rule.includes(extractor)) {
        return true;
      }
    }

    // Check for above-the-fold indicators
    const aboveFoldIndicators = [
      'header',
      'nav',
      'hero',
      'banner',
      'main',
      'container',
      'wrapper',
    ];

    return aboveFoldIndicators.some(indicator => 
      rule.toLowerCase().includes(indicator)
    );
  }

  /**
   * Optimize critical CSS
   */
  private optimizeCriticalCSS(css: string): string {
    return css
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove unnecessary semicolons
      .replace(/;\s*}/g, '}')
      // Remove comments
      .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '')
      // Trim
      .trim();
  }

  /**
   * Generate critical CSS for a specific page
   */
  generatePageCriticalCSS(pageType: string, additionalSelectors: string[] = []): string {
    const pageConfig = {
      ...this.config,
      extractors: [...this.config.extractors, ...additionalSelectors],
    };

    // Page-specific critical selectors
    const pageSelectors: Record<string, string[]> = {
      home: ['.hero-section', '.services-preview', '.cta-section'],
      services: ['.service-header', '.service-grid', '.service-card'],
      projects: ['.project-header', '.project-grid', '.project-card'],
      blog: ['.blog-header', '.blog-grid', '.blog-card'],
      contact: ['.contact-form', '.contact-info'],
    };

    const selectors = pageSelectors[pageType] || [];
    pageConfig.extractors.push(...selectors);

    this.config = pageConfig;
    return this.extractCriticalCSS([]);
  }

  /**
   * Get inline critical CSS for HTML head
   */
  getInlineCriticalCSS(pageType: string = 'default'): string {
    const criticalCSS = this.criticalStyles.get(pageType);
    if (!criticalCSS) {
      return this.generatePageCriticalCSS(pageType);
    }
    return criticalCSS;
  }

  /**
   * Cache critical CSS for a page type
   */
  setCriticalCSS(pageType: string, css: string): void {
    this.criticalStyles.set(pageType, css);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.criticalStyles.clear();
    this.extractedRules.clear();
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const totalRules = this.extractedRules.size;
    const totalSize = Array.from(this.criticalStyles.values())
      .reduce((total, css) => total + new Blob([css]).size, 0);

    return {
      totalRules,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      cacheHitRate: this.criticalStyles.size > 0 ? 1 : 0,
      threshold: this.config.inlineThreshold,
    };
  }
}

// Export convenience functions
export const createCriticalCSSManager = (config?: CriticalCSSConfig) => {
  return CriticalCSSManager.getInstance(config);
};

export const extractCriticalCSS = (stylesheets: string[], config?: CriticalCSSConfig) => {
  const manager = CriticalCSSManager.getInstance(config);
  return manager.extractCriticalCSS(stylesheets);
};

export const getPageCriticalCSS = (pageType: string, additionalSelectors?: string[]) => {
  const manager = CriticalCSSManager.getInstance();
  return manager.generatePageCriticalCSS(pageType, additionalSelectors);
};