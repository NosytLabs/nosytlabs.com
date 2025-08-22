/**
 * @fileoverview Enhanced Types with Content Collection Integration
 *
 * Central export point for all TypeScript type definitions,
 * ensuring a single source of truth and improved maintainability.
 * Now includes types inferred from Zod content collection schemas.
 *
 * @module types
 * @version 3.0.0
 * @author NosytLabs Team
 * @since 2025-07-13
 */



// Direct project data type definition (simplified)
export type ProjectData = {
  title: string;
  description: string;
  excerpt: string;
  slug?: string;
  category: string;
  status: string;
  featured: boolean;
  publishedAt: Date;
  lastModified: Date;
  draft: boolean;
};

// Blog post type - will be added when blog collection is implemented
export interface BlogPost {
  title: string;
  description: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
  featured?: boolean;
  slug: string;
  readingTime?: string;
  featuredImage?: string;
}

// Global types for the project
declare global {
  // Window extensions for NosytLabs utilities
  interface Window {
    NosytUtils?: {
      dom: {
        queryAll: (selector: string) => HTMLElement[];
        query: (selector: string) => HTMLElement | null;
      };
      events: {
        on: (element: HTMLElement, event: string, callback: (e: Event) => void) => void;
        off: (element: HTMLElement, event: string, callback: (e: Event) => void) => void;
      };
    };
    NosytLabs?: {
      config: {
        features: {
          darkMode: boolean;
          animations: boolean;
          lazyLoading: boolean;
          serviceWorker: boolean;
        };
      };
      init: () => void;
      initTheme: () => void;
      initCore: () => void;
    };
    announceToScreenReader?: (message: string) => void;
    formValidation?: {
      validate: (form: HTMLFormElement) => boolean;
      addValidator: (name: string, fn: (value: string) => boolean) => void;
    }; // For EnhancedFormValidation
    enhancedEffects?: {
      init: () => void;
      destroy: () => void;
    }; // For EnhancedEffects
    blogSystem?: {
      init: () => void;
      loadPosts: () => Promise<unknown[]>;
    }; // For BlogSystem
    testSentryError?: () => void; // For Sentry test button
  }

  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_SITE_URL?: string;
      SUPABASE_URL?: string; // Added for Supabase config
      SUPABASE_ANON_KEY?: string; // Added for Supabase config
      SUPABASE_SERVICE_ROLE_KEY?: string; // Added for Supabase config
      DATABASE_URL?: string; // Added for Neon config
      POSTGRES_URL?: string; // Added for Neon config
    }
  }
}

// ========== ENHANCED PROJECT TYPES ==========

/**
 * Enhanced project type with all content collection data
 * Inferred directly from the Zod schema for type safety
 */
export type Project = ProjectData;

/**
 * Project category enumeration (matching content collection schema)
 */
export type ProjectCategory =
  | 'web-development'
  | 'ai-integration'
  | 'consulting'
  | 'mobile-development'
  | 'automation';

/**
 * Project status enumeration (matching content collection schema)
 */
export type ProjectStatus = 'completed' | 'in-progress' | 'featured' | 'archived';

/**
 * Company size enumeration for client information
 */
export type CompanySize = 'startup' | 'small-business' | 'mid-market' | 'enterprise';

/**
 * Budget range enumeration for project scope
 */
export type BudgetRange = 'under-10k' | '10k-25k' | '25k-50k' | '50k-100k' | 'over-100k';

/**
 * Phase status for project timeline
 */
export type PhaseStatus = 'completed' | 'in-progress' | 'planned';

/**
 * Media type enumeration for project gallery
 */
export type MediaType = 'screenshot' | 'mockup' | 'diagram' | 'result';

/**
 * Video type enumeration for project videos
 */
export type VideoType = 'demo' | 'testimonial' | 'presentation' | 'tutorial';

/**
 * Download type enumeration for project resources
 */
export type DownloadType = 'case-study-pdf' | 'technical-report' | 'presentation' | 'mockups';

/**
 * Client information extracted from project data
 */
export interface ProjectClient {
  name: string;
  industry: string;
  companySize: CompanySize;
  website?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    featured: boolean;
  };
}

/**
 * Project timeline information
 */
export interface ProjectTimeline {
  startDate: Date;
  endDate?: Date;
  duration: string;
  phases?: Array<{
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    status: PhaseStatus;
  }>;
}

/**
 * Project scope information
 */
export interface ProjectScope {
  budgetRange: BudgetRange;
  teamSize: number;
  technologies: string[];
  services: string[];
}

/**
 * Project challenge and solution pair
 */
export interface ProjectChallenge {
  challenge: string;
  solution: string;
  impact: string;
}

/**
 * Project metric for results
 */
export interface ProjectMetric {
  label: string;
  value: string;
  improvement?: string;
  icon?: string;
}

/**
 * Project results with comprehensive metrics
 */
export interface ProjectResults {
  metrics: ProjectMetric[];
  roi?: string;
  userEngagement?: {
    before?: string;
    after?: string;
    improvement?: string;
  };
  performanceMetrics?: {
    pageLoadTime?: string;
    seoImprovement?: string;
    conversionRate?: string;
  };
}

/**
 * Project media assets
 */
export interface ProjectMedia {
  heroImage: string;
  gallery?: Array<{
    src: string;
    alt: string;
    caption?: string;
    type: MediaType;
  }>;
  videos?: Array<{
    src: string;
    title: string;
    description: string;
    thumbnail?: string;
    type: VideoType;
  }>;
  beforeAfter?: Array<{
    before: string;
    after: string;
    description: string;
  }>;
  downloads?: Array<{
    title: string;
    description: string;
    url: string;
    type: DownloadType;
  }>;
}

/**
 * Project technical details
 */
export interface ProjectTechnical {
  architecture?: string;
  deployment?: string;
  apis?: string[];
  database?: string;
  hosting?: string;
  codeRepository?: string;
}

// ========== COMMON TYPE DEFINITIONS ==========

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

/**
 * Base props that all components should extend
 */
export interface BaseComponentProps {
  class?: string;
  className?: string; // Added for consistency
  id?: string;
  'data-testid'?: string;
  style?: string; // Added for consistency
}

/**
 * Enhanced base props with common interactive features
 */
export interface EnhancedBaseProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

/**
 * Standardized variant system for consistent theming
 */
export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'minimal'
  | 'featured';

/**
 * Standardized size system
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Common states for interactive components
 */
export interface ComponentState {
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

/**
 * Responsive value type for layout properties
 */
export type ResponsiveValue<T> =
  | T
  | {
      default?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      '2xl'?: T;
    };

/**
 * Animation configuration type
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  type?: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom'; // Added type
  direction?: 'up' | 'down' | 'left' | 'right'; // Added direction
}

/**
 * Theme configuration type
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Responsive breakpoint type
 */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variant type for components
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Loading state type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Navigation item structure
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  preferences?: UserPreferences;
}

/**
 * User preferences structure
 */
export interface UserPreferences {
  theme: Theme;
  language: string;
  notifications: boolean;
  animations: boolean;
}

/**
 * Form field configuration
 */
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'tel'
    | 'url'
    | 'file'; // Added tel, url, file
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: string | RegExp; // Changed to allow RegExp
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: unknown) => string | null; // Added custom validation
  };
  helpText?: string; // Added helpText
  icon?: string; // Added icon
  rows?: number; // Added for textarea
  cols?: number; // Added for textarea
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'; // Added for textarea
}

/**
 * SEO metadata structure
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
}

/**
 * Standard layout component props
 */
export interface LayoutProps extends BaseComponentProps {
  columns?: ResponsiveValue<number>;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Props for interactive components (buttons, links, etc.)
 */
export interface InteractiveProps extends EnhancedBaseProps {
  onClick?: () => void;
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  external?: boolean;
  download?: string;
}

/**
 * Props for form components
 */
export interface FormProps extends EnhancedBaseProps {
  name?: string;
  value?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  help?: string;
  label?: string;
}

/**
 * Enhanced props for card components with rich project support
 */
export interface CardProps extends EnhancedBaseProps {
  title?: string;
  description?: string;
  excerpt?: string;
  image?:
    | {
        src: string;
        alt: string;
        width?: number;
        height?: number;
      }
    | string; // Support both object and string formats for backward compatibility

  // Enhanced media support
  media?: {
    heroImage?: string;
    gallery?: Array<{
      src: string;
      alt: string;
      caption?: string;
      type?: MediaType;
    }>;
    videos?: Array<{
      src: string;
      title: string;
      description: string;
      thumbnail?: string;
      type?: VideoType;
    }>;
  };

  // Client information for project cards
  client?: {
    name: string;
    industry: string;
    testimonial?: {
      quote: string;
      author: string;
      role: string;
      avatar?: string;
    };
  };

  // Project-specific data
  technologies?: string[];
  category?: string | ProjectCategory;
  status?: ProjectStatus;

  // Metrics and results
  metrics?: Array<{
    label: string;
    value: string;
    improvement?: string;
    icon?: string;
  }>;

  // Enhanced actions
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;

  // Timeline and scope information
  timeline?: {
    duration?: string;
    startDate?: Date;
    endDate?: Date;
  };

  scope?: {
    budgetRange?: BudgetRange;
    teamSize?: number;
    services?: string[];
  };

  // Enhanced styling options
  hoverable?: boolean;
  theme?: 'default' | 'glass' | 'dark' | 'gradient' | 'project' | 'blog' | 'service';
  contentType?: 'default' | 'project' | 'blog' | 'service' | 'feature' | 'info';

  // Blog-specific props
  author?: string;
  publishDate?: Date;
  readingTime?: string;
  tags?: string[];

  // Service-specific props
  pricing?: {
    startingPrice?: number;
    priceLabel?: string;
    currency?: 'USD' | 'EUR' | 'GBP';
  };

  // Feature flags
  featured?: boolean;
  showMetrics?: boolean;
  showTimeline?: boolean;
  showTechnologies?: boolean;
}

/**
 * Props for navigation components
 */
export interface NavigationProps extends EnhancedBaseProps {
  currentPath?: string;
  showMobileMenu?: boolean;
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
    href?: string;
  };
  items?: Array<{
    name: string;
    href: string;
    icon?: string;
    external?: boolean;
    children?: Array<{
      name: string;
      href: string;
      icon?: string;
    }>;
  }>;
  isRetroMode?: boolean;
}

/**
 * Props for hero section components
 */
export interface HeroProps extends EnhancedBaseProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: {
    type: 'image' | 'video' | 'gradient' | 'pattern';
    src?: string;
    overlay?: boolean;
    opacity?: number;
  };
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
  animation?: {
    enabled: boolean;
    type?: 'fade' | 'slide' | 'scale' | 'bounce';
    delay?: number;
    duration?: number;
  };
}

/**
 * Props for animated components
 */
export interface AnimationProps extends BaseComponentProps {
  animation?:
    | 'fade-in'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'bounce'
    | 'spin';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

/**
 * Props for image components
 */
export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  srcset?: string;
  placeholder?: string;
  fallback?: string;
}

/**
 * Error boundary state
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: {
    componentStack: string;
    timestamp: Date;
    userAgent?: string;
  };
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  reportErrors?: boolean;
  retryable?: boolean;
}

/**
 * Accessibility requirements
 */
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
  tabIndex?: number;
}

/**
 * Keyboard navigation support
 */
export interface KeyboardNavigationProps {
  onKeyDown?: (event: KeyboardEvent) => void;
  focusable?: boolean;
  focusOnMount?: boolean;
  returnFocus?: boolean;
}

/**
 * Form submission data
 */
export interface FormSubmission {
  id: string;
  formType: string;
  data: Record<string, string | number | boolean | null | undefined>;
  metadata: {
    submittedAt: Date;
    userAgent?: string;
    referrer?: string;
    source?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * Content item with rich metadata
 */
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: 'blog' | 'case-study' | 'tutorial' | 'news' | 'project';
  status: 'draft' | 'published' | 'archived';
  metadata: {
    publishedAt?: Date;
    updatedAt: Date;
    author: string;
    tags: string[];
    categories: string[];
    readingTime?: number;
    featured?: boolean;
  };
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords: string[];
  };
  media: {
    featuredImage?: string;
    gallery?: string[];
    video?: string;
  };
}

/**
 * Service category enumeration
 */
export type ServiceCategory =
  | 'web-development'
  | 'mobile-development'
  | 'ai-integration'
  | 'consulting'
  | 'design'
  | 'automation'
  | 'maintenance';

/**
 * Priority levels
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Outdated package information
 */
export interface OutdatedPackage {
  name: string;
  current: string;
  wanted: string;
  latest: string;
}

/**
 * CLI options for dependency analyzer
 */
export interface CliOptions {
  verbose?: boolean;
  security?: boolean;
  unused?: boolean;
  format?: 'json' | 'table' | 'summary';
  output?: string;
}

/**
 * Service item with enhanced type safety
 */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ServiceCategory;
  features: string[];
  pricing: {
    startingPrice: number;
    currency: 'USD' | 'EUR' | 'GBP';
    priceLabel: string;
    priceType: 'fixed' | 'hourly' | 'project';
  };
  timeline: {
    min: number;
    max: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
    label: string;
  };
  metadata: {
    popular?: boolean;
    featured?: boolean;
    new?: boolean;
    comingSoon?: boolean;
  };
  links: {
    href: string;
    cta: string;
    external?: boolean;
  };
  visual: {
    icon: React.ComponentType<{ className?: string }>;
    backgroundGradient?: string;
    primaryColor?: string;
    image?: string;
  };
  seo: {
    slug: string;
    keywords: string[];
    metaDescription?: string;
    ogImage?: string;
  };
}

/**
 * Service collection with filtering and sorting
 */
export interface ServiceCollection {
  services: ServiceItem[];
  categories: ServiceCategory[];
  filters: {
    category?: ServiceCategory;
    priceRange?: [number, number];
    timeline?: [number, number];
    features?: string[];
  };
  sorting: {
    field: keyof ServiceItem;
    direction: 'asc' | 'desc';
  };
}

/**
 * Grid layout configuration
 */
export interface GridConfig {
  columns: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap: ComponentSize;
  autoRows?: string;
}

/**
 * Component composition props
 */
export interface ComposableProps extends EnhancedBaseProps {
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<Record<string, unknown>>;
  animate?: AnimationConfig;
  grid?: GridConfig;
}

// ========== UTILITY TYPES FOR CONTENT COLLECTIONS ==========

/**
 * Helper type to extract specific fields from Project type
 */
export type ProjectSummary = {
  title: string;
  description: string;
  excerpt: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
};

/**
 * Helper type for project card display
 */
export type ProjectCardData = ProjectSummary & {
  slug: string;
  media: {
    heroImage: string;
  };
  scope: {
    technologies: string[];
  };
  client: {
    name: string;
    industry: string;
  };
  results?: {
    metrics: Array<{
      label: string;
      value: string;
      improvement?: string;
    }>;
  };
};

/**
 * Helper type for blog post card display
 */
export type BlogCardData = Pick<
  BlogPost,
  'title' | 'description' | 'excerpt' | 'author' | 'tags' | 'featured'
> & {
  slug: string;
  publishDate: Date;
  readingTime: string;
  featuredImage?: string;
};

/**
 * Collection entry type for Astro content collections
 */
export interface CollectionEntry<T> {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: T;
  render: () => Promise<{
    Content: React.ComponentType;
    headings: Array<{
      depth: number;
      slug: string;
      text: string;
    }>;
    remarkPluginFrontmatter: Record<string, unknown>;
  }>;
}

/**
 * Type for project collection entries
 */
export type ProjectEntry = CollectionEntry<Project>;

/**
 * Type for blog collection entries
 */
export type BlogEntry = CollectionEntry<BlogPost>;

// ========== TYPE GUARDS ==========

/**
 * Type guard to check if a project has enhanced data
 */
export function isEnhancedProject(project: unknown): project is Project {
  return (
    project !== null &&
    typeof project === 'object' &&
    'client' in project &&
    'scope' in project &&
    'results' in project &&
    typeof (project as any).client === 'object' &&
    typeof (project as any).scope === 'object' &&
    typeof (project as any).results === 'object'
  );
}

// ========== EXPORT CONVENIENCE TYPES ==========

/**
 * Re-export key types for easier imports
 */
export type { ProjectData as EnhancedProject, BlogPost as EnhancedBlogPost };

/**
 * Breaking changes documentation:
 *
 * v3.0.0 Changes:
 * - Project interface now inferred from Zod schema (breaking change)
 * - ProjectStatus values changed from legacy to: 'completed' | 'in-progress' | 'featured' | 'archived'
 * - CardProps enhanced with comprehensive project, blog, and service support
 * - Added new utility types: ProjectCardData, BlogCardData, CollectionEntry
 * - Legacy interfaces marked as deprecated but maintained for backward compatibility
 *
 * Migration Guide:
 * - Replace 'Project' imports with 'LegacyProject' if using old format
 * - Update ProjectStatus usage to new enum values
 * - Consider migrating to enhanced project schema for full feature support
 */
