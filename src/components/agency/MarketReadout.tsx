import { Megaphone, MonitorSmartphone } from "lucide-react";
import type { MarketStat } from "@/lib/market-data";
import { SCAN, publishable } from "@/lib/market-data";

/**
 * Relevé à deux dimensions, partagé par les pages sectorielles et les pages
 * de villes.
 *
 * Pourquoi deux dimensions et pas une : un compte Google Ads et le site sur
 * lequel il envoie sont un seul et même dispositif. Une entreprise qui
 * diffuse des annonces vers une page sans moyen de contact, ou qui dépense
 * sans aucun outil de mesure, perd son budget de deux façons différentes.
 * Afficher les deux côte à côte est ce qui rend le relevé utile plutôt que
 * décoratif.
 *
 * Règle conservée : le pourcentage n'apparaît qu'au-dessus de MIN_SAMPLE ;
 * en dessous, seuls les comptages bruts sont montrés, et l'effectif est
 * toujours visible à côté du chiffre.
 */

function Line({
  n,
  total,
  label,
  showPct,
}: {
  n: number;
  total: number;
  label: string;
  /** Faux sous MIN_SAMPLE : voir la regle rappelee plus haut. */
  showPct: boolean;
}) {
  const pct = Math.round((n / total) * 100);
  return (
    <li className="flex items-baseline gap-3 py-2 border-b border-line last:border-0">
      <span className="font-mono text-body-lg font-semibold text-ink shrink-0 tabular-nums">
        {n}
        <span className="text-caption text-ink-3 font-normal">/{total}</span>
      </span>
      <span className="text-body text-ink-2 font-light flex-1">{label}</span>
      {showPct && <span className="label text-eclat-ink shrink-0 tabular-nums">{pct} %</span>}
    </li>
  );
}

export default function MarketReadout({
  stat,
  label,
}: {
  stat: MarketStat;
  /** Ce que compte l'échantillon : « auto-écoles », « entreprises lyonnaises »… */
  label: string;
}) {
  const n = stat.scanned;
  // La regle etait ecrite plus haut mais n'etait appliquee nulle part : `Line`
  // affichait le pourcentage quel que soit l'effectif. Aucun releve publie
  // aujourd'hui n'est sous MIN_SAMPLE (le plus petit echantillon est de 27),
  // l'affichage actuel est donc inchange — mais le garde-fou existe desormais
  // pour de vrai, au lieu d'etre seulement documente.
  const showPct = publishable(stat);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* h2 et non h3 : ce releve est place juste sous le h1 de la page, sans
          titre intermediaire. Un h3 y creait un saut h1 -> h3 sur les neuf
          pages qui affichent le composant. */}
      <div className="bg-white border border-line rounded-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Megaphone size={18} className="text-eclat-ink shrink-0" aria-hidden="true" />
          <h2 className="text-title font-semibold text-ink">Côté publicité</h2>
        </div>
        <ul className="list-none p-0 m-0">
          <Line n={stat.advertisers} total={n} showPct={showPct} label="diffusent des annonces Google Ads détectables" />
          <Line n={stat.noAnalytics} total={n} showPct={showPct} label="n'ont aucun outil de mesure d'audience" />
        </ul>
      </div>

      <div className="bg-white border border-line rounded-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <MonitorSmartphone size={18} className="text-eclat-ink shrink-0" aria-hidden="true" />
          <h2 className="text-title font-semibold text-ink">Côté site</h2>
        </div>
        <ul className="list-none p-0 m-0">
          <Line n={stat.noContact} total={n} showPct={showPct} label="n'ont ni formulaire ni lien d'appel sur l'accueil" />
          <Line n={stat.noH1} total={n} showPct={showPct} label="n'ont pas de titre principal exploitable" />
        </ul>
      </div>

      <p className="md:col-span-2 text-caption text-ink-3 font-light">
        Relevé Uplyo, {SCAN.date} · {n} {label} analysées
        {!publishable(stat) && " · échantillon réduit, à lire en comptages plutôt qu'en proportions"}.
        La détection publicitaire lit le conteneur Google Tag Manager public : une campagne sans
        suivi de conversion échappe au comptage, donc le nombre d&apos;annonceurs est un plancher.
        Les contrôles du site portent sur la page d&apos;accueil. Aucune entreprise n&apos;est
        nommée.
      </p>
    </div>
  );
}
