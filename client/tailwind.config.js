/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkerBG: '#080E20',
        darkBg: '#1C2541',
        darkMid: '#3A506B',
        accent: '#6FFFE9',
        accentDark: '#5BC0BE',
      },

      fontFamily: {
        sans: ['Mulish', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
