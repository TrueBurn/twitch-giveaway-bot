import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          primary: '#00fff9',    // Cyan
          secondary: '#ff00c8',  // Pink
          accent: '#ffe100',     // Yellow
          border: {
            DEFAULT: 'rgba(0, 255, 255, 0.15)',
            glow: 'rgba(0, 255, 255, 0.2)',
          },
          bg: {
            dark: 'rgba(15, 25, 35, 0.95)',
            light: 'rgba(0, 0, 0, 0.85)',
          },
        },
      },
      animation: {
        'border-flow': 'animatedBorder 4s linear infinite',
        'text-gradient': 'gradientText 8s linear infinite',
        'winner-entrance': 'winnerEntrance 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
        'shine': 'shine 3s linear infinite',
        'winner-gradient': 'winnerGradient 4s linear infinite',
        'count-pop': 'countPop 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        animatedBorder: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradientText: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        winnerEntrance: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        winnerGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        countPop: {
          '0%': { 
            transform: 'scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '50%': { 
            transform: 'scale(1.3)',
            filter: 'hue-rotate(45deg)',
          },
          '100%': { 
            transform: 'scale(1)',
            filter: 'hue-rotate(0deg)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;