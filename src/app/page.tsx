import Link from "next/link";
import { Metadata } from "next";
import Reveal from "@/components/agency/Reveal";
import Ticker from "@/components/agency/Ticker";
import Navbar from "@/components/agency/Navbar";
import ContactForm from "@/components/agency/ContactForm";

export const metadata: Metadata = {
  title: "Uplyo — Agence Google Ads Performance pour PME & E-commerce",
  description: "Agence Google Ads spécialisée PME et e-commerce. CPA réduit de 65%, ROAS moyen 4.2x, go-live en 5 jours. Audit gratuit.",
  openGraph: { title: "Uplyo — Google Ads Agency", description: "Agence Google Ads performance pour PME et e-commerce.", url: "https://uplyo.fr", siteName: "Uplyo", locale: "fr_FR", type: "website" },
};

const PAINS = [
  { n: "01", title: "Vous payez des clics sans résultats", desc: "Votre budget fond chaque jour sans que vous sachiez quels mots-clés ou annonces performent vraiment.", cost: "~40% du budget gaspillé" },
  { n: "02", title: "Votre agence actuelle est une boîte noire", desc: "Rapports flous, pas d'accès au compte, impossible de savoir où part votre argent.", cost: "Zéro visibilité" },
  { n: "03", title: "Le tracking est cassé ou inexistant", desc: "GA4 mal configuré, conversions dupliquées ou manquantes. Les décisions sont prises à l'aveugle.", cost: "Données faussées" },
  { n: "04", title: "Vous n'avez pas le temps de gérer ça", desc: "Enchères, audiences, annonces, extensions, scripts. Google Ads est un métier à plein temps.", cost: "+15h/semaine perdues" },
];

const SERVICES = [
  { tag: "LANCEMENT", title: "Pack Lancement", desc: "Audit complet, structure from scratch, tracking GA4 + Consent Mode v2, dashboard Looker Studio. En ligne en 5 jours.", items: ["Audit marché & concurrence", "Structure campagnes optimale", "Tracking GA4 + conversions", "Dashboard Looker Studio", "Briefing stratégique"], from: "À PARTIR DE", price: "2 000€", note: "one-shot · go-live J5", featured: false, href: "/offres/pack-lancement" },
  { tag: "PILOTAGE", title: "Retainer Mensuel", desc: "Optimisation continue, enchères, A/B tests, scripts d'automation, rapports hebdo. Votre expert dédié.", items: ["Optimisation enchères & budgets", "A/B tests annonces continu", "Scripts d'automation déployés", "Rapports hebdo + mensuel", "Account manager dédié", "Appel stratégique mensuel"], from: "À PARTIR DE", price: "500€", note: "/mois · engagement 6 mois", featured: true, href: "/offres/retainer" },
  { tag: "E-COMMERCE", title: "Pack E-commerce", desc: "Shopping, Performance Max, feed optimization, ROAS tracking avancé. Pour les boutiques qui veulent scaler.", items: ["Google Shopping optimisé", "Performance Max structuré", "Feed produit optimisé", "ROAS tracking avancé", "Segmentation audiences"], from: "À PARTIR DE", price: "2 000€", note: "/mois · adapté au volume", featured: false, href: "/offres/ecommerce" },
];

const STEPS = [
  { ico: "📞", t: "Appel découverte", d: "30 min — objectifs, marché, budget", day: "J0" },
  { ico: "🔬", t: "Audit & stratégie", d: "Analyse compte ou marché", day: "J1" },
  { ico: "🏗️", t: "Structure & annonces", d: "Campagnes, groupes, copy, extensions", day: "J2-3" },
  { ico: "📊", t: "Tracking & dashboard", d: "GA4, conversions, Looker", day: "J4" },
  { ico: "🚀", t: "Go-live & suivi", d: "Lancement, monitoring, optim", day: "J5" },
];

const KPIS = [
  { label: "CPA réduit", value: "−65%", desc: "Coût par acquisition après 90j" },
  { label: "Conversions", value: "+34%", desc: "Volume leads / ventes M/M" },
  { label: "ROAS e-com", value: "4.2x", desc: "Retour sur dépense pub" },
  { label: "Go-live", value: "5J", desc: "De la signature au lancement" },
];

const TESTIMONIALS = [
  { text: "Avant Uplyo, je dépensais 2 500€/mois pour 3 ou 4 appels. Maintenant j'en reçois 20 pour le même budget.", name: "Sophie M.", role: "Directrice · Cabinet conseil RH · Paris", badge: "Lead Gen", initials: "SM" },
  { text: "ROAS de 1.8x à 4.6x en 6 mois. Les rapports automatiques sont clairs — même mon comptable les comprend.", name: "Julien L.", role: "Fondateur · Mode en ligne · Lyon", badge: "E-com", initials: "JL" },
  { text: "5 jours comme promis. Le dashboard Looker Studio m'a époustouflé — je vois tout en temps réel.", name: "Antoine C.", role: "Gérant · Entreprise BTP · Bordeaux", badge: "PME locale", initials: "AC" },
];

const FAQS = [
  { q: "Comment sont calculés vos tarifs ?", a: "Chaque mission est devisée sur mesure selon votre marché, la concurrence et vos objectifs. Les tarifs affichés sont les points d'entrée — le devis final vous est envoyé sous 24h." },
  { q: "En combien de temps mes campagnes sont-elles en ligne ?", a: "Exactement 5 jours ouvrés. J1 : audit. J2-3 : structure + annonces. J4 : tracking GA4 + Consent Mode v2. J5 : lancement + Looker Studio." },
  { q: "Gérez-vous notre budget Google Ads ?", a: "Non — et c'est intentionnel. Le budget publicitaire est réglé directement par vous auprès de Google. Nous facturons uniquement nos prestations." },
  { q: "Quel budget Google Ads minimum ?", a: "500€/mois minimum pour les PME locales, 1 000€/mois pour l'e-commerce." },
  { q: "Comment fonctionne l'engagement ?", a: "Retainer mensuel engageant sur 6 mois minimum après le setup, puis résiliable avec 30 jours de préavis." },
];

export default function AgencyPage() {
  return (
    <div className="bg-[var(--w)] text-ink overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[42%] h-full z-0 hidden lg:block" style={{ background: "linear-gradient(150deg, var(--lune) 0%, var(--lune2) 100%)", clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="relative z-10 w-full max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-center pt-[88px] lg:pt-[68px] pb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-lune border border-[var(--bd2)] text-eclat text-xs font-semibold px-3.5 py-1 rounded-full mb-7 tracking-wide">
              <span className="w-[5px] h-[5px] rounded-full bg-eclat animate-pulse-dot" />GOOGLE ADS AGENCY
            </div>
            <h1 className="text-[clamp(2.5rem,5.2vw,5.2rem)] font-semibold leading-[0.98] tracking-[-2px] text-ink mb-6">
              Performance <span className="text-eclat">Google Ads</span><br />pour PME & <span className="relative inline-block">e-commerce<span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-spark rounded-full" /></span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-ink-2 leading-relaxed mb-9 max-w-[480px] font-light">Nous gérons vos campagnes Google Ads avec une approche <strong className="text-ink font-medium">data-driven</strong>. Résultats mesurables, reporting transparent, croissance durable.</p>
            <div className="flex gap-3 flex-wrap mb-8">
              <Link href="/contact" className="btn-primary text-sm md:text-base no-underline">Réserver un appel découverte →</Link>
              <Link href="#services" className="btn-outline no-underline text-sm md:text-base">Voir les offres</Link>
            </div>
            <div className="flex items-center gap-3 md:gap-5 flex-wrap">
              {["Google Partner", "+50 comptes gérés", "CPA moyen −34%"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-ink-3"><span className="text-eclat font-bold text-xs">✓</span> {t}{i < 2 && <span className="ml-2 md:ml-3 w-px h-3.5 bg-[var(--bd2)] hidden md:block" />}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="bg-white border border-[var(--bd)] rounded-uplyo-lg overflow-hidden shadow-[0_24px_60px_rgba(108,92,231,0.1)] hidden lg:block">
              <div className="bg-nuit px-5 py-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/40 tracking-wider">UPLYO — RÉSULTATS CLIENTS</span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400 font-mono"><span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse-dot" />LIVE</span>
              </div>
              <div className="grid grid-cols-2">
                {KPIS.map((kpi, i) => (
                  <div key={i} className="p-5 border-b border-r border-[var(--bd)] last:border-r-0">
                    <div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-1">{kpi.label}</div>
                    <div className="text-2xl font-semibold leading-none tracking-tight text-eclat">{kpi.value}</div>
                    <div className="text-[11px] text-ink-3 mt-0.5">{kpi.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* PROBLEMS */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-14"><div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4"><span className="w-4 h-[2px] bg-eclat rounded-full" />Le problème</div>
              <h2 className="text-[clamp(1.8rem,3.8vw,3.6rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink">Google Ads sans <span className="italic font-light text-ink-3">stratégie</span>,<br />c&apos;est du budget <span className="text-eclat">brûlé</span>.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {PAINS.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-6 md:p-7 transition-all hover:border-eclat hover:-translate-y-[3px] h-full">
                  <div className="font-mono text-[10px] text-ink-3 tracking-[0.1em] mb-2">{p.n}</div>
                  <div className="text-[1rem] md:text-[1.05rem] font-semibold text-ink mb-1.5">{p.title}</div>
                  <div className="text-[13px] text-ink-2 leading-relaxed font-light">{p.desc}</div>
                  <div className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[#C0392B] bg-[#FDECEA] border border-[rgba(192,57,43,0.15)] px-2.5 py-[3px] rounded-full font-mono">{p.cost}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BRIDGE */}
      <Reveal>
        <div className="bg-eclat py-12 md:py-14 px-6 md:px-10 text-center">
          <div className="max-w-[700px] mx-auto">
            <h2 className="text-[clamp(1.5rem,3.5vw,3rem)] font-semibold text-white leading-[1.08] tracking-tight mb-4">Et si vos Google Ads généraient enfin des résultats ?</h2>
            <p className="text-[15px] md:text-[16px] text-white/65 mb-8 font-light">On prend le contrôle de vos campagnes et on transforme chaque euro en leads qualifiés ou en ventes.</p>
            <div className="flex gap-2.5 md:gap-3 justify-center flex-wrap">
              {["Audit gratuit en 24h", "Go-live en 5 jours", "Dashboard temps réel", "Expert dédié"].map((pill) => (
                <span key={pill} className="inline-flex items-center gap-1.5 bg-white/[0.12] border border-white/[0.22] text-white text-[12px] md:text-[13px] font-medium px-3 md:px-3.5 py-[6px] md:py-[7px] rounded-full">{pill}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* SERVICES */}
      <section id="services" className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-14"><div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4"><span className="w-4 h-[2px] bg-eclat rounded-full" />Nos offres</div>
              <h2 className="text-[clamp(1.8rem,3.8vw,3.6rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink">Une offre <span className="text-eclat">claire</span>,<br /><span className="italic font-light text-ink-3">adaptée à votre stade.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.tag} delay={i * 120}>
                <div className={`border-[1.5px] rounded-uplyo-lg p-7 md:p-9 flex flex-col transition-all hover:-translate-y-1 h-full ${svc.featured ? "bg-nuit border-eclat" : "bg-white border-[var(--bd)] hover:border-eclat hover:shadow-[0_12px_40px_rgba(108,92,231,0.1)]"}`}>
                  <span className={`font-mono text-[10px] px-2 py-[3px] rounded tracking-wider uppercase inline-block mb-4 w-fit ${svc.featured ? "text-aura bg-aura/10 border border-aura/25" : "text-eclat bg-lune border border-[var(--bd)]"}`}>{svc.tag}</span>
                  <h3 className={`text-[1.15rem] md:text-[1.2rem] font-semibold tracking-tight mb-2 ${svc.featured ? "text-white" : "text-ink"}`}>{svc.title}</h3>
                  <p className={`text-[13px] leading-relaxed mb-5 flex-1 font-light ${svc.featured ? "text-white/40" : "text-ink-2"}`}>{svc.desc}</p>
                  <div className="flex flex-col gap-1.5 mb-7">
                    {svc.items.map((item) => (<div key={item} className={`flex items-start gap-2 text-[13px] font-light ${svc.featured ? "text-white/40" : "text-ink-2"}`}><span className="text-eclat font-bold text-xs mt-[2px] shrink-0">✓</span>{item}</div>))}
                  </div>
                  <div className={`pt-6 mb-4 ${svc.featured ? "border-t border-white/[0.08]" : "border-t border-[var(--bd)]"}`}>
                    <div className={`font-mono text-[10px] tracking-wider uppercase mb-1 ${svc.featured ? "text-white/30" : "text-ink-3"}`}>{svc.from}</div>
                    <div className={`text-[1.7rem] md:text-[1.9rem] font-semibold tracking-tight ${svc.featured ? "text-white" : "text-ink"}`}>{svc.price}</div>
                    <div className={`text-xs mt-0.5 font-light ${svc.featured ? "text-white/30" : "text-ink-3"}`}>{svc.note}</div>
                  </div>
                  <Link href={svc.href} className="w-full text-center bg-eclat text-white text-sm font-semibold py-3 rounded-lg transition-colors hover:bg-eclat-hover border-none cursor-pointer block no-underline">{svc.featured ? "Démarrer maintenant →" : "En savoir plus →"}</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]">
        <div className="max-w-[1160px] mx-auto text-center">
          <Reveal>
            <div className="mb-10 md:mb-14"><div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4 justify-center"><span className="w-4 h-[2px] bg-eclat rounded-full" />Notre méthode</div>
              <h2 className="text-[clamp(1.8rem,3.8vw,3.6rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink">De l&apos;appel au <span className="text-eclat">go-live</span><br /><span className="italic font-light text-ink-3">en 5 jours.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 relative mt-10 md:mt-16">
            <div className="absolute top-[27px] left-[10%] right-[10%] h-[1.5px] opacity-30 hidden md:block" style={{ background: "repeating-linear-gradient(90deg, var(--eclat) 0, var(--eclat) 8px, transparent 8px, transparent 16px)" }} />
            {STEPS.map((step, i) => (
              <Reveal key={step.day} delay={i * 100}>
                <div className="text-center px-2 md:px-3 relative z-10">
                  <div className="w-[48px] md:w-[54px] h-[48px] md:h-[54px] rounded-full bg-white border-[1.5px] border-[var(--bd2)] grid place-items-center mx-auto mb-4 md:mb-5 text-lg md:text-xl transition-all hover:border-eclat shadow-[0_0_0_6px_var(--w2)]">{step.ico}</div>
                  <div className="text-[0.85rem] md:text-[0.95rem] font-semibold text-ink mb-1">{step.t}</div>
                  <div className="text-[11px] md:text-xs text-ink-2 leading-snug font-light">{step.d}</div>
                  <div className="font-mono text-[10px] text-eclat font-medium mt-1.5">{step.day}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-14"><div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4"><span className="w-4 h-[2px] bg-eclat rounded-full" />Témoignages</div><h2 className="text-[clamp(1.8rem,3.8vw,3.6rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink">Ils nous font confiance</h2></div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-6 md:p-7 transition-all hover:border-eclat hover:-translate-y-[3px] h-full">
                  <div className="flex gap-1 mb-4 text-spark text-lg">★★★★★</div>
                  <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed mb-6 font-light">« {t.text} »</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-eclat/10 border border-eclat/20 grid place-items-center text-[11px] font-semibold text-eclat shrink-0">{t.initials}</div>
                    <div className="min-w-0"><div className="text-sm font-semibold text-ink truncate">{t.name}</div><div className="text-[11px] text-ink-3 font-light truncate">{t.role}</div></div>
                    <span className="ml-auto font-mono text-[9px] bg-lune border border-[var(--bd)] text-eclat px-2 py-0.5 rounded shrink-0">{t.badge}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="bg-eclat py-16 md:py-20 px-6 md:px-10 text-center relative overflow-hidden">
          <div className="max-w-[700px] mx-auto relative z-10">
            <div className="font-mono text-[11px] tracking-[0.12em] text-white/55 mb-4">PRÊT À DÉMARRER ?</div>
            <h2 className="text-[clamp(1.8rem,4.5vw,4rem)] font-semibold text-white leading-[1.02] tracking-[-1.5px] mb-5">Réservez votre audit<br />gratuit en 60 secondes.</h2>
            <p className="text-[15px] md:text-[17px] text-white/65 max-w-[480px] mx-auto mb-8 md:mb-10 leading-relaxed font-light">30 minutes avec notre expert. Analyse de votre compte ou de votre marché. Sans engagement.</p>
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap mb-8">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-eclat text-[14px] md:text-[15px] font-semibold px-6 md:px-8 py-[13px] md:py-[15px] rounded-lg border-none cursor-pointer transition-all hover:bg-lune hover:-translate-y-0.5 no-underline">📅 Choisir mon créneau →</Link>
              <a href="mailto:contact@uplyo.fr" className="inline-flex items-center gap-2 bg-white/10 text-white text-[14px] md:text-[15px] px-6 md:px-8 py-[13px] md:py-[15px] rounded-lg no-underline border border-white/20 transition-all hover:bg-white/[0.18]">contact@uplyo.fr</a>
            </div>
            <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
              {["Gratuit & sans engagement", "Réponse dans la journée", "Expert dédié"].map((g) => (<span key={g} className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-white/55 font-light"><span className="text-white font-semibold">✓</span> {g}</span>))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-24 self-start">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4"><span className="w-4 h-[2px] bg-eclat rounded-full" />FAQ</div>
              <div className="text-2xl font-semibold tracking-tight text-ink leading-tight mb-3">Questions fréquentes</div>
              <p className="text-sm text-ink-2 leading-relaxed mb-8 font-light">Tout ce que vous devez savoir avant de démarrer.</p>
              <button className="bg-eclat text-white text-[13px] font-semibold px-[22px] py-[10px] rounded-md border-none cursor-pointer transition-colors hover:bg-eclat-hover">Poser ma question →</button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col gap-1">
              {FAQS.map((faq) => (
                <details key={faq.q} className="bg-[var(--w2)] rounded-lg group">
                  <summary className="px-5 md:px-6 py-4 flex items-center justify-between gap-4 cursor-pointer text-[14px] md:text-[15px] font-medium text-ink list-none transition-colors hover:bg-lune">{faq.q}<span className="text-eclat text-xl shrink-0 transition-transform group-open:rotate-45">+</span></summary>
                  <div className="px-5 md:px-6 pb-4 text-[13px] md:text-sm text-ink-2 leading-relaxed border-t border-[var(--bd)] font-light">{faq.a}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]" id="contact">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4"><span className="w-4 h-[2px] bg-eclat rounded-full" />Contact</div>
              <div className="text-[1.5rem] md:text-[1.75rem] font-semibold tracking-tight text-ink mb-3">Parlons de votre projet</div>
              <p className="text-sm text-ink-2 leading-relaxed mb-8 font-light">Préférez-vous un échange direct ? <strong className="font-semibold text-ink">Réservez un créneau Calendly</strong> — 30 min avec notre expert.</p>
              <button className="btn-primary mb-6 text-sm md:text-base">📅 Réserver un créneau →</button>
              <div className="flex flex-col gap-3.5 mb-7">
                {[{ ico: "✉️", label: "EMAIL", value: "contact@uplyo.fr" }, { ico: "🌍", label: "ZONE", value: "France · España · Belgique · Suisse" }, { ico: "🏆", label: "CERTIF.", value: "Google Ads · GA4 · Looker Studio" }].map((c) => (
                  <div key={c.label} className="flex items-start gap-3"><div className="w-9 h-9 bg-white border-[1.5px] border-[var(--bd)] rounded-lg grid place-items-center text-sm shrink-0">{c.ico}</div><div><div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-0.5">{c.label}</div><div className="text-sm text-ink">{c.value}</div></div></div>
                ))}
              </div>
              <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-[var(--bd2)] rounded-lg px-4 py-3"><span className="w-2 h-2 rounded-full bg-eclat animate-pulse-dot shrink-0" /><span className="text-[12px] md:text-[13px] text-ink-2 font-light">Disponible — Réponse sous <strong className="text-eclat font-semibold">24h ouvrées</strong></span></div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-nuit px-6 md:px-10 pt-12 md:pt-16 pb-8 border-t-2 border-eclat">
        <div className="max-w-[1160px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-10 md:pb-12 border-b border-white/[0.06] mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3"><svg width="26" height="26" viewBox="0 0 36 36" fill="none"><polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7"/><polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88"/><polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6"/></svg><span className="text-lg font-semibold text-white tracking-tight">uplyo</span></div>
              <p className="text-[13px] text-white/25 leading-relaxed max-w-[240px] mb-5 font-light">Agence Google Ads performance & Uplyo OS, le SaaS pour agences et freelances.</p>
              <div className="font-mono text-[10px] text-white/[0.18] flex items-center gap-1.5"><span className="text-eclat">◆</span>Google Ads Certified · GA4 · Looker Studio</div>
            </div>
            <div><div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Agence</div><div className="flex flex-col gap-1.5"><Link href="/offres/pack-lancement" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pack Lancement</Link><Link href="/offres/retainer" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pilotage mensuel</Link><Link href="/offres/ecommerce" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pack E-commerce</Link><Link href="/contact" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Contact</Link></div></div>
            <div><div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Uplyo OS</div><div className="flex flex-col gap-1.5">{["Fonctionnalités", "Tarifs", "Accès beta"].map((l) => (<Link key={l} href="/os" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">{l}</Link>))}</div></div>
            <div><div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Contact</div><div className="flex flex-col gap-1.5"><a href="mailto:contact@uplyo.fr" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">contact@uplyo.fr</a><span className="text-[13px] text-white/35 font-light cursor-pointer hover:text-aura transition-colors">Réserver un audit</span><a href="https://linkedin.com/company/uplyo" target="_blank" rel="noopener" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">LinkedIn</a></div></div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="font-mono text-[11px] text-white/[0.18]">© 2026 <span className="text-eclat">Uplyo</span> · Tous droits réservés</div>
            <div className="flex gap-4 md:gap-6"><Link href="/mentions-legales" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">Mentions légales</Link><Link href="/confidentialite" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">Confidentialité</Link><Link href="/cgv" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">CGV</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
