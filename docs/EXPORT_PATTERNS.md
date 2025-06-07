# NosytLabs Export Pattern Standards

This document defines standardized import/export patterns for consistent module organization across the NosytLabs codebase.

## Overview

Consistent import/export patterns improve code maintainability, enable better tree-shaking, and provide a clear module architecture. This guide establishes standards for different types of modules.

## Export Pattern Standards

### 1. Components (Astro, React, Vue)

**Standard: Default Exports**

```astro
---
// ✅ Astro Component - Default Export
export interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div>
  <h1>{title}</h1>
  {description && <p>{description}</p>}
</div>
```

```typescript
// ✅ React Component - Default Export
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### 2. Utilities and Functions

**Standard: Named Exports**

```javascript
// ✅ Utility Functions - Named Exports
/**
 * Format currency value
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### 3. Constants and Configuration

**Standard: Named Exports with Default Aggregate**

```javascript
// ✅ Constants - Named Exports with Default
export const COMPANY = {
  NAME: 'NosytLabs',
  WEBSITE: 'https://nosytlabs.com'
};

export const COLORS = {
  PRIMARY: '#4C1D95',
  SECONDARY: '#FF6B00'
};

// Default export for convenience
export default {
  COMPANY,
  COLORS
};
```

### 4. Classes and Services

**Standard: Default Export with Named Alternatives**

```javascript
// ✅ Class - Default Export
export default class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async get(endpoint) {
    // Implementation
  }
}

// Named export for specific use cases
export { ApiService };
```

### 5. Types and Interfaces (TypeScript)

**Standard: Named Exports**

```typescript
// ✅ Types - Named Exports
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

## Import Pattern Standards

### 1. Absolute Imports (Preferred)

Use path aliases for internal modules:

```javascript
// ✅ Absolute imports with path aliases
import { COMPANY, COLORS } from '@/config/constants';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatting';
import type { User } from '@/types/user';
```

### 2. Relative Imports (Limited Use)

Only for closely related files in the same directory:

```javascript
// ✅ Relative imports for same directory
import { validateInput } from './validation';
import { defaultConfig } from './config';

// ❌ Avoid deep relative paths
import { utils } from '../../../utils/helpers';
```

### 3. Type-Only Imports (TypeScript)

Use `type` keyword for type-only imports:

```typescript
// ✅ Type-only imports
import type { User, ApiResponse } from '@/types/api';
import type { ComponentProps } from 'react';

// ✅ Mixed imports
import { formatDate, type DateFormat } from '@/utils/date';
```

### 4. Dynamic Imports

Use for code splitting and lazy loading:

```javascript
// ✅ Dynamic imports for lazy loading
const loadChart = async () => {
  const { Chart } = await import('@/components/Chart');
  return Chart;
};

// ✅ Dynamic imports with error handling
try {
  const module = await import('@/features/advanced-analytics');
  module.initialize();
} catch (error) {
  console.warn('Advanced analytics not available:', error);
}
```

## Barrel Export Patterns

### 1. Component Barrel Exports

```typescript
// src/components/ui/index.ts
// ✅ Component barrel export
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Card } from './Card';

// Re-export types
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { ModalProps } from './Modal';
```

### 2. Utility Barrel Exports

```javascript
// src/utils/index.js
// ✅ Utility barrel export
export * from './formatting';
export * from './validation';
export * from './api';
export * from './storage';

// Grouped exports for convenience
export {
  formatCurrency,
  formatDate,
  formatNumber
} from './formatting';
```

### 3. Feature Barrel Exports

```typescript
// src/features/user-management/index.ts
// ✅ Feature barrel export
export { default as UserList } from './components/UserList';
export { default as UserForm } from './components/UserForm';
export * from './hooks/useUser';
export * from './services/userApi';
export type * from './types';
```

## Anti-Patterns to Avoid

### ❌ Mixed Export Patterns

```javascript
// ❌ Don't mix default and named exports in utilities
export const helper1 = () => {};
export const helper2 = () => {};
export default { helper1, helper2 }; // Confusing
```

### ❌ Deep Relative Imports

```javascript
// ❌ Avoid deep relative paths
import { utils } from '../../../utils/helpers';
import { config } from '../../../../config/app';
```

### ❌ Circular Dependencies

```javascript
// ❌ File A imports B, B imports A
// fileA.js
import { funcB } from './fileB';

// fileB.js  
import { funcA } from './fileA'; // Circular dependency
```

### ❌ Default Export of Primitives

```javascript
// ❌ Don't default export primitives
export default 'some-string';
export default 42;
export default true;

// ✅ Use named exports instead
export const API_URL = 'some-string';
export const MAX_RETRIES = 42;
export const FEATURE_ENABLED = true;
```

## File Organization Standards

### Directory Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.astro          # Default export
│   │   ├── Input.astro           # Default export
│   │   └── index.ts              # Barrel export
│   ├── layout/
│   │   ├── Header.astro          # Default export
│   │   ├── Footer.astro          # Default export
│   │   └── index.ts              # Barrel export
│   └── index.ts                  # Main barrel export
├── utils/
│   ├── formatting.js             # Named exports
│   ├── validation.js             # Named exports
│   ├── api.js                    # Named exports
│   └── index.js                  # Barrel export
├── config/
│   ├── constants.js              # Named + default
│   ├── branding.js               # Named + default
│   └── index.js                  # Barrel export
└── types/
    ├── api.ts                    # Named exports
    ├── user.ts                   # Named exports
    └── index.ts                  # Barrel export
```

## Migration Guidelines

### Step 1: Identify Inconsistencies

Run the analysis script:
```bash
node scripts/analyze-export-patterns.js
```

### Step 2: Prioritize Changes

1. Fix mixed export patterns first
2. Standardize component exports (default)
3. Standardize utility exports (named)
4. Implement barrel exports
5. Convert to absolute imports

### Step 3: Update Imports

```javascript
// Before
import utils from '../../../utils/helpers';
import { Button } from '../../components/ui/Button';

// After
import { formatCurrency, validateEmail } from '@/utils';
import Button from '@/components/ui/Button';
```

## ESLint Rules

Add these rules to enforce patterns:

```javascript
// eslint.config.cjs
rules: {
  // Prefer absolute imports
  'import/no-relative-parent-imports': 'warn',
  
  // Consistent export style
  'import/prefer-default-export': 'off',
  'import/no-default-export': 'off',
  
  // Prevent circular dependencies
  'import/no-cycle': 'error',
  
  // Organize imports
  'import/order': ['warn', {
    'groups': [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index'
    ],
    'pathGroups': [
      {
        'pattern': '@/**',
        'group': 'internal',
        'position': 'before'
      }
    ],
    'pathGroupsExcludedImportTypes': ['builtin']
  }]
}
```

## Benefits

1. **Consistency**: Predictable import/export patterns
2. **Maintainability**: Easier refactoring and updates
3. **Tree Shaking**: Better dead code elimination
4. **Developer Experience**: Clear module boundaries
5. **Performance**: Optimized bundling and loading
