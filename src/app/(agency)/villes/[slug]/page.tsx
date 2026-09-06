import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { CITIES, CITY_BY_SLUG } from "@/lib/cities";
import { CITY_STATS, share, publishable, SCAN } from "@/lib/market-data";
import { SECTORS } from "@/lib/sectors";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = CITY_BY_SLUG.get(params.slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/villes/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `https://uplyo.fr/villes/${c.slug}`,
    },
  };
}

export default function VillePage({ params }: { params: { slug: string } }) {
  const c = CITY_BY_SLUG.get(params.slug);
  if (!c) notFound();

  const stat = CITY_STATS[c.slug];
  const showShare = stat && publishable(stat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://uplyo.fr" },
          { "@type": "ListItem", position: 2, name: "Villes", item: "https://uplyo.fr/villes" },
          {
            "@type": "ListItem",
            position: 3,
            name: c.name,
            item: `https://uplyo.fr/villes/${c.slug}`,
          },
        ],
      },
      {
        // Article, et non LocalBusiness : Uplyo n'a pas d'établissement dans
        // ces villes. Déclarer un LocalBusiness par ville reviendrait à
        // affirmer une présence physique qui n'existe pas.
        "@type": "Article",
        headline: c.metaTitle,
        description: c.metaDescription,
        author: { "@id": "https://uplyo.fr/a-propos#ismael" },
        publisher: { "@id": "https://uplyo.fr/#organization" },
        mainEntityOfPage: `https://uplyo.fr/villes/${c.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section">
        <div className="container-wide">
          <Reveal>
            <nav aria-label="Fil d'Ariane" className="label text-ink-3 mb-5">
              <Link href="/villes" className="text-ink-3 no-underline hover:text-eclat-ink">
                Villes
              </Link>
              <span aria-hidden="true"> · </span>
              <span className="text-ink-2">{c.name}</span>
            </nav>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[22ch]">
              Google Ads {c.prep}, vu depuis les données
            </h1>
            <p className="text-lead text-ink-2 font-light max-w-[62ch]">{c.intro}</p>
          </Reveal>

          {stat && (
            <Reveal delay={80}>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[52rem]">
                {[
                  { v: String(stat.scanned), l: "entreprises analysées" },
                  { v: String(stat.advertisers), l: "annonceurs détectés" },
                  ...(showShare ? [{ v: `${share(stat)} %`, l: "de l'échantillon" }] : []),
                ].map((k) => (
                  <div key={k.l} className="bg-surface-2 border border-line rounded-card p-5">
                    <div className="text-title font-semibold text-ink">{k.v}</div>
                    <div className="text-caption text-ink-3">{k.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Composition sectorielle — en comptages bruts, jamais en pourcentages :
          les sous-échantillons par métier sont trop petits pour ça. */}
      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-3">
              Ce que contient l&apos;échantillon {c.prep.replace("à ", "de ")}
            </h2>
            <p className="text-body text-ink-3 font-light mb-7 max-w-[62ch]">
              Comptages bruts, relevés en {SCAN.date}. Les effectifs par métier sont trop faibles
              pour en tirer des pourcentages — ils sont donnés tels quels.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.mix.map((m, i) => {
              const sector = SECTORS.find((s) => s.plural === m.sector);
              const inner = (
                <>
                  <div className="text-title font-semibold text-ink mb-1">{m.count}</div>
                  <div className="text-body text-ink-2 font-light mb-3">{m.sector}</div>
                  <div className="label text-eclat-ink">
                    {m.advertisers === 0
                      ? "aucun annonceur détecté"
                      : `${m.advertisers} annonceur${m.advertisers > 1 ? "s" : ""} détecté${m.advertisers > 1 ? "s" : ""}`}
                  </div>
                </>
              );
              return (
                <Reveal key={m.sector} delay={i * 70}>
                  {sector ? (
                    <Link
                      href={`/secteurs/${sector.slug}`}
                      className="block bg-white border border-line rounded-card p-6 h-full no-underline hover:border-line-strong transition-colors"
                    >
                      {inner}
                      <span className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink mt-3">
                        Voir le secteur
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </Link>
                  ) : (
                    <div className="bg-white border border-line rounded-card p-6 h-full">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide max-w-[74ch]">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">Ce que j&apos;en lis</h2>
            <p className="text-body-lg text-ink-2 font-light">{c.reading}</p>
          </Reveal>
        </div>
      </section>

      {/* Mention de transparence obligatoire : pas de fausse présence locale. */}
      <section className="section bg-surface-2">
        <div className="container-wide max-w-[74ch]">
          <Reveal>
            <div className="bg-white border border-line-strong rounded-card p-6 md:p-7">
              <div className="flex items-start gap-3 mb-3">
                <Info size={20} className="text-ink-2 mt-0.5 shrink-0" aria-hidden="true" />
                <h2 className="text-title font-semibold text-ink">
                  Je n&apos;ai pas de bureau {c.prep}
                </h2>
              </div>
              <p className="text-body-lg text-ink-2 font-light">
                Uplyo est une activité indépendante qui travaille à distance, partout en France.
                Cette page existe parce que j&apos;ai des données sur ce marché, pas parce que j&apos;y
                aurais une agence. La gestion d&apos;un compte Google Ads ne demande aucune présence
                sur place — mais autant que ce soit dit clairement.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">
              Savoir où vous vous situez dans ce marché
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[54ch] mx-auto">
              L&apos;audit part de votre compte et de votre site, pas d&apos;une moyenne. Il est
              gratuit et vous repartez avec.
            </p>
            <Link href="/audit" className="btn-primary no-underline inline-flex items-center gap-2">
              Recevoir mon audit gratuit
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
