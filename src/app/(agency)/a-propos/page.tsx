import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { MEDIA_FLOOR, OFFER_ROUTES } from "@/lib/offers";

export const metadata: Metadata = {
  title: "À propos · Ismael, qui gère votre compte",
  description:
    "Uplyo est une activité indépendante. Qui je suis, ce que j'ai fait pour mon client, comment je travaille et ce que je ne sais pas faire.",
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
    d: "Un client accompagné à ce jour, dans les services aux particuliers. C'est peu, et c'est la principale raison de vous méfier. C'est précisément pour ça que l'audit est gratuit : jugez sur le travail rendu, pas sur une liste de logos.",
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

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* Hero */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-14 items-start">
          <Reveal>
            {/* Portrait réel fourni par Ismael. Le PNG source (1,5 Mo) est
                converti en WebP (132 Ko) : c'est la première image du site,
                elle est au-dessus de la ligne de flottaison, et un site qui
                vend de la performance ne peut pas se permettre de la charger
                lentement. `priority` la sort du chargement différé.
                Le fond du fichier est transparent, d'où le panneau teinté. */}
            <div className="aspect-[4/5] w-full max-w-[280px] rounded-card bg-surface-2 overflow-hidden relative">
              <Image
                src="/images/ismael-portrait.webp"
                alt="Portrait d'Ismael, consultant Google Ads et fondateur d'Uplyo"
                fill
                priority
                sizes="280px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <p className="label text-eclat-ink mb-4">À propos</p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Ismael. C&apos;est moi qui vous réponds, et c&apos;est moi qui travaille dans votre
                compte.
              </h1>
              <div className="flex flex-col gap-4 max-w-[64ch]">
                <p className="text-lead text-ink-2 font-light">
                  Uplyo n&apos;est pas une agence avec des pôles et des chargés de compte : c&apos;est
                  une activité indépendante, la mienne. Quand vous m&apos;écrivez, vous parlez
                  directement à la personne qui ouvrira vos campagnes.
                </p>
                <p className="text-lead text-ink-2 font-light">
                  Le reste du site promet « un accès direct à l&apos;expert ». Cette page existe
                  pour qu&apos;on sache enfin de qui il s&apos;agit — et pour dire ce que je ne sais
                  pas faire.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ce que j'ai fait */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-8">
              <p className="label text-eclat-ink mb-4">Mon expérience, en clair</p>
              <h2 className="text-section font-semibold text-ink">
                Un client, une activité de services, depuis 2026
              </h2>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="bg-white border border-line rounded-card p-6 md:p-8 max-w-[860px]">
              <div className="label text-ink-3 mb-4">
                Débarras et déménagement · région nantaise
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-body-lg text-ink-2 font-light">
                  Je gère son compte Google Ads au mois : campagnes de recherche sur la
                  Loire-Atlantique, exclusions, enchères, annonces. Avant d&apos;ouvrir une nouvelle
                  zone géographique, j&apos;ai fait une étude de volume et de coût au clic plutôt que
                  de déplacer le budget au jugé — c&apos;est un réflexe que j&apos;applique partout.
                </p>
                <p className="text-body-lg text-ink-2 font-light">
                  J&apos;ai aussi repris son site côté conversion : bouton d&apos;appel fixe sur
                  mobile, capture de contact, accès direct au formulaire de devis, correction des
                  images. Les campagnes amenaient du monde sur une page qui perdait une partie des
                  visiteurs ; travailler l&apos;un sans l&apos;autre n&apos;avait pas de sens. Je
                  m&apos;occupe depuis de la maintenance mensuelle du site.
                </p>
                <div className="border-t border-line pt-4">
                  <p className="text-body text-ink-2 font-light">
                    <strong className="font-semibold text-ink">
                      Ses résultats chiffrés ne sont pas publiés ici.
                    </strong>{" "}
                    Ils lui appartiennent, et je ne lui ai pas demandé l&apos;autorisation de les
                    diffuser. Ils apparaîtront sur ce site le jour où il me l&apos;accordera, avec
                    son nom. En attendant, vous ne trouverez ici ni témoignage anonyme, ni moyenne
                    reconstituée, ni logo emprunté.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comment je travaille */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10">
              <p className="label text-eclat-ink mb-4">Comment je travaille</p>
              <h2 className="text-section font-semibold text-ink">Quatre règles que je m&apos;applique</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {HOW.map((h, i) => (
              <Reveal key={h.t} delay={i * 70}>
                <div className="border-t border-line pt-5">
                  <h3 className="text-title font-semibold text-ink mb-2">{h.t}</h3>
                  <p className="text-body text-ink-2 font-light">{h.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que je ne sais pas faire */}
      <section className="section bg-nuit">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-10">
              <p className="label text-spark mb-4">Les limites</p>
              <h2 className="text-section font-semibold text-white mb-4">
                Ce que je ne sais pas faire, et pourquoi vous devriez le savoir avant
              </h2>
              <p className="text-body-lg text-white/80 font-light">
                Cette liste vous fera peut-être partir. C&apos;est préférable maintenant plutôt
                qu&apos;au troisième mois.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {LIMITS.map((l, i) => (
              <Reveal key={l.t} delay={i * 70}>
                <div className="border-l-2 border-spark pl-5">
                  <h3 className="text-title font-semibold text-white mb-2">{l.t}</h3>
                  <p className="text-body text-white/80 font-light">{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Outils */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="border-t border-line pt-6 flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
            <div className="label text-ink-3 md:w-[160px] shrink-0">Les outils</div>
            <p className="text-body text-ink-2 font-light max-w-[64ch]">
              Google Ads, Google Analytics 4 avec Consent Mode v2, Google Tag Manager, Looker
              Studio, scripts Google Ads, Google Merchant Center pour le module e-commerce. Côté
              site, WordPress. Aucune certification n&apos;est revendiquée sur ce site tant
              qu&apos;elle n&apos;est pas vérifiable publiquement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-4">
            Le plus simple reste de me faire travailler
          </h2>
          <p className="text-lead text-white font-light mb-8">
            L&apos;audit est gratuit et sans contrepartie. Vous jugerez sur ce que je rends, pas sur
            ce que j&apos;écris ici.
          </p>
          <Link href="/audit" className="btn-invert">
            Demander mon audit
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <p className="text-body text-white font-light mt-6">
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
