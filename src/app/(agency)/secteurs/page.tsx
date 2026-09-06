import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { SECTORS } from "@/lib/sectors";
import { SECTOR_STATS, publishable, share, SCAN } from "@/lib/market-data";

export const metadata: Metadata = {
  title: "Google Ads par secteur : ce qui change",
  description:
    "Exclusions, suivi de conversion et structure de compte diffèrent selon le métier. Un relevé de 790 entreprises françaises.",
  alternates: { canonical: "/secteurs" },
};

export default function SecteursPage() {
  return (
    <>
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <p className="label text-eclat-ink mb-4">Par secteur</p>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[22ch]">
              Ce qui marche dans un métier ne marche pas dans l&apos;autre
            </h1>
            <p className="text-lead text-ink-2 font-light max-w-[62ch]">
              Les exclusions, ce qu&apos;il faut compter comme conversion et la façon de découper
              un compte n&apos;ont presque rien en commun d&apos;un secteur à l&apos;autre. Chaque
              page ci-dessous traite un métier précis — et dit aussi dans quels cas Google Ads
              n&apos;est pas le bon levier.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <p className="text-body text-ink-3 font-light mt-6 max-w-[62ch]">
              Les chiffres cités viennent d&apos;un relevé que j&apos;ai réalisé en {SCAN.date} sur{" "}
              {SCAN.total} entreprises françaises : pour chacune, la lecture du conteneur Google Tag
              Manager public permet de savoir si un suivi de conversion Google Ads y est configuré.
              Aucune entreprise n&apos;est nommée.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface-2">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-5">
          {SECTORS.map((s, i) => {
            const stat = SECTOR_STATS[s.slug];
            return (
              <Reveal key={s.slug} delay={i * 70}>
                <Link
                  href={`/secteurs/${s.slug}`}
                  className="group block bg-white border border-line rounded-card p-6 md:p-7 h-full no-underline hover:border-line-strong transition-colors"
                >
                  <h2 className="text-title font-semibold text-ink mb-2 capitalize">{s.plural}</h2>
                  {stat && publishable(stat) && (
                    <div className="label text-eclat-ink mb-3">
                      {stat.advertisers} annonceurs sur {stat.scanned} analysés · {share(stat)} %
                    </div>
                  )}
                  <p className="text-body text-ink-2 font-light mb-4">{s.metaDescription}</p>
                  <span className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink">
                    Lire
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
              Votre métier n&apos;est pas dans la liste ?
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[52ch] mx-auto">
              Ces pages couvrent les secteurs sur lesquels j&apos;ai des données. L&apos;audit,
              lui, ne dépend d&apos;aucune liste : il part de votre compte et de votre site.
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
