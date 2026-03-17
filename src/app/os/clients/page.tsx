"use client";

import { useState } from "react";
import { CLIENTS, STATUT_LABELS, STATUT_COLORS } from "@/lib/data";
import { Search, Filter, Plus } from "lucide-react";

const BADGE_MAP: Record<string, string> = {
  green: "badge-green",
  red: "badge-red",
  blue: "badge-blue",
  amber: "badge-amber",
  purple: "badge-purple",
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");

  const filtered = CLIENTS.filter((c) => {
    const matchSearch =
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.secteur.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "all" || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalBudget = filtered.reduce((s, c) => s + (c.budget || 0), 0);
  const totalMRR = filtered.reduce((s, c) => s + (c.mrr || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
          <span className="text-eclat">##</span> CRM Clients
        </h1>
        <p className="text-[13px] mt-1 max-w-[600px] leading-relaxed" style={{ color: "var(--t2)" }}>
          Gérez votre portefeuille clients, suivez les budgets et les performances.
        </p>
      </div>

      {/* KPI strip */}
      <div
        className="grid grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {[
          { label: "TOTAL CLIENTS", value: filtered.length, color: "text-eclat" },
          { label: "BUDGET TOTAL", value: `${(totalBudget / 1000).toFixed(1)}K€`, color: "text-amber-500" },
          { label: "MRR", value: `${totalMRR.toLocaleString("fr-FR")}€`, color: "text-green-500" },
          { label: "SCORE MOYEN", value: `${Math.round(filtered.reduce((s, c) => s + (c.auditScore || 0), 0) / Math.max(filtered.length, 1))}/30`, color: "text-blue-400" },
        ].map((k, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>{k.label}</div>
            <div className={`kpi-value ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--t3)" }} />
          <input
            type="text"
            placeholder="Rechercher un client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-mono text-[11px] py-2 pl-8 pr-3 rounded outline-none transition-colors"
            style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
          />
        </div>

        <div className="flex items-center gap-1">
          <Filter size={12} style={{ color: "var(--t3)" }} />
          {["all", "prospect", "onboarding", "actif", "scale"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className="font-mono text-[10px] px-2.5 py-1 rounded transition-all"
              style={{
                background: filterStatut === s ? "var(--eclat)" : "var(--bg3)",
                color: filterStatut === s ? "#0e0f11" : "var(--t3)",
                border: `1px solid ${filterStatut === s ? "var(--eclat)" : "var(--line2)"}`,
                fontWeight: filterStatut === s ? 600 : 400,
              }}
            >
              {s === "all" ? "Tous" : STATUT_LABELS[s]}
            </button>
          ))}
        </div>

        <button className="btn-os-primary text-[11px] ml-auto">
          <Plus size={12} /> Ajouter client
        </button>
      </div>

      {/* Client list */}
      <div className="card-os">
        {filtered.map((client, idx) => (
          <div
            key={client.id}
            className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-[var(--bg3)] cursor-pointer"
            style={{ borderBottom: idx < filtered.length - 1 ? "1px solid var(--line)" : "none" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-medium" style={{ color: "var(--t)" }}>
                  {client.nom}
                </span>
                <span className={`badge ${BADGE_MAP[STATUT_COLORS[client.statut]] || "badge-purple"}`}>
                  {STATUT_LABELS[client.statut]}
                </span>
                <span className="font-mono text-[10px]" style={{ color: "var(--t3)" }}>
                  {client.secteur}
                </span>
              </div>
              <div className="flex gap-5 flex-wrap text-[11px]" style={{ color: "var(--t2)" }}>
                {client.budget && <span>💰 {client.budget.toLocaleString("fr-FR")}€/mois</span>}
                {client.cpa && <span>🎯 Cible: {client.cpa}</span>}
                {client.cpaActuel && (
                  <span>
                    CPA actuel: <span className="text-red-400">{client.cpaActuel}€</span>
                  </span>
                )}
                {client.auditScore !== undefined && (
                  <span style={{ color: client.auditScore >= 20 ? "var(--green)" : "var(--amber)" }}>
                    Audit: {client.auditScore}/30
                  </span>
                )}
              </div>
              {client.notes && (
                <div className="text-[11px] mt-1 truncate max-w-lg" style={{ color: "var(--t3)" }}>
                  {client.notes}
                </div>
              )}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {client.gaAccountId && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                    GA {client.gaAccountId}
                  </span>
                )}
                {client.lookerUrl && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    Looker
                  </span>
                )}
                {client.slackChannel && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                    {client.slackChannel}
                  </span>
                )}
                {client.mrr && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-mono">
                    {client.mrr}€/m
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
              <button className="btn-os text-[10px]" style={{ background: "rgba(108,92,231,0.1)", color: "var(--eclat)" }}>
                🤖 IA
              </button>
              <button className="btn-os text-[10px]">📊 Rapport</button>
              <button className="btn-os text-[10px]">🔔 Alertes</button>
              <button className="btn-os text-[10px]">✏️</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px]" style={{ color: "var(--t3)" }}>
            Aucun client trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
