/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1F4E79',
        'brand-green': '#27AE60',
        'brand-red': '#E74C3C',
        'brand-amber': '#F39C12',
      }
    },
  },
  plugins: [],
}