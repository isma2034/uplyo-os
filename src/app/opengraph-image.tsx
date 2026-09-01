import { ImageResponse } from "next/og";

// `layout.tsx` déclarait `twitter: { card: "summary_large_image" }` alors
// qu'aucune image n'existait nulle part (aucun dossier public/) : tout partage
// du lien affichait une carte vide. Image générée ici via next/og — pas de
// binaire à maintenir, elle suit les tokens de la charte.
export const runtime = "nodejs";
export const alt = "Uplyo — Google Ads pour PME de services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1A1040",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 36 36">
            <polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7" />
            <polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88" />
            <polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            uplyo
          </div>
        </div>

        {/* Promesse */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              color: "#FDCB6E",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 26,
            }}
          >
            Google Ads · PME de services
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              maxWidth: 900,
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
            gap: 28,
            fontSize: 24,
            color: "#FFFFFF",
            borderTop: "2px solid #6C5CE7",
            paddingTop: 26,
          }}
        >
          <span>Audit gratuit sous 48h</span>
          <span style={{ color: "#A29BFE" }}>·</span>
          <span>Aucun engagement de durée</span>
          <span style={{ color: "#A29BFE" }}>·</span>
          <span>uplyo.fr</span>
        </div>
      </div>
    ),
    size
  );
}
