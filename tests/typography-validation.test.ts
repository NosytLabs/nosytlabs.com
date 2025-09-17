import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Typography System Validation', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;

  beforeAll(async () => {
    // Read the fonts.css file
    const fontsCSS = fs.readFileSync(
      path.join(process.cwd(), 'src/styles/fonts.css'),
      'utf-8'
    );

    // Create JSDOM instance with CSS
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${fontsCSS}</style>
        </head>
        <body>
          <div id="test-container">
            <h1 class="heading-display">Display Heading</h1>
            <h2 class="heading-primary">Primary Heading</h2>
            <h3 class="heading-secondary">Secondary Heading</h3>
            <p class="body-large">Large body text</p>
            <p class="body-regular">Regular body text</p>
            <p class="body-small">Small body text</p>
            <code class="code-inline">inline code</code>
            <pre class="code-block">code block</pre>
            <span class="caption">Caption Text</span>
            <label class="label">Label Text</label>
            <div class="font-brand-primary">Primary Font</div>
            <div class="font-brand-secondary">Secondary Font</div>
            <div class="font-brand-mono">Monospace Font</div>
          </div>
        </body>
      </html>
    `, {
      resources: 'usable',
      runScripts: 'dangerously'
    });

    document = dom.window.document;
    window = dom.window as Window & typeof globalThis;

    // Mock CSS custom properties
    const mockComputedStyle = {
      getPropertyValue: (property: string) => {
        const cssVars: Record<string, string> = {
          '--font-brand-primary': 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          '--font-brand-secondary': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          '--font-brand-mono': 'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          '--font-weight-light': '300',
          '--font-weight-regular': '400',
          '--font-weight-medium': '500',
          '--font-weight-semibold': '600',
          '--font-weight-bold': '700',
          '--font-weight-extrabold': '800',
          '--font-weight-black': '900',
          '--font-size-xs': '0.75rem',
          '--font-size-sm': '0.875rem',
          '--font-size-base': '1rem',
          '--font-size-lg': '1.125rem',
          '--font-size-xl': '1.25rem',
          '--font-size-2xl': '1.5rem',
          '--font-size-3xl': '1.875rem',
          '--font-size-4xl': '2.25rem',
          '--font-size-5xl': '3rem',
          '--font-size-6xl': '3.75rem',
          '--font-size-7xl': '4.5rem',
          '--font-size-8xl': '6rem',
          '--font-size-9xl': '8rem',
          '--line-height-none': '1',
          '--line-height-tight': '1.25',
          '--line-height-snug': '1.375',
          '--line-height-normal': '1.5',
          '--line-height-relaxed': '1.625',
          '--line-height-loose': '2',
          '--letter-spacing-tighter': '-0.05em',
          '--letter-spacing-tight': '-0.025em',
          '--letter-spacing-normal': '0em',
          '--letter-spacing-wide': '0.025em',
          '--letter-spacing-wider': '0.05em',
          '--letter-spacing-widest': '0.1em'
        };
        return cssVars[property] || '';
      }
    };

    // Mock getComputedStyle
    window.getComputedStyle = () => mockComputedStyle as CSSStyleDeclaration;
  });

  describe('Font Family Definitions', () => {
    it('should define primary brand font family', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const primaryFont = rootStyles.getPropertyValue('--font-brand-primary');
      expect(primaryFont).toContain('Satoshi');
      expect(primaryFont).toContain('system-ui');
      expect(primaryFont).toContain('sans-serif');
    });

    it('should define secondary brand font family', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const secondaryFont = rootStyles.getPropertyValue('--font-brand-secondary');
      expect(secondaryFont).toContain('Inter');
      expect(secondaryFont).toContain('system-ui');
      expect(secondaryFont).toContain('sans-serif');
    });

    it('should define monospace brand font family', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const monoFont = rootStyles.getPropertyValue('--font-brand-mono');
      expect(monoFont).toContain('JetBrains Mono');
      expect(monoFont).toContain('monospace');
    });
  });

  describe('Font Weight Tokens', () => {
    it('should define all font weight tokens', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      expect(rootStyles.getPropertyValue('--font-weight-light')).toBe('300');
      expect(rootStyles.getPropertyValue('--font-weight-regular')).toBe('400');
      expect(rootStyles.getPropertyValue('--font-weight-medium')).toBe('500');
      expect(rootStyles.getPropertyValue('--font-weight-semibold')).toBe('600');
      expect(rootStyles.getPropertyValue('--font-weight-bold')).toBe('700');
      expect(rootStyles.getPropertyValue('--font-weight-extrabold')).toBe('800');
      expect(rootStyles.getPropertyValue('--font-weight-black')).toBe('900');
    });
  });

  describe('Font Size Scale', () => {
    it('should define complete font size scale', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      expect(rootStyles.getPropertyValue('--font-size-xs')).toBe('0.75rem');
      expect(rootStyles.getPropertyValue('--font-size-sm')).toBe('0.875rem');
      expect(rootStyles.getPropertyValue('--font-size-base')).toBe('1rem');
      expect(rootStyles.getPropertyValue('--font-size-lg')).toBe('1.125rem');
      expect(rootStyles.getPropertyValue('--font-size-xl')).toBe('1.25rem');
      expect(rootStyles.getPropertyValue('--font-size-2xl')).toBe('1.5rem');
      expect(rootStyles.getPropertyValue('--font-size-3xl')).toBe('1.875rem');
      expect(rootStyles.getPropertyValue('--font-size-4xl')).toBe('2.25rem');
      expect(rootStyles.getPropertyValue('--font-size-5xl')).toBe('3rem');
    });

    it('should follow consistent scaling ratio', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      const baseSize = parseFloat(rootStyles.getPropertyValue('--font-size-base'));
      const lgSize = parseFloat(rootStyles.getPropertyValue('--font-size-lg'));
      const xlSize = parseFloat(rootStyles.getPropertyValue('--font-size-xl'));
      
      // Check if sizes follow approximately 1.25 ratio (Major Third)
      const lgRatio = lgSize / baseSize;
      const xlRatio = xlSize / lgSize;
      
      expect(lgRatio).toBeCloseTo(1.125, 2);
      expect(xlRatio).toBeCloseTo(1.111, 2);
    });
  });

  describe('Line Height Tokens', () => {
    it('should define all line height tokens', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      expect(rootStyles.getPropertyValue('--line-height-none')).toBe('1');
      expect(rootStyles.getPropertyValue('--line-height-tight')).toBe('1.25');
      expect(rootStyles.getPropertyValue('--line-height-snug')).toBe('1.375');
      expect(rootStyles.getPropertyValue('--line-height-normal')).toBe('1.5');
      expect(rootStyles.getPropertyValue('--line-height-relaxed')).toBe('1.625');
      expect(rootStyles.getPropertyValue('--line-height-loose')).toBe('2');
    });
  });

  describe('Letter Spacing Tokens', () => {
    it('should define all letter spacing tokens', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      expect(rootStyles.getPropertyValue('--letter-spacing-tighter')).toBe('-0.05em');
      expect(rootStyles.getPropertyValue('--letter-spacing-tight')).toBe('-0.025em');
      expect(rootStyles.getPropertyValue('--letter-spacing-normal')).toBe('0em');
      expect(rootStyles.getPropertyValue('--letter-spacing-wide')).toBe('0.025em');
      expect(rootStyles.getPropertyValue('--letter-spacing-wider')).toBe('0.05em');
      expect(rootStyles.getPropertyValue('--letter-spacing-widest')).toBe('0.1em');
    });
  });

  describe('Typography Utility Classes', () => {
    it('should have font family utility classes', () => {
      const primaryFontEl = document.querySelector('.font-brand-primary');
      const secondaryFontEl = document.querySelector('.font-brand-secondary');
      const monoFontEl = document.querySelector('.font-brand-mono');
      
      expect(primaryFontEl).toBeTruthy();
      expect(secondaryFontEl).toBeTruthy();
      expect(monoFontEl).toBeTruthy();
    });

    it('should have typography preset classes', () => {
      const displayHeading = document.querySelector('.heading-display');
      const primaryHeading = document.querySelector('.heading-primary');
      const secondaryHeading = document.querySelector('.heading-secondary');
      const bodyLarge = document.querySelector('.body-large');
      const bodyRegular = document.querySelector('.body-regular');
      const bodySmall = document.querySelector('.body-small');
      const codeInline = document.querySelector('.code-inline');
      const codeBlock = document.querySelector('.code-block');
      const caption = document.querySelector('.caption');
      const label = document.querySelector('.label');
      
      expect(displayHeading).toBeTruthy();
      expect(primaryHeading).toBeTruthy();
      expect(secondaryHeading).toBeTruthy();
      expect(bodyLarge).toBeTruthy();
      expect(bodyRegular).toBeTruthy();
      expect(bodySmall).toBeTruthy();
      expect(codeInline).toBeTruthy();
      expect(codeBlock).toBeTruthy();
      expect(caption).toBeTruthy();
      expect(label).toBeTruthy();
    });
  });

  describe('CSS Font Loading', () => {
    it('should include font imports for all brand fonts', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      // Check for Satoshi import from Fontshare
      expect(fontsCSS).toContain('@import url(\'https://api.fontshare.com/v2/css?f[]=satoshi');
      
      // Check for Inter import from official source
      expect(fontsCSS).toContain('@import url(\'https://rsms.me/inter/inter.css\');');
      
      // Check for JetBrains Mono import
      expect(fontsCSS).toContain('JetBrains+Mono');
    });

    it('should have font-display: swap for performance', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('font-display: swap');
    });
  });

  describe('Accessibility and Performance', () => {
    it('should include font smoothing properties', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('-webkit-font-smoothing: antialiased');
      expect(fontsCSS).toContain('-moz-osx-font-smoothing: grayscale');
      expect(fontsCSS).toContain('text-rendering: optimizeLegibility');
    });

    it('should have proper fallback fonts', () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      
      const primaryFont = rootStyles.getPropertyValue('--font-brand-primary');
      const secondaryFont = rootStyles.getPropertyValue('--font-brand-secondary');
      const monoFont = rootStyles.getPropertyValue('--font-brand-mono');
      
      // Check fallbacks
      expect(primaryFont).toContain('-apple-system');
      expect(primaryFont).toContain('BlinkMacSystemFont');
      expect(primaryFont).toContain('system-ui');
      
      expect(secondaryFont).toContain('-apple-system');
      expect(secondaryFont).toContain('BlinkMacSystemFont');
      expect(secondaryFont).toContain('system-ui');
      
      expect(monoFont).toContain('Monaco');
      expect(monoFont).toContain('Consolas');
      expect(monoFont).toContain('monospace');
    });

    it('should enable font features for monospace font', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('font-feature-settings: \'liga\' 1, \'calt\' 1');
    });
  });

  describe('Responsive Typography', () => {
    it('should include responsive font size adjustments', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('@media (max-width: 768px)');
      expect(fontsCSS).toContain('--font-size-5xl: 2.25rem');
    });
  });

  describe('Default Element Styling', () => {
    it('should style heading elements with brand fonts', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('h1, h2, h3, h4, h5, h6');
      expect(fontsCSS).toContain('font-family: var(--font-brand-primary)');
    });

    it('should style body text with secondary font', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('body {');
      expect(fontsCSS).toContain('font-family: var(--font-brand-secondary)');
    });

    it('should style code elements with monospace font', () => {
      const fontsCSS = fs.readFileSync(
        path.join(process.cwd(), 'src/styles/fonts.css'),
        'utf-8'
      );
      
      expect(fontsCSS).toContain('code, pre');
      expect(fontsCSS).toContain('font-family: var(--font-brand-mono)');
    });
  });
});