/**
 * Company and brand information constants
 */

import type { CompanyInfo, BrandMessaging, ContactInfo } from './types';

export const COMPANY: CompanyInfo = {
  NAME: 'NosytLabs',
  FULL_NAME: 'NOSYT LLC',
  TAGLINE: 'Notable Opportunities Shape Your Tomorrow',
  DESCRIPTION: 'AI-assisted development services helping businesses build modern digital solutions.',
  FOUNDED: '2025',
  WEBSITE: 'https://nosytlabs.com',
  CDN_URL: 'https://cdn.nosytlabs.com',
} as const;

export const BRAND_MESSAGING: BrandMessaging = {
  SLOGAN: 'AI-Assisted Development for 2025',
  HERO_HEADLINE: 'Build Better Software with AI Development Tools',
  VALUE_PROPOSITION:
    'Modern web development using AI tools like Cursor, Claude, and ChatGPT to build efficient, reliable solutions. We leverage AI assistance to deliver quality software faster while maintaining transparency about our development process.',
  CTA_PRIMARY: 'Start Your Project',
  CTA_SECONDARY: 'Learn About Our Process',
} as const;

export const CONTACT: ContactInfo = {
  EMAIL: {
    MAIN: 'hi@nosytlabs.com',
    BUSINESS: 'tyson@nosytlabs.com',
    SUPPORT: 'support@nosytlabs.com',
  },
  SOCIAL: {
    GITHUB: 'https://github.com/NosytLabs',
    YOUTUBE: 'https://www.youtube.com/@TycenYT',
    KICK: 'https://kick.com/Tycen',
    CREALITY: 'https://crealitycloud.com/user/9519489699',
  },
} as const;

// Legacy compatibility object for existing components
export const COMPANY_INFO = {
  name: COMPANY.FULL_NAME,
  email: CONTACT.EMAIL.MAIN,
  // Phone number removed as per requirements - no placeholder phone numbers
  address: 'Remote-First Development Team, NosytLabs', // Updated authentic address
} as const;

export const SITE = {
  TITLE: 'NosytLabs',
  DESCRIPTION: 'Notable Opportunities Shape Your Tomorrow',
  DEFAULT_LANG: 'en',
  SITE_URL: 'https://nosytlabs.com',
} as const;

export const TWITTER_USER_NAME = 'nosytlabs';