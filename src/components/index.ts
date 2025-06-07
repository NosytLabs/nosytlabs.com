/**
 * @fileoverview Main Components Barrel Export
 * 
 * Central export point for all components across the application.
 * Provides organized access to components by category and individual exports.
 * 
 * @module components
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

// ========== CATEGORY EXPORTS ==========
// Re-export all components from category barrels
export * from './layout';
export * from './ui';
export * from './animations';
export * from './passive-income';

// ========== INDIVIDUAL COMPONENT EXPORTS ==========
// Core components - Default exports for Astro components
export { default as Header } from './Header.astro';
export { default as Footer } from './Footer.astro';

// Unified components (refactored)
export { default as Navigation } from './unified/Navigation.astro';
export { default as HeroSection } from './unified/HeroSection.astro';
export { default as Card } from './unified/Card.astro';

// Content components
export { default as HeroShowcase } from './HeroShowcase.astro';
export { default as IntroAnimation } from './IntroAnimation.astro';

// Feature components
// FeatureCard removed - use unified Card component instead
export { default as FeatureGrid } from './FeatureGrid.astro';
export { default as InfoCard } from './InfoCard.astro';
// ServiceCard removed - use unified Card component instead
export { default as ServiceIcon } from './ServiceIcon.astro';

// Project components
// ProjectCard and EnhancedProjectCard removed - use unified Card component instead
export { default as ProjectGrid } from './ProjectGrid.astro';
export { default as ProjectTimeline } from './ProjectTimeline.astro';

// Blog components
export { default as BlogCard } from './BlogCard.astro';

// Interactive components
export { default as ContactForm } from './ContactForm.astro';
export { default as ProjectSubmissionForm } from './ProjectSubmissionForm.astro';

// Media components
export { default as YouTubeEmbed } from './YouTubeEmbed.astro';
export { default as PDFViewer } from './PDFViewer.astro';
export { default as CrealityEmbed } from './CrealityEmbed.astro';
export { default as CrealityModelViewer } from './CrealityModelViewer.astro';

// Utility components
export { default as CodeDisplay } from './CodeDisplay.astro';
export { default as ParticleBackground } from './ParticleBackground.astro';
export { default as ParallaxSection } from './ParallaxSection.astro';
export { default as SocialIcons } from './SocialIcons.astro';
export { default as SocialLinks } from './SocialLinks.astro';
export { default as NosytLabsLogo } from './NosytLabsLogo.astro';
export { default as VercelAnalytics } from './VercelAnalytics.astro';

// Specialized components
export { default as AnimatedHeading } from './AnimatedHeading.astro';
export { default as GlitchText } from './GlitchText.astro';
export { default as SkillsMatrix } from './SkillsMatrix.astro';
export { default as StreamSchedule } from './StreamSchedule.astro';
export { default as KnowledgeGraphDemo } from './KnowledgeGraphDemo.astro';
export { default as ThreeDPrintingCalculator } from './3DPrintingCalculator.astro';

// Windows 95 components
export { default as Windows95Window } from './Windows95Window.astro';
export { default as EnhancedWindows95Window } from './EnhancedWindows95Window.astro';

// JavaScript components (named exports for classes/functions)
export { DuckHuntGame } from './DuckHuntGame.js';
export { EnhancedWindowResizing } from './EnhancedWindowResizing.js';

// ========== GROUPED EXPORTS FOR CONVENIENCE ==========
// Layout components group
export const Layout = {
  Section: './layout/Section.astro',
  Container: './layout/Container.astro',
  Grid: './layout/Grid.astro',
  Column: './layout/Column.astro',
  Spacer: './layout/Spacer.astro'
};

// UI components group
export const UI = {
  Card3D: './ui/Card3D.astro',
  ExpandableCard: './ui/ExpandableCard.astro',
  ResponsiveImage: './ui/ResponsiveImage.astro'
};

// Animation components group
export const Animations = {
  AnimatedSection: './animations/AnimatedSection.astro',
  AnimatedText: './animations/AnimatedText.astro',
  PageTransition: './animations/PageTransition.astro'
};
