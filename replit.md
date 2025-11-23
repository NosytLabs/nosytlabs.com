# NOSYT Labs - Modern Web Development Platform

## Overview
NOSYT Labs is a professional web development and AI integration agency website built with Astro, React, and HeroUI. It showcases 11 professional services including web development, mobile apps, and various AI integrations. The platform prioritizes speed, accessibility, and modern design, featuring a component-based architecture, comprehensive legal pages, a blog system with 13 posts on 2025 AI tools, and a professional contact form integrated with Email.js. The project aims to provide a high-performance, maintainable, and visually appealing online presence for the agency.

## User Preferences
Preferred communication style: Simple, everyday language. Focus on professional yet approachable tone.

## System Architecture

### Frontend Architecture
- **Framework**: Astro 5.14.8 for Static Site Generation, leveraging islands architecture for optimal performance.
- **UI Component Library**: HeroUI 2.8.5 for a modern, accessible, and consistent design system.
- **Styling**: Tailwind CSS 3.4.14 + Custom CSS, employing a utility-first approach with extensive CSS variables.
- **State Management**: React hooks (useState, useEffect) for local component state.
- **Animation**: Framer Motion 12.23.24 + CSS Animations with an `AnimationFallback` system.

### Content Management
- **Content Collections**: Astro Content Collections with Zod validation for type-safe `blog` and `services` content.
- **Blog System**: Supports MDX, rich metadata, client-side search/filtering, and includes 13 posts on AI and development.
- **Services System**: Features 11 structured services, including new AI Agents & Custom Automation and AI Chatbot Development.

### Routing & Pages
- **Static Routes**: All core pages (Homepage, About, Services, Contact, Legal) are pre-rendered.
- **Dynamic Routes**: `/blog/[slug]` and `/services/[slug]` for individual entries, with pagination support.
- **SEO Optimization**: Includes sitemap generation, robots.txt, structured data, and comprehensive meta tags.

### Form Handling
- **Contact Form**: Utilizes HeroUI components with custom real-time validation, character counters, and EmailJS integration for serverless email delivery. Accessibility features are a priority.

### Performance Optimization
- **Service Worker**: Advanced caching strategies for static assets, fonts, images, and dynamic content.
- **Image Optimization**: WebP format, lazy loading, and responsive images with srcset.
- **Code Splitting**: Automatic via Astro and Vite, with React components loaded as islands.

### Accessibility
- **WCAG Compliance**: Semantic HTML, ARIA attributes, keyboard navigation, focus management, skip links, and alt text.
- **Forms**: Proper label associations, error announcements, and minimum touch target sizes.
- **Color Contrast**: Design system ensures WCAG AA compliance.

### Type Safety
- **TypeScript Configuration**: Strict mode enabled with custom types for content, components, and utilities.

### Code Organization
- **Monorepo Structure**: `/packages/shared-utils` for common TypeScript utilities.
- **Component Structure**: Organized by function (UI, layout, content, forms, blog, providers).
- **Library Organization**: `/src/lib` for core and feature-specific utilities.

### Security
- **Security Headers**: Middleware for HTTP security headers (CSP, X-Frame-Options, HSTS, etc.).
- **Form Security**: Input sanitization via DOMPurify and email validation.

## External Dependencies

### Third-Party Services
- **EmailJS**: For client-side contact form email delivery.
- **Google Analytics**: For website analytics and user behavior tracking.
- **Spotify**: For embedding playlists/artists.
- **Social Media Platforms**: For sharing and embedded content.

### CDN & External Resources
- **Google Fonts**: Inter font family, cached by service worker.
- **Icons**: Lucide React for UI icons and custom SVG icons, managed by `astro-icon`.

### Build Tools & Development
- **Vite**: Build tool and dev server integrated via Astro.
- **PostCSS**: For CSS processing, including Tailwind and autoprefixer.
- **ESLint & Prettier**: For code quality and formatting.

### NPM Packages (Key Dependencies)
- **UI & Styling**: `@heroui/react`, `tailwindcss`, `class-variance-authority`, `tailwind-merge`.
- **React Ecosystem**: `react`, `react-dom`, `@radix-ui/react-select`, `@radix-ui/react-toast`, `framer-motion`.
- **Content & Markdown**: `@astrojs/mdx`, `astro-icon`.
- **Validation & Sanitization**: `zod`, `dompurify`, `jsdom`.
- **Email Integration**: `@emailjs/browser`.

### Deployment & Hosting
- **Netlify**: Implied for form handling and static site hosting.

### Environment Variables
- `PUBLIC_SITE_URL`, `PUBLIC_BASE_URL`.
- EmailJS credentials: `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_PUBLIC_KEY`.
## SEO & Search Optimization Strategy (2025)

### Current SEO Status
- ✅ 0 build errors, 0 warnings
- ✅ All 11 service pages optimized with keywords
- ✅ 13 blog posts for organic visibility
- ✅ Schema markup utilities created
- ✅ GEO (Generative Engine Optimization) content structure
- ✅ Local SEO checklist implemented

### Backlink Strategy
**30-Day Plan:**
- Week 1: Submit to 10+ free high-DA sites (WordPress, Medium, LinkedIn, GitHub, Yelp)
- Week 2: Pitch 3 guest posts to Dev.to, Hashnode, industry blogs
- Week 3: Respond to 3+ HARO/Featured journalist queries
- Week 4: Build partnerships with 3 complementary services

**Expected Results:**
- Month 1: 15-25 backlinks, +5-10% organic traffic
- Month 3: 40-50 backlinks, 25-30 Domain Authority
- Month 6: 50-75+ backlinks, top 10 for 5+ keywords

### GEO (Generative Engine Optimization)
Optimizing for AI-powered search (ChatGPT, Gemini, Perplexity):
- E-E-A-T signals (expertise, authority, trust)
- Conversational language and FAQ optimization
- Citation-worthy original data and statistics
- Schema markup for AI parsing
- Third-party mentions and authority

### Service Keyword Strategy
- **Web Development**: "custom website design", "web development agency", 2025 pricing keywords
- **AI Agents**: "business automation", "autonomous agents", ROI keywords
- **AI Chatbots**: "customer support chatbot", "AI customer service 24/7"
- **AI Integration**: "ChatGPT integration", "Claude API", "workflow automation"
- All services: Include brand name in search intent

### Free High-DA Backlink Sites
Web 2.0: WordPress.com (94), Medium (92), LinkedIn (98), GitHub (94), Behance (92)
Directories: Google Business, Yelp (93), YellowPages (85), Manta (75)
Q&A: Quora (90), StackExchange (93)
Social: Reddit (91), Pinterest (90)

### Tools in Use
- Google Search Console (free, track rankings/backlinks)
- Ahrefs Backlink Checker (100 free checks/day)
- Google Keyword Planner (free keyword research)
- Schema.org validator (free schema validation)

### Files Created
- SEO_BACKLINK_STRATEGY.md - Strategic implementation guide
- NOSYT_LABS_COMPREHENSIVE_SEO_GUIDE.md - Complete SEO manual (14K words)
- src/lib/seo/schema-markup.ts - Schema generation utilities
- src/lib/seo/seo-keywords.ts - Keyword database and checklists

### Next Steps (Priority Order)
1. Google Business Profile - Complete and optimize (1 hour)
2. Submit to free sites - WordPress, Medium, LinkedIn, GitHub (2 hours)
3. Update all FAQ sections - Add schema markup (3 hours)
4. Pitch guest posts - Dev.to, Hashnode, industry blogs (5 hours)
5. Monitor Google Search Console - Track rankings weekly
