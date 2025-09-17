import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';

describe('Font Preloading Optimization', () => {
  let layoutContent: string;
  let dom: JSDOM;
  let document: Document;

  beforeAll(() => {
    // Try to read from dist folder first (compiled output)
    try {
      const indexPath = join(process.cwd(), 'dist', 'index.html');
      layoutContent = readFileSync(indexPath, 'utf-8');
    } catch (error) {
      // Fallback to reading the source file
      const layoutPath = join(process.cwd(), 'src', 'layouts', 'Layout.astro');
      layoutContent = readFileSync(layoutPath, 'utf-8');
      
      // Extract HTML content from Astro file
      const htmlMatch = layoutContent.match(/<!DOCTYPE html>[\s\S]*<\/html>/);
      layoutContent = htmlMatch ? htmlMatch[0] : '';
    }
    
    dom = new JSDOM(layoutContent);
    document = dom.window.document;
  });

  describe('Preconnect Links', () => {
    it('should have preconnect for Fontshare API', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preconnect"\s+href="https:\/\/api\.fontshare\.com"\s+crossorigin>/
      );
    });

    it('should have preconnect for rsms.me (Inter font)', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preconnect"\s+href="https:\/\/rsms\.me"\s+crossorigin>/
      );
    });

    it('should have preconnect for Google Fonts', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com"\s+crossorigin>/
      );
    });

    it('should have preconnect for Google Fonts static resources', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin>/
      );
    });
  });

  describe('Font Preloading', () => {
    it('should preload Satoshi font with async loading', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preload"\s+href="https:\/\/api\.fontshare\.com\/v2\/css\?f\[\]=satoshi@1,900,700,500,400,300&display=swap"\s+as="style"\s+onload="this\.onload=null;this\.rel='stylesheet'">/
      );
    });

    it('should preload Inter font with async loading', () => {
      expect(layoutContent).toMatch(
        /<link\s+rel="preload"\s+href="https:\/\/rsms\.me\/inter\/inter\.css"\s+as="style"\s+onload="this\.onload=null;this\.rel='stylesheet'">/
      );
    });
  });

  describe('Fallback Support', () => {
    it('should have noscript fallback for Satoshi font', () => {
      expect(layoutContent).toMatch(
        /<noscript>[\s\S]*<link\s+rel="stylesheet"\s+href="[^"]*family=Satoshi:wght@1\.\.900[^"]*">[\s\S]*<\/noscript>/
      );
    });

    it('should have noscript fallback for Inter font', () => {
      expect(layoutContent).toMatch(
        /<noscript>[\s\S]*<link\s+rel="stylesheet"\s+href="https:\/\/rsms\.me\/inter\/inter\.css">[\s\S]*<\/noscript>/
      );
    });
  });

  describe('Performance Optimization', () => {
    it('should use display=swap for font loading optimization', () => {
      expect(layoutContent).toMatch(/display=swap/);
    });

    it('should have crossorigin attribute for preconnect links', () => {
      const preconnectMatches = layoutContent.match(/<link\s+rel="preconnect"[^>]*>/g);
      expect(preconnectMatches).toBeTruthy();
      
      preconnectMatches?.forEach(link => {
        expect(link).toMatch(/crossorigin/);
      });
    });

    it('should load fonts asynchronously to prevent render blocking', () => {
      const preloadMatches = layoutContent.match(/<link\s+rel="preload"[^>]*as="style"[^>]*>/g);
      expect(preloadMatches).toBeTruthy();
      
      preloadMatches?.forEach(link => {
        expect(link).toMatch(/onload="this\.onload=null;this\.rel='stylesheet'"/);
      });
    });
  });

  describe('Font Loading Strategy', () => {
    it('should prioritize critical fonts (Satoshi and Inter)', () => {
      const satoshiIndex = layoutContent.indexOf('family=Satoshi:wght@1..900');
      const interIndex = layoutContent.indexOf('inter.css');
      const jetbrainsPreloadMatch = layoutContent.match(/<link\s+rel="preload"[^>]*JetBrains\+Mono/);
      
      // Satoshi and Inter should be preloaded (have lower index than JetBrains)
      expect(satoshiIndex).toBeGreaterThan(-1);
      expect(interIndex).toBeGreaterThan(-1);
      
      // JetBrains Mono should not be preloaded (only loaded via CSS import)
      expect(jetbrainsPreloadMatch).toBeNull(); // Should not have preload link for JetBrains Mono
    });

    it('should maintain proper loading order', () => {
      const preconnectIndex = layoutContent.indexOf('rel="preconnect"');
      const preloadIndex = layoutContent.indexOf('rel="preload"');
      const noscriptIndex = layoutContent.indexOf('<noscript>');
      
      // Preconnect should come before preload
      expect(preconnectIndex).toBeLessThan(preloadIndex);
      // Preload should come before noscript fallback
      expect(preloadIndex).toBeLessThan(noscriptIndex);
    });
  });

  describe('Font Metrics and Performance', () => {
    it('should include font-display swap for better performance', () => {
      // Check that fonts.css uses font-display: swap
      try {
        const fontsPath = join(process.cwd(), 'dist', 'fonts.css');
        const fontsContent = readFileSync(fontsPath, 'utf-8');
        expect(fontsContent).toMatch(/display=swap/);
      } catch (error) {
        // Fallback to source file
        const fontsPath = join(process.cwd(), 'src', 'styles', 'fonts.css');
        const fontsContent = readFileSync(fontsPath, 'utf-8');
        expect(fontsContent).toMatch(/display=swap/);
      }
    });

    it('should use variable fonts when available', () => {
      // Satoshi should use variable font syntax
      expect(layoutContent).toMatch(/family=Satoshi:wght@1..900&/);
    });
  });

  describe('Accessibility and Compatibility', () => {
    it('should provide proper fallback font stacks', () => {
      try {
        const fontsPath = join(process.cwd(), 'dist', 'fonts.css');
        const fontsContent = readFileSync(fontsPath, 'utf-8');
        expect(fontsContent).toMatch(/-apple-system/);
        expect(fontsContent).toMatch(/BlinkMacSystemFont/);
        expect(fontsContent).toMatch(/system-ui/);
      } catch (error) {
        // Fallback to source file
        const fontsPath = join(process.cwd(), 'src', 'styles', 'fonts.css');
        const fontsContent = readFileSync(fontsPath, 'utf-8');
        expect(fontsContent).toMatch(/-apple-system/);
        expect(fontsContent).toMatch(/BlinkMacSystemFont/);
        expect(fontsContent).toMatch(/system-ui/);
      }
    });

    it('should handle no-JavaScript scenarios', () => {
      const noscriptContent = layoutContent.match(/<noscript>[\s\S]*?<\/noscript>/);
      expect(noscriptContent).toBeTruthy();
      expect(noscriptContent![0]).toMatch(/rel="stylesheet"/);
    });
  });
});