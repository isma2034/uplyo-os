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
        // ink-3 : #7C7A9A donnait 4.11:1 sur blanc (< AA 4.5:1).
        // #6F6D8A donne 4.96:1 sur #FFFFFF, 4.67:1 sur --w2, 4.53:1 sur --lune.
        ink: { DEFAULT: "#0D0B1A", 2: "#3D3B5C", 3: "#6F6D8A" },
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
