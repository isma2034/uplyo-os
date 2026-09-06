import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { CITIES } from "@/lib/cities";
import { CITY_STATS, share, publishable, SCAN } from "@/lib/market-data";

export const metadata: Metadata = {
  title: "Google Ads par ville : relevé de marché",
  description:
    "Combien d'entreprises diffusent réellement des annonces Google Ads à Lyon, Paris, Rennes, Nantes et Toulouse. Chiffres mesurés, échantillons affichés.",
  alternates: { canonical: "/villes" },
};

export default function VillesPage() {
  return (
    <>
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <p className="label text-eclat-ink mb-4">Par ville</p>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[24ch]">
              Qui fait réellement de la publicité dans votre ville
            </h1>
            <p className="text-lead text-ink-2 font-light max-w-[62ch]">
              On répète volontiers que « tout le monde fait du Google Ads ». Sur les {SCAN.total}{" "}
              entreprises françaises que j&apos;ai analysées en {SCAN.date}, {SCAN.advertisers} ont
              un suivi de conversion Google Ads détectable — soit une sur huit. Voici le détail,
              ville par ville.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <p className="text-body text-ink-3 font-light mt-6 max-w-[62ch]">
              La détection repose sur la lecture du conteneur Google Tag Manager public de chaque
              site. Une campagne sans suivi de conversion échappe au comptage : ces chiffres sont
              donc des planchers, jamais des plafonds. Aucune entreprise n&apos;est nommée, et je
              n&apos;ai de bureau dans aucune de ces villes — je travaille à distance.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface-2">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-5">
          {CITIES.map((c, i) => {
            const stat = CITY_STATS[c.slug];
            return (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/villes/${c.slug}`}
                  className="group block bg-white border border-line rounded-card p-6 md:p-7 h-full no-underline hover:border-line-strong transition-colors"
                >
                  <h2 className="text-title font-semibold text-ink mb-2">{c.name}</h2>
                  {stat && (
                    <div className="label text-eclat-ink mb-3">
                      {stat.advertisers} annonceurs sur {stat.scanned} analysés
                      {publishable(stat) ? ` · ${share(stat)} %` : ""}
                    </div>
                  )}
                  <p className="text-body text-ink-2 font-light mb-4">{c.metaDescription}</p>
                  <span className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink">
                    Voir le relevé
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">
              Votre ville n&apos;est pas listée ?
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[54ch] mx-auto">
              Je ne publie une ville que si l&apos;échantillon la supporte. L&apos;audit, lui, ne
              dépend d&apos;aucun relevé : il part de votre compte et de votre site.
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
