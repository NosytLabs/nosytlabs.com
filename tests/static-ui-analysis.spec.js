import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Static UI Analysis - Analyze built HTML files for alignment and structure
 * This test works with the static build output
 */

test.describe('Static UI Analysis', () => {
  
  test('Analyze index.html structure and alignment', async ({ page }) => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      test.skip('Built index.html not found. Run npm run build first.');
      return;
    }
    
    // Load the static HTML file
    await page.goto(`file://${indexPath}`);
    await page.waitForTimeout(1000);
    
    // Take a full page screenshot for manual review
    await page.screenshot({ 
      path: 'test-results/index-page-analysis.png',
      fullPage: true 
    });
    
    console.log('📸 Full page screenshot saved to test-results/index-page-analysis.png');
    
    // Analyze page structure
    const pageStructure = await page.evaluate(() => {
      const structure = {
        hasHeader: !!document.querySelector('header, .ultra-nav-header'),
        hasMain: !!document.querySelector('main, .main-content'),
        hasFooter: !!document.querySelector('footer, .footer'),
        hasHero: !!document.querySelector('.hero-section, [class*="hero"]'),
        hasNavigation: !!document.querySelector('nav, .navigation'),
        totalSections: document.querySelectorAll('section').length,
        totalImages: document.querySelectorAll('img').length,
        totalButtons: document.querySelectorAll('button, .btn').length,
        totalLinks: document.querySelectorAll('a').length,
        hasServiceCards: !!document.querySelector('.service-card, .service-preview-cards'),
        hasROICalculator: !!document.querySelector('.roi-calculator, [class*="calculator"]'),
        bodyClasses: document.body.className,
        htmlLang: document.documentElement.lang || 'not-set',
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || 'not-set'
      };
      
      return structure;
    });
    
    console.log('📊 Page Structure Analysis:', pageStructure);
    
    // Verify essential elements
    expect(pageStructure.hasHeader, 'Page should have a header').toBe(true);
    expect(pageStructure.hasMain || pageStructure.totalSections > 0, 'Page should have main content').toBe(true);
    expect(pageStructure.title.length, 'Page should have a meaningful title').toBeGreaterThan(10);
    expect(pageStructure.htmlLang, 'Page should have language attribute').not.toBe('not-set');
    
    // Check for responsive viewport meta tag
    const hasViewportMeta = await page.locator('meta[name="viewport"]').count() > 0;
    expect(hasViewportMeta, 'Page should have viewport meta tag').toBe(true);
  });

  test('Check CSS loading and styling', async ({ page }) => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      test.skip('Built index.html not found. Run npm run build first.');
      return;
    }
    
    await page.goto(`file://${indexPath}`);
    await page.waitForTimeout(1000);
    
    // Check if CSS is loaded and applied
    const stylingAnalysis = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      
      return {
        fontFamily: computedStyle.fontFamily,
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        margin: computedStyle.margin,
        padding: computedStyle.padding,
        hasCustomFonts: computedStyle.fontFamily.includes('Inter') || 
                       computedStyle.fontFamily.includes('Roboto') ||
                       computedStyle.fontFamily.includes('system-ui'),
        totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        hasInlineStyles: document.querySelectorAll('[style]').length > 0
      };
    });
    
    console.log('🎨 Styling Analysis:', stylingAnalysis);
    
    expect(stylingAnalysis.totalStylesheets, 'Page should have CSS stylesheets').toBeGreaterThan(0);
    expect(stylingAnalysis.fontFamily, 'Page should have font family defined').toBeTruthy();
  });

  test('Responsive design analysis', async ({ page }) => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      test.skip('Built index.html not found. Run npm run build first.');
      return;
    }
    
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`file://${indexPath}`);
      await page.waitForTimeout(1000);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png`,
        fullPage: false 
      });
      
      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      
      if (hasHorizontalScroll) {
        console.log(`⚠️ ${viewport.name}: Horizontal scroll detected`);
      } else {
        console.log(`✅ ${viewport.name}: No horizontal scroll`);
      }
      
      // Check navigation behavior
      const navAnalysis = await page.evaluate((vp) => {
        const nav = document.querySelector('.ultra-nav-header, header, nav');
        if (!nav) return { exists: false };
        
        const navStyle = window.getComputedStyle(nav);
        const mobileMenu = document.querySelector('.mobile-toggle, .hamburger');
        const desktopNav = document.querySelector('.nav-desktop, .desktop-nav');
        
        return {
          exists: true,
          position: navStyle.position,
          zIndex: navStyle.zIndex,
          hasMobileMenu: !!mobileMenu,
          hasDesktopNav: !!desktopNav,
          mobileMenuVisible: mobileMenu ? window.getComputedStyle(mobileMenu).display !== 'none' : false,
          desktopNavVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false
        };
      }, viewport);
      
      console.log(`📱 ${viewport.name} Navigation:`, navAnalysis);
      
      if (viewport.width < 768 && navAnalysis.exists) {
        // Mobile: should have mobile menu
        if (!navAnalysis.hasMobileMenu) {
          console.log(`⚠️ ${viewport.name}: Missing mobile menu`);
        }
      } else if (viewport.width >= 1024 && navAnalysis.exists) {
        // Desktop: should have desktop navigation
        if (!navAnalysis.hasDesktopNav) {
          console.log(`⚠️ ${viewport.name}: Missing desktop navigation`);
        }
      }
    }
  });

  test('Content alignment analysis', async ({ page }) => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      test.skip('Built index.html not found. Run npm run build first.');
      return;
    }
    
    await page.goto(`file://${indexPath}`);
    await page.waitForTimeout(1000);
    
    // Analyze content alignment
    const alignmentAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title');
      const alignmentData = [];
      
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        alignmentData.push({
          index,
          tagName: el.tagName,
          className: el.className,
          textAlign: style.textAlign,
          left: rect.left,
          width: rect.width,
          centerPoint: rect.left + (rect.width / 2),
          text: el.textContent.substring(0, 50) + '...'
        });
      });
      
      return alignmentData;
    });
    
    console.log('📐 Content Alignment Analysis:');
    alignmentAnalysis.forEach(item => {
      console.log(`   ${item.tagName}: "${item.text}" - align: ${item.textAlign}, center: ${Math.round(item.centerPoint)}px`);
    });
    
    // Check for consistent centering
    const centeredElements = alignmentAnalysis.filter(item => item.textAlign === 'center');
    if (centeredElements.length > 1) {
      const centerPoints = centeredElements.map(item => item.centerPoint);
      const avgCenter = centerPoints.reduce((a, b) => a + b, 0) / centerPoints.length;
      const maxDeviation = Math.max(...centerPoints.map(cp => Math.abs(cp - avgCenter)));
      
      console.log(`📏 Center alignment deviation: ${Math.round(maxDeviation)}px`);
      
      if (maxDeviation > 20) {
        console.log('⚠️ Inconsistent center alignment detected');
      } else {
        console.log('✅ Good center alignment consistency');
      }
    }
  });

  test('Generate comprehensive report', async ({ page }) => {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      test.skip('Built index.html not found. Run npm run build first.');
      return;
    }
    
    await page.goto(`file://${indexPath}`);
    await page.waitForTimeout(1000);
    
    // Generate comprehensive analysis report
    const report = await page.evaluate(() => {
      const analysis = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        structure: {
          totalElements: document.querySelectorAll('*').length,
          totalSections: document.querySelectorAll('section').length,
          totalImages: document.querySelectorAll('img').length,
          totalButtons: document.querySelectorAll('button, .btn').length,
          totalForms: document.querySelectorAll('form').length,
          totalInputs: document.querySelectorAll('input, textarea, select').length
        },
        accessibility: {
          hasSkipLinks: document.querySelectorAll('.skip-nav, .skip-link').length > 0,
          imagesWithoutAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length,
          inputsWithoutLabels: Array.from(document.querySelectorAll('input, textarea, select')).filter(input => {
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            const hasAriaLabel = input.getAttribute('aria-label');
            return !hasLabel && !hasAriaLabel && input.type !== 'hidden';
          }).length,
          headingStructure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.tagName)
        },
        performance: {
          totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
          totalScripts: document.querySelectorAll('script').length,
          totalExternalResources: document.querySelectorAll('link[href^="http"], script[src^="http"], img[src^="http"]').length
        }
      };
      
      return analysis;
    });
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'test-results', 'ui-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Comprehensive UI Analysis Report Generated');
    console.log(`📁 Report saved to: ${reportPath}`);
    console.log('📈 Key Metrics:');
    console.log(`   • Total Elements: ${report.structure.totalElements}`);
    console.log(`   • Sections: ${report.structure.totalSections}`);
    console.log(`   • Images: ${report.structure.totalImages}`);
    console.log(`   • Buttons: ${report.structure.totalButtons}`);
    console.log(`   • Images without alt: ${report.accessibility.imagesWithoutAlt}`);
    console.log(`   • Inputs without labels: ${report.accessibility.inputsWithoutLabels}`);
    console.log(`   • Has skip links: ${report.accessibility.hasSkipLinks}`);
    
    // Basic assertions
    expect(report.structure.totalElements, 'Page should have substantial content').toBeGreaterThan(50);
    expect(report.accessibility.imagesWithoutAlt, 'All images should have alt text').toBe(0);
    expect(report.accessibility.inputsWithoutLabels, 'All inputs should have labels').toBe(0);
  });
});
