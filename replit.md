# NOSYT Labs - Modern Web Development Platform

## Overview

NOSYT Labs is a professional web development and AI integration agency website built with modern web technologies. The site showcases 9 professional services: web development, mobile apps, AI integration, Web3/blockchain, rapid prototyping, 3D printing, photo editing, AI music, and tech consulting. Built as a static site with Astro for optimal performance, it features a component-based architecture using React and HeroUI for a polished, accessible user experience.

The platform emphasizes speed, accessibility, and modern design principles while maintaining clean, maintainable code. The site includes comprehensive legal pages, a blog system with 10 posts, and a professional contact form with service selection, real-time validation, and Email.js integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Astro 5.14.7 (Static Site Generation)
- **Rationale**: Astro provides zero-JS by default with islands architecture for optimal performance
- **Component Strategy**: Mix of Astro components (.astro) for static content and React components (.tsx) for interactive features
- **Pros**: Excellent build times, minimal JavaScript bundle, great SEO, flexible component integration
- **Cons**: Learning curve for developers new to Astro's paradigm

**UI Component Library**: HeroUI 2.8.5
- **Rationale**: Modern, accessible React component library providing consistent design system
- **Implementation**: Wrapped in HeroUIProvider for global context, used for buttons, cards, forms, inputs
- **Pros**: Ready-made accessible components, consistent styling, professional appearance
- **Cons**: Some custom styling needed to match brand identity

**Styling**: Tailwind CSS 3.4.14 + Custom CSS
- **Rationale**: Utility-first approach with design system variables for consistency
- **Custom Properties**: Extensive CSS variables for spacing, typography, colors, z-index layers
- **Pros**: Rapid development, consistent spacing, responsive design, small bundle size
- **Cons**: Can lead to long className strings

**State Management**: React hooks (useState, useEffect) for local component state
- **Rationale**: Simple, built-in solution sufficient for current needs
- **Scope**: Contact form validation, blog search/filtering, UI interactions
- **Pros**: No additional dependencies, straightforward
- **Cons**: May need upgrade for more complex state requirements

**Animation**: Framer Motion 12.23.24 + CSS Animations
- **Rationale**: Declarative animations with fallback to CSS for performance
- **Implementation**: AnimationFallback system ensures content visibility even if animations fail
- **Pros**: Smooth, GPU-accelerated animations
- **Cons**: Additional bundle weight

### Content Management

**Content Collections**: Astro Content Collections with Zod validation
- **Collections**: `blog` and `services`
- **Rationale**: Type-safe content with validation, easy to query and render
- **Schema Validation**: Zod schemas enforce required fields, date formats, array lengths
- **Pros**: Type safety, content validation at build time, excellent DX
- **Cons**: Requires schema updates when content structure changes

**Blog System**:
- MDX support for rich content (code blocks, callouts, custom components)
- Metadata: title, description, dates, tags, categories, reading time
- SEO fields: keywords, excerpts, hero images
- Search and filtering implemented client-side with React

**Services System**:
- Structured service data with features, pricing, icons
- Reusable service cards with HeroUI components
- Support for CTAs and custom content

### Routing & Pages

**Static Routes**: All pages pre-rendered at build time
- Homepage, About, Services, Contact, Blog listing
- Legal pages: Privacy, Terms, Cookies, Disclaimer
- Individual blog posts and service pages generated from collections

**Dynamic Routes**: 
- `/blog/[slug]` - Individual blog posts
- `/services/[slug]` - Individual service pages
- Pagination support built-in via Astro

**SEO Optimization**:
- Sitemap generation (sitemap.xml, sitemap-index.xml)
- Robots.txt configuration
- Structured data for Organization, WebSite, BlogPosting
- Meta tags, Open Graph, Twitter Cards

### Form Handling

**Contact Form**: HeroUI components with custom validation
- Real-time field validation on blur and input
- Character counters and helper text
- Visual validation states (error/success)
- EmailJS integration for email delivery
- TypeScript types throughout
- Accessibility: ARIA labels, live regions, autocomplete

**Validation Strategy**: 
- Centralized validation logic
- Field-level and form-level validation
- Clear, specific error messages
- Loading states during submission

### Performance Optimization

**Service Worker**: Advanced caching strategies (sw.js)
- Cache versioning for invalidation
- Multiple cache buckets: static, fonts, images, dynamic, API, navigation, critical
- Cache-first for static assets, network-first for dynamic content
- Stale-while-revalidate for images
- Cache size limits to prevent bloat

**Image Optimization**: 
- WebP format where supported
- Lazy loading via Intersection Observer
- Responsive images with srcset
- Optimized hero images

**Code Splitting**: 
- Automatic via Astro and Vite
- React components loaded as islands
- Minimal JavaScript shipped to client

**Build Output**: 
- Gzipped bundle: ~43 kB
- 21 static pages
- Build time: ~32 seconds
- Zero errors in production build

### Accessibility

**WCAG Compliance**: 
- Semantic HTML throughout
- ARIA attributes on interactive elements
- Keyboard navigation support
- Focus management
- Skip links
- Alt text on images

**Forms**: 
- Proper label associations
- Error announcements via live regions
- Minimum touch target sizes (44px)
- Clear focus indicators

**Color Contrast**: Design system ensures WCAG AA compliance

### Type Safety

**TypeScript Configuration**: Strict mode enabled
- `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`, `noImplicitReturns`
- Path aliases: `@/*` for src, `@shared-utils/*` for shared utilities
- Separate tsconfig for shared-utils package

**Type Definitions**:
- Custom types for blog posts, services, components
- Astro-specific types (pagination, static paths)
- React component prop types
- Utility types (DeepPartial, Optional, RequiredFields)

### Code Organization

**Monorepo Structure**: 
- `/packages/shared-utils` - Shared TypeScript utilities
- Validation, sanitization, date utilities, theme management
- Exported as local package dependency

**Component Structure**:
- `/src/components/ui` - Reusable UI components (buttons, cards, icons)
- `/src/components/layout` - Layout components (Header, Footer, Section) - Astro files
- `/src/components/content` - Content-specific components (blog callouts, code displays)
- `/src/components/forms` - Form components
- `/src/components/blog` - Blog-specific components (search, filters)
- `/src/components/providers` - React context providers

**Library Organization**:
- `/src/lib/core` - Core utilities (validation, formatting, debounce, throttle)
- `/src/lib` - Feature-specific utilities (blog, SEO, constants, enhancers)
- Centralized exports via index files

**Styles**:
- `/src/styles/main.css` - Global styles, CSS variables, component utilities
- Tailwind configuration extends base with custom spacing, colors, container settings

### Security

**Security Headers**: Middleware for HTTP security headers
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- HSTS with preload
- Referrer Policy
- Permissions Policy

**Form Security**: 
- Input sanitization via DOMPurify (shared-utils)
- Email validation
- Max length enforcement
- Honeypot field support for Netlify

## External Dependencies

### Third-Party Services

**EmailJS**: Contact form email delivery
- **Purpose**: Send contact form submissions via email without backend server
- **Integration**: Client-side JavaScript library
- **Configuration**: Service ID, template ID, user ID stored as environment variables

**Google Analytics**: (Configured but not shown in code)
- **Purpose**: Website analytics and user behavior tracking
- **Privacy**: Mentioned in cookie policy

### APIs & Integrations

**Spotify**: Mentioned in cookie policy
- **Purpose**: Likely embedded content or integrations
- **Privacy**: Third-party cookies disclosed

**Social Media Platforms**: 
- **Purpose**: Social sharing, embedded content
- **Privacy**: Third-party cookies disclosed in cookie policy

### CDN & External Resources

**Google Fonts**: Inter font family
- **Files**: inter-latin.woff2, inter-var.woff2
- **Caching**: Service worker caches fonts with cache-first strategy

**Icons**: 
- Lucide React for UI icons
- Custom SVG icons for services and features
- astro-icon package for icon management

### Build Tools & Development

**Vite**: Build tool and dev server (via Astro)
- **Purpose**: Fast HMR, optimized production builds
- **Configuration**: Astro handles Vite configuration

**PostCSS**: CSS processing
- **Purpose**: Process Tailwind, autoprefixer
- **Plugins**: Tailwind CSS, autoprefixer (implicit)

**ESLint & Prettier**: Code quality and formatting
- **ESLint**: TypeScript, React, Astro linting
- **Prettier**: Code formatting
- **Configuration**: Strict rules, accessibility checks

### NPM Packages (Key Dependencies)

**UI & Styling**:
- `@heroui/react`: Component library
- `tailwindcss`: Utility-first CSS framework
- `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio`: Tailwind plugins
- `class-variance-authority`: Component variant management
- `tailwind-merge`: Merge Tailwind classes without conflicts

**React Ecosystem**:
- `react`, `react-dom`: React library
- `@radix-ui/react-select`, `@radix-ui/react-toast`: Headless UI components
- `framer-motion`: Animation library

**Content & Markdown**:
- `@astrojs/mdx`: MDX support for Astro
- `astro-icon`: Icon management

**Validation & Sanitization**:
- `zod`: Schema validation for content collections
- `dompurify`: HTML sanitization (in shared-utils)
- `jsdom`: DOM implementation for server-side sanitization

**Development Tools**:
- `typescript`: Type checking
- `@astrojs/check`: Astro type checking
- `eslint`, `prettier`: Linting and formatting
- `glob`, `fast-glob`: File system utilities

### Deployment & Hosting

**Netlify**: (Implied from form attributes)
- **Form Handling**: `data-netlify` attributes on forms
- **Deployment**: Likely static site hosting
- **Features**: Form submissions, continuous deployment

### Environment Variables

**Expected Variables**:
- `PUBLIC_SITE_URL`: Production site URL
- `PUBLIC_BASE_URL`: Base path for routes and assets
- EmailJS credentials: Service ID, Template ID, Public Key

**Configuration Strategy**: 
- Public variables prefixed with `PUBLIC_`
- Fallbacks to development defaults
- Build-time variable substitution