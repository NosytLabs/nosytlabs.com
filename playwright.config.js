import { defineConfig, devices } from '@playwright/test';

/**
 * Comprehensive Playwright Configuration for NosytLabs
 * Tests UI alignment, responsiveness, accessibility, and functionality
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Exclude unit tests to avoid conflicts
  testIgnore: ['**/unit/**', '**/performance/**'],
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
    ['list']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global test timeout
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run your local dev server before starting the tests
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },

  // Global setup and teardown
  // globalSetup: './tests/global-setup.js',
  // globalTeardown: './tests/global-teardown.js',

  // Test timeout
  timeout: 30 * 1000,
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 5000,
    // Threshold for pixel comparisons
    threshold: 0.2,
    // Animation handling
    toHaveScreenshot: { 
      threshold: 0.2, 
      maxDiffPixels: 100,
      animations: 'disabled'
    },
    toMatchSnapshot: { 
      threshold: 0.2,
      maxDiffPixels: 100 
    },
  },

  // Output directory for test artifacts
  outputDir: 'test-artifacts/',
  
  // Test metadata
  metadata: {
    testType: 'UI/UX Comprehensive Testing',
    project: 'NosytLabs Website',
    version: '1.0.0',
  },
});
