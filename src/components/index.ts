/**
 * @fileoverview NosytLabs Component System - Clean & Modern
 * 
 * Reorganized component exports with improved structure.
 * Components are organized by functionality and purpose.
 * 
 * @module components
 * @version 5.0.0
 * @author NosytLabs Team
 * @since 2025-06-13
 */

// ========== UTILITY EXPORTS ==========
export * from '../utils/unified-css-utils';
export { cn } from '../lib/utils';

// ========== COMMON COMPONENTS ==========
export { default as Footer } from './common/Footer.astro';
export { default as SEOHead } from './common/SEOHead.astro';
export { default as VercelAnalytics } from './common/VercelAnalytics.astro';
export { default as NosytLabsLogo } from './common/NosytLabsLogo.astro';
export { default as OptimizedImage } from './common/OptimizedImage.astro';

// ========== SECTIONS ==========
// Note: Section components removed - functionality integrated into page components

// ========== CARDS SYSTEM ==========
export { default as Card } from './unified/Card.astro';

// ========== NAVIGATION SYSTEM ==========
export { default as Navigation } from './navigation/UnifiedNavigation.astro';

// ========== FORMS SYSTEM ==========
export { default as ContactForm } from './forms/ContactForm.astro';
export { default as FormValidation } from './forms/EnhancedFormValidation.astro';

// ========== CONTENT SYSTEM ==========
export { default as ProjectGrid } from './content/ProjectGrid.astro';
export { default as Testimonials } from './content/TestimonialsSection.tsx';

// ========== LAYOUT SYSTEM ==========
export { default as UnifiedLayout } from './layout/UnifiedLayout.astro';

// ========== ANIMATIONS SYSTEM ==========
export { default as AnimatedSection } from './animations/AnimatedSection.astro';
export { default as AnimatedText } from './animations/AnimatedText.astro';
export { default as PageTransition } from './animations/PageTransition.astro';

// ========== INTERACTIVE SYSTEM ==========
export { default as DarkModeToggle } from './interactive/DarkModeToggle.astro';
export { default as SocialLinks } from './interactive/SocialLinks.astro';

// ========== SPECIALIZED COMPONENTS ==========
export { default as ModernIconSystem } from './ModernIconSystem.astro';
// GlitchText functionality moved to AnimatedText.astro