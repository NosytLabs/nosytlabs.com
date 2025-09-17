import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Brand Typography Components', () => {
  const componentsDir = join(process.cwd(), 'src', 'components');
  
  describe('Component Files', () => {
    it('should have all required typography component files', () => {
      const requiredComponents = [
        'BrandHeading.astro',
        'BrandBody.astro',
        'BrandCode.astro',
        'HeadingHierarchy.astro'
      ];
      
      requiredComponents.forEach(component => {
        const filePath = join(componentsDir, component);
        expect(existsSync(filePath)).toBe(true);
      });
    });
    
    it('should have valid Astro component structure', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for frontmatter
        expect(content).toMatch(/^---[\s\S]*?---/);
        
        // Check for TypeScript interface
        expect(content).toMatch(/export interface Props/);
        
        // Check for style block
        expect(content).toMatch(/<style>[\s\S]*?<\/style>/);
      });
    });
  });
  
  describe('BrandHeading Component', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'BrandHeading.astro');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should support all heading levels (1-6)', () => {
      expect(content).toMatch(/level\?:\s*1\s*\|\s*2\s*\|\s*3\s*\|\s*4\s*\|\s*5\s*\|\s*6/);
    });
    
    it('should support size variants', () => {
      expect(content).toMatch(/size\?:\s*'xs'\s*\|\s*'sm'\s*\|\s*'md'\s*\|\s*'lg'\s*\|\s*'xl'/);
    });
    
    it('should support weight variants', () => {
      expect(content).toMatch(/weight\?:\s*'normal'\s*\|\s*'medium'\s*\|\s*'semibold'\s*\|\s*'bold'/);
    });
    
    it('should support color variants', () => {
      expect(content).toMatch(/color\?:\s*'primary'\s*\|\s*'secondary'\s*\|\s*'accent'/);
    });
    
    it('should support gradient and glow effects', () => {
      expect(content).toMatch(/gradient\?:\s*boolean/);
      expect(content).toMatch(/glow\?:\s*boolean/);
    });
    
    it('should use Satoshi font family', () => {
      expect(content).toMatch(/font-family:\s*var\(--font-family-heading\)/);
    });
    
    it('should have proper accessibility features', () => {
      expect(content).toMatch(/focus-visible/);
      expect(content).toMatch(/text-rendering:\s*optimizeLegibility/);
    });
    
    it('should support responsive design', () => {
      expect(content).toMatch(/@media\s*\(max-width:\s*768px\)/);
    });
    
    it('should support high contrast mode', () => {
      expect(content).toMatch(/@media\s*\(prefers-contrast:\s*high\)/);
    });
    
    it('should support reduced motion', () => {
      expect(content).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    });
  });
  
  describe('BrandBody Component', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'BrandBody.astro');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should support text size variants', () => {
      expect(content).toMatch(/size\?:\s*'xs'\s*\|\s*'sm'\s*\|\s*'md'\s*\|\s*'lg'\s*\|\s*'xl'/);
    });
    
    it('should support line height variants', () => {
      expect(content).toMatch(/leading\?:\s*'tight'\s*\|\s*'snug'\s*\|\s*'normal'\s*\|\s*'relaxed'\s*\|\s*'loose'/);
    });
    
    it('should support text alignment', () => {
      expect(content).toMatch(/align\?:\s*'left'\s*\|\s*'center'\s*\|\s*'right'\s*\|\s*'justify'/);
    });
    
    it('should support text variants', () => {
      expect(content).toMatch(/variant\?:\s*'body'\s*\|\s*'caption'\s*\|\s*'label'\s*\|\s*'description'/);
    });
    
    it('should use Inter font family', () => {
      expect(content).toMatch(/font-family:\s*var\(--font-family-body\)/);
    });
    
    it('should have proper link styling', () => {
      expect(content).toMatch(/\.brand-body\s*:global\(a\)/);
    });
    
    it('should have proper code styling', () => {
      expect(content).toMatch(/\.brand-body\s*:global\(code\)/);
    });
    
    it('should support emphasis styling', () => {
      expect(content).toMatch(/emphasis\?:\s*boolean/);
      expect(content).toMatch(/\.emphasis/);
    });
  });
  
  describe('BrandCode Component', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'BrandCode.astro');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should support code variants', () => {
      expect(content).toMatch(/variant\?:\s*'inline'\s*\|\s*'block'\s*\|\s*'terminal'\s*\|\s*'snippet'/);
    });
    
    it('should support language specification', () => {
      expect(content).toMatch(/language\?:\s*string/);
    });
    
    it('should support theme variants', () => {
      expect(content).toMatch(/theme\?:\s*'light'\s*\|\s*'dark'\s*\|\s*'auto'/);
    });
    
    it('should support line numbers', () => {
      expect(content).toMatch(/showLineNumbers\?:\s*boolean/);
    });
    
    it('should support copy functionality', () => {
      expect(content).toMatch(/copyable\?:\s*boolean/);
      expect(content).toMatch(/copy-button/);
    });
    
    it('should use JetBrains Mono font family', () => {
      expect(content).toMatch(/font-family:\s*var\(--font-mono\)/);
    });
    
    it('should have terminal variant styling', () => {
      expect(content).toMatch(/\.variant-terminal/);
    });
    
    it('should have syntax highlighting support', () => {
      expect(content).toMatch(/\.token\.keyword/);
      expect(content).toMatch(/\.token\.string/);
      expect(content).toMatch(/\.token\.comment/);
    });
    
    it('should have copy script functionality', () => {
      expect(content).toMatch(/<script>[\s\S]*navigator\.clipboard[\s\S]*<\/script>/);
    });
  });
  
  describe('HeadingHierarchy Component', () => {
    let content: string;
    
    beforeAll(() => {
      const filePath = join(componentsDir, 'HeadingHierarchy.astro');
      content = readFileSync(filePath, 'utf-8');
    });
    
    it('should support all heading levels', () => {
      expect(content).toMatch(/level:\s*1\s*\|\s*2\s*\|\s*3\s*\|\s*4\s*\|\s*5\s*\|\s*6/);
    });
    
    it('should support style variants', () => {
      expect(content).toMatch(/style\?:\s*'default'\s*\|\s*'display'\s*\|\s*'section'\s*\|\s*'subsection'/);
    });
    
    it('should support spacing variants', () => {
      expect(content).toMatch(/spacing\?:\s*'tight'\s*\|\s*'normal'\s*\|\s*'loose'/);
    });
    
    it('should have proper semantic spacing', () => {
      expect(content).toMatch(/\.spacing-normal\.h1/);
      expect(content).toMatch(/\.spacing-normal\.h2/);
      expect(content).toMatch(/\.spacing-normal\.h3/);
    });
    
    it('should have style mappings', () => {
      expect(content).toMatch(/styleMap\s*=/);
      expect(content).toMatch(/default:/);
      expect(content).toMatch(/display:/);
      expect(content).toMatch(/section:/);
    });
    
    it('should support anchor links', () => {
      expect(content).toMatch(/scroll-margin-top/);
      expect(content).toMatch(/\[id\]:hover::after/);
    });
  });
  
  describe('Typography Integration', () => {
    it('should use consistent CSS custom properties', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for consistent use of CSS custom properties
        expect(content).toMatch(/var\(--font-/);
        expect(content).toMatch(/var\(--color-/);
      });
    });
    
    it('should have consistent accessibility features', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for accessibility features
        expect(content).toMatch(/focus-visible/);
        expect(content).toMatch(/-webkit-font-smoothing/);
        expect(content).toMatch(/text-rendering/);
      });
    });
    
    it('should support print styles', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for print media queries
        expect(content).toMatch(/@media\s*print/);
      });
    });
  });
  
  describe('Performance and Optimization', () => {
    it('should have reasonable file sizes', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const stats = require('fs').statSync(filePath);
        
        // Components should be under 20KB for maintainability
        expect(stats.size).toBeLessThan(20 * 1024);
      });
    });
    
    it('should use efficient CSS selectors', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Avoid overly complex selectors
        const complexSelectors = content.match(/\.[^\s{]+\s+\.[^\s{]+\s+\.[^\s{]+\s+\.[^\s{]+/g);
        expect(complexSelectors?.length || 0).toBeLessThan(5);
      });
    });
  });
  
  describe('Brand Consistency', () => {
    it('should use brand color variables consistently', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'BrandCode.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for brand color usage - updated to match actual implementation
        expect(content).toMatch(/var\(--color-brand-text-primary\)|var\(--color-brand-primary\)|var\(--color-text-primary\)/);
        expect(content).toMatch(/var\(--color-brand-text-|var\(--color-text-/);
      });
    });
    
    it('should use consistent font weight variables', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for font weight variables
        expect(content).toMatch(/var\(--font-weight-/);
      });
    });
    
    it('should use consistent spacing variables', () => {
      const components = ['BrandHeading.astro', 'BrandBody.astro', 'HeadingHierarchy.astro'];
      
      components.forEach(componentFile => {
        const filePath = join(componentsDir, componentFile);
        const content = readFileSync(filePath, 'utf-8');
        
        // Check for line height and letter spacing variables
        expect(content).toMatch(/var\(--line-height-/);
      });
    });
  });
});