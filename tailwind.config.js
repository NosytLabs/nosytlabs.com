/** @type {import('tailwindcss').Config} */
import { tokens, convertToTailwindConfig } from './src/tokens/design-tokens.js';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/layouts/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'class', // Will be unified with CSS data-theme approach
  theme: {
    extend: {
      // Colors from centralized design tokens
      colors: {
        // NosytLabs brand colors (direct access)
        'nosyt-purple': tokens.brand.purple[500],
        'nosyt-orange': tokens.brand.orange[500],
        'nosyt-blue': tokens.brand.blue[500],
        'nosyt-red': tokens.brand.red[500],
        'nosyt-green': tokens.brand.green[500],
        
        // Full color scales from design tokens - properly mapped
        brand: convertToTailwindConfig(tokens.brand),
        primary: convertToTailwindConfig(tokens.semantic.primary),
        secondary: convertToTailwindConfig(tokens.semantic.secondary),
        accent: convertToTailwindConfig(tokens.semantic.accent),
        success: convertToTailwindConfig(tokens.semantic.success),
        warning: convertToTailwindConfig(tokens.semantic.warning),
        danger: convertToTailwindConfig(tokens.semantic.danger),
        info: convertToTailwindConfig(tokens.semantic.info),
        neutral: convertToTailwindConfig(tokens.neutral),
        win95: convertToTailwindConfig(tokens.win95),
      },
      // Typography from design tokens
      fontFamily: convertToTailwindConfig(tokens.typography.fontFamily),
      fontSize: convertToTailwindConfig(tokens.typography.fontSize),
      fontWeight: convertToTailwindConfig(tokens.typography.fontWeight),
      lineHeight: convertToTailwindConfig(tokens.typography.lineHeight),

      // Spacing from design tokens
      spacing: convertToTailwindConfig(tokens.spacing),

      // Border radius from design tokens
      borderRadius: convertToTailwindConfig(tokens.borderRadius),

      // Box shadow from design tokens
      boxShadow: convertToTailwindConfig(tokens.boxShadow),
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-in-out forwards',
        'slide-down': 'slideDown 0.8s ease-in-out forwards',
        'slide-left': 'slideLeft 0.8s ease-in-out forwards',
        'slide-right': 'slideRight 0.8s ease-in-out forwards',
        'zoom-in': 'zoomIn 0.8s ease-in-out forwards',
        'zoom-out': 'zoomOut 0.8s ease-in-out forwards',
        'flip': 'flip 0.8s ease-in-out forwards',
        'rotate': 'rotate 0.8s ease-in-out forwards',
        'bounce': 'bounceIn 0.8s ease-in-out forwards',
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
        slide: "slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        grid: "grid 15s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "meteor-effect": "meteor 5s linear infinite",
        "aurora-shift": "aurora-shift 4s ease-in-out infinite",
        fadeUp: 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-5px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        slideRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        zoomIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        zoomOut: {
          '0%': {
            opacity: '0',
            transform: 'scale(1.2)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        flip: {
          '0%': {
            opacity: '0',
            transform: 'rotateY(90deg)'
          },
          '100%': {
            opacity: '1',
            transform: 'rotateY(0)'
          },
        },
        rotate: {
          '0%': {
            opacity: '0',
            transform: 'rotate(-15deg)'
          },
          '100%': {
            opacity: '1',
            transform: 'rotate(0)'
          },
        },
        bounceIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '60%': {
            opacity: '1',
            transform: 'translateY(-20px)'
          },
          '80%': {
            transform: 'translateY(10px)'
          },
          '100%': {
            transform: 'translateY(0)'
          },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        slide: {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0%)" },
          to: { transform: "translateY(-100%)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          from: {
            "background-position": "0 0",
          },
          to: {
            "background-position": "-200% 0",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "aurora-shift": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateX(-50%) translateY(0)',
          },
          '40%': {
            transform: 'translateX(-50%) translateY(-5px)',
          },
          '60%': {
            transform: 'translateX(-50%) translateY(-3px)',
          },
        },
        fadeUp: {
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
