import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Uplyo brand ──
        // eclat.DEFAULT : fond de bloc + texte BLANC PUR uniquement (4.86:1).
        //   Toute opacité < 100% sur ce fond échoue AA (white/80 = 3.72:1).
        // eclat.ink : la SEULE nuance de violet autorisée pour du TEXTE sur
        //   fond clair — 6.25:1 sur blanc, 5.97:1 sur surface-1, 5.70:1 sur
        //   lune. L'ancien `text-eclat` sur lune plafonnait à 4.43:1 (< AA).
        eclat: { DEFAULT: "#6C5CE7", hover: "#5A4BD1", ink: "#5A4BD1" },
        aura: "#A29BFE", // 7.26:1 sur nuit
        spark: "#FDCB6E", // 11.70:1 sur nuit — marqueurs de jour, puces
        nuit: "#1A1040", // porte tous les blocs sombres sauf le CTA final
        ombre: "#2D2B55",
        lune: { DEFAULT: "#F5F3FF", deep: "#EBE8FF" },

        // ── Surfaces opaques ──
        // Remplacent les bordures/fonds en alpha, dont la couleur perçue
        // variait selon le fond sur lequel ils étaient posés.
        surface: { 0: "#FFFFFF", 1: "#FAF9FF", 2: "#F6F4FF" },
        line: { DEFAULT: "#E6E2F7", strong: "#CFC8F0", input: "#8E86C6" },

        // ── Texte ──
        // ink-3 #6F6D8A : 4.96:1 sur blanc, 4.74:1 sur surface-1,
        // 4.56:1 sur surface-2. (#7C7A9A donnait 4.11:1, sous AA.)
        ink: { DEFAULT: "#0D0B1A", 2: "#3D3B5C", 3: "#6F6D8A" },
      },

      // ── Échelle typographique fermée ──
      // Neuf pas nommés par rôle. Le tracking est exprimé en `em` et non en
      // `px` : sur un titre en clamp(), un tracking en px se déforme selon la
      // taille rendue (l'ancien `tracking-[-2px]` sur le H1).
      fontSize: {
        label: ["0.6875rem", { lineHeight: "1.45", letterSpacing: "0.1em" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
        body: ["0.875rem", { lineHeight: "1.65" }],
        "body-lg": ["1rem", { lineHeight: "1.65" }],
        lead: ["1.0625rem", { lineHeight: "1.6" }],
        title: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        section: ["clamp(1.5rem, 2.6vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: ["clamp(1.875rem, 3.4vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        // Le hero vit dans une colonne d'environ 560px : au-delà de ~3.5rem il
        // déborde sur 6 lignes et mange tout le premier écran.
        hero: ["clamp(2.125rem, 3.9vw, 3.375rem)", { lineHeight: "1.03", letterSpacing: "-0.03em" }],
      },

      // ── Familles ──
      // Ces piles DOIVENT pointer sur les variables CSS produites par
      // next/font, pas sur le nom public de la police. next/font n'expose
      // jamais une @font-face nommée "DM Sans" : elle génère une famille
      // privée (__DM_Sans_xxxxx) accessible uniquement via --font-sans /
      // --font-mono, posées sur <html>. Avec `'"DM Sans"'` en tête de pile,
      // aucune @font-face ne correspondait : les deux .woff2 étaient bien
      // préchargés et téléchargés à chaque page, puis jamais appliqués, et
      // tout le site retombait sur system-ui / ui-monospace (la police
      // monospace de l'OS = l'aspect « terminal » remonté par le client).
      // Constaté sur le rendu réel (capture headless), pas à la lecture.
      // Le nom public reste en second : utile si la police est installée
      // localement et que next/font est retiré un jour.
      fontFamily: {
        sans: ["var(--font-sans)", '"DM Sans"', "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", '"DM Mono"', "ui-monospace", "monospace"],
      },

      borderRadius: {
        uplyo: "10px",
        "uplyo-lg": "16px",
        card: "14px",
        panel: "18px",
      },

      boxShadow: {
        card: "0 1px 2px rgba(26, 16, 64, 0.04)",
        raised: "0 12px 32px -12px rgba(26, 16, 64, 0.16)",
        panel: "0 24px 60px -24px rgba(26, 16, 64, 0.28)",
      },

      maxWidth: {
        wide: "1200px",
        text: "760px",
      },

      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
