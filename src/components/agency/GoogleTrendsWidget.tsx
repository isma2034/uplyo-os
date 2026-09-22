"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Trends, données réelles — intérêt de recherche mesuré par Google
 * lui-même, sur les 12 derniers mois, France. Rien ici n'est calculé ou
 * affirmé par Uplyo : c'est le même principe que market-data.ts (une mesure
 * plutôt qu'une estimation), appliqué à un tiers qui la publie déjà.
 *
 * Rendu en iframe (srcdoc) plutôt qu'en script injecté dans la page : le
 * script Google (`trends.embed.renderExploreWidget`) se repère via
 * `document.currentScript`, qui ne survit pas à un chargement dynamique
 * après coup. Dans une iframe, les deux balises <script> restent statiques
 * — exactement la forme que génère l'outil "Intégrer" de Google Trends —
 * donc le ciblage fonctionne sans avoir à deviner sa mécanique interne.
 * Isole aussi le script tiers du reste de la page (perf, sécurité).
 *
 * Chargement automatique au scroll (IntersectionObserver, même seuil que
 * `Reveal`) plutôt qu'au clic : décision explicite d'Ismael le 22/09/2026,
 * en connaissance de cause — ce script n'est PAS couvert par la bannière de
 * consentement existante (ConsentBanner ne gère que la mesure d'audience
 * Uplyo, pas les scripts tiers embarqués). Si ça doit un jour rentrer dans
 * le périmètre RGPD du site, ajouter une vraie catégorie de consentement
 * plutôt que de réutiliser `analytics_storage`, qui couvre autre chose.
 */
export default function GoogleTrendsWidget({
  keyword,
  label,
  geo = "FR",
  geoLabel = "France",
}: {
  keyword: string;
  /** Nom affiché au-dessus du graphique — peut différer du mot-clé recherché. */
  label: string;
  /** Code géo Google Trends — "FR" (national) ou une région ISO 3166-2:FR
   * ("FR-NAQ" pour la Nouvelle-Aquitaine, etc.) pour un relevé local. */
  geo?: string;
  /** Nom affiché correspondant à `geo` — "France", "Nouvelle-Aquitaine"... */
  geoLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8">
    <style>body{margin:0;font-family:Arial,sans-serif}</style></head>
    <body>
      <div id="trends-widget"></div>
      <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/4564_RC01/embed_loader.js"></script>
      <script type="text/javascript">
        trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":${JSON.stringify(
          keyword,
        )},"geo":${JSON.stringify(geo)},"time":"today 5-y"}],"category":0,"property":""}, {"exploreQuery":${JSON.stringify(
    `geo=${geo}&q=${encodeURIComponent(keyword)}&hl=fr&date=today 5-y`,
  )},"guestPath":"https://trends.google.com:443/trends/embed/"});
      </script>
    </body></html>`;

  return (
    <div className="bg-white border border-line rounded-card p-6">
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h3 className="text-title font-semibold text-ink">{label}</h3>
        <span className="label text-ink-3 shrink-0">Google Trends · {geoLabel} · 5 ans</span>
      </div>
      <div ref={ref} className="mt-4" style={{ minHeight: loaded ? undefined : 320 }}>
        {loaded && (
          <iframe
            title={`Tendances Google pour ${keyword}`}
            srcDoc={srcDoc}
            className="w-full border-0"
            height={320}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}
