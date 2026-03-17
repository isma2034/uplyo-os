import { Metadata } from "next";
import ContactForm from "@/components/agency/ContactForm";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Contact — Uplyo · Agence Google Ads",
  description: "Réservez un audit Google Ads gratuit en 30 minutes. Réponse sous 24h.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto text-center mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4">
              <span className="w-4 h-[2px] bg-eclat rounded-full" />Contact
            </div>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink mb-4">
              Parlons de votre <span className="text-eclat">projet</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-ink-2 max-w-[560px] mx-auto leading-relaxed font-light">
              30 minutes avec notre expert Google Ads. Analyse de votre compte ou de votre marché. Sans engagement.
            </p>
          </Reveal>
        </div>

        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">
          {/* Left column — info + Calendly */}
          <Reveal>
            <div>
              {/* Calendly CTA */}
              <div className="bg-eclat rounded-uplyo-lg p-6 md:p-8 mb-6 text-center">
                <div className="text-2xl mb-3">📅</div>
                <h3 className="text-lg font-semibold text-white mb-2">Réservez votre créneau</h3>
                <p className="text-[13px] text-white/60 mb-5 font-light">
                  Choisissez un créneau de 30 min directement dans notre agenda.
                </p>
                <a
                  href="https://calendly.com/uplyo/audit"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 bg-white text-eclat text-[14px] font-semibold px-6 py-3 rounded-lg no-underline transition-all hover:bg-lune hover:-translate-y-0.5"
                >
                  Choisir mon créneau →
                </a>
                <div className="flex gap-3 justify-center mt-4 flex-wrap">
                  {["Gratuit", "30 min", "Sans engagement"].map((t) => (
                    <span key={t} className="text-[11px] text-white/40 font-mono">{t}</span>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="flex flex-col gap-4 mb-6">
                {[
                  { ico: "✉️", label: "EMAIL", value: "contact@uplyo.fr", href: "mailto:contact@uplyo.fr" },
                  { ico: "🌍", label: "ZONE", value: "France · España · Belgique · Suisse", href: undefined },
                  { ico: "🏆", label: "CERTIFICATIONS", value: "Google Ads · GA4 · Looker Studio", href: undefined },
                  { ico: "⏱️", label: "DÉLAI DE RÉPONSE", value: "Sous 24h ouvrées", href: undefined },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white border-[1.5px] border-[var(--bd)] rounded-lg grid place-items-center text-sm shrink-0">{c.ico}</div>
                    <div>
                      <div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-0.5">{c.label}</div>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-eclat no-underline hover:underline font-medium">{c.value}</a>
                      ) : (
                        <div className="text-sm text-ink">{c.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-[var(--bd2)] rounded-lg px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-eclat animate-pulse-dot shrink-0" />
                <span className="text-[13px] text-ink-2 font-light">
                  Disponible — Réponse sous <strong className="text-eclat font-semibold">24h ouvrées</strong>
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right column — form */}
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
