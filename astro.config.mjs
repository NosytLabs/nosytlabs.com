import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import path from "path";

import icon from "astro-icon";
import compressor from "astro-compressor";

const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://nosytlabs.github.io";
const BASE = process.env.PUBLIC_BASE_URL ?? "/";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE,
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    tailwind(),
    mdx({
      optimize: true,
    }),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Normalize URL for comparison (remove trailing slash)
        const url = item.url.replace(/\/$/, "");
        const baseUrl = `${SITE_URL}${BASE.replace(/\/$/, "")}`;

        // Homepage
        if (url === baseUrl || url === `${baseUrl}/index`) {
          item.priority = 1.0;
          item.changefreq = "weekly";
        }
        // Service pages (individual services)
        else if (url.includes("/services/") && url !== `${baseUrl}/services`) {
          item.priority = 0.8;
          item.changefreq = "monthly";
        }
        // Services index
        else if (url === `${baseUrl}/services`) {
          item.priority = 0.8;
          item.changefreq = "weekly";
        }
        // Individual blog posts
        else if (url.includes("/blog/") && url !== `${baseUrl}/blog`) {
          item.priority = 0.6;
          item.changefreq = "never";
        }
        // Blog index
        else if (url === `${baseUrl}/blog`) {
          item.priority = 0.7;
          item.changefreq = "weekly";
        }
        // About and contact pages
        else if (url.includes("/about") || url.includes("/contact")) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        }
        // Projects page
        else if (url.includes("/projects")) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        }

        return item;
      },
    }),
    icon(),
    compressor({
      // Basic compression, safe defaults
      css: true,
      html: true,
      img: false,
      js: true,
    }),
  ],
  output: "static",
  build: {
    assets: "assets",
  },
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["@heroui/react", "framer-motion"],
            icons: ["lucide-react"],
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
      include: [
        "react",
        "react-dom",
        "framer-motion",
        "@heroui/react",
        "lucide-react",
      ],
    },
    resolve: {
      alias: {
        "@shared-utils": path.resolve("./packages/shared-utils/src"),
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
  },
});
