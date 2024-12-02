/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        'gen-z': ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'off-black': '#0A0A0A',
        'accent-orange': '#FF6B35',
        'brand-black': '#121212',
        'brand-orange': {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCD38',
          300: '#FF9800',
          400: '#FF5722',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        'brand-white': '#FFFFFF',
      },
      boxShadow: {
        'neon-orange-tr': '3px -3px 10px rgba(255, 107, 53, 0.4), inset 3px -3px 10px rgba(255, 107, 53, 0.2)',
        'neon-orange-bl': '-3px 3px 10px rgba(255, 107, 53, 0.4), inset -3px 3px 10px rgba(255, 107, 53, 0.2)',
        'gen-z': '0 10px 25px rgba(255,87,34,0.2)',
        'gen-z-intense': '0 15px 35px rgba(255,87,34,0.4)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-pulse-tr': 'neon-pulse-tr 3s infinite alternate',
        'neon-pulse-bl': 'neon-pulse-bl 3s infinite alternate',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'neon-pulse-tr': {
          '0%': { boxShadow: '3px -3px 5px rgba(255, 107, 53, 0.3), inset 3px -3px 5px rgba(255, 107, 53, 0.1)' },
          '100%': { boxShadow: '3px -3px 15px rgba(255, 107, 53, 0.5), inset 3px -3px 15px rgba(255, 107, 53, 0.3)' },
        },
        'neon-pulse-bl': {
          '0%': { boxShadow: '-3px 3px 5px rgba(255, 107, 53, 0.3), inset -3px 3px 5px rgba(255, 107, 53, 0.1)' },
          '100%': { boxShadow: '-3px 3px 15px rgba(255, 107, 53, 0.5), inset -3px 3px 15px rgba(255, 107, 53, 0.3)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-white': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
      fontWeight: {
        'heading': '900',
        'subheading': '700',
        'body': '400',
        'light': '300'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
