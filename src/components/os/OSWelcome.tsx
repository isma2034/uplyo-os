"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, X, Sparkles, BarChart3, Users, Code2, FileText, Shield, Zap, CheckCircle } from "lucide-react";

/* ─── PLANS DATA ─── */
const PLANS = [
  {
    id: "solo",
    tag: "SOLO",
    name: "Solo",
    price: "99€",
    period: "/mois",
    desc: "Pour le freelance ou consultant indépendant. Remplace vos bookmarks, scripts éparpillés, rapports Word et Excel CRM.",
    features: [
      { ico: "⚡", text: "22+ scripts Google Ads en 1 clic" },
      { ico: "📊", text: "Rapports PDF marque blanche en 2 min" },
      { ico: "🤖", text: "6 wizards IA avec contexte client (10 analyses/mois)" },
      { ico: "🗂️", text: "CRM 10 clients + pipeline + facturation" },
      { ico: "✅", text: "Analyste Pro — audit + plan 90j depuis CSV GA" },
      { ico: "🔔", text: "Alertes monitoring budgets & CPA" },
      { ico: "⭐", text: "Favoris scripts + historique 50 analyses IA" },
    ],
    cta: "Essai gratuit 14 jours →",
    featured: false,
  },
  {
    id: "team",
    tag: "TEAM",
    name: "Team",
    price: "299€",
    period: "–599€/mois",
    desc: "Pour l'agence avec plusieurs AMs. Remplace Optmyzr, Google Sheets partagés et réunions hebdo de synchro.",
    features: [
      { ico: "👥", text: "Multi-users + rôles (Admin, AM, Client)" },
      { ico: "🔌", text: "API Google Ads — déploiement scripts auto" },
      { ico: "📈", text: "Dashboard multi-comptes centralisé" },
      { ico: "🔔", text: "Alertes anomalies push (Slack / email)" },
      { ico: "🤖", text: "Analyste Pro illimité + IA contexte client enrichi" },
      { ico: "📊", text: "Rapports marque blanche illimités" },
      { ico: "⚙️", text: "API publique + webhooks + Zapier" },
    ],
    cta: "Demander une démo →",
    featured: true,
  },
];

const MODULES = [
  { icon: Code2, name: "Scripts Library", desc: "22 scripts Google Ads prêts à l'emploi", count: "22" },
  { icon: BarChart3, name: "Structures GA", desc: "14 templates de comptes validés", count: "14" },
  { icon: Sparkles, name: "AI Wizards", desc: "5 assistants IA spécialisés", count: "5" },
  { icon: FileText, name: "Rapports WL", desc: "PDF marque blanche en 2 min", count: "5" },
  { icon: Shield, name: "Audit 30 pts", desc: "Checklist interactive scorée", count: "30" },
  { icon: Users, name: "CRM Agence", desc: "Pipeline + facturation intégrée", count: "∞" },
];

const GUIDE_STEPS = [
  { n: 1, title: "Explorez le Dashboard", desc: "Vue d'ensemble de vos KPIs, clients et raccourcis vers tous les modules.", link: "/os", icon: "📊" },
  { n: 2, title: "Ajoutez vos clients", desc: "Le CRM vous permet de centraliser toutes les infos clients avec budgets, CPA et notes.", link: "/os/clients", icon: "👥" },
  { n: 3, title: "Lancez un AI Wizard", desc: "Audit, copywriting, ROAS, structure — choisissez un assistant IA et testez avec un client.", link: "/os/ai-wizards", icon: "🤖" },
  { n: 4, title: "Découvrez les Scripts", desc: "22 scripts Google Ads prêts à copier-coller. Filtrez par catégorie et déployez.", link: "/os/scripts", icon: "⚡" },
  { n: 5, title: "Configurez votre API", desc: "Ajoutez votre clé Claude dans Configuration pour activer l'IA en temps réel.", link: "/os/config", icon: "🔧" },
];

export default function OSWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState<"plans" | "guide" | "modules">("plans");

  // Only show on first visit
  React.useEffect(() => {
    const dismissed = localStorage.getItem("uplyo-os-welcome-dismissed");
    if (!dismissed) setShowWelcome(true);
  }, []);

  const handleDismiss = () => {
    setShowWelcome(false);
    localStorage.setItem("uplyo-os-welcome-dismissed", "1");
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8" style={{ background: "rgba(14,15,17,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-xl" style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>
        
        {/* Header */}
        <div className="px-6 md:px-8 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-eclat rounded-lg grid place-items-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-mono text-base font-semibold" style={{ color: "var(--t)" }}>
                Bienvenue sur <span className="text-eclat">Uplyo OS</span>
              </h1>
              <p className="text-[11px]" style={{ color: "var(--t3)" }}>
                L&apos;OS des experts Google Ads — Prototype interactif
              </p>
            </div>
          </div>
          <button onClick={() => handleDismiss()} className="p-2 rounded-lg transition-colors hover:bg-[var(--bg4)]" style={{ color: "var(--t3)", border: "none", background: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8 flex gap-1 pt-4" style={{ borderBottom: "1px solid var(--line)" }}>
          {([
            { id: "plans" as const, label: "Plans & Tarifs" },
            { id: "modules" as const, label: "Modules" },
            { id: "guide" as const, label: "Guide démarrage" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-mono text-[11px] px-4 py-2.5 rounded-t transition-all border-b-2"
              style={{
                background: activeTab === tab.id ? "var(--bg3)" : "transparent",
                color: activeTab === tab.id ? "var(--eclat)" : "var(--t3)",
                borderBottomColor: activeTab === tab.id ? "var(--eclat)" : "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--eclat)" : "transparent"}`,
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-6">
          
          {/* ─── PLANS TAB ─── */}
          {activeTab === "plans" && (
            <div>
              <p className="text-[13px] mb-6 leading-relaxed" style={{ color: "var(--t2)" }}>
                Uplyo OS remplace 5 outils différents par une seule interface. <strong style={{ color: "var(--t)" }}>14 jours d&apos;essai gratuit, sans CB.</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-xl p-6 flex flex-col"
                    style={{
                      background: plan.featured ? "var(--bg)" : "var(--bg3)",
                      border: plan.featured ? "1.5px solid var(--eclat)" : "1px solid var(--line2)",
                      borderTop: plan.featured ? "3px solid var(--eclat)" : "3px solid rgba(108,92,231,0.3)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: plan.featured ? "rgba(108,92,231,0.15)" : "rgba(108,92,231,0.08)",
                          color: plan.featured ? "var(--eclat)" : "rgba(108,92,231,0.7)",
                        }}
                      >
                        {plan.tag}
                      </span>
                      {plan.featured && (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">POPULAIRE</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-semibold" style={{ color: "var(--t)" }}>{plan.price}</span>
                      <span className="text-xs" style={{ color: "var(--t3)" }}>{plan.period}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--t2)" }}>
                      {plan.desc}
                    </p>
                    <div className="flex flex-col gap-2 mb-5 flex-1">
                      {plan.features.map((f) => (
                        <div key={f.text} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--t2)" }}>
                          <span className="shrink-0 text-sm">{f.ico}</span>
                          {f.text}
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full text-center text-[13px] font-semibold py-2.5 rounded-lg transition-all cursor-pointer"
                      style={{
                        background: plan.featured ? "var(--eclat)" : "var(--bg4)",
                        color: plan.featured ? "#0e0f11" : "var(--t2)",
                        border: plan.featured ? "none" : "1px solid var(--line2)",
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 font-mono text-[10px]" style={{ color: "var(--t3)" }}>
                Tous les plans incluent 14 jours d&apos;essai gratuit · Pas de CB requise
              </div>

              {/* Quick CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                  style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", color: "var(--eclat)" }}>
                  <Play size={14} /> Demander une démo
                </button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                  style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t2)" }}>
                  <FileText size={14} /> Demander un devis
                </button>
                <button onClick={() => handleDismiss()} className="flex items-center gap-2 px-4 py-3 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                  style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--t2)" }}>
                  <ArrowRight size={14} /> Explorer le prototype
                </button>
              </div>
            </div>
          )}

          {/* ─── MODULES TAB ─── */}
          {activeTab === "modules" && (
            <div>
              <p className="text-[13px] mb-6 leading-relaxed" style={{ color: "var(--t2)" }}>
                14 modules intégrés. Voici les principaux, tous accessibles depuis la sidebar.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MODULES.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.name}
                      className="rounded-lg p-4 transition-all hover:border-eclat/30 cursor-pointer"
                      style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={18} className="text-eclat" />
                        <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(108,92,231,0.1)", color: "var(--eclat)" }}>
                          {mod.count}
                        </span>
                      </div>
                      <div className="text-[13px] font-medium mb-0.5" style={{ color: "var(--t)" }}>{mod.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--t3)" }}>{mod.desc}</div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => handleDismiss()} className="w-full mt-5 text-center text-[13px] font-semibold py-2.5 rounded-lg transition-all cursor-pointer"
                style={{ background: "var(--eclat)", color: "#0e0f11", border: "none" }}>
                Explorer tous les modules →
              </button>
            </div>
          )}

          {/* ─── GUIDE TAB ─── */}
          {activeTab === "guide" && (
            <div>
              <p className="text-[13px] mb-6 leading-relaxed" style={{ color: "var(--t2)" }}>
                5 étapes pour découvrir Uplyo OS et tirer le maximum du prototype.
              </p>
              <div className="flex flex-col gap-3">
                {GUIDE_STEPS.map((step) => (
                  <Link
                    key={step.n}
                    href={step.link}
                    onClick={() => handleDismiss()}
                    className="flex items-start gap-4 px-4 py-3.5 rounded-lg transition-all no-underline group hover:bg-[var(--bg4)]"
                    style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}
                  >
                    <div className="w-10 h-10 rounded-lg grid place-items-center text-lg shrink-0"
                      style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)" }}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: "var(--bg4)", color: "var(--t3)" }}>
                          ÉTAPE {step.n}
                        </span>
                      </div>
                      <div className="text-[13px] font-medium mt-1" style={{ color: "var(--t)" }}>{step.title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: "var(--t3)" }}>{step.desc}</div>
                    </div>
                    <ArrowRight size={14} className="shrink-0 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--eclat)" }} />
                  </Link>
                ))}
              </div>
              <button onClick={() => handleDismiss()} className="w-full mt-5 text-center text-[13px] font-semibold py-2.5 rounded-lg transition-all cursor-pointer"
                style={{ background: "var(--eclat)", color: "#0e0f11", border: "none" }}>
                C&apos;est parti ! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
