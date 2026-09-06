import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { MEDIA_FLOOR, OFFER_ROUTES, TERMS } from "@/lib/offers";

// Route conservée (/offres/retainer) : voir la note dans src/lib/offers.ts.
// Seul le libellé public change (« Le pilotage »).
export const metadata: Metadata = {
  title: "Le pilotage · Conduite du compte au mois",
  description:
    "Enchères, exclusions, tests d'annonces, alertes automatiques, rapport hebdomadaire. Mensuel, aucun engagement de durée, 30 jours de préavis.",
  alternates: { canonical: "/offres/retainer" },
};

// Un « mois type », semaine par semaine, plutôt qu'une grille de huit
// fonctionnalités interchangeables : ce qui est vendu ici, c'est du temps de
// travail récurrent, pas un catalogue.
const WEEKS = [
  {
    w: "Chaque semaine",
    t: "Le passage dans le compte",
    d: "Lecture du rapport de termes de recherche et ajout des exclusions, ajustement des enchères et de la répartition du budget, mise en pause de ce qui coûte sans convertir. C'est là que se joue l'essentiel du résultat.",
    out: "Rapport hebdomadaire, en une page",
  },
  {
    w: "Semaine 1",
    t: "Tests d'annonces",
    d: "Une nouvelle version d'annonce mise en test sur les groupes qui ont assez de volume pour trancher. Les gagnantes sont conservées, les perdantes retirées — sans se raconter d'histoires sur des écarts non significatifs.",
    out: "Journal des tests en cours",
  },
  {
    w: "Semaine 2",
    t: "Extension et élagage",
    d: "Recherche de nouvelles requêtes à couvrir, de nouvelles zones à ouvrir ou à fermer. Toute extension géographique passe d'abord par une vérification du volume et du coût au clic : on n'élargit pas une zone à l'aveugle.",
    out: "Liste des ajouts et des retraits",
  },
  {
    w: "Semaine 3",
    t: "Contrôle de la mesure",
    d: "Vérification que les conversions remontent toujours : une mise à jour de votre site, un changement de formulaire ou de bandeau cookies suffit à casser le suivi sans prévenir. Ce contrôle évite de piloter pendant des semaines sur des chiffres faux.",
    out: "Statut du tracking",
  },
  {
    w: "Fin de mois",
    t: "Bilan et point de 30 minutes",
    d: "Ce qui a été fait, ce que ça a donné, ce que je propose pour le mois suivant, et les arbitrages qui vous reviennent. En direct, pas dans un PDF que personne n'ouvre.",
    out: "Bilan mensuel + relevé de décisions",
  },
];

// Engagements de service, vérifiables contractuellement. Aucun résultat chiffré
// n'est promis ici : aucun chiffre client n'est publiable à ce jour.
const COMMITMENTS = [
  { k: "Engagement", v: "Aucune durée", d: "Ni période initiale, ni reconduction tacite piégeuse" },
  { k: "Préavis", v: "30 jours", d: "Le temps de vous rendre le compte en état de marche" },
  { k: "Rapport", v: "Hebdomadaire", d: "Plus un bilan mensuel et un point de 30 min" },
  { k: "Le compte", v: "Le vôtre", d: "À votre nom, vous partez avec l'historique" },
];

const ALERTS = [
  "Budget quotidien consommé anormalement vite",
  "Chute du volume de conversions par rapport aux semaines précédentes",
  "Annonce ou extension refusée par Google",
  "Campagne à l'arrêt (moyen de paiement, budget épuisé)",
];

export default function PilotagePage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text">
              <p className="label text-eclat-ink mb-4">
                Prestations · {OFFER_ROUTES.pilotage.label}
              </p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Quelqu&apos;un entre dans votre compte chaque semaine. Et vous savez ce qu&apos;il y
                a fait.
              </h1>
              <p className="text-lead text-ink-2 font-light mb-8">
                Un compte Google Ads laissé seul se dégrade : les requêtes dérivent, les concurrents
                changent d&apos;enchères, le suivi de conversions casse sans prévenir. Le pilotage,
                c&apos;est le travail qui empêche ça — au mois, sans engagement de durée.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <dl className="grid grid-cols-2 lg:grid-cols-4 border-t border-line">
              {[
                { k: "Honoraires", v: TERMS.fee, d: "Facturés au mois, devis sous 24 h" },
                { k: "Engagement", v: "Aucune durée", d: TERMS.notice },
                { k: "Rythme", v: "Hebdomadaire", d: "Plus un point de 30 min chaque mois" },
                {
                  k: "Budget publicitaire",
                  v: `${MEDIA_FLOOR.local} min.`,
                  d: `Réglé à Google · ${MEDIA_FLOOR.ecommerce} en e-commerce`,
                },
              ].map((s) => (
                <div key={s.k} className="py-5 pr-6 border-b border-line">
                  <dt className="label text-ink-3 mb-1.5">{s.k}</dt>
                  <dd>
                    <span className="block text-title font-semibold text-ink">{s.v}</span>
                    <span className="block text-caption text-ink-3 mt-1 font-light">{s.d}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Le mois type */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10">
              <p className="label text-eclat-ink mb-4">Un mois type</p>
              <h2 className="text-section font-semibold text-ink mb-3">
                Ce que je fais réellement, et quand
              </h2>
              <p className="text-body-lg text-ink-2 font-light">
                Pas une liste de fonctionnalités : le calendrier de travail auquel vous pouvez me
                tenir.
              </p>
            </div>
          </Reveal>

          <ol className="border-t border-line-strong">
            {WEEKS.map((s, i) => (
              <Reveal key={s.w} delay={i * 70}>
                <li className="grid grid-cols-1 md:grid-cols-[150px_1fr_260px] gap-3 md:gap-8 py-7 border-b border-line-strong">
                  <div className="font-mono text-body font-medium text-eclat-ink">{s.w}</div>
                  <div>
                    <h3 className="text-title font-semibold text-ink mb-2">{s.t}</h3>
                    <p className="text-body text-ink-2 font-light max-w-[62ch]">{s.d}</p>
                  </div>
                  <div>
                    <div className="label text-ink-3 mb-1.5">Ce qui vous arrive</div>
                    <div className="flex gap-2 text-body text-ink font-medium">
                      <Check size={14} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                      {s.out}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagements */}
      <section className="section bg-nuit">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-8">
              <p className="label text-spark mb-4">Ce sur quoi je m&apos;engage</p>
              <h2 className="text-section font-semibold text-white">
                Des engagements de méthode, pas de résultat
              </h2>
            </div>
          </Reveal>

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7 mb-10">
            {COMMITMENTS.map((c) => (
              <div key={c.k} className="border-l-2 border-spark pl-4">
                <dt className="label text-spark mb-1.5">{c.k}</dt>
                <dd>
                  <span className="block text-body-lg font-semibold text-white leading-snug">
                    {c.v}
                  </span>
                  <span className="block text-caption text-white/80 mt-1 font-light">{c.d}</span>
                </dd>
              </div>
            ))}
          </dl>

          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-white/[0.12] pt-8">
              <div>
                {/* « Monitoring 24/7 » retiré : la formule laissait entendre une
                    présence humaine permanente, ce qui est faux pour une
                    activité individuelle. Ce sont des alertes automatiques. */}
                <h3 className="text-title font-semibold text-white mb-3">Alertes automatiques</h3>
                <p className="text-body text-white/80 font-light mb-4">
                  Des scripts tournent sur le compte et me préviennent en dehors de mes passages
                  hebdomadaires. Ce ne sont pas des yeux humains en permanence sur votre compte : je
                  suis seul, et je ne prétendrai pas le contraire.
                </p>
                <ul className="flex flex-col gap-2">
                  {ALERTS.map((a) => (
                    <li key={a} className="flex gap-2.5 text-body text-white/80 font-light">
                      <Check size={14} className="text-spark shrink-0 mt-1.5" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-title font-semibold text-white mb-3">
                  Ce que je ne peux pas vous garantir
                </h3>
                <p className="text-body text-white/80 font-light mb-4">
                  Ni un coût par demande, ni un nombre de ventes, ni un retour sur investissement
                  chiffré. Ces promesses circulent beaucoup dans le métier ; elles supposent de
                  connaître à l&apos;avance la concurrence, la saison et votre taux de
                  transformation. Personne ne les connaît.
                </p>
                <p className="text-body text-white/80 font-light">
                  Ce que je peux vous garantir, c&apos;est le travail listé ci-dessus, et le fait de
                  vous dire quand une campagne ne fonctionne pas.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preuve de travail */}
      <section className="section">
        <div className="container-text">
          <Reveal>
            <p className="label text-eclat-ink mb-4">Transparence</p>
            <h2 className="text-section font-semibold text-ink mb-4">Un seul client à ce jour</h2>
            <p className="text-body-lg text-ink-2 font-light mb-4">
              Une entreprise de débarras et déménagement de la région nantaise, accompagnée depuis
              2026 : gestion mensuelle du compte, étude de volume avant toute extension de zone, et
              reprise du site côté conversion.
            </p>
            <p className="text-body-lg text-ink-2 font-light">
              Ses résultats chiffrés lui appartiennent. Ils seront publiés ici quand il m&apos;aura
              donné son accord — vous ne trouverez d&apos;ici là ni moyenne, ni témoignage, ni note
              inventée pour combler le vide.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-4">
            Je regarde d&apos;abord votre compte
          </h2>
          <p className="text-lead text-white font-light mb-8">
            L&apos;audit gratuit sert à savoir si votre compte est pilotable en l&apos;état ou
            s&apos;il faut le refaire. C&apos;est écrit, et c&apos;est sous 48 h ouvrées.
          </p>
          <Link href="/audit" className="btn-invert">
            Recevoir mon audit gratuit
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <p className="text-body text-white font-light mt-6">
            Ou{" "}
            <Link href="/offres" className="text-white font-semibold underline underline-offset-4">
              comparer le setup et le pilotage
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
