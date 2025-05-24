/**
 * Test Runner Script
 * 
 * This script runs all the Playwright tests and generates a report.
 * It can be used to run tests in different configurations.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Define test configurations
const testConfigs = [
  {
    name: 'Responsive Design Tests',
    command: 'npx playwright test tests/responsive.spec.js --project=chromium',
    description: 'Tests the website\'s responsiveness across different screen sizes'
  },
  {
    name: 'Browser Compatibility Tests',
    command: 'npx playwright test tests/browser-compatibility.spec.js',
    description: 'Tests the website\'s compatibility across different browsers'
  },
  {
    name: 'Resource Loading Tests',
    command: 'npx playwright test tests/resource-loading.spec.js --project=chromium',
    description: 'Tests the website\'s resource loading performance and error handling'
  },
  {
    name: 'UI Components Tests',
    command: 'npx playwright test tests/ui-components.spec.js --project=chromium',
    description: 'Tests the functionality and appearance of UI components'
  },
  {
    name: 'Mobile Tests',
    command: 'npx playwright test --project="Mobile Chrome" --project="Mobile Safari"',
    description: 'Tests the website on mobile devices'
  },
  {
    name: 'All Tests',
    command: 'npx playwright test',
    description: 'Runs all tests across all browsers and devices'
  }
];

// Function to run a test configuration
function runTestConfig(config) {
  console.log(`\n\n=== Running ${config.name} ===`);
  console.log(config.description);
  console.log('Command:', config.command);
  console.log('='.repeat(50));
  
  try {
    execSync(config.command, { stdio: 'inherit' });
    console.log(`\n✅ ${config.name} completed successfully`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${config.name} failed with error:`, error.message);
    return false;
  }
}

// Main function to run tests
function runTests() {
  console.log('=== NosytLabs Website Testing ===');
  console.log('Starting tests at:', new Date().toLocaleString());
  console.log('='.repeat(50));
  
  // Check if a specific test was requested
  const requestedTest = process.argv[2];
  
  if (requestedTest) {
    // Find the requested test configuration
    const config = testConfigs.find(c => c.name.toLowerCase().includes(requestedTest.toLowerCase()));
    
    if (config) {
      runTestConfig(config);
    } else {
      console.error(`Test configuration "${requestedTest}" not found.`);
      console.log('Available test configurations:');
      testConfigs.forEach((config, index) => {
        console.log(`${index + 1}. ${config.name} - ${config.description}`);
      });
    }
  } else {
    // Run all test configurations
    let successCount = 0;
    let failureCount = 0;
    
    for (const config of testConfigs.slice(0, -1)) { // Skip the "All Tests" configuration
      const success = runTestConfig(config);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }
    
    console.log('\n=== Test Summary ===');
    console.log(`Total tests: ${testConfigs.length - 1}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log('='.repeat(50));
    
    if (failureCount === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Check the logs for details.');
      process.exit(1);
    }
  }
}

// Run the tests
runTests();
