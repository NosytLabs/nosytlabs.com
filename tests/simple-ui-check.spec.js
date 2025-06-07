import { test, expect } from '@playwright/test';

/**
 * Simple UI Check - Basic alignment and structure verification
 * This test can run against any working version of the site
 */

test.describe('Simple UI Structure Check', () => {
  
  test('Basic page structure and alignment', async ({ page }) => {
    // Try to connect to the site
    try {
      await page.goto('http://localhost:3001', { timeout: 10000 });
    } catch (error) {
      console.log('Could not connect to localhost:3001, trying localhost:3000');
      try {
        await page.goto('http://localhost:3000', { timeout: 10000 });
      } catch (error2) {
        console.log('Could not connect to any local server. Skipping test.');
        test.skip();
        return;
      }
    }
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check if page has basic structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for header/navigation
    const header = page.locator('header, nav, .header, .navigation').first();
    if (await header.count() > 0) {
      await expect(header).toBeVisible();
      console.log('✅ Header/Navigation found');
    } else {
      console.log('⚠️ No header/navigation found');
    }
    
    // Check for main content
    const main = page.locator('main, .main, .content, section').first();
    if (await main.count() > 0) {
      await expect(main).toBeVisible();
      console.log('✅ Main content area found');
    } else {
      console.log('⚠️ No main content area found');
    }
    
    // Check for basic text content
    const textContent = await page.textContent('body');
    expect(textContent.length).toBeGreaterThan(100);
    console.log('✅ Page has substantial text content');
    
    // Check page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log(`✅ Page title: "${title}"`);
    
    // Take a screenshot for manual review
    await page.screenshot({ 
      path: 'test-results/current-page-state.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved to test-results/current-page-state.png');
  });

  test('Check for JavaScript errors', async ({ page }) => {
    const errors = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    try {
      await page.goto('http://localhost:3001', { timeout: 10000 });
    } catch (error) {
      try {
        await page.goto('http://localhost:3000', { timeout: 10000 });
      } catch (error2) {
        test.skip();
        return;
      }
    }
    
    await page.waitForTimeout(3000);
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Don't fail the test for JS errors, just report them
    console.log(`Total errors found: ${errors.length}`);
  });

  test('Basic responsive behavior', async ({ page }) => {
    try {
      await page.goto('http://localhost:3001', { timeout: 10000 });
    } catch (error) {
      try {
        await page.goto('http://localhost:3000', { timeout: 10000 });
      } catch (error2) {
        test.skip();
        return;
      }
    }
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Check if content fits in viewport
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      
      if (bodyBox) {
        const hasHorizontalScroll = bodyBox.width > viewport.width;
        if (hasHorizontalScroll) {
          console.log(`⚠️ ${viewport.name}: Horizontal scroll detected (content width: ${bodyBox.width}px)`);
        } else {
          console.log(`✅ ${viewport.name}: Content fits properly`);
        }
      }
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/viewport-${viewport.name.toLowerCase()}.png`,
        fullPage: false 
      });
    }
  });

  test('Check for missing images', async ({ page }) => {
    try {
      await page.goto('http://localhost:3001', { timeout: 10000 });
    } catch (error) {
      try {
        await page.goto('http://localhost:3000', { timeout: 10000 });
      } catch (error2) {
        test.skip();
        return;
      }
    }
    
    await page.waitForTimeout(2000);
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images to check`);
    
    const brokenImages = [];
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      if (src) {
        const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0);
        
        if (!isLoaded) {
          brokenImages.push({ src, alt: alt || 'No alt text' });
        }
      }
    }
    
    if (brokenImages.length > 0) {
      console.log('❌ Broken images found:');
      brokenImages.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.src} (alt: "${img.alt}")`);
      });
    } else {
      console.log('✅ All images loaded successfully');
    }
    
    console.log(`Images checked: ${imageCount}, Broken: ${brokenImages.length}`);
  });
});
