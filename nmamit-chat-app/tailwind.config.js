/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gradient-start": "#FF512F",
        "gradient-end": "#DD2476",
      },
      
    },
  },
  plugins: [],
}

