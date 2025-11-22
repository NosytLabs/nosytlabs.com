import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import path from "path";

import icon from "astro-icon";

// const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Removed unused variable

const SITE_URL = process.env.PUBLIC_SITE_URL ?? (process.env.NODE_ENV === 'development' ? "http://localhost:4321" : "https://nosytlabs.com");
const BASE = process.env.PUBLIC_BASE_URL ?? "/";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: {
    enabled: process.env.NODE_ENV === 'development',
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    // React integration temporarily disabled - site uses Astro components only
    // react({
    //   // Configure React to avoid development-specific issues
    //   experimentalReactChildren: false,
    // }),
    tailwind(),
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Normalize URL for comparison (remove trailing slash)
        const url = item.url.replace(/\/$/, "");
        const baseUrl = `${SITE_URL}${BASE.replace(/\/$/, "")}`;

        // Homepage - Highest priority
        if (url === baseUrl || url === `${baseUrl}/index`) {
          item.priority = 1.0;
          item.changefreq = "daily";
        }
        // Main pages - High priority
        else if (url === `${baseUrl}/services`) {
          item.priority = 0.9;
          item.changefreq = "weekly";
        }
        else if (url === `${baseUrl}/projects`) {
          item.priority = 0.8;
          item.changefreq = "weekly";
        }
        else if (url === `${baseUrl}/about`) {
          item.priority = 0.8;
          item.changefreq = "monthly";
        }
        else if (url === `${baseUrl}/contact`) {
          item.priority = 0.8;
          item.changefreq = "monthly";
        }
        // Individual service pages
        else if (url.includes("/services/") && url !== `${baseUrl}/services`) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        }
        // Blog pages
        else if (url.includes("/blog/") && url !== `${baseUrl}/blog`) {
          item.priority = 0.6;
          item.changefreq = "never";
        }
        else if (url === `${baseUrl}/blog`) {
          item.priority = 0.7;
          item.changefreq = "weekly";
        }
        // Legal pages - Lower priority
        else if (url.includes("/legal/")) {
          item.priority = 0.3;
          item.changefreq = "yearly";
        }

        return item;
      },
    }),
    icon({
      include: {
        mdi: ["*"],
      },
    }),
  ],

  // Configure for static deployment (no server adapter needed)

  build: {
    assets: "assets",
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser', // Use terser for better JS minification
      rollupOptions: {
        output: {
          ...(process.env.NODE_ENV === 'production' && {
            manualChunks: {
              // Removed React-related chunks - site uses Astro components only
              dates: ["date-fns"],
              utils: ["clsx", "tailwind-merge"],
            },
          }),
          chunkFileNames: () => {
            return `assets/js/[name]-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      // rollupOptions: {
      //   external: ['nodemailer'],
      //   output: {
      //     ...(process.env.NODE_ENV === 'production' && {
      //       manualChunks: {
      //         // Core React libraries
      //         vendor: ["react", "react-dom"],

      //         // UI component libraries
      //         ui: ["@heroui/react", "framer-motion"],

      //         // Icon libraries
      //         icons: ["lucide-react"],

      //         // Chart libraries (for MetricsDashboard)
      //         charts: ["recharts"],

      //         // Form and validation utilities (removed unused react-hook-form)

      //         // Date utilities
      //         dates: ["date-fns"],

      //         // Utility libraries
      //         utils: ["clsx", "tailwind-merge"],
      //       },
      //     }),
      //     // Optimize chunk size
      //     chunkFileNames: () => {
      //       return `assets/js/[name]-[hash].js`;
      //     },
      //     assetFileNames: (assetInfo) => {
      //       const info = assetInfo.name.split('.');
      //       const ext = info[info.length - 1];
      //       if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
      //         return `assets/images/[name]-[hash][extname]`;
      //       }
      //       if (/css/i.test(ext)) {
      //         return `assets/css/[name]-[hash][extname]`;
      //       }
      //       return `assets/[name]-[hash][extname]`;
      //     },
      //   },
      // },
    },
    css: {},
    server: {
      fs: {
        allow: ['..']
      },
      hmr: {
        overlay: true
      }
    },
    define: {
      // Ensure React is in the correct mode
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@/components": path.resolve("./src/components"),
        "@/lib": path.resolve("./src/lib"),
        "@/utils": path.resolve("./src/utils"),
        "@/types": path.resolve("./src/types"),
        "@/styles": path.resolve("./src/styles"),
        "@/layouts": path.resolve("./src/layouts"),
        "@/content": path.resolve("./src/content"),
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  image: {
    domains: ["images.unsplash.com"],
    service: {
      entrypoint: 'astro/assets/services/sharp', // Use Sharp for better image optimization
    },
  },

});