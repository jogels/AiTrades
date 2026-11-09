import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          dark: '#0a0d14',
          card: '#111726',
          cardSoft: '#161d31',
          cardHover: '#1c253d',
          border: '#1f2942',
          borderLight: '#2a3759',
          blue: '#2b66ff',
          blueHover: '#1f53db',
          green: '#00d084',
          greenSoft: '#00d0841a',
          red: '#ff4d6a',
          redSoft: '#ff4d6a1a',
          yellow: '#f59e0b',
          yellowSoft: '#f59e0b1a',
          textMuted: '#7f8ea3',
        },
      },
    },
  },
  plugins: [],
};

export default config;
