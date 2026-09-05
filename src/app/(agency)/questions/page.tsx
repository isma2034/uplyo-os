import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { PROBLEMS } from "@/lib/problems";

export const metadata: Metadata = {
  title: "Questions fréquentes sur un compte Google Ads qui ne va pas",
  description:
    "Coût par clic qui monte, conversions qui ne remontent pas, annonces invisibles, accès refusé par une agence : les vérifications à faire vous-même, dans l'ordre.",
  alternates: { canonical: "/questions" },
};

export default function QuestionsPage() {
  return (
    <>
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <p className="label text-eclat-ink mb-4">Questions</p>
            <h1 className="text-display font-semibold text-ink mb-5 max-w-[24ch]">
              Quand quelque chose ne va pas dans le compte
            </h1>
            <p className="text-lead text-ink-2 font-light max-w-[64ch]">
              Ces pages répondent à des questions que l&apos;on me pose vraiment. Elles sont écrites
              pour que vous puissiez faire les vérifications vous-même — y compris si vous repartez
              ensuite sans me contacter. Une page qui garde l&apos;information pour forcer un appel
              ne mérite ni d&apos;être lue ni d&apos;être citée.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface-2">
        <div className="container-wide flex flex-col gap-4 max-w-[80ch]">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link
                href={`/questions/${p.slug}`}
                className="group block bg-white border border-line rounded-card p-6 md:p-7 no-underline hover:border-line-strong transition-colors"
              >
                <h2 className="text-title font-semibold text-ink mb-2">{p.question}</h2>
                <p className="text-body text-ink-2 font-light mb-4">{p.metaDescription}</p>
                <span className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink">
                  Lire la réponse
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-4">
              Votre question n&apos;est pas là ?
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-7 max-w-[52ch] mx-auto">
              Écrivez-la moi. Si elle revient souvent, elle finira sur cette page — et vous aurez la
              réponse avant tout le monde.
            </p>
            <Link href="/contact" className="btn-primary no-underline inline-flex items-center gap-2">
              Poser ma question
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
