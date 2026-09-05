import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Search, Wrench, AlertTriangle } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { PROBLEMS, PROBLEM_BY_SLUG } from "@/lib/problems";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = PROBLEM_BY_SLUG.get(params.slug);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/questions/${p.slug}` },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `https://uplyo.fr/questions/${p.slug}`,
    },
  };
}

export default function QuestionPage({ params }: { params: { slug: string } }) {
  const p = PROBLEM_BY_SLUG.get(params.slug);
  if (!p) notFound();

  // Les autres questions, pour le maillage interne : ces pages se lisent
  // rarement seules — quelqu'un qui a un souci de tracking en a souvent deux.
  const others = PROBLEMS.filter((o) => o.slug !== p.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://uplyo.fr" },
          { "@type": "ListItem", position: 2, name: "Questions", item: "https://uplyo.fr/questions" },
          {
            "@type": "ListItem",
            position: 3,
            name: p.question,
            item: `https://uplyo.fr/questions/${p.slug}`,
          },
        ],
      },
      {
        // Article et non FAQPage : depuis 2023 Google réserve les résultats
        // enrichis FAQ aux sites gouvernementaux et de santé. Déclarer FAQPage
        // ici n'apporterait rien et brouillerait le type réel du contenu.
        "@type": "Article",
        headline: p.metaTitle,
        description: p.metaDescription,
        author: { "@id": "https://uplyo.fr/a-propos#ismael" },
        publisher: { "@id": "https://uplyo.fr/#organization" },
        mainEntityOfPage: `https://uplyo.fr/questions/${p.slug}`,
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
              <Link href="/questions" className="text-ink-3 no-underline hover:text-eclat-ink">
                Questions
              </Link>
            </nav>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[24ch]">{p.question}</h1>
            <p className="text-lead text-ink-2 font-light max-w-[64ch]">{p.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface-2">
        <div className="container-wide">
          <div className="flex flex-col gap-5 max-w-[80ch]">
            {p.causes.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <div className="bg-white border border-line rounded-card p-6 md:p-7">
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="font-mono text-caption text-eclat-ink shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-title font-semibold text-ink">{c.title}</h2>
                  </div>

                  <div className="flex flex-col gap-4 pl-0 sm:pl-8">
                    <div className="flex items-start gap-3">
                      <Search size={17} className="text-ink-3 mt-1 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="label text-ink-3 mb-1">Comment le vérifier</div>
                        <p className="text-body-lg text-ink-2 font-light">{c.check}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wrench size={17} className="text-eclat-ink mt-1 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="label text-eclat-ink mb-1">Ce qu&apos;on en fait</div>
                        <p className="text-body-lg text-ink-2 font-light">{c.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Limite de la page — même règle que les pages sectorielles. */}
      <section className="section">
        <div className="container-wide max-w-[74ch]">
          <Reveal>
            <div className="bg-surface-2 border border-line-strong rounded-card p-6 md:p-7">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle size={20} className="text-ink-2 mt-0.5 shrink-0" aria-hidden="true" />
                <h2 className="text-title font-semibold text-ink">Ce que cette page ne règle pas</h2>
              </div>
              <p className="text-body-lg text-ink-2 font-light">{p.honest}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-6">Les autres questions</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 70}>
                <Link
                  href={`/questions/${o.slug}`}
                  className="group block bg-white border border-line rounded-card p-6 h-full no-underline hover:border-line-strong transition-colors"
                >
                  <p className="text-body-lg font-semibold text-ink mb-3">{o.question}</p>
                  <span className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink">
                    Lire
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">
              Vous préférez que je regarde moi-même ?
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[54ch] mx-auto">
              L&apos;audit est gratuit et vous repartez avec le rapport, que l&apos;on travaille
              ensemble ou non.
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
