/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef4ff',
          100: '#d9e8ff',
          200: '#bcd4ff',
          300: '#8eb8ff',
          400: '#5a92fb',
          500: '#4f8ef7',
          600: '#2d6eec',
          700: '#2059d8',
          800: '#2049af',
          900: '#1e418a',
        },
        dark: {
          950: '#060a14',
          900: '#0a0f1e',
          800: '#0d1529',
          700: '#111827',
          600: '#161f35',
          500: '#1e2a42',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f8ef7 0%, #6366f1 100%)',
        'hero-glow': 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(79,142,247,0.2) 0%, transparent 70%)',
        'card-shine': 'linear-gradient(135deg, rgba(79,142,247,0.04), rgba(139,92,246,0.04))',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.3)',
        'glow': '0 0 40px rgba(79,142,247,0.15)',
        'glow-lg': '0 0 60px rgba(79,142,247,0.25)',
        'btn': '0 4px 15px rgba(79,142,247,0.35)',
        'btn-hover': '0 6px 25px rgba(79,142,247,0.5)',
      },
    },
  },
  plugins: [],
};
