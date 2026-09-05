import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Ban, Target, BarChart3, Layers, AlertTriangle } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { SECTORS, SECTOR_BY_SLUG } from "@/lib/sectors";
import { SECTOR_STATS, statSentence, publishable, SCAN } from "@/lib/market-data";

// Pages statiques : le contenu ne dépend d'aucune donnée de requête, il n'y a
// aucune raison de les rendre à la demande.
export function generateStaticParams() {
  return SECTORS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const s = SECTOR_BY_SLUG.get(params.slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/secteurs/${s.slug}` },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url: `https://uplyo.fr/secteurs/${s.slug}`,
    },
  };
}

export default function SecteurPage({ params }: { params: { slug: string } }) {
  const s = SECTOR_BY_SLUG.get(params.slug);
  if (!s) notFound();

  const stat = SECTOR_STATS[s.slug];
  const showStat = stat && publishable(stat);

  // Le fil d'Ariane aide Google à comprendre la hiérarchie du site, et
  // s'affiche parfois directement dans les résultats de recherche.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://uplyo.fr" },
          { "@type": "ListItem", position: 2, name: "Secteurs", item: "https://uplyo.fr/secteurs" },
          {
            "@type": "ListItem",
            position: 3,
            name: s.h1,
            item: `https://uplyo.fr/secteurs/${s.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: s.metaTitle,
        description: s.metaDescription,
        author: { "@id": "https://uplyo.fr/a-propos#ismael" },
        publisher: { "@id": "https://uplyo.fr/#organization" },
        mainEntityOfPage: `https://uplyo.fr/secteurs/${s.slug}`,
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
              <Link href="/secteurs" className="text-ink-3 no-underline hover:text-eclat-ink">
                Secteurs
              </Link>
              <span aria-hidden="true"> · </span>
              <span className="text-ink-2">{s.plural}</span>
            </nav>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[20ch]">{s.h1}</h1>
            <p className="text-lead text-ink-2 font-light max-w-[62ch]">{s.intro}</p>
          </Reveal>

          {/* Le chiffre du relevé : c'est la seule donnée du site qu'aucun
              concurrent ne peut recopier, et elle est toujours accompagnée de
              sa taille d'échantillon. */}
          {showStat && (
            <Reveal delay={80}>
              <div className="mt-8 bg-surface-2 border border-line rounded-card p-6 md:p-7 max-w-[70ch]">
                <div className="label text-eclat-ink mb-3">Relevé Uplyo · {SCAN.date}</div>
                <p className="text-body-lg text-ink-2 font-light">{statSentence(stat, s.plural)}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Intention de recherche */}
      <section className="section bg-surface-2">
        <div className="container-wide max-w-[76ch]">
          <Reveal>
            <div className="flex items-start gap-3 mb-4">
              <Target size={22} className="text-eclat-ink mt-1 shrink-0" aria-hidden="true" />
              <h2 className="text-section font-semibold text-ink">{s.intent.title}</h2>
            </div>
            <p className="text-body-lg text-ink-2 font-light">{s.intent.body}</p>
          </Reveal>
        </div>
      </section>

      {/* Exclusions */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="flex items-start gap-3 mb-3">
              <Ban size={22} className="text-eclat-ink mt-1 shrink-0" aria-hidden="true" />
              <h2 className="text-section font-semibold text-ink">
                Les exclusions qui changent le plus
              </h2>
            </div>
            <p className="text-body text-ink-3 font-light mb-7 max-w-[62ch]">
              La liste importe moins que la raison : c&apos;est elle qui vous permet de juger si
              l&apos;exclusion s&apos;applique à votre cas.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[70rem]">
            {s.negatives.map((n, i) => (
              <Reveal key={n.term} delay={i * 60}>
                <div className="bg-white border border-line rounded-card p-5 h-full">
                  <div className="font-mono text-caption text-eclat-ink mb-2">{n.term}</div>
                  <p className="text-body text-ink-2 font-light">{n.why}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mesure + structure */}
      <section className="section bg-surface-2">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {[
            { icon: BarChart3, ...s.tracking },
            { icon: Layers, ...s.structure },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div className="bg-white border border-line rounded-card p-6 md:p-8 h-full">
                <b.icon size={22} className="text-eclat-ink mb-4" aria-hidden="true" />
                <h2 className="text-title font-semibold text-ink mb-3">{b.title}</h2>
                <p className="text-body-lg text-ink-2 font-light">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Angles d'annonce */}
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-7">Ce qui fait la différence</h2>
          </Reveal>
          <ul className="flex flex-col gap-4 max-w-[72ch] list-none p-0 m-0">
            {s.angles.map((a, i) => (
              <Reveal key={a} delay={i * 60}>
                <li className="flex items-start gap-3">
                  <ArrowRight size={17} className="text-eclat-ink mt-1.5 shrink-0" aria-hidden="true" />
                  <span className="text-body-lg text-ink-2 font-light">{a}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Réserve honnête — obligatoire sur chaque page sectorielle. */}
      <section className="section bg-surface-2">
        <div className="container-wide max-w-[72ch]">
          <Reveal>
            <div className="bg-white border border-line-strong rounded-card p-6 md:p-8">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle size={20} className="text-ink-2 mt-0.5 shrink-0" aria-hidden="true" />
                <h2 className="text-title font-semibold text-ink">Quand ça ne vaut pas le coup</h2>
              </div>
              <p className="text-body-lg text-ink-2 font-light">{s.caveat}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">
              Savoir ce que ça donnerait chez vous
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[54ch] mx-auto">
              L&apos;audit est gratuit et vous repartez avec, que l&apos;on travaille ensemble ou
              non. Aucun chiffre de performance ne vous sera promis avant que j&apos;aie vu votre
              compte.
            </p>
            <Link href="/audit" className="btn-primary no-underline inline-flex items-center gap-2">
              Demander l&apos;audit
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
