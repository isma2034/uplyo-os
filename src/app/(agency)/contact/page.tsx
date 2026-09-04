import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Globe, Wrench, Clock } from "lucide-react";
import ContactForm from "@/components/agency/ContactForm";
import Reveal from "@/components/agency/Reveal";
import { SITE_CONFIG } from "@/lib/config";
import { TERMS } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrivez-moi ou réservez un créneau de 30 minutes. Réponse sous 24 h ouvrées, sans engagement.",
  alternates: { canonical: "/contact" },
};

const INFOS = [
  { Ico: Mail, k: "Email", v: SITE_CONFIG.contactEmail, href: `mailto:${SITE_CONFIG.contactEmail}` },
  // Zone alignée sur l'activité réelle : la France. Le site affichait
  // « France · España · Belgique · Suisse » à cet endroit alors que le JSON-LD
  // ne déclarait que la France, et qu'aucune activité hors France n'existe.
  { Ico: Globe, k: "Zone", v: "France · travail à distance", href: undefined },
  { Ico: Wrench, k: "Outils", v: "Google Ads · GA4 · Looker Studio", href: undefined },
  { Ico: Clock, k: "Délai de réponse", v: TERMS.replyDelay, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <section className="section">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-12">
              <p className="label text-eclat-ink mb-4">Contact</p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Dites-moi ce que vous vendez et à qui.
              </h1>
              <p className="text-lead text-ink-2 font-light">
                C&apos;est moi qui lis les messages et c&apos;est moi qui réponds — sous 24 h
                ouvrées. Si votre demande est d&apos;abord de savoir où part votre budget,{" "}
                <Link href="/audit" className="text-eclat-ink font-medium underline underline-offset-4">
                  l&apos;audit gratuit
                </Link>{" "}
                est plus direct.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
            <Reveal>
              <div>
                {/* Créneau direct */}
                <div className="border border-line rounded-card p-6 mb-6 bg-white">
                  <div className="label text-ink-3 mb-2">Vous préférez parler</div>
                  <h2 className="text-title font-semibold text-ink mb-2">
                    Un créneau de 30 minutes
                  </h2>
                  <p className="text-body text-ink-2 font-light mb-5">
                    Dans mon agenda, sans passer par le formulaire. Gratuit, et sans engagement.
                  </p>
                  <a
                    href={SITE_CONFIG.calendlyUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                  >
                    Choisir un créneau
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>

                {/* Infos */}
                <dl className="border-t border-line">
                  {INFOS.map(({ Ico, k, v, href }) => (
                    <div key={k} className="flex items-start gap-3.5 py-4 border-b border-line">
                      <Ico size={18} className="text-eclat-ink shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <dt className="label text-ink-3 mb-1">{k}</dt>
                        <dd className="text-body text-ink">
                          {href ? (
                            <a
                              href={href}
                              className="text-eclat-ink no-underline hover:underline underline-offset-4 font-medium"
                            >
                              {v}
                            </a>
                          ) : (
                            v
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full bg-eclat animate-pulse-dot shrink-0"
                  />
                  <span className="text-body text-ink-2 font-light">
                    Je prends de nouveaux comptes en ce moment.
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
