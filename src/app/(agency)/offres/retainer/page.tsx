import { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Pilotage Mensuel — Uplyo · Gestion Google Ads continue",
  description: "Optimisation continue de vos campagnes Google Ads. Expert dédié, rapports hebdo, scripts d'automation. À partir de 500€/mois.",
};

const INCLUDES = [
  { ico: "📊", title: "Optimisation enchères & budgets", desc: "Ajustement quotidien des enchères, allocation budget par campagne, bid strategies adaptées à vos objectifs." },
  { ico: "✍️", title: "A/B tests annonces continu", desc: "Tests réguliers de titres, descriptions, CTA. On identifie ce qui convertit et on scale les gagnants." },
  { ico: "⚡", title: "Scripts d'automation", desc: "Déploiement de scripts Google Ads sur mesure : alertes, pauses automatiques, pacing, négatifs automatiques." },
  { ico: "📋", title: "Rapports hebdo + mensuel", desc: "Rapport automatique chaque semaine. Rapport mensuel détaillé avec analyse et recommandations." },
  { ico: "👤", title: "Account manager dédié", desc: "Un seul interlocuteur expert qui connaît votre business. Disponible par email et Slack." },
  { ico: "📞", title: "Appel stratégique mensuel", desc: "30 min chaque mois pour revoir les performances, ajuster la stratégie et planifier le mois suivant." },
  { ico: "🔔", title: "Monitoring 24/7", desc: "Surveillance continue de vos budgets, CPA, anomalies. Alerte immédiate en cas de problème." },
  { ico: "🎯", title: "Expansion mots-clés", desc: "Recherche continue de nouvelles opportunités : nouveaux mots-clés, audiences, zones géographiques." },
];

const RESULTS = [
  { metric: "CPA moyen", before: "65€", after: "38€", change: "-42%" },
  { metric: "ROAS", before: "1.8x", after: "4.2x", change: "+133%" },
  { metric: "Conversions/mois", before: "45", after: "189", change: "+320%" },
  { metric: "Budget gaspillé", before: "~40%", after: "<8%", change: "-80%" },
];

export default function RetainerPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-eclat mb-4">
              <span className="w-4 h-[2px] bg-eclat rounded-full" />Pilotage Mensuel
            </div>
            <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.02] tracking-[-1.5px] text-ink mb-4">
              Un expert <span className="text-eclat">dédié</span><br />
              <span className="italic font-light text-ink-3">qui pilote vos campagnes.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-ink-2 max-w-[560px] leading-relaxed font-light mb-8">
              Optimisation continue, enchères, A/B tests, scripts d&apos;automation, rapports hebdo. Vous vous concentrez sur votre business, on gère vos Google Ads.
            </p>
            <div className="flex items-center gap-6 flex-wrap mb-8">
              <div>
                <div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-1">À PARTIR DE</div>
                <div className="text-3xl font-semibold text-ink">500€<span className="text-lg font-light text-ink-3">/mois</span></div>
                <div className="text-[12px] text-ink-3 font-light">engagement 6 mois · résiliable à 30j ensuite</div>
              </div>
              <Link href="/contact" className="btn-primary no-underline text-sm md:text-base">Démarrer maintenant →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="py-14 px-6 md:px-10 bg-nuit">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <h2 className="text-xl font-semibold text-white mb-8 text-center">Résultats moyens après 90 jours</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RESULTS.map((r, i) => (
              <Reveal key={r.metric} delay={i * 80}>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-5 text-center">
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">{r.metric}</div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-white/30 line-through font-mono">{r.before}</span>
                    <span className="text-white/30">→</span>
                    <span className="text-lg font-semibold text-white font-mono">{r.after}</span>
                  </div>
                  <div className="text-eclat font-mono text-sm font-semibold">{r.change}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[var(--w2)]">
        <div className="max-w-[1160px] mx-auto">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink mb-10">Tout ce qui est inclus</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INCLUDES.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="flex gap-4 bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-5 h-full transition-all hover:border-eclat">
                  <div className="text-xl shrink-0">{item.ico}</div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-ink mb-1">{item.title}</h3>
                    <p className="text-[13px] text-ink-2 leading-relaxed font-light">{item.desc}</p>
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
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Prêt à passer au niveau supérieur ?</h2>
          <p className="text-[15px] text-white/60 mb-8 font-light">On commence par un audit gratuit de votre compte — 30 min, sans engagement.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-eclat text-[15px] font-semibold px-8 py-4 rounded-lg no-underline transition-all hover:bg-lune hover:-translate-y-0.5">
            📅 Réserver mon audit gratuit →
          </Link>
        </div>
      </Reveal>
    </>
  );
}
