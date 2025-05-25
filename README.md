# 🌟 NosytLabs Website

> A cutting-edge, performance-optimized website built with Astro, featuring a unique Windows 95-inspired interface alongside a professional business presence.

[![Performance](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-4.x-orange)](https://astro.build/)

## 🚀 Features

### ✨ **Dual Interface System**
- 🏢 **Professional Business Site**: Modern, responsive design with service pages, portfolio, and blog
- 🖥️ **NosytOS95**: Authentic Windows 95 recreation with working file system, games, and applications

### ⚡ **Performance Excellence**
- 🎯 **Core Web Vitals Optimized**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- 📦 **Advanced Bundle Splitting**: Intelligent code chunking (136KB main bundle)
- 🖼️ **Next-Gen Image Optimization**: WebP/AVIF with fallbacks
- 🔄 **Service Worker**: Offline support and multi-tier caching
- 💨 **Critical CSS Inlining**: Instant above-the-fold rendering

### 🎮 **Interactive Entertainment**
- 🦆 **Duck Hunt Game**: Classic Nintendo recreation with authentic sounds
- 👹 **Doom Game**: Browser-based Doom implementation
- 📁 **File Explorer**: Functional Windows 95 file system
- 💻 **Terminal**: Interactive command-line interface
- 🎵 **Media Player**: Authentic Windows Media Player recreation

### 🎨 **Modern Development**
- 🔷 **TypeScript**: 100% type-safe development
- 🎨 **Tailwind CSS**: Utility-first styling with custom Win95 theme
- ♿ **Accessibility First**: WCAG AA compliant with screen reader support
- 🔍 **SEO Optimized**: Structured data, meta optimization, and sitemap

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Astro 4.x with Islands Architecture |
| **Styling** | Tailwind CSS + Custom CSS |
| **Language** | TypeScript (100% coverage) |
| **Build Tool** | Vite with advanced optimizations |
| **Performance** | Service Worker, Critical CSS, Lazy Loading |
| **Images** | Sharp with WebP/AVIF generation |
| **Deployment** | Static hosting with CDN optimization |

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/NosytLabs/nosytlabs.com.git
cd nosytlabs.com

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:4321
```

## 🏗️ Development Commands

### **Core Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

### **Performance Optimization**
```bash
npm run optimize:images    # Optimize images (WebP/AVIF)
npm run optimize:css       # Optimize and purge CSS
npm run optimize:all       # Run all optimizations
npm run build:optimized    # Optimized production build
```

### **Testing & Analysis**
```bash
npm run test:performance   # Comprehensive performance testing
npm run lighthouse         # Lighthouse audit
npm run perf:audit        # Full performance audit pipeline
npm run check-links       # Check for broken links
```

### **Asset Management**
```bash
npm run generate-assets    # Generate optimized assets
npm run fix-css           # Fix CSS issues
npm run build:full        # Full build with link checking
```

## 📊 Performance Metrics

### **Bundle Analysis**
```
📦 Main Client Bundle: 136.75KB (gzipped: 43.98KB)
📦 Win95 Chunk: 40.22KB (lazy loaded)
📦 Blog Chunk: 5.05KB
📦 Admin Chunk: 4.14KB
📦 Vendor Chunk: 3.75KB
📦 Analytics Chunk: 2.09KB
```

### **Core Web Vitals Targets**
- ⚡ **LCP (Largest Contentful Paint)**: < 2.5s
- 🖱️ **FID (First Input Delay)**: < 100ms
- 📐 **CLS (Cumulative Layout Shift)**: < 0.1
- 🎨 **FCP (First Contentful Paint)**: < 1.8s

### **Lighthouse Scores**
- 🚀 **Performance**: 90+
- ♿ **Accessibility**: 95+
- ✅ **Best Practices**: 95+
- 🔍 **SEO**: 95+

## 🎮 NosytOS95 Features

### **Authentic Windows 95 Experience**
- 🖥️ **Desktop Environment**: Pixel-perfect Windows 95 recreation
- 📁 **File Explorer**: Working file system with folders and files
- 🎮 **Games**: Duck Hunt, Doom, Minesweeper, and more
- 💻 **Terminal**: Custom command-line interface
- 🎵 **Media Player**: Authentic Windows Media Player
- 📝 **Notepad**: Text editor with Windows 95 styling
- 🎨 **Paint**: Basic drawing application
- 🧮 **Calculator**: Functional calculator app

### **Interactive Elements**
- 🖱️ **Window Management**: Drag, resize, minimize, maximize
- 📋 **Start Menu**: Authentic Windows 95 start menu
- ⏰ **Taskbar**: Working taskbar with clock and system tray
- 🔊 **Sound System**: Authentic Windows 95 sounds
- 🎯 **Easter Eggs**: Hidden features and surprises

## 🏢 Professional Site Features

### **Business Pages**
- 🏠 **Homepage**: Hero section with animated elements
- 📋 **Services**: Detailed service descriptions
- 💼 **Projects**: Portfolio with case studies
- 📝 **Blog**: Markdown-based blog system
- 📞 **Contact**: Interactive contact forms
- ℹ️ **About**: Company information and team

### **Content Management**
- 📄 **Markdown Support**: Blog posts and content in Markdown
- 🖼️ **Image Optimization**: Automatic WebP/AVIF generation
- 🔍 **SEO Optimization**: Meta tags, structured data, sitemaps
- 📱 **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
nosytlabs.com/
├── 📁 src/                        # Source code
│   ├── components/                # Reusable components
│   │   ├── ui/                   # Basic UI components
│   │   ├── performance/          # Performance components
│   │   └── win95/                # Windows 95 components
│   ├── layouts/                  # Page layouts
│   ├── pages/                    # Route pages
│   ├── styles/                   # Global styles
│   └── utils/                    # Utility functions
├── 📁 public/                     # Static assets
│   ├── images/                   # Optimized images
│   ├── audio/                    # Sound files
│   ├── scripts/                  # Client scripts
│   └── styles/                   # Stylesheets
├── 📁 scripts/                    # Build scripts
│   ├── optimization/             # Performance scripts
│   ├── build/                    # Build utilities
│   └── development/              # Dev tools
├── 📁 docs/                       # Documentation
└── 📁 tests/                      # Test files
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Create .env file
PUBLIC_SITE_URL=https://nosytlabs.com
PUBLIC_GA_ID=your-ga-id
```

### **Build Configuration**
- **Astro Config**: `astro.config.mjs`
- **Tailwind Config**: `tailwind.config.js`
- **TypeScript Config**: `tsconfig.json`
- **Vite Config**: Integrated with Astro

## 🚀 Deployment

### **Build Process**
1. **Asset Optimization**: Images, CSS, JS minification
2. **Bundle Generation**: Code splitting and tree shaking
3. **Static Generation**: Pre-rendered HTML pages
4. **Performance Validation**: Automated Lighthouse audits

### **Hosting Recommendations**
- ✅ **Netlify**: Automatic deployments with edge functions
- ✅ **Vercel**: Zero-config deployments with analytics
- ✅ **Cloudflare Pages**: Global CDN with Workers
- ✅ **GitHub Pages**: Free hosting for open source

## 📈 Monitoring & Analytics

### **Performance Monitoring**
- 📊 **Real User Monitoring**: Core Web Vitals tracking
- 🔍 **Bundle Analysis**: Size monitoring and optimization
- ⚠️ **Error Tracking**: Comprehensive error monitoring
- 📈 **Analytics**: Google Analytics 4 integration

### **Development Tools**
- 🛠️ **Performance Testing**: Automated Lighthouse audits
- 🖼️ **Image Optimization**: Automated WebP/AVIF generation
- 🎨 **CSS Optimization**: Unused CSS removal and minification
- 📦 **Bundle Analysis**: Webpack bundle analyzer

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and performance audits
5. Submit a pull request

### **Code Standards**
- ✅ TypeScript for all new code
- ✅ ESLint and Prettier for code quality
- ✅ Conventional commits
- ✅ Performance budget compliance

## 📄 Documentation

- 📖 [Architecture Guide](docs/ARCHITECTURE.md)
- 🚀 [Performance Guide](docs/PERFORMANCE.md)
- 🎮 [NosytOS95 Guide](docs/NOSYTOS95.md)
- 🛠️ [Development Guide](docs/DEVELOPMENT.md)

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Astro Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Windows 95**: For the nostalgic inspiration
- **Open Source Community**: For the tools and libraries

---

<div align="center">

**🚀 Built with ❤️ by [NosytLabs](https://nosytlabs.com)**

*Combining modern web performance with nostalgic computing experiences*

[![Website](https://img.shields.io/badge/Website-nosytlabs.com-blue)](https://nosytlabs.com)
[![GitHub](https://img.shields.io/badge/GitHub-NosytLabs-black)](https://github.com/NosytLabs)

</div>
