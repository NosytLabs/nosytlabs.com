/**
 * API Endpoint Test Script
 * Tests the contact form API endpoint functionality
 */

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  details?: any;
}

class APIEndpointTester {
  private baseUrl: string;
  private results: TestResult[] = [];

  constructor(baseUrl: string = 'http://localhost:4321') {
    this.baseUrl = baseUrl;
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting API endpoint tests...\n');

    await this.testGetEndpoint();
    await this.testPostEndpoint();
    await this.testValidation();
    await this.testCorsHeaders();
    await this.testErrorHandling();

    this.printSummary();
    return this.results;
  }

  private async testGetEndpoint(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success && data.methods) {
        this.results.push({
          test: 'GET Endpoint Availability',
          passed: true,
          message: 'GET endpoint responds correctly',
          details: data
        });
      } else {
        this.results.push({
          test: 'GET Endpoint Availability',
          passed: false,
          message: 'GET endpoint failed',
          details: data
        });
      }
    } catch (error) {
      this.results.push({
        test: 'GET Endpoint Availability',
        passed: false,
        message: `GET endpoint error: ${error}`,
        details: error
      });
    }
  }

  private async testPostEndpoint(): Promise<void> {
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'API Test',
        service: 'web-development',
        message: 'This is a test message from the API test script.'
      };

      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        body: new URLSearchParams(testData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.results.push({
          test: 'POST Endpoint Functionality',
          passed: true,
          message: 'POST endpoint processes form data correctly',
          details: data
        });
      } else {
        this.results.push({
          test: 'POST Endpoint Functionality',
          passed: false,
          message: 'POST endpoint failed to process form data',
          details: data
        });
      }
    } catch (error) {
      this.results.push({
        test: 'POST Endpoint Functionality',
        passed: false,
        message: `POST endpoint error: ${error}`,
        details: error
      });
    }
  }

  private async testValidation(): Promise<void> {
    // Test missing required fields
    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        body: new URLSearchParams({}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const data = await response.json();

      if (response.status === 400 && !data.success && data.errors) {
        this.results.push({
          test: 'Input Validation',
          passed: true,
          message: 'API correctly validates required fields',
          details: data
        });
      } else {
        this.results.push({
          test: 'Input Validation',
          passed: false,
          message: 'API validation not working correctly',
          details: data
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Input Validation',
        passed: false,
        message: `Validation test error: ${error}`,
        details: error
      });
    }
  }

  private async testCorsHeaders(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'OPTIONS'
      });

      const corsHeaders = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers')
      };

      if (corsHeaders['access-control-allow-origin'] === '*') {
        this.results.push({
          test: 'CORS Configuration',
          passed: true,
          message: 'CORS headers are properly configured',
          details: corsHeaders
        });
      } else {
        this.results.push({
          test: 'CORS Configuration',
          passed: false,
          message: 'CORS headers missing or incorrect',
          details: corsHeaders
        });
      }
    } catch (error) {
      this.results.push({
        test: 'CORS Configuration',
        passed: false,
        message: `CORS test error: ${error}`,
        details: error
      });
    }
  }

  private async testErrorHandling(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        body: 'invalid data',
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      const data = await response.json();

      if (response.status === 400 && !data.success) {
        this.results.push({
          test: 'Error Handling',
          passed: true,
          message: 'API correctly handles invalid content type',
          details: data
        });
      } else {
        this.results.push({
          test: 'Error Handling',
          passed: false,
          message: 'API error handling not working correctly',
          details: data
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Error Handling',
        passed: false,
        message: `Error handling test error: ${error}`,
        details: error
      });
    }
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    console.log('\n📊 Test Summary:');
    console.log(`Passed: ${passed}/${total}`);

    if (passed === total) {
      console.log('✅ All tests passed!');
    } else {
      console.log('❌ Some tests failed:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.test}: ${result.message}`);
      });
    }

    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   Details:`, result.details);
      }
      console.log('');
    });
  }
}

// Export for use in other scripts
export { APIEndpointTester };

// Run tests if this script is executed directly
if (import.meta.main) {
  const tester = new APIEndpointTester();
  await tester.runAllTests();
}