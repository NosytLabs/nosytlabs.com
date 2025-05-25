/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#9F7AEA', // Lighter purple for subtle elements
          light: '#7C3AED',    // Light purple for accents and hover states
          DEFAULT: '#4C1D95',  // Main NosytLabs Purple
          dark: '#3B0764',     // Dark purple for contrast
          darkest: '#2D0A4F'   // Deepest purple for backgrounds
        },
        secondary: {
          lightest: '#FFBE9A', // Lightest orange for subtle elements
          light: '#FF8C3F',    // Light orange for accents
          DEFAULT: '#FF6B00',  // Main NosytLabs Orange
          dark: '#E05A00',     // Dark orange for contrast
          darkest: '#CC5500'   // Deepest orange for emphasis
        },
        accent: {
          light: '#FF8C3F',    // Light orange as accent
          DEFAULT: '#FF6B00',  // Main orange as default accent
          dark: '#E05A00'      // Dark orange for accent hover states
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
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
