# NOSYT Labs

> Notable Opportunities Shape Your Tomorrow

Professional website built with Astro, React, and HeroUI. Fast, accessible, and production-ready.

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

## 📊 Build Status

```
✅ Build: SUCCESS (31.96s)
✅ Pages: 21
✅ Errors: 0
✅ Bundle: 43.22 kB (gzipped)
```

## 🛠️ Tech Stack

- **Astro** 5.14.7 - Static site framework
- **React** 18.3.1 - UI components
- **HeroUI** 2.8.5 - Component library
- **Tailwind CSS** 3.4.14 - Styling
- **TypeScript** 5.6.3 - Type safety
- **Framer Motion** 12.23.24 - Animations

## 📁 Structure

```
src/
├── components/
│   ├── ui/          # HeroUI components
│   ├── content/     # Content sections
│   ├── layout/      # Layout components
│   └── providers/   # React providers
├── content/
│   ├── blog/        # Blog posts (Markdown)
│   └── services/    # Services (Markdown)
├── pages/           # Routes
├── styles/          # Global CSS
└── lib/             # Utilities
```

## 🎨 Design System

### Colors
- **Primary**: #232965 (Navy)
- **Secondary**: #2F82FF (Blue)
- **Accent**: #29FFAB (Teal)

### Components
All UI uses HeroUI for consistency:
- Buttons: `HeroUIButtonAstro`
- Cards: `HeroUICard`, `HeroUIServiceCard`
- Forms: HeroUI inputs
- Layout: Responsive containers

## 📝 Content Management

### Add Blog Post
Create `src/content/blog/post-name.md`:
```markdown
---
title: "Post Title"
description: "Description"
pubDate: 2025-01-01
heroImage: "/images/blog/image.jpg"
tags: ["tag1", "tag2"]
---

Content here...
```

### Add Service
Create `src/content/services/service-name.md`:
```markdown
---
title: "Service Name"
description: "Description"
price: "Starting from $X,XXX"
icon: "icon-name"
features:
  - "Feature 1"
  - "Feature 2"
---

Details here...
```

## 🚢 Deployment

### Build
```bash
npm run build
```

### Deploy
Upload `dist/` folder to:
- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- Any static host

### Environment Variables
```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## ⚡ Performance

- **Build Time**: 31.96s
- **Main Bundle**: 43.22 kB (gzipped)
- **Pages**: 21 static pages
- **Compression**: gzip + brotli + zstd

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Reduced motion support

## 🔍 SEO

- ✅ Meta tags
- ✅ Open Graph
- ✅ Structured data (JSON-LD)
- ✅ Sitemap
- ✅ Robots.txt

## 📄 License

MIT License

## 🤝 Contact

Email: hello@nosytlabs.com

---

Built with ❤️ by NOSYT Labs
