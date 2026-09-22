import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Counter from "@/components/agency/Counter";
import Navbar from "@/components/agency/Navbar";
import Footer from "@/components/agency/Footer";
import Analytics from "@/components/agency/Analytics";
import ContactForm from "@/components/agency/ContactForm";
import SmoothScroll from "@/components/studio/SmoothScroll";
import SplitTitle from "@/components/studio/SplitTitle";
import Scramble from "@/components/studio/Scramble";
import ExpandingMedia from "@/components/studio/ExpandingMedia";
import FadeIn from "@/components/studio/FadeIn";
import StudioAuditForm from "@/components/studio/StudioAuditForm";
import { MEDIA_FLOOR, TERMS } from "@/lib/offers";

export const metadata: Metadata = {
  // Le titre positionnait sans donner de raison de cliquer dans une SERP —
  // l'audit gratuit est l'accroche la plus forte du site (c'est le CTA
  // principal du hero), il a sa place dans le titre, pas seulement dans la
  // description. La description dit pour qui et ce qui distingue (le compte
  // reste au client), sans aucun chiffre de résultat : l'ancienne version du
  // site affichait « ROAS moyen 4.2x, CPA réduit de 65 % », jamais mesurés.
  title: "Uplyo — Consultant Google Ads indépendant, audit gratuit",
  description:
    "Consultant Google Ads indépendant pour artisans, commerces et e-commerce. Je construis et je pilote vos campagnes dans votre propre compte. Audit gratuit sous 48 h.",
  alternates: { canonical: "https://uplyo.fr" },
  openGraph: {
    title: "Uplyo — Consultant Google Ads indépendant, audit gratuit",
    description:
      "Je construis et je pilote vos campagnes Google Ads, tous secteurs. Audit gratuit sous 48 h ouvrées, aucun engagement de durée.",
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
      // Sans `logo`, Google n'a aucune image d'entité à associer au site : les
      // résultats sortaient sans logo. La propriété doit pointer un raster
      // (le SVG seul ne suffit pas ici) d'au moins 112 px de côté.
      logo: {
        "@type": "ImageObject",
        url: "https://uplyo.fr/images/logo-uplyo-512.png",
        width: 512,
        height: 512,
      },
      image: "https://uplyo.fr/images/logo-uplyo-512.png",
      description:
        "Gestion de campagnes Google Ads, tous secteurs. Audit gratuit, aucun engagement de durée, un seul interlocuteur.",
      // areaServed : France uniquement — c'est la zone réellement couverte
      // aujourd'hui. Le site affichait ailleurs « France · Espagne · Belgique ·
      // Suisse », qui ne correspondait à aucune activité constatée.
      areaServed: { "@type": "Country", name: "France" },
      knowsAbout: [
        "Google Ads",
        "Google Analytics 4",
        "Looker Studio",
        "Performance Marketing",
      ],
      founder: { "@id": "https://uplyo.fr/a-propos#ismael" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Prestations Google Ads",
        url: "https://uplyo.fr/offres",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Le setup",
            url: "https://uplyo.fr/offres/pack-lancement",
          },
          {
            "@type": "Offer",
            name: "Le pilotage",
            url: "https://uplyo.fr/offres/retainer",
          },
          {
            "@type": "Offer",
            name: "Module e-commerce",
            url: "https://uplyo.fr/offres/ecommerce",
          },
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
  {
    k: "Engagement",
    v: "Aucune durée",
    d: "Résiliable à tout moment, 30 jours de préavis",
  },
  {
    k: "Votre compte",
    v: "Le vôtre",
    d: "Ouvert à votre nom, vous en gardez la propriété",
  },
  {
    k: "Audit",
    v: `Gratuit · ${TERMS.auditDelayShort}`,
    d: `Rapport écrit sous ${TERMS.auditDelay}, sans contrepartie`,
  },
  {
    k: "Interlocuteur",
    v: "Un seul",
    d: "Celui qui vous répond est celui qui exécute",
  },
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

// ── 4. Preuve de travail (cas client anonymisé) ──
// Client 1 : accord oral (téléphone, sept. 2026) pour publier ses résultats,
// à la condition explicite de rester non identifiable — donc ni nom, ni
// secteur d'activité, ni ville, ni éléments techniques (CMS, etc.) qui
// permettraient de le reconnaître. Les chiffres de RESULTS viennent des
// rapports de suivi réels (période 15/07-31/08 pour le coût par conversion,
// premier mois complet pour la variation de volume de demandes).
const WORK = [
  "Gestion mensuelle du compte Google Ads : campagnes de recherche sur sa zone de chalandise.",
  "Étude de volume et de coût du clic avant toute extension géographique, plutôt qu'un élargissement de zone au hasard.",
  "Reprise du site côté conversion : bouton d'appel fixe sur mobile, capture de contact, accès direct au formulaire de devis, correction des images.",
  "Maintenance mensuelle du site : mises à jour, sauvegardes, sécurité.",
];

const RESULTS = [
  { value: 114, suffix: " %", prefix: "+", label: "de demandes de devis en un mois" },
  { value: 30.47, decimals: 2, suffix: " €", label: "coût moyen par conversion (période de 48 jours)" },
  { value: 30, suffix: " %", prefix: "−", label: "de coût par demande sur la même période" },
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
    "Une activité qui vend sur devis, sur rendez-vous ou en ligne",
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
    a: `Il y a deux lignes à distinguer. Le budget publicitaire, que vous réglez directement à Google : ${MEDIA_FLOOR.local} minimum pour une activité locale, ${MEDIA_FLOOR.ecommerce} minimum pour un e-commerce. Et mes honoraires, établis sur devis après l'appel de cadrage, parce qu'ils dépendent du nombre de campagnes et de la zone à couvrir. Le devis vous est envoyé sous 24 h et vous engage à rien.`,
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

// ── Refonte « studio » (direction C, 22/09/2026) ──
// Mise en page inspirée de locomotive.ca : typographie géante, filets fins,
// très peu de cadres. Le contenu (textes, chiffres, conditions) est
// strictement celui de la version précédente — seule la forme change.
// Chaque animation a son composant dans src/components/studio/ et respecte
// prefers-reduced-motion.
export default function HomePage() {
  return (
    <div className="bg-surface-1 text-ink overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Analytics />
      <SmoothScroll />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="pt-[104px] md:pt-[128px] pb-12 md:pb-20">
        <div className="container-studio">
          <div className="flex items-baseline justify-between gap-6 mb-6 md:mb-8 studio-meta text-ink-3">
            <Scramble text="Consultant Google Ads indépendant" className="font-mono text-eclat-ink" />
            <span className="hidden md:inline">Audit gratuit sous {TERMS.auditDelay}</span>
          </div>

          <SplitTitle as="h1" immediate className="studio-hero text-ink max-w-[22ch]">
            Des demandes de devis qui rentrent. Un coût par demande que vous voyez.
          </SplitTitle>

          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-end">
            <FadeIn>
              <p className="studio-lead text-ink-2 max-w-[40ch]">
                Je m&apos;appelle Ismael. Je construis et je pilote des campagnes
                Google Ads pour artisans, prestataires, commerces et e-commerce,
                et je vous montre le compte pendant que je le fais.
              </p>
            </FadeIn>
            <FadeIn>
              <StudioAuditForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 2. IMAGE QUI S'ÉLARGIT ═══
          Photo libre de droits (Pexels), traitée en duoton rouge/encre.
          Décorative, d'où l'alt vide. */}
      <ExpandingMedia className="h-[62vh] md:h-[88vh] max-h-[960px]">
        {/* Duoton pré-calculé dans le fichier : les
            deux calques mix-blend-multiply faisaient recalculer le mélange à
            chaque image pendant le scrub, visible sur une machine modeste. */}
        <Image
          src="/images/audit-desk-duotone.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </ExpandingMedia>

      {/* ═══ 3. ENGAGEMENTS ═══ */}
      <section className="py-20 md:py-36">
        <div className="container-studio">
          <SplitTitle className="studio-big text-ink max-w-[20ch] mb-14 md:mb-24">
            Un seul interlocuteur, votre compte à votre nom, et aucune durée
            d&apos;engagement.
          </SplitTitle>
          <FadeIn as="dl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-ink">
            {ENGAGEMENTS.map((e, i) => (
              <div
                key={e.k}
                className={`py-6 sm:pr-8 border-b border-line lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
              >
                <dt className="studio-meta text-ink-3 mb-6 font-mono">
                  0{i + 1} — {e.k}
                </dt>
                <dd>
                  <div className="font-display text-[1.75rem] leading-tight text-ink mb-2">{e.v}</div>
                  <div className="studio-body text-ink-2">{e.d}</div>
                </dd>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. CHIFFRES ═══
          Chiffres réels du client 1, publiés avec son accord oral et à
          condition qu'il reste non identifiable (voir RESULTS). */}
      <section className="bg-nuit text-white py-20 md:py-36">
        <div className="container-studio">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 mb-14 md:mb-20">
            <SplitTitle className="studio-big">
              Un seul client à ce jour. Voici ses chiffres.
            </SplitTitle>
            <FadeIn as="ul" className="self-end flex flex-col gap-3 studio-body text-white/75">
              {WORK.map((w) => (
                <li key={w} className="flex gap-3">
                  <span aria-hidden="true" className="text-spark">—</span>
                  {w}
                </li>
              ))}
            </FadeIn>
          </div>

          <FadeIn className="border-t border-white/25">
            {RESULTS.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] items-end gap-2 md:gap-10 py-6 md:py-8 border-b border-white/25"
              >
                <div className="font-display font-medium tabular-nums leading-none tracking-[-0.03em] text-[clamp(3.5rem,11vw,10rem)] text-white">
                  <Counter value={r.value} decimals={r.decimals ?? 0} prefix={r.prefix} suffix={r.suffix} />
                </div>
                <p className="studio-lead text-white/75 md:pb-4 max-w-[28ch]">{r.label}</p>
              </div>
            ))}
          </FadeIn>
          <p className="mt-6 studio-meta text-white/60">
            PME de services à la personne, activité locale en France, accompagnée depuis 2026.
          </p>
        </div>
      </section>

      {/* ═══ 5. LA MÉTHODE J0 → J5 ═══ */}
      <section className="py-20 md:py-36">
        <div className="container-studio">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-20 items-end mb-12 md:mb-20">
            <SplitTitle className="studio-big">
              Cinq jours, cinq livrables.
            </SplitTitle>
            <FadeIn>
              <p className="studio-lead text-ink-2 max-w-[42ch]">
                C&apos;est la partie du travail que les agences décrivent le moins
                et que vous payez pourtant en premier. La voici en entier.
              </p>
            </FadeIn>
          </div>

          <FadeIn as="ol" className="border-t border-ink">
            {PLAN.map((s) => (
              <li
                key={s.day}
                className="studio-row grid grid-cols-[3.5rem_1fr] md:grid-cols-[6rem_1.1fr_1.4fr_14rem] gap-x-4 md:gap-x-10 gap-y-2 py-7 md:py-9 px-2 md:px-4 border-b border-line"
              >
                <div className="font-mono studio-body text-eclat-ink studio-row-muted pt-1">{s.day}</div>
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight">{s.t}</h3>
                <p className="col-start-2 md:col-start-auto studio-body text-ink-2 studio-row-muted max-w-[56ch]">{s.d}</p>
                <div className="col-start-2 md:col-start-auto studio-meta md:text-right">
                  <div className="text-ink-3 studio-row-muted">Livrable</div>
                  <div className="font-semibold">{s.out}</div>
                </div>
              </li>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. LES OFFRES ═══ */}
      <section className="pb-20 md:pb-36" id="offres">
        <div className="container-studio">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
            <SplitTitle className="studio-big max-w-[16ch]">
              On construit, puis on pilote.
            </SplitTitle>
            <p className="studio-body text-ink-2 max-w-[38ch]">
              Le setup peut se prendre seul. Le pilotage suppose que le compte ait
              été construit, par moi ou par quelqu&apos;un d&apos;autre.
            </p>
          </div>

          <FadeIn className="border-t border-ink">
            {[
              ...OFFERS.map((o) => ({ tag: o.tag, title: o.title, desc: o.desc, note: o.feeNote, href: o.href })),
              {
                tag: "Complément",
                title: "Le module e\u2011commerce",
                desc: `Google Shopping, Performance Max et flux produit, ajoutés au pilotage. Budget publicitaire minimum : ${MEDIA_FLOOR.ecommerce}.`,
                note: "S'ajoute au pilotage",
                href: "/offres/ecommerce",
              },
            ].map((o) => (
              <Link
                key={o.title}
                href={o.href}
                className="studio-row group grid grid-cols-1 md:grid-cols-[8rem_1fr_24rem_3rem] items-center gap-x-10 gap-y-3 py-8 md:py-11 px-2 md:px-4 border-b border-line text-ink no-underline"
              >
                <span className="studio-meta font-mono text-ink-3 studio-row-muted">{o.tag}</span>
                <span className="font-display font-medium text-[clamp(2.25rem,5.4vw,5rem)] leading-none tracking-[-0.025em]">
                  {o.title}
                </span>
                <span className="studio-body text-ink-2 studio-row-muted">
                  {o.desc}
                  <span className="block mt-1 studio-meta">{o.note} · honoraires sur devis</span>
                </span>
                <span aria-hidden="true" className="studio-arrow hidden md:inline-block text-[2rem] justify-self-end">→</span>
              </Link>
            ))}
          </FadeIn>

          <FadeIn className="mt-8 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 studio-body text-ink-2">
            <span className="font-semibold text-ink">Budget publicitaire minimum</span>
            <span>
              {MEDIA_FLOOR.local} en activité locale, {MEDIA_FLOOR.ecommerce} en
              e-commerce, réglé directement par vous à Google. Je ne prends aucune
              commission dessus.
            </span>
          </FadeIn>

          <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {[
              { title: "C'est fait pour vous si", items: FIT.yes, mark: "+" },
              { title: "Ne me contactez pas si", items: FIT.no, mark: "—" },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] mb-6">{col.title}</h3>
                <FadeIn as="ul" className="border-t border-ink">
                  {col.items.map((t) => (
                    <li key={t} className="flex gap-4 py-4 border-b border-line studio-body text-ink-2">
                      <span aria-hidden="true" className="font-mono text-eclat-ink">{col.mark}</span>
                      {t}
                    </li>
                  ))}
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. QUI GÈRE VOTRE COMPTE ═══
          Composition éditoriale à la Locomotive : un portrait central, de
          courtes étiquettes posées autour, le texte à côté. */}
      <section className="bg-surface-2 py-20 md:py-36">
        <div className="container-studio grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none px-20 md:px-28">
            <span className="absolute left-0 top-6 z-10 studio-meta text-ink-3">Fondateur</span>
            <span className="absolute right-0 top-1/3 z-10 studio-meta text-ink-3 text-right">Un seul<br />interlocuteur</span>
            <span className="absolute left-0 bottom-10 z-10 studio-meta text-ink-3">Depuis 2026</span>
            <ExpandingMedia className="aspect-[4/5] w-full">
              <Image
                src="/images/ismael-portrait.webp"
                alt="Ismael, consultant Google Ads indépendant et fondateur d'Uplyo"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-top grayscale"
              />
            </ExpandingMedia>
          </div>

          <div>
            <SplitTitle className="studio-big mb-8">
              C&apos;est moi qui vous réponds, et moi qui fais le travail.
            </SplitTitle>
            <FadeIn className="flex flex-col gap-5 max-w-[56ch] studio-body text-ink-2">
              <p>
                Uplyo n&apos;est pas une agence avec des équipes : c&apos;est une
                activité indépendante, la mienne. Il n&apos;y a donc personne pour
                reprendre le compte si je suis absent, et je limite volontairement
                le nombre de comptes que je pilote.
              </p>
              <p>
                En contrepartie, il n&apos;y a aucun écart entre ce qui vous est
                vendu et ce qui est exécuté, et vous n&apos;attendez jamais
                qu&apos;une information redescende d&apos;un service à un autre.
              </p>
              <Link href="/a-propos" className="studio-link self-start font-semibold text-eclat-ink no-underline">
                Mon parcours, et ce que je ne sais pas faire →
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 8. OBJECTIONS / FAQ ═══ */}
      <section className="py-20 md:py-36">
        <div className="container-studio grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-10 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <SplitTitle className="studio-big mb-6">Les questions qu&apos;on me pose avant de signer.</SplitTitle>
            <p className="studio-body text-ink-2 max-w-[36ch]">
              Y compris celles qui n&apos;arrangent pas. S&apos;il en manque une,
              posez-la dans le formulaire en bas de page.
            </p>
          </div>
          <FadeIn className="border-t border-ink">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-line">
                <summary className="studio-row flex items-start justify-between gap-6 cursor-pointer list-none py-6 px-2 md:px-4 font-display text-[clamp(1.25rem,1.9vw,1.75rem)] leading-snug">
                  {faq.q}
                  <span aria-hidden="true" className="font-sans text-2xl leading-none text-eclat-ink studio-row-muted transition-transform duration-500 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-2 md:px-4 pb-7 pt-1 studio-body text-ink-2 max-w-[64ch]">{faq.a}</p>
              </details>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL + FORMULAIRE ═══
          Sur bg-eclat, seul le blanc pur atteint AA (4.86:1). */}
      <section className="bg-eclat text-white" id="contact">
        <div className="container-studio py-20 md:py-32">
          <SplitTitle className="studio-mega max-w-[12ch] mb-12 md:mb-20">
            Dites-moi ce que vous vendez.
          </SplitTitle>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
            <FadeIn className="flex flex-col gap-6">
              <p className="studio-lead max-w-[40ch]">
                Je vous dis si Google Ads en vaut la peine. Vous recevez un audit
                écrit sous {TERMS.auditDelay}. S&apos;il en ressort que votre marché
                ne justifie pas de budget publicitaire, je vous le dirai : c&apos;est
                déjà arrivé.
              </p>
              <ul className="border-t border-white/40">
                {[
                  "Gratuit, et sans contrepartie",
                  "Réponse sous 24 h ouvrées",
                  "Aucun rappel commercial si vous ne le demandez pas",
                ].map((t) => (
                  <li key={t} className="py-3 border-b border-white/40 studio-body">{t}</li>
                ))}
              </ul>
              <a href="mailto:contact@uplyo.fr" className="studio-link self-start studio-lead font-semibold text-white no-underline">
                contact@uplyo.fr
              </a>
            </FadeIn>
            <FadeIn>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer studio />
    </div>
  );
}
