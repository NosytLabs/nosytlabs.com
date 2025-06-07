# Test info

- Name: Simple UI Structure Check >> Basic page structure and alignment
- Location: C:\Users\Tyson\Desktop\Development Tools\nosytlabs-github-ready\tests\simple-ui-check.spec.js:10:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 100
Received:   16
    at C:\Users\Tyson\Desktop\Development Tools\nosytlabs-github-ready\tests\simple-ui-check.spec.js:52:32
```

# Page snapshot

```yaml
- text: Upgrade Required
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | /**
   4 |  * Simple UI Check - Basic alignment and structure verification
   5 |  * This test can run against any working version of the site
   6 |  */
   7 |
   8 | test.describe('Simple UI Structure Check', () => {
   9 |   
   10 |   test('Basic page structure and alignment', async ({ page }) => {
   11 |     // Try to connect to the site
   12 |     try {
   13 |       await page.goto('http://localhost:3001', { timeout: 10000 });
   14 |     } catch (error) {
   15 |       console.log('Could not connect to localhost:3001, trying localhost:3000');
   16 |       try {
   17 |         await page.goto('http://localhost:3000', { timeout: 10000 });
   18 |       } catch (error2) {
   19 |         console.log('Could not connect to any local server. Skipping test.');
   20 |         test.skip();
   21 |         return;
   22 |       }
   23 |     }
   24 |     
   25 |     // Wait for page to load
   26 |     await page.waitForTimeout(2000);
   27 |     
   28 |     // Check if page has basic structure
   29 |     const body = page.locator('body');
   30 |     await expect(body).toBeVisible();
   31 |     
   32 |     // Check for header/navigation
   33 |     const header = page.locator('header, nav, .header, .navigation').first();
   34 |     if (await header.count() > 0) {
   35 |       await expect(header).toBeVisible();
   36 |       console.log('✅ Header/Navigation found');
   37 |     } else {
   38 |       console.log('⚠️ No header/navigation found');
   39 |     }
   40 |     
   41 |     // Check for main content
   42 |     const main = page.locator('main, .main, .content, section').first();
   43 |     if (await main.count() > 0) {
   44 |       await expect(main).toBeVisible();
   45 |       console.log('✅ Main content area found');
   46 |     } else {
   47 |       console.log('⚠️ No main content area found');
   48 |     }
   49 |     
   50 |     // Check for basic text content
   51 |     const textContent = await page.textContent('body');
>  52 |     expect(textContent.length).toBeGreaterThan(100);
      |                                ^ Error: expect(received).toBeGreaterThan(expected)
   53 |     console.log('✅ Page has substantial text content');
   54 |     
   55 |     // Check page title
   56 |     const title = await page.title();
   57 |     expect(title.length).toBeGreaterThan(0);
   58 |     console.log(`✅ Page title: "${title}"`);
   59 |     
   60 |     // Take a screenshot for manual review
   61 |     await page.screenshot({ 
   62 |       path: 'test-results/current-page-state.png',
   63 |       fullPage: true 
   64 |     });
   65 |     console.log('📸 Screenshot saved to test-results/current-page-state.png');
   66 |   });
   67 |
   68 |   test('Check for JavaScript errors', async ({ page }) => {
   69 |     const errors = [];
   70 |     
   71 |     page.on('pageerror', error => {
   72 |       errors.push(error.message);
   73 |     });
   74 |     
   75 |     page.on('console', msg => {
   76 |       if (msg.type() === 'error') {
   77 |         errors.push(msg.text());
   78 |       }
   79 |     });
   80 |     
   81 |     try {
   82 |       await page.goto('http://localhost:3001', { timeout: 10000 });
   83 |     } catch (error) {
   84 |       try {
   85 |         await page.goto('http://localhost:3000', { timeout: 10000 });
   86 |       } catch (error2) {
   87 |         test.skip();
   88 |         return;
   89 |       }
   90 |     }
   91 |     
   92 |     await page.waitForTimeout(3000);
   93 |     
   94 |     if (errors.length > 0) {
   95 |       console.log('❌ JavaScript errors found:');
   96 |       errors.forEach((error, index) => {
   97 |         console.log(`   ${index + 1}. ${error}`);
   98 |       });
   99 |     } else {
  100 |       console.log('✅ No JavaScript errors detected');
  101 |     }
  102 |     
  103 |     // Don't fail the test for JS errors, just report them
  104 |     console.log(`Total errors found: ${errors.length}`);
  105 |   });
  106 |
  107 |   test('Basic responsive behavior', async ({ page }) => {
  108 |     try {
  109 |       await page.goto('http://localhost:3001', { timeout: 10000 });
  110 |     } catch (error) {
  111 |       try {
  112 |         await page.goto('http://localhost:3000', { timeout: 10000 });
  113 |       } catch (error2) {
  114 |         test.skip();
  115 |         return;
  116 |       }
  117 |     }
  118 |     
  119 |     // Test different viewport sizes
  120 |     const viewports = [
  121 |       { width: 375, height: 667, name: 'Mobile' },
  122 |       { width: 768, height: 1024, name: 'Tablet' },
  123 |       { width: 1920, height: 1080, name: 'Desktop' }
  124 |     ];
  125 |     
  126 |     for (const viewport of viewports) {
  127 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  128 |       await page.waitForTimeout(1000);
  129 |       
  130 |       // Check if content fits in viewport
  131 |       const body = page.locator('body');
  132 |       const bodyBox = await body.boundingBox();
  133 |       
  134 |       if (bodyBox) {
  135 |         const hasHorizontalScroll = bodyBox.width > viewport.width;
  136 |         if (hasHorizontalScroll) {
  137 |           console.log(`⚠️ ${viewport.name}: Horizontal scroll detected (content width: ${bodyBox.width}px)`);
  138 |         } else {
  139 |           console.log(`✅ ${viewport.name}: Content fits properly`);
  140 |         }
  141 |       }
  142 |       
  143 |       // Take screenshot for each viewport
  144 |       await page.screenshot({ 
  145 |         path: `test-results/viewport-${viewport.name.toLowerCase()}.png`,
  146 |         fullPage: false 
  147 |       });
  148 |     }
  149 |   });
  150 |
  151 |   test('Check for missing images', async ({ page }) => {
  152 |     try {
```