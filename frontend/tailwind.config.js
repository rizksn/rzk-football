/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        base: "#14111c", // main background
        surface: "#0f0f1a", // display panel bg
        accent: "#5f1cca", // purple for buttons or glow
        statbox: "#183049", // blue glow background
        highlight: "#9b88b9", // for bright stat numbers or SVG
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
