"use client";

import { useState } from "react";
import { WIZARDS, CLIENTS } from "@/lib/data";
import { ArrowLeft, Send, RotateCcw, Sparkles } from "lucide-react";

export default function AIWizardsPage() {
  const [activeWizard, setActiveWizard] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const wizard = WIZARDS.find((w) => w.id === activeWizard);
  const client = CLIENTS.find((c) => c.id === selectedClient);

  const handleRun = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    // Simulated AI response for prototype
    await new Promise((r) => setTimeout(r, 1500));
    setResult(
      `## Résultat — ${wizard?.title}\n\n` +
      `Analyse basée sur les données fournies${client ? ` pour **${client.nom}**` : ""}.\n\n` +
      `> ⚠️ Ceci est un prototype. Connectez votre clé API Claude dans Configuration pour obtenir de vrais résultats IA.\n\n` +
      `### Recommandations\n` +
      `1. Optimiser les enchères sur les mots-clés à fort potentiel\n` +
      `2. Restructurer les groupes d'annonces pour plus de granularité\n` +
      `3. Ajouter des extensions d'annonces manquantes\n` +
      `4. Revoir le ciblage géographique\n\n` +
      `_Configurez votre clé API pour des analyses personnalisées._`
    );
    setLoading(false);
  };

  const handleReset = () => {
    setUserInput("");
    setResult(null);
  };

  if (!activeWizard) {
    return (
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> AI Wizards
          </h1>
          <p className="text-[13px] mt-1 max-w-[600px] leading-relaxed" style={{ color: "var(--t2)" }}>
            Assistants IA spécialisés Google Ads. Sélectionnez un wizard pour commencer.
          </p>
        </div>

        {/* Client selector */}
        <div className="mb-6 flex items-center gap-3">
          <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--t3)" }}>
            Contexte client :
          </label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="font-mono text-[12px] py-1.5 px-3 rounded outline-none"
            style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
          >
            <option value="">— Aucun (contexte manuel) —</option>
            {CLIENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} — {c.secteur} {c.budget ? `(${c.budget}€/mois)` : ""}
              </option>
            ))}
          </select>
        </div>

        {client && (
          <div
            className="mb-6 rounded-[7px] p-4 text-[12px] leading-relaxed"
            style={{ background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.15)", color: "var(--t2)" }}
          >
            <strong className="text-eclat">{client.nom}</strong> · {client.secteur}
            {client.budget && <> · Budget: <strong style={{ color: "var(--t)" }}>{client.budget}€/mois</strong></>}
            {client.cpa && <> · Cible: <strong style={{ color: "var(--t)" }}>{client.cpa}</strong></>}
            {client.cpaActuel && <> · CPA actuel: <span className="text-red-400">{client.cpaActuel}€</span></>}
          </div>
        )}

        {/* Wizard cards grid */}
        <div className="grid grid-cols-3 gap-4">
          {WIZARDS.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWizard(w.id)}
              className="card-os text-left transition-all hover:border-eclat/30 hover:-translate-y-0.5 group"
            >
              <div className="card-os-header">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{w.icon}</span>
                  <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                    {w.title}
                  </span>
                </div>
                <span className="badge badge-purple">{w.badge}</span>
              </div>
              <div className="card-os-body">
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--t2)" }}>
                  {w.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-eclat opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={11} /> Lancer le wizard →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Wizard workspace ──
  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setActiveWizard(null); handleReset(); }} className="btn-os">
          <ArrowLeft size={12} /> Retour
        </button>
        <span className="text-xl">{wizard?.icon}</span>
        <div>
          <h1 className="font-mono text-lg font-semibold" style={{ color: "var(--t)" }}>
            {wizard?.title}
          </h1>
          <span className="badge badge-purple">{wizard?.badge}</span>
        </div>
      </div>

      {client && (
        <div
          className="mb-4 rounded p-3 text-[11px]"
          style={{ background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.15)", color: "var(--t2)" }}
        >
          <strong className="text-eclat">{client.nom}</strong> · {client.secteur} · {client.budget}€/mois · CPA cible: {client.cpa || "N/A"}
        </div>
      )}

      {/* Input zone */}
      {!result && (
        <div className="card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px]" style={{ color: "var(--t)" }}>
              {wizard?.inputLabel}
            </span>
          </div>
          <div className="card-os-body">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={wizard?.placeholder}
              className="w-full min-h-[150px] font-sans text-[13px] p-3 rounded resize-y outline-none"
              style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={handleRun} disabled={loading} className="btn-os-primary text-[12px] gap-2">
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <Send size={12} /> {wizard?.runLabel}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result zone */}
      {result && (
        <div className="space-y-4">
          <div className="card-os">
            <div className="card-os-header">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ai-pulse" />
                <span className="font-mono text-[11px] text-green-500">RÉSULTAT</span>
              </div>
              <button onClick={handleReset} className="btn-os text-[10px]">
                <RotateCcw size={10} /> Recommencer
              </button>
            </div>
            <div className="card-os-body">
              <div
                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--t2)" }}
              >
                {result}
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="card-os">
            <div className="card-os-body">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Question de suivi…"
                  className="flex-1 font-sans text-[12px] py-2 px-3 rounded outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
                />
                <button className="btn-os-primary text-[11px]">
                  <Send size={11} /> Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
