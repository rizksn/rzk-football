/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/globals.css",
  ],
  safelist: [
    {
      pattern: /bg-team-.*/, // ✅ ⬅️ keep all team colors
    },
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

        team: {
          // 🟦 NFC North
          DET: "#0076B6", // Detroit Lions — Honolulu Blue :contentReference[oaicite:1]{index=1}
          CHI: "#C83803", // Bears — Burnt Orange :contentReference[oaicite:2]{index=2}
          MIN: "#4F2683", // Vikings — Purple :contentReference[oaicite:3]{index=3}
          GB: "#203731", // Packers — Dark Green :contentReference[oaicite:4]{index=4}

          // 🔥 NFC East
          PHI: "#004C54", // Eagles — Midnight Green :contentReference[oaicite:5]{index=5}
          DAL: "#003594", // Cowboys — Royal Blue :contentReference[oaicite:6]{index=6}
          NYG: "#0D2266", // Giants — Dark Blue :contentReference[oaicite:7]{index=7}
          WAS: "#5A1414", // Commanders — Burgundy :contentReference[oaicite:8]{index=8}

          // 🌴 NFC South
          ATL: "#A71930", // Falcons — Red :contentReference[oaicite:9]{index=9}
          CAR: "#0085CA", // Panthers — Carolina Blue :contentReference[oaicite:10]{index=10}
          NO: "#D3BC8D", // Saints — Old Gold :contentReference[oaicite:11]{index=11}
          TB: "#A71930", // Buccaneers — Red :contentReference[oaicite:12]{index=12}

          // 🌄 NFC West
          SF: "#AA0000", // 49ers — Red :contentReference[oaicite:13]{index=13}
          SEA: "#002244", // Seahawks — College Navy :contentReference[oaicite:14]{index=14}
          LAR: "#003594", // Rams — Royal Blue :contentReference[oaicite:15]{index=15}
          ARI: "#97233F", // Cardinals — Cardinal Red :contentReference[oaicite:16]{index=16}

          // 🔧 AFC North
          CIN: "#FB4F14", // Bengals — Orange :contentReference[oaicite:17]{index=17}
          BAL: "#241773", // Ravens — Purple :contentReference[oaicite:18]{index=18}
          CLE: "#FF3C00", // Browns — Orange :contentReference[oaicite:19]{index=19}
          PIT: "#FFB612", // Steelers — Gold :contentReference[oaicite:20]{index=20}

          // ⚡️ AFC East
          BUF: "#00338D", // Bills — Royal Blue :contentReference[oaicite:21]{index=21}
          MIA: "#008E97", // Dolphins — Aqua :contentReference[oaicite:22]{index=22}
          NE: "#C60C30", // Patriots — Red :contentReference[oaicite:23]{index=23}
          NYJ: "#125740", // Jets — Gotham Green :contentReference[oaicite:24]{index=24}

          // 🏜 AFC South
          JAX: "#006778", // Jaguars — Teal :contentReference[oaicite:25]{index=25}
          IND: "#002C5F", // Colts — Speed Blue :contentReference[oaicite:26]{index=26}
          HOU: "#03202F", // Texans — Deep Steel Blue (approx) :contentReference[oaicite:27]{index=27}
          TEN: "#4B92DB", // Titans — Titans Blue :contentReference[oaicite:28]{index=28}

          // 🏹 AFC West
          KC: "#E31837", // Chiefs — Red :contentReference[oaicite:29]{index=29}
          DEN: "#FB4F14", // Broncos — Orange :contentReference[oaicite:30]{index=30}
          LV: "#000000", // Raiders — Black :contentReference[oaicite:31]{index=31}
          LAC: "#0080C6", // Chargers — Powder Blue :contentReference[oaicite:32]{index=32}
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34,211,238,0.4)" },
          "50%": { boxShadow: "0 0 0px 1px rgba(34,211,238,0.8)" },
        },
      },

      animation: {
        "pulse-border": "pulseBorder 3.5s ease-in-out infinite",
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
