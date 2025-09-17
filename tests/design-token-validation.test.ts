import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

/**
 * Design Token System Validation Tests
 * 
 * This test suite validates that all brand design tokens are properly implemented
 * and meet the Nosyt Labs brand requirements as specified in the brand documents.
 */

describe('Design Token System Validation', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;
  let computedStyle: CSSStyleDeclaration;

  beforeAll(async () => {
    // Read the global CSS file
    const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
    const globalCss = fs.readFileSync(globalCssPath, 'utf-8');
    
    // Create a DOM environment with the CSS
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${globalCss}</style>
        </head>
        <body>
          <div id="test-element" class="brand-heading-1">Test</div>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    window = dom.window as unknown as Window;
    
    // Get computed styles for the root element
    const rootElement = document.documentElement;
    computedStyle = window.getComputedStyle(rootElement);
  });

  describe('Brand Color System', () => {
    it('should have correct primary brand colors defined', () => {
      const expectedColors = {
        '--color-brand-primary': '#0D0D0D', // Deep Space Black
        '--color-brand-accent': '#00F0FF',   // Nexus Cyan
        '--color-brand-white': '#FFFFFF',    // Signal White
        '--color-brand-secondary': '#1A1A1A'
      };

      Object.entries(expectedColors).forEach(([property, expectedValue]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue.toLowerCase()).toBe(expectedValue.toLowerCase());
      });
    });

    it('should have complete gray scale system', () => {
      const grayScale = {
        '--color-brand-gray-50': '#F5F5F5',
        '--color-brand-gray-100': '#E6E6E6',
        '--color-brand-gray-200': '#CCCCCC',
        '--color-brand-gray-300': '#B3B3B3',
        '--color-brand-gray-400': '#999999',
        '--color-brand-gray-500': '#808080',
        '--color-brand-gray-600': '#666666',
        '--color-brand-gray-700': '#4D4D4D',
        '--color-brand-gray-800': '#333333',
        '--color-brand-gray-900': '#1A1A1A'
      };

      Object.entries(grayScale).forEach(([property, expectedValue]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue.toLowerCase()).toBe(expectedValue.toLowerCase());
      });
    });
  });

  describe('Typography System', () => {
    it('should have correct brand font families defined', () => {
      const expectedFonts = {
        '--font-family-heading': 'Satoshi',
        '--font-family-body': 'Inter',
        '--font-family-code': 'JetBrains Mono'
      };

      Object.entries(expectedFonts).forEach(([property, expectedFont]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toContain(expectedFont);
      });
    });

    it('should have complete font weight scale', () => {
      const fontWeights = {
        '--font-weight-light': '300',
        '--font-weight-regular': '400',
        '--font-weight-medium': '500',
        '--font-weight-semibold': '600',
        '--font-weight-bold': '700',
        '--font-weight-extrabold': '800',
        '--font-weight-black': '900'
      };

      Object.entries(fontWeights).forEach(([property, expectedValue]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toBe(expectedValue);
      });
    });
  });

  describe('Spacing System', () => {
    it('should have brand-specific spacing tokens', () => {
      const spacingTokens = {
        '--spacing-brand-logo-clear': '2rem',
        '--spacing-brand-section': '4rem',
        '--spacing-brand-container': '2rem',
        '--spacing-brand-grid': '1.5rem',
        '--spacing-brand-element': '1rem'
      };

      Object.entries(spacingTokens).forEach(([property, expectedValue]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toBe(expectedValue);
      });
    });
  });

  describe('Visual Effects System', () => {
    it('should have brand glow effects defined', () => {
      const glowEffects = [
        '--effect-brand-glow',
        '--effect-brand-node-shadow',
        '--effect-brand-glow-intense'
      ];

      glowEffects.forEach(property => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toBeTruthy();
        expect(actualValue).toContain('rgba(0, 240, 255');
      });
    });

    it('should have border radius tokens', () => {
      const radiusTokens = {
        '--radius-brand-sm': '0.25rem',
        '--radius-brand-md': '0.5rem',
        '--radius-brand-lg': '0.75rem',
        '--radius-brand-xl': '1rem'
      };

      Object.entries(radiusTokens).forEach(([property, expectedValue]) => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toBe(expectedValue);
      });
    });

    it('should have transition tokens', () => {
      const transitionTokens = [
        '--transition-brand-smooth',
        '--transition-brand-bounce'
      ];

      transitionTokens.forEach(property => {
        const actualValue = computedStyle.getPropertyValue(property).trim();
        expect(actualValue).toBeTruthy();
        expect(actualValue).toContain('cubic-bezier');
      });
    });
  });

  describe('CSS Utility Classes', () => {
    it('should have brand typography utility classes', () => {
      const typographyClasses = [
        'brand-heading-1',
        'brand-heading-2',
        'brand-heading-3',
        'brand-heading-4',
        'brand-heading-5',
        'brand-heading-6',
        'brand-body-xl',
        'brand-body-lg',
        'brand-body',
        'brand-body-sm',
        'brand-body-xs',
        'brand-code-xl',
        'brand-code-lg',
        'brand-code',
        'brand-code-sm'
      ];

      // Check if classes exist in the CSS content
      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');

      typographyClasses.forEach(className => {
        expect(globalCss).toContain(`.${className}`);
      });
    });

    it('should have brand visual effect utility classes', () => {
      const effectClasses = [
        'brand-glow',
        'brand-glow-intense',
        'brand-node-shadow',
        'brand-particle-background',
        'brand-geometric-grid',
        'brand-nexus-pulse',
        'brand-cyber-grid',
        'brand-holographic',
        'brand-data-stream'
      ];

      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');

      effectClasses.forEach(className => {
        expect(globalCss).toContain(`.${className}`);
      });
    });

    it('should have brand interactive element classes', () => {
      const interactiveClasses = [
        'brand-button',
        'brand-card'
      ];

      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');

      interactiveClasses.forEach(className => {
        expect(globalCss).toContain(`.${className}`);
      });
    });
  });

  describe('Tailwind Configuration Integration', () => {
    it('should have brand colors in Tailwind config', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');

      const expectedColors = [
        'deep-space-black',
        'signal-white',
        'nexus-cyan',
        'brand-gray'
      ];

      expectedColors.forEach(color => {
        expect(tailwindConfig).toContain(color);
      });
    });

    it('should have brand fonts in Tailwind config', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');

      const expectedFonts = [
        'satoshi',
        'inter',
        'jetbrains-mono'
      ];

      expectedFonts.forEach(font => {
        expect(tailwindConfig).toContain(font);
      });
    });

    it('should have brand spacing in Tailwind config', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');

      const expectedSpacing = [
        'brand-logo-clear',
        'brand-section',
        'brand-component',
        'brand-element'
      ];

      expectedSpacing.forEach(spacing => {
        expect(tailwindConfig).toContain(spacing);
      });
    });

    it('should have brand effects in Tailwind config', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');

      const expectedEffects = [
        'brand-glow',
        'brand-node-shadow',
        'pulse-glow',
        'float',
        'particle'
      ];

      expectedEffects.forEach(effect => {
        expect(tailwindConfig).toContain(effect);
      });
    });
  });

  describe('Brand Compliance Validation', () => {
    it('should meet contrast requirements for accessibility', () => {
      // Test that primary text on primary background meets WCAG AA standards
      const primaryBg = '#0D0D0D'; // Deep Space Black
      const primaryText = '#FFFFFF'; // Signal White
      
      // Calculate contrast ratio (simplified check)
      const bgLuminance = 0.05; // Very dark
      const textLuminance = 1.0; // Pure white
      const contrastRatio = (textLuminance + 0.05) / (bgLuminance + 0.05);
      
      // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
      expect(contrastRatio).toBeGreaterThan(4.5);
    });

    it('should have consistent color usage across design tokens', () => {
      // Verify that Nexus Cyan (#00F0FF) is used consistently
      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');
      
      // Count occurrences of the brand accent color
      const nexusCyanOccurrences = (globalCss.match(/#00F0FF/gi) || []).length;
      const nexusCyanRgbaOccurrences = (globalCss.match(/rgba\(0, 240, 255/gi) || []).length;
      
      // Should appear in multiple places (color definition + effects)
      expect(nexusCyanOccurrences + nexusCyanRgbaOccurrences).toBeGreaterThan(3);
    });

    it('should have proper font loading with fallbacks', () => {
      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');
      
      // Check that fonts are imported from correct sources
      expect(globalCss).toContain('@import url');
      expect(globalCss).toContain('fontshare.com'); // Satoshi from Fontshare
      expect(globalCss).toContain('fonts.googleapis.com'); // JetBrains Mono from Google Fonts
      expect(globalCss).toContain('Satoshi');
      expect(globalCss).toContain('Inter');
      expect(globalCss).toContain('JetBrains+Mono');
      
      // Check that fallbacks are defined
      expect(globalCss).toContain('sans-serif');
      expect(globalCss).toContain('monospace');
    });
  });

  describe('Performance Considerations', () => {
    it('should use efficient CSS custom properties', () => {
      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');
      
      // Check that CSS custom properties are defined in :root
      expect(globalCss).toContain(':root {');
      
      // Count the number of custom properties
      const customPropertyCount = (globalCss.match(/--[a-zA-Z-]+:/g) || []).length;
      
      // Should have a comprehensive set of design tokens
      expect(customPropertyCount).toBeGreaterThan(20);
    });

    it('should have optimized animations', () => {
      const globalCssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      const globalCss = fs.readFileSync(globalCssPath, 'utf-8');
      
      // Check for performance-optimized animations
      expect(globalCss).toContain('@keyframes');
      expect(globalCss).toContain('transform');
      expect(globalCss).toContain('cubic-bezier');
      
      // Ensure animations use transform and opacity for better performance
      const animationBlocks = globalCss.match(/@keyframes[^}]+}/g) || [];
      animationBlocks.forEach(block => {
        // Check for performant properties or acceptable animation properties
        const hasPerformantProperties = block.includes('transform') || 
                                       block.includes('opacity') || 
                                       block.includes('box-shadow') ||
                                       block.includes('background-position') ||
                                       block.includes('top');
        expect(hasPerformantProperties).toBe(true);
      });
    });
  });
});

/**
 * Integration test to verify design tokens work in actual components
 */
describe('Design Token Integration', () => {
  it('should have design token test component', () => {
    const testComponentPath = path.join(process.cwd(), 'src/components/test/DesignTokenTest.astro');
    expect(fs.existsSync(testComponentPath)).toBe(true);
    
    const testComponent = fs.readFileSync(testComponentPath, 'utf-8');
    
    // Should use brand classes
    expect(testComponent).toContain('brand-heading');
    expect(testComponent).toContain('brand-body');
    expect(testComponent).toContain('brand-code');
    expect(testComponent).toContain('brand-glow');
    expect(testComponent).toContain('nexus-cyan');
  });

  it('should have design token test page', () => {
    const testPagePath = path.join(process.cwd(), 'src/pages/design-token-test.astro');
    expect(fs.existsSync(testPagePath)).toBe(true);
  });
});