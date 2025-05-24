# NosytLabs Website Testing

This directory contains automated tests for the NosytLabs website using Playwright. These tests ensure that the website works correctly across different browsers, screen sizes, and devices.

## Test Suites

### 1. Responsive Design Tests (`responsive.spec.js`)

Tests the website's responsiveness across different screen sizes:
- Mobile (375x667)
- Tablet (768x1024)
- Laptop (1366x768)
- Desktop (1920x1080)

For each screen size, it checks:
- Header and navigation visibility
- Hero section and particles background
- Main content sections
- Footer and copyright information
- Projects section layout and interactions
- Contact form layout and interactions
- NosytOS95 interface functionality

### 2. Browser Compatibility Tests (`browser-compatibility.spec.js`)

Tests the website's compatibility across different browsers:
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

For each browser, it checks:
- Basic page rendering
- Particles.js functionality or fallback
- Project cards and hover effects
- NosytOS95 interface functionality

### 3. Resource Loading Tests (`resource-loading.spec.js`)

Tests the website's resource loading performance and error handling:
- Critical resource preloading
- Script loading order
- Resource loading error handling and fallbacks
- Image loading optimization
- CSS loading and application
- Dark mode switching

### 4. UI Components Tests (`ui-components.spec.js`)

Tests the functionality and appearance of UI components:
- ProjectCard component
- ProjectGrid component and filtering
- HeroSection component
- FeatureCard component
- ContactForm component and validation
- ParticleBackground component

## Running Tests

### Prerequisites

1. Node.js (v14 or later)
2. npm or yarn
3. Playwright browsers installed:
   ```
   npx playwright install
   ```

### Running All Tests

```bash
node tests/run-tests.js
```

### Running Specific Test Suites

```bash
# Run responsive design tests
node tests/run-tests.js "Responsive Design"

# Run browser compatibility tests
node tests/run-tests.js "Browser Compatibility"

# Run resource loading tests
node tests/run-tests.js "Resource Loading"

# Run UI components tests
node tests/run-tests.js "UI Components"

# Run mobile tests
node tests/run-tests.js "Mobile"
```

### Running with Playwright CLI

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/responsive.spec.js

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in mobile browsers
npx playwright test --project="Mobile Chrome" --project="Mobile Safari"
```

## Test Reports

After running tests, Playwright generates HTML reports in the `playwright-report` directory. Open the report with:

```bash
npx playwright show-report
```

Screenshots of test failures are saved in the `screenshots` directory.

## Continuous Integration

These tests can be run in a CI environment. The configuration automatically adjusts for CI:
- Retries failed tests
- Runs tests sequentially
- Captures screenshots, videos, and traces on failures

## Troubleshooting

### Common Issues

1. **Tests fail to start the development server**
   - Make sure the development server can be started with `npm run dev`
   - Check if port 3000 is already in use

2. **Browser tests fail**
   - Make sure all required browsers are installed:
     ```
     npx playwright install
     ```

3. **Visual differences across browsers**
   - Some visual differences between browsers are expected
   - Focus on functional compatibility rather than pixel-perfect rendering

4. **Resource loading tests fail**
   - Check if the website's resources are properly configured
   - Verify that preloaded resources are actually used

### Updating Tests

When making changes to the website, update the tests accordingly:

1. Update selectors if element classes or IDs change
2. Update expected behaviors if functionality changes
3. Add new tests for new features
4. Remove tests for removed features

## Best Practices

1. Run tests before and after making significant changes
2. Keep tests focused on user-facing functionality
3. Use descriptive test names and comments
4. Group related tests together
5. Avoid brittle selectors that might change frequently
6. Test both happy paths and error cases
