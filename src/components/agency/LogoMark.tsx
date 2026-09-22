// Marque Uplyo : un « u » dans un tampon rond, rouge éclat sur papier.
// Remplace les trois losanges (22/09/2026) qui ne tenaient pas en petite
// taille : décentrés, ils devenaient trois taches à 16–48 px dans l'onglet
// et dans les résultats Google. Un seul signe, centré sur la grille 36×36,
// reste lisible jusqu'à la favicon.
//
// Tracé dupliqué à l'identique dans public/favicon.svg et
// scripts/logo/mark.svg (sources des PNG et du .ico) : à modifier ensemble.
export const LOGO_RED = "#C0361C";
export const LOGO_PAPER = "#F6F5F1";

export default function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill={LOGO_RED} />
      <path
        d="M12.5 10.5V19.5a5.5 5.5 0 0 0 11 0V10.5M23.5 19.5V25.5"
        stroke={LOGO_PAPER}
        strokeWidth="4"
      />
    </svg>
  );
}
