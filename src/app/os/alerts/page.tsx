"use client";

import { useState } from "react";
import { Bell, BellOff, Plus, CheckCircle, AlertTriangle, XCircle, Settings, Trash2 } from "lucide-react";

interface Alert {
  id: string;
  type: "budget" | "cpa" | "conv" | "anomaly" | "url";
  client: string;
  message: string;
  severity: "critical" | "warning" | "info";
  time: string;
  read: boolean;
}

const ALERTS: Alert[] = [
  { id: "a1", type: "budget", client: "BioMarket", message: "Budget pacing +22% — risque de sur-dépense avant fin de mois", severity: "critical", time: "Il y a 2h", read: false },
  { id: "a2", type: "cpa", client: "TechFlow SaaS", message: "CPA en hausse de +35% sur les 7 derniers jours (52€ → 70€)", severity: "critical", time: "Il y a 5h", read: false },
  { id: "a3", type: "conv", client: "FitZone", message: "Conversions en baisse de -40% vs semaine précédente", severity: "warning", time: "Il y a 8h", read: false },
  { id: "a4", type: "anomaly", client: "BioMarket", message: "CTR anormalement bas sur campagne Shopping_FR_General (0.8% vs 3.2% habituel)", severity: "warning", time: "Il y a 12h", read: true },
  { id: "a5", type: "url", client: "Immo Premium", message: "2 URLs de destination retournent un code 404", severity: "critical", time: "Il y a 1j", read: true },
  { id: "a6", type: "budget", client: "FitZone", message: "Budget mensuel atteint à 85% — 15 jours restants", severity: "info", time: "Il y a 1j", read: true },
  { id: "a7", type: "cpa", client: "BioMarket", message: "ROAS passé en dessous du seuil 3.5x sur Performance Max", severity: "warning", time: "Il y a 2j", read: true },
  { id: "a8", type: "conv", client: "TechFlow SaaS", message: "Tracking GA4 — event purchase non déclenché depuis 48h", severity: "critical", time: "Il y a 2j", read: true },
];

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  channel: string;
  enabled: boolean;
}

const RULES: AlertRule[] = [
  { id: "r1", name: "Budget pacing >15%", condition: "Dépense > 115% du pace mensuel", channel: "Email + Slack", enabled: true },
  { id: "r2", name: "CPA spike >25%", condition: "CPA 7j > CPA 30j + 25%", channel: "Email", enabled: true },
  { id: "r3", name: "Conversions drop >30%", condition: "Conv semaine < 70% semaine précédente", channel: "Slack", enabled: true },
  { id: "r4", name: "URL 404", condition: "URL de destination HTTP 4xx/5xx", channel: "Email + Slack", enabled: true },
  { id: "r5", name: "Quality Score <5", condition: "Tout KW avec QS <5 et >100 impressions", channel: "Email", enabled: false },
  { id: "r6", name: "CTR anomalie", condition: "CTR < 50% de la moyenne 30j", channel: "Slack", enabled: true },
];

const SEVERITY_ICON = {
  critical: <XCircle size={14} className="text-red-400" />,
  warning: <AlertTriangle size={14} className="text-amber-500" />,
  info: <CheckCircle size={14} className="text-blue-400" />,
};

const SEVERITY_BG = {
  critical: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-400",
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "rules">("feed");
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");
  const [alerts, setAlerts] = useState(ALERTS);
  const [rules, setRules] = useState(RULES);

  const filtered = alerts.filter((a) => {
    if (filter === "unread") return !a.read;
    if (filter === "critical") return a.severity === "critical";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.read).length;

  const markAllRead = () => setAlerts(alerts.map((a) => ({ ...a, read: true })));
  const toggleRule = (id: string) =>
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> Alertes & Monitoring
          </h1>
          <p className="text-[13px] mt-1 max-w-[600px]" style={{ color: "var(--t2)" }}>
            Surveillance continue de vos comptes — alertes automatiques par email et Slack.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-os text-[11px]">
            <CheckCircle size={11} /> Tout marquer lu
          </button>
          <button className="btn-os-primary text-[11px]">
            <Plus size={12} /> Nouvelle règle
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {[
          { label: "NON LUES", value: unreadCount.toString(), color: unreadCount > 0 ? "text-eclat" : "text-green-500" },
          { label: "CRITIQUES", value: criticalCount.toString(), color: criticalCount > 0 ? "text-red-400" : "text-green-500" },
          { label: "RÈGLES ACTIVES", value: rules.filter((r) => r.enabled).length + "/" + rules.length, color: "text-blue-400" },
          { label: "CETTE SEMAINE", value: alerts.filter((a) => a.time.includes("h")).length.toString(), color: "text-amber-500" },
        ].map((k, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>{k.label}</div>
            <div className={`kpi-value ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5">
        {([
          { id: "feed" as const, label: `Fil d'alertes (${unreadCount})` },
          { id: "rules" as const, label: `Règles (${rules.length})` },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="font-mono text-[11px] px-4 py-2 rounded transition-all"
            style={{
              background: activeTab === tab.id ? "var(--eclat)" : "var(--bg3)",
              color: activeTab === tab.id ? "#0e0f11" : "var(--t3)",
              border: `1px solid ${activeTab === tab.id ? "var(--eclat)" : "var(--line2)"}`,
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── FEED TAB ── */}
      {activeTab === "feed" && (
        <>
          {/* Filters */}
          <div className="flex gap-1 mb-4">
            {([
              { id: "all" as const, label: "Toutes" },
              { id: "unread" as const, label: "Non lues" },
              { id: "critical" as const, label: "Critiques" },
            ]).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="font-mono text-[10px] px-3 py-1.5 rounded transition-all"
                style={{
                  background: filter === f.id ? "var(--bg4)" : "var(--bg3)",
                  color: filter === f.id ? "var(--t)" : "var(--t3)",
                  border: `1px solid ${filter === f.id ? "var(--line2)" : "var(--line)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Alert cards */}
          <div className="space-y-2">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-[7px] border-l-[3px] ${SEVERITY_BG[alert.severity]} transition-all ${
                  !alert.read ? "bg-[var(--bg2)]" : ""
                }`}
                style={{
                  background: alert.read ? "var(--bg2)" : "rgba(108,92,231,0.03)",
                  border: `1px solid var(--line)`,
                  borderLeft: undefined,
                }}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  <div className="mt-0.5">{SEVERITY_ICON[alert.severity]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-medium" style={{ color: "var(--t)" }}>
                        {alert.client}
                      </span>
                      <span
                        className={`badge ${
                          alert.severity === "critical" ? "badge-red" : alert.severity === "warning" ? "badge-amber" : "badge-blue"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      {!alert.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-eclat" />
                      )}
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--t2)" }}>
                      {alert.message}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] shrink-0" style={{ color: "var(--t3)" }}>
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12" style={{ color: "var(--t3)" }}>
                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-[13px]">Aucune alerte à afficher</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── RULES TAB ── */}
      {activeTab === "rules" && (
        <div className="card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
              Règles de monitoring
            </span>
          </div>
          <div>
            {rules.map((rule, i) => (
              <div
                key={rule.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg3)] transition-colors"
                style={{ borderBottom: i < rules.length - 1 ? "1px solid var(--line)" : "none" }}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="w-9 h-5 rounded-full transition-all relative shrink-0"
                  style={{
                    background: rule.enabled ? "var(--eclat)" : "var(--bg4)",
                    border: `1px solid ${rule.enabled ? "var(--eclat)" : "var(--line2)"}`,
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all"
                    style={{ left: rule.enabled ? "18px" : "2px" }}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium" style={{ color: rule.enabled ? "var(--t)" : "var(--t3)" }}>
                      {rule.name}
                    </span>
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--t3)" }}>
                    {rule.condition}
                  </div>
                </div>

                <span className="badge badge-blue">{rule.channel}</span>

                <div className="flex gap-1">
                  <button className="btn-os text-[9px] py-0.5"><Settings size={10} /></button>
                  <button className="btn-os text-[9px] py-0.5 hover:text-red-400"><Trash2 size={10} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
