/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dfe8ff",
          200: "#c2d3ff",
          300: "#98b3ff",
          400: "#6d8dff",
          500: "#4a67f5",
          600: "#3849d6",
          700: "#2f3aab",
          800: "#2b3489",
          900: "#282f6c",
        },
      },
    },
  },
  plugins: [],
};
