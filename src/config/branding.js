/**
 * NosytLabs Branding Configuration
 * Central configuration for all branding elements
 */

export const BRAND_CONFIG = {
  // Company Information
  company: {
    name: 'NosytLabs',
    fullName: 'NOSYT LLC',
    tagline: 'Notable Opportunities Shape Your Tomorrow',
    description: 'Innovative digital solutions that help businesses thrive in the modern landscape.',
    founded: '2025',
    website: 'https://nosytlabs.com'
  },

  // Brand Colors
  colors: {
    primary: {
      purple: '#4C1D95',
      purpleLight: '#7C3AED',
      purpleDark: '#2D0A4F'
    },
    secondary: {
      orange: '#FF6B00',
      orangeLight: '#FF9E44',
      orangeDark: '#E55A00'
    },
    neutral: {
      white: '#FFFFFF',
      gray100: '#F3F4F6',
      gray200: '#E5E7EB',
      gray300: '#D1D5DB',
      gray400: '#9CA3AF',
      gray500: '#6B7280',
      gray600: '#4B5563',
      gray700: '#374151',
      gray800: '#1F2937',
      gray900: '#111827',
      black: '#000000'
    }
  },

  // Logo Assets
  logos: {
    main: '/images/nosytlabs-logo-2025.svg',
    favicon: '/images/favicon.svg',
    appleTouchIcon: '/images/apple-touch-icon.png',
    ogImage: '/images/nosytlabs-og.jpg'
  },

  // Social Media Links
  social: {
    github: 'https://github.com/NosytLabs',
    youtube: 'https://www.youtube.com/@TycenYT',
    kick: 'https://kick.com/Tycen',
    creality: 'https://crealitycloud.com/user/9519489699',
    twitter: '#',
    linkedin: '#',
    discord: '#'
  },

  // Contact Information
  contact: {
    email: 'contact@nosytlabs.com',
    business: 'tyson@nosytlabs.com',
    support: 'support@nosytlabs.com'
  },

  // SEO Configuration
  seo: {
    defaultTitle: 'NosytLabs - Notable Opportunities Shape Your Tomorrow',
    titleTemplate: '%s | NosytLabs',
    defaultDescription: 'NosytLabs provides innovative digital solutions including web development, content creation, 3D printing services, and passive income resources.',
    keywords: [
      'web development',
      'content creation',
      '3D printing',
      'passive income',
      'AI solutions',
      'technology',
      'innovation',
      'digital solutions',
      'YouTube',
      'Kick.com',
      'streaming',
      'coding',
      'programming'
    ],
    author: 'NosytLabs',
    twitterHandle: '@NosytLabs',
    ogType: 'website',
    locale: 'en_US'
  },

  // Typography
  fonts: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
    secondary: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Consolas, Monaco, monospace'
  },

  // Services
  services: [
    {
      id: 'web-development',
      name: 'Web Development',
      description: 'Custom websites and web applications built with React, Astro, and modern frameworks.',
      icon: 'code',
      featured: true
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      description: 'Technology and programming content on YouTube (@TycenYT) and live streaming on Kick.com/Tycen.',
      icon: 'video',
      featured: true
    },
    {
      id: '3d-printing',
      name: '3D Printing',
      description: 'Custom 3D printing services using Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin) printers.',
      icon: 'cube',
      featured: true
    },
    {
      id: 'passive-income',
      name: 'Passive Income',
      description: 'Educational resources about passive income opportunities with realistic earnings expectations.',
      icon: 'chart-line',
      featured: true
    }
  ],

  // Navigation
  navigation: {
    main: [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'Projects', path: '/projects', icon: 'folder' },
      { name: 'Content Creation', path: '/content-creation', icon: 'video' },
      { name: '3D Printing', path: '/3d-printing', icon: 'cube' },
      { name: 'Passive Income', path: '/passive-income', icon: 'chart-line' },
      { name: 'NosytOS95', path: '/nosytos95', icon: 'desktop' },
      { name: 'Contact', path: '/contact', icon: 'envelope' }
    ],
    footer: [
      { name: 'About', path: '/about' },
      { name: 'Services', path: '/services' },
      { name: 'Blog', path: '/blog' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' }
    ]
  },

  // Analytics & Tracking
  analytics: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
    vercelAnalytics: true,
    hotjar: process.env.HOTJAR_ID || '',
    clarity: process.env.CLARITY_ID || ''
  },

  // Feature Flags
  features: {
    darkMode: true,
    animations: true,
    particles: true,
    serviceWorker: true,
    pwa: true,
    blog: true,
    ecommerce: false,
    multiLanguage: false
  },

  // Content
  content: {
    hero: {
      title: 'Notable Opportunities Shape Your Tomorrow',
      subtitle: 'Innovative digital solutions that transform ideas into reality.',
      cta: {
        primary: 'Explore Services',
        secondary: "Let's Talk"
      }
    },
    about: {
      title: 'About NosytLabs',
      description: 'Founded in 2025, NosytLabs is the portfolio site for NOSYT LLC, showcasing our technology projects and services.',
      mission: 'Our mission is to create notable opportunities that shape your tomorrow through innovative digital solutions.'
    }
  }
};

// Helper functions
export const getBrandColor = (colorPath) => {
  const keys = colorPath.split('.');
  let value = BRAND_CONFIG.colors;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

export const getSocialLink = (platform) => {
  return BRAND_CONFIG.social[platform] || '#';
};

export const getServiceByID = (id) => {
  return BRAND_CONFIG.services.find(service => service.id === id);
};

export const getFeaturedServices = () => {
  return BRAND_CONFIG.services.filter(service => service.featured);
};

export const getNavigation = (type = 'main') => {
  return BRAND_CONFIG.navigation[type] || [];
};

// Export default
export default BRAND_CONFIG;
