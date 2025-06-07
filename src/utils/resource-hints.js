/**
 * Resource Hints for Performance Optimization
 * Implements preload, prefetch, and preconnect strategies
 */

class ResourceHintsManager {
  constructor() {
    this.preloadedResources = new Set();
    this.prefetchedResources = new Set();
  }

  /**
   * Preload critical resources
   * @param {Array} resources - Array of resource objects
   */
  preloadCriticalResources(resources = []) {
    const defaultResources = [
      { href: '/styles/optimized/critical-optimized.css', as: 'style', type: 'text/css' },
      { href: '/scripts/bundles/core.min.js', as: 'script', type: 'text/javascript' },
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
    ];

    const allResources = [...defaultResources, ...resources];

    allResources.forEach(resource => {
      if (!this.preloadedResources.has(resource.href)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        if (resource.media) link.media = resource.media;

        document.head.appendChild(link);
        this.preloadedResources.add(resource.href);
      }
    });
  }

  /**
   * Prefetch resources for future navigation
   * @param {Array} resources - Array of resource URLs
   */
  prefetchResources(resources) {
    resources.forEach(href => {
      if (!this.prefetchedResources.has(href)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;

        document.head.appendChild(link);
        this.prefetchedResources.add(href);
      }
    });
  }

  /**
   * Preconnect to external domains
   * @param {Array} domains - Array of domain URLs
   */
  preconnectDomains(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';

      document.head.appendChild(link);
    });
  }

  /**
   * DNS prefetch for external domains
   * @param {Array} domains - Array of domain URLs
   */
  dnsPrefetch(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;

      document.head.appendChild(link);
    });
  }

  /**
   * Initialize all resource hints
   */
  init() {
    // Preconnect to external services
    this.preconnectDomains([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.nosytlabs.com'
    ]);

    // DNS prefetch for analytics
    this.dnsPrefetch([
      'https://vercel-analytics.com',
      'https://vitals.vercel-analytics.com'
    ]);

    // Preload critical resources
    this.preloadCriticalResources();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const resourceHints = new ResourceHintsManager();
  resourceHints.init();
});

export default ResourceHintsManager;