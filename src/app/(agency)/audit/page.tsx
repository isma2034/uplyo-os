"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";
import { SITE_CONFIG } from "@/lib/config";

const AUDIT_INCLUDES = [
  { ico: "🔬", title: "Score de performance /100", desc: "Analyse automatisée de votre compte : structure, enchères, mots-clés, annonces, tracking." },
  { ico: "💸", title: "Budget gaspillé identifié", desc: "On vous montre exactement où votre argent part en fumée et combien vous pouvez économiser." },
  { ico: "📊", title: "Benchmark vs votre secteur", desc: "Comparaison de votre CPA, CTR et ROAS avec les moyennes de votre industrie." },
  { ico: "🎯", title: "3 actions immédiates", desc: "Recommandations concrètes et priorisées que vous pouvez appliquer dès demain." },
  { ico: "📋", title: "Rapport PDF détaillé", desc: "Un document de 5-10 pages avec toutes les données, envoyé sous 48h." },
  { ico: "📞", title: "Appel de restitution 30 min", desc: "On parcourt le rapport ensemble et on répond à toutes vos questions." },
];

const TRUST_SIGNALS = [
  "CPA réduit de −65% en moyenne",
  "ROAS 4.2x pour nos clients e-com",
  "+50 comptes audités",
  "Google Ads Certified",
];

export default function AuditPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get("_honey")) return;

    const data = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      website: formData.get("website") as string,
      budget: formData.get("budget") as string,
      sector: formData.get("sector") as string,
      message: `[AUDIT GRATUIT] ${formData.get("google_ads_url") || "URL non fournie"}\n\nObjectif: ${formData.get("objective") || "Non précisé"}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        window.location.href = "/merci?source=audit";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Left — pitch */}
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4">
                <span className="w-4 h-[2px] bg-eclat rounded-full" />Audit gratuit
              </div>
              <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink mb-5">
                Découvrez combien vous <span className="text-eclat">perdez</span><br />
                <span className="italic font-light text-ink-3">sur Google Ads.</span>
              </h1>
              <p className="text-[15px] md:text-[17px] text-ink-2 max-w-[520px] leading-relaxed font-light mb-8">
                En moyenne, les PME gaspillent <strong className="text-ink font-semibold">30 à 50%</strong> de leur budget Google Ads. Notre audit IA identifie les fuites en 48h — gratuitement, sans engagement.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                {TRUST_SIGNALS.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[12px] text-ink-3 bg-[var(--w2)] border border-[var(--bd)] rounded-full px-3 py-1.5">
                    <span className="text-eclat font-bold text-xs">✓</span> {t}
                  </span>
                ))}
              </div>

              {/* What's included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AUDIT_INCLUDES.map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <span className="text-lg shrink-0">{item.ico}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-ink mb-0.5">{item.title}</div>
                      <div className="text-[12px] text-ink-2 leading-relaxed font-light">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={150}>
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center bg-white border-[1.5px] border-eclat/30 rounded-uplyo-lg p-10 text-center min-h-[400px]">
                <div className="text-4xl mb-4">🎉</div>
                <div className="text-xl font-semibold text-ink mb-2">Demande d&apos;audit reçue !</div>
                <p className="text-sm text-ink-2 font-light max-w-sm mb-6">
                  Nous analysons votre compte et vous envoyons le rapport sous 48h.
                  En attendant, vous pouvez réserver votre créneau de restitution.
                </p>
                <a
                  href={SITE_CONFIG.calendlyUrl}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary no-underline text-sm"
                >
                  📅 Réserver mon créneau →
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3.5 bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-6 md:p-8 sticky top-[84px]"
              >
                <div className="text-center mb-2">
                  <div className="text-[15px] font-semibold text-ink mb-1">Demandez votre audit gratuit</div>
                  <div className="text-[12px] text-ink-3 font-light">Rapport sous 48h · 100% gratuit · Sans engagement</div>
                </div>

                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Prénom *</label>
                    <input name="firstname" type="text" required placeholder="Sophie"
                      className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Nom *</label>
                    <input name="lastname" type="text" required placeholder="Martin"
                      className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Email professionnel *</label>
                  <input name="email" type="email" required placeholder="sophie@entreprise.fr"
                    className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat transition-colors" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Site web *</label>
                  <input name="website" type="url" required placeholder="https://monsite.fr"
                    className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat transition-colors" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">URL Google Ads (optionnel)</label>
                  <input name="google_ads_url" type="text" placeholder="ads.google.com/aw/overview?ocid=123-456-7890"
                    className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Budget mensuel</label>
                    <select name="budget" defaultValue=""
                      className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat appearance-none transition-colors">
                      <option value="" disabled>—</option>
                      <option value="500-1000">500€ – 1 000€</option>
                      <option value="1000-3000">1 000€ – 3 000€</option>
                      <option value="3000-10000">3 000€ – 10 000€</option>
                      <option value="10000+">10 000€+</option>
                      <option value="pas-encore">Pas encore de campagnes</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Secteur</label>
                    <select name="sector" defaultValue=""
                      className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat appearance-none transition-colors">
                      <option value="" disabled>—</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="btob">Services B2B</option>
                      <option value="btoc">Services B2C / Local</option>
                      <option value="artisan">Artisan / BTP</option>
                      <option value="sante">Santé / Bien-être</option>
                      <option value="immo">Immobilier</option>
                      <option value="saas">SaaS</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-ink-2 uppercase tracking-wider font-mono">Votre objectif principal</label>
                  <select name="objective" defaultValue=""
                    className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-eclat appearance-none transition-colors">
                    <option value="" disabled>—</option>
                    <option value="reduire-cpa">Réduire mon CPA</option>
                    <option value="augmenter-roas">Augmenter mon ROAS</option>
                    <option value="plus-conversions">Plus de conversions</option>
                    <option value="lancer-campagnes">Lancer mes premières campagnes</option>
                    <option value="changer-agence">Changer d&apos;agence</option>
                    <option value="audit-general">Audit général de mon compte</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-eclat text-white text-[15px] font-semibold py-3.5 rounded-lg border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  {status === "sending" ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi en cours…</>
                  ) : status === "error" ? (
                    "Réessayer →"
                  ) : (
                    "🔬 Recevoir mon audit gratuit →"
                  )}
                </button>

                <div className="text-[10px] text-ink-3 text-center font-mono">
                  Données confidentielles · Aucun démarchage · Rapport sous 48h
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* Social proof */}
      <Reveal>
        <section className="py-14 px-6 md:px-10 bg-nuit">
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-xl font-semibold text-white mb-6">Ce que nos clients disent après l&apos;audit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { text: "J'ai découvert que 40% de mon budget partait sur des mots-clés non pertinents.", name: "Sophie M.", role: "Cabinet RH" },
                { text: "Le rapport m'a montré exactement quoi changer. En 2 semaines, mon CPA a baissé de 30%.", name: "Julien L.", role: "E-commerce mode" },
                { text: "Clair, pro, actionnable. Bien au-dessus de ce que mon ancienne agence me donnait.", name: "Antoine C.", role: "BTP" },
              ].map((t) => (
                <div key={t.name} className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-5 text-left">
                  <div className="text-spark text-sm mb-2">★★★★★</div>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light mb-3">« {t.text} »</p>
                  <div className="text-[12px] text-white/30"><strong className="text-white/60">{t.name}</strong> · {t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ audit */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-8 text-center">Questions fréquentes sur l&apos;audit</h2>
            <div className="flex flex-col gap-1">
              {[
                { q: "Est-ce vraiment gratuit ?", a: "Oui, 100%. L'audit est notre façon de vous montrer notre expertise. Si vous êtes satisfait, on peut discuter d'un accompagnement — mais aucune obligation." },
                { q: "Combien de temps prend l'audit ?", a: "Nous envoyons le rapport sous 48h. L'appel de restitution dure 30 minutes." },
                { q: "J'ai besoin de donner accès à mon compte ?", a: "Idéalement oui (accès lecture seule). Mais on peut déjà faire une analyse pertinente avec votre URL et votre secteur." },
                { q: "Et si je n'ai pas encore de campagnes ?", a: "On fait un audit d'opportunité : analyse de votre marché, estimation de budget, structure recommandée. Tout aussi utile." },
                { q: "Allez-vous me harceler de relances ?", a: "Non. Un email avec le rapport + un appel si vous le souhaitez. C'est tout. Zéro spam." },
              ].map((faq) => (
                <details key={faq.q} className="bg-[var(--w2)] rounded-lg group">
                  <summary className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer text-[14px] font-medium text-ink list-none transition-colors hover:bg-lune">
                    {faq.q}
                    <span className="text-eclat text-xl shrink-0 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-[13px] text-ink-2 leading-relaxed border-t border-[var(--bd)] font-light">{faq.a}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <div className="bg-eclat py-14 px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Préférez-vous un appel direct ?</h2>
          <p className="text-[15px] text-white/60 mb-8 font-light">30 minutes avec notre expert — on regarde votre compte ensemble en temps réel.</p>
          <a
            href={SITE_CONFIG.calendlyUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-white text-eclat text-[15px] font-semibold px-8 py-4 rounded-lg no-underline transition-all hover:bg-lune hover:-translate-y-0.5"
          >
            📅 Réserver mon créneau Calendly →
          </a>
        </div>
      </Reveal>
    </>
  );
}
