import { test as base, expect, chromium, type Page, type Browser, type BrowserContext } from '@playwright/test';

// Define shared browser context
let browserContext: BrowserContext | null = null;

// Define test fixtures
type TestFixtures = {
  sharedPage: Page;
};

// Setup base test with fixtures
const test = base.extend<TestFixtures>({
  sharedPage: async ({}, use) => {
    if (!browserContext) {
      console.log('Creating browser context...');
      const browser = await chromium.launch();
      browserContext = await browser.newContext({
        viewport: { width: 1280, height: 720 }
      });

      // Enhanced network request logging
      browserContext.on('request', request => {
        const url = request.url();
        if (url.includes('favicon') || url.includes('logo.svg')) {
          console.log(`🌐 Resource requested:
          URL: ${url}
          Headers: ${JSON.stringify(request.headers())}
          Method: ${request.method()}`);
        }
      });

      browserContext.on('response', async response => {
        const url = response.url();
        if (url.includes('favicon') || url.includes('logo.svg')) {
          const status = response.status();
          const headers = response.headers();
          const body = status === 404 ? await response.text().catch(() => 'Unable to read response body') : 'Response OK';
          console.log(`📥 Resource response:
          URL: ${url}
          Status: ${status}
          Headers: ${JSON.stringify(headers)}
          Body: ${status === 404 ? body : '[Response OK]'}`);
        }
      });
    }

    console.log('Creating new page...');
    const page = await browserContext.newPage().catch(e => {
      console.error('Error creating page:', e);
      throw e;
    });
    
    // Set longer timeouts for stability
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(60000);
    
    // Add event listeners for debugging
    page.on('load', () => console.log('Page load event fired'));
    page.on('domcontentloaded', () => console.log('DOMContentLoaded event fired'));
    page.on('console', msg => console.log('Page console:', msg.text()));

    // Helper function to verify page state
    const verifyPageState = async () => {
      try {
        if (page.isClosed()) {
          console.error('Page is closed');
          return false;
        }
        
        const state = await page.evaluate(() => ({
          readyState: document.readyState,
          hasBody: !!document.body,
          hasHead: !!document.head
        })).catch(() => null);

        if (!state) {
          console.error('Could not evaluate page state');
          return false;
        }

        console.log('Page state:', state);
        return state.readyState === 'complete' && state.hasBody && state.hasHead;
      } catch (e) {
        console.error('Error verifying page state:', e);
        return false;
      }
    };

    // Ensure page is valid before use
    const isValid = await verifyPageState();
    if (!isValid) {
      throw new Error('Page is not in a valid state');
    }

    await use(page);

    // Clean up
    if (!page.isClosed()) {
      console.log('Closing page...');
      await page.close().catch(e => console.error('Error closing page:', e));
      console.log('Page closed');
    }
  }
});

// Clean up browser context after all tests
test.afterAll(async () => {
  console.log('Cleaning up browser context...');
  if (browserContext) {
    await browserContext.close().catch(e => console.error('Error closing browser context:', e));
    browserContext = null;
  }
});

interface Favicon {
  rel: string;
  type?: string;
  sizes?: string;
  href: string;
}


// Helper function to retry operations with exponential backoff
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  validateState?: () => Promise<boolean>,
  operationName = 'Operation'
): Promise<T> => {
  console.time(`${operationName} - Total time`);
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.time(`${operationName} - Attempt ${attempt}`);
    try {
      if (validateState) {
        console.time(`${operationName} - State validation`);
        const isValid = await validateState();
        console.timeEnd(`${operationName} - State validation`);
        if (!isValid) {
          throw new Error(`Invalid page state detected during ${operationName}`);
        }
      }
      
      const result = await operation();
      console.timeEnd(`${operationName} - Attempt ${attempt}`);
      console.timeEnd(`${operationName} - Total time`);
      return result;
    } catch (error) {
      console.timeEnd(`${operationName} - Attempt ${attempt}`);
      lastError = error;
      console.error(`${operationName} - Attempt ${attempt} failed:`, error);
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`${operationName} - Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.timeEnd(`${operationName} - Total time`);
  throw lastError;
};


const expectedFavicons: Favicon[] = [
  { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' }
];

const testPages = ['/', '/services', '/projects', '/content-creation', '/nosytos95', '/contact'];

test.describe.configure({ mode: 'serial' });

test.describe('Favicon Tests', () => {
  for (const pagePath of testPages) {
    test(`Verify favicons on ${pagePath}`, async ({ sharedPage }) => {
      console.log(`\nTesting page: ${pagePath}`);
      console.time(`Page load: ${pagePath}`);
      
      try {
        // First verify dev server is running
        await retryOperation(
          async () => {
            console.log('Checking dev server status...');
            try {
              const response = await fetch('http://localhost:3000/').catch(() => null);
              if (!response?.ok) {
                throw new Error('Dev server not responding or returned error');
              }
              console.log('Dev server is running');
              return true;
            } catch (e) {
              console.error('Dev server check failed:', e);
              throw new Error('Dev server not accessible');
            }
          },
          3,
          undefined,
          'Dev server check'
        );

        console.log(`Attempting navigation to ${pagePath}...`);
        
        // Navigate with improved response handling
        await retryOperation(
          async () => {
            const response = await sharedPage.goto(`http://localhost:3000${pagePath}`, {
              waitUntil: 'commit', // Wait for initial response only
              timeout: 30000
            });
            
            if (!response) {
              throw new Error(`Navigation failed - no response received for ${pagePath}`);
            }
            
            if (!response.ok()) {
              throw new Error(`Navigation failed - server returned ${response.status()} for ${pagePath}`);
            }

            // Log response details for debugging
            console.log('Navigation response:', {
              status: response.status(),
              statusText: response.statusText(),
              url: response.url()
            });
            
            return true;
          },
          3,
          undefined,
          'Initial navigation'
        );

        // Then wait for complete page load
        await retryOperation(
          async () => {
            await sharedPage.waitForLoadState('domcontentloaded');
            return true;
          },
          3,
          undefined,
          'Wait for DOMContentLoaded'
        );

        // Finally ensure page is fully stable
        await retryOperation(
          async () => {
            const isStable = await sharedPage.evaluate(() => {
              return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                  resolve(true);
                } else {
                  window.addEventListener('load', () => resolve(true), { once: true });
                  setTimeout(() => resolve(false), 5000); // Timeout after 5s
                }
              });
            });
            
            if (!isStable) {
              throw new Error('Page failed to reach stable state');
            }
            return true;
          },
          3,
          undefined,
          'Wait for page stability'
        );
        console.timeEnd(`Page load: ${pagePath}`);

        // Debug head content and favicon elements
        console.time('Head content evaluation');
        const headAnalysis = await sharedPage.evaluate(() => {
          const head = document.head;
          const faviconElements = Array.from(head.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]'));
          
          return {
            headContent: head.innerHTML,
            faviconCount: faviconElements.length,
            faviconDetails: faviconElements.map(el => ({
              rel: el.getAttribute('rel'),
              href: el.getAttribute('href'),
              type: el.getAttribute('type'),
              sizes: el.getAttribute('sizes')
            }))
          };
        });
        
        console.log('\nHead analysis:', {
          faviconCount: headAnalysis.faviconCount,
          faviconDetails: headAnalysis.faviconDetails
        });
        console.log('\nHead content:', headAnalysis.headContent);
        console.timeEnd('Head content evaluation');

        // First check if any link tags exist
        console.time('Link tag count');
        const linkCount = await sharedPage.locator('link').count();
        console.log(`Found ${linkCount} link tags`);
        console.timeEnd('Link tag count');

        // Cache all link elements first
        console.time('Cache link elements');
        const allLinks = await sharedPage.locator('link').all();
        console.log(`Cached ${allLinks.length} link elements`);
        console.timeEnd('Cache link elements');

        // Then check specific favicons
      for (const favicon of expectedFavicons) {
        const { rel, type, sizes, href } = favicon;
        const selector = `link[rel="${rel}"]${type ? `[type="${type}"]` : ''}${sizes ? `[sizes="${sizes}"]` : ''}[href="${href}"]`;
        
        console.log(`Checking ${href}...`);
        
        console.time(`Favicon check: ${href}`);
        try {
          // Try to find favicon with different selector strategies
          const element = sharedPage.locator(selector);
          
          // Wait for element to be present with more detailed timeout messaging
          await element.waitFor({
            timeout: 10000,
            state: 'attached'
          }).catch(e => {
            console.error(`Timeout waiting for favicon ${href} to be present in DOM`);
            throw e;
          });
          
          // Verify element is still valid before evaluation
          const isVisible = await element.isVisible().catch(e => {
            console.error(`Error checking visibility for ${href}:`, e);
            return false;
          });
          console.log(`Favicon ${href} visibility:`, isVisible);
          
          // Validate page state before element evaluation
          const validatePageState = async () => {
            const isValid = await sharedPage.evaluate(() => {
              return document?.body !== null && document.readyState === 'complete';
            }).catch(() => false);
            console.log(`Page state validation: ${isValid ? 'valid' : 'invalid'}`);
            return isValid;
          };

          // Get actual element attributes for debugging with retry
          const attrs = await retryOperation(
            async () => {
              const result = await Promise.race([
                element.evaluate(el => ({
                  rel: el.getAttribute('rel'),
                  type: el.getAttribute('type'),
                  sizes: el.getAttribute('sizes'),
                  href: el.getAttribute('href')
                })),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error(`Attribute evaluation timeout for ${href}`)), 5000)
                )
              ]);
              return result;
            },
            3,
            validatePageState
          );
          console.log(`Found favicon with attributes:`, attrs);
          
          // Verify element count with retry and state validation
          const count = await retryOperation(
            async () => {
              const elementCount = await element.count();
              if (elementCount === 0) {
                throw new Error(`No instances of favicon ${href} found on ${pagePath}`);
              }
              return elementCount;
            },
            3,
            validatePageState
          );
          console.log(`Found ${count} instances of favicon ${href} on ${pagePath}`);
          expect(count, `Expected favicon ${href} to be present on ${pagePath} but found ${count} instances`).toBeGreaterThan(0);
        } catch (e) {
          console.error(`Error checking favicon ${href}:`, e);
          throw e;
        } finally {
          console.timeEnd(`Favicon check: ${href}`);
        }
      }

      // Take screenshot
      console.time('Screenshot capture');
      await sharedPage.screenshot({
        path: `test-results/favicon-test-${pagePath.replace(/\//g, '-') || 'home'}.png`
      });
      console.timeEnd('Screenshot capture');
      
      } catch (e) {
        console.error(`Fatal error testing page ${pagePath}:`, e);
        throw e;
      }
    });
  }
});