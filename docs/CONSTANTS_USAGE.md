# NosytLabs Shared Constants Usage Guide

This document explains how to use the shared constants system to maintain consistency and reduce code duplication across the NosytLabs codebase.

## Overview

The shared constants system provides a single source of truth for all repeated values, magic numbers, and configuration constants used throughout the application.

## File Structure

```
src/config/
├── constants.js      # JavaScript version with all constants
├── constants.ts      # TypeScript version with type definitions
├── index.js         # JavaScript barrel export
├── index.ts         # TypeScript barrel export
└── branding.js      # Existing branding configuration
```

## Basic Usage

### JavaScript Import

```javascript
// Import specific constants
import { COMPANY, COLORS, TIMING } from '@/config/constants';

// Import all constants
import Constants from '@/config/constants';

// Use in your code
const companyName = COMPANY.NAME; // 'NosytLabs'
const primaryColor = COLORS.PRIMARY.PURPLE_MAIN; // '#4C1D95'
const animationDuration = TIMING.ANIMATION.NORMAL; // 300
```

### TypeScript Import

```typescript
// Import with type safety
import { COMPANY, COLORS, type AnimationType } from '@/config/constants';

// Use with proper typing
const animation: AnimationType = 'fade-in';
const email: string = CONTACT.EMAIL.MAIN;
```

### Astro Components

```astro
---
import { CONTACT, COMPANY } from '@/config/constants';

const emailLink = `mailto:${CONTACT.EMAIL.MAIN}?subject=Contact`;
const websiteUrl = COMPANY.WEBSITE;
---

<a href={emailLink}>Contact Us</a>
<a href={websiteUrl}>{COMPANY.NAME}</a>
```

## Available Constants

### Company Information
- `COMPANY.NAME` - 'NosytLabs'
- `COMPANY.WEBSITE` - 'https://nosytlabs.com'
- `COMPANY.TAGLINE` - 'Notable Opportunities Shape Your Tomorrow'

### Contact Details
- `CONTACT.EMAIL.MAIN` - 'contact@nosytlabs.com'
- `CONTACT.EMAIL.BUSINESS` - 'tyson@nosytlabs.com'
- `CONTACT.SOCIAL.GITHUB` - 'https://github.com/NosytLabs'

### Brand Colors
- `COLORS.PRIMARY.PURPLE_MAIN` - '#4C1D95'
- `COLORS.SECONDARY.ORANGE_MAIN` - '#FF6B00'
- `COLORS.NEUTRAL.WHITE` - '#FFFFFF'

### Timing & Durations
- `TIMING.ANIMATION.FAST` - 150ms
- `TIMING.ANIMATION.NORMAL` - 300ms
- `TIMING.TIMEOUTS.PAGE_LOAD` - 30000ms
- `TIMING.CACHE.DAILY` - 24 hours in milliseconds

### Paths & Assets
- `PATHS.LOGO` - '/images/nosytlabs-logo-2025.svg'
- `PATHS.SCRIPTS` - '/scripts'
- `PATHS.IMAGES` - '/images'

## Common Use Cases

### 1. Email Links
```javascript
// Before
const emailLink = "mailto:contact@nosytlabs.com?subject=Support";

// After
import { CONTACT } from '@/config/constants';
const emailLink = `mailto:${CONTACT.EMAIL.MAIN}?subject=Support`;
```

### 2. Animation Durations
```css
/* Before */
.fade-in {
  transition: opacity 300ms ease-in-out;
}

/* After - using CSS custom properties */
.fade-in {
  transition: opacity var(--transition-normal);
}
```

```javascript
// In JavaScript
import { TIMING } from '@/config/constants';
element.style.transitionDuration = `${TIMING.ANIMATION.NORMAL}ms`;
```

### 3. Color Usage
```javascript
// Before
const styles = {
  backgroundColor: '#4C1D95',
  color: '#FF6B00'
};

// After
import { COLORS } from '@/config/constants';
const styles = {
  backgroundColor: COLORS.PRIMARY.PURPLE_MAIN,
  color: COLORS.SECONDARY.ORANGE_MAIN
};
```

### 4. Cache Configuration
```javascript
// Before
const cacheConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  strategy: 'cache-first'
};

// After
import { TIMING, CACHE_CONFIG } from '@/config/constants';
const cacheConfig = {
  maxAge: TIMING.CACHE.DAILY,
  strategy: CACHE_CONFIG.STRATEGIES.CACHE_FIRST
};
```

## Migration Strategy

### Step 1: Identify Hardcoded Values
Look for:
- Email addresses (contact@nosytlabs.com)
- URLs (https://nosytlabs.com)
- Color codes (#4C1D95, #FF6B00)
- Timeout values (30000, 5000)
- Company name (NosytLabs)

### Step 2: Replace with Constants
1. Import the appropriate constants
2. Replace hardcoded values
3. Test functionality

### Step 3: Validate Changes
Run the validation script:
```bash
node scripts/validate-constants.js
```

## Best Practices

### 1. Always Use Constants for Repeated Values
```javascript
// ❌ Don't repeat values
const timeout1 = 30000;
const timeout2 = 30000;

// ✅ Use constants
import { TIMING } from '@/config/constants';
const timeout1 = TIMING.TIMEOUTS.PAGE_LOAD;
const timeout2 = TIMING.TIMEOUTS.PAGE_LOAD;
```

### 2. Use TypeScript for Type Safety
```typescript
// ✅ Import with types
import { type AnimationType, ANIMATIONS } from '@/config/constants';

function animate(type: AnimationType) {
  // TypeScript will validate the animation type
}
```

### 3. Group Related Constants
```javascript
// ✅ Import related constants together
import { COLORS, TIMING, ANIMATIONS } from '@/config/constants';

const fadeInStyles = {
  color: COLORS.PRIMARY.PURPLE_MAIN,
  transition: `opacity ${TIMING.ANIMATION.NORMAL}ms ease-in-out`,
  animationDuration: `${ANIMATIONS.DEFAULT_DURATION}s`
};
```

### 4. Document Custom Constants
When adding new constants, include:
- Clear naming
- JSDoc comments
- Type definitions (for TypeScript)
- Usage examples

## Validation

The constants system includes validation to ensure:
- All files exist and are properly structured
- TypeScript types are correctly defined
- No duplicate values exist in the codebase
- Color consistency across configuration files

Run validation with:
```bash
npm run validate-constants
```

## Benefits

1. **Single Source of Truth** - All values defined in one place
2. **Type Safety** - TypeScript definitions prevent errors
3. **Easy Maintenance** - Update values in one location
4. **Consistent Branding** - Ensures brand colors and values are consistent
5. **Reduced Magic Numbers** - Self-documenting code with named constants
6. **Better Refactoring** - IDE can find all usages of constants

## Next Steps

1. Gradually replace hardcoded values with constants
2. Add ESLint rules to enforce constant usage
3. Update existing components to use the new system
4. Expand constants as new repeated values are identified
