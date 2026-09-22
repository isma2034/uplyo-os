import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Identité "dossier d'audit" (refonte 22/09/2026) ──
        // Le violet startup (#6C5CE7) a ete remplace par un rouge tampon —
        // reserve aux chiffres VERIFIES, jamais decoratif. Rapport de
        // contraste calcule et verifie a la main pour chaque paire ci-dessous
        // (formule WCAG relative luminance), pas au pif : c'est le meme
        // niveau d'exigence que l'ancienne palette violette, sur de nouvelles
        // valeurs.
        // eclat.DEFAULT sur blanc (texte blanc dessus) : 5.42:1 (AA)
        // eclat.ink sur blanc (texte colore) : 6.7:1 (AA)
        eclat: { DEFAULT: "#C0361C", hover: "#932615", ink: "#A32C16" },
        aura: "#D9B98C", // accent parchemin sur fond sombre, 8.9:1 sur nuit
        spark: "#D9A441", // marqueurs/puces sur fond sombre, 7.3:1 sur nuit
        nuit: "#1B1E23", // porte tous les blocs sombres sauf le CTA final
        ombre: "#2A2E35",
        lune: { DEFAULT: "#F6F5F1", deep: "#ECEAE3" }, // papier / papier carbone

        // ── Surfaces opaques ──
        surface: { 0: "#FFFFFF", 1: "#FAFAF8", 2: "#F3F1EB" },
        line: { DEFAULT: "#D8D5CB", strong: "#C4C0B2", input: "#8A8677" },

        // ── Texte ──
        // ink-3 #6B6D72 : 5.34:1 sur blanc — marge confortable au-dessus
        // du seuil AA (4.5:1).
        ink: { DEFAULT: "#14171C", 2: "#3F4147", 3: "#6B6D72" },

        // ── Semantique (verification) ──
        good: "#1F6F4A",
      },

      // ── Échelle typographique fermée ──
      // Neuf pas nommés par rôle. Le tracking est exprimé en `em` et non en
      // `px` : sur un titre en clamp(), un tracking en px se déforme selon la
      // taille rendue (l'ancien `tracking-[-2px]` sur le H1).
      fontSize: {
        // Échelle relevée le 23/09/2026 (refonte « studio », sur tout le
        // site) : le texte courant à 14 px était jugé trop petit, et les
        // titres trop timides pour une mise en page à la Locomotive.
        label: ["0.75rem", { lineHeight: "1.45", letterSpacing: "0.1em" }],
        caption: ["0.8125rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        lead: ["clamp(1.125rem, 1.4vw, 1.3125rem)", { lineHeight: "1.5" }],
        title: ["clamp(1.375rem, 1.7vw, 1.625rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        // Tracking : le slab en graisse 500 supporte -0.02em aux grandes
        // tailles (vérifié à l'écran) ; au-dessous, les empattements se
        // touchent, d'où des valeurs plus douces pour section.
        section: ["clamp(1.75rem, 3vw, 2.625rem)", { lineHeight: "1.1", letterSpacing: "-0.012em" }],
        display: ["clamp(2.125rem, 4.4vw, 4rem)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        hero: ["clamp(2.5rem, 5.6vw, 5.25rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
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
        sans: ["var(--font-sans)", '"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", '"IBM Plex Mono"', "ui-monospace", "monospace"],
        // Titres — slab mecanique (dossier, pas SaaS). Reserve aux h1/h2/h3
        // et aux moments ou le texte EST le dispositif visuel.
        display: ["var(--font-display)", '"IBM Plex Slab"', "serif"],
      },

      // Quasi plat — cartes-formulaire, pas cartes-SaaS. Les anciennes
      // valeurs (10-18px + ombres douces) donnaient l'aspect "kit de cartes"
      // que la refonte du 22/09/2026 retire explicitement.
      borderRadius: {
        uplyo: "3px",
        "uplyo-lg": "3px",
        card: "2px",
        panel: "3px",
      },

      boxShadow: {
        card: "none",
        raised: "none",
        panel: "none",
      },

      maxWidth: {
        wide: "1520px",
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
