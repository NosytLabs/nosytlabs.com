import { test, expect } from '@playwright/test';

/**
 * Comprehensive Accessibility and Missing Elements Testing
 * Scans for missing elements, broken links, accessibility issues, and content gaps
 */

test.describe('Accessibility and Missing Elements Detection', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Missing alt text detection', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images to check for alt text`);
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      const isDecorative = await img.getAttribute('role') === 'presentation' || 
                          await img.getAttribute('aria-hidden') === 'true';
      
      if (!isDecorative) {
        expect(alt, `Image ${src} is missing alt text`).toBeTruthy();
        expect(alt.length, `Alt text for ${src} should be descriptive`).toBeGreaterThan(3);
      }
    }
  });

  test('Broken links detection', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    console.log(`Found ${linkCount} links to check`);
    
    const brokenLinks = [];
    
    for (let i = 0; i < Math.min(linkCount, 50); i++) { // Limit to 50 links for performance
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        try {
          if (href.startsWith('http')) {
            // External link - check if it's reachable
            const response = await page.request.head(href);
            if (response.status() >= 400) {
              brokenLinks.push({ href, status: response.status() });
            }
          } else if (href.startsWith('/') || href.startsWith('#')) {
            // Internal link - check if target exists
            if (href.startsWith('#')) {
              const targetId = href.substring(1);
              const target = page.locator(`#${targetId}`);
              const targetExists = await target.count() > 0;
              if (!targetExists) {
                brokenLinks.push({ href, error: 'Target element not found' });
              }
            } else {
              // Internal page link - would need navigation to test fully
              // For now, just check if it's a reasonable path
              expect(href).toMatch(/^\/[a-zA-Z0-9\-_\/]*$/);
            }
          }
        } catch (error) {
          brokenLinks.push({ href, error: error.message });
        }
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('Broken links found:', brokenLinks);
    }
    
    expect(brokenLinks.length, `Found ${brokenLinks.length} broken links: ${JSON.stringify(brokenLinks)}`).toBe(0);
  });

  test('Missing form labels and accessibility', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Check for associated label
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = await label.count() > 0;
      }
      
      // Input should have some form of labeling
      const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;
      expect(hasAccessibleName, `Input of type "${type}" lacks accessible labeling`).toBe(true);
      
      // Placeholder should not be the only form of labeling
      if (!hasAccessibleName && placeholder) {
        console.warn(`Input relies only on placeholder text: "${placeholder}"`);
      }
    }
  });

  test('Missing heading structure', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount === 0) {
      throw new Error('No headings found on the page');
    }
    
    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count, 'Page should have exactly one h1 element').toBe(1);
    
    // Check heading hierarchy
    const headingLevels = [];
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.substring(1));
      headingLevels.push(level);
    }
    
    // Verify heading hierarchy doesn't skip levels
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      
      if (currentLevel > previousLevel + 1) {
        console.warn(`Heading hierarchy skip detected: h${previousLevel} followed by h${currentLevel}`);
      }
    }
  });

  test('Missing ARIA landmarks and roles', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    const mainCount = await main.count();
    expect(mainCount, 'Page should have a main landmark').toBeGreaterThan(0);
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount, 'Page should have navigation landmark').toBeGreaterThan(0);
    
    // Check for banner (header)
    const banner = page.locator('header, [role="banner"]');
    const bannerCount = await banner.count();
    expect(bannerCount, 'Page should have a banner/header').toBeGreaterThan(0);
    
    // Check for contentinfo (footer)
    const contentinfo = page.locator('footer, [role="contentinfo"]');
    const contentinfoCount = await contentinfo.count();
    if (contentinfoCount === 0) {
      console.warn('Page is missing footer/contentinfo landmark');
    }
  });

  test('Missing focus indicators', async ({ page }) => {
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    
    for (let i = 0; i < Math.min(focusableCount, 10); i++) {
      const element = focusableElements.nth(i);
      
      if (await element.isVisible()) {
        // Focus the element
        await element.focus();
        
        // Check if focus is visible
        const outlineStyle = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            outlineStyle: styles.outlineStyle,
            outlineColor: styles.outlineColor,
            boxShadow: styles.boxShadow
          };
        });
        
        // Element should have some form of focus indicator
        const hasFocusIndicator = 
          outlineStyle.outlineWidth !== '0px' ||
          outlineStyle.boxShadow !== 'none' ||
          outlineStyle.outline !== 'none';
        
        if (!hasFocusIndicator) {
          console.warn(`Element lacks focus indicator:`, await element.evaluate(el => el.outerHTML.substring(0, 100)));
        }
      }
    }
  });

  test('Missing meta tags and SEO elements', async ({ page }) => {
    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    const viewportCount = await viewport.count();
    expect(viewportCount, 'Page should have viewport meta tag').toBeGreaterThan(0);
    
    // Check for description meta tag
    const description = page.locator('meta[name="description"]');
    const descriptionCount = await description.count();
    expect(descriptionCount, 'Page should have description meta tag').toBeGreaterThan(0);
    
    if (descriptionCount > 0) {
      const descContent = await description.getAttribute('content');
      expect(descContent.length, 'Description should be meaningful').toBeGreaterThan(50);
      expect(descContent.length, 'Description should not be too long').toBeLessThan(160);
    }
    
    // Check for title tag
    const title = await page.title();
    expect(title.length, 'Page title should be meaningful').toBeGreaterThan(10);
    expect(title.length, 'Page title should not be too long').toBeLessThan(60);
    
    // Check for Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    
    if (await ogTitle.count() === 0) {
      console.warn('Missing Open Graph title tag');
    }
    if (await ogDescription.count() === 0) {
      console.warn('Missing Open Graph description tag');
    }
    if (await ogImage.count() === 0) {
      console.warn('Missing Open Graph image tag');
    }
  });

  test('Missing error handling and loading states', async ({ page }) => {
    // Check for loading indicators
    const loadingElements = page.locator('[aria-label*="loading"], .loading, .spinner, [role="progressbar"]');
    const loadingCount = await loadingElements.count();
    
    // Check for error message containers
    const errorElements = page.locator('.error, .alert, [role="alert"], [aria-live="assertive"]');
    const errorCount = await errorElements.count();
    
    // Check for form validation
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      const requiredInputs = form.locator('input[required], textarea[required], select[required]');
      const requiredCount = await requiredInputs.count();
      
      if (requiredCount > 0) {
        // Check if there's validation feedback mechanism
        const validationElements = form.locator('.invalid-feedback, .error-message, [aria-describedby]');
        const validationCount = await validationElements.count();
        
        if (validationCount === 0) {
          console.warn('Form with required fields lacks validation feedback mechanism');
        }
      }
    }
  });

  test('Missing skip links and keyboard navigation', async ({ page }) => {
    // Check for skip links
    const skipLinks = page.locator('a[href="#main"], a[href="#content"], .skip-link, .skip-nav');
    const skipLinkCount = await skipLinks.count();
    
    if (skipLinkCount === 0) {
      console.warn('Page is missing skip navigation links');
    }
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const focusedCount = await focusedElement.count();
    
    expect(focusedCount, 'Page should be keyboard navigable').toBeGreaterThan(0);
  });

  test('Missing content and empty sections', async ({ page }) => {
    const sections = page.locator('section, .section, main > div');
    const sectionCount = await sections.count();
    
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i);
      
      if (await section.isVisible()) {
        const textContent = await section.textContent();
        const hasImages = await section.locator('img').count() > 0;
        const hasButtons = await section.locator('button, .btn').count() > 0;
        const hasLinks = await section.locator('a').count() > 0;
        
        const isEmpty = !textContent.trim() && !hasImages && !hasButtons && !hasLinks;
        
        if (isEmpty) {
          console.warn(`Empty section detected at index ${i}`);
        }
      }
    }
  });
});
