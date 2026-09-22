import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { CITIES, CITY_BY_SLUG } from "@/lib/cities";
import MarketReadout from "@/components/agency/MarketReadout";
import GoogleTrendsWidget from "@/components/agency/GoogleTrendsWidget";
import { CITY_STATS, SCAN } from "@/lib/market-data";
import { SECTORS } from "@/lib/sectors";

/** Région administrative de chaque ville, au sens Google Trends (codes
 * ISO 3166-2:FR) — permet un relevé de tendance régional plutôt que
 * seulement national sur les pages villes. Le mot-clé est volontairement le
 * même partout ("agence immobilière") : c'est le secteur n°1 du mix réel
 * dans les 8 villes du relevé, donc factuellement le bon choix pour
 * chacune — ce qui change d'une ville à l'autre, c'est la région ciblée. */
const CITY_REGION: Record<string, { geo: string; label: string }> = {
  lyon: { geo: "FR-ARA", label: "Auvergne-Rhône-Alpes" },
  paris: { geo: "FR-IDF", label: "Île-de-France" },
  rennes: { geo: "FR-BRE", label: "Bretagne" },
  nantes: { geo: "FR-PDL", label: "Pays de la Loire" },
  toulouse: { geo: "FR-OCC", label: "Occitanie" },
  bordeaux: { geo: "FR-NAQ", label: "Nouvelle-Aquitaine" },
  lille: { geo: "FR-HDF", label: "Hauts-de-France" },
  marseille: { geo: "FR-PAC", label: "Provence-Alpes-Côte d'Azur" },
};

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
              {/* Cible tactile >= 24 px : voir la note du fil d'Ariane des
                  pages sectorielles (WCAG 2.2 AA, 2.5.8). */}
              <Link
                href="/villes"
                className="inline-flex items-center py-1.5 text-ink-3 no-underline hover:text-eclat-ink"
              >
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
              <div className="mt-9">
                <MarketReadout stat={stat} label={`entreprises ${c.prep.replace("à ", "de ")}`} />
              </div>
            </Reveal>
          )}

          {/* Lecture comparée au national : les deux chiffres (part locale,
              part nationale) sont mesurés de la même façon (SCAN), donc
              comparables — ce n'est pas une estimation ajoutée par-dessus. */}
          {stat && (
            <Reveal delay={140}>
              <div className="mt-6 flex gap-3 bg-lune border border-line rounded-card p-5 max-w-[62ch]">
                <Info size={18} className="text-eclat-ink shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-body text-ink-2 font-light">
                  {(() => {
                    const cityShare = Math.round((stat.advertisers / stat.scanned) * 100);
                    const nationalShare = Math.round((SCAN.advertisers / SCAN.total) * 100);
                    const diff = cityShare - nationalShare;
                    if (Math.abs(diff) < 2) {
                      return `${c.name} est proche de la moyenne nationale (${nationalShare} % d'annonceurs détectés sur l'ensemble du relevé) : ni un marché saturé, ni un boulevard.`;
                    }
                    if (diff < 0) {
                      return `${c.name} est en-dessous de la moyenne nationale de détection publicitaire (${cityShare} % contre ${nationalShare} %) : moins d'entreprises y misent sur Google Ads, ce qui joue généralement en faveur du coût par clic pour celles qui s'y lancent.`;
                    }
                    return `${c.name} est au-dessus de la moyenne nationale de détection publicitaire (${cityShare} % contre ${nationalShare} %) : plus de concurrents y sont déjà présents, la qualité des annonces et de la page de destination pèse davantage qu'ailleurs.`;
                  })()}
                </p>
              </div>
            </Reveal>
          )}

          {CITY_REGION[c.slug] && (
            <Reveal delay={200}>
              <div className="mt-6">
                <GoogleTrendsWidget
                  keyword="agence immobilière"
                  label={`Intérêt de recherche en ${CITY_REGION[c.slug].label}`}
                  geo={CITY_REGION[c.slug].geo}
                  geoLabel={CITY_REGION[c.slug].label}
                />
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
                  <div className="text-caption font-semibold text-eclat-ink">
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
