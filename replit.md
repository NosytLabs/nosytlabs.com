# NosytLabs Website - Replit Configuration

## Overview

A high-performance marketing website for NosytLabs built with Astro 5.14, React 18.3, and Tailwind CSS. The site features static site generation (SSG), optimized performance metrics (LCP <323ms, CLS 0.00), and comprehensive accessibility compliance.

**Key Features:**

- Marketing pages (home, services, about, contact, blog)
- MDX-based content collections for blog posts and services
- EmailJS-powered contact form (client-side, no backend required)
- Responsive design with mobile-first approach
- SEO optimized with structured data and sitemaps
- Performance-optimized with service worker caching
- Theme management (light/dark mode)
- Configured for Replit static deployment

**Recent Changes (October 2025):**

- Migrated from Vercel to Replit
- Replaced Resend with EmailJS for client-side email delivery
- Removed server-side API routes (now fully static)
- Updated site URL to nosytlabs.com
- Enhanced UI/UX across all sections with improved spacing, alignment, and visual consistency
- Configured for Replit static deployment (autoscale)
- **Complete brand overhaul with NOSYT slogan**: Hero section now prominently displays "Notable Opportunities Shape Your Tomorrow" as the main headline
- **Blog content transformation**: Deleted all technical blog posts and created 8 new SEO-optimized, viral-worthy posts focused on practical guides (Top AI Tools, Website Builders, ChatGPT Alternatives, AI Image Generators, Website Building Guide, Logo Makers, AI Writing Tools, Email Marketing Tools)
- **Code cleanup**: Removed MCP modules, analytics.js placeholder, and fixed LSP errors
- **SEO optimization**: All new blog posts include comparison tables, SEO keywords, meta descriptions, and social sharing tags

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework

**Astro 5.14.7 (Static Site Generation)**

- **Rationale**: Chosen for zero JavaScript by default, partial hydration, and exceptional performance. Astro's island architecture allows selective React component hydration only where needed.
- **Alternatives Considered**: Next.js (heavier bundle), Gatsby (more complex), pure React (poor SEO)
- **Pros**: Sub-second load times, minimal JavaScript, excellent SEO, simple deployment
- **Cons**: Limited to static/SSG patterns, smaller ecosystem than Next.js

### UI Components

**React 18.3.1 + TypeScript**

- **Purpose**: Interactive components requiring client-side state (ContactForm, BlogSearch, theme management)
- **Integration**: React components use `client:load` or `client:visible` directives for selective hydration
- **Component Libraries**:
  - HeroUI 2.8.5 for pre-built components
  - Radix UI for accessible primitives (Select, Toast)
  - Lucide React for icons

### Styling System

**Tailwind CSS 3.4.14 + Custom Design Tokens**

- **Design System**: CSS custom properties in `src/styles/main.css` define color palette, spacing, and animation utilities
- **Color Palette**:
  - Primary: Deep Indigo (#232965)
  - Secondary: Electric Blue (#2F82FF)
  - Accent: Neon Green (#29FFAB) + Teal (#3DB4AD)
- **Approach**: Utility-first with consolidated animation classes to reduce CSS duplication
- **Plugins**: @tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio

### Content Management

**Astro Content Collections + MDX**

- **Collections**:
  - `blog/` - Blog posts with frontmatter validation (Zod schemas)
  - `services/` - Service pages with structured data
- **Schema Validation**: Zod schemas in `src/content/config.ts` ensure type safety
- **Benefits**: Type-safe content, automatic route generation, optimal performance

### Form Handling

**EmailJS (Client-Side Email Delivery)**

- **Contact Form**: `src/components/forms/ContactForm.tsx` handles validation and submission
- **Service**: Uses `src/lib/forms/form-service.ts` which supports EmailJS, Formspree, and Netlify Forms
- **Validation**: Custom validators in `@nosytlabs/shared-utils` package
- **Setup**: Requires EmailJS credentials in Replit Secrets (see SETUP_EMAILJS.md)
- **Recipient**: All contact form submissions go to Hi@nosytlabs.com
- **Rationale**: No backend/server required, works with static hosting, 200 free emails/month
- **Fallback**: Opens mailto link if EmailJS is not configured

### Performance Optimizations

**Service Worker + Asset Caching**

- **Strategy**: Cache-first for fonts/static assets, network-first for navigation/API
- **File**: `public/sw.js` implements versioned caching with automatic cleanup
- **Cache Limits**: Images (300), static (150), fonts (30), dynamic (100)
- **Metrics Achieved**: LCP 323ms, CLS 0.00, TTFB 33ms

### Animation System

**Framer Motion 12.23 + CSS Animations**

- **Approach**: CSS-based animations for performance, Framer Motion for complex interactions
- **Consolidated System**: `src/styles/main.css` defines reusable animation classes
- **GPU Acceleration**: All animations use transform/opacity for 60fps performance
- **Fallback**: `src/lib/animation-fallback.ts` ensures content visibility if animations fail

### SEO & Metadata

**Structured Data + XML Sitemaps**

- **Sitemap Generation**: `/sitemap.xml` and `/sitemap-index.xml` auto-generated
- **Structured Data**: JSON-LD for Organization, WebSite, BlogPosting schemas
- **Meta Tags**: Dynamic OpenGraph and Twitter Card generation
- **robots.txt**: `/robots.txt` configured for search engine crawling

### Routing & Navigation

**File-based Routing**

- **Pages**: `src/pages/` directory maps to URL structure
- **Dynamic Routes**: Blog posts use `[slug].astro` pattern
- **Base URL Handling**: Environment variable support for GitHub Pages deployment

### Type Safety

**TypeScript 5.9 + Astro Type Generation**

- **Config**: Strict mode enabled in `tsconfig.json`
- **Auto-generated Types**: `.astro/types.d.ts` provides content collection types
- **Custom Types**: `src/types/` contains shared interfaces and type definitions

### Monorepo Structure

**Shared Utilities Package**

- **Location**: `packages/shared-utils/`
- **Purpose**: Reusable utilities for validation, sanitization, date formatting, theme management
- **Import**: `@nosytlabs/shared-utils` alias configured in package.json

### Build & Deployment

**Astro Build + Vercel/GitHub Pages**

- **Build Command**: `npm run build` (includes type checking)
- **Output**: `dist/` directory with static HTML/CSS/JS
- **Preview**: `npm run preview` for production build testing
- **Configuration**: `vercel.json` includes security headers and caching rules

## External Dependencies

### Email Service

- **EmailJS** - Contact form email delivery (client-side, no server required)
- **Status**: Code integrated, requires API keys via Replit Secrets (see SETUP_EMAILJS.md)
- **Free Tier**: 200 emails/month
- **Alternative**: Also supports Formspree and Netlify Forms as fallbacks

### CDN & Hosting

- **Vercel** (primary) or **GitHub Pages** - Static hosting with automatic deployments
- **Configuration**: `vercel.json` defines headers, rewrites, and caching policies

### Analytics

- **Not currently configured** - Can be added via Google Analytics or Plausible when needed
- **Implementation**: Would require analytics tracking code and configuration

### Font Delivery

- **Self-hosted Fonts** - Inter variable font in `public/fonts/`
- **Rationale**: Eliminates external requests, improves performance and privacy

### Icon Library

- **Lucide React** - 0.545.0 for consistent, accessible icons
- **Usage**: Imported directly in React components

### Package Manager

- **npm** - Dependency management with package-lock.json for reproducible builds

### Development Tools

- **ESLint 9.14** - Code linting with Astro, React, TypeScript, and accessibility plugins
- **Prettier** (implied) - Code formatting
- **Astro Check** - Type checking for Astro components

### Browser APIs

- **IntersectionObserver** - Scroll animations and lazy loading
- **Service Worker API** - Offline caching and performance optimization
- **localStorage** - Theme preference persistence

### Third-party Integrations

- **Not currently configured** - Can be added as needed for specific functionality
