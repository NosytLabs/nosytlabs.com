/**
 * Navigation Constants
 *
 * Defines the navigation items and their types for the website.
 * This includes modern AI-focused navigation items for 2025.
 */

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  isNew?: boolean;
  aiPowered?: boolean;
}

export const NAVIGATION: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: 'home',
    description: 'Return to the homepage',
  },
  {
    name: 'AI Services',
    href: '/services',
    icon: 'brain-circuit',
    description: 'Explore our cutting-edge AI solutions',
    isNew: true,
    aiPowered: true,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: 'mail',
    description: 'Get in touch with us',
  },
];

// Navigation categories for organizing services and features
export const NAV_CATEGORIES = {
  main: ['Home', 'AI Services', 'Projects', 'Blog', 'Testimonials', 'Contact'],
  aiServices: ['Machine Learning', 'Natural Language', 'Computer Vision', 'Automation'],
  resources: ['Documentation', 'API Reference', 'Tutorials', 'Case Studies'],
  company: ['Careers', 'Press', 'Contact'],
} as const;

// Feature flags for progressive enhancement
export const NAV_FEATURES = {
  aiPoweredSearch: false, // Disabled - search functionality removed
  dynamicMenus: true,
  contextualHelp: true,
  voiceNavigation: false, // Disabled - voice navigation removed
  gestureControl: false, // Coming soon
} as const;
