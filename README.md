# NosytLabs Website

A portfolio site for NOSYT LLC showcasing GitHub projects, content creation, and 3D printing services.

## About

NosytLabs is a portfolio site with the tagline "Notable Opportunities Shape Your Tomorrow" (formed in 2025). The site functions as a tech SaaS development portfolio with a Windows 95 retro aesthetic (NosytOS95) featuring centered windows, Clippy assistant, and working applications including Doom II and Duck Hunt.

## Features

- Modern web development portfolio
- Content creation resources for Kick.com and YouTube
- 3D printing services showcase with embedded Creality 3D models
- Passive income resources with authentic earnings data
- Windows 95-inspired interface (NosytOS95)
- Blog with AI application reviews (Cursor AI, Trae AI, Roo Code, Windsurf)
- Responsive design for all devices
- SEO-optimized content and website/services audit page

## Technologies Used

- Astro.js for static site generation
- React for interactive components
- CSS for styling
- JavaScript for interactivity
- GSAP for animations
- Supabase for backend (optional)

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

## Project Structure

```
nosytlabs-website/
├── public/            # Static assets
│   ├── images/        # Images
│   ├── scripts/       # JavaScript files
│   └── styles/        # CSS files
├── src/               # Source code
│   ├── components/    # Reusable components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   └── styles/        # Global styles
├── .gitignore         # Git ignore file
├── astro.config.mjs   # Astro configuration
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Windows 95 Interface (NosytOS95)

The NosytOS95 interface includes:

- Resizable windows with proper resize handles
- Working applications:
  - Duck Hunt game (fully functional with sound effects)
  - Notepad application
  - Terminal with commands
  - AI Assistant (Coming Soon - Q3 2025)
- Start menu with cascading submenus
- Taskbar with working buttons
- Clippy assistant with helpful tips
- Window management (minimize, maximize, close)

> Note: Doom II has been intentionally removed from the current version.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

NosytLabs - [info@nosytlabs.com](mailto:info@nosytlabs.com)

Project Link: [https://github.com/NosytLabs/nosytlabs-website](https://github.com/NosytLabs/nosytlabs-website)

## Acknowledgements

- [Astro.js](https://astro.build/)
- [React](https://reactjs.org/)
- [GSAP](https://greensock.com/gsap/)
- [Supabase](https://supabase.io/)
- [Font Awesome](https://fontawesome.com/)
- [Unsplash](https://unsplash.com/)
