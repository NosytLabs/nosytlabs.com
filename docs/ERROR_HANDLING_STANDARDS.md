# Error Handling Standards

## Overview
This document defines standardized error handling patterns for the NosytLabs codebase using the consolidated error utilities from `@/utils/errorUtils`.

## Quick Reference

### Basic Error Handling
```javascript
import { handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

// Handle an error with context
handleError(error, 'User authentication', ErrorSeverity.HIGH, ErrorCategory.VALIDATION);
```

### Safe Function Execution
```javascript
import { tryExecute, tryExecuteAsync } from '@/utils/errorUtils';

// Synchronous function
const result = tryExecute(() => riskyOperation(), 'Risky operation');

// Asynchronous function
const result = await tryExecuteAsync(() => fetch('/api/data'), 'API call');
```

### Resource Error Handling
```javascript
import { handleResourceError } from '@/utils/errorUtils';

// Set up resource error handling
document.addEventListener('error', handleResourceError, true);

// Or handle specific resource errors
img.addEventListener('error', (event) => {
  handleResourceError(event, { fallbackImage: '/images/custom-fallback.png' });
});
```

## Migration Examples

### Before: Inconsistent Error Handling
```javascript
// ❌ Inconsistent patterns
try {
  riskyOperation();
} catch (error) {
  console.error('Something went wrong:', error);
}

// ❌ Direct console calls
console.error('Image failed to load:', src);
console.warn('API call failed');
```

### After: Standardized Error Handling
```javascript
// ✅ Standardized patterns
import { tryExecute, handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

const result = tryExecute(() => riskyOperation(), 'Risky operation');

// ✅ Proper error categorization
handleError(error, 'Image loading', ErrorSeverity.LOW, ErrorCategory.RESOURCE);
handleError(error, 'API call', ErrorSeverity.HIGH, ErrorCategory.NETWORK);
```

## Error Severity Levels
- **LOW**: Minor issues that don't affect functionality
- **MEDIUM**: Issues that may affect user experience
- **HIGH**: Serious issues that impact functionality
- **CRITICAL**: System-breaking errors

## Error Categories
- **RUNTIME**: General runtime errors
- **NETWORK**: Network and API related errors
- **VALIDATION**: Input validation errors
- **RESOURCE**: Resource loading errors
- **PERMISSION**: Permission and authorization errors
- **USER_INPUT**: User input related errors

## Best Practices
1. Always use `tryExecute` or `tryExecuteAsync` for risky operations
2. Provide meaningful context for all errors
3. Use appropriate severity levels and categories
4. Set up global error handling early in the application
5. Use `handleResourceError` for all resource loading errors
6. Avoid direct `console.error` calls - use `handleError` instead
