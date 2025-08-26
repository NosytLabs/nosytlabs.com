/**
 * NosytLabs Component Library - Modern Export System
 * Updated for new design system and package integrations
 *
 * Note: Astro components are imported directly in .astro files
 * This index focuses on TypeScript/React components that can be properly exported
 */

// CORE UI COMPONENTS
export { Button, buttonVariants, type ButtonProps } from './ui/button';

export { Input, inputVariants, type InputProps } from './ui/input';

export { Textarea, type TextareaProps } from './ui/textarea';

// Icon component removed - using AstroIcon.astro instead

// REACT/TSX COMPONENTS
// Note: Marketing components will be added as they are implemented
// Currently focusing on core UI components that exist

// UTILITY FUNCTIONS
export { cn } from '../lib/utils';
