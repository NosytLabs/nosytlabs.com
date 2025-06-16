/**
 * @fileoverview UI Components Barrel Export
 * 
 * Central export point for all UI components to enable clean imports
 * and better organization of reusable UI elements.
 * 
 * @module ui-components
 * @version 2.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

// React Components - Core components used in the site
export { BackgroundGradientAnimation } from './background-gradient-animation';
export { NosytLabsAnimatedHero } from './nosytlabs-animated-hero';
export { BentoGrid, BentoCard } from './bento-grid';
export { MagicCard } from './magic-card';

// Consolidated Button System - Replaces multiple duplicate button components
export {
  NosytButton,
  ShinyButton,
  ShimmerButton,
  PrimaryButton,
  SecondaryButton,
  OutlineButton
} from './consolidated-button';

// Animation and Text Components - Actually used in the site
export { Meteors } from './meteors';
export { AnimatedShinyText } from './animated-shiny-text';
export { AnimatedSubscribeButton } from './animated-subscribe-button';
export { AuroraText } from './aurora-text';
export { TweetCard } from './tweet-card';

// Contact and Form Components
export { default as EnhancedContactForm } from './enhanced-contact-form';
