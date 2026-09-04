import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { MEDIA_FLOOR, OFFER_ROUTES, TERMS } from "@/lib/offers";

// Route conservée (/offres/pack-lancement) : la renommer en /offres/setup
// imposerait des redirections pour un gain nul, le site n'ayant pas encore
// d'historique d'indexation. Seul le libellé public change (« Le setup »).
export const metadata: Metadata = {
  title: "Le setup · Construction du compte Google Ads en 5 jours",
  description:
    "Audit, structure de campagnes, annonces, GA4 et Consent Mode v2, tableau de bord Looker Studio. Cinq jours ouvrés, prestation unique, aucun engagement.",
  alternates: { canonical: "/offres/pack-lancement" },
};

const PLAN = [
  {
    day: "J0",
    t: "Appel de cadrage",
    d: "30 minutes. Ce que vous vendez, à qui, dans quelle zone, à quel prix, avec quel budget. Je vous dis dès cet appel si Google Ads est pertinent chez vous — et si la réponse est non, on s'arrête là.",
    out: ["Compte-rendu écrit du cadrage", "Budget publicitaire conseillé"],
  },
  {
    day: "J1",
    t: "Audit et plan de campagne",
    d: "Recherche des requêtes réellement tapées par vos clients, avec leurs volumes et leur coût au clic. Relevé des annonceurs déjà présents sur ces requêtes. Choix de la structure et de la répartition du budget.",
    out: ["Liste de mots-clés chiffrée", "Le plan de campagne écrit"],
  },
  {
    day: "J2–J3",
    t: "Construction du compte",
    d: "Campagnes, groupes d'annonces, mots-clés, exclusions, rédaction des annonces responsives, extensions (appel, liens, lieu). Tout est construit dans un compte ouvert à votre nom.",
    out: ["Le compte construit", "Les annonces rédigées et soumises"],
  },
  {
    day: "J4",
    t: "Mesure",
    d: "GA4 et Consent Mode v2, définition des conversions, puis test réel de chacune : j'appelle le numéro, j'envoie le formulaire, et je vérifie que cela remonte bien une fois et une seule. C'est l'étape la plus souvent bâclée, et celle qui fausse tout le reste.",
    out: ["Tracking testé, pas seulement posé", "Capture de chaque conversion vérifiée"],
  },
  {
    day: "J5",
    t: "Mise en ligne et passation",
    d: "Lancement, tableau de bord Looker Studio branché sur le compte, transmission des accès et explication de ce qui tourne. Vous savez lire vos propres chiffres en repartant.",
    out: ["Campagnes en ligne", "Tableau de bord + accès administrateur"],
  },
];

const NOT_INCLUDED = [
  "Le budget publicitaire : vous le réglez directement à Google, je ne le facture pas et ne prends pas de commission dessus.",
  "La refonte de votre site. Je vous signale ce qui bloque la conversion, mais le setup ne comprend pas de travaux sur le site.",
  "Le SEO et les réseaux sociaux : ce n'est pas mon métier.",
  "La conduite du compte après le lancement — c'est l'objet du pilotage, qui se prend séparément.",
];

export default function SetupPage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text">
              <p className="label text-eclat-ink mb-4">
                Prestations · {OFFER_ROUTES.setup.label}
              </p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Le compte construit en cinq jours, et vous voyez ce qui sort chaque jour.
              </h1>
              <p className="text-lead text-ink-2 font-light mb-8">
                De l&apos;audit à la mise en ligne. Prestation unique : à la fin, le compte est à
                votre nom, il tourne, et vous êtes libre de le piloter vous-même.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <dl className="grid grid-cols-2 lg:grid-cols-4 border-t border-line">
              {[
                { k: "Honoraires", v: TERMS.fee, d: "Facturés une fois, devis sous 24 h" },
                { k: "Durée", v: TERMS.goLive, d: "De l'appel de cadrage à la mise en ligne" },
                { k: "Engagement", v: "Aucun", d: "Le pilotage se décide après, ou pas" },
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

      {/* Timeline J0 → J5 */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10">
              <p className="label text-eclat-ink mb-4">Le plan de travail</p>
              <h2 className="text-section font-semibold text-ink">Jour par jour, livrable par livrable</h2>
            </div>
          </Reveal>

          <ol className="border-t border-line-strong">
            {PLAN.map((s, i) => (
              <Reveal key={s.day} delay={i * 70}>
                <li className="grid grid-cols-1 md:grid-cols-[92px_1fr_300px] gap-3 md:gap-8 py-7 border-b border-line-strong">
                  <div className="font-mono text-body font-medium text-eclat-ink">{s.day}</div>
                  <div>
                    <h3 className="text-title font-semibold text-ink mb-2">{s.t}</h3>
                    <p className="text-body text-ink-2 font-light max-w-[62ch]">{s.d}</p>
                  </div>
                  <div>
                    <div className="label text-ink-3 mb-2">Livrables</div>
                    <ul className="flex flex-col gap-1.5">
                      {s.out.map((o) => (
                        <li key={o} className="flex gap-2 text-body text-ink font-medium">
                          <Check size={14} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Ce qui n'est pas compris */}
      <section className="section-tight bg-nuit">
        <div className="container-wide">
          <h2 className="label text-spark mb-6">Ce qui n&apos;est pas compris</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            {NOT_INCLUDED.map((t) => (
              <li key={t} className="flex gap-3 text-body-lg text-white/80 font-light">
                <span aria-hidden="true" className="text-spark shrink-0 leading-7">
                  —
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Suite */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal>
            <div className="border border-line rounded-card p-6 bg-white h-full">
              <div className="label text-ink-3 mb-3">Et après ?</div>
              <h2 className="text-title font-semibold text-ink mb-2">{OFFER_ROUTES.pilotage.label}</h2>
              <p className="text-body text-ink-2 font-light mb-5">
                Un compte lancé se dégrade s&apos;il n&apos;est pas suivi : les requêtes évoluent, les
                concurrents changent d&apos;enchères. Le pilotage prend le relais au mois, sans
                engagement de durée. Vous pouvez aussi vous en charger vous-même.
              </p>
              <Link
                href={OFFER_ROUTES.pilotage.href}
                className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
              >
                Le détail du pilotage
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-line rounded-card p-6 bg-white h-full">
              <div className="label text-ink-3 mb-3">Comparer</div>
              <h2 className="text-title font-semibold text-ink mb-2">Setup ou pilotage</h2>
              <p className="text-body text-ink-2 font-light mb-5">
                Le tableau comparatif, avec les durées, les engagements et le budget publicitaire
                minimum de chaque côté.
              </p>
              <Link
                href="/offres"
                className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
              >
                Voir le comparatif
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-4">
            Le setup commence par l&apos;audit
          </h2>
          <p className="text-lead text-white font-light mb-8">
            Gratuit, écrit, sous 48 h ouvrées. Il sert d&apos;abord à savoir si votre marché justifie un
            budget publicitaire.
          </p>
          <Link href="/audit" className="btn-invert">
            Demander mon audit
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
