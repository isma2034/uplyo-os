import { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Pack Lancement — Uplyo · Setup Google Ads en 5 jours",
  description: "Audit complet, structure campagnes, tracking GA4, dashboard Looker Studio. En ligne en 5 jours. À partir de 2 000€.",
};

const INCLUDES = [
  { ico: "🔬", title: "Audit complet", desc: "Analyse de votre marché, concurrence, mots-clés, opportunités. Benchmark CPA/ROAS secteur." },
  { ico: "🏗️", title: "Structure campagnes", desc: "Architecture Search optimale, groupes d'annonces, mots-clés, négatifs, extensions. Tout from scratch." },
  { ico: "✍️", title: "Annonces RSA", desc: "Rédaction de toutes les annonces responsive search. 15 titres, 4 descriptions par ad group." },
  { ico: "📊", title: "Tracking GA4", desc: "Configuration GA4 + Consent Mode v2. Events de conversion, tags GTM, vérification cross-device." },
  { ico: "📈", title: "Dashboard Looker Studio", desc: "Dashboard temps réel connecté à votre compte. KPIs, tendances, alertes visuelles." },
  { ico: "📋", title: "Briefing stratégique", desc: "Document de 10+ pages : stratégie, structure, KPIs cibles, planning d'optimisation." },
];

const PROCESS = [
  { day: "J0", title: "Appel découverte", desc: "30 min — on comprend votre business, objectifs, budget et marché." },
  { day: "J1", title: "Audit & stratégie", desc: "Analyse concurrence, recherche mots-clés, définition structure et budget." },
  { day: "J2-3", title: "Création campagnes", desc: "Structure, annonces, extensions, négatifs. Tout est construit dans votre compte." },
  { day: "J4", title: "Tracking & dashboard", desc: "GA4, GTM, conversions, Consent Mode v2. Dashboard Looker connecté." },
  { day: "J5", title: "Go-live & handoff", desc: "Lancement, vérification, briefing stratégique. Vous êtes opérationnel." },
];

export default function PackLancementPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4">
              <span className="w-4 h-[2px] bg-eclat rounded-full" />Pack Lancement
            </div>
            <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink mb-4">
              Vos Google Ads <span className="text-eclat">en ligne</span><br />
              <span className="italic font-light text-ink-3">en 5 jours.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-ink-2 max-w-[560px] leading-relaxed font-light mb-8">
              De l&apos;audit à la mise en ligne — on crée tout de zéro. Structure, annonces, tracking, dashboard. Vous n&apos;avez rien à faire.
            </p>
            <div className="flex items-center gap-6 flex-wrap mb-8">
              <div>
                <div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-1">À PARTIR DE</div>
                <div className="text-3xl font-semibold text-ink">2 000€</div>
                <div className="text-[12px] text-ink-3 font-light">one-shot · go-live J5</div>
              </div>
              <Link href="/contact" className="btn-primary no-underline text-sm md:text-base">Réserver un appel →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-10">Ce qui est inclus</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDES.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-6 h-full transition-all hover:border-eclat hover:-translate-y-1">
                  <div className="text-2xl mb-3">{item.ico}</div>
                  <h3 className="text-[15px] font-semibold text-ink mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-ink-2 leading-relaxed font-light">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-10">Le process — 5 jours</h2>
          </Reveal>
          <div className="flex flex-col gap-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.day} delay={i * 80}>
                <div className="flex gap-5 items-start bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-5 transition-all hover:border-eclat">
                  <div className="font-mono text-[13px] font-semibold text-eclat bg-lune border border-[var(--bd)] rounded-lg px-3 py-1.5 shrink-0">{step.day}</div>
                  <div>
                    <div className="text-[15px] font-semibold text-ink mb-1">{step.title}</div>
                    <p className="text-[13px] text-ink-2 leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="bg-eclat py-14 px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Prêt à lancer vos campagnes ?</h2>
          <p className="text-[15px] text-white/60 mb-8 font-light">Audit gratuit de 30 min — on analyse votre marché et vous donne un plan d&apos;action.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-eclat text-[15px] font-semibold px-8 py-4 rounded-lg no-underline transition-all hover:bg-lune hover:-translate-y-0.5">
            📅 Réserver mon audit gratuit →
          </Link>
        </div>
      </Reveal>
    </>
  );
}
