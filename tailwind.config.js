/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Official NosytLabs Brand Colors
        'nosyt-purple': {
          lightest: '#c084fc', // Very light purple
          light: '#a855f7',    // Official light purple
          DEFAULT: '#7c3aed',  // Official main purple
          dark: '#5b21b6',     // Dark purple
          darkest: '#2D1B69'   // Logo background purple
        },
        'nosyt-orange': {
          lightest: '#ffb894', // Light orange tint
          light: '#ff8c42',    // Official light orange
          DEFAULT: '#ff6b35',  // Official main orange
          dark: '#e55a2b',     // Dark orange
          darkest: '#cc4e24'   // Darkest orange
        },
        primary: {
          lightest: '#c084fc', // Very light purple
          light: '#a855f7',    // Official light purple
          DEFAULT: '#7c3aed',  // Official main purple
          dark: '#5b21b6',     // Dark purple
          darkest: '#2D1B69'   // Logo background purple
        },
        secondary: {
          lightest: '#ffb894', // Light orange tint
          light: '#ff8c42',    // Official light orange
          DEFAULT: '#ff6b35',  // Official main orange
          dark: '#e55a2b',     // Dark orange
          darkest: '#cc4e24'   // Darkest orange
        },
        accent: {
          light: '#ff8c42',    // Official light orange as accent
          DEFAULT: '#ff6b35',  // Official main orange as default accent
          dark: '#e55a2b'      // Dark orange for accent hover states
        },
        // Additional semantic colors
        success: '#10B981',    // Green for success messages
        warning: '#F59E0B',    // Amber for warnings
        danger: '#EF4444',     // Red for errors
        info: '#3B82F6',       // Blue for information
        win95: {
          bg: '#C0C0C0',       // Windows 95 background color
          text: '#000000',     // Windows 95 text color
          highlight: '#000080', // Windows 95 highlight color
          shadow: '#808080',   // Windows 95 shadow color
          button: '#C0C0C0'    // Windows 95 button color
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'sans-serif'],
        win95: ['"MS Sans Serif"', '"Pixelated MS Sans Serif"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
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
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
