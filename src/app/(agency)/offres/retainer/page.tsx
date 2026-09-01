import { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Pilotage Mensuel · Gestion Google Ads continue",
  description: "Optimisation continue de vos campagnes Google Ads. Expert dédié, rapports hebdo, scripts d'automation.",
  alternates: { canonical: "/offres/retainer" },
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

// Engagements de service (vérifiables contractuellement), pas de résultats
// chiffrés : aucun chiffre client n'est publiable à ce jour.
const COMMITMENTS = [
  { label: "Rapport", value: "Hebdo", desc: "+ bilan mensuel détaillé" },
  { label: "Appel stratégique", value: "Mensuel", desc: "30 min, chaque mois" },
  { label: "Accès au compte", value: "Total", desc: "Vous en restez propriétaire" },
  { label: "Préavis", value: "30 jours", desc: "après les 6 mois d'engagement" },
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
                <div className="text-2xl font-semibold text-eclat">Sur devis</div>
                <div className="text-[12px] text-ink-3 font-light">engagement 6 mois · résiliable à 30j ensuite</div>
              </div>
              <Link href="/audit" className="btn-primary no-underline text-sm md:text-base">Demander un audit gratuit →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-14 px-6 md:px-10 bg-nuit">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <h2 className="text-xl font-semibold text-white mb-8 text-center">Ce sur quoi nous nous engageons</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-lg p-5 text-center h-full">
                  <div className="font-mono text-[10px] text-white/55 uppercase tracking-wider mb-2">{c.label}</div>
                  <div className="text-lg font-semibold text-white mb-1">{c.value}</div>
                  <div className="text-[11px] text-white/55">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={340}>
            <p className="text-[13px] text-white/55 font-light text-center max-w-[560px] mx-auto mt-8 leading-relaxed">
              Uplyo accompagne son premier client depuis 2026. Les résultats chiffrés seront publiés ici dès que son accord sera obtenu — pas de moyennes inventées en attendant.
            </p>
          </Reveal>
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
