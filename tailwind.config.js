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
        foreground: '#F4F6FC',
        card: {
          DEFAULT: '#151F30',
          foreground: '#F4F6FC',
          raised: '#1C2940',
          border: '#273249',
        },
        popover: {
          DEFAULT: '#151F30',
          foreground: '#F4F6FC',
        },
        primary: {
          DEFAULT: '#6D95FF',
          foreground: '#090C13',
          glow: 'rgba(109, 149, 255, 0.25)',
        },
        secondary: {
          DEFAULT: '#101725',
          foreground: '#F4F6FC',
        },
        muted: {
          DEFAULT: '#101725',
          foreground: '#929DB2',
        },
        accent: {
          DEFAULT: '#9D83FF',
          foreground: '#090C13',
          glow: 'rgba(157, 131, 255, 0.25)',
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
        ring: '#6D95FF',
        devconnect: {
          bg: '#090C13',
          bgSecondary: '#101725',
          surface: '#151F30',
          surfaceElevated: '#1C2940',
          primary: '#6D95FF',
          secondary: '#9D83FF',
          success: '#35C98A',
          text: '#F4F6FC',
          muted: '#929DB2',
          border: '#273249',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(109, 149, 255, 0.08) 1px, transparent 0)",
        'dot-pattern': "radial-gradient(rgba(146, 157, 178, 0.12) 1px, transparent 1px)",
        'editorial-lines': "linear-gradient(to right, #273249 1px, transparent 1px), linear-gradient(to bottom, #273249 1px, transparent 1px)",
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
}
