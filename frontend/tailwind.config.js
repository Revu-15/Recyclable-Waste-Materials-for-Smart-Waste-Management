/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9f2',
          100: '#e1f0e2',
          200: '#c4e2c6',
          300: '#97cb9b',
          400: '#64ac6a',
          500: '#388e3c', // Sustainability Green
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#154519',
          900: '#0e2e11',
          950: '#051406',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
        'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
      },
      borderWidth: {
        'glass': '1px',
      },
      borderColor: {
        'glass-light': 'rgba(255, 255, 255, 0.18)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
