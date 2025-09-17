// Test setup file
import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup JSDOM environment for testing
beforeAll(() => {
  // Configure JSDOM with necessary features
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:3000',
    pretendToBeVisual: true,
    resources: 'usable'
  });

  // Make DOM globals available
  global.window = dom.window as any;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.NodeList = dom.window.NodeList;
  global.getComputedStyle = dom.window.getComputedStyle;

  // Mock CSS custom property support
  Object.defineProperty(dom.window.CSSStyleDeclaration.prototype, 'getPropertyValue', {
    value: function(property: string) {
      // Mock CSS custom properties for testing
      const mockProperties: Record<string, string> = {
        '--color-brand-primary': '#0D0D0D',
        '--color-brand-accent': '#00F0FF',
        '--color-brand-white': '#FFFFFF',
        '--color-brand-secondary': '#1A1A1A',
        '--color-brand-gray-50': '#F5F5F5',
        '--color-brand-gray-100': '#E6E6E6',
        '--color-brand-gray-200': '#CCCCCC',
        '--color-brand-gray-300': '#B3B3B3',
        '--color-brand-gray-400': '#999999',
        '--color-brand-gray-500': '#808080',
        '--color-brand-gray-600': '#666666',
        '--color-brand-gray-700': '#4D4D4D',
        '--color-brand-gray-800': '#333333',
        '--color-brand-gray-900': '#1A1A1A',
        '--font-family-heading': 'Satoshi, sans-serif',
        '--font-family-body': 'Inter, sans-serif',
        '--font-family-code': 'JetBrains Mono, monospace',
        '--font-weight-light': '300',
        '--font-weight-regular': '400',
        '--font-weight-medium': '500',
        '--font-weight-semibold': '600',
        '--font-weight-bold': '700',
        '--font-weight-extrabold': '800',
        '--font-weight-black': '900',
        '--spacing-brand-logo-clear': '2rem',
        '--spacing-brand-section': '4rem',
        '--spacing-brand-container': '2rem',
        '--spacing-brand-grid': '1.5rem',
        '--spacing-brand-element': '1rem',
        '--effect-brand-glow': '0 0 20px rgba(0, 240, 255, 0.5)',
        '--effect-brand-node-shadow': '0 4px 20px rgba(0, 240, 255, 0.3)',
        '--effect-brand-glow-intense': '0 0 40px rgba(0, 240, 255, 0.8)',
        '--radius-brand-sm': '0.25rem',
        '--radius-brand-md': '0.5rem',
        '--radius-brand-lg': '0.75rem',
        '--radius-brand-xl': '1rem',
        '--transition-brand-smooth': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '--transition-brand-bounce': 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      };
      
      return mockProperties[property] || '';
    },
    writable: true,
    configurable: true
  });
});

afterAll(() => {
  // Cleanup
  delete (global as any).window;
  delete (global as any).document;
  delete (global as any).navigator;
  delete (global as any).HTMLElement;
  delete (global as any).Element;
  delete (global as any).Node;
  delete (global as any).NodeList;
  delete (global as any).getComputedStyle;
});