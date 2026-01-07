/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#141414',
        'netflix-dark-gray': '#181818',
        'netflix-light-gray': '#2F2F2F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll link Inter from Google Fonts
      }
    },
  },
  plugins: [],
}
