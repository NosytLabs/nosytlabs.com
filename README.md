# NosytLabs Website

Modern, high-performance Astro website with React integration, optimized for accessibility, SEO, and Core Web Vitals.

[![Astro](https://img.shields.io/badge/Astro-5.14-FF5D01?logo=astro)](https://astro.build)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance

- **LCP:** 323ms (< 2.5s target)
- **CLS:** 0.00 (< 0.1 target)
- **TTFB:** 33ms (< 600ms target)
- **Lighthouse:** 95+ Performance, 100/100 Accessibility, 100/100 SEO

## 🏗️ Tech Stack

- **Framework:** Astro 5.14.7 (Static Site Generation)
- **UI Library:** React 18.3.1 with TypeScript
- **Styling:** Tailwind CSS 3.4.14 + HeroUI 2.8.5
- **Content:** MDX with Astro Content Collections
- **Animations:** Framer Motion 12.23.24
- **Icons:** Lucide React
- **Forms:** EmailJS integration

## 📁 Project Structure

```
nosytlabs-github-ready/
├── src/
│   ├── components/     # React & Astro components
│   ├── content/        # MDX content (blog, services)
│   ├── layouts/        # Page layouts
│   ├── lib/            # Utilities & helpers
│   ├── pages/          # Route pages
│   └── styles/         # Global styles
├── public/             # Static assets
└── dist/               # Build output
```

## 🎨 Features

- ✅ Static Site Generation (SSG)
- ✅ MDX Content Collections
- ✅ Progressive Web App (PWA)
- ✅ Advanced compression (Brotli, Gzip, Zstd)
- ✅ Optimized images
- ✅ SEO optimized
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Dark mode support
- ✅ Responsive design

## 🔧 Development

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Type checking
npm run type-check
```

## 📦 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Vercel
```bash
npm run build
# Deploy dist/ folder
```

### GitHub Pages
Automated via GitHub Actions workflow in `.github/workflows/deploy.yml`

## 🎯 Content Schema

### Blog Posts
- Required: title, description, pubDate, author, tags
- Optional: category, seoKeywords, excerpt, draft, featured, updatedDate, readingTime, heroImage

### Services
- Required: title, description, icon
- Optional: image, price, delivery, popular, benefits, features, category, tags

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# EmailJS Configuration
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ by NosytLabs**
