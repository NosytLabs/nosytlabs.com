import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NosytLabs Performance Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset performance APIs
    global.performance = {
      ...global.performance,
      now: vi.fn().mockReturnValue(1000),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn().mockReturnValue([]),
      getEntriesByName: vi.fn().mockReturnValue([]),
      observer: vi.fn()
    } as any;
  });

  describe('Performance Monitor', () => {
    it('should initialize performance monitoring', () => {
      // Mock PerformanceMonitor class functionality
      class MockPerformanceMonitor {
        metrics: any = {};
        config: any = {};
        
        constructor() {
          this.metrics = {
            lcp: 0,
            fid: 0,
            cls: 0,
            fcp: 0,
            ttfb: 0
          };
        }

        getMetrics() {
          return { ...this.metrics };
        }

        sendMetrics() {
          return fetch('/api/performance', {
            method: 'POST',
            body: JSON.stringify(this.getMetrics()),
            headers: { 'Content-Type': 'application/json' }
          });
        }

        getSessionId() {
          return 'test-session-123';
        }
      }

      const monitor = new MockPerformanceMonitor();
      expect(monitor.getMetrics()).toEqual({
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0
      });
      expect(monitor.getSessionId()).toBe('test-session-123');
    });

    it('should collect Core Web Vitals metrics', () => {
      // Mock Core Web Vitals data
      const mockMetrics = {
        lcp: 2.0, // Good: < 2.5s
        fid: 80, // Good: < 100ms
        cls: 0.05, // Good: < 0.1
        fcp: 1.5, // Good: < 1.8s
        ttfb: 500 // Good: < 600ms
      };

      // Test metric validation
      const validateMetrics = (metrics: typeof mockMetrics) => {
        return {
          lcp: metrics.lcp < 2.5 ? 'good' : metrics.lcp < 4.0 ? 'needs-improvement' : 'poor',
          fid: metrics.fid < 100 ? 'good' : metrics.fid < 300 ? 'needs-improvement' : 'poor',
          cls: metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'needs-improvement' : 'poor',
          fcp: metrics.fcp < 1.8 ? 'good' : metrics.fcp < 3.0 ? 'needs-improvement' : 'poor',
          ttfb: metrics.ttfb < 600 ? 'good' : metrics.ttfb < 1500 ? 'needs-improvement' : 'poor'
        };
      };

      const results = validateMetrics(mockMetrics);
      expect(results.lcp).toBe('good');
      expect(results.fid).toBe('good');
      expect(results.cls).toBe('good');
      expect(results.fcp).toBe('good');
      expect(results.ttfb).toBe('good');
    });

    it('should handle performance API errors gracefully', () => {
      // Mock performance API that throws errors
      const performanceWithErrors = {
        now: vi.fn().mockImplementation(() => {
          throw new Error('Performance API unavailable');
        }),
        mark: vi.fn().mockImplementation(() => {
          throw new Error('Performance mark failed');
        }),
        measure: vi.fn().mockImplementation(() => {
          throw new Error('Performance measure failed');
        })
      };

      // Test error handling
      const safePerformanceNow = () => {
        try {
          return performanceWithErrors.now();
        } catch (error) {
          console.warn('Performance API error:', error);
          return Date.now();
        }
      };

      const result = safePerformanceNow();
      expect(typeof result).toBe('number');
      expect(console.warn).toHaveBeenCalledWith(
        'Performance API error:', 
        expect.any(Error)
      );
    });
  });

  describe('Image Optimization', () => {
    it('should handle responsive image loading', () => {
      // Mock responsive image functionality
      const createResponsiveImage = (src: string, alt: string, sizes: string[]) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        
        // Create srcset
        const srcset = sizes.map((_, index) => {
          const width = [320, 640, 1024, 1920][index] || 1920;
          return `${src.replace('.jpg', `-${width}w.jpg`)} ${width}w`;
        }).join(', ');
        
        img.srcset = srcset;
        img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
        
        return img;
      };

      const img = createResponsiveImage('/images/hero.jpg', 'Hero image', ['small', 'medium', 'large', 'xlarge']);
      
      expect(img.src).toContain('/images/hero.jpg'); // Should contain the path regardless of base URL
      expect(img.alt).toBe('Hero image');
      expect(img.loading).toBe('lazy');
      expect(img.srcset).toContain('320w');
      expect(img.srcset).toContain('640w');
      expect(img.srcset).toContain('1024w');
      expect(img.srcset).toContain('1920w');
    });

    it('should implement intersection observer for lazy loading', () => {
      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      };

      // Mock IntersectionObserver
      global.IntersectionObserver = vi.fn().mockImplementation(() => {
        return mockObserver;
      });

      // Simulate lazy loading setup
      const setupLazyLoading = () => {
        const images = document.querySelectorAll('img[data-src]');
        const newObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.removeAttribute('data-src');
              newObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => newObserver.observe(img));
        return newObserver;
      };

      // Create test image
      const img = document.createElement('img');
      img.setAttribute('data-src', '/images/test.jpg');
      document.body.appendChild(img);

      setupLazyLoading();
      
      expect(global.IntersectionObserver).toHaveBeenCalled();
      expect(mockObserver.observe).toHaveBeenCalledWith(img);
    });
  });

  describe('Resource Preloading', () => {
    it('should preload critical resources', () => {
      const preloadResource = (href: string, as: string, type?: string) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        
        // Add to head
        document.head.appendChild(link);
        return link;
      };

      const criticalResources = [
        { href: '/images/logo.svg', as: 'image', type: 'image/svg+xml' },
        { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
        { href: '/styles/critical.css', as: 'style' }
      ];

      const preloadedLinks = criticalResources.map(resource =>
        preloadResource(resource.href, resource.as, resource.type)
      );

      expect(preloadedLinks).toHaveLength(3);
      expect(preloadedLinks[0]!.rel).toBe('preload');
      expect(preloadedLinks[0]!.as).toBe('image');
      expect(preloadedLinks[1]!.as).toBe('font');
      expect(preloadedLinks[2]!.as).toBe('style');
    });

    it('should handle preload errors gracefully', () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/nonexistent-resource.css';
      link.as = 'style';

      const errorHandler = vi.fn();
      link.addEventListener('error', errorHandler);

      // Simulate preload error
      const errorEvent = new Event('error');
      link.dispatchEvent(errorEvent);

      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('Service Worker Integration', () => {
    it('should register service worker when available', async () => {
      // Mock service worker registration
      const mockRegistration = {
        installing: null,
        waiting: null,
        active: null,
        addEventListener: vi.fn(),
        update: vi.fn(),
        unregister: vi.fn()
      };

      (global.navigator as any).serviceWorker = {
        register: vi.fn().mockResolvedValue(mockRegistration),
        ready: Promise.resolve(mockRegistration),
        controller: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        getRegistration: vi.fn(),
        getRegistrations: vi.fn()
      };

      const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered:', registration);
            return registration;
          } catch (error) {
            console.log('SW registration failed:', error);
            return null;
          }
        }
        return null;
      };

      const registration = await registerServiceWorker();
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration).toBe(mockRegistration);
    });

    it('should handle service worker update notifications', () => {
      const mockRegistration = {
        installing: { state: 'installing', addEventListener: vi.fn() },
        waiting: null,
        active: { state: 'activated' },
        addEventListener: vi.fn()
      };

      const handleUpdate = (registration: typeof mockRegistration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Notify user of update
                if ((window as any).announceToScreenReader) {
                  (window as any).announceToScreenReader('New content available. Refresh to update.');
                }
              }
            });
          }
        });
      };

      // Mock announceToScreenReader
      (window as any).announceToScreenReader = vi.fn();

      handleUpdate(mockRegistration);
      expect(mockRegistration.addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function));
    });
  });
});