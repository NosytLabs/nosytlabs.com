const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./pages/**/*.{ts,tsx,astro,html,js}', './components/**/*.{ts,tsx,astro,html,js}', './app/**/*.{ts,tsx,astro,html,js}', './src/**/*.{ts,tsx,astro,html,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // 2025 Brand & Geometric Color System
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-brand-accent)',
          'accent-muted': 'var(--color-brand-accent-muted)',
          'accent-subtle': 'var(--color-brand-accent-subtle)',
          'text-primary': 'var(--color-brand-text-primary)',
          'text-secondary': 'var(--color-brand-text-secondary)',
          'text-muted': 'var(--color-brand-text-muted)',
          'signal-white': 'var(--color-brand-signal-white)',
          // Added design tokens for highlight and alternate accent
          'highlight': 'var(--color-brand-highlight)',
          'accent-alt': 'var(--color-brand-accent-alt)'
        },
        geometric: {
          primary: 'var(--color-geometric-primary)',
          secondary: 'var(--color-geometric-secondary)',
          tertiary: 'var(--color-geometric-tertiary)',
          quaternary: 'var(--color-geometric-quaternary)'
        },
        surface: {
          primary: 'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
          elevated: 'var(--color-surface-elevated)',
          glass: 'var(--color-surface-glass)',
          'glass-strong': 'var(--color-surface-glass-strong)'
        },
        // Brand colors for tests
        'deep-space-black': '#0D0D0D',
        'signal-white': '#FFFFFF',
        'nexus-cyan': '#00F0FF',
        'brand-gray': '#808080'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // 2025 Soft Rounded Edges
        'soft': 'var(--border-radius-md)',
        'soft-lg': 'var(--border-radius-lg)',
        'soft-xl': 'var(--border-radius-xl)',
        'soft-2xl': 'var(--border-radius-2xl)'
      },
      fontFamily: {
        satoshi: [
          'Satoshi',
          'sans-serif'
        ],
        inter: [
          'Inter',
          'sans-serif'
        ],
        'jetbrains-mono': [
          'JetBrains Mono',
          'monospace'
        ]
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        // 2025 Enhanced Animations
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' }
        },
        'geometric-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' }
        },
        'geometric-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        // Brand effects
        'brand-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' }
        },
        'brand-node-shadow': {
          '0%': { boxShadow: '0 0 0 rgba(0, 240, 255, 0)' },
          '50%': { boxShadow: '0 5px 15px rgba(0, 240, 255, 0.4)' },
          '100%': { boxShadow: '0 0 0 rgba(0, 240, 255, 0)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'particle': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(20px, -20px) scale(0)', opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // 2025 Enhanced Animations
        'fade-in': 'fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up': 'slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'geometric-float': 'geometric-float 6s ease-in-out infinite',
        'geometric-spin': 'geometric-spin 20s linear infinite',
        // Brand effects
        'brand-glow': 'brand-glow 2s ease-in-out infinite',
        'brand-node-shadow': 'brand-node-shadow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'particle': 'particle 1s linear forwards'
      },
      // 2025 Enhanced Shadows
      boxShadow: {
        'glow-sm': 'var(--shadow-glow)',
        'glow-lg': 'var(--shadow-glow-strong)',
        'brand': '0 4px 8px rgba(0, 240, 255, 0.15)',
        'brand-lg': '0 8px 16px rgba(0, 240, 255, 0.2)',
        'geometric': '0 0 30px rgba(0, 240, 255, 0.4)',
        // Brand effects
        'brand-glow': '0 0 20px rgba(0, 240, 255, 0.3)',
        'brand-node-shadow': '0 5px 15px rgba(0, 240, 255, 0.4)',
        'pulse-glow': '0 0 30px rgba(0, 240, 255, 0.5)'
      },
      // 2025 Enhanced Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        // Brand spacing
        'brand-logo-clear': '2rem',
        'brand-section': '4rem',
        'brand-component': '2rem',
        'brand-element': '1rem'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};