/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080514',
        foreground: '#F8F7FF',
        card: {
          DEFAULT: '#160E30',
          foreground: '#F8F7FF',
          raised: '#1E1442',
          border: 'rgba(167, 139, 250, 0.20)',
        },
        popover: {
          DEFAULT: '#160E30',
          foreground: '#F8F7FF',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          foreground: '#F8F7FF',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        secondary: {
          DEFAULT: '#100A24',
          foreground: '#B8ACD9',
        },
        muted: {
          DEFAULT: '#100A24',
          foreground: '#B8ACD9',
        },
        accent: {
          DEFAULT: '#A855F7',
          foreground: '#F8F7FF',
          glow: 'rgba(168, 85, 247, 0.35)',
        },
        magenta: {
          DEFAULT: '#D946EF',
          foreground: '#F8F7FF',
          glow: 'rgba(217, 70, 239, 0.35)',
        },
        lavender: {
          DEFAULT: '#C4B5FD',
          foreground: '#080514',
        },
        success: {
          DEFAULT: '#34D399',
          foreground: '#080514',
        },
        warning: {
          DEFAULT: '#FBBF24',
          foreground: '#080514',
        },
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#FFFFFF',
        },
        border: 'rgba(167, 139, 250, 0.20)',
        input: 'rgba(167, 139, 250, 0.20)',
        ring: '#8B5CF6',
        galaxy: {
          bg: '#080514',
          bgSecondary: '#100A24',
          card: '#160E30',
          surface: '#160E30',
          surfaceElevated: '#1E1442',
          purple: '#8B5CF6',
          violet: '#A855F7',
          magenta: '#D946EF',
          lavender: '#C4B5FD',
          text: '#F8F7FF',
          textMuted: '#B8ACD9',
          border: 'rgba(167, 139, 250, 0.20)',
        },
        devconnect: {
          bg: '#080514',
          bgSecondary: '#100A24',
          surface: '#160E30',
          surfaceElevated: '#1E1442',
          blue: '#8B5CF6',
          purple: '#8B5CF6',
          violet: '#A855F7',
          cyan: '#D946EF',
          magenta: '#D946EF',
          green: '#34D399',
          amber: '#FBBF24',
          text: '#F8F7FF',
          muted: '#B8ACD9',
          border: 'rgba(167, 139, 250, 0.20)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(167, 139, 250, 0.12) 1px, transparent 0)",
        'dot-pattern': "radial-gradient(rgba(196, 181, 253, 0.15) 1px, transparent 1px)",
        'cosmic-gradient': 'linear-gradient(135deg, #100A24 0%, #080514 50%, #160E30 100%)',
        'nebula-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.18) 0%, rgba(217, 70, 239, 0.08) 50%, transparent 80%)',
        'purple-violet-glow': 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), transparent 70%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'nebula-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2.5s infinite',
        'nebula-pulse': 'nebula-pulse 8s ease-in-out infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'float-slow': 'float-slow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
