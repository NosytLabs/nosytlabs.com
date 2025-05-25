# 🏗️ NosytLabs Architecture Documentation

## 📋 Overview

NosytLabs is a modern web application built with Astro, featuring a unique Windows 95-inspired interface alongside a professional business website. The architecture is designed for performance, scalability, and maintainability.

## 🛠️ Technology Stack

### Core Framework
- **Astro 4.x**: Static site generator with islands architecture
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### Performance Optimizations
- **Critical CSS Inlining**: Above-the-fold optimization
- **Lazy Loading**: Advanced image and component loading
- **Service Worker**: Offline support and caching
- **Bundle Splitting**: Intelligent code chunking
- **Image Optimization**: WebP/AVIF with fallbacks

### UI Components
- **Astro Components**: Server-side rendered components
- **React Islands**: Interactive client-side components
- **Win95 Theme System**: Authentic Windows 95 recreation
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
nosytlabs.com/
├── 📁 src/                        # Source code
│   ├── components/                # Reusable components
│   │   ├── ui/                   # Basic UI components
│   │   ├── layout/               # Layout components
│   │   ├── performance/          # Performance components
│   │   └── win95/                # Windows 95 components
│   ├── layouts/                  # Page layouts
│   ├── pages/                    # Route pages
│   ├── styles/                   # Global styles
│   ├── scripts/                  # Client-side scripts
│   └── utils/                    # Utility functions
├── 📁 public/                     # Static assets
│   ├── images/                   # Optimized images
│   ├── audio/                    # Sound files
│   ├── scripts/                  # Legacy scripts
│   └── styles/                   # Legacy styles
├── 📁 scripts/                    # Build scripts
│   ├── optimization/             # Performance scripts
│   ├── build/                    # Build utilities
│   └── development/              # Dev tools
└── 📁 docs/                       # Documentation
```

## 🎯 Core Features

### 1. Dual Interface System
- **Professional Site**: Modern business website
- **NosytOS95**: Windows 95 recreation with games and apps

### 2. Performance Optimization
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Bundle Optimization**: Intelligent code splitting
- **Image Optimization**: Next-gen formats with fallbacks
- **Caching Strategy**: Multi-tier caching system

### 3. Interactive Elements
- **Duck Hunt Game**: Classic Nintendo game recreation
- **Doom Game**: Browser-based Doom implementation
- **File Explorer**: Functional Windows 95 file system
- **Terminal**: Interactive command-line interface

### 4. Content Management
- **Blog System**: Markdown-based blog with categories
- **Project Showcase**: Portfolio with detailed case studies
- **Service Pages**: Business service descriptions
- **Contact Forms**: Interactive contact and booking

## 🔧 Build System

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Optimization
```bash
npm run optimize:images    # Optimize images
npm run optimize:css       # Optimize CSS
npm run optimize:all       # Run all optimizations
```

### Testing
```bash
npm run test:performance   # Performance testing
npm run lighthouse         # Lighthouse audit
npm run perf:audit        # Full performance audit
```

## 📊 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Bundle Sizes
- **Initial Bundle**: < 150KB (gzipped)
- **Critical CSS**: < 20KB (inlined)
- **Images**: WebP/AVIF with fallbacks

## 🔄 Data Flow

### 1. Static Generation
```
Markdown → Astro → HTML/CSS/JS → CDN
```

### 2. Client Hydration
```
HTML → JavaScript Islands → Interactive Components
```

### 3. Performance Monitoring
```
User Interaction → Web Vitals → Analytics → Optimization
```

## 🛡️ Security

### Content Security Policy
- Strict CSP headers
- XSS protection
- CSRF protection

### Asset Security
- Subresource integrity
- HTTPS enforcement
- Secure headers

## 🚀 Deployment

### Build Process
1. **Asset Optimization**: Images, CSS, JS
2. **Bundle Generation**: Code splitting and minification
3. **Static Generation**: Pre-rendered HTML
4. **Performance Validation**: Lighthouse audits

### Hosting
- **Static Hosting**: Optimized for CDN delivery
- **Service Worker**: Offline functionality
- **Progressive Enhancement**: Works without JavaScript

## 📈 Monitoring

### Performance Metrics
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Bundle size monitoring
- Error tracking

### Analytics
- Google Analytics 4
- Custom performance events
- User interaction tracking
- Conversion funnel analysis

## 🔧 Development Guidelines

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

### Component Architecture
- Single responsibility principle
- Composition over inheritance
- Props validation
- Accessibility first

### Performance Best Practices
- Lazy loading for non-critical resources
- Critical CSS inlining
- Image optimization
- Bundle size monitoring

## 🎨 Design System

### Color Palette
- Primary: NosytLabs brand colors
- Win95: Authentic Windows 95 colors
- Accessibility: WCAG AA compliant

### Typography
- Modern: Inter font family
- Win95: MS Sans Serif recreation
- Responsive scaling

### Components
- Consistent spacing system
- Reusable component library
- Responsive breakpoints
- Dark/light mode support

## 🔮 Future Enhancements

### Planned Features
- PWA capabilities
- Real-time collaboration
- Advanced analytics
- Performance budgets

### Technical Debt
- Legacy script consolidation
- CSS optimization
- Bundle size reduction
- Test coverage improvement
