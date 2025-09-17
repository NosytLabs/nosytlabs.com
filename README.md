# Nosyt Labs Website

Professional web development and AI integration services for modern businesses.

## Overview

This repository contains the source code for the Nosyt Labs website, showcasing our services, projects, and expertise in cutting-edge technology solutions. The website has been professionally audited and refined to meet production standards with a focus on accessibility, performance, and design consistency.

## Features

- Modern, responsive design built with Astro and React
- Comprehensive service offerings including AI integration, web development, and mobile applications
- Performance-optimized with lazy loading and efficient asset delivery
- Accessibility-compliant with WCAG 2.1 AA standards
- SEO-optimized for better search engine visibility
- Design system implementation with consistent spacing, typography, and color palette
- Semantic HTML structure for improved accessibility and SEO
- Comprehensive test suite with Vitest for quality assurance

## Technologies Used

- [Astro](https://astro.build/) - Static site generator
- [React](https://reactjs.org/) - UI library for interactive components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vitest](https://vitest.dev/) - Testing framework
- Custom Design System - Consistent spacing, typography, and color palette
- Accessibility Tools - axe-core, @axe-core/puppeteer for accessibility auditing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nosytlabs/nosytlabs-website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nosytlabs-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Building for Production

Generate a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page routes
│   ├── styles/          # Global styles and design tokens
│   └── content/         # Markdown content
├── tests/               # Unit and integration tests
└── config/              # Configuration files
```

## Design System

The website implements a comprehensive design system with:

- Consistent spacing using multiples of 4 or 8px
- Unified color palette with proper contrast ratios
- Typography hierarchy with responsive font sizes
- Component library with reusable UI elements
- Accessibility features including semantic HTML and ARIA attributes

## Accessibility

The website has been audited for accessibility compliance:

- WCAG 2.1 AA standards adherence
- Proper color contrast ratios throughout the site
- Semantic HTML structure with appropriate heading hierarchy
- ARIA attributes for enhanced screen reader support
- Keyboard navigation support

## Testing

Run all tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

The site is configured for deployment on Vercel, Netlify, or similar static hosting platforms.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is proprietary and confidential. All rights reserved by Nosyt Labs.

## Contact

- Website: [nosytlabs.com](https://nosytlabs.com)
- Twitter: [@nosytlabs](https://twitter.com/nosytlabs)
- GitHub: [@nosytlabs](https://github.com/nosytlabs)
- Email: hi@nosytlabs.com