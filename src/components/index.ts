/**
 * @fileoverview NosytLabs Component System - Unified & Modern
 * 
 * Reorganized and consolidated component exports with a clear, logical structure.
 * All components are now located under `/src/components` and grouped by functionality.
 * 
 * @module components
 * @version 6.0.0
 * @author NosytLabs Team
 * @since 2025-07-06
 */

// ========== UTILITY & CORE EXPORTS (TypeScript/React only) ==========
export { cn } from '@/lib/utils';
export * from '@/components/ui/button';

// ========== FORMS SYSTEM (TypeScript/React only) ==========
export * from './forms/enhanced-contact-form.tsx';
export * from './forms/animated-subscribe-button.tsx';

// ========== CONTENT & MARKETING (TypeScript/React only) ==========
export * from './content/TestimonialsSection.tsx';
export * from './marketing/animated-shiny-text.tsx';
export * from './marketing/aurora-text.tsx';
export * from './marketing/background-gradient-animation.tsx';
export * from './marketing/bento-grid.tsx';
export * from './marketing/magic-card.tsx';
export * from './marketing/meteors.tsx';
export * from './marketing/nosytlabs-animated-hero.tsx';
export * from './marketing/nosytlabs-bento-services.tsx';
export * from './marketing/tweet-card.tsx';

// ========== NOTE: ASTRO COMPONENTS ==========
// Astro components (.astro files) cannot be exported via TypeScript
// Import them directly in your Astro files like:
// import Hero from '@/components/Hero.astro';
// import Footer from '@/components/layout/Footer.astro';
// import UnifiedNavigation from '@/components/navigation/UnifiedNavigation.astro';