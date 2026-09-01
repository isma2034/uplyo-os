import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Check, UserRound } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import Navbar from "@/components/agency/Navbar";
import Footer from "@/components/agency/Footer";
import Analytics from "@/components/agency/Analytics";
import ContactForm from "@/components/agency/ContactForm";
import HeroAuditForm from "@/components/agency/HeroAuditForm";
import { MEDIA_FLOOR } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Uplyo — Google Ads pour PME de services",
  description:
    "Je gère les campagnes Google Ads de PME de services. Audit gratuit sous 48h, aucun engagement de durée, un seul interlocuteur — celui qui exécute.",
  alternates: { canonical: "https://uplyo.fr" },
  openGraph: {
    title: "Uplyo — Google Ads pour PME de services",
    description:
      "Je gère les campagnes Google Ads de PME de services. Audit gratuit sous 48h, aucun engagement de durée.",
    url: "https://uplyo.fr",
    siteName: "Uplyo",
    locale: "fr_FR",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://uplyo.fr/#organization",
      name: "Uplyo",
      url: "https://uplyo.fr",
      email: "contact@uplyo.fr",
      description:
        "Gestion de campagnes Google Ads pour PME de services. Audit gratuit, aucun engagement de durée, un seul interlocuteur.",
      // areaServed : France uniquement — c'est la zone réellement couverte
      // aujourd'hui. Le site affichait ailleurs « France · Espagne · Belgique ·
      // Suisse », qui ne correspondait à aucune activité constatée.
      areaServed: { "@type": "Country", name: "France" },
      knowsAbout: ["Google Ads", "Google Analytics 4", "Looker Studio", "Performance Marketing"],
      founder: { "@id": "https://uplyo.fr/a-propos#ismael" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Prestations Google Ads",
        url: "https://uplyo.fr/offres",
        itemListElement: [
          { "@type": "Offer", name: "Le setup", url: "https://uplyo.fr/offres/pack-lancement" },
          { "@type": "Offer", name: "Le pilotage", url: "https://uplyo.fr/offres/retainer" },
          { "@type": "Offer", name: "Module e-commerce", url: "https://uplyo.fr/offres/ecommerce" },
        ],
      },
    },
    {
      "@type": "Person",
      "@id": "https://uplyo.fr/a-propos#ismael",
      name: "Ismael",
      jobTitle: "Consultant Google Ads",
      url: "https://uplyo.fr/a-propos",
      worksFor: { "@id": "https://uplyo.fr/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://uplyo.fr/#website",
      url: "https://uplyo.fr",
      name: "Uplyo",
      publisher: { "@id": "https://uplyo.fr/#organization" },
    },
  ],
};

// ── 2. Bandeau engagements (statique — remplace l'ancien ticker animé) ──
const ENGAGEMENTS = [
  { k: "Engagement", v: "Aucune durée", d: "Résiliable à tout moment, 30 jours de préavis" },
  { k: "Votre compte", v: "Le vôtre", d: "Ouvert à votre nom, vous en gardez la propriété" },
  { k: "Audit", v: "Gratuit · 48 h", d: "Rapport écrit, sans contrepartie" },
  { k: "Interlocuteur", v: "Un seul", d: "Celui qui vous répond est celui qui exécute" },
];

// ── 3. La méthode, J0 → J5 ──
const PLAN = [
  {
    day: "J0",
    t: "Appel de cadrage",
    d: "30 minutes : ce que vous vendez, à qui, dans quelle zone, avec quel budget. Je vous dis à ce moment-là si Google Ads est pertinent pour vous — et si ce n'est pas le cas, je vous le dis aussi.",
    out: "Compte-rendu écrit",
  },
  {
    day: "J1",
    t: "Audit et plan de campagne",
    d: "Recherche des requêtes réellement tapées par vos clients, relevé des concurrents présents sur ces requêtes, structure retenue et budget conseillé.",
    out: "Le plan de campagne",
  },
  {
    day: "J2–J3",
    t: "Construction du compte",
    d: "Campagnes, groupes d'annonces, mots-clés, exclusions, rédaction des annonces, extensions. Tout est construit dans votre compte, à votre nom.",
    out: "Le compte, prêt à lancer",
  },
  {
    day: "J4",
    t: "Mesure",
    d: "GA4 et Consent Mode v2, conversions, puis vérification une par une que vos appels et vos formulaires remontent bien. C'est l'étape que l'on saute le plus souvent — et celle qui fausse tout le reste.",
    out: "Tracking testé, pas seulement posé",
  },
  {
    day: "J5",
    t: "Mise en ligne",
    d: "Lancement, tableau de bord Looker Studio branché sur le compte, passation des accès et du fonctionnement.",
    out: "Vos accès + le tableau de bord",
  },
];

// ── 4. Preuve de travail (cas client anonymisé, sans chiffres) ──
const WORK = [
  "Gestion mensuelle du compte Google Ads : campagnes de recherche sur la zone Loire-Atlantique.",
  "Étude de volume et de coût du clic avant toute extension géographique, plutôt qu'un élargissement de zone au hasard.",
  "Reprise du site WordPress côté conversion : bouton d'appel fixe sur mobile, capture de contact, accès direct au formulaire de devis, correction des images.",
  "Maintenance mensuelle du site : mises à jour, sauvegardes, sécurité.",
];

// ── 5. Offres ──
const OFFERS = [
  {
    tag: "Étape 1",
    title: "Le setup",
    linkLabel: "Le détail du setup",
    href: "/offres/pack-lancement",
    desc: "La construction du compte, de l'audit à la mise en ligne. Une fois, en 5 jours ouvrés.",
    items: [
      "Audit du marché et des concurrents",
      "Structure de campagnes, mots-clés, exclusions",
      "Rédaction des annonces et des extensions",
      "GA4 + Consent Mode v2, conversions vérifiées",
      "Tableau de bord Looker Studio",
    ],
    fee: "Honoraires sur devis",
    feeNote: "Prestation unique · mise en ligne à J5",
  },
  {
    tag: "Étape 2",
    title: "Le pilotage",
    linkLabel: "Le détail du pilotage",
    href: "/offres/retainer",
    desc: "La conduite du compte au mois : enchères, tests d'annonces, exclusions, rapports. Sans engagement de durée.",
    items: [
      "Enchères, budgets et exclusions ajustés",
      "Tests d'annonces en continu",
      "Alertes automatiques sur budget et anomalies",
      "Rapport hebdomadaire + bilan mensuel",
      "Un point stratégique de 30 min chaque mois",
    ],
    fee: "Honoraires sur devis",
    feeNote: "Mensuel · aucun engagement de durée",
  },
];

// ── 6. Pour qui / pour qui ce n'est pas ──
const FIT = {
  yes: [
    "PME et artisans de services qui vendent sur devis ou sur rendez-vous",
    "Activités locales ou régionales avec une zone d'intervention claire",
    "Un budget publicitaire d'au moins 500 €/mois, réglé directement à Google",
    "Quelqu'un chez vous qui répond aux demandes rapidement",
  ],
  no: [
    "Budget publicitaire inférieur à 500 €/mois : il n'y a pas assez de données pour optimiser quoi que ce soit",
    "Recherche d'un prestataire qui garantit un nombre de ventes — personne ne peut le garantir sur Google Ads",
    "Besoin d'une équipe joignable en permanence : je travaille seul, avec des délais de réponse annoncés",
    "SEO, réseaux sociaux, création de site complet : ce n'est pas mon métier",
  ],
};

// ── 7. Objections (absorbe l'ancienne section « problème ») ──
const FAQS = [
  {
    q: "Je paie déjà des clics et je ne vois rien venir.",
    a: "C'est le point de départ de l'audit. Dans la majorité des comptes que je regarde, le budget part sur des requêtes hors sujet faute d'exclusions, ou les conversions ne remontent pas correctement — donc les décisions sont prises sur des données fausses. L'audit vous dit lequel des deux vous concerne, avec les captures du compte à l'appui.",
  },
  {
    q: "Mon agence actuelle ne me montre rien.",
    a: "Chez moi, le compte Google Ads est ouvert à votre nom et vous en êtes propriétaire. Vous y avez accès en permanence, y compris si l'on arrête de travailler ensemble : vous repartez avec le compte et l'historique.",
  },
  {
    q: "Je ne sais pas si mon suivi de conversions est juste.",
    a: "C'est vérifiable en une heure. Je teste chaque conversion réellement (appel, formulaire, demande de devis) et je vous montre ce qui remonte, ce qui est compté deux fois et ce qui manque. Cette vérification fait partie de l'audit gratuit.",
  },
  {
    q: "Je n'ai pas le temps de m'en occuper.",
    a: "C'est précisément l'objet du pilotage. Votre part se limite à l'appel de cadrage au départ, puis à un point de 30 minutes par mois. Le reste se passe dans le compte.",
  },
  {
    q: "Combien ça coûte ?",
    a: `Il y a deux lignes à distinguer. Le budget publicitaire, que vous réglez directement à Google : ${MEDIA_FLOOR.local} minimum pour une PME locale, ${MEDIA_FLOOR.ecommerce} minimum pour un e-commerce. Et mes honoraires, établis sur devis après l'appel de cadrage, parce qu'ils dépendent du nombre de campagnes et de la zone à couvrir. Le devis vous est envoyé sous 24 h et vous engage à rien.`,
  },
  {
    q: "Est-ce que je m'engage sur une durée ?",
    a: "Non. Aucun engagement minimum, ni sur le setup ni sur le pilotage. Le pilotage est mensuel et s'arrête quand vous le décidez, avec 30 jours de préavis pour me laisser le temps de vous rendre le compte proprement.",
  },
  {
    q: "Qui paie le budget Google Ads ?",
    a: "Vous, directement à Google, avec votre propre moyen de paiement sur votre propre compte. Je ne facture jamais votre budget publicitaire et je ne prends pas de commission dessus — je n'ai donc aucun intérêt à ce que vous dépensiez plus.",
  },
  {
    q: "En combien de temps mes campagnes sont-elles en ligne ?",
    a: "Cinq jours ouvrés après l'appel de cadrage, selon le plan J0 → J5 détaillé plus haut. Le seul délai qui m'échappe est celui de la validation des annonces par Google, généralement moins de 24 h.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface-1 text-ink overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Analytics />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="pt-[104px] md:pt-[128px] pb-14 md:pb-20">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <p className="label text-eclat-ink mb-5">Google Ads · PME de services</p>
            <h1 className="text-hero font-semibold text-ink mb-6">
              Des demandes de devis qui rentrent — et un coût par demande que vous voyez.
            </h1>
            <p className="text-lead text-ink-2 max-w-[54ch] mb-7 font-light">
              Je m&apos;appelle Ismael. Je construis et je pilote les campagnes Google Ads de PME de
              services : artisans, prestataires, entreprises locales. Je fais le travail, et je vous
              montre le compte pendant que je le fais.
            </p>
            <p className="text-body text-ink-3 max-w-[54ch] mb-8 font-light">
              Pas de chargé de compte, pas d&apos;intermédiaire : la personne qui vous répond est
              celle qui ouvre votre compte.{" "}
              <Link href="/a-propos" className="text-eclat-ink font-medium underline underline-offset-4">
                Qui je suis
              </Link>
              .
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {["Aucun engagement de durée", "Vous restez propriétaire du compte", "Audit gratuit sous 48 h"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-1.5 text-caption text-ink-2">
                    <Check size={13} className="text-eclat-ink shrink-0" aria-hidden="true" />
                    {t}
                  </li>
                )
              )}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <HeroAuditForm />
          </Reveal>
        </div>
      </section>

      {/* ═══ 2. BANDEAU ENGAGEMENTS (statique) ═══ */}
      <section className="bg-nuit">
        <div className="container-wide py-9 md:py-11">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7">
            {ENGAGEMENTS.map((e) => (
              <div key={e.k} className="border-l-2 border-spark pl-4">
                <div className="label text-spark mb-1.5">{e.k}</div>
                <div className="text-body-lg font-semibold text-white leading-snug">{e.v}</div>
                <div className="text-caption text-white/80 mt-1 font-light">{e.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. LA MÉTHODE J0 → J5 ═══ */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10 md:mb-14">
              <p className="label text-eclat-ink mb-4">Le plan de travail</p>
              <h2 className="text-display font-semibold text-ink mb-4">
                Cinq jours, cinq livrables. Vous savez à l&apos;avance ce qui sort chaque jour.
              </h2>
              <p className="text-body-lg text-ink-2 font-light">
                C&apos;est la partie du travail que les agences décrivent le moins et que vous payez
                pourtant en premier. La voici en entier.
              </p>
            </div>
          </Reveal>

          <ol className="border-t border-line">
            {PLAN.map((s, i) => (
              <Reveal key={s.day} delay={i * 70}>
                <li className="grid grid-cols-1 md:grid-cols-[92px_1fr_260px] gap-3 md:gap-8 py-6 md:py-7 border-b border-line">
                  <div className="font-mono text-body font-medium text-eclat-ink">{s.day}</div>
                  <div>
                    <h3 className="text-title font-semibold text-ink mb-1.5">{s.t}</h3>
                    <p className="text-body text-ink-2 font-light max-w-[62ch]">{s.d}</p>
                  </div>
                  <div className="md:text-right">
                    <div className="label text-ink-3 mb-1">Livrable</div>
                    <div className="text-body text-ink font-medium">{s.out}</div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ 4. PREUVE DE TRAVAIL ═══ */}
      <section className="section bg-surface-2">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24 self-start">
              <p className="label text-eclat-ink mb-4">Preuve de travail</p>
              <h2 className="text-section font-semibold text-ink mb-4">
                Un seul client à ce jour. Voici ce que j&apos;ai fait pour lui.
              </h2>
              <p className="text-body text-ink-2 font-light">
                Entreprise de débarras et déménagement, région nantaise. Accompagnée depuis 2026.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <ul className="bg-white border border-line rounded-card divide-y divide-line">
                {WORK.map((w) => (
                  <li key={w} className="flex gap-3 p-5">
                    <Check size={16} className="text-eclat-ink shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-body text-ink-2 font-light">{w}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 bg-nuit rounded-card p-6">
                <div className="label text-spark mb-2.5">Ce que vous ne trouverez pas ici</div>
                <p className="text-body text-white/80 font-light mb-3">
                  Aucun témoignage, aucune note, aucune moyenne de résultats. Un seul client
                  accompagné à ce jour, et ses chiffres lui appartiennent : ils seront publiés ici
                  quand il m&apos;aura donné son accord, pas avant.
                </p>
                <p className="text-body text-white/80 font-light">
                  En attendant, l&apos;audit est là pour ça : il porte sur votre compte à vous, et il
                  vous montre la façon dont je travaille avant que vous ne payiez quoi que ce soit.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 5. LES OFFRES ═══ */}
      <section className="section" id="offres">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10 md:mb-14">
              <p className="label text-eclat-ink mb-4">Les prestations</p>
              <h2 className="text-display font-semibold text-ink mb-4">
                On construit, puis on pilote. Deux étapes, pas trois formules concurrentes.
              </h2>
              <p className="text-body-lg text-ink-2 font-light">
                Le setup peut se prendre seul. Le pilotage suppose que le compte ait été construit —
                par moi ou par quelqu&apos;un d&apos;autre.
              </p>
            </div>
          </Reveal>

          {/* Budget plancher — visible sans clic (il était enterré dans la FAQ) */}
          <Reveal>
            <div className="bg-surface-2 border border-line-strong rounded-card p-5 md:p-6 mb-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-5 sm:gap-8 items-center">
              <div>
                <div className="label text-ink-3 mb-1.5">Budget publicitaire minimum</div>
                <p className="text-body text-ink-2 font-light max-w-[52ch]">
                  Réglé directement par vous à Google. Ce n&apos;est pas mon honoraire, et je ne
                  prends aucune commission dessus.
                </p>
              </div>
              <div className="sm:border-l sm:border-line-strong sm:pl-8">
                <div className="text-title font-semibold text-ink">{MEDIA_FLOOR.local}</div>
                <div className="text-caption text-ink-3">PME locale / services</div>
              </div>
              <div className="sm:border-l sm:border-line-strong sm:pl-8">
                <div className="text-title font-semibold text-ink">{MEDIA_FLOOR.ecommerce}</div>
                <div className="text-caption text-ink-3">E-commerce</div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OFFERS.map((o, i) => (
              <Reveal key={o.title} delay={i * 100}>
                <div className="bg-white border border-line rounded-card p-6 md:p-8 h-full flex flex-col shadow-card">
                  <div className="label text-ink-3 mb-3">{o.tag}</div>
                  <h3 className="text-title font-semibold text-ink mb-2">{o.title}</h3>
                  <p className="text-body text-ink-2 font-light mb-5">{o.desc}</p>
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {o.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-body text-ink-2 font-light">
                        <Check size={15} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-line pt-5">
                    <div className="text-body-lg font-semibold text-ink">{o.fee}</div>
                    <div className="text-caption text-ink-3 mb-4">{o.feeNote}</div>
                    {/* svc.href était défini mais jamais utilisé : toutes les
                        cartes pointaient en dur vers /audit, et les pages
                        offres ne recevaient aucun trafic interne. */}
                    <Link
                      href={o.href}
                      className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                    >
                      {o.linkLabel}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-5 border border-line rounded-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="text-body font-semibold text-ink mb-1">
                  Vous vendez en ligne ? Module e-commerce en complément
                </div>
                <p className="text-body text-ink-2 font-light max-w-[62ch]">
                  Google Shopping, Performance Max et flux produit s&apos;ajoutent au pilotage. Ce
                  n&apos;est pas une offre séparée, et le budget publicitaire minimum y passe à{" "}
                  {MEDIA_FLOOR.ecommerce}.
                </p>
              </div>
              <Link
                href="/offres/ecommerce"
                className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4 whitespace-nowrap"
              >
                Voir le module
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {/* Pour qui / pour qui ce n'est pas */}
          <Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-line rounded-card p-6">
                <div className="label text-eclat-ink mb-4">C&apos;est fait pour vous si</div>
                <ul className="flex flex-col gap-2.5">
                  {FIT.yes.map((t) => (
                    <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                      <Check size={15} className="text-eclat-ink shrink-0 mt-1" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-2 border border-line rounded-card p-6">
                <div className="label text-ink-3 mb-4">Ne me contactez pas si</div>
                <ul className="flex flex-col gap-2.5">
                  {FIT.no.map((t) => (
                    <li key={t} className="flex gap-2.5 text-body text-ink-2 font-light">
                      <span aria-hidden="true" className="text-ink-3 font-semibold shrink-0 leading-6">
                        —
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. QUI GÈRE VOTRE COMPTE ═══ */}
      <section className="section bg-nuit">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-14 items-start">
          <Reveal>
            {/* Emplacement photo — volontairement vide.
                Aucune photo d'Ismael n'est disponible à ce jour ; poser une
                image d'illustration générique irait contre la règle « aucune
                preuve fabriquée » du projet. Remplacer ce bloc par un
                <Image /> dès qu'un portrait réel existe. */}
            <div
              className="aspect-[4/5] w-full max-w-[280px] rounded-card border border-dashed border-white/25 bg-white/[0.04] grid place-items-center"
              aria-hidden="true"
            >
              <div className="text-center px-6">
                <UserRound size={30} className="text-white/35 mx-auto mb-3" />
                <div className="label text-white/70">Photo à venir</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="label text-spark mb-4">Qui gère votre compte</p>
              <h2 className="text-section font-semibold text-white mb-5">
                Ismael. C&apos;est moi qui vous réponds, et c&apos;est moi qui fais le travail.
              </h2>
              <div className="flex flex-col gap-4 max-w-[62ch]">
                <p className="text-body-lg text-white/80 font-light">
                  Uplyo n&apos;est pas une agence avec des équipes : c&apos;est une activité
                  indépendante, la mienne. Cela a une conséquence que vous devez connaître avant de
                  travailler avec moi — il n&apos;y a personne pour reprendre le compte si je suis
                  absent, et je limite donc volontairement le nombre de comptes que je pilote.
                </p>
                <p className="text-body-lg text-white/80 font-light">
                  En contrepartie, il n&apos;y a aucun écart entre ce qui vous est vendu et ce qui
                  est exécuté, et vous n&apos;attendez jamais qu&apos;une information redescende
                  d&apos;un service à un autre.
                </p>
              </div>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-1.5 mt-6 text-body font-semibold text-spark no-underline hover:underline underline-offset-4"
              >
                Mon parcours, et ce que je ne sais pas faire
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 7. OBJECTIONS / FAQ ═══ */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24 self-start">
              <p className="label text-eclat-ink mb-4">Objections</p>
              <h2 className="text-section font-semibold text-ink mb-4">
                Les questions qu&apos;on me pose avant de signer
              </h2>
              <p className="text-body text-ink-2 font-light">
                Y compris celles qui n&apos;arrangent pas. S&apos;il en manque une, posez-la dans le
                formulaire en bas de page.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="border-t border-line">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group border-b border-line">
                  <summary className="py-4 flex items-start justify-between gap-6 cursor-pointer text-body-lg font-medium text-ink list-none">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="text-eclat-ink text-xl leading-6 shrink-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-body text-ink-2 leading-relaxed font-light max-w-[68ch]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 8. CTA FINAL + FORMULAIRE ═══
          Seul bloc bg-eclat de la page. Sur ce fond, seul le blanc pur atteint
          AA (4.86:1) : aucune opacité de texte ici. */}
      <section className="bg-eclat" id="contact">
        <div className="container-wide py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div>
              <p className="label text-white mb-4">Pour démarrer</p>
              <h2 className="text-display font-semibold text-white mb-5">
                Dites-moi ce que vous vendez. Je vous dis si Google Ads en vaut la peine.
              </h2>
              <p className="text-lead text-white mb-8 font-light max-w-[52ch]">
                Vous recevez un audit écrit sous 48 h. S&apos;il en ressort que votre marché ne
                justifie pas de budget publicitaire, je vous le dirai — c&apos;est déjà arrivé.
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Gratuit, et sans contrepartie",
                  "Réponse sous 24 h ouvrées",
                  "Aucun rappel commercial si vous ne le demandez pas",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-body text-white">
                    <Check size={15} className="shrink-0" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:contact@uplyo.fr"
                className="inline-block mt-8 text-body font-semibold text-white underline underline-offset-4"
              >
                contact@uplyo.fr
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
