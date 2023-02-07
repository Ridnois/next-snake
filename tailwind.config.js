const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lobster)', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
