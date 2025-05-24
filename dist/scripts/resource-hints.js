// Resource Hints Manager
class ResourceHintsManager {
    constructor() {
        this.hints = new Set();
        this.observer = null;
        this.setupIntersectionObserver();
    }

    // Initialize intersection observer for dynamic loading
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const url = element.dataset.prefetch;
                    if (url) {
                        this.prefetchUrl(url);
                        this.observer.unobserve(element);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    // Add preload hint
    addPreload(url, as = 'fetch', type = null) {
        if (this.hints.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        if (type) link.type = type;
        
        document.head.appendChild(link);
        this.hints.add(url);
    }

    // Add prefetch hint
    addPrefetch(url) {
        if (this.hints.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        
        document.head.appendChild(link);
        this.hints.add(url);
    }

    // Add preconnect hint
    addPreconnect(url, crossorigin = true) {
        if (this.hints.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        if (crossorigin) link.crossOrigin = 'anonymous';
        
        document.head.appendChild(link);
        this.hints.add(url);
    }

    // Prefetch URL when element comes into view
    observeElement(element, url) {
        element.dataset.prefetch = url;
        this.observer.observe(element);
    }

    // Prefetch URL directly
    prefetchUrl(url) {
        if (this.hints.has(url)) return;
        
        fetch(url, { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                this.hints.add(url);
            })
            .catch(error => console.warn('Prefetch failed:', error));
    }

    // Add DNS prefetch hint
    addDnsPrefetch(url) {
        if (this.hints.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        
        document.head.appendChild(link);
        this.hints.add(url);
    }

    // Prerender a page
    addPrerender(url) {
        if (this.hints.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'prerender';
        link.href = url;
        
        document.head.appendChild(link);
        this.hints.add(url);
    }

    // Initialize critical resources
    initCriticalResources() {
        // Preload critical CSS
        this.addPreload('/styles/main.css', 'style');
        this.addPreload('/styles/global.css', 'style');
        
        // Preload critical fonts if any
        this.addPreload('/fonts/ms-sans-serif.woff2', 'font', 'font/woff2');
        
        // Preconnect to critical origins
        this.addPreconnect('https://api.nosytlabs.com');
        
        // DNS prefetch for external resources
        this.addDnsPrefetch('https://analytics.nosytlabs.com');
        
        // Prefetch likely next pages
        if (window.location.pathname === '/') {
            this.addPrefetch('/services');
            this.addPrefetch('/projects');
        }
    }

    // Initialize route-based prefetching
    initRoutePrefetching() {
        // Observe navigation links
        document.querySelectorAll('a[href^="/"]').forEach(link => {
            this.observeElement(link, link.href);
        });
    }
}

// Initialize and export instance
const resourceHints = new ResourceHintsManager();
export default resourceHints;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    resourceHints.initCriticalResources();
    resourceHints.initRoutePrefetching();
});

// Export types for TypeScript (if needed)
/**
 * @typedef {Object} ResourceHints
 * @property {(url: string, as?: string, type?: string) => void} addPreload
 * @property {(url: string) => void} addPrefetch
 * @property {(url: string, crossorigin?: boolean) => void} addPreconnect
 * @property {(element: HTMLElement, url: string) => void} observeElement
 * @property {(url: string) => void} prefetchUrl
 * @property {(url: string) => void} addDnsPrefetch
 * @property {(url: string) => void} addPrerender
 * @property {() => void} initCriticalResources
 * @property {() => void} initRoutePrefetching
 */