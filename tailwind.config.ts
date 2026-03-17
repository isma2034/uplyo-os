import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Uplyo Brand
        eclat: { DEFAULT: "#6C5CE7", hover: "#5A4BD1" },
        aura: "#A29BFE",
        spark: "#FDCB6E",
        nuit: "#1A1040",
        ombre: "#2D2B55",
        lune: { DEFAULT: "#F5F3FF", deep: "#EBE8FF" },

        // Semantic
        ink: { DEFAULT: "#0D0B1A", 2: "#3D3B5C", 3: "#7C7A9A" },

        // OS Dark theme
        os: {
          bg: "#0e0f11",
          bg2: "#14161a",
          bg3: "#1c1f25",
          bg4: "#242830",
          bg5: "#2e333d",
        },
        "os-line": {
          DEFAULT: "rgba(255,255,255,0.07)",
          2: "rgba(255,255,255,0.12)",
          3: "rgba(255,255,255,0.18)",
        },
        "os-t": {
          DEFAULT: "#e8eaed",
          2: "#868e9a",
          3: "#4a5060",
          4: "#2e3340",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        uplyo: "10px",
        "uplyo-lg": "16px",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "ai-pulse": "ai-pulse 1s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
        "ai-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
