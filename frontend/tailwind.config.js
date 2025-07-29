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
        "panel-off": "#10251f", // TV off
        "panel-on": "#12352d", // TV on
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34,211,238,0.7)" }, // cyan-400
          "50%": { boxShadow: "0 0 0 2px rgba(34,211,238,1)" },
        },
      },
      animation: {
        "pulse-border": "pulseBorder 1.5s ease-in-out infinite",
      },
      animationDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".delay-100": { "animation-delay": "100ms" },
        ".delay-200": { "animation-delay": "200ms" },
        ".delay-300": { "animation-delay": "300ms" },
        ".delay-400": { "animation-delay": "400ms" },
        ".delay-500": { "animation-delay": "500ms" },
        ".delay-600": { "animation-delay": "600ms" },
      });
    },
  ],
};
