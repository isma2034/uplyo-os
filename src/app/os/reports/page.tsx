"use client";

import { useState } from "react";
import { CLIENTS } from "@/lib/data";
import {
  FileText,
  Download,
  Eye,
  Plus,
  Send,
  Palette,
  Calendar,
  Loader2,
  CheckCircle,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "monthly",
    name: "Rapport Mensuel",
    description: "Performance complète : KPIs, tendances, top/flop, recommandations",
    sections: ["KPIs clés", "Évolution budget", "Top campagnes", "Mots-clés", "Recommandations"],
    badge: "POPULAIRE",
    pages: "8-12",
  },
  {
    id: "weekly",
    name: "Rapport Hebdo",
    description: "Snapshot rapide : dépenses, conversions, alertes, actions de la semaine",
    sections: ["Dépenses vs budget", "Conversions", "Alertes", "Actions réalisées"],
    badge: "RAPIDE",
    pages: "3-4",
  },
  {
    id: "audit",
    name: "Rapport d'Audit",
    description: "Audit complet avec score, checklist 30 points, plan d'action recommandé",
    sections: ["Score /30", "Structure", "Mots-clés", "Annonces", "Tracking", "Plan d'action"],
    badge: "AUDIT",
    pages: "10-15",
  },
  {
    id: "ecom",
    name: "E-commerce Performance",
    description: "Rapport spécialisé Shopping + PMax : ROAS, top produits, feed health",
    sections: ["ROAS global", "Top produits", "Shopping vs PMax", "Feed santé", "Recommandations"],
    badge: "E-COM",
    pages: "6-8",
  },
  {
    id: "onboarding",
    name: "Rapport d'Onboarding",
    description: "État des lieux initial pour nouveau client : baseline, opportunités, planning",
    sections: ["Baseline métriques", "Analyse concurrence", "Opportunités identifiées", "Planning"],
    badge: "NOUVEAU",
    pages: "5-7",
  },
];

const RECENT_REPORTS = [
  { id: "r1", client: "BioMarket", template: "Rapport Mensuel", date: "01/03/2026", status: "envoyé", pages: 10 },
  { id: "r2", client: "TechFlow SaaS", template: "Rapport Hebdo", date: "10/03/2026", status: "brouillon", pages: 4 },
  { id: "r3", client: "FitZone", template: "Rapport Mensuel", date: "01/03/2026", status: "envoyé", pages: 8 },
  { id: "r4", client: "BioMarket", template: "E-commerce Performance", date: "15/02/2026", status: "envoyé", pages: 7 },
  { id: "r5", client: "Immo Premium", template: "Rapport d'Onboarding", date: "20/01/2026", status: "envoyé", pages: 6 },
];

const STATUS_STYLE: Record<string, string> = {
  envoyé: "badge-green",
  brouillon: "badge-amber",
  généré: "badge-blue",
};

export default function ReportsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate || !selectedClient) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  const handleReset = () => {
    setShowCreate(false);
    setSelectedTemplate(null);
    setSelectedClient("");
    setGenerated(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> Rapports Marque Blanche
          </h1>
          <p className="text-[13px] mt-1 max-w-[600px]" style={{ color: "var(--t2)" }}>
            Générez des rapports PDF professionnels à votre marque en 2 minutes.
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-os-primary text-[11px]">
          <Plus size={12} /> Nouveau rapport
        </button>
      </div>

      {/* KPI strip */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {[
          { label: "RAPPORTS GÉNÉRÉS", value: "23", color: "text-eclat" },
          { label: "CE MOIS", value: "5", color: "text-blue-400" },
          { label: "CLIENTS COUVERTS", value: "4/5", color: "text-green-500" },
          { label: "TEMPLATES", value: "5", color: "text-amber-500" },
        ].map((k, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>{k.label}</div>
            <div className={`kpi-value ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* CREATE FLOW */}
      {showCreate && (
        <div className="mb-6">
          {!generated ? (
            <div className="card-os">
              <div className="card-os-header">
                <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                  Créer un rapport
                </span>
              </div>
              <div className="card-os-body">
                {/* Client select */}
                <div className="mb-4">
                  <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                    Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none"
                    style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
                  >
                    <option value="">— Choisir —</option>
                    {CLIENTS.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Template select */}
                <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--t3)" }}>
                  Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className="text-left rounded-lg p-3 transition-all"
                      style={{
                        background: selectedTemplate === t.id ? "rgba(108,92,231,0.1)" : "var(--bg3)",
                        border: `1.5px solid ${selectedTemplate === t.id ? "var(--eclat)" : "var(--line)"}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium" style={{ color: "var(--t)" }}>{t.name}</span>
                        <span className="badge badge-purple">{t.badge}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--t3)" }}>{t.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-[9px] font-mono" style={{ color: "var(--t3)" }}>
                        <FileText size={9} /> {t.pages} pages · {t.sections.length} sections
                      </div>
                    </button>
                  ))}
                </div>

                {/* White-label options */}
                <div className="rounded-lg p-3 mb-4" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette size={12} className="text-eclat" />
                    <span className="font-mono text-[10px] font-medium" style={{ color: "var(--t2)" }}>
                      Marque blanche — votre logo + couleurs dans le PDF
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--t3)" }}>
                    Configurez votre branding dans Configuration → Agence pour personnaliser tous les rapports.
                  </p>
                </div>

                {/* Generate */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || !selectedClient || generating}
                  className="btn-os-primary text-[12px] py-2.5 px-5 gap-2 disabled:opacity-40"
                >
                  {generating ? (
                    <><Loader2 size={13} className="animate-spin" /> Génération IA en cours…</>
                  ) : (
                    <><FileText size={13} /> Générer le rapport</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ─── Generated confirmation ─── */
            <div className="card-os">
              <div className="card-os-body text-center py-8">
                <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
                <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--t)" }}>
                  Rapport généré avec succès
                </h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--t2)" }}>
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} — {CLIENTS.find((c) => c.id === selectedClient)?.nom}
                </p>
                <div className="flex gap-2 justify-center">
                  <button className="btn-os-primary text-[11px] gap-1.5">
                    <Download size={11} /> Télécharger PDF
                  </button>
                  <button className="btn-os text-[11px] gap-1.5">
                    <Eye size={11} /> Prévisualiser
                  </button>
                  <button className="btn-os text-[11px] gap-1.5">
                    <Send size={11} /> Envoyer au client
                  </button>
                  <button onClick={handleReset} className="btn-os text-[11px]">
                    Nouveau rapport
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECENT REPORTS TABLE */}
      <div className="card-os">
        <div className="card-os-header">
          <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
            Rapports récents
          </span>
        </div>
        <table className="table-os">
          <thead>
            <tr>
              <th>Client</th>
              <th>Template</th>
              <th>Date</th>
              <th>Pages</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((r) => (
              <tr key={r.id}>
                <td className="font-medium" style={{ color: "var(--t)" }}>{r.client}</td>
                <td>{r.template}</td>
                <td className="font-mono">{r.date}</td>
                <td className="font-mono">{r.pages}</td>
                <td>
                  <span className={`badge ${STATUS_STYLE[r.status] || "badge-blue"}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-os text-[9px] py-0.5"><Eye size={10} /></button>
                    <button className="btn-os text-[9px] py-0.5"><Download size={10} /></button>
                    <button className="btn-os text-[9px] py-0.5"><Send size={10} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
