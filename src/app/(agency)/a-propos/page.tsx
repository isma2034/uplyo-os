import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/studio/FadeIn";
import ExpandingMedia from "@/components/studio/ExpandingMedia";
import { MEDIA_FLOOR, OFFER_ROUTES } from "@/lib/offers";

export const metadata: Metadata = {
  title: "À propos · Ismael, qui gère votre compte",
  description:
    "De Séoul à un premier compte Google Ads côté annonceur : le parcours d'Ismael, ce qu'il en a tiré, et ce qu'il ne sait pas faire.",
  alternates: { canonical: "/a-propos" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://uplyo.fr/a-propos",
  mainEntity: {
    "@type": "Person",
    "@id": "https://uplyo.fr/a-propos#ismael",
    name: "Ismael",
    jobTitle: "Consultant Google Ads",
    url: "https://uplyo.fr/a-propos",
    knowsAbout: ["Google Ads", "Google Analytics 4", "Looker Studio"],
    knowsLanguage: ["fr", "en", "es"],
    worksFor: { "@type": "ProfessionalService", "@id": "https://uplyo.fr/#organization" },
  },
};

// « Ce que je ne sais pas faire » : la page tient la promesse d'honnêteté du
// reste du site. Aucune certification n'est revendiquée ici tant qu'elle n'a
// pas été vérifiée — c'est une règle du projet.
const LIMITS = [
  {
    t: "Je ne suis pas une agence",
    d: "Je travaille seul. Il n'y a personne pour reprendre votre compte si je suis absent, et je limite volontairement le nombre de comptes que je pilote. Si vous avez besoin d'une équipe joignable en permanence, ce n'est pas ici.",
  },
  {
    t: "Je ne fais que Google Ads",
    d: "Pas de Meta, pas de TikTok, pas d'Amazon, pas de référencement naturel, pas de création de site complet. Je vous dirai quand un autre levier serait plus pertinent que le mien, même si cela veut dire ne pas travailler ensemble.",
  },
  {
    t: "Ma preuve est encore mince",
    d: "Un client accompagné en propre à ce jour, depuis 2026. C'est peu, et c'est la principale raison de vous méfier. C'est précisément pour ça que l'audit est gratuit : jugez sur le travail rendu, pas sur une liste de logos.",
  },
  {
    t: "Je ne promets aucun chiffre",
    d: "Ni coût par demande, ni nombre de ventes, ni retour sur investissement. Qui vous les promet avant d'avoir vu votre compte ne peut pas les tenir.",
  },
];

const HOW = [
  {
    t: "Le compte est à vous",
    d: "Ouvert à votre nom, avec votre moyen de paiement. Vous y avez accès en permanence, et vous repartez avec l'historique si l'on arrête.",
  },
  {
    t: "Je ne touche pas à votre budget publicitaire",
    d: `Vous le réglez directement à Google — ${MEDIA_FLOOR.local} minimum en services locaux, ${MEDIA_FLOOR.ecommerce} en e-commerce. Je ne prends aucune commission dessus, donc je n'ai aucun intérêt à vous faire dépenser plus.`,
  },
  {
    t: "Je vérifie la mesure avant de piloter",
    d: "Je teste chaque conversion pour de vrai — j'appelle le numéro, j'envoie le formulaire — avant de décider quoi que ce soit. Piloter sur un tracking faux est la façon la plus courante de perdre six mois.",
  },
  {
    t: "Je dis quand ça ne marche pas",
    d: "Y compris quand la conclusion est que Google Ads ne vaut pas le coup dans votre situation, ou qu'il faut arrêter une campagne que j'ai construite.",
  },
];

// Le récit ne contient QUE des faits du profil d'Ismael (job-apply/profile/
// profile.yaml) : employeurs, lieux, dates, périmètres. Aucun chiffre de
// résultat obtenu pour un employeur n'est repris ici — ce ne sont pas des
// résultats d'Uplyo (c'est ainsi que « ROAS moyen 4,2x » s'était retrouvé
// dans l'ancienne version du site). Le poste actuel d'Ismael n'est
// volontairement pas mentionné sur le site (décision du 23/09/2026).
const STORY = [
  {
    when: "2020",
    where: "Montpellier",
    t: "Le marketing, par l'école",
    d: "Trois ans de Bachelor Business & Marketing à l'IDRAC Business School. Les bases, et une question que je n'ai plus lâchée depuis : qu'est-ce qui prouve que ça marche ?",
  },
  {
    when: "2022",
    where: "Séoul",
    t: "Expliquer un produit à des gens qui ne le connaissent pas",
    d: "Chef de produit junior dans une biotech de diagnostic. J'ai préparé le lancement de ses produits sur six marchés européens : prix, argumentaires, formation des équipes locales. Faire comprendre en quelques lignes pourquoi un produit vaut qu'on s'y arrête, c'est exactement le travail d'une annonce.",
  },
  {
    when: "2022 – 2023",
    where: "Montpellier",
    t: "Mon premier compte, côté annonceur",
    d: "Chez un fabricant de matériel médical, j'ai géré les campagnes Google Ads et Meta avec 8 000 € par mois, réécrit toutes les annonces et mis en place les relances automatiques. C'est là que j'ai compris qu'un budget publicitaire, c'est l'argent de quelqu'un, et qu'on doit pouvoir dire où il est passé.",
  },
  {
    when: "2023 – 2025",
    where: "Hérault",
    t: "Ce qui se passe après le clic",
    d: "Développement commercial et marketing dans le sport automobile : catalogues, salons internationaux, et un CRM pour suivre chaque contact jusqu'à la vente. Une demande ne vaut rien si personne ne la rappelle vite. Depuis, je regarde toujours ce que devient un contact, pas seulement combien il a coûté.",
  },
  {
    when: "2026",
    where: "Uplyo",
    t: "Faire le travail en entier",
    d: "J'ai lancé Uplyo pour les entreprises qui n'ont ni agence ni équipe marketing : construire le compte, le piloter, et montrer ce que je fais pendant que je le fais. Mon premier client est une PME de services à la personne ; ses résultats sont publiés sur la page d'accueil, avec son accord.",
  },
];

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* Hero — refonte studio + récit (23/09/2026) */}
      <section className="pt-[112px] md:pt-[150px] pb-16 md:pb-24">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-20 items-end">
          <div>
            <p className="text-caption font-semibold text-eclat-ink mb-6">À propos</p>
            <h1 className="text-hero text-ink mb-8">
              Un budget publicitaire, c&apos;est l&apos;argent de quelqu&apos;un.
            </h1>
            <FadeIn className="flex flex-col gap-5 max-w-[56ch]">
              <p className="text-lead text-ink-2">
                Je l&apos;ai appris en gérant mon premier compte Google Ads côté annonceur, avec
                un budget à justifier chaque mois. Uplyo, c&apos;est ce réflexe mis au service
                d&apos;entreprises qui n&apos;ont ni agence ni équipe marketing.
              </p>
              <p className="text-lead text-ink-2">
                Je m&apos;appelle Ismael. Quand vous m&apos;écrivez, vous parlez à la personne qui
                ouvrira vos campagnes. Il n&apos;y a personne d&apos;autre.
              </p>
            </FadeIn>
          </div>

          {/* Portrait réel fourni par Ismael (WebP 132 Ko, fond transparent). */}
          <ExpandingMedia className="aspect-[4/5] w-full max-w-[520px] justify-self-end bg-surface-2">
            <Image
              src="/images/ismael-portrait.webp"
              alt="Portrait d'Ismael, consultant Google Ads et fondateur d'Uplyo"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-top grayscale"
            />
          </ExpandingMedia>
        </div>
      </section>

      {/* Le parcours, en chapitres */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <h2 className="text-display text-ink max-w-[18ch] mb-14 md:mb-20">
            Cinq étapes, et ce que chacune m&apos;a laissé.
          </h2>
          <FadeIn as="ol" className="border-t border-ink">
            {STORY.map((s) => (
              <li
                key={s.when + s.where}
                className="grid grid-cols-1 md:grid-cols-[14rem_1fr_1.3fr] gap-x-10 gap-y-3 py-9 md:py-12 border-b border-line"
              >
                <div>
                  <div className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none text-ink">
                    {s.when}
                  </div>
                  <div className="text-caption font-mono text-eclat-ink mt-2">{s.where}</div>
                </div>
                <h3 className="font-display text-title text-ink">{s.t}</h3>
                <p className="text-body-lg text-ink-2 max-w-[60ch]">{s.d}</p>
              </li>
            ))}
          </FadeIn>
          <p className="mt-8 text-body text-ink-2 max-w-[64ch]">
            Je travaille en français, en anglais et en espagnol.
          </p>
        </div>
      </section>

      {/* Comment je travaille */}
      <section className="section">
        <div className="container-wide">
          <h2 className="text-display text-ink max-w-[18ch] mb-12 md:mb-16">
            Quatre règles que je m&apos;applique.
          </h2>
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {HOW.map((h) => (
              <div key={h.t} className="border-t border-ink pt-6">
                <h3 className="text-title text-ink mb-3">{h.t}</h3>
                <p className="text-body-lg text-ink-2">{h.d}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Ce que je ne sais pas faire */}
      <section className="section bg-nuit">
        <div className="container-wide">
          <div className="max-w-[40ch] mb-12 md:mb-16">
            <h2 className="text-display text-white mb-6">
              Ce que je ne sais pas faire.
            </h2>
            <p className="text-lead text-white/80">
              Cette liste vous fera peut-être partir. C&apos;est préférable maintenant plutôt
              qu&apos;au troisième mois.
            </p>
          </div>
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {LIMITS.map((l) => (
              <div key={l.t} className="border-t border-white/30 pt-6">
                <h3 className="text-title text-white mb-3">{l.t}</h3>
                <p className="text-body-lg text-white/80">{l.d}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Outils */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="border-t border-ink pt-6 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-3 md:gap-10">
            <div className="text-caption font-mono text-ink-3">Les outils</div>
            <p className="text-body-lg text-ink-2 max-w-[64ch]">
              Google Ads, Google Analytics 4 avec Consent Mode v2, Google Tag Manager, Looker
              Studio, scripts Google Ads, Google Merchant Center pour le module e-commerce. Côté
              site, WordPress. Aucune certification n&apos;est revendiquée sur ce site tant
              qu&apos;elle n&apos;est pas vérifiable publiquement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat text-white">
        <div className="container-wide py-20 md:py-32">
          <h2 className="mb-10 max-w-[14ch]">Le plus simple reste de me faire travailler.</h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <p className="text-lead max-w-[44ch]">
              L&apos;audit est gratuit et sans contrepartie. Vous jugerez sur ce que je rends, pas
              sur ce que j&apos;écris ici.
            </p>
            <Link href="/audit" className="btn-invert self-start">
              Recevoir mon audit gratuit
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="text-body mt-10">
            Ou voir{" "}
            <Link href="/offres" className="text-white font-semibold underline underline-offset-4">
              les deux prestations
            </Link>{" "}
            —{" "}
            <Link
              href={OFFER_ROUTES.setup.href}
              className="text-white font-semibold underline underline-offset-4"
            >
              {OFFER_ROUTES.setup.label.toLowerCase()}
            </Link>{" "}
            et{" "}
            <Link
              href={OFFER_ROUTES.pilotage.href}
              className="text-white font-semibold underline underline-offset-4"
            >
              {OFFER_ROUTES.pilotage.label.toLowerCase()}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
