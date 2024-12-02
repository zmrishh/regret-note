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
      },
      colors: {
        'off-black': '#0A0A0A',
        'accent-orange': '#FF6B35',
      },
      boxShadow: {
        'neon-orange-tr': '3px -3px 10px rgba(255, 107, 53, 0.4), inset 3px -3px 10px rgba(255, 107, 53, 0.2)',
        'neon-orange-bl': '-3px 3px 10px rgba(255, 107, 53, 0.4), inset -3px 3px 10px rgba(255, 107, 53, 0.2)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-pulse-tr': 'neon-pulse-tr 3s infinite alternate',
        'neon-pulse-bl': 'neon-pulse-bl 3s infinite alternate',
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
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
