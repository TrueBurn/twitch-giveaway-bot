const colors = {
  // Orokin/Tenno colors
  orokin: {
    50: '#f0f4f8',
    100: '#d9e2e9',
    200: '#b4c5d4',
    300: '#8ea8bf',
    400: '#688baa',
    500: '#436e95',
    600: '#355877',
    700: '#274259',
    800: '#182b3c',
    900: '#09151e',
  },
  // Energy colors
  energy: {
    blue: '#00FFFF',   // Default Warframe energy
    gold: '#FFB74D',   // Orokin gold
    white: '#FFFFFF',  // Void energy
  },
  // Accent colors
  accent: {
    red: '#FF4D4D',    // Stalker red
    purple: '#9C27B0', // Void corruption
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backgroundImage: {
        'orokin-pattern': "url('/patterns/orokin.svg')", // We'll create this pattern
      },
    },
  },
  plugins: [],
}

