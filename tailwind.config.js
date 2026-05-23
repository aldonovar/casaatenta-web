/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: {
            DEFAULT: '#0d0d0d',
            soft: '#161616',
            card: '#1e1e1e',
            border: '#2a2a2a',
            text: '#a0a0a0'
          },
          light: {
            DEFAULT: '#f5f5f3',
            soft: '#e8e8e5',
            card: '#ffffff',
            border: '#e0e0dc',
            text: '#505050'
          },
          gold: {
            DEFAULT: '#c5a880',
            dark: '#b3946a',
            light: '#e1d0ba',
            glow: 'rgba(197, 168, 128, 0.15)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.3em',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
