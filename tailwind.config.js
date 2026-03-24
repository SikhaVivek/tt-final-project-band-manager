/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f1115',
          surface: '#181b24',
          border: '#242a36',
          primary: '#6ee7d2',
          secondary: '#9a7bff',
        }
      }
    },
  },
  plugins: [],
}
