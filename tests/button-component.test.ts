import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Button Components', () => {
  const componentsDir = join(process.cwd(), 'src', 'components', 'ui');
  
  describe.skip('Astro Button Component (Button.astro)', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'Button.astro');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should exist and be a valid Astro component', () => {
      const filePath = join(componentsDir, 'Button.astro');
      expect(existsSync(filePath)).toBe(true);
    });
    
    it('should support all button variants', () => {
      expect(content).toContain('variant:');
      expect(content).toContain('default');
      expect(content).toContain('destructive');
      expect(content).toContain('outline');
      expect(content).toContain('secondary');
      expect(content).toContain('ghost');
      expect(content).toContain('link');
    });
    
    it('should support all button sizes', () => {
      expect(content).toContain('size:');
      expect(content).toContain('default');
      expect(content).toContain('sm');
      expect(content).toContain('lg');
      expect(content).toContain('icon');
    });
    
    it('should have proper TypeScript interface', () => {
      expect(content).toContain('export interface Props');
    });
    
    it('should use class variance authority for styling', () => {
      expect(content).toContain('import { cva, type VariantProps } from "class-variance-authority"');
      expect(content).toContain('buttonVariants');
    });
    
    it('should support additional class names', () => {
      expect(content).toContain('class:');
    });
    
    it('should use proper CSS classes', () => {
      expect(content).toContain('inline-flex');
      expect(content).toContain('items-center');
      expect(content).toContain('justify-center');
      expect(content).toContain('rounded-md');
      expect(content).toContain('font-medium');
    });
    
    it('should have accessibility features', () => {
      expect(content).toContain('focus-visible');
      expect(content).toContain('disabled');
    });
    
    it('should have proper transition effects', () => {
      expect(content).toContain('transition-colors');
    });
    
    it('should use brand color variables', () => {
      expect(content).toContain('--color-brand-accent');
      expect(content).toContain('--color-brand-primary');
      expect(content).toContain('--shadow-glow');
    });
  });
  
  describe.skip('React Brand Button Component (brand-button.jsx)', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'brand-button.jsx');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should exist and be a valid React component', () => {
      const filePath = join(componentsDir, 'brand-button.jsx');
      expect(existsSync(filePath)).toBe(true);
      expect(content).toContain('import * as React from "react"');
    });
    
    it('should support all brand button variants', () => {
      expect(content).toContain('variant:');
      expect(content).toContain('primary');
      expect(content).toContain('secondary');
      expect(content).toContain('outline');
      expect(content).toContain('ghost');
      expect(content).toContain('destructive');
      expect(content).toContain('success');
    });
    
    it('should support all brand button sizes', () => {
      expect(content).toContain('size:');
      expect(content).toContain('default');
      expect(content).toContain('sm');
      expect(content).toContain('lg');
      expect(content).toContain('xl');
      expect(content).toContain('icon');
      expect(content).toContain('iconSm');
      expect(content).toContain('iconLg');
    });
    
    it('should support rounded variants', () => {
      expect(content).toContain('rounded:');
      expect(content).toContain('default');
      expect(content).toContain('full');
      expect(content).toContain('lg');
      expect(content).toContain('xl');
    });
    
    it('should use class variance authority for styling', () => {
      expect(content).toContain('import { cva } from "class-variance-authority"');
      expect(content).toContain('brandButtonVariants');
    });
    
    it('should support asChild prop for composition', () => {
      expect(content).toContain('asChild');
      expect(content).toContain('Slot');
    });
    
    it('should have proper React component structure', () => {
      expect(content).toContain('React.forwardRef');
      expect(content).toContain('BrandButton.displayName');
    });
    
    it('should use proper CSS classes', () => {
      expect(content).toContain('inline-flex');
      expect(content).toContain('items-center');
      expect(content).toContain('justify-center');
      expect(content).toContain('gap-2');
      expect(content).toContain('rounded-md');
      expect(content).toContain('font-medium');
    });
    
    it('should have accessibility features', () => {
      expect(content).toContain('focus-visible');
      expect(content).toContain('disabled');
    });
    
    it('should have proper transition effects', () => {
      expect(content).toContain('transition-all');
      expect(content).toContain('duration-300');
    });
    
    it('should use brand color variables', () => {
      expect(content).toContain('--color-brand-accent');
      expect(content).toContain('--color-text-primary');
      expect(content).toContain('--color-background');
    });
  });
  
  describe.skip('Button Component Integration', () => {
    it('should be exported from ui index file', () => {
      const indexPath = join(componentsDir, 'index.js');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      expect(indexContent).toContain('export { Button, buttonVariants } from "./button"');
      expect(indexContent).toContain('export { BrandButton, brandButtonVariants } from "./brand-button"');
    });
    
    it('should use consistent CSS custom properties', () => {
      const astroButtonPath = join(componentsDir, 'Button.astro');
      const astroButtonContent = readFileSync(astroButtonPath, 'utf-8');
      
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      const reactButtonContent = readFileSync(reactButtonPath, 'utf-8');
      
      // Both should use CSS custom properties
      expect(astroButtonContent).toContain('var(--');
      expect(reactButtonContent).toContain('var(--');
    });
    
    it('should have consistent accessibility features', () => {
      const astroButtonPath = join(componentsDir, 'Button.astro');
      const astroButtonContent = readFileSync(astroButtonPath, 'utf-8');
      
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      const reactButtonContent = readFileSync(reactButtonPath, 'utf-8');
      
      // Both should have focus-visible support
      expect(astroButtonContent).toContain('focus-visible');
      expect(reactButtonContent).toContain('focus-visible');
      
      // Both should handle disabled state
      expect(astroButtonContent).toContain('disabled');
      expect(reactButtonContent).toContain('disabled');
    });
  });
  
  describe.skip('Button Component Performance', () => {
    it('should have reasonable file sizes', () => {
      const astroButtonPath = join(componentsDir, 'Button.astro');
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      
      const astroStats = require('fs').statSync(astroButtonPath);
      const reactStats = require('fs').statSync(reactButtonPath);
      
      // Components should be under 10KB for performance
      expect(astroStats.size).toBeLessThan(10 * 1024);
      expect(reactStats.size).toBeLessThan(10 * 1024);
    });
  });
  
  describe.skip('Button Component Brand Consistency', () => {
    it('should use brand color variables consistently', () => {
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      const reactButtonContent = readFileSync(reactButtonPath, 'utf-8');
      
      // Should use brand color variables
      expect(reactButtonContent).toContain('--color-brand-accent');
      expect(reactButtonContent).toContain('--color-text-primary');
      expect(reactButtonContent).toContain('--color-background');
    });
    
    it('should use consistent font properties', () => {
      const astroButtonPath = join(componentsDir, 'Button.astro');
      const astroButtonContent = readFileSync(astroButtonPath, 'utf-8');
      
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      const reactButtonContent = readFileSync(reactButtonPath, 'utf-8');
      
      // Both should use proper font properties
      expect(astroButtonContent).toContain('font-medium');
      expect(reactButtonContent).toContain('font-medium');
    });
    
    it('should use consistent border radius variables', () => {
      const astroButtonPath = join(componentsDir, 'Button.astro');
      const astroButtonContent = readFileSync(astroButtonPath, 'utf-8');
      
      const reactButtonPath = join(componentsDir, 'brand-button.jsx');
      const reactButtonContent = readFileSync(reactButtonPath, 'utf-8');
      
      // Both should use rounded classes
      expect(astroButtonContent).toContain('rounded-md');
      expect(reactButtonContent).toContain('rounded-md');
    });
  });
});