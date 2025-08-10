/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./dist/**/*.{html,js}",
    "./*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}

