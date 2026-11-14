/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#080D0B',
          secondary: '#0D1511',
          card: '#111815',
          elevated: '#171E1A',
        },
        emerald: {
          DEFAULT: '#36D98A',
          primary: '#36D98A',
          secondary: '#16B86A',
          dark: '#0B3D2B',
          glow: 'rgba(54, 217, 138, 0.25)',
        },
        gold: {
          DEFAULT: '#D8B45A',
          border: '#8D7845',
          glow: 'rgba(216, 180, 90, 0.25)',
        },
        text: {
          primary: '#F4F4EF',
          secondary: '#A7ADA8',
          muted: '#777F79',
        },
        status: {
          success: '#36D98A',
          warning: '#E5B84C',
          error: '#F04444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 25px -5px rgba(54, 217, 138, 0.35)',
        'emerald-sm': '0 0 12px -2px rgba(54, 217, 138, 0.3)',
        'gold-glow': '0 0 25px -5px rgba(216, 180, 90, 0.35)',
        'gold-sm': '0 0 12px -2px rgba(216, 180, 90, 0.3)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
}
