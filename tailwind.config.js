/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        "mobile-m": "375px",
        "mobile-l": "425px",
      }
    },
  },
  plugins: [],
}

