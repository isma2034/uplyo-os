"use client";

import { useState } from "react";
import { Save, Key, Bot, Palette, Globe } from "lucide-react";

export default function ConfigPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [persona, setPersona] = useState(
    "Tu es un expert Google Ads senior pour Uplyo. Réponses précises, chiffrées et actionnables en français."
  );
  const [agencyName, setAgencyName] = useState("Uplyo");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
          <span className="text-eclat">##</span> Configuration
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--t2)" }}>
          Paramètres de l&apos;OS, clé API, personnalisation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* IA & API */}
        <div className="card-os">
          <div className="card-os-header">
            <div className="flex items-center gap-2">
              <Key size={13} className="text-eclat" />
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                IA & API
              </span>
            </div>
          </div>
          <div className="card-os-body space-y-4">
            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                Clé API Anthropic
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none transition-colors"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              />
              <p className="text-[10px] mt-1" style={{ color: "var(--t3)" }}>
                Obtenez votre clé sur console.anthropic.com
              </p>
            </div>

            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                Modèle
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)", appearance: "none" }}
              >
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (recommandé)</option>
                <option value="claude-opus-4-6">Claude Opus 4.6 (premium)</option>
                <option value="claude-haiku-4-5">Claude Haiku 4.5 (rapide)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                Max tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              />
            </div>
          </div>
        </div>

        {/* Persona */}
        <div className="card-os">
          <div className="card-os-header">
            <div className="flex items-center gap-2">
              <Bot size={13} className="text-eclat" />
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Persona IA
              </span>
            </div>
          </div>
          <div className="card-os-body space-y-4">
            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                System prompt personnalisé
              </label>
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full min-h-[120px] font-sans text-[12px] py-2 px-3 rounded outline-none resize-y"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              />
            </div>
            <div
              className="rounded p-3 text-[10px] leading-relaxed"
              style={{ background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.12)", color: "var(--t2)" }}
            >
              💡 Ce prompt sera injecté comme contexte système dans tous les AI Wizards. Incluez votre ton, votre expertise, et les règles de format.
            </div>
          </div>
        </div>

        {/* Agency settings */}
        <div className="card-os">
          <div className="card-os-header">
            <div className="flex items-center gap-2">
              <Palette size={13} className="text-eclat" />
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Agence
              </span>
            </div>
          </div>
          <div className="card-os-body space-y-4">
            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                Nom de l&apos;agence
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              />
            </div>
            <div>
              <label className="font-mono text-[9px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: "var(--t3)" }}>
                Email de contact
              </label>
              <input
                type="email"
                defaultValue="contact@uplyo.agency"
                className="w-full font-mono text-[12px] py-2 px-3 rounded outline-none"
                style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t)" }}
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="card-os">
          <div className="card-os-header">
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-eclat" />
              <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
                Intégrations
              </span>
            </div>
          </div>
          <div className="card-os-body space-y-3">
            {[
              { name: "Google Ads API", status: "Non connecté", connected: false },
              { name: "Google Analytics", status: "Non connecté", connected: false },
              { name: "Looker Studio", status: "Non connecté", connected: false },
              { name: "Slack", status: "Non connecté", connected: false },
              { name: "Calendly", status: "Non connecté", connected: false },
            ].map((integ) => (
              <div
                key={integ.name}
                className="flex items-center justify-between py-2 px-3 rounded"
                style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}
              >
                <div>
                  <span className="text-[12px] font-medium" style={{ color: "var(--t)" }}>
                    {integ.name}
                  </span>
                  <span className={`ml-2 badge ${integ.connected ? "badge-green" : "badge-amber"}`}>
                    {integ.status}
                  </span>
                </div>
                <button className="btn-os text-[10px]">Connecter</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-3">
        <button onClick={handleSave} className="btn-os-primary text-[12px]">
          <Save size={13} /> Sauvegarder la configuration
        </button>
        {saved && (
          <span className="text-[12px] text-green-500 font-medium animate-pulse">
            ✓ Configuration sauvegardée !
          </span>
        )}
      </div>
    </div>
  );
}
