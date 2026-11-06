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
        background: '#090C13',
        foreground: '#F1F5FC',
        card: {
          DEFAULT: '#141C2B',
          foreground: '#F1F5FC',
          raised: '#192338',
          border: '#273249',
        },
        popover: {
          DEFAULT: '#141C2B',
          foreground: '#F1F5FC',
        },
        primary: {
          DEFAULT: '#648BFF',
          foreground: '#FFFFFF',
          glow: 'rgba(100, 139, 255, 0.25)',
        },
        secondary: {
          DEFAULT: '#192338',
          foreground: '#F1F5FC',
        },
        muted: {
          DEFAULT: '#0E1420',
          foreground: '#929DB2',
        },
        accent: {
          DEFAULT: '#9B7BFF',
          foreground: '#FFFFFF',
          glow: 'rgba(155, 123, 255, 0.25)',
        },
        success: {
          DEFAULT: '#35C98A',
          foreground: '#090C13',
        },
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#FFFFFF',
        },
        border: '#273249',
        input: '#273249',
        ring: '#648BFF',
        devconnect: {
          bg: '#090C13',
          bgSecondary: '#0E1420',
          surface: '#141C2B',
          surfaceElevated: '#192338',
          primary: '#648BFF',
          secondary: '#9B7BFF',
          success: '#35C98A',
          textPrimary: '#F1F5FC',
          textSecondary: '#929DB2',
          border: '#273249',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(100, 139, 255, 0.08) 1px, transparent 0)",
        'dot-pattern': "radial-gradient(rgba(146, 157, 178, 0.12) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
