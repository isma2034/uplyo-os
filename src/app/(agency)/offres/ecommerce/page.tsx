import { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Pack E-commerce — Uplyo · Google Shopping & Performance Max",
  description: "Shopping optimisé, Performance Max structuré, feed produit, ROAS tracking avancé. Pour les boutiques qui veulent scaler.",
};

const INCLUDES = [
  { ico: "🛍️", title: "Google Shopping optimisé", desc: "Structure Shopping standard + smart avec segmentation par marge, catégorie et performance produit." },
  { ico: "🚀", title: "Performance Max structuré", desc: "PMax avec asset groups segmentés, audiences signals, et séparation brand/non-brand pour un contrôle total." },
  { ico: "📦", title: "Feed produit optimisé", desc: "Optimisation des titres, descriptions, GTIN, catégories Google. Règles de feed pour maximiser la visibilité." },
  { ico: "📊", title: "ROAS tracking avancé", desc: "Tracking par produit, par catégorie, par marge. Conversion values dynamiques dans GA4." },
  { ico: "👥", title: "Segmentation audiences", desc: "Remarketing dynamique, audiences similaires, customer match. Chaque segment a sa stratégie." },
  { ico: "📈", title: "Reporting e-commerce", desc: "Dashboard Looker dédié e-com : ROAS par campagne, top/flop produits, tendances, alertes stock." },
];

const METRICS = [
  { label: "ROAS moyen", value: "4.2x", desc: "Retour sur dépense pub" },
  { label: "CPA réduit", value: "-34%", desc: "vs moyenne avant Uplyo" },
  { label: "Top produits", value: "+52%", desc: "Visibilité produits stars" },
  { label: "Feed santé", value: "98%", desc: "Score qualité feed" },
];

export default function EcommercePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4">
              <span className="w-4 h-[2px] bg-eclat rounded-full" />Pack E-commerce
            </div>
            <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink mb-4">
              Scalez votre <span className="text-eclat">e-commerce</span><br />
              <span className="italic font-light text-ink-3">avec Google Shopping & PMax.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-ink-2 max-w-[560px] leading-relaxed font-light mb-8">
              Shopping, Performance Max, feed optimization, ROAS tracking avancé. Tout ce qu&apos;il faut pour transformer votre budget pub en chiffre d&apos;affaires.
            </p>
            <div className="flex items-center gap-6 flex-wrap mb-8">
              <div>
                <div className="text-2xl font-semibold text-eclat">Sur devis</div>
                <div className="text-[12px] text-ink-3 font-light">setup inclus · adapté au volume</div>
              </div>
              <Link href="/audit" className="btn-primary no-underline text-sm md:text-base">Demander un audit e-commerce →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-14 px-6 md:px-10 bg-nuit">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="text-center p-5">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">{m.label}</div>
                <div className="text-2xl font-semibold text-eclat font-mono">{m.value}</div>
                <div className="text-[11px] text-white/30 mt-1">{m.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Includes */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-10">Tout ce qui est inclus</h2>
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

      {/* Ideal for */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-8">Pour qui ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Boutiques Shopify / WooCommerce", desc: "Vous vendez en ligne et voulez un ROAS >3x sur votre budget Google Ads." },
                { title: "E-commerçants 1K€–50K€/mois", desc: "Votre budget pub est entre 1 000€ et 50 000€/mois et vous voulez le rentabiliser." },
                { title: "Marques en scaling", desc: "Vous avez un product-market fit et vous voulez accélérer via Google Shopping + PMax." },
                { title: "Migration d'agence", desc: "Votre agence actuelle ne délivre pas. On reprend tout et on optimise en 5 jours." },
              ].map((item) => (
                <div key={item.title} className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-lg p-5">
                  <div className="text-[14px] font-semibold text-ink mb-1">{item.title}</div>
                  <p className="text-[13px] text-ink-2 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="bg-eclat py-14 px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Prêt à scaler votre e-commerce ?</h2>
          <p className="text-[15px] text-white/60 mb-8 font-light">Audit gratuit de votre feed et campagnes — 30 min, on vous montre le potentiel.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-eclat text-[15px] font-semibold px-8 py-4 rounded-lg no-underline transition-all hover:bg-lune hover:-translate-y-0.5">
            📅 Réserver mon audit e-commerce →
          </Link>
        </div>
      </Reveal>
    </>
  );
}
