/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark navy surface scale
        navy: {
          50: "#f4f6fb",
          100: "#dfe4ef",
          200: "#c3cbdf",
          300: "#9aa6c2",
          950: "#04060c",
          900: "#080b14",
          850: "#0b0f1b",
          800: "#0f1422",
          700: "#141a2c",
          600: "#1b2338",
          500: "#25304a",
          400: "#374362",
        },
        // Elegant blue accent scale
        brand: {
          50: "#eef3ff",
          100: "#dbe6ff",
          200: "#b3c9ff",
          300: "#84a6ff",
          400: "#5b84fb",
          500: "#3d68ee",
          600: "#2f52c9",
          700: "#28439f",
          800: "#233a80",
          900: "#1c2c5e",
          glow: "#6f97ff",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(111,151,255,0.15), 0 8px 30px -8px rgba(61,104,238,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(61,104,238,0.16), transparent 55%), radial-gradient(circle at 85% 0%, rgba(111,151,255,0.10), transparent 45%)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
