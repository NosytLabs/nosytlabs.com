import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "2400px", // Maximized width for modern layouts
      },
    },
    extend: {
      spacing: {
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
        12: "3rem", // 48px
        16: "4rem", // 64px
        18: "4.5rem", // 72px
        20: "5rem", // 80px
        24: "6rem", // 96px
        32: "8rem", // 128px
        40: "10rem", // 160px
        88: "22rem",
        128: "32rem",
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          emerald: {
            DEFAULT: "hsl(var(--accent-emerald))",
            foreground: "hsl(var(--accent-emerald-foreground))",
          },
          teal: {
            DEFAULT: "hsl(var(--accent-teal))",
            foreground: "hsl(var(--accent-teal-foreground))",
          },
          indigo: {
            DEFAULT: "hsl(var(--accent-indigo))",
            foreground: "hsl(var(--accent-indigo-foreground))",
          },
        },
        neon: {
          DEFAULT: "hsl(var(--neon))",
          foreground: "hsl(var(--neon-foreground))",
        },
        electric: {
          DEFAULT: "hsl(var(--electric))",
          foreground: "hsl(var(--electric-foreground))",
        },
        glass: {
          light: "hsl(var(--glass-light))",
          dark: "hsl(var(--glass-dark))",
          border: "hsl(var(--glass-border))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "bounce-slow": "bounce-slow 2s infinite",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      animationDelay: {
        0: "0ms",
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        800: "800ms",
        900: "900ms",
        1000: "1000ms",
        1500: "1500ms",
        2000: "2000ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#232965",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#2F82FF",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#29FFAB",
              foreground: "#252934",
            },
            danger: {
              DEFAULT: "hsl(0 84% 60%)",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "hsl(235 47% 35%)",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "hsl(218 100% 65%)",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "hsl(162 100% 65%)",
              foreground: "hsl(220 12% 13%)",
            },
            danger: {
              DEFAULT: "hsl(0 84% 60%)",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};
