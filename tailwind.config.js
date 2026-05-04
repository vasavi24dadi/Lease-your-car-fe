/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c3cbdc',
        secondary: '#667297',
        accent: '#b9b5ac',
      }
    },
  },
  plugins: [],
}
