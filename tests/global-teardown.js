/**
 * Global Teardown for Playwright Tests
 * Cleanup and reporting after all tests complete
 */

import fs from 'fs';
import path from 'path';

async function globalTeardown(config) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Generate test summary report
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      console.log('\n📊 Test Results Summary:');
      console.log(`   Total Tests: ${results.stats?.total || 'N/A'}`);
      console.log(`   Passed: ${results.stats?.passed || 'N/A'}`);
      console.log(`   Failed: ${results.stats?.failed || 'N/A'}`);
      console.log(`   Skipped: ${results.stats?.skipped || 'N/A'}`);
      console.log(`   Duration: ${results.stats?.duration || 'N/A'}ms`);
      
      // Create a simple HTML summary
      const summaryHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>NosytLabs Test Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
    </style>
</head>
<body>
    <h1>NosytLabs UI Test Summary</h1>
    <div class="summary">
        <h2>Results</h2>
        <p><strong>Total Tests:</strong> ${results.stats?.total || 'N/A'}</p>
        <p class="passed"><strong>Passed:</strong> ${results.stats?.passed || 'N/A'}</p>
        <p class="failed"><strong>Failed:</strong> ${results.stats?.failed || 'N/A'}</p>
        <p class="skipped"><strong>Skipped:</strong> ${results.stats?.skipped || 'N/A'}</p>
        <p><strong>Duration:</strong> ${results.stats?.duration || 'N/A'}ms</p>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;
      
      fs.writeFileSync(
        path.join(process.cwd(), 'test-results', 'summary.html'),
        summaryHtml
      );
    }
    
    console.log('✅ Global teardown completed');
    console.log('📁 Test artifacts saved to: test-results/');
    
  } catch (error) {
    console.error('❌ Global teardown error:', error.message);
  }
}

export default globalTeardown;
