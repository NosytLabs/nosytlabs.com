/**
 * Consulting Services Configuration
 * Strategic consulting, technical advisory, and business transformation services
 */

import type { ServiceData } from './types';

export const consultingServices: ServiceData[] = [
  {
    id: 'strategic-consulting',
    slug: 'strategic-consulting',
    name: 'Strategic Consulting',
    shortDescription:
      'Expert guidance to align technology with business goals, optimize operations, and accelerate growth through strategic planning.',
    description:
      'Our strategic consulting services help you navigate complex technology decisions, optimize your digital infrastructure, and create roadmaps that drive sustainable business growth.',
    icon: 'Target',
    category: 'Consulting',
    href: '/services/strategic-consulting',
    features: [
      'Technology Strategy',
      'Digital Transformation',
      'Architecture Planning',
      'Performance Optimization',
      'Risk Assessment',
      'Growth Planning',
    ],
    detailedFeatures: [
      {
        title: 'Strategic Technology Planning',
        description: 'Align your technology investments with business objectives',
        items: [
          'Comprehensive technology audits and assessments',
          'Strategic roadmaps for digital transformation',
          'Technology stack optimization recommendations',
          'Cost-benefit analysis for technology investments',
          'Risk mitigation strategies and contingency planning',
          'Vendor evaluation and selection guidance',
        ],
      },
      {
        title: 'Digital Transformation',
        description: 'Guide your organization through successful digital evolution',
        items: [
          'Process automation and workflow optimization',
          'Legacy system modernization strategies',
          'Cloud migration planning and execution',
          'Data strategy and analytics implementation',
          'Change management and team training',
          'Performance metrics and success measurement',
        ],
      },
      {
        title: 'Growth & Optimization',
        description: 'Accelerate business growth through strategic technology use',
        items: [
          'Scalability planning for rapid growth',
          'Performance bottleneck identification and resolution',
          'Security posture assessment and improvement',
          'Compliance and regulatory guidance',
          'Team structure and skill development recommendations',
          'Long-term sustainability planning',
        ],
      },
    ],
    price: 'Starting at $5,000',
    timeline: '4-12 weeks',
    cta: 'Get Strategic Guidance',
    popular: false,
    testimonial: {
      quote:
        'NosytLabs helped us create a clear technology roadmap that aligned perfectly with our business goals. Their strategic insights were invaluable.',
      author: 'Maria Rodriguez',
      company: 'GrowthTech Solutions',
    },
    metadata: {
      keywords: [
        'strategic consulting 2025',
        'digital transformation',
        'technology strategy',
        'business consulting',
        'growth planning',
        'technology roadmap',
        'NosytLabs consulting',
      ],
      title: 'Strategic Consulting | NosytLabs',
      description:
        'Expert strategic consulting to align technology with business goals and accelerate growth through informed decision-making.',
    },
  },
  {
    id: 'technical-advisory',
    slug: 'technical-advisory',
    name: 'Technical Advisory',
    shortDescription:
      'Expert technical guidance for architecture decisions, code reviews, and technology implementation best practices.',
    description:
      'Get expert technical advice from seasoned professionals to make informed decisions about your technology stack, architecture, and development practices.',
    icon: 'Users',
    category: 'Consulting',
    href: '/services/technical-advisory',
    features: [
      'Architecture Review',
      'Code Quality Assessment',
      'Technology Selection',
      'Best Practices Guidance',
      'Team Mentoring',
      'Implementation Support',
    ],
    detailedFeatures: [
      {
        title: 'Architecture & Design Review',
        description: 'Expert evaluation of your technical architecture and design decisions',
        items: [
          'System architecture assessment and recommendations',
          'Database design and optimization review',
          'API design and integration strategy evaluation',
          'Security architecture and vulnerability assessment',
          'Scalability and performance analysis',
          'Technology stack evaluation and optimization',
        ],
      },
      {
        title: 'Code Quality & Standards',
        description: 'Comprehensive code review and quality improvement guidance',
        items: [
          'Code review and quality assessment',
          'Development standards and best practices implementation',
          'Testing strategy and coverage improvement',
          'Documentation and maintainability enhancement',
          'Performance optimization recommendations',
          'Security code review and hardening',
        ],
      },
      {
        title: 'Team Development & Mentoring',
        description: 'Elevate your team\'s technical capabilities and practices',
        items: [
          'Technical mentoring and skill development',
          'Development process optimization',
          'Tool selection and workflow improvement',
          'Knowledge transfer and documentation',
          'Career development guidance for technical staff',
          'Technical leadership and decision-making support',
        ],
      },
    ],
    price: 'Starting at $3,000',
    timeline: '2-8 weeks',
    cta: 'Get Technical Guidance',
    popular: false,
    testimonial: {
      quote:
        'The technical advisory from NosytLabs helped us avoid costly mistakes and implement best practices that improved our code quality significantly.',
      author: 'David Kim',
      company: 'InnovateTech',
    },
    metadata: {
      keywords: [
        'technical advisory 2025',
        'code review services',
        'architecture consulting',
        'technical mentoring',
        'best practices',
        'technology guidance',
        'NosytLabs advisory',
      ],
      title: 'Technical Advisory | NosytLabs',
      description:
        'Expert technical advisory services for architecture decisions, code quality, and development best practices.',
    },
  },
];