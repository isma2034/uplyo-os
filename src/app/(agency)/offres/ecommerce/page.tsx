import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { MEDIA_FLOOR, OFFER_ROUTES } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Module e-commerce · Shopping et Perf. Max",
  description:
    "Shopping, Performance Max et flux produit, en complément du pilotage. Budget publicitaire minimum 1 000 €/mois.",
  alternates: { canonical: "/offres/ecommerce" },
};

const WORK = [
  {
    t: "Flux produit",
    d: "Titres, descriptions, GTIN, catégories Google, règles de flux. Un flux mal renseigné suffit à rendre invisibles la moitié des produits : c'est le premier endroit où je regarde, avant même les enchères.",
  },
  {
    t: "Shopping",
    d: "Segmentation des campagnes par catégorie et par performance produit, pour que les références qui marchent ne financent pas indéfiniment celles qui ne se vendent pas.",
  },
  {
    t: "Performance Max",
    d: "Groupes d'assets séparés, signaux d'audience renseignés, et séparation du trafic de marque du reste — sans quoi la campagne s'attribue vos ventes déjà acquises et paraît excellente sans rien apporter.",
  },
  {
    t: "Valeur de conversion",
    d: "Remontée de la valeur d'achat réelle dans GA4 et dans Google Ads, par produit et par catégorie. Sans elle, les enchères automatiques optimisent un nombre de commandes, pas un chiffre d'affaires.",
  },
  {
    t: "Tableau de bord",
    d: "Looker Studio orienté e-commerce : retour sur dépense publicitaire par campagne, produits qui portent le chiffre, produits qui consomment du budget sans vendre.",
  },
];

const HONEST = [
  {
    q: "Ce module ne se prend pas seul",
    a: "Il vient s'ajouter au pilotage, sur un compte déjà construit. Ce n'est pas une troisième formule qui viendrait concurrencer les deux autres, et vous ne choisissez pas entre « pilotage » et « e-commerce ».",
  },
  {
    q: `Le budget publicitaire minimum passe à ${MEDIA_FLOOR.ecommerce}`,
    a: "Un catalogue disperse le budget sur beaucoup plus de requêtes qu'une activité de services. En dessous de ce seuil, aucune référence n'accumule assez de données pour que l'on puisse arbitrer entre elles.",
  },
  {
    q: "Ce n'est pas là que se trouve ma preuve",
    a: "Mon expérience documentée porte sur une PME de services, pas sur une boutique en ligne. Les compétences (flux, Shopping, valeur de conversion) sont les mêmes techniquement, mais je préfère vous le dire avant plutôt que de laisser croire à un historique e-commerce que je n'ai pas.",
  },
  {
    q: "Je ne touche pas à votre boutique",
    a: "Je vous signale ce qui freine la conversion sur vos fiches produit ou votre tunnel, mais les modifications sur la boutique elle-même ne font pas partie du module.",
  },
];

export default function EcommercePage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text">
              <p className="label text-eclat-ink mb-4">
                Prestations · {OFFER_ROUTES.ecommerce.label}
              </p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Shopping et Performance Max, en complément du pilotage.
              </h1>
              <p className="text-lead text-ink-2 font-light mb-8">
                Si vous vendez en ligne, le travail sur le flux produit et sur la valeur de
                conversion s&apos;ajoute au pilotage mensuel. Ce module n&apos;existe pas seul :
                il vient compléter la gestion du compte, pas la remplacer.
              </p>
              <Link
                href={OFFER_ROUTES.pilotage.href}
                className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
              >
                Voir d&apos;abord le pilotage
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ce qui s'ajoute */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10">
              <p className="label text-eclat-ink mb-4">Ce qui s&apos;ajoute</p>
              <h2 className="text-section font-semibold text-ink">
                Cinq chantiers propres à la vente en ligne
              </h2>
            </div>
          </Reveal>

          <ol className="border-t border-line-strong">
            {WORK.map((w, i) => (
              <Reveal key={w.t} delay={i * 70}>
                <li className="grid grid-cols-1 md:grid-cols-[64px_1fr] gap-3 md:gap-8 py-6 border-b border-line-strong">
                  <div className="font-mono text-body font-medium text-eclat-ink">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-title font-semibold text-ink mb-2">{w.t}</h3>
                    <p className="text-body text-ink-2 font-light max-w-[68ch]">{w.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* À savoir avant */}
      <section className="section bg-nuit">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-8">
              <p className="label text-spark mb-4">À savoir avant de demander</p>
              <h2 className="text-section font-semibold text-white">
                Quatre choses que je préfère dire tout de suite
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
            {HONEST.map((h) => (
              <div key={h.q} className="border-l-2 border-spark pl-4">
                <h3 className="text-body-lg font-semibold text-white mb-2">{h.q}</h3>
                <p className="text-body text-white/80 font-light">{h.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal>
            <div className="bg-white border border-line rounded-card p-6 h-full">
              <div className="label text-eclat-ink mb-4">C&apos;est cohérent si</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Vous avez une boutique en ligne qui vend déjà, même modestement",
                  `Votre budget publicitaire atteint au moins ${MEDIA_FLOOR.ecommerce}`,
                  "Votre catalogue et vos stocks sont à jour et exploitables en flux",
                  "Vous voulez piloter sur le chiffre d'affaires, pas sur le nombre de clics",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                    <Check size={15} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="bg-surface-2 border border-line rounded-card p-6 h-full">
              <div className="label text-ink-3 mb-4">Ça ne l&apos;est pas si</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Vous lancez la boutique et n'avez encore aucune vente : le travail utile est ailleurs",
                  "Vous cherchez un prestataire qui garantit un retour sur dépense publicitaire chiffré",
                  "Vous attendez une refonte de vos fiches produit : ce n'est pas mon métier",
                  "Vous voulez confier aussi Meta, TikTok ou Amazon : je ne fais que Google Ads",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                    <span aria-hidden="true" className="text-ink-3 font-semibold shrink-0 leading-6">
                      —
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-4">
            L&apos;audit regarde d&apos;abord votre flux
          </h2>
          <p className="text-lead text-white font-light mb-8">
            Gratuit, écrit, sous 48 h ouvrées : état du flux produit, structure Shopping et Performance Max,
            fiabilité de la valeur de conversion.
          </p>
          <Link href="/audit" className="btn-invert">
            Recevoir mon audit gratuit
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
