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
          main: '#080A08',
          secondary: '#0D100D',
          card: '#111512',
          elevated: '#171D18',
          darker: '#040504',
        },
        lime: {
          DEFAULT: '#C6FF00',
          accent: '#C6FF00',
          bright: '#D4FF33',
          neon: '#B8F200',
          dark: '#1C2E08',
          muted: '#8FB800',
          glow: 'rgba(198, 255, 0, 0.28)',
        },
        emerald: {
          DEFAULT: '#C6FF00', // mapped to new lime theme for compatibility
          primary: '#C6FF00',
          secondary: '#9DDF00',
          dark: '#152408',
          glow: 'rgba(198, 255, 0, 0.25)',
        },
        gold: {
          DEFAULT: '#E5C05C',
          border: '#8F752C',
          glow: 'rgba(229, 192, 92, 0.25)',
        },
        text: {
          primary: '#F5F7F2',
          secondary: '#9EA79C',
          muted: '#687366',
        },
        status: {
          success: '#C6FF00',
          warning: '#E5B84C',
          error: '#FF453A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'lime-glow': '0 0 35px -5px rgba(198, 255, 0, 0.35)',
        'lime-sm': '0 0 15px -2px rgba(198, 255, 0, 0.3)',
        'lime-halo': '0 0 70px 15px rgba(198, 255, 0, 0.12)',
        'emerald-glow': '0 0 35px -5px rgba(198, 255, 0, 0.35)',
        'emerald-sm': '0 0 15px -2px rgba(198, 255, 0, 0.3)',
        'card': '0 15px 35px -10px rgba(0, 0, 0, 0.85)',
      },
      borderRadius: {
        'card': '16px',
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
