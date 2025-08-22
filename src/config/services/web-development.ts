/**
 * Web Development Services Configuration
 * Services related to modern web development, e-commerce, and PWAs
 */

import type { ServiceData } from './types';

export const webDevelopmentServices: ServiceData[] = [
  {
    id: 'modern-web-development',
    slug: 'modern-web-development',
    name: 'Modern Web Development',
    shortDescription: 'Build high-performance websites that drive business growth',
    description:
      'We create responsive, fast-loading websites using cutting-edge technologies like Astro and React, ensuring your online presence captivates visitors and converts them into loyal customers while meeting accessibility standards.',
    icon: 'Globe',
    category: 'Web Development',
    href: '/services/modern-web-development',
    features: [
      'Performance-optimized architecture',
      'Interactive user interfaces',
      'Type-safe codebases',
      'Mobile-first responsive design',
      'SEO and accessibility focus',
      'Scalable solutions',
    ],
    detailedFeatures: [
      {
        title: 'Advanced Technology Stack',
        description:
          'Leverage modern tools to create robust web solutions that solve real business challenges',
        items: [
          'Astro framework for superior performance',
          'React components for dynamic interactions',
          'TypeScript for reliable development',
          'Tailwind CSS for efficient styling',
          'Optimized asset handling',
          'Modular design patterns',
        ],
      },
      {
        title: 'Performance Excellence',
        description:
          'Deliver lightning-fast experiences that keep users engaged and improve search rankings',
        items: [
          'Core Web Vitals compliance',
          'Intelligent code splitting',
          'Advanced image optimization',
          'CSS optimization techniques',
          'Strategic resource loading',
          'Caching mechanisms',
        ],
      },
      {
        title: 'Quality and Reliability',
        description:
          'Ensure your website stands the test of time with thorough testing and best practices',
        items: [
          'Vitest-powered testing suite',
          'Automated accessibility checks',
          'Multi-browser compatibility',
          'Device-responsive validation',
          'Performance monitoring',
          'Security implementations',
        ],
      },
    ],
    price: 'Starting at $2,500',
    timeline: '4-8 weeks',
    cta: 'Launch Your Website',
    popular: true,
    metadata: {
      keywords: [
        'web development',
        'Astro',
        'React',
        'TypeScript',
        'responsive design',
        'performance optimization',
        'NosytLabs',
      ],
      title: 'Modern Web Development Services | NosytLabs',
      description:
        'Create responsive, high-performance websites with Astro, React, and TypeScript that drive business growth and user engagement.',
    },
  },
  {
    id: 'ecommerce-solutions',
    slug: 'ecommerce-solutions',
    name: 'E-commerce Solutions',
    shortDescription: 'Create online stores that boost sales and customer satisfaction',
    description:
      'We develop secure, user-friendly e-commerce platforms that streamline your online sales process, from product discovery to checkout, helping you increase revenue while reducing cart abandonment.',
    icon: 'Smartphone',
    category: 'Web Development',
    href: '/services/ecommerce-solutions',
    features: [
      'Intuitive product management',
      'Secure payment systems',
      'Mobile-optimized shopping',
      'Customer management tools',
      'Efficient order processing',
      'Marketing integrations',
    ],
    detailedFeatures: [
      {
        title: 'User-Centric Shopping',
        description: 'Design experiences that guide customers smoothly from browsing to purchase',
        items: [
          'Customizable product catalogs',
          'Smart search and filters',
          'Personalized recommendations',
          'One-page checkout',
          'Mobile-responsive interfaces',
          'Wishlist functionality',
        ],
      },
      {
        title: 'Backend Operations',
        description:
          'Manage your store efficiently with reliable systems that scale with your business',
        items: [
          'Real-time inventory tracking',
          'Multiple payment gateways',
          'Automated order handling',
          'Customer database management',
          'Shipping integrations',
          'Analytics dashboard',
        ],
      },
      {
        title: 'Growth Tools',
        description: 'Drive repeat business and increase average order value',
        items: [
          'SEO-optimized product pages',
          'Cart recovery automation',
          'Email marketing tools',
          'Promotion management',
          'Customer feedback system',
          'Social sharing features',
        ],
      },
    ],
    price: 'Starting at $6,000',
    timeline: '8-12 weeks',
    cta: 'Build Your Online Store',
    metadata: {
      keywords: [
        'e-commerce development',
        'online store',
        'shopping cart',
        'payment processing',
        'inventory management',
        'product catalog',
        'NosytLabs',
      ],
    },
  },
  {
    id: 'progressive-web-apps',
    slug: 'progressive-web-apps',
    name: 'Progressive Web Apps',
    shortDescription:
      'Deliver app-like experiences that engage users across devices without app store hassles.',
    description:
      'Our PWA development bridges the gap between web and native apps, providing fast, reliable, and installable experiences that work offline and boost user engagement while reducing development costs.',
    icon: 'Smartphone',
    category: 'Web Development',
    href: '/services/progressive-web-apps',
    features: [
      'Offline Functionality',
      'App-Like Installation',
      'Push Notifications',
      'Performance Optimization',
      'Cross-Platform Compatibility',
      'Seamless Updates',
    ],
    detailedFeatures: [
      {
        title: 'Core PWA Features',
        description: 'Essential capabilities that make your web app feel native',
        items: [
          'Service worker implementation for offline access',
          'Web app manifest for home screen installation',
          'Push notification system for user re-engagement',
          'Background sync for reliable data handling',
          'Add to home screen prompts',
          'Splash screen customization',
        ],
      },
      {
        title: 'Performance Enhancements',
        description: 'Optimize for speed and efficiency to improve user satisfaction',
        items: [
          'Application shell architecture',
          'Efficient caching strategies',
          'Lazy loading of assets',
          'Optimized resource delivery',
          'Minimal network dependency',
          'Fast load times even on slow connections',
        ],
      },
      {
        title: 'User Experience Focus',
        description: 'Create engaging experiences that keep users coming back',
        items: [
          'Responsive and adaptive design',
          'Smooth animations and transitions',
          'Device hardware access',
          'Custom offline experiences',
          'Seamless online/offline transitions',
          'Analytics and performance monitoring',
        ],
      },
    ],
    price: 'Starting at $3,200',
    timeline: '6-10 weeks',
    cta: 'Build Your PWA',
    metadata: {
      keywords: [
        'progressive web app',
        'PWA development',
        'offline web apps',
        'installable web apps',
        'web push notifications',
        'cross-platform apps',
        'NosytLabs',
      ],
      title: 'Progressive Web App Development | NosytLabs',
      description:
        'Create fast, reliable PWAs that provide native-like experiences with web technologies, improving engagement and accessibility.',
    },
  },
];