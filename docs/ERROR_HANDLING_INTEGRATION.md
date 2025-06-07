# Error Handling Integration Guide

## Overview
This guide provides step-by-step instructions for integrating the standardized error handling system into your NosytLabs application.

## Quick Start

### 1. Include Global Error Handler
Add the global error handler to your main HTML file or application entry point:

```html
<!-- Include in your main HTML file -->
<script type="module" src="/scripts/global-error-handler.js"></script>
```

Or in your main JavaScript/TypeScript file:
```javascript
import '@/scripts/global-error-handler';
```

### 2. Import Error Utilities
In any file where you need error handling:

```javascript
import { 
  handleError, 
  tryExecute, 
  tryExecuteAsync, 
  handleResourceError,
  ErrorSeverity, 
  ErrorCategory 
} from '@/utils/errorUtils';
```

### 3. Replace Existing Error Handling
Update your existing error handling patterns:

```javascript
// ❌ Old pattern
try {
  riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
}

// ✅ New pattern
const result = tryExecute(() => riskyOperation(), 'Risky operation');
```

## Integration Patterns

### API Calls
```javascript
// ❌ Before
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}

// ✅ After
import { tryExecuteAsync, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

async function fetchUserData(userId) {
  return await tryExecuteAsync(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }, `Fetch user data for ID: ${userId}`);
}
```

### Form Validation
```javascript
// ❌ Before
function validateForm(formData) {
  try {
    if (!formData.email) {
      throw new Error('Email is required');
    }
    if (!formData.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    showErrorMessage(error.message);
    return false;
  }
}

// ✅ After
import { handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

function validateForm(formData) {
  try {
    if (!formData.email) {
      throw new Error('Email is required');
    }
    if (!formData.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return true;
  } catch (error) {
    handleError(error, 'Form validation', ErrorSeverity.MEDIUM, ErrorCategory.VALIDATION);
    showErrorMessage(error.message);
    return false;
  }
}
```

### Resource Loading
```javascript
// ❌ Before
function loadImage(src) {
  const img = new Image();
  img.onload = () => console.log('Image loaded successfully');
  img.onerror = (event) => {
    console.error('Failed to load image:', src);
    img.src = '/images/fallback.png';
  };
  img.src = src;
  return img;
}

// ✅ After
import { handleResourceError } from '@/utils/errorUtils';

function loadImage(src) {
  const img = new Image();
  img.onload = () => console.log('Image loaded successfully');
  img.onerror = handleResourceError;
  img.src = src;
  return img;
}
```

### Event Handlers
```javascript
// ❌ Before
button.addEventListener('click', (event) => {
  try {
    performComplexOperation();
  } catch (error) {
    console.error('Button click handler failed:', error);
  }
});

// ✅ After
import { tryExecute } from '@/utils/errorUtils';

button.addEventListener('click', (event) => {
  tryExecute(() => performComplexOperation(), 'Button click handler');
});
```

## Astro Component Integration

### Component Error Boundaries
```astro
---
// MyComponent.astro
import { handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

let data = null;
let error = null;

try {
  // Risky operation during component initialization
  data = await fetchComponentData();
} catch (err) {
  error = err;
  handleError(err, 'Component data fetch', ErrorSeverity.HIGH, ErrorCategory.NETWORK);
}
---

{error ? (
  <div class="error-state">
    <p>Unable to load component data. Please try again later.</p>
  </div>
) : (
  <div class="component-content">
    <!-- Normal component content -->
    {data && <ComponentContent data={data} />}
  </div>
)}

<script>
  import { handleResourceError } from '@/utils/errorUtils';
  
  // Handle resource errors in the component
  document.addEventListener('error', handleResourceError, true);
</script>
```

### Client-Side Script Error Handling
```astro
<script>
  import { tryExecute, handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';
  
  // Safe DOM manipulation
  const initializeComponent = () => {
    const element = document.querySelector('.my-component');
    if (!element) {
      handleError(
        new Error('Component element not found'), 
        'Component initialization', 
        ErrorSeverity.HIGH, 
        ErrorCategory.RUNTIME
      );
      return;
    }
    
    // Safe event binding
    element.addEventListener('click', (event) => {
      tryExecute(() => {
        // Component logic here
        handleComponentClick(event);
      }, 'Component click handler');
    });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponent);
  } else {
    initializeComponent();
  }
</script>
```

## Testing Error Handling

### Unit Tests
```javascript
// error-handling.test.js
import { handleError, tryExecute, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

describe('Error Handling', () => {
  beforeEach(() => {
    // Clear any stored errors
    localStorage.removeItem('nosytlabs_errors');
    sessionStorage.removeItem('nosytlabs_session_errors');
  });
  
  test('handleError stores error information', () => {
    const error = new Error('Test error');
    handleError(error, 'Test context', ErrorSeverity.HIGH, ErrorCategory.RUNTIME);
    
    const storedErrors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
    expect(storedErrors).toHaveLength(1);
    expect(storedErrors[0].message).toBe('Test error');
    expect(storedErrors[0].context).toBe('Test context');
  });
  
  test('tryExecute handles errors gracefully', () => {
    const riskyFunction = () => {
      throw new Error('Risky operation failed');
    };
    
    const result = tryExecute(riskyFunction, 'Test operation');
    expect(result).toBeUndefined();
    
    // Check that error was logged
    const storedErrors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
    expect(storedErrors).toHaveLength(1);
  });
});
```

### Integration Tests
```javascript
// integration.test.js
describe('Error Handling Integration', () => {
  test('global error handler catches unhandled errors', (done) => {
    // Set up error listener
    const originalHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      expect(message).toContain('Test unhandled error');
      window.onerror = originalHandler;
      done();
    };
    
    // Trigger unhandled error
    setTimeout(() => {
      throw new Error('Test unhandled error');
    }, 0);
  });
});
```

## Performance Considerations

### Error Reporting Throttling
The error handling system includes built-in throttling to prevent spam:

- Maximum 50 errors stored in localStorage
- Maximum 20 errors stored in sessionStorage
- Automatic cleanup of old errors

### Memory Management
```javascript
// Clean up stored errors periodically
import { clearStoredErrors } from '@/utils/errorUtils';

// Clear errors on application shutdown or periodically
window.addEventListener('beforeunload', clearStoredErrors);

// Or set up periodic cleanup
setInterval(() => {
  const errors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
  if (errors.length > 30) {
    clearStoredErrors();
  }
}, 5 * 60 * 1000); // Every 5 minutes
```

## Monitoring and Analytics

### Error Reporting Service Integration
```javascript
// error-reporting.js
import { handleError } from '@/utils/errorUtils';

// Extend handleError to send to external service
const originalHandleError = handleError;

export function setupErrorReporting(apiKey, endpoint) {
  // Override the global error handler to include reporting
  window.nosytErrorReporting = {
    apiKey,
    endpoint,
    
    async reportError(errorInfo) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(errorInfo)
        });
      } catch (reportingError) {
        console.warn('Failed to report error:', reportingError);
      }
    }
  };
}
```

## Best Practices

1. **Always provide context** - Include meaningful context in error messages
2. **Use appropriate severity levels** - Match severity to actual impact
3. **Categorize errors properly** - Use correct error categories for better organization
4. **Don't suppress errors** - Always handle errors, don't just ignore them
5. **Test error scenarios** - Include error cases in your tests
6. **Monitor error patterns** - Review stored errors regularly for patterns
7. **Clean up resources** - Use cleanup functions for event listeners and timers

## Troubleshooting

### Common Issues

**Q: Errors not being caught by global handler**
A: Ensure global-error-handler.js is loaded early in your application

**Q: Console still showing direct error messages**
A: Check for remaining console.error calls that haven't been migrated

**Q: Error utilities not found**
A: Verify the import path is correct and the utilities are properly exported

**Q: Performance issues with error handling**
A: Check if error reporting is being throttled and consider reducing error frequency
