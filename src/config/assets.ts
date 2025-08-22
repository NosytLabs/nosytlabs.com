/**
 * Centralized asset configuration for the NosytLabs website
 * This file contains paths and metadata for all major assets used across the site
 */

/**
 * Asset configuration types
 */
export interface ImageAsset {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  loading?: 'lazy' | 'eager';
}

export interface ResponsiveImageAsset {
  desktop: ImageAsset;
  tablet?: ImageAsset;
  mobile: ImageAsset;
  fallback: string;
  alt: string;
}

/**
 * Fallback images for different content types
 */
export const FALLBACK_IMAGES = {
  general: '/images/fallback/general-fallback.webp',
  hero: '/images/fallback/hero-fallback.svg',
  project: '/images/projects/web-development-project.webp',
  service: '/images/services/web-development-service.webp',
  team: '/images/team/professional-developer.webp',
  client: '/images/clients/techcorp-logo.webp',
  testimonial: '/images/testimonials/cto-testimonial.webp',
  blog: '/images/blog/modern-web-development.webp',
  product: '/images/fallback/general-fallback.webp',
} as const;

/**
 * Main asset sources configuration
 */
export const ASSET_SOURCES = {
  hero: {
    desktop: {
      src: '/images/hero/web-development-hero-1920x800.svg',
      width: 1920,
      height: 800,
      alt: 'Professional web development workspace with modern technology',
      loading: 'eager',
    },
    mobile: {
      src: '/images/hero/web-development-hero-768x600.svg',
      width: 768,
      height: 600,
      alt: 'Professional web development workspace with modern technology',
      loading: 'eager',
    },
    fallback: FALLBACK_IMAGES.hero,
    alt: 'Professional web development workspace with modern technology',
  },
  services: {
    webDev: {
      src: '/images/services/web-development-service.webp',
      width: 800,
      height: 600,
      alt: 'Web development services illustration',
      fallback: FALLBACK_IMAGES.service,
    },
    aiIntegration: {
      src: '/images/services/ai-integration-service.webp',
      width: 800,
      height: 600,
      alt: 'AI integration services illustration',
      fallback: FALLBACK_IMAGES.service,
    },
    consulting: {
      src: '/images/services/technical-consulting-service.webp',
      width: 800,
      height: 600,
      alt: 'Technical consulting services illustration',
      fallback: FALLBACK_IMAGES.service,
    },
  },
  team: {
    lead: {
      src: '/images/team/lead-developer.webp',
      width: 400,
      height: 400,
      alt: 'Lead Developer at NosytLabs',
      fallback: FALLBACK_IMAGES.team,
    },
    designer: {
      src: '/images/team/ui-designer.webp',
      width: 400,
      height: 400,
      alt: 'UI/UX Designer at NosytLabs',
      fallback: FALLBACK_IMAGES.team,
    },
    engineer: {
      src: '/images/team/software-engineer.webp',
      width: 400,
      height: 400,
      alt: 'Software Engineer at NosytLabs',
      fallback: FALLBACK_IMAGES.team,
    },
    aiSpecialist: {
      src: '/images/team/ai-specialist.webp',
      width: 400,
      height: 400,
      alt: 'AI Integration Specialist at NosytLabs',
      fallback: FALLBACK_IMAGES.team,
    },
  },
  projects: {
    webDevelopment: {
      src: '/images/projects/web-development-project.webp',
      width: 1200,
      height: 800,
      alt: 'Modern web application development project with responsive design',
      fallback: FALLBACK_IMAGES.project,
    },
    aiIntegration: {
      src: '/images/projects/ai-integration-project.webp',
      width: 1200,
      height: 800,
      alt: 'AI integration project with data visualization dashboard',
      fallback: FALLBACK_IMAGES.project,
    },
    consulting: {
      src: '/images/projects/technical-consulting-project.webp',
      width: 1200,
      height: 800,
      alt: 'Technical consulting project with performance optimization results',
      fallback: FALLBACK_IMAGES.project,
    },
    ecommerce: {
      src: '/images/projects/ecommerce-project.webp',
      width: 1200,
      height: 800,
      alt: 'Modern e-commerce platform with product showcase',
      fallback: FALLBACK_IMAGES.project,
    },
    mobileApp: {
      src: '/images/projects/mobile-app-project.svg',
      width: 1200,
      height: 800,
      alt: 'Cross-platform mobile application development project',
      fallback: FALLBACK_IMAGES.project,
    },
  },
  clients: {
    techCorp: {
      src: '/images/clients/techcorp-logo.webp',
      width: 200,
      height: 100,
      alt: 'TechCorp - Enterprise Technology Solutions',
      fallback: FALLBACK_IMAGES.client,
    },
    innovateLabs: {
      src: '/images/clients/innovate-labs-logo.webp',
      width: 200,
      height: 100,
      alt: 'Innovate Labs - Research and Development',
      fallback: FALLBACK_IMAGES.client,
    },
    digitalFuture: {
      src: '/images/clients/digital-future-logo.webp',
      width: 200,
      height: 100,
      alt: 'Digital Future - Digital Transformation Services',
      fallback: FALLBACK_IMAGES.client,
    },
    smartSolutions: {
      src: '/images/clients/smart-solutions-logo.webp',
      width: 200,
      height: 100,
      alt: 'Smart Solutions - Intelligent Business Applications',
      fallback: FALLBACK_IMAGES.client,
    },
  },
  testimonials: {
    cto: {
      src: '/images/testimonials/cto-testimonial.webp',
      width: 100,
      height: 100,
      alt: 'Chief Technology Officer testimonial',
      fallback: FALLBACK_IMAGES.testimonial,
    },
    productManager: {
      src: '/images/testimonials/product-manager-testimonial.webp',
      width: 100,
      height: 100,
      alt: 'Product Manager testimonial',
      fallback: FALLBACK_IMAGES.testimonial,
    },
    founder: {
      src: '/images/testimonials/founder-testimonial.webp',
      width: 100,
      height: 100,
      alt: 'Startup Founder testimonial',
      fallback: FALLBACK_IMAGES.testimonial,
    },
    director: {
      src: '/images/testimonials/director-testimonial.webp',
      width: 100,
      height: 100,
      alt: 'Director of Engineering testimonial',
      fallback: FALLBACK_IMAGES.testimonial,
    },
  },
} as const;

/**
 * Responsive image size configurations for different viewport sizes
 */
export const IMAGE_SIZES = {
  hero: {
    desktop: '(min-width: 1024px) 1920px, 100vw',
    mobile: '(max-width: 1023px) 768px, 100vw',
  },
  services: {
    default: '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
    featured: '(min-width: 1280px) 50vw, 100vw',
  },
  team: {
    default: '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw',
    featured: '(min-width: 768px) 50vw, 100vw',
  },
  projects: {
    card: '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
    featured: '(min-width: 1024px) 50vw, 100vw',
    detail: '(min-width: 1024px) 75vw, 100vw',
  },
  clients: '(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw',
  testimonials: '(min-width: 768px) 100px, 80px',
} as const;

/**
 * Image loading strategies based on content position
 */
export const LOADING_STRATEGY = {
  aboveTheFold: 'eager' as const,
  belowTheFold: 'lazy' as const,
};

/**
 * Helper function to get appropriate image size based on device
 */
export const getResponsiveImageProps = (
  imageConfig: ResponsiveImageAsset,
  sizes: string,
  loading: 'lazy' | 'eager' = 'lazy'
) => {
  return {
    src: imageConfig.desktop.src,
    alt: imageConfig.alt,
    width: imageConfig.desktop.width,
    height: imageConfig.desktop.height,
    sizes,
    loading,
    fallbackSrc: imageConfig.fallback,
    sources: [
      {
        media: '(min-width: 1024px)',
        srcset: imageConfig.desktop.src,
        width: imageConfig.desktop.width,
        height: imageConfig.desktop.height,
      },
      ...(imageConfig.tablet
        ? [
            {
              media: '(min-width: 768px) and (max-width: 1023px)',
              srcset: imageConfig.tablet.src,
              width: imageConfig.tablet.width,
              height: imageConfig.tablet.height,
            },
          ]
        : []),
      {
        media: '(max-width: 767px)',
        srcset: imageConfig.mobile.src,
        width: imageConfig.mobile.width,
        height: imageConfig.mobile.height,
      },
    ],
  };
};

export default ASSET_SOURCES;
