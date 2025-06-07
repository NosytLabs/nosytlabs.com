/**
 * Performance Optimizer Unit Tests
 * 
 * @fileoverview Comprehensive unit tests for the PerformanceOptimizer class
 * including Core Web Vitals monitoring, resource optimization, and performance validation.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformanceOptimizer, PERFORMANCE_TARGETS, CRITICAL_RESOURCES, RESOURCE_HINTS } from '@/utils/performance-optimizer';

// Mock DOM environment
const mockDocument = {
  createElement: vi.fn(),
  head: {
    appendChild: vi.fn(),
    insertBefore: vi.fn(),
    firstChild: null,
  },
  querySelectorAll: vi.fn(),
};

const mockElement = {
  rel: '',
  href: '',
  as: '',
  type: '',
  crossOrigin: '',
  src: '',
  dataset: { src: '' },
  removeAttribute: vi.fn(),
  setAttribute: vi.fn(),
  hasAttribute: vi.fn(),
  textContent: '',
};

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.prototype.observe = vi.fn();
mockIntersectionObserver.prototype.unobserve = vi.fn();
mockIntersectionObserver.prototype.disconnect = vi.fn();

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn();
mockPerformanceObserver.prototype.observe = vi.fn();
mockPerformanceObserver.prototype.disconnect = vi.fn();

describe('PerformanceOptimizer', () => {
  let optimizer: PerformanceOptimizer;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock global objects
    global.document = mockDocument as any;
    global.IntersectionObserver = mockIntersectionObserver as any;
    global.PerformanceObserver = mockPerformanceObserver as any;
    global.window = {
      addEventListener: vi.fn(),
    } as any;
    
    // Mock createElement to return mock element
    mockDocument.createElement.mockReturnValue(mockElement);
    mockDocument.querySelectorAll.mockReturnValue([mockElement]);
    
    optimizer = new PerformanceOptimizer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize performance monitoring', () => {
      expect(optimizer).toBeInstanceOf(PerformanceOptimizer);
    });

    it('should set up PerformanceObserver for Core Web Vitals', () => {
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });
  });

  describe('preloadCriticalResources', () => {
    it('should create preload links for all critical resources', () => {
      optimizer.preloadCriticalResources();

      expect(mockDocument.createElement).toHaveBeenCalledTimes(CRITICAL_RESOURCES.length);
      expect(mockDocument.head.appendChild).toHaveBeenCalledTimes(CRITICAL_RESOURCES.length);
    });

    it('should set correct attributes for font resources', () => {
      optimizer.preloadCriticalResources();

      const fontResource = CRITICAL_RESOURCES.find(r => r.as === 'font');
      if (fontResource) {
        expect(mockElement.rel).toBe('preload');
        expect(mockElement.as).toBe('font');
        expect(mockElement.type).toBe('font/woff2');
        expect(mockElement.crossOrigin).toBe('anonymous');
      }
    });

    it('should set correct attributes for image resources', () => {
      optimizer.preloadCriticalResources();

      const imageResource = CRITICAL_RESOURCES.find(r => r.as === 'image');
      if (imageResource) {
        expect(mockElement.rel).toBe('preload');
        expect(mockElement.as).toBe('image');
      }
    });

    it('should handle missing document gracefully', () => {
      global.document = undefined as any;
      
      expect(() => {
        optimizer.preloadCriticalResources();
      }).not.toThrow();
    });
  });

  describe('addResourceHints', () => {
    it('should create resource hint links for all external domains', () => {
      optimizer.addResourceHints();

      expect(mockDocument.createElement).toHaveBeenCalledTimes(RESOURCE_HINTS.length);
      expect(mockDocument.head.appendChild).toHaveBeenCalledTimes(RESOURCE_HINTS.length);
    });

    it('should set correct attributes for preconnect hints', () => {
      optimizer.addResourceHints();

      const preconnectHint = RESOURCE_HINTS.find(h => h.rel === 'preconnect');
      if (preconnectHint) {
        expect(mockElement.rel).toBe('preconnect');
        expect(mockElement.href).toBe(preconnectHint.href);
      }
    });

    it('should set crossorigin attribute when specified', () => {
      optimizer.addResourceHints();

      const crossoriginHint = RESOURCE_HINTS.find(h => h.crossorigin);
      if (crossoriginHint) {
        expect(mockElement.crossOrigin).toBe('anonymous');
      }
    });

    it('should handle missing document gracefully', () => {
      global.document = undefined as any;
      
      expect(() => {
        optimizer.addResourceHints();
      }).not.toThrow();
    });
  });

  describe('optimizeImages', () => {
    beforeEach(() => {
      // Mock images with data-src attribute
      const mockImages = [
        { ...mockElement, dataset: { src: '/image1.jpg' } },
        { ...mockElement, dataset: { src: '/image2.jpg' } },
      ];
      mockDocument.querySelectorAll.mockReturnValue(mockImages);
    });

    it('should create IntersectionObserver for lazy loading', () => {
      optimizer.optimizeImages();

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '50px 0px',
          threshold: 0.01
        })
      );
    });

    it('should observe all images with data-src attribute', () => {
      optimizer.optimizeImages();

      const observerInstance = mockIntersectionObserver.mock.instances[0];
      expect(observerInstance.observe).toHaveBeenCalledTimes(2);
    });

    it('should handle missing document gracefully', () => {
      global.document = undefined as any;
      
      expect(() => {
        optimizer.optimizeImages();
      }).not.toThrow();
    });
  });

  describe('optimizeFonts', () => {
    it('should create style element with font-display swap', () => {
      optimizer.optimizeFonts();

      expect(mockDocument.createElement).toHaveBeenCalledWith('style');
      expect(mockElement.textContent).toContain('font-display: swap');
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    it('should include Inter font family', () => {
      optimizer.optimizeFonts();

      expect(mockElement.textContent).toContain("font-family: 'Inter'");
    });

    it('should handle missing document gracefully', () => {
      global.document = undefined as any;
      
      expect(() => {
        optimizer.optimizeFonts();
      }).not.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('should return current performance metrics', () => {
      const metrics = optimizer.getMetrics();

      expect(metrics).toBeTypeOf('object');
      expect(metrics).toEqual(expect.any(Object));
    });

    it('should return a copy of metrics object', () => {
      const metrics1 = optimizer.getMetrics();
      const metrics2 = optimizer.getMetrics();

      expect(metrics1).not.toBe(metrics2);
      expect(metrics1).toEqual(metrics2);
    });
  });

  describe('checkPerformanceTargets', () => {
    it('should return passed true when no metrics are set', () => {
      const result = optimizer.checkPerformanceTargets();

      expect(result).toEqual({
        passed: true,
        issues: []
      });
    });

    it('should identify LCP issues when target is exceeded', () => {
      // Simulate LCP metric exceeding target
      optimizer['metrics'].LCP = PERFORMANCE_TARGETS.LCP + 1000;

      const result = optimizer.checkPerformanceTargets();

      expect(result.passed).toBe(false);
      expect(result.issues).toContain(
        expect.stringContaining('LCP:')
      );
    });

    it('should identify FID issues when target is exceeded', () => {
      // Simulate FID metric exceeding target
      optimizer['metrics'].FID = PERFORMANCE_TARGETS.FID + 50;

      const result = optimizer.checkPerformanceTargets();

      expect(result.passed).toBe(false);
      expect(result.issues).toContain(
        expect.stringContaining('FID:')
      );
    });

    it('should identify CLS issues when target is exceeded', () => {
      // Simulate CLS metric exceeding target
      optimizer['metrics'].CLS = PERFORMANCE_TARGETS.CLS + 0.1;

      const result = optimizer.checkPerformanceTargets();

      expect(result.passed).toBe(false);
      expect(result.issues).toContain(
        expect.stringContaining('CLS:')
      );
    });

    it('should return multiple issues when multiple targets are exceeded', () => {
      // Simulate multiple metrics exceeding targets
      optimizer['metrics'].LCP = PERFORMANCE_TARGETS.LCP + 1000;
      optimizer['metrics'].FID = PERFORMANCE_TARGETS.FID + 50;
      optimizer['metrics'].CLS = PERFORMANCE_TARGETS.CLS + 0.1;

      const result = optimizer.checkPerformanceTargets();

      expect(result.passed).toBe(false);
      expect(result.issues).toHaveLength(3);
    });
  });

  describe('initialize', () => {
    it('should call all optimization methods', () => {
      const preloadSpy = vi.spyOn(optimizer, 'preloadCriticalResources');
      const hintsSpy = vi.spyOn(optimizer, 'addResourceHints');
      const imagesSpy = vi.spyOn(optimizer, 'optimizeImages');
      const fontsSpy = vi.spyOn(optimizer, 'optimizeFonts');

      optimizer.initialize();

      expect(preloadSpy).toHaveBeenCalled();
      expect(hintsSpy).toHaveBeenCalled();
      expect(imagesSpy).toHaveBeenCalled();
      expect(fontsSpy).toHaveBeenCalled();
    });
  });

  describe('Performance Constants', () => {
    it('should have valid performance targets', () => {
      expect(PERFORMANCE_TARGETS.LCP).toBeTypeOf('number');
      expect(PERFORMANCE_TARGETS.FID).toBeTypeOf('number');
      expect(PERFORMANCE_TARGETS.CLS).toBeTypeOf('number');
      expect(PERFORMANCE_TARGETS.FCP).toBeTypeOf('number');
      expect(PERFORMANCE_TARGETS.TTI).toBeTypeOf('number');
    });

    it('should have reasonable performance target values', () => {
      expect(PERFORMANCE_TARGETS.LCP).toBeWithinRange(1000, 5000);
      expect(PERFORMANCE_TARGETS.FID).toBeWithinRange(50, 300);
      expect(PERFORMANCE_TARGETS.CLS).toBeWithinRange(0, 1);
      expect(PERFORMANCE_TARGETS.FCP).toBeWithinRange(1000, 3000);
      expect(PERFORMANCE_TARGETS.TTI).toBeWithinRange(2000, 5000);
    });

    it('should have valid critical resources', () => {
      expect(CRITICAL_RESOURCES).toBeInstanceOf(Array);
      expect(CRITICAL_RESOURCES.length).toBeGreaterThan(0);
      
      CRITICAL_RESOURCES.forEach(resource => {
        expect(resource).toHaveProperty('href');
        expect(resource).toHaveProperty('as');
        expect(resource.href).toBeTypeOf('string');
        expect(resource.as).toBeTypeOf('string');
      });
    });

    it('should have valid resource hints', () => {
      expect(RESOURCE_HINTS).toBeInstanceOf(Array);
      expect(RESOURCE_HINTS.length).toBeGreaterThan(0);
      
      RESOURCE_HINTS.forEach(hint => {
        expect(hint).toHaveProperty('rel');
        expect(hint).toHaveProperty('href');
        expect(hint.rel).toBeTypeOf('string');
        expect(hint.href).toBeTypeOf('string');
      });
    });
  });
});
