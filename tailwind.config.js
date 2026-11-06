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
        background: '#07090e',
        foreground: '#f1f5f9',
        card: {
          DEFAULT: '#0d111a',
          foreground: '#f8fafc',
          raised: '#131824',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        popover: {
          DEFAULT: '#0f1420',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#0ea5e9', // Sky 500
          foreground: '#040812',
          glow: 'rgba(14, 165, 233, 0.25)',
        },
        secondary: {
          DEFAULT: '#192030',
          foreground: '#f1f5f9',
        },
        muted: {
          DEFAULT: '#141a27',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#6366f1', // Indigo 500
          foreground: '#ffffff',
          glow: 'rgba(99, 102, 241, 0.25)',
        },
        destructive: {
          DEFAULT: '#f43f5e',
          foreground: '#ffffff',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.1)',
        ring: '#38bdf8',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0d1320',
          950: '#070a12',
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
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)",
        'dot-pattern': "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
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
        borderBeam: {
          '0%': { 'offset-distance': '0%' },
          '100%': { 'offset-distance': '100%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
