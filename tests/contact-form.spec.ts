import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should load contact page', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page).toHaveTitle(/Contact|Get In Touch|NosytLabs/i);
    // Hero heading content on contact page
    await expect(page.locator('h1')).toContainText(/Let.?s Build Something/i);
  });

  test('should display contact form', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('#unified-contact-form')).toBeVisible();
    await expect(page.locator('#unified-contact-form input#name')).toBeVisible();
    await expect(page.locator('#unified-contact-form input#email')).toBeVisible();
    // Subject & message exist in the default 'general' form
    await expect(page.locator('#unified-contact-form #subject, #unified-contact-form input[name="subject"]')).toBeVisible();
    await expect(page.locator('#unified-contact-form #message, #unified-contact-form textarea[name="message"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/contact');
    
    // Trigger validation by focusing and blurring each required field
    await page.focus('#unified-contact-form input#name');
    await page.blur('#unified-contact-form input#name');
    await page.focus('#unified-contact-form input#email');
    await page.blur('#unified-contact-form input#email');
    await page.focus('#unified-contact-form #subject');
    await page.blur('#unified-contact-form #subject');
    await page.focus('#unified-contact-form textarea[name="message"]');
    await page.blur('#unified-contact-form textarea[name="message"]');
    
    // Zod-driven messages
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Subject must be at least 5 characters')).toBeVisible();
    await expect(page.locator('text=Message must be at least 20 characters')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/contact');
    
    await page.fill('#unified-contact-form input[name="email"]', 'invalid-email');
  // Interact with reCAPTCHA placeholder to enable submit
  await page.click('button:has-text("Verify")');
  await expect(page.locator('#unified-contact-form button[type="submit"]')).not.toHaveAttribute('disabled', '');
  await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should submit form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form with valid data
    await page.fill('#unified-contact-form input[name="name"]', 'Test User');
    await page.fill('#unified-contact-form input[name="email"]', 'test@example.com');
    await page.fill('#unified-contact-form #subject', 'Test Subject');
    await page.selectOption('#unified-contact-form #serviceInterest', 'web-development');
    await page.fill('#unified-contact-form textarea[name="message"]', 'This is a test message');
    
    // Interact with reCAPTCHA placeholder
  await page.click('button:has-text("Verify")');
  await expect(page.locator('button[type="submit"]')).not.toHaveAttribute('disabled', '');
    
    // Mock API success and delay to surface loading state
    await page.route('**/api/contact/form', async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Thank you for your message! We\'ll get back to you soon.')).toBeVisible();
  });

  test('should handle file upload', async ({ page }) => {
    await page.goto('/contact');
    
    // Upload a file
    await page.setInputFiles('input[type="file"]', {
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test content')
    });
    
    // Verify file is selected
    await expect(page.locator('text=test-document.pdf')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
  await page.fill('#unified-contact-form input[name="name"]', 'Test User');
  await page.fill('#unified-contact-form input[name="email"]', 'test@example.com');
  await page.fill('#unified-contact-form input[name="subject"]', 'Test Subject');
  await page.fill('#unified-contact-form textarea[name="message"]', 'Test message');
  // Interact with reCAPTCHA placeholder to enable submit
  await page.click('button:has-text("Verify")');
  await expect(page.locator('button[type="submit"]')).not.toHaveAttribute('disabled', '');
    
    // Submit and check loading state
    await page.route('**/api/contact/form', async (route) => {
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.click('button[type="submit"]');
    
    await expect(page.locator('button[disabled]')).toBeVisible();
    await expect(page.locator('text=Sending...')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/contact/form', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    }));
    
    await page.goto('/contact');
    
    // Fill form
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="subject"]', 'Test Subject');
  await page.fill('textarea[name="message"]', 'Test message');
  // Interact with reCAPTCHA placeholder to enable submit
  await page.click('button:has-text("Verify")');
  await expect(page.locator('button[type="submit"]')).not.toHaveAttribute('disabled', '');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Failed to submit form')).toBeVisible();
  });
});

test.describe('Newsletter Signup', () => {
  test('should load newsletter signup', async ({ page }) => {
    await page.goto('/');
    
    // Find newsletter signup (usually in footer or hero)
    const newsletterForm = page.locator('form[action*="newsletter"]');
    if (await newsletterForm.isVisible()) {
      await expect(newsletterForm.locator('input[type="email"]')).toBeVisible();
      await expect(newsletterForm.locator('button[type="submit"]')).toBeVisible();
    }
  });

  test('should validate newsletter email', async ({ page }) => {
    await page.goto('/');
    
    const newsletterForm = page.locator('form[action*="newsletter"]');
    if (await newsletterForm.isVisible()) {
      await newsletterForm.locator('input[type="email"]').fill('invalid-email');
      await newsletterForm.locator('button[type="submit"]').click();
      
      await expect(page.locator('text=Please enter a valid email')).toBeVisible();
    }
  });
});

test.describe('API Endpoints', () => {
  test('should respond to health check', async ({ page }) => {
    const response = await page.goto('/api/health');
    expect(response?.ok()).toBeTruthy();
    
    const data = await response?.json();
    expect(data?.success).toBe(true);
    expect(data?.message).toBe('ok');
  });

  test('should handle contact form API (mocked)', async ({ page }) => {
    
    const response = await page.request.post('/api/contact/form', {
      data: {
        name: 'API Test',
        email: 'api@test.com',
        subject: 'API Test Subject',
        message: 'API test message',
        _token: 'test-token',
        consent: true
      }
    });
    
    expect(response?.ok()).toBeTruthy();
    
    const data = await response?.json();
    expect(data?.success).toBe(true);
    expect(data?.message).toContain('successfully');
  });

  test('should handle newsletter signup API (mocked)', async ({ page }) => {
    
    const response = await page.request.post('/api/contact/newsletter', {
      data: {
        email: 'newsletter@test.com',
        _token: 'test-token'
      }
    });
    
    expect(response?.ok()).toBeTruthy();
    
    const data = await response?.json();
    expect(data?.success).toBe(true);
    expect(data?.message).toContain('successful');
  });



  test('should return contact statistics', async ({ page }) => {
    const response = await page.goto('/api/contact/stats');
    expect(response?.ok()).toBeTruthy();
    
    const data = await response?.json();
    expect(data?.success).toBe(true);
    expect(data?.stats).toBeDefined();
    expect(data?.stats?.totalContacts).toBeDefined();
    expect(data?.stats?.totalNewsletter).toBeDefined();
    expect(data?.stats?.totalProjects).toBeDefined();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');
    
    // Check form is accessible on mobile
    await expect(page.locator('#unified-contact-form')).toBeVisible();
    await expect(page.locator('#unified-contact-form input[name="name"]')).toBeVisible();
  });

  test('should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/contact');
    
    // Check form is accessible on tablet
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper form labels', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="subject"]')).toBeVisible();
    await expect(page.locator('label[for="message"]')).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('form[role="form"]')).toBeVisible();
    // At minimum name & email are required in the DOM; subject/message enforced by validation
    await expect(page.locator('input[required]')).toHaveCount(2);
    await expect(page.locator('textarea')).toHaveCount(1);
  });
});