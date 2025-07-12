# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

### Development
- `npm run dev` - Start development server (port 4321)
- `npm run dev:debug` - Start with verbose logging
- `npm run dev:full` - Optimize resources/CSS then start dev server

### Production Build
- `npm run build` - Standard build
- `npm run build:production` - Full optimized production build with image optimization
- `npm run build:ci` - CI/CD optimized build
- `npm run preview` - Preview production build locally

### Quality Assurance
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run quality:check` - Run lint fix + type check
- `npm run quality:full` - Full quality check including tests and CSS analysis

### Testing
- `npm run test` - Run Vitest tests
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Run tests with UI

### Optimization
- `npm run optimize:css` - Optimize CSS files
- `npm run optimize:resources` - Consolidate resources
- `npm run optimize:critical` - Inline critical CSS
- `npm run analyze:build` - Analyze build output
- `npm run analyze:performance` - Performance analysis

## Architecture Overview

### Framework & Tech Stack
- **Astro 5.8+** - Static site generator with islands architecture
- **React 18** - Component library for interactive elements
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Testing framework
- **Sentry** - Error monitoring and performance tracking
- **Vercel** - Deployment platform with analytics

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── animations/     # Animation components (Astro)
│   ├── common/         # Shared components (Footer, SEO, etc.)
│   ├── content/        # Content-specific components
│   ├── forms/          # Form components
│   ├── interactive/    # Interactive components
│   ├── layout/         # Layout components
│   ├── navigation/     # Navigation system
│   ├── ui/             # UI components (React TSX)
│   └── unified/        # Unified component system
├── config/             # Configuration files
├── layouts/            # Page layouts
├── pages/              # Astro pages (file-based routing)
├── scripts/            # Client-side scripts
├── styles/             # CSS and style files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Component System
- **Astro Components** (`.astro`): Server-side rendered components for static content
- **React Components** (`.tsx`): Client-side interactive components
- **Mixed Architecture**: Astro handles static rendering, React handles interactivity
- **Import Strategy**: Use `src/components/index.ts` for centralized exports

### Configuration Files
- `astro.config.mjs` - Main Astro configuration with Sentry, React, and Tailwind
- `src/config/constants.ts` - Typed constants for company info, colors, timing
- `src/consts.ts` - Legacy constants (prefer constants.ts for new code)
- Path aliases configured: `@/` -> `src/`, `@/components` -> `src/components/`, etc.

### Build Optimization
- **CSS Optimization**: Automated CSS optimization and critical CSS inlining
- **Resource Consolidation**: Script and asset bundling
- **Performance Monitoring**: Built-in Vercel Analytics and Sentry integration
- **Image Optimization**: Automated image processing pipeline
- **Bundle Analysis**: Build size and performance analysis tools

### Development Workflow
1. Use `npm run dev` for standard development
2. Run `npm run quality:check` before committing
3. Use `npm run build:production` for production testing
4. Optimization scripts run automatically in production builds

### Key Integrations
- **Sentry**: Error tracking with DSN configured in astro.config.mjs
- **Vercel Analytics**: Performance monitoring
- **Tailwind**: Custom configuration with disabled preflight
- **TypeScript**: Strict type checking enabled

### Testing Strategy
- **Vitest**: Unit and integration testing
- **Testing Library**: React component testing
- **Coverage**: V8 coverage reports
- **UI Mode**: Visual test runner available

### Performance Considerations
- **Static Generation**: Astro's island architecture minimizes JavaScript
- **Critical CSS**: Inlined for faster initial page load
- **Resource Bundling**: Optimized asset delivery
- **Cache Strategy**: Service worker with multiple cache strategies
- **Image Optimization**: Automated image processing and sizing

## Development Guidelines

### Adding New Components
1. Create component in appropriate `src/components/` subdirectory
2. Add TypeScript types in `src/types/` if needed
3. Export from `src/components/index.ts`
4. Use existing patterns from similar components

### Styling Approach
1. Use Tailwind classes for styling
2. Custom CSS in `src/styles/` when needed
3. Follow existing color scheme from `src/config/constants.ts`
4. Use CSS optimization scripts for production

### Type Safety
1. Import types from `src/types/index.ts`
2. Use constants from `src/config/constants.ts`
3. Maintain strict TypeScript compliance
4. Run `npm run type-check` regularly

### Performance Optimization
1. Use Astro components for static content
2. React components only for interactivity
3. Leverage build optimization scripts
4. Monitor bundle size with analyze commands