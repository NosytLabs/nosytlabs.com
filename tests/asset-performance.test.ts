import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Asset Performance Tests', () => {
  let dom: JSDOM;
  let document: Document;

  beforeAll(() => {
    const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    // Extract HTML content from Astro file
    const htmlMatch = layoutContent.match(/<html[\s\S]*<\/html>/);
    const htmlContent = htmlMatch ? htmlMatch[0] : '<html><head></head><body></body></html>';
    
    dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  describe('Font Preloading', () => {
    it('should have preconnect links for font providers', () => {
      const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]');
      const hrefs = Array.from(preconnectLinks).map(link => link.getAttribute('href'));
      
      expect(hrefs).toContain('https://api.fontshare.com');
      expect(hrefs).toContain('https://rsms.me');
      expect(hrefs).toContain('https://fonts.googleapis.com');
    });

    it('should have font preload links', () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
      expect(preloadLinks.length).toBeGreaterThan(0);
    });

    it('should have noscript fallbacks for fonts', () => {
      const noscriptTags = document.querySelectorAll('noscript');
      expect(noscriptTags.length).toBeGreaterThan(0);
    });
  });

  describe('SVG Optimization', () => {
    it('should have optimized SVG files with minimal size', () => {
      const svgFiles = [
        'public/logo-mark.svg',
        'public/logo-mark-black.svg', 
        'public/logo-mark-white.svg',
        'public/images/favicon.svg',
        'public/placeholder.svg'
      ];

      svgFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Check that SVG is optimized (no excessive whitespace, comments removed)
          expect(content).not.toMatch(/<!--[\s\S]*?-->/); // No comments
          expect(content.split('\n').length).toBeLessThan(10); // Minimal line breaks
          
          // Should be valid SVG
          expect(content).toMatch(/^<svg[\s\S]*<\/svg>$/);
        }
      });
    });

    it('should have compressed SVG files under reasonable size limits', () => {
      const svgFiles = [
        { path: 'public/images/favicon.svg', maxSize: 1000 },
        { path: 'public/images/logo-icon.svg', maxSize: 2000 },
        { path: 'public/placeholder.svg', maxSize: 500 }
      ];

      svgFiles.forEach(({ path: filePath, maxSize }) => {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          expect(stats.size).toBeLessThan(maxSize);
        }
      });
    });
  });

  describe('Asset Loading Strategy', () => {
    it('should use appropriate loading strategies for different asset types', () => {
      const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      
      // Check for font-display: swap in CSS
      const fontsPath = path.join(process.cwd(), 'src/styles/fonts.css');
      if (fs.existsSync(fontsPath)) {
        const fontsContent = fs.readFileSync(fontsPath, 'utf-8');
        expect(fontsContent).toMatch(/font-display:\s*swap/);
      }
      
      // Check for final optimized CSS
      const cssPath = path.join(process.cwd(), 'src/styles/final-optimized.css');
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent.length).toBeGreaterThan(0);
      }
    });

    it('should have minimal critical CSS in head', () => {
      const styleElements = document.querySelectorAll('style');
      const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
      
      // Should have some CSS loading mechanism
      expect(styleElements.length + linkElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Metrics', () => {
    it('should have reasonable file sizes for critical assets', () => {
      const criticalAssets = [
        { path: 'src/styles/final-optimized.css', maxSize: 50000 },
        { path: 'src/styles/fonts.css', maxSize: 10000 }
      ];

      criticalAssets.forEach(({ path: filePath, maxSize }) => {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          expect(stats.size).toBeLessThan(maxSize);
        }
      });
    });

    it('should have optimized image formats available', () => {
      // Check that we have SVG alternatives to raster images
      const logoSvg = fs.existsSync('public/images/logo-icon.svg');
      const faviconSvg = fs.existsSync('public/images/favicon.svg');
      
      expect(logoSvg).toBe(true);
      expect(faviconSvg).toBe(true);
    });
  });

  describe('Resource Hints', () => {
    it('should have appropriate resource hints for performance', () => {
      const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      
      // Should have preconnect for external font providers
      expect(layoutContent).toMatch(/rel=["']preconnect["']/);
      
      // Should have preload for critical fonts
      expect(layoutContent).toMatch(/rel=["']preload["']/);
    });

    it('should have proper crossorigin attributes for external resources', () => {
      const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      
      // External font preconnects should have crossorigin
      const preconnectMatches = layoutContent.match(/preconnect[\s\S]*?>/g) || [];
      preconnectMatches.forEach(match => {
        if (match.includes('fontshare') || match.includes('googleapis') || match.includes('rsms')) {
          expect(match).toMatch(/crossorigin/);
        }
      });
    });
  });
});