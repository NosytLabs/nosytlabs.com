/**
 * Performance Regression Tests
 * 
 * @fileoverview Benchmark tests to detect performance regressions in critical
 * functions and ensure performance targets are maintained across code changes.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import { bench, describe } from 'vitest';
import { formatDate, parseDate, getRelativeTime, isValidDate } from '@/utils/dateUtils';
import { PerformanceOptimizer } from '@/utils/performance-optimizer';

// ========== PERFORMANCE BASELINES ==========

/**
 * Performance baselines for regression testing
 * These values represent acceptable performance thresholds
 */
const PERFORMANCE_BASELINES = {
  dateUtils: {
    formatDate: 1, // ms
    parseDate: 2, // ms
    getRelativeTime: 1, // ms
    isValidDate: 0.1, // ms
  },
  performanceOptimizer: {
    initialization: 10, // ms
    preloadResources: 5, // ms
    addResourceHints: 5, // ms
    optimizeImages: 3, // ms
    optimizeFonts: 2, // ms
  },
  domOperations: {
    createElement: 0.1, // ms
    appendChild: 0.1, // ms
    querySelector: 1, // ms
    querySelectorAll: 2, // ms
  }
} as const;

// ========== TEST DATA ==========

const testDates = [
  new Date('2024-01-15T12:00:00.000Z'),
  new Date('2023-12-25T00:00:00.000Z'),
  new Date('2024-06-30T23:59:59.999Z'),
  new Date(0), // Unix epoch
  new Date(),
];

const testDateStrings = [
  '2024-01-15T12:00:00.000Z',
  '2024-01-15',
  '01/15/2024',
  'January 15, 2024',
  'Jan 15, 2024',
];

// ========== DATE UTILITIES BENCHMARKS ==========

describe('Date Utilities Performance', () => {
  bench('formatDate - single date', () => {
    formatDate(testDates[0]);
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('formatDate - multiple dates', () => {
    testDates.forEach(date => formatDate(date));
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('formatDate - with custom format', () => {
    formatDate(testDates[0], 'MM/dd/yyyy');
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('parseDate - ISO string', () => {
    parseDate('2024-01-15T12:00:00.000Z');
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('parseDate - multiple formats', () => {
    testDateStrings.forEach(dateStr => parseDate(dateStr));
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('getRelativeTime - recent dates', () => {
    const now = new Date();
    const recentDate = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    getRelativeTime(recentDate, now);
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('getRelativeTime - various time ranges', () => {
    const now = new Date();
    const dates = [
      new Date(now.getTime() - 30000), // 30 seconds
      new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes
      new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours
      new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days
    ];
    
    dates.forEach(date => getRelativeTime(date, now));
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('isValidDate - valid dates', () => {
    testDates.forEach(date => isValidDate(date));
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('isValidDate - mixed valid/invalid', () => {
    const mixedDates = [
      new Date('2024-01-15'),
      new Date('invalid'),
      null,
      undefined,
      '2024-01-15',
      1705320000000,
    ];
    
    mixedDates.forEach(date => isValidDate(date as any));
  }, {
    time: 1000,
    iterations: 10000,
  });
});

// ========== PERFORMANCE OPTIMIZER BENCHMARKS ==========

describe('Performance Optimizer Performance', () => {
  // Mock DOM environment for benchmarks
  const mockDocument = {
    createElement: () => ({
      rel: '',
      href: '',
      as: '',
      type: '',
      crossOrigin: '',
      textContent: '',
    }),
    head: {
      appendChild: () => {},
      insertBefore: () => {},
      firstChild: null,
    },
    querySelectorAll: () => [],
  };

  const mockIntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  const mockPerformanceObserver = class {
    observe() {}
    disconnect() {}
  };

  // Set up mocks
  global.document = mockDocument as any;
  global.IntersectionObserver = mockIntersectionObserver as any;
  global.PerformanceObserver = mockPerformanceObserver as any;
  global.window = { addEventListener: () => {} } as any;

  bench('PerformanceOptimizer - initialization', () => {
    new PerformanceOptimizer();
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('PerformanceOptimizer - preloadCriticalResources', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.preloadCriticalResources();
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('PerformanceOptimizer - addResourceHints', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.addResourceHints();
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('PerformanceOptimizer - optimizeImages', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.optimizeImages();
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('PerformanceOptimizer - optimizeFonts', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.optimizeFonts();
  }, {
    time: 1000,
    iterations: 1000,
  });

  bench('PerformanceOptimizer - full initialization', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.initialize();
  }, {
    time: 1000,
    iterations: 500,
  });

  bench('PerformanceOptimizer - getMetrics', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.getMetrics();
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('PerformanceOptimizer - checkPerformanceTargets', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.checkPerformanceTargets();
  }, {
    time: 1000,
    iterations: 10000,
  });
});

// ========== DOM OPERATIONS BENCHMARKS ==========

describe('DOM Operations Performance', () => {
  const mockElement = {
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => '',
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false,
    },
  };

  const mockDocument = {
    createElement: () => mockElement,
    getElementById: () => mockElement,
    querySelector: () => mockElement,
    querySelectorAll: () => [mockElement, mockElement, mockElement],
    createTextNode: () => ({ textContent: '' }),
  };

  global.document = mockDocument as any;

  bench('createElement - single element', () => {
    document.createElement('div');
  }, {
    time: 1000,
    iterations: 100000,
  });

  bench('createElement - multiple elements', () => {
    const elements = ['div', 'span', 'p', 'a', 'img'];
    elements.forEach(tag => document.createElement(tag));
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('querySelector - single query', () => {
    document.querySelector('.test-class');
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('querySelectorAll - multiple elements', () => {
    document.querySelectorAll('.test-class');
  }, {
    time: 1000,
    iterations: 5000,
  });

  bench('DOM manipulation - appendChild', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('DOM manipulation - setAttribute', () => {
    const element = document.createElement('div');
    element.setAttribute('class', 'test-class');
    element.setAttribute('id', 'test-id');
    element.setAttribute('data-test', 'value');
  }, {
    time: 1000,
    iterations: 10000,
  });
});

// ========== MEMORY USAGE BENCHMARKS ==========

describe('Memory Usage Performance', () => {
  bench('Array operations - large array creation', () => {
    const largeArray = new Array(10000).fill(0).map((_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random(),
    }));
    
    // Simulate some operations
    largeArray.filter(item => item.value > 0.5);
    largeArray.map(item => ({ ...item, processed: true }));
  }, {
    time: 1000,
    iterations: 100,
  });

  bench('Object operations - deep cloning', () => {
    const complexObject = {
      level1: {
        level2: {
          level3: {
            data: new Array(1000).fill(0).map((_, i) => ({ id: i, value: i * 2 })),
          },
        },
      },
    };
    
    JSON.parse(JSON.stringify(complexObject));
  }, {
    time: 1000,
    iterations: 100,
  });

  bench('String operations - template literals', () => {
    const data = { name: 'Test', id: 123, value: 456.789 };
    const template = `Name: ${data.name}, ID: ${data.id}, Value: ${data.value.toFixed(2)}`;
  }, {
    time: 1000,
    iterations: 10000,
  });

  bench('String operations - concatenation vs template', () => {
    const data = { name: 'Test', id: 123, value: 456.789 };
    
    // Template literal
    const template = `Name: ${data.name}, ID: ${data.id}, Value: ${data.value.toFixed(2)}`;
    
    // String concatenation
    const concat = 'Name: ' + data.name + ', ID: ' + data.id + ', Value: ' + data.value.toFixed(2);
  }, {
    time: 1000,
    iterations: 10000,
  });
});
