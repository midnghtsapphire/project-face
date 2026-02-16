/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Earthy warm palette — NO blue light
        charcoal: {
          50: '#f5f3f0',
          100: '#e8e4de',
          200: '#d1c9bd',
          300: '#b5a895',
          400: '#9a8a73',
          500: '#7d6e58',
          600: '#635747',
          700: '#4a4137',
          800: '#342e28',
          900: '#1e1b18',
          950: '#121110',
        },
        ember: {
          50: '#fef2f0',
          100: '#fde3de',
          200: '#fbc7bd',
          300: '#f7a08e',
          400: '#f07052',
          500: '#e54d2e',
          600: '#c93a1e',
          700: '#a82e19',
          800: '#8b2818',
          900: '#73261a',
          950: '#3e100a',
        },
        forest: {
          50: '#f0f7f1',
          100: '#dcedde',
          200: '#bbdbc0',
          300: '#8ec298',
          400: '#5ea56c',
          500: '#3d8a50',
          600: '#2d6e3e',
          700: '#255833',
          800: '#20472b',
          900: '#1b3b24',
          950: '#0e2114',
        },
        gold: {
          50: '#fefbec',
          100: '#fcf4cb',
          200: '#f9e892',
          300: '#f5d559',
          400: '#f1c232',
          500: '#e1a515',
          600: '#c77f0f',
          700: '#a55c10',
          800: '#874914',
          900: '#703c14',
          950: '#411f07',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
