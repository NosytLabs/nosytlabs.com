/**
 * Test Fixtures
 * 
 * @fileoverview Centralized test fixtures and mock data for unit and integration tests.
 * Provides consistent test data across all test suites.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

// ========== MOCK DATA TYPES ==========

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

export interface MockProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  author: MockUser;
}

export interface MockBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date;
  author: MockUser;
  readTime: number;
  featured: boolean;
}

export interface MockPerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  tbt: number;
  si: number;
  timestamp: Date;
}

// ========== USER FIXTURES ==========

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    },
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    createdAt: new Date('2024-01-15T12:00:00.000Z'),
    preferences: {
      theme: 'light',
      notifications: false,
      language: 'en',
    },
  },
  {
    id: 'user-3',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'guest',
    createdAt: new Date('2024-02-01T08:30:00.000Z'),
    preferences: {
      theme: 'light',
      notifications: false,
      language: 'en',
    },
  },
];

// ========== PROJECT FIXTURES ==========

export const mockProjects: MockProject[] = [
  {
    id: 'project-1',
    title: 'NosytLabs Website',
    description: 'Modern portfolio website built with Astro, React, and Tailwind CSS',
    technologies: ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'Playwright'],
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T12:00:00.000Z'),
    author: mockUsers[0],
  },
  {
    id: 'project-2',
    title: '3D Printing Calculator',
    description: 'Advanced calculator for 3D printing cost estimation and optimization',
    technologies: ['JavaScript', 'React', 'CSS3', 'WebGL'],
    status: 'completed',
    createdAt: new Date('2023-12-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    author: mockUsers[0],
  },
  {
    id: 'project-3',
    title: 'AI Content Generator',
    description: 'AI-powered content generation tool for blogs and social media',
    technologies: ['Python', 'FastAPI', 'OpenAI API', 'React', 'PostgreSQL'],
    status: 'archived',
    createdAt: new Date('2023-06-01T00:00:00.000Z'),
    updatedAt: new Date('2023-12-01T00:00:00.000Z'),
    author: mockUsers[1],
  },
];

// ========== BLOG POST FIXTURES ==========

export const mockBlogPosts: MockBlogPost[] = [
  {
    id: 'post-1',
    title: 'The Future of 3D Printing in 2025',
    slug: 'future-of-3d-printing-2025',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    excerpt: 'Exploring the latest trends and innovations in 3D printing technology.',
    tags: ['3D Printing', 'Technology', 'Innovation', 'Manufacturing'],
    publishedAt: new Date('2024-01-15T10:00:00.000Z'),
    author: mockUsers[0],
    readTime: 8,
    featured: true,
  },
  {
    id: 'post-2',
    title: 'AI Tools Comparison 2025',
    slug: 'ai-tools-comparison-2025',
    content: 'Comprehensive comparison of AI development tools...',
    excerpt: 'A detailed comparison of the best AI development tools available in 2025.',
    tags: ['AI', 'Tools', 'Development', 'Comparison'],
    publishedAt: new Date('2024-01-10T14:30:00.000Z'),
    author: mockUsers[0],
    readTime: 12,
    featured: false,
  },
  {
    id: 'post-3',
    title: 'Crypto Mining Profitability 2025',
    slug: 'crypto-mining-profitability-2025',
    content: 'Analysis of cryptocurrency mining profitability...',
    excerpt: 'Understanding the current state of crypto mining and profitability factors.',
    tags: ['Cryptocurrency', 'Mining', 'Profitability', 'Analysis'],
    publishedAt: new Date('2024-01-05T09:15:00.000Z'),
    author: mockUsers[1],
    readTime: 6,
    featured: false,
  },
];

// ========== PERFORMANCE METRICS FIXTURES ==========

export const mockPerformanceMetrics: MockPerformanceMetrics[] = [
  {
    fcp: 1200,
    lcp: 2100,
    fid: 80,
    cls: 0.05,
    tti: 2800,
    tbt: 150,
    si: 2500,
    timestamp: new Date('2024-01-15T12:00:00.000Z'),
  },
  {
    fcp: 1500,
    lcp: 2400,
    fid: 120,
    cls: 0.08,
    tti: 3200,
    tbt: 200,
    si: 2800,
    timestamp: new Date('2024-01-14T12:00:00.000Z'),
  },
  {
    fcp: 1100,
    lcp: 1900,
    fid: 60,
    cls: 0.03,
    tti: 2500,
    tbt: 120,
    si: 2200,
    timestamp: new Date('2024-01-13T12:00:00.000Z'),
  },
];

// ========== DOM FIXTURES ==========

export const mockDOMElements = {
  button: {
    tagName: 'BUTTON',
    className: 'btn btn-primary',
    textContent: 'Click me',
    disabled: false,
    type: 'button',
  },
  input: {
    tagName: 'INPUT',
    type: 'text',
    value: '',
    placeholder: 'Enter text...',
    required: false,
  },
  image: {
    tagName: 'IMG',
    src: '/images/test-image.jpg',
    alt: 'Test image',
    loading: 'lazy',
    width: 300,
    height: 200,
  },
  link: {
    tagName: 'A',
    href: '/test-link',
    textContent: 'Test Link',
    target: '_self',
  },
};

// ========== API RESPONSE FIXTURES ==========

export const mockApiResponses = {
  success: {
    status: 200,
    data: { message: 'Success' },
    timestamp: new Date().toISOString(),
  },
  error: {
    status: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
  },
  notFound: {
    status: 404,
    error: 'Not Found',
    message: 'Resource not found',
    timestamp: new Date().toISOString(),
  },
  unauthorized: {
    status: 401,
    error: 'Unauthorized',
    message: 'Authentication required',
    timestamp: new Date().toISOString(),
  },
};

// ========== FORM DATA FIXTURES ==========

export const mockFormData = {
  contact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Test Subject',
    message: 'This is a test message for the contact form.',
  },
  newsletter: {
    email: 'subscriber@example.com',
    preferences: ['weekly', 'tech-updates'],
  },
  project: {
    title: 'New Project',
    description: 'Project description here',
    budget: 5000,
    timeline: '3 months',
    technologies: ['React', 'Node.js'],
  },
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Create a mock user with optional overrides
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    ...mockUsers[0],
    ...overrides,
    id: overrides.id || `user-${Date.now()}`,
  };
}

/**
 * Create a mock project with optional overrides
 */
export function createMockProject(overrides: Partial<MockProject> = {}): MockProject {
  return {
    ...mockProjects[0],
    ...overrides,
    id: overrides.id || `project-${Date.now()}`,
  };
}

/**
 * Create a mock blog post with optional overrides
 */
export function createMockBlogPost(overrides: Partial<MockBlogPost> = {}): MockBlogPost {
  return {
    ...mockBlogPosts[0],
    ...overrides,
    id: overrides.id || `post-${Date.now()}`,
  };
}

/**
 * Create mock performance metrics with optional overrides
 */
export function createMockPerformanceMetrics(
  overrides: Partial<MockPerformanceMetrics> = {}
): MockPerformanceMetrics {
  return {
    ...mockPerformanceMetrics[0],
    ...overrides,
    timestamp: overrides.timestamp || new Date(),
  };
}

/**
 * Generate random test data
 */
export const generators = {
  randomString: (length = 10): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  },
  
  randomEmail: (): string => {
    return `${generators.randomString(8)}@example.com`;
  },
  
  randomDate: (start = new Date(2020, 0, 1), end = new Date()): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  
  randomNumber: (min = 0, max = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  randomBoolean: (): boolean => {
    return Math.random() < 0.5;
  },
};

// ========== EXPORTS ==========

export default {
  users: mockUsers,
  projects: mockProjects,
  blogPosts: mockBlogPosts,
  performanceMetrics: mockPerformanceMetrics,
  domElements: mockDOMElements,
  apiResponses: mockApiResponses,
  formData: mockFormData,
  create: {
    user: createMockUser,
    project: createMockProject,
    blogPost: createMockBlogPost,
    performanceMetrics: createMockPerformanceMetrics,
  },
  generators,
};
