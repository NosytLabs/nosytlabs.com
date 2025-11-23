# NOSYT Labs - Modern Web Development Platform

## Overview
NOSYT Labs is a professional web development and AI integration agency website built with Astro, React, and HeroUI. It showcases 11 professional services including web development, mobile apps, and various AI integrations. The platform prioritizes speed, accessibility, and modern design, featuring a component-based architecture, comprehensive legal pages, a blog system with 23 professionally written posts on AI tools and development, and a professional contact form integrated with Email.js. The project aims to provide a high-performance, maintainable, visually appealing, and SEO-optimized online presence for the agency, with a strong focus on Generative Engine Optimization (GEO) for AI-powered search.

## User Preferences
Preferred communication style: Simple, everyday language. Focus on professional yet approachable tone. Prefer fast, efficient execution with parallel operations.

## Recent Changes (Latest Session)
- **Blog Optimization**: Removed reading time from all 23 blog posts for cleaner presentation
- **SEO Backlink Enhancement**: Added internal links to 40+ apps/tools mentioned across 9 key blog posts (Zapier, ChatGPT, Claude, Airtable, WordPress, Mailchimp, etc.)
- **Blog Header Polish**: Improved header styling with better tag display and removed reading time icon
- **Code Cleanup**: Removed readingTime references from BlogSearch component sort options
- **Blog Content**: All posts now have table of contents, compelling introductions, proper conclusions, and professional CTAs

## System Architecture

### UI/UX Decisions
- **Framework**: Astro for Static Site Generation with islands architecture.
- **UI Component Library**: HeroUI for a modern, accessible, and consistent design system.
- **Styling**: Tailwind CSS + Custom CSS, utility-first with extensive CSS variables.
- **Animation**: Framer Motion + CSS Animations with an `AnimationFallback` system.
- **Accessibility**: WCAG Compliance with semantic HTML, ARIA, keyboard navigation, and color contrast.
- **Professional Theme**: Modern, cohesive design across all pages, with a focus on authentic, expert positioning.

### Technical Implementations
- **Content Management**: Astro Content Collections with Zod validation for type-safe content.
- **Blog System**: Supports MDX, rich metadata, client-side search/filtering, and includes 23 professionally written, SEO-optimized posts with internal app links.
- **Blog Features**: 
  - Table of Contents for better readability
  - Professional introductions with hooks
  - Proper conclusion sections with key takeaways
  - Internal links to 40+ tools/apps for SEO/backlinks
  - Related posts functionality
  - Social sharing integration
  - Reading progress bar
  - Tag-based filtering and sorting
- **Services System**: Features 13 structured services with market-researched 2025 pricing.
- **Routing**: Static and dynamic routes (`/blog/[slug]`, `/services/[slug]`) with pagination.
- **Form Handling**: HeroUI components with real-time validation, character counters, and EmailJS integration.
- **Performance Optimization**: Advanced Service Worker caching, WebP image optimization, lazy loading, and code splitting.
- **Type Safety**: Strict TypeScript configuration with custom types.
- **Code Organization**: Monorepo structure with `/packages/shared-utils`, functional component organization, and `/src/lib` for utilities.
- **Security**: Middleware for HTTP security headers and input sanitization via DOMPurify.
- **SEO & GEO**: Comprehensive SEO strategy including sitemap, robots.txt, structured data (Organization, Service, FAQ, LocalBusiness, BreadcrumbList, AggregateRating schema), E-E-A-T signals, conversational language optimization for AI search, internal linking for backlinks, and a robust backlink strategy.

### Feature Specifications
- **Blog**: 23 professionally written posts, 2,500+ words each, with:
  - Professional layout with reading progress bar
  - Table of Contents for longer posts
  - Internal links to 40+ mentioned tools/apps
  - Related posts functionality
  - Social sharing options
  - NO reading time display (removed for cleaner UX)
- **Services**: 13 professionally priced services, including AI Agents & Custom Automation and AI Chatbot Development.
- **Contact Form**: Integrated with EmailJS for serverless email delivery, 24-hour response promise.
- **Footer**: Comprehensive with domain, service links, company links, legal links, contact info, and social media integration.
- **Quality of Life**: Back-to-top button, newsletter CTA, enhanced navigation, and consistent user experience.

## External Dependencies

### Third-Party Services
- **EmailJS**: For client-side contact form email delivery.
- **Google Analytics**: For website analytics.
- **Spotify**: For embedding content.
- **Social Media Platforms**: For sharing and embedded content (Twitter, LinkedIn, GitHub).

### CDN & External Resources
- **Google Fonts**: Inter font family.
- **Icons**: Lucide React for UI icons and custom SVG icons, managed by `astro-icon`.
- **App Links**: Internal links to 40+ external tools and services for SEO/backlinks:
  - Automation: Zapier, Make, IFTTT
  - No-Code: Airtable, Bubble, FlutterFlow, Webflow
  - Project Management: Monday, Asana, Pipedrive
  - CRM: HubSpot
  - Website Builders: WordPress.com, Wix, Squarespace, Shopify
  - Email Marketing: Mailchimp, Brevo, MailerLite, Substack
  - AI: ChatGPT, Claude, Gemini
  - Design: Figma
  - Infrastructure: Vercel, Netlify, Firebase

### Build Tools & Development
- **Vite**: Build tool and dev server.
- **PostCSS**: For CSS processing.
- **ESLint & Prettier**: For code quality and formatting.

### NPM Packages (Key Dependencies)
- `@heroui/react`, `tailwindcss`, `class-variance-authority`, `tailwind-merge` (UI & Styling)
- `react`, `react-dom`, `@radix-ui/react-select`, `@radix-ui/react-toast`, `framer-motion` (React Ecosystem)
- `@astrojs/mdx`, `astro-icon` (Content & Markdown)
- `zod`, `dompurify`, `jsdom` (Validation & Sanitization)
- `@emailjs/browser` (Email Integration)

### Deployment & Hosting
- **Netlify**: Implied for form handling and static site hosting.

### Environment Variables
- `PUBLIC_SITE_URL`, `PUBLIC_BASE_URL`
- `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_PUBLIC_KEY`
