/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F17',
        darkCard: '#111827',
        darkBorder: '#1F2937',
        brandGreen: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        brandGold: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        }
      }
    },
  },
  plugins: [],
}
