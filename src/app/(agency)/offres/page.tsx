import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { MEDIA_FLOOR, OFFER_ROUTES, TERMS } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Offres · Setup et pilotage Google Ads",
  description:
    "Deux prestations : la construction du compte en 5 jours, puis sa conduite au mois. Aucun engagement de durée, budget publicitaire minimum 500 €/mois.",
  alternates: { canonical: "/offres" },
};

const SEQUENCE = [
  {
    n: "1",
    t: "L'audit",
    d: "Gratuit, sous 48 h ouvrées. Je regarde votre marché, les concurrents présents sur vos requêtes et, si le compte existe déjà, ce qu'il contient. Vous repartez avec le rapport, que l'on travaille ensemble ensuite ou non.",
    href: "/audit",
    cta: "Demander l'audit",
  },
  {
    n: "2",
    t: OFFER_ROUTES.setup.label,
    d: "La construction du compte, de la recherche de mots-clés au tableau de bord. Cinq jours ouvrés. Prestation unique : si vous voulez ensuite piloter vous-même, c'est possible, vous avez tout en main.",
    href: OFFER_ROUTES.setup.href,
    cta: "Le détail du setup",
  },
  {
    n: "3",
    t: OFFER_ROUTES.pilotage.label,
    d: "La conduite du compte au mois : enchères, exclusions, tests d'annonces, rapports. Se prend après le setup, ou sur un compte existant construit par quelqu'un d'autre.",
    href: OFFER_ROUTES.pilotage.href,
    cta: "Le détail du pilotage",
  },
];

type Row = { label: string; setup: string; pilotage: string; strong?: boolean };

const ROWS: Row[] = [
  { label: "Ce que c'est", setup: "Construire le compte de zéro", pilotage: "Conduire le compte au mois" },
  { label: "Durée", setup: `${TERMS.goLive}, de J0 à J5`, pilotage: "Mensuel, sans échéance" },
  { label: "Engagement", setup: "Aucun", pilotage: `Aucun · ${TERMS.notice.toLowerCase()}` },
  { label: "Honoraires", setup: "Sur devis, facturés une fois", pilotage: "Sur devis, facturés au mois" },
  {
    label: "Budget publicitaire minimum",
    setup: `${MEDIA_FLOOR.local} · ${MEDIA_FLOOR.ecommerce} en e-commerce`,
    pilotage: `${MEDIA_FLOOR.local} · ${MEDIA_FLOOR.ecommerce} en e-commerce`,
    strong: true,
  },
  {
    label: "Ce qui est livré",
    setup: "Le compte construit, le tracking vérifié, le tableau de bord Looker Studio, la passation",
    pilotage: "Rapport hebdomadaire, bilan mensuel, point stratégique de 30 min chaque mois",
  },
  {
    label: "C'est pour vous si",
    setup: "Vous partez de zéro, ou le compte existant est à refaire",
    pilotage: "Le compte tourne et personne ne s'en occupe sérieusement",
  },
];

const FAQ = [
  {
    q: "Puis-je prendre le pilotage sans le setup ?",
    a: "Oui, si votre compte est déjà construit et exploitable. Je le vérifie pendant l'audit gratuit. S'il est trop mal structuré pour être piloté en l'état, je vous le dis, et il faut alors passer par le setup — je ne facture pas un pilotage mensuel sur un compte que je sais bancal.",
  },
  {
    q: "Puis-je prendre le setup seul et gérer moi-même ensuite ?",
    a: "Oui. Le compte est à votre nom, la documentation et le tableau de bord vous restent. C'est un cas de figure prévu, pas une exception que je vous ferai regretter.",
  },
  {
    q: "Pourquoi les honoraires ne sont-ils pas affichés ?",
    a: "Parce qu'ils dépendent du nombre de campagnes, de la taille de la zone à couvrir et de l'état du compte de départ, et qu'un prix affiché au hasard serait faux pour la plupart des situations. Le devis part sous 24 h après l'appel de cadrage et ne vous engage à rien. Le budget publicitaire minimum, lui, est indiqué ci-dessus : c'est le chiffre qui détermine si cela vaut le coup de commencer.",
  },
  {
    q: `Pourquoi un minimum de ${MEDIA_FLOOR.local} de budget publicitaire ?`,
    a: "En dessous, le compte ne récolte pas assez de clics et de conversions pour que l'on puisse décider de quoi que ce soit sur des données solides : on optimiserait à l'aveugle, et vous paieriez des honoraires pour ça. Ce n'est pas un seuil commercial, c'est un seuil statistique.",
  },
  {
    q: "Le budget publicitaire passe-t-il par vous ?",
    a: "Non, jamais. Vous le réglez directement à Google avec votre propre moyen de paiement. Je ne prends aucune commission sur vos dépenses publicitaires, donc je n'ai aucun intérêt à ce que vous dépensiez davantage.",
  },
  {
    q: "Et si j'arrête ?",
    a: `${TERMS.notice}. Pendant ce préavis, je vous rends le compte en état de marche et je vous explique ce qui tourne. Vous restez propriétaire du compte et de tout l'historique.`,
  },
];

export default function OffresPage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text">
              <p className="label text-eclat-ink mb-4">Les prestations</p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Deux prestations, dans l&apos;ordre. Pas trois formules qui se ressemblent.
              </h1>
              <p className="text-lead text-ink-2 font-light">
                On construit le compte, puis on le conduit. L&apos;audit gratuit sert à décider
                laquelle des deux vous concerne — et s&apos;il faut commencer, tout simplement.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Séquence */}
      <section className="section-tight">
        <div className="container-wide">
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SEQUENCE.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <li className="bg-white border border-line rounded-card p-6 h-full flex flex-col shadow-card">
                  <div className="label text-ink-3 mb-3">Étape {s.n}</div>
                  <h2 className="text-title font-semibold text-ink mb-2">{s.t}</h2>
                  <p className="text-body text-ink-2 font-light flex-1 mb-5">{s.d}</p>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                  >
                    {s.cta}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-8 md:mb-10">
              <p className="label text-eclat-ink mb-4">Comparatif</p>
              <h2 className="text-section font-semibold text-ink mb-3">Setup ou pilotage</h2>
              <p className="text-body-lg text-ink-2 font-light">
                Deux lignes de coût à ne pas confondre : le budget publicitaire, que vous réglez à
                Google, et mes honoraires. Seul le premier a un plancher.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto bg-white border border-line rounded-card">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">
                  Comparaison du setup et du pilotage : durée, engagement, honoraires, budget
                  publicitaire minimum et livrables.
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="label text-ink-3 p-4 w-[26%]">
                      <span className="sr-only">Critère</span>
                    </th>
                    <th scope="col" className="p-4 text-title font-semibold text-ink align-bottom">
                      {OFFER_ROUTES.setup.label}
                      <span className="block label text-ink-3 mt-1">
                        {OFFER_ROUTES.setup.short}
                      </span>
                    </th>
                    <th scope="col" className="p-4 text-title font-semibold text-ink align-bottom">
                      {OFFER_ROUTES.pilotage.label}
                      <span className="block label text-ink-3 mt-1">
                        {OFFER_ROUTES.pilotage.short}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label} className={`border-b border-line ${r.strong ? "bg-lune" : ""}`}>
                      <th scope="row" className="p-4 align-top text-body font-medium text-ink">
                        {r.label}
                      </th>
                      <td
                        className={`p-4 align-top text-body font-light ${
                          r.strong ? "text-ink font-medium" : "text-ink-2"
                        }`}
                      >
                        {r.setup}
                      </td>
                      <td
                        className={`p-4 align-top text-body font-light ${
                          r.strong ? "text-ink font-medium" : "text-ink-2"
                        }`}
                      >
                        {r.pilotage}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4" />
                    <td className="p-4">
                      <Link
                        href={OFFER_ROUTES.setup.href}
                        className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                      >
                        Le détail du setup
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link
                        href={OFFER_ROUTES.pilotage.href}
                        className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                      >
                        Le détail du pilotage
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Add-on e-commerce */}
          <Reveal>
            <div className="mt-5 bg-white border border-line rounded-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="label text-ink-3 mb-2">En complément</div>
                <div className="text-body-lg font-semibold text-ink mb-1">
                  {OFFER_ROUTES.ecommerce.label}
                </div>
                <p className="text-body text-ink-2 font-light max-w-[64ch]">
                  Google Shopping, Performance Max et flux produit viennent s&apos;ajouter au
                  pilotage quand vous vendez en ligne. Ce n&apos;est pas une troisième formule
                  concurrente, et le budget publicitaire minimum y passe à {MEDIA_FLOOR.ecommerce}.
                </p>
              </div>
              <Link
                href={OFFER_ROUTES.ecommerce.href}
                className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4 whitespace-nowrap"
              >
                Voir le module
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ce qui est vrai des deux */}
      <section className="section-tight bg-nuit">
        <div className="container-wide">
          <h2 className="label text-spark mb-6">Valable dans les deux cas</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            {[
              "Le compte Google Ads est ouvert à votre nom et vous en restez propriétaire.",
              "Le budget publicitaire est réglé par vous, directement à Google, sans commission.",
              "Aucun engagement de durée, ni sur le setup ni sur le pilotage.",
              "Un seul interlocuteur : celui qui vous répond est celui qui travaille dans le compte.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-body-lg text-white/80 font-light">
                <Check size={16} className="text-spark shrink-0 mt-1" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ commerciale */}
      <section className="section">
        <div className="container-text">
          <Reveal>
            <p className="label text-eclat-ink mb-4">Questions</p>
            <h2 className="text-section font-semibold text-ink mb-8">
              Avant de demander un devis
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="border-t border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="py-4 flex items-start justify-between gap-6 cursor-pointer text-body-lg font-medium text-ink list-none">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-eclat-ink text-xl leading-6 shrink-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-body text-ink-2 leading-relaxed font-light">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-4">
            L&apos;audit dit laquelle des deux vous concerne
          </h2>
          <p className="text-lead text-white font-light mb-8">
            Gratuit, écrit, sous 48 h ouvrées. Il porte sur votre compte et votre marché, pas sur un exemple
            générique.
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
