"use client";

// Faits de service vérifiables uniquement — aucune statistique de résultat
// tant qu'aucun chiffre client n'est publiable (accord client requis).
const ITEMS = [
  { text: "Audit gratuit sous 48h", dot: true },
  { text: "Go-live en 5 jours", dot: true },
  { text: "Accès direct à l'expert", dot: true },
  { text: "Vous restez propriétaire du compte", dot: true },
  { text: "Dashboard Looker Studio", dot: true },
  { text: "Tracking GA4 + Consent Mode", dot: true },
  { text: "Scripts d'automation", dot: true },
  { text: "Rapports hebdo + mensuel", dot: true },
];

export default function Ticker() {
  // Double the items for infinite scroll effect
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-eclat overflow-hidden">
      <div className="flex animate-ticker w-max hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 py-3 border-r border-white/15 whitespace-nowrap text-[13px] font-medium text-white/85"
          >
            {item.dot && (
              <span className="text-white/40 text-[8px]">◆</span>
            )}
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
