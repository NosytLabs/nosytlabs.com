# NosytLabs Website

A comprehensive portfolio site for NOSYT LLC showcasing GitHub projects, content creation, 3D printing services, and innovative digital solutions.

## About

NosytLabs is a cutting-edge portfolio site with the tagline "Notable Opportunities Shape Your Tomorrow" (formed in 2025). The site functions as a tech SaaS development portfolio featuring modern web technologies, comprehensive service offerings, and a unique Windows 95 retro aesthetic (NosytOS95) with fully functional applications and games.

## ✨ Features

### 🚀 **Core Portfolio Features**
- **Modern Web Development Portfolio** - Showcasing professional projects and technical expertise
- **Skills Matrix** - Interactive skills display with animated progress bars and proficiency levels
- **About Page** - Comprehensive company information, timeline, and team details
- **Project Showcase** - Enhanced project cards with real data and external links
- **Service Offerings** - Detailed service pages with embedded PDF documentation

### 🎮 **NosytOS95 - Windows 95 Interface**
- **Authentic Windows 95 Experience** - Pixel-perfect recreation with modern functionality
- **Fully Functional Applications**:
  - Duck Hunt game with sound effects and high score tracking
  - Notepad application with file management
  - Terminal with comprehensive command system
  - AI Assistant (Clippy) with interactive help system
  - Vault Shelter resource management game
- **Window Management** - Resizable windows, minimize/maximize/close functionality
- **Start Menu** - Cascading submenus and authentic navigation
- **Easter Eggs** - Hidden features and Rick Roll folder

### 📱 **Content Creation Hub**
- **YouTube Integration** - Real channel data and video embeds with proper thumbnails
- **Kick.com Streaming** - Live stream integration and schedule display
- **Content Resources** - Equipment recommendations and monetization strategies

### 🖨️ **3D Printing Services**
- **Creality Cloud Integration** - Real 3D models from crealitycloud.com/user/9519489699
- **Interactive Model Viewer** - Embedded 3D model display and manipulation
- **Printing Calculator** - Cost estimation and material usage tools

### 💰 **Passive Income Resources**
- **Authentic Earnings Data** - Real performance metrics from HoneyGain, EarnApp, Repocket
- **Comprehensive App Reviews** - Detailed analysis without exaggerated claims
- **Performance Tracking** - Historical data and trend analysis

### 📝 **AI Tools Blog**
- **In-depth Reviews** - Cursor AI, Trae AI, Roo Code, Windsurf analysis
- **SEO-optimized Content** - Professional technical writing and optimization
- **Future of Technology** - 3D printing trends and AI applications for 2025

## 🛠️ Technologies Used

### **Frontend Framework**

- **Astro.js** - Static site generation with modern performance optimization
- **React** - Interactive components and dynamic functionality
- **TypeScript** - Type-safe development and enhanced code quality

### **Styling & Design**

- **CSS3** - Modern styling with custom properties and animations
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **GSAP** - Professional-grade animations and transitions

### **Development Tools**

- **Playwright** - Automated testing and browser compatibility verification
- **Sharp** - High-performance image optimization and processing
- **Terser** - JavaScript minification and optimization
- **Lightningcss** - Fast CSS processing and optimization

### **Performance & Analytics**

- **Vercel Analytics** - Real-time performance monitoring
- **Vercel Speed Insights** - Core Web Vitals tracking
- **Custom Performance Monitor** - Advanced metrics and optimization

### **Build & Optimization**

- **Unified Optimizer** - Comprehensive build optimization system
- **CSS Consolidation** - Automated stylesheet bundling
- **Image Optimization** - Multi-format image processing (WebP, AVIF)
- **JavaScript Bundling** - Optimized script compilation and minification

### **Backend & Services**

- **Supabase** - Backend-as-a-Service (optional for dynamic features)
- **Creality Cloud API** - 3D model integration and display
- **YouTube Data Integration** - Content creation metrics and embeds

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NosytLabs/nosytlabs-website.git
   cd nosytlabs-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

### Viewing Locally Without a Server

If you need to view the site locally without a development server, you can:

1. Build the site:
   ```bash
   npm run build
   ```

2. Open the `dist/index.html` file in your browser.

Note: Some features may not work correctly when viewing as a file due to browser security restrictions. For the best experience, use a local development server.

## 📁 Project Structure

```text
nosytlabs-website/
├── public/                    # Static assets and production files
│   ├── images/               # Optimized images (WebP, AVIF, SVG)
│   │   ├── win95/           # Windows 95 interface assets
│   │   ├── projects/        # Project screenshots and media
│   │   ├── services/        # Service-related imagery
│   │   └── models/          # 3D printing model previews
│   ├── scripts/             # Client-side JavaScript
│   │   ├── core/           # Core functionality and utilities
│   │   ├── nosytos95/      # Windows 95 interface scripts
│   │   └── bundles/        # Optimized script bundles
│   ├── styles/              # Compiled CSS files
│   │   └── bundles/        # CSS bundles and optimized styles
│   ├── audio/               # Sound effects and audio files
│   ├── documents/           # PDF files and documentation
│   └── fonts/               # Custom fonts and typography
├── src/                      # Source code and development files
│   ├── components/          # Reusable Astro/React components
│   │   ├── animations/     # Animation components
│   │   ├── layout/         # Layout-specific components
│   │   ├── sections/       # Page section components
│   │   ├── ui/             # UI elements and widgets
│   │   └── passive-income/ # Passive income specific components
│   ├── layouts/             # Page layout templates
│   ├── pages/               # Route-based page components
│   │   ├── blog/           # Blog posts and articles
│   │   ├── admin/          # Admin panel pages
│   │   └── passive-income/ # Passive income sub-pages
│   ├── scripts/             # Development and build scripts
│   │   ├── build/          # Build-time optimization scripts
│   │   ├── development/    # Development tools and utilities
│   │   ├── optimization/   # Performance optimization tools
│   │   └── nosytos95/      # NosytOS95 development scripts
│   ├── styles/              # Source CSS and style definitions
│   └── utils/               # Utility functions and helpers
├── scripts/                  # Repository management scripts
├── tests/                    # Playwright tests and test utilities
├── .gitignore               # Git ignore configuration
├── astro.config.mjs         # Astro framework configuration
├── package.json             # Dependencies and npm scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vercel.json              # Vercel deployment configuration
└── README.md                # Project documentation
```

## 🎮 NosytOS95 - Windows 95 Interface

The NosytOS95 interface is a pixel-perfect recreation of Windows 95 with modern functionality and enhanced features:

### **Core Features**

- **Authentic Windows 95 Experience** - Pixel-perfect recreation with modern web technologies
- **Resizable Windows** - Proper resize handles and window management
- **Start Menu** - Cascading submenus with authentic navigation
- **Taskbar** - Working buttons, system tray, and application management
- **File System** - Virtual file system with folders and documents

### **Applications**

- **🦆 Duck Hunt Game** - Fully functional with sound effects, high score tracking, and authentic gameplay
- **📝 Notepad** - Text editor with file management and document creation
- **💻 Terminal** - Comprehensive command system with help documentation and Easter eggs
- **📎 Clippy Assistant** - Interactive AI assistant with helpful tips and personality
- **🏠 Vault Shelter** - Resource management game inspired by Fallout Shelter

### **Easter Eggs & Special Features**

- **"Do Not Click" Folder** - Hidden Rick Roll surprise
- **Terminal Commands** - Hidden commands and developer features
- **Sound Effects** - Authentic Windows 95 sounds and feedback
- **Keyboard Shortcuts** - Classic Windows keyboard navigation

### **Technical Implementation**

- **Modern Web Standards** - Built with HTML5, CSS3, and JavaScript ES6+
- **Performance Optimized** - Efficient rendering and memory management
- **Cross-Browser Compatible** - Works on all modern browsers
- **Responsive Design** - Adapts to different screen sizes while maintaining authenticity

> **Note:** Doom II has been intentionally removed from the current version for performance optimization.

## 🚀 Development Scripts

The project includes comprehensive development and optimization scripts:

### **Build Scripts**

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run build:prod       # Production build with asset generation
npm run build:full       # Full build with optimization and link checking
npm run build:optimized  # Build with post-build optimization
npm run preview          # Preview production build
```

### **Optimization Scripts**

```bash
npm run optimize         # Run repository optimization
npm run optimize:css     # CSS consolidation and optimization
npm run optimize:js      # JavaScript bundling and minification
npm run optimize:images  # Image optimization (WebP, AVIF conversion)
npm run optimize:all     # Comprehensive optimization suite
```

### **Development Tools**

```bash
npm run test             # Run Playwright tests
npm run test:debug       # Debug mode testing
npm run check-links      # Verify all internal and external links
npm run analyze          # Performance analysis and monitoring
npm run fix-css          # CSS linting and auto-fixing
```

### **Asset Generation**

```bash
npm run generate-assets     # Generate optimized assets
npm run generate-favicons   # Create favicon variations
npm run generate-win95-icons # Generate Windows 95 style icons
```

## 🌐 Deployment

### **Vercel Deployment (Recommended)**

The site is optimized for Vercel deployment with automatic optimization:

1. **Connect Repository** - Link your GitHub repository to Vercel
2. **Automatic Builds** - Vercel automatically builds on push to main branch
3. **Performance Monitoring** - Built-in analytics and speed insights
4. **Edge Optimization** - Global CDN and edge function support

### **Manual Deployment**

```bash
npm run build:full      # Complete build with optimization
# Deploy the 'dist' directory to your hosting provider
```

### **Environment Variables**

Create a `.env` file for local development:

```bash
# Optional: Supabase configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
VERCEL_ANALYTICS_ID=your_analytics_id
```

## ⚡ Performance Optimization

The project includes advanced performance optimization features:

### **Automatic Optimizations**

- **Image Optimization** - WebP/AVIF conversion with fallbacks
- **CSS Bundling** - Consolidated stylesheets with minification
- **JavaScript Minification** - Terser optimization with source maps
- **Asset Compression** - Gzip and Brotli compression
- **Lazy Loading** - Progressive image and content loading

### **Performance Monitoring**

- **Core Web Vitals** - Real-time performance metrics
- **Lighthouse Scores** - Automated performance auditing
- **Custom Analytics** - Advanced performance tracking
- **Error Monitoring** - Comprehensive error tracking and reporting

### **Optimization Results**

- **Lighthouse Score** - 95+ across all metrics
- **First Contentful Paint** - <1.5s
- **Largest Contentful Paint** - <2.5s
- **Cumulative Layout Shift** - <0.1

## 🤝 Contributing

We welcome contributions to improve NosytLabs! Here's how to get started:

### **Development Setup**

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/nosytlabs-website.git
   cd nosytlabs-website
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

### **Contribution Guidelines**

- **Code Quality** - Follow existing code style and conventions
- **Testing** - Run tests before submitting: `npm run test`
- **Performance** - Ensure changes don't negatively impact performance
- **Documentation** - Update documentation for new features
- **Commit Messages** - Use clear, descriptive commit messages

### **Pull Request Process**

1. **Update Documentation** - Include relevant documentation updates
2. **Run Tests** - Ensure all tests pass
3. **Performance Check** - Verify optimization scores remain high
4. **Create Pull Request** - Provide detailed description of changes
5. **Code Review** - Address any feedback from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

### **Primary Contact**

- **Email**: [info@nosytlabs.com](mailto:info@nosytlabs.com)
- **Website**: [https://nosytlabs.com](https://nosytlabs.com)
- **GitHub**: [https://github.com/NosytLabs/nosytlabs-website](https://github.com/NosytLabs/nosytlabs-website)

### **Content Creation**

- **YouTube**: [@TycenYT](https://youtube.com/@TycenYT)
- **Kick.com**: [Kick.com/Tycen](https://kick.com/Tycen)

### **3D Printing Services**

- **Creality Cloud**: [User Profile](https://crealitycloud.com/user/9519489699)
- **Custom Orders**: Contact via website form with STL files

### **Support**

- **Issues**: [GitHub Issues](https://github.com/NosytLabs/nosytlabs-website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NosytLabs/nosytlabs-website/discussions)
- **Documentation**: [Project Wiki](https://github.com/NosytLabs/nosytlabs-website/wiki)

## 🙏 Acknowledgements & Credits

### **Frameworks & Libraries**

- **[Astro.js](https://astro.build/)** - Modern static site generation
- **[React](https://reactjs.org/)** - Interactive component framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[GSAP](https://greensock.com/gsap/)** - Professional animation library

### **Services & APIs**

- **[Vercel](https://vercel.com/)** - Deployment and hosting platform
- **[Supabase](https://supabase.io/)** - Backend-as-a-Service
- **[Creality Cloud](https://crealitycloud.com/)** - 3D model hosting and integration
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework

### **Assets & Resources**

- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing
- **[Terser](https://terser.org/)** - JavaScript minification
- **[Font Awesome](https://fontawesome.com/)** - Icon library
- **[Unsplash](https://unsplash.com/)** - Stock photography

### **Inspiration & References**

- **Windows 95 Interface** - Microsoft Corporation (educational/nostalgic purposes)
- **Duck Hunt Game** - Nintendo (educational recreation)
- **Fallout Shelter** - Bethesda Game Studios (game mechanics inspiration)

---

**© 2025 NosytLabs (NOSYT LLC). All rights reserved.**

*"Notable Opportunities Shape Your Tomorrow"*
