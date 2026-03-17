"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CLIENTS, STATUT_LABELS, STATUT_COLORS } from "@/lib/data";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  FileText,
  Bell,
  Edit3,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  Activity,
} from "lucide-react";

const BADGE_MAP: Record<string, string> = {
  green: "badge-green",
  red: "badge-red",
  blue: "badge-blue",
  amber: "badge-amber",
  purple: "badge-purple",
};

/* Mock performance data */
const PERF_DATA = {
  kpis: [
    { label: "DÉPENSE", value: "8 234€", delta: "+12%", up: true, color: "text-amber-500" },
    { label: "CLICS", value: "4 821", delta: "+8%", up: true, color: "text-blue-400" },
    { label: "CONVERSIONS", value: "189", delta: "+24%", up: true, color: "text-green-500" },
    { label: "CPA", value: "43.6€", delta: "-15%", up: false, color: "text-eclat" },
    { label: "CTR", value: "3.2%", delta: "+0.3pts", up: true, color: "text-green-500" },
    { label: "ROAS", value: "3.8x", delta: "+0.4x", up: true, color: "text-green-500" },
  ],
  campaigns: [
    { name: "Search_FR_Brand", spend: "1 200€", clicks: "890", conv: 67, cpa: "17.9€", status: "active" },
    { name: "Search_FR_Generic", spend: "3 100€", clicks: "2 100", conv: 72, cpa: "43€", status: "active" },
    { name: "PMax_FR_All", spend: "2 800€", clicks: "1 500", conv: 38, cpa: "73.7€", status: "warning" },
    { name: "Display_Remarketing", spend: "1 134€", clicks: "331", conv: 12, cpa: "94.5€", status: "paused" },
  ],
};

const ACTIVITY = [
  { date: "15/03/2026", action: "Optimisation enchères Search_FR_Generic → Target CPA 40€", type: "optim" },
  { date: "12/03/2026", action: "Ajout 15 mots-clés négatifs depuis Search Terms", type: "optim" },
  { date: "10/03/2026", action: "Rapport mensuel février envoyé", type: "report" },
  { date: "08/03/2026", action: "A/B test lancé sur annonces RSA (3 variantes)", type: "test" },
  { date: "01/03/2026", action: "Revue mensuelle — appel 30min", type: "meeting" },
  { date: "25/02/2026", action: "Script budget pacing déployé", type: "script" },
  { date: "20/02/2026", action: "Restructuration PMax — séparation feed", type: "optim" },
];

const TYPE_BADGE: Record<string, string> = {
  optim: "badge-green",
  report: "badge-blue",
  test: "badge-purple",
  meeting: "badge-amber",
  script: "badge-cyan",
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = CLIENTS.find((c) => c.id === clientId);
  const [activeTab, setActiveTab] = useState<"overview" | "perf" | "activity">("overview");

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-[14px]" style={{ color: "var(--t3)" }}>Client introuvable.</p>
        <Link href="/os/clients" className="text-eclat text-[13px] mt-2 inline-block no-underline">
          ← Retour au CRM
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <Link href="/os/clients" className="btn-os text-[11px] mb-4 no-underline inline-flex">
        <ArrowLeft size={12} /> Retour CRM
      </Link>

      {/* Client header */}
      <div className="card-os mb-5">
        <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold" style={{ color: "var(--t)" }}>{client.nom}</h1>
              <span className={`badge ${BADGE_MAP[STATUT_COLORS[client.statut]] || "badge-purple"}`}>
                {STATUT_LABELS[client.statut]}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: "var(--t2)" }}>
              <span>{client.secteur}</span>
              <span>·</span>
              <span>{client.email}</span>
              {client.gaAccountId && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-blue-400">GA {client.gaAccountId}</span>
                </>
              )}
            </div>
            {client.notes && (
              <p className="text-[12px] mt-2 max-w-xl leading-relaxed" style={{ color: "var(--t3)" }}>
                {client.notes}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/os/analyste-pro" className="btn-os text-[10px] no-underline" style={{ background: "rgba(108,92,231,0.1)", color: "var(--eclat)" }}>
              <Sparkles size={11} /> Analyste Pro
            </Link>
            <Link href="/os/reports" className="btn-os text-[10px] no-underline">
              <FileText size={11} /> Rapport
            </Link>
            <Link href="/os/alerts" className="btn-os text-[10px] no-underline">
              <Bell size={11} /> Alertes
            </Link>
            {client.lookerUrl && (
              <a href={client.lookerUrl} target="_blank" className="btn-os text-[10px] no-underline" rel="noreferrer">
                <ExternalLink size={11} /> Looker
              </a>
            )}
          </div>
        </div>

        {/* Quick KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px" style={{ borderTop: "1px solid var(--line)" }}>
          {[
            { label: "BUDGET", value: `${client.budget?.toLocaleString("fr-FR")}€/m`, color: "text-amber-500" },
            { label: "CPA CIBLE", value: client.cpa || "N/A", color: "text-eclat" },
            { label: "CPA ACTUEL", value: client.cpaActuel ? `${client.cpaActuel}€` : "N/A", color: "text-red-400" },
            { label: "MRR", value: client.mrr ? `${client.mrr}€` : "—", color: "text-green-500" },
            { label: "AUDIT", value: client.auditScore !== undefined ? `${client.auditScore}/30` : "—", color: "text-blue-400" },
          ].map((k, i) => (
            <div key={i} className="px-4 py-3" style={{ background: "var(--bg2)" }}>
              <div className="font-mono text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "var(--t3)" }}>
                {k.label}
              </div>
              <div className={`font-mono text-[15px] font-semibold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5">
        {([
          { id: "overview" as const, label: "Vue d'ensemble" },
          { id: "perf" as const, label: "Performance 30j" },
          { id: "activity" as const, label: "Historique" },
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

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Links */}
          <div className="card-os">
            <div className="card-os-header">
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Liens rapides
              </span>
            </div>
            <div className="card-os-body space-y-2">
              {[
                { label: "Google Ads", value: client.gaAccountId, href: `https://ads.google.com/aw/overview?ocid=${client.gaAccountId}` },
                { label: "Looker Studio", value: client.lookerUrl ? "Ouvert" : "Non configuré", href: client.lookerUrl },
                { label: "Slack", value: client.slackChannel || "Non configuré", href: undefined },
                { label: "Calendly", value: client.calendlyUrl ? "Lien actif" : "Non configuré", href: client.calendlyUrl },
              ].map((link) => (
                <div key={link.label} className="flex items-center justify-between py-2 px-3 rounded" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                  <div>
                    <span className="text-[12px] font-medium" style={{ color: "var(--t)" }}>{link.label}</span>
                    <span className="text-[11px] ml-2" style={{ color: "var(--t3)" }}>{link.value || "—"}</span>
                  </div>
                  {link.href && (
                    <a href={link.href} target="_blank" rel="noreferrer" className="btn-os text-[9px] py-0.5 no-underline">
                      <ExternalLink size={9} /> Ouvrir
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card-os">
            <div className="card-os-header">
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Notes
              </span>
              <button className="btn-os text-[9px] py-0.5"><Edit3 size={9} /> Modifier</button>
            </div>
            <div className="card-os-body">
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--t2)" }}>
                {client.notes || "Aucune note pour le moment."}
              </p>
              <div className="mt-3 pt-3 flex items-center gap-2 text-[10px]" style={{ borderTop: "1px solid var(--line)", color: "var(--t3)" }}>
                <Calendar size={10} />
                Client depuis le {new Date(client.dateCreation).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PERF TAB ── */}
      {activeTab === "perf" && (
        <div>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px rounded-[7px] overflow-hidden mb-5" style={{ background: "var(--line)", border: "1px solid var(--line)" }}>
            {PERF_DATA.kpis.map((k, i) => (
              <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
                <div className="kpi-label" style={{ color: "var(--t3)" }}>{k.label}</div>
                <div className={`font-mono text-lg font-semibold ${k.color}`}>{k.value}</div>
                <div className={`text-[10px] mt-0.5 ${k.up ? "text-green-500" : "text-red-400"}`}>
                  {k.up ? "↑" : "↓"} {k.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Campaigns table */}
          <div className="card-os">
            <div className="card-os-header">
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Campagnes actives
              </span>
            </div>
            <table className="table-os">
              <thead>
                <tr>
                  <th>Campagne</th>
                  <th>Dépense</th>
                  <th>Clics</th>
                  <th>Conv.</th>
                  <th>CPA</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {PERF_DATA.campaigns.map((c) => (
                  <tr key={c.name}>
                    <td className="font-mono font-medium text-[11px]" style={{ color: "var(--t)" }}>{c.name}</td>
                    <td className="font-mono">{c.spend}</td>
                    <td className="font-mono">{c.clicks}</td>
                    <td className="font-mono text-green-500 font-medium">{c.conv}</td>
                    <td className="font-mono">{c.cpa}</td>
                    <td>
                      <span className={`badge ${c.status === "active" ? "badge-green" : c.status === "warning" ? "badge-amber" : "badge-red"}`}>
                        {c.status === "active" ? "Actif" : c.status === "warning" ? "À optimiser" : "En pause"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {activeTab === "activity" && (
        <div className="card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
              Historique d&apos;activité
            </span>
          </div>
          <div>
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--line)" : "none" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-eclat mt-2 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px]" style={{ color: "var(--t3)" }}>{a.date}</span>
                    <span className={`badge ${TYPE_BADGE[a.type] || "badge-purple"}`}>{a.type}</span>
                  </div>
                  <p className="text-[12px]" style={{ color: "var(--t2)" }}>{a.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
