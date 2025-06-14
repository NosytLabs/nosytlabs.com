/**
 * Layout Components - Unified System
 * Export the unified layout component that replaces all individual layout components
 */

export { default as UnifiedLayout } from './UnifiedLayout.astro';

// Legacy exports for backward compatibility (all point to UnifiedLayout)
export { default as Section } from './UnifiedLayout.astro';
export { default as Container } from './UnifiedLayout.astro';
export { default as Grid } from './UnifiedLayout.astro';
export { default as Column } from './UnifiedLayout.astro';
export { default as Spacer } from './UnifiedLayout.astro';
