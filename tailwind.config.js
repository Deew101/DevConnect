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
        background: '#080B13',
        foreground: '#F4F6FC',
        card: {
          DEFAULT: '#131D2D',
          foreground: '#F4F6FC',
          raised: '#19253A',
          border: '#27334B',
        },
        popover: {
          DEFAULT: '#131D2D',
          foreground: '#F4F6FC',
        },
        primary: {
          DEFAULT: '#638DFF',
          foreground: '#080B13',
          glow: 'rgba(99, 141, 255, 0.25)',
        },
        secondary: {
          DEFAULT: '#0D1320',
          foreground: '#F4F6FC',
        },
        muted: {
          DEFAULT: '#0D1320',
          foreground: '#98A6BD',
        },
        accent: {
          DEFAULT: '#9875FF',
          foreground: '#080B13',
          glow: 'rgba(152, 117, 255, 0.25)',
        },
        cyan: {
          DEFAULT: '#55D9FF',
          foreground: '#080B13',
          glow: 'rgba(85, 217, 255, 0.25)',
        },
        success: {
          DEFAULT: '#31D69A',
          foreground: '#080B13',
        },
        warning: {
          DEFAULT: '#FFBD59',
          foreground: '#080B13',
        },
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#FFFFFF',
        },
        border: '#27334B',
        input: '#27334B',
        ring: '#638DFF',
        devconnect: {
          bg: '#080B13',
          bgSecondary: '#0D1320',
          surface: '#131D2D',
          surfaceElevated: '#19253A',
          blue: '#638DFF',
          violet: '#9875FF',
          cyan: '#55D9FF',
          green: '#31D69A',
          amber: '#FFBD59',
          text: '#F4F6FC',
          muted: '#98A6BD',
          border: '#27334B',
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
