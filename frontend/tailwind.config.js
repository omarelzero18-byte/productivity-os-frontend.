/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#08080C',
          900: '#121218',
          800: '#1B1B24',
          700: '#262631',
          600: '#34343F',
        },
        nour: {
          300: '#F7CD74',
          400: '#F2B84B',
          500: '#E2A233',
          600: '#C98A1F',
        },
        mist: {
          300: '#C7C7D1',
          400: '#9C9CAB',
          500: '#77778A',
        },
      },
      fontFamily: {
        display: ['"Noto Kufi Arabic"', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(242, 184, 75, 0.35)',
        'glow-sm': '0 0 20px -6px rgba(242, 184, 75, 0.4)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 80%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
