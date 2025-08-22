import type { PageSEOConfig } from './types';

/**
 * Page-specific SEO configurations
 * Each page can override default SEO settings with custom metadata
 */
export const PAGE_SEO_CONFIG: Record<string, PageSEOConfig> = {
  home: {
    title: 'NosytLabs - Premium Web Development & AI Integration Services',
    description: 'Transform your business with cutting-edge web development, AI integration, and technical consulting. Expert solutions for modern enterprises.',
    keywords: [
      'web development',
      'AI integration',
      'technical consulting',
      'React development',
      'Next.js',
      'TypeScript',
      'machine learning',
      'automation',
      'digital transformation'
    ],
    openGraph: {
      title: 'NosytLabs - Premium Web Development & AI Integration',
      description: 'Expert web development and AI integration services for modern businesses',
      type: 'website',
      images: [{
        url: '/images/hero/og-home.webp',
        width: 1200,
        height: 630,
        alt: 'NosytLabs - Web Development & AI Integration'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'NosytLabs - Premium Web Development & AI Integration',
      description: 'Expert web development and AI integration services for modern businesses',
      images: ['/images/hero/twitter-home.webp']
    },
    canonical: 'https://nosytlabs.com/',
    alternates: {
      languages: {
        'en-US': 'https://nosytlabs.com/',
        'en-GB': 'https://nosytlabs.com/en-gb/'
      }
    }
  },

  services: {
    title: 'Our Services - Web Development, AI Integration & Consulting | NosytLabs',
    description: 'Comprehensive web development, AI integration, and technical consulting services. Custom solutions tailored to your business needs.',
    keywords: [
      'web development services',
      'AI integration services',
      'technical consulting',
      'custom software development',
      'enterprise solutions',
      'digital transformation'
    ],
    openGraph: {
      title: 'Professional Services - NosytLabs',
      description: 'Comprehensive web development, AI integration, and technical consulting services',
      type: 'website',
      images: [{
        url: '/images/services/og-services.webp',
        width: 1200,
        height: 630,
        alt: 'NosytLabs Services Overview'
      }]
    },
    canonical: 'https://nosytlabs.com/services/'
  },

  'web-development': {
    title: 'Web Development Services - React, Next.js, TypeScript | NosytLabs',
    description: 'Professional web development services using React, Next.js, and TypeScript. Custom web applications, e-commerce solutions, and PWAs.',
    keywords: [
      'React development',
      'Next.js development',
      'TypeScript development',
      'web applications',
      'e-commerce development',
      'progressive web apps',
      'responsive design',
      'frontend development'
    ],
    openGraph: {
      title: 'Web Development Services - NosytLabs',
      description: 'Professional React, Next.js, and TypeScript development services',
      type: 'website',
      images: [{
        url: '/images/services/web-development/og-web-dev.webp',
        width: 1200,
        height: 630,
        alt: 'Web Development Services'
      }]
    },
    canonical: 'https://nosytlabs.com/services/web-development/'
  },

  'ai-integration': {
    title: 'AI Integration Services - Machine Learning & Automation | NosytLabs',
    description: 'Expert AI integration services including machine learning implementation, process automation, and intelligent system development.',
    keywords: [
      'AI integration',
      'machine learning',
      'artificial intelligence',
      'process automation',
      'intelligent systems',
      'AI consulting',
      'ML implementation',
      'automation solutions'
    ],
    openGraph: {
      title: 'AI Integration Services - NosytLabs',
      description: 'Expert AI integration and machine learning implementation services',
      type: 'website',
      images: [{
        url: '/images/services/ai-integration/og-ai.webp',
        width: 1200,
        height: 630,
        alt: 'AI Integration Services'
      }]
    },
    canonical: 'https://nosytlabs.com/services/ai-integration/'
  },

  'technical-consulting': {
    title: 'Technical Consulting Services - Architecture & Strategy | NosytLabs',
    description: 'Strategic technical consulting for architecture design, technology selection, and digital transformation initiatives.',
    keywords: [
      'technical consulting',
      'software architecture',
      'technology strategy',
      'digital transformation',
      'system design',
      'technical advisory',
      'architecture consulting'
    ],
    openGraph: {
      title: 'Technical Consulting Services - NosytLabs',
      description: 'Strategic technical consulting and architecture design services',
      type: 'website',
      images: [{
        url: '/images/services/consulting/og-consulting.webp',
        width: 1200,
        height: 630,
        alt: 'Technical Consulting Services'
      }]
    },
    canonical: 'https://nosytlabs.com/services/technical-consulting/'
  },

  projects: {
    title: 'Our Projects - Portfolio & Case Studies | NosytLabs',
    description: 'Explore our portfolio of successful web development and AI integration projects. Real-world case studies and client success stories.',
    keywords: [
      'portfolio',
      'case studies',
      'web development projects',
      'AI integration projects',
      'client success stories',
      'project showcase'
    ],
    openGraph: {
      title: 'Our Projects - NosytLabs Portfolio',
      description: 'Portfolio of successful web development and AI integration projects',
      type: 'website',
      images: [{
        url: '/images/projects/og-projects.webp',
        width: 1200,
        height: 630,
        alt: 'NosytLabs Project Portfolio'
      }]
    },
    canonical: 'https://nosytlabs.com/projects/'
  },

  contact: {
    title: 'Contact Us - Get Started with Your Project | NosytLabs',
    description: 'Ready to start your project? Contact NosytLabs for web development, AI integration, and technical consulting services. Free consultation available.',
    keywords: [
      'contact',
      'get quote',
      'free consultation',
      'project inquiry',
      'web development quote',
      'AI integration consultation'
    ],
    openGraph: {
      title: 'Contact NosytLabs - Start Your Project',
      description: 'Get in touch for web development, AI integration, and consulting services',
      type: 'website',
      images: [{
        url: '/images/contact/og-contact.webp',
        width: 1200,
        height: 630,
        alt: 'Contact NosytLabs'
      }]
    },
    canonical: 'https://nosytlabs.com/contact/'
  }
};