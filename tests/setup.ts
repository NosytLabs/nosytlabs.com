/**
 * Vitest Test Setup
 * 
 * @fileoverview Global test setup for unit tests including DOM environment,
 * mocks, and testing utilities configuration.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ========== GLOBAL MOCKS ==========

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods for cleaner test output
const originalConsole = { ...console };
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// ========== PERFORMANCE MOCKS ==========

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn().mockReturnValue(Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn().mockReturnValue([]),
    getEntriesByName: vi.fn().mockReturnValue([]),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    navigation: {
      type: 0,
    },
    timing: {
      navigationStart: Date.now(),
      loadEventEnd: Date.now() + 1000,
    },
  },
});

// ========== NAVIGATION MOCKS ==========

// Mock location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock history
Object.defineProperty(window, 'history', {
  value: {
    length: 1,
    state: null,
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
  writable: true,
});

// ========== MEDIA MOCKS ==========

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

// ========== CUSTOM MATCHERS ==========

// Extend expect with custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  
  toHavePerformanceMetric(received: any, metric: string) {
    const hasMetric = received && typeof received[metric] === 'number';
    if (hasMetric) {
      return {
        message: () => `expected object not to have performance metric ${metric}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected object to have performance metric ${metric}`,
        pass: false,
      };
    }
  },
});

// ========== TEST UTILITIES ==========

// Global test utilities
global.testUtils = {
  // Wait for next tick
  nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Wait for specified time
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock component props
  mockProps: (overrides = {}) => ({
    className: '',
    children: null,
    ...overrides,
  }),
  
  // Create mock event
  mockEvent: (type: string, properties = {}) => ({
    type,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: { value: '' },
    currentTarget: { value: '' },
    ...properties,
  }),
  
  // Performance testing helper
  measurePerformance: async (fn: () => Promise<void> | void) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    return end - start;
  },
};

// ========== CLEANUP ==========

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Cleanup after all tests
afterAll(() => {
  // Restore original console
  global.console = originalConsole;
});

// ========== TYPE DECLARATIONS ==========

declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeWithinRange(floor: number, ceiling: number): T;
      toHavePerformanceMetric(metric: string): T;
    }
  }
  
  var testUtils: {
    nextTick: () => Promise<void>;
    wait: (ms: number) => Promise<void>;
    mockProps: (overrides?: Record<string, any>) => Record<string, any>;
    mockEvent: (type: string, properties?: Record<string, any>) => Record<string, any>;
    measurePerformance: (fn: () => Promise<void> | void) => Promise<number>;
  };
}
