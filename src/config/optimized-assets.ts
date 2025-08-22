/**
 * Optimized Asset Configuration
 * Defines optimized image variants with WebP/AVIF formats and responsive breakpoints
 */

import { COMMON_SIZES, createOptimizedImageConfig } from '../utils/unified-image-utils';

/**
 * Optimized hero images with responsive variants
 */
export const OPTIMIZED_HERO_IMAGES = {
  webDevelopment: {
    desktop: createOptimizedImageConfig(
      '/images/hero/web-development-hero-1920x800.webp',
      'Professional web development workspace with modern technology',
      {
        width: 1920,
        height: 800,
        sizes: COMMON_SIZES.hero,
        loading: 'eager',
        priority: true,
        quality: 90,
      }
    ),
    mobile: createOptimizedImageConfig(
      '/images/hero/web-development-hero-768x600.webp',
      'Professional web development workspace with modern technology',
      {
        width: 768,
        height: 600,
        sizes: COMMON_SIZES.hero,
        loading: 'eager',
        priority: true,
        quality: 90,
      }
    ),
  },
} as const;

/**
 * Optimized service images
 */
export const OPTIMIZED_SERVICE_IMAGES = {
  webDevelopment: createOptimizedImageConfig(
    '/images/services/web-development-service.webp',
    'Modern web development services with cutting-edge technologies',
    {
      width: 800,
      height: 600,
      sizes: COMMON_SIZES.card,
      quality: 80,
    }
  ),
  aiIntegration: createOptimizedImageConfig(
    '/images/services/ai-integration-service.webp',
    'AI integration and machine learning services',
    {
      width: 800,
      height: 600,
      sizes: COMMON_SIZES.card,
      quality: 80,
    }
  ),
  technicalConsulting: createOptimizedImageConfig(
    '/images/services/technical-consulting-service.webp',
    'Technical consulting and architecture services',
    {
      width: 800,
      height: 600,
      sizes: COMMON_SIZES.card,
      quality: 80,
    }
  ),
  performanceOptimization: createOptimizedImageConfig(
    '/images/services/performance-optimization-service.webp',
    'Website performance optimization and Core Web Vitals improvement',
    {
      width: 800,
      height: 600,
      sizes: COMMON_SIZES.card,
      quality: 80,
    }
  ),
} as const;

/**
 * Optimized project showcase images
 */
export const OPTIMIZED_PROJECT_IMAGES = {
  webDevelopment: createOptimizedImageConfig(
    '/images/projects/web-development-project.webp',
    'Modern web application with responsive design and performance optimization',
    {
      width: 1200,
      height: 800,
      sizes: COMMON_SIZES.card,
      quality: 90,
    }
  ),
  aiIntegration: createOptimizedImageConfig(
    '/images/projects/ai-integration-project.webp',
    'AI-powered dashboard with data visualization and machine learning insights',
    {
      width: 1200,
      height: 800,
      sizes: COMMON_SIZES.card,
      quality: 90,
    }
  ),
  technicalConsulting: createOptimizedImageConfig(
    '/images/projects/technical-consulting-project.webp',
    'Performance optimization results showing improved Core Web Vitals',
    {
      width: 1200,
      height: 800,
      sizes: COMMON_SIZES.card,
      quality: 90,
    }
  ),
  ecommerce: createOptimizedImageConfig(
    '/images/projects/ecommerce-project.webp',
    'Modern e-commerce platform with optimized user experience',
    {
      width: 1200,
      height: 800,
      sizes: COMMON_SIZES.card,
      quality: 90,
    }
  ),
  mobileApp: createOptimizedImageConfig(
    '/images/projects/mobile-app-project.webp',
    'Cross-platform mobile application with native performance',
    {
      width: 1200,
      height: 800,
      sizes: COMMON_SIZES.card,
      quality: 90,
    }
  ),
} as const;

/**
 * Optimized team member images
 */
export const OPTIMIZED_TEAM_IMAGES = {
  leadDeveloper: createOptimizedImageConfig(
    '/images/team/lead-developer.webp',
    'Lead Developer - Full-stack development and architecture specialist',
    {
      width: 400,
      height: 400,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  uiDesigner: createOptimizedImageConfig(
    '/images/team/ui-designer.webp',
    'UI/UX Designer - User experience and interface design expert',
    {
      width: 400,
      height: 400,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  softwareEngineer: createOptimizedImageConfig(
    '/images/team/software-engineer.webp',
    'Software Engineer - Backend systems and API development specialist',
    {
      width: 400,
      height: 400,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  aiSpecialist: createOptimizedImageConfig(
    '/images/team/ai-specialist.webp',
    'AI Integration Specialist - Machine learning and AI implementation expert',
    {
      width: 400,
      height: 400,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
} as const;

/**
 * Optimized client logo images
 */
export const OPTIMIZED_CLIENT_IMAGES = {
  techCorp: createOptimizedImageConfig(
    '/images/clients/techcorp-logo.webp',
    'TechCorp - Enterprise technology solutions partner',
    {
      width: 200,
      height: 100,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  innovateLabs: createOptimizedImageConfig(
    '/images/clients/innovate-labs-logo.webp',
    'Innovate Labs - Research and development collaboration',
    {
      width: 200,
      height: 100,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  digitalFuture: createOptimizedImageConfig(
    '/images/clients/digital-future-logo.webp',
    'Digital Future - Digital transformation services client',
    {
      width: 200,
      height: 100,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
  smartSolutions: createOptimizedImageConfig(
    '/images/clients/smart-solutions-logo.webp',
    'Smart Solutions - Intelligent business applications partner',
    {
      width: 200,
      height: 100,
      sizes: COMMON_SIZES.thumbnail,
      quality: 80,
    }
  ),
} as const;

/**
 * Optimized testimonial images
 */
export const OPTIMIZED_TESTIMONIAL_IMAGES = {
  cto: createOptimizedImageConfig(
    '/images/testimonials/cto-testimonial.webp',
    'Chief Technology Officer testimonial photo',
    {
      width: 100,
      height: 100,
      sizes: '100px',
      quality: 80,
    }
  ),
  productManager: createOptimizedImageConfig(
    '/images/testimonials/product-manager-testimonial.webp',
    'Product Manager testimonial photo',
    {
      width: 100,
      height: 100,
      sizes: '100px',
      quality: 80,
    }
  ),
  founder: createOptimizedImageConfig(
    '/images/testimonials/founder-testimonial.webp',
    'Startup Founder testimonial photo',
    {
      width: 100,
      height: 100,
      sizes: '100px',
      quality: 80,
    }
  ),
  director: createOptimizedImageConfig(
    '/images/testimonials/director-testimonial.webp',
    'Director of Engineering testimonial photo',
    {
      width: 100,
      height: 100,
      sizes: '100px',
      quality: 80,
    }
  ),
} as const;

/**
 * Optimized blog and content images
 */
export const OPTIMIZED_BLOG_IMAGES = {
  webPerformance: createOptimizedImageConfig(
    '/images/blog/web-performance-optimization.webp',
    'Web performance optimization techniques and Core Web Vitals',
    {
      width: 1200,
      height: 630,
      sizes: COMMON_SIZES.fullWidth,
      quality: 90,
    }
  ),
  aiIntegration: createOptimizedImageConfig(
    '/images/blog/ai-integration-guide.webp',
    'Complete guide to AI integration in modern web applications',
    {
      width: 1200,
      height: 630,
      sizes: COMMON_SIZES.fullWidth,
      quality: 90,
    }
  ),
  modernWebDev: createOptimizedImageConfig(
    '/images/blog/modern-web-development.webp',
    'Modern web development practices with Astro and TypeScript',
    {
      width: 1200,
      height: 630,
      sizes: COMMON_SIZES.fullWidth,
      quality: 90,
    }
  ),
} as const;

/**
 * Complete optimized asset configuration
 */
export const OPTIMIZED_ASSETS = {
  hero: OPTIMIZED_HERO_IMAGES,
  services: OPTIMIZED_SERVICE_IMAGES,
  projects: OPTIMIZED_PROJECT_IMAGES,
  team: OPTIMIZED_TEAM_IMAGES,
  clients: OPTIMIZED_CLIENT_IMAGES,
  testimonials: OPTIMIZED_TESTIMONIAL_IMAGES,
  blog: OPTIMIZED_BLOG_IMAGES,
} as const;

export default OPTIMIZED_ASSETS;
