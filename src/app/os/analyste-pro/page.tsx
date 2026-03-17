"use client";

import { useState, useRef } from "react";
import { CLIENTS } from "@/lib/data";
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  RotateCcw,
  Download,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Calendar,
  Loader2,
} from "lucide-react";

/* ─── Types ─── */
interface AnalysisSection {
  id: string;
  title: string;
  icon: string;
  status: "success" | "warning" | "danger";
  score: number;
  maxScore: number;
  items: { label: string; value: string; status: "ok" | "warn" | "fix" }[];
}

interface AnalysisResult {
  clientName: string;
  date: string;
  globalScore: number;
  sections: AnalysisSection[];
  plan90j: { phase: string; period: string; actions: string[] }[];
  workload: { task: string; hours: string; priority: "haute" | "moyenne" | "basse" }[];
  scripts: { name: string; description: string }[];
}

/* ─── Mock analysis generator ─── */
function generateAnalysis(clientName: string, _csvData?: string): AnalysisResult {
  return {
    clientName,
    date: new Date().toLocaleDateString("fr-FR"),
    globalScore: 18,
    sections: [
      {
        id: "structure",
        title: "Structure du compte",
        icon: "🏗️",
        status: "warning",
        score: 5,
        maxScore: 8,
        items: [
          { label: "Nombre de campagnes", value: "6 actives / 3 en pause", status: "ok" },
          { label: "Ratio ad groups / campagne", value: "2.3 (faible — cible >4)", status: "warn" },
          { label: "Séparation Search / PMax", value: "Non — mixed dans 2 campagnes", status: "fix" },
          { label: "Naming convention", value: "Inconsistant", status: "fix" },
          { label: "Extensions d'annonces", value: "3/6 types utilisés", status: "warn" },
        ],
      },
      {
        id: "keywords",
        title: "Mots-clés & ciblage",
        icon: "🔑",
        status: "warning",
        score: 4,
        maxScore: 7,
        items: [
          { label: "Mots-clés actifs", value: "142 (dont 38 broad match)", status: "warn" },
          { label: "Négatifs en place", value: "12 — très insuffisant", status: "fix" },
          { label: "Search Terms non traités (30j)", value: "67 termes non classés", status: "fix" },
          { label: "Quality Score moyen", value: "6.2 / 10 (cible >7)", status: "warn" },
          { label: "Mots-clés doublons", value: "8 doublons cross-campagne", status: "fix" },
        ],
      },
      {
        id: "performance",
        title: "Performance & enchères",
        icon: "📊",
        status: "danger",
        score: 3,
        maxScore: 8,
        items: [
          { label: "CPA actuel vs cible", value: "52€ vs 40€ cible (+30%)", status: "fix" },
          { label: "ROAS", value: "2.8x (cible 4x)", status: "fix" },
          { label: "Stratégie d'enchères", value: "Maximize Clicks — non adapté", status: "fix" },
          { label: "Budget pacing", value: "Sur-dépense de +18% J15", status: "warn" },
          { label: "Conversion tracking", value: "GA4 connecté, 2 actions configurées", status: "ok" },
        ],
      },
      {
        id: "annonces",
        title: "Annonces & créatifs",
        icon: "✍️",
        status: "success",
        score: 6,
        maxScore: 7,
        items: [
          { label: "RSA par ad group", value: "2+ RSA partout — bon", status: "ok" },
          { label: "Force de l'annonce", value: "3 Excellent, 4 Good, 2 Average", status: "ok" },
          { label: "Pin usage", value: "Aucun pin — laisser Google optimiser", status: "ok" },
          { label: "CTA dans descriptions", value: "6/9 descriptions avec CTA", status: "warn" },
          { label: "Tests A/B actifs", value: "Oui — 3 expériences en cours", status: "ok" },
        ],
      },
    ],
    plan90j: [
      {
        phase: "Phase 1 — Urgences",
        period: "J1 → J14",
        actions: [
          "Restructurer les campagnes mixed (séparer Search / PMax)",
          "Ajouter 50+ mots-clés négatifs depuis Search Terms",
          "Passer de Maximize Clicks → Target CPA (40€)",
          "Corriger le budget pacing : redistribuer -18%",
        ],
      },
      {
        phase: "Phase 2 — Optimisation",
        period: "J15 → J45",
        actions: [
          "Créer 4+ ad groups par campagne (SKAG-light)",
          "Appliquer naming convention [Type]_[Geo]_[Produit]",
          "Déployer extensions manquantes (callout, structured snippet, price)",
          "Supprimer 8 mots-clés doublons cross-campagne",
          "Ajouter Quality Score tracker (script hebdo)",
        ],
      },
      {
        phase: "Phase 3 — Scale",
        period: "J46 → J90",
        actions: [
          "Lancer Performance Max avec feed optimisé",
          "A/B test enchères Target CPA vs Target ROAS",
          "Activer remarketing dynamique (audiences GA4)",
          "Objectif : CPA <35€, ROAS >4x",
        ],
      },
    ],
    workload: [
      { task: "Restructuration campagnes", hours: "4h", priority: "haute" },
      { task: "Audit négatifs + ajout", hours: "2h", priority: "haute" },
      { task: "Migration stratégie d'enchères", hours: "1h", priority: "haute" },
      { task: "Création ad groups", hours: "3h", priority: "moyenne" },
      { task: "Extensions d'annonces", hours: "1.5h", priority: "moyenne" },
      { task: "Naming convention", hours: "1h", priority: "basse" },
      { task: "Setup PMax", hours: "3h", priority: "moyenne" },
      { task: "Remarketing audiences", hours: "2h", priority: "basse" },
    ],
    scripts: [
      { name: "Pause low-performing keywords", description: "Pause auto KW CPA > seuil" },
      { name: "Budget pacing alert", description: "Alerte si sur-dépense >15%" },
      { name: "Negative keywords from Search Terms", description: "Ajout négatifs auto" },
      { name: "Quality Score tracker", description: "Export QS hebdo dans Sheet" },
      { name: "Duplicate keywords finder", description: "Détection doublons cross-campagne" },
    ],
  };
}

/* ─── Status helpers ─── */
const STATUS_ICON = {
  ok: <CheckCircle size={12} className="text-green-500" />,
  warn: <AlertTriangle size={12} className="text-amber-500" />,
  fix: <AlertTriangle size={12} className="text-red-400" />,
};

const STATUS_BG = {
  ok: "bg-green-500/10 text-green-500",
  warn: "bg-amber-500/10 text-amber-500",
  fix: "bg-red-500/10 text-red-400",
};

const PRIORITY_STYLE = {
  haute: "badge-red",
  moyenne: "badge-amber",
  basse: "badge-blue",
};

const SCORE_COLOR = (score: number, max: number) => {
  const pct = score / max;
  if (pct >= 0.75) return "text-green-500";
  if (pct >= 0.5) return "text-amber-500";
  return "text-red-400";
};

/* ─── Component ─── */
export default function AnalysteProPage() {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [csvFiles, setCsvFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"audit" | "plan" | "workload" | "scripts">("audit");
  const fileRef = useRef<HTMLInputElement>(null);

  const client = CLIENTS.find((c) => c.id === selectedClient);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyse = async () => {
    if (!selectedClient) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2500));
    setResult(generateAnalysis(client?.nom || "Client"));
    setLoading(false);
    setActiveTab("audit");
  };

  const handleReset = () => {
    setResult(null);
    setCsvFiles([]);
    setExpandedSection(null);
  };

  const totalScore = result?.sections.reduce((s, sec) => s + sec.score, 0) || 0;
  const totalMax = result?.sections.reduce((s, sec) => s + sec.maxScore, 0) || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> Analyste Pro
          </h1>
          <span className="badge badge-purple">IA</span>
          <span className="badge badge-green">INCLUS</span>
        </div>
        <p className="text-[13px] mt-1 max-w-[700px] leading-relaxed" style={{ color: "var(--t2)" }}>
          Audit complet, structure optimale, scripts recommandés, plan d&apos;action 90 jours et charge de travail —
          générés par IA depuis vos données Google Ads.
        </p>
      </div>

      {!result ? (
        /* ─── INPUT FORM ─── */
        <div className="max-w-[700px]">
          {/* Client selector */}
          <div className="card-os mb-5">
            <div className="card-os-header">
              <div className="flex items-center gap-2">
                <Target size={13} className="text-eclat" />
                <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                  1. Sélectionnez un client
                </span>
              </div>
            </div>
            <div className="card-os-body">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full font-mono text-[12px] py-2.5 px-3 rounded outline-none"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              >
                <option value="">— Choisir un client —</option>
                {CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} — {c.secteur} ({c.budget}€/mois)
                  </option>
                ))}
              </select>
              {client && (
                <div
                  className="mt-3 rounded p-3 text-[11px] leading-relaxed"
                  style={{ background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.15)", color: "var(--t2)" }}
                >
                  <strong className="text-eclat">{client.nom}</strong> · {client.secteur} · Budget:{" "}
                  <strong style={{ color: "var(--t)" }}>{client.budget?.toLocaleString("fr-FR")}€/mois</strong>
                  {client.cpa && <> · CPA cible: <strong style={{ color: "var(--t)" }}>{client.cpa}</strong></>}
                  {client.auditScore !== undefined && <> · Score audit: {client.auditScore}/30</>}
                </div>
              )}
            </div>
          </div>

          {/* CSV Upload */}
          <div className="card-os mb-5">
            <div className="card-os-header">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={13} className="text-eclat" />
                <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                  2. Importez vos CSV Google Ads <span className="font-normal" style={{ color: "var(--t3)" }}>(optionnel)</span>
                </span>
              </div>
            </div>
            <div className="card-os-body">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:border-eclat/40"
                style={{ borderColor: "var(--line2)" }}
              >
                <Upload size={24} className="mx-auto mb-2" style={{ color: "var(--t3)" }} />
                <p className="text-[12px] font-medium" style={{ color: "var(--t2)" }}>
                  Glissez vos fichiers CSV ou cliquez pour parcourir
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--t3)" }}>
                  Campagnes, Mots-clés, Search Terms, Annonces, Audiences, Budget, Conversions
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.tsv"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {csvFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  {csvFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] py-1 px-2 rounded" style={{ background: "var(--bg3)" }}>
                      <FileSpreadsheet size={11} className="text-green-500" />
                      <span style={{ color: "var(--t2)" }}>{f.name}</span>
                      <span className="font-mono" style={{ color: "var(--t3)" }}>
                        ({(f.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Launch */}
          <button
            onClick={handleAnalyse}
            disabled={!selectedClient || loading}
            className="btn-os-primary text-[13px] py-3 px-6 gap-2 w-full justify-center disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyse en cours — Analyste Pro IA…
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Lancer l&apos;analyse Analyste Pro
              </>
            )}
          </button>

          {/* Quota info */}
          <div className="mt-4 text-center">
            <span className="font-mono text-[10px]" style={{ color: "var(--t3)" }}>
              Solo : 10 analyses/mois · Team : 30 analyses/mois · Tokens pris en charge par Uplyo
            </span>
          </div>
        </div>
      ) : (
        /* ─── RESULTS ─── */
        <div>
          {/* Score header */}
          <div className="card-os mb-5">
            <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`font-mono text-3xl font-bold ${SCORE_COLOR(totalScore, totalMax)}`}>
                    {totalScore}<span className="text-base font-normal" style={{ color: "var(--t3)" }}>/{totalMax}</span>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--t3)" }}>
                    SCORE GLOBAL
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: "16px" }}>
                  <div className="text-[14px] font-medium" style={{ color: "var(--t)" }}>
                    {result.clientName}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--t3)" }}>
                    Analyse du {result.date} · Analyste Pro IA
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-os text-[11px] gap-1.5">
                  <Download size={11} /> Export PDF
                </button>
                <button onClick={handleReset} className="btn-os text-[11px] gap-1.5">
                  <RotateCcw size={11} /> Nouvelle analyse
                </button>
              </div>
            </div>

            {/* Score bars per section */}
            <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.sections.map((sec) => (
                <div key={sec.id} className="rounded-lg p-3" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm">{sec.icon}</span>
                    <span className={`font-mono text-[11px] font-bold ${SCORE_COLOR(sec.score, sec.maxScore)}`}>
                      {sec.score}/{sec.maxScore}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg4)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(sec.score / sec.maxScore) * 100}%`,
                        background: sec.score / sec.maxScore >= 0.75 ? "var(--green)" : sec.score / sec.maxScore >= 0.5 ? "var(--amber)" : "var(--red)",
                      }}
                    />
                  </div>
                  <div className="font-mono text-[9px] mt-1" style={{ color: "var(--t3)" }}>
                    {sec.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5">
            {([
              { id: "audit" as const, label: "Audit détaillé", icon: "🔬" },
              { id: "plan" as const, label: "Plan 90 jours", icon: "📅" },
              { id: "workload" as const, label: "Charge de travail", icon: "⏱️" },
              { id: "scripts" as const, label: "Scripts recommandés", icon: "⚡" },
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
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── AUDIT TAB ── */}
          {activeTab === "audit" && (
            <div className="space-y-3">
              {result.sections.map((sec) => (
                <div key={sec.id} className="card-os">
                  <button
                    onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                    className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--bg3)] transition-colors"
                    style={{ border: "none", background: "transparent" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{sec.icon}</span>
                      <span className="text-[13px] font-medium" style={{ color: "var(--t)" }}>
                        {sec.title}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${SCORE_COLOR(sec.score, sec.maxScore)}`}>
                        {sec.score}/{sec.maxScore}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="transition-transform"
                      style={{
                        color: "var(--t3)",
                        transform: expandedSection === sec.id ? "rotate(90deg)" : "none",
                      }}
                    />
                  </button>
                  {expandedSection === sec.id && (
                    <div style={{ borderTop: "1px solid var(--line)" }}>
                      {sec.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-2.5"
                          style={{ borderBottom: i < sec.items.length - 1 ? "1px solid var(--line)" : "none" }}
                        >
                          {STATUS_ICON[item.status]}
                          <span className="text-[12px] flex-1" style={{ color: "var(--t2)" }}>
                            {item.label}
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${STATUS_BG[item.status]}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── PLAN 90J TAB ── */}
          {activeTab === "plan" && (
            <div className="space-y-4">
              {result.plan90j.map((phase, i) => (
                <div key={i} className="card-os">
                  <div className="card-os-header">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-eclat" />
                      <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                        {phase.phase}
                      </span>
                    </div>
                    <span className="badge badge-purple">{phase.period}</span>
                  </div>
                  <div className="card-os-body">
                    <div className="space-y-2">
                      {phase.actions.map((action, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-[12px]" style={{ color: "var(--t2)" }}>
                          <span className="font-mono text-eclat shrink-0 mt-0.5">{j + 1}.</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── WORKLOAD TAB ── */}
          {activeTab === "workload" && (
            <div className="card-os">
              <div className="card-os-header">
                <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                  Estimation charge de travail
                </span>
                <span className="font-mono text-[11px] text-eclat font-semibold">
                  Total : {result.workload.reduce((s, w) => s + parseFloat(w.hours), 0)}h
                </span>
              </div>
              <table className="table-os">
                <thead>
                  <tr>
                    <th>Tâche</th>
                    <th>Temps estimé</th>
                    <th>Priorité</th>
                  </tr>
                </thead>
                <tbody>
                  {result.workload.map((w, i) => (
                    <tr key={i}>
                      <td className="text-[12px] font-medium" style={{ color: "var(--t)" }}>
                        {w.task}
                      </td>
                      <td className="font-mono">{w.hours}</td>
                      <td>
                        <span className={`badge ${PRIORITY_STYLE[w.priority]}`}>
                          {w.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── SCRIPTS TAB ── */}
          {activeTab === "scripts" && (
            <div className="card-os">
              <div className="card-os-header">
                <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                  Scripts recommandés pour ce compte
                </span>
              </div>
              <div>
                {result.scripts.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[var(--bg3)] transition-colors"
                    style={{ borderBottom: i < result.scripts.length - 1 ? "1px solid var(--line)" : "none" }}
                  >
                    <div>
                      <div className="text-[12px] font-medium" style={{ color: "var(--t)" }}>
                        ⚡ {s.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--t3)" }}>
                        {s.description}
                      </div>
                    </div>
                    <button className="btn-os text-[10px]">Voir dans Scripts →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-5 text-center">
            <p className="font-mono text-[10px]" style={{ color: "var(--t3)" }}>
              Analyse générée par Analyste Pro (Claude Sonnet 4.6) · Uplyo absorbe 100% des coûts tokens ·{" "}
              <span className="text-eclat">Solo : 10 analyses/mois</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
