# Code Consolidation Migration Guide

## Overview
This guide helps migrate from duplicate utility functions to the consolidated utilities in `@/utils`.

## Consolidated Utilities

### DOM Utilities (`@/utils/domUtils`)
Replace inline DOM manipulation with standardized utilities:

```javascript
// Before
const element = document.getElementById('my-id');
const elements = document.querySelectorAll('.my-class');

// After
import { getById, queryAll } from '@/utils/domUtils';
const element = getById('my-id');
const elements = queryAll('.my-class');
```

### Error Handling (`@/utils/errorUtils`)
Replace inline error handling with standardized utilities:

```javascript
// Before
try {
  riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
}

// After
import { tryExecute } from '@/utils/errorUtils';
tryExecute(() => riskyOperation(), 'Risky operation');
```

### Browser Detection (`@/utils/browserUtils`)
Replace inline browser detection with standardized utilities:

```javascript
// Before
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// After
import { prefersReducedMotion, isMobile } from '@/utils/browserUtils';
```

### File Processing (`@/utils/fileUtils`)
Replace inline file processing with standardized utilities:

```javascript
// Before
const extension = filename.substring(filename.lastIndexOf('.'));

// After
import { getFileExtension } from '@/utils/fileUtils';
const extension = getFileExtension(filename);
```

## Migration Steps

1. **Identify duplicate code** - Look for patterns that match consolidated utilities
2. **Update imports** - Add imports for the consolidated utilities
3. **Replace inline code** - Replace duplicate implementations with utility calls
4. **Test functionality** - Ensure all functionality works as expected
5. **Remove old code** - Clean up the replaced inline implementations

## Benefits

- **Consistency** - Standardized behavior across the application
- **Maintainability** - Single source of truth for common operations
- **Error Handling** - Built-in error handling and validation
- **Performance** - Optimized implementations with caching where appropriate
- **Type Safety** - Full TypeScript support with proper type definitions
