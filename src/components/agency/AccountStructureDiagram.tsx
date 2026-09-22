import { X, Check } from "lucide-react";
import Reveal from "@/components/agency/Reveal";

const BEFORE = [
  "Une seule campagne « Google Ads », Search + Display + Shopping mélangés dedans",
  "Tous les mots-clés en requête large, zéro liste d'exclusions",
  "Marque, générique et concurrence achetés au même enchère, sans distinction",
  "Une seule action de conversion « Contact » — impossible de savoir si c'est un appel ou un formulaire",
  "Extensions d'annonces vides ou génériques, jamais retouchées depuis la création",
];

const AFTER = [
  "Campagnes séparées par intention : marque, générique, concurrence",
  "Recherche et Shopping/Performance Max isolés, chacun son budget",
  "Liste d'exclusions partagée, mots-clés en exact/expression sur ce qui convertit",
  "Une action de conversion par canal, valorisée différemment (appel ≠ formulaire ≠ vente en ligne)",
  "Extensions complètes : liens annexes, accroches, appel — retouchées à chaque test",
];

/**
 * Diagramme illustratif — PAS un audit d'un compte réel. Les deux colonnes
 * décrivent des patterns génériques et très courants (constatés dans le
 * métier, pas propres à un client identifiable), pour donner une idée
 * concrète de ce que « structurer un compte » veut dire avant qu'un
 * prospect ait vu le sien. Le libellé "Exemple type" doit rester visible :
 * c'est ce qui empêche la confusion avec un cas réel.
 */
export default function AccountStructureDiagram() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Reveal>
        <div className="bg-white border border-line rounded-card p-6 h-full">
          <div className="label text-ink-3 mb-4">Exemple type — avant</div>
          <ul className="flex flex-col gap-3">
            {BEFORE.map((t) => (
              <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                <X size={15} className="text-ink-3 shrink-0 mt-1" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="bg-white border border-line-strong rounded-card p-6 h-full">
          <div className="label text-eclat-ink mb-4">Exemple type — après structuration</div>
          <ul className="flex flex-col gap-3">
            {AFTER.map((t) => (
              <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                <Check size={15} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
