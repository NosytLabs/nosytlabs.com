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

// React Components - Available components
export { BackgroundGradientAnimation } from './background-gradient-animation';
export { BackgroundGradientAnimationDemo } from './background-gradient-animation-demo';
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

export { Meteors } from './meteors';
export { default as OrbitingCircles } from './orbiting-circles';
export { RetroGrid } from './retro-grid';
export { default as Marquee } from './marquee';
export { default as BlurFade } from './blur-fade';
export { AnimatedBeam } from './animated-beam';
export { AnimatedShinyText } from './animated-shiny-text';
export { AnimatedSubscribeButton } from './animated-subscribe-button';
export { AuroraText } from './aurora-text';
export { VideoText } from './video-text';
export { TweetCard } from './tweet-card';
