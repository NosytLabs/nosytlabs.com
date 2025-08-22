/**
 * AI Integration Services Configuration
 * Services related to AI-powered features, agents, automation, and analytics
 */

import type { ServiceData } from './types';

export const aiIntegrationServices: ServiceData[] = [
  {
    id: 'ai-powered-features',
    slug: 'ai-powered-features',
    name: 'AI-Powered Features',
    shortDescription:
      'Integrate advanced AI to automate processes, personalize experiences, and drive data-driven decisions that boost efficiency and revenue.',
    description:
      'We embed cutting-edge AI capabilities into your applications, leveraging the latest models to solve real business challenges, from automating routine tasks to providing predictive insights that give you a competitive edge.',
    icon: 'Bot',
    category: 'AI Solutions',
    href: '/services/ai-powered-features',
    features: [
      'Advanced LLM Integration',
      'Multimodal AI Processing',
      'Intelligent Automation Workflows',
      'Predictive Analytics',
      'Custom AI Solutions',
      'Secure AI Deployment',
    ],
    detailedFeatures: [
      {
        title: 'Cutting-Edge AI Integration',
        description: 'Harness the latest AI technologies to enhance your applications',
        items: [
          'Seamless integration with leading LLMs like GPT-4 and Claude',
          'Multimodal processing for text, images, and voice inputs',
          'Real-time AI responses with minimal latency',
          'Fine-tuned models customized to your data and needs',
          'Automated workflows that reduce manual effort',
          'Advanced retrieval systems for accurate information access',
        ],
      },
      {
        title: 'Autonomous Systems',
        description:
          'Build self-sufficient AI that operates independently to streamline operations',
        items: [
          'Specialized agents for specific business tasks',
          'Collaborative multi-agent frameworks',
          'Decision-making algorithms that adapt to scenarios',
          'Continuous learning mechanisms for improvement',
          'Integration with existing tools and APIs',
          'Monitoring dashboards for performance oversight',
        ],
      },
      {
        title: 'Enterprise-Grade AI',
        description: 'Scalable solutions that meet business demands securely',
        items: [
          'Private deployment options for data security',
          'Compliance with industry standards and regulations',
          'Efficient training pipelines for custom models',
          'Comprehensive analytics and reporting',
          'Seamless system integrations',
          'Optimization for cost and resource efficiency',
        ],
      },
    ],
    price: 'Starting at $12,000',
    timeline: '8-16 weeks',
    cta: 'Transform with AI',
    popular: true,
    testimonial: {
      quote:
        'The AI features NosytLabs integrated into our platform have transformed our user experience. Our customers love the intelligent search and personalized recommendations.',
      author: 'Alex Chen',
      company: 'TechSolutions Inc.',
    },
    metadata: {
      keywords: [
        'AI integration 2025',
        'autonomous AI agents',
        'multimodal AI',
        'LLM integration',
        'AI automation',
        'enterprise AI',
        'custom AI models',
        'NosytLabs',
      ],
      title: 'AI-Powered Features | NosytLabs',
      description:
        'Leverage advanced AI to automate, personalize, and optimize your business operations for greater efficiency and innovation.',
    },
  },
];