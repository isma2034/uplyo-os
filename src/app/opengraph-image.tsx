import { ImageResponse } from "next/og";

// `layout.tsx` déclarait `twitter: { card: "summary_large_image" }` alors
// qu'aucune image n'existait nulle part (aucun dossier public/) : tout partage
// du lien affichait une carte vide. Image générée ici via next/og — pas de
// binaire à maintenir, elle suit les tokens de la charte.
export const runtime = "nodejs";
export const alt = "Uplyo — Consultant Google Ads indépendant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  // Palette « papier / encre / rouge éclat » de la refonte du 22/09/2026 :
  // l'image restait sur l'ancien fond violet et les trois losanges.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F5F1",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#14171C",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="18" fill="#C0361C" />
            <path
              d="M12.5 10.5V19.5a5.5 5.5 0 0 0 11 0V10.5M23.5 19.5V25.5"
              stroke="#F6F5F1"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>uplyo</div>
        </div>

        {/* Promesse */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#A32C16", marginBottom: 24 }}>
            Consultant Google Ads indépendant
          </div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              maxWidth: 980,
            }}
          >
            Je gère vos campagnes Google Ads. Vous voyez exactement ce que je fais.
          </div>
        </div>

        {/* Pied */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            fontSize: 24,
            color: "#3F4147",
            borderTop: "2px solid #14171C",
            paddingTop: 26,
          }}
        >
          <span>Audit gratuit sous 48 h ouvrées</span>
          <span>Aucun engagement de durée</span>
          <span style={{ marginLeft: "auto", color: "#14171C" }}>uplyo.fr</span>
        </div>
      </div>
    ),
    size
  );
}
