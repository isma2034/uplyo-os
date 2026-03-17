import { CLIENTS, STATUT_LABELS, STATUT_COLORS } from "@/lib/data";
import Link from "next/link";
import OSWelcome from "@/components/os/OSWelcome";

const DASHBOARD_KPIS = [
  { label: "MRR TOTAL", value: "4 300€", color: "text-green-500", delta: "+12.3%", up: true },
  { label: "CLIENTS ACTIFS", value: "4", color: "text-blue-400", delta: "+1", up: true },
  { label: "BUDGET GÉRÉ", value: "31.7K€", color: "text-amber-500", delta: "+8%", up: true },
  { label: "CPA MOYEN", value: "38€", color: "text-eclat", delta: "-18%", up: false },
];

const BADGE_MAP: Record<string, string> = {
  green: "badge-green",
  red: "badge-red",
  blue: "badge-blue",
  amber: "badge-amber",
  purple: "badge-purple",
};

export default function OSDashboard() {
  return (
    <div>
      <OSWelcome />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
          <span className="text-eclat">##</span> Dashboard
        </h1>
        <p className="text-[13px] mt-1 max-w-[600px] leading-relaxed" style={{ color: "var(--t2)" }}>
          Vue d&apos;ensemble de vos comptes Google Ads et métriques clés.
        </p>
      </div>

      {/* KPI Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {DASHBOARD_KPIS.map((kpi, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>
              {kpi.label}
            </div>
            <div className={`kpi-value ${kpi.color}`}>{kpi.value}</div>
            <div className={`text-[10px] mt-1 ${kpi.up ? "text-green-500" : "text-red-500"}`}>
              {kpi.up ? "↑" : "↓"} {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Client List */}
        <div className="col-span-2 card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
              Derniers clients
            </span>
            <Link href="/os/clients" className="btn-os text-[10px] no-underline">
              Voir tout →
            </Link>
          </div>
          <div>
            {CLIENTS.slice(0, 4).map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--bg3)] cursor-pointer"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium" style={{ color: "var(--t)" }}>
                      {client.nom}
                    </span>
                    <span className={`badge ${BADGE_MAP[STATUT_COLORS[client.statut]] || "badge-purple"}`}>
                      {STATUT_LABELS[client.statut]}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-0.5 text-[11px]" style={{ color: "var(--t2)" }}>
                    <span>{client.secteur}</span>
                    <span>💰 {client.budget?.toLocaleString("fr-FR")}€/mois</span>
                    {client.cpa && <span>🎯 {client.cpa}</span>}
                  </div>
                </div>
                {client.mrr && (
                  <span className="font-mono text-[11px] font-medium text-green-500">
                    {client.mrr}€/m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="space-y-4">
          <div className="card-os">
            <div className="card-os-header">
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Raccourcis
              </span>
            </div>
            <div className="card-os-body space-y-2">
              {[
                { label: "🔬 Analyste Pro", href: "/os/analyste-pro", desc: "Audit IA + plan 90j" },
                { label: "🤖 AI Wizards", href: "/os/ai-wizards", desc: "Audit, copy, ROAS…" },
                { label: "📋 Rapports WL", href: "/os/reports", desc: "PDF marque blanche" },
                { label: "🔔 Alertes", href: "/os/alerts", desc: "Monitoring comptes" },
                { label: "⚡ Scripts Library", href: "/os/scripts", desc: "16 automatisations" },
                { label: "📊 Analytics", href: "/os/analytics", desc: "Performances cross-compte" },
              ].map((s) => (
                <Link
                  key={s.href + s.label}
                  href={s.href}
                  className="flex items-center gap-3 px-3 py-2 rounded transition-colors no-underline"
                  style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}
                >
                  <span className="text-sm">{s.label.split(" ")[0]}</span>
                  <div>
                    <div className="text-xs font-medium" style={{ color: "var(--t)" }}>
                      {s.label.split(" ").slice(1).join(" ")}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--t3)" }}>
                      {s.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Dot */}
          <div
            className="rounded-[7px] p-4"
            style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-eclat animate-ai-pulse" />
              <span className="font-mono text-[10px] font-semibold text-eclat tracking-wider">
                IA READY
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--t2)" }}>
              Configurez votre clé API Claude dans{" "}
              <Link href="/os/config" className="text-eclat no-underline hover:underline">
                Configuration
              </Link>{" "}
              pour activer les AI Wizards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
