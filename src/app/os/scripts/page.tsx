"use client";

import { useState } from "react";
import { Copy, Play, Code2 } from "lucide-react";

const SCRIPTS = [
  {
    id: "s1",
    title: "Pause low-performing keywords",
    description: "Pause automatiquement les mots-clés avec un CPA supérieur au seuil défini sur les 30 derniers jours.",
    category: "Optimisation",
    tags: ["Keywords", "CPA", "Auto"],
    code: `function main() {\n  const CPA_THRESHOLD = 50; // €\n  const DAYS = 30;\n  \n  const keywords = AdsApp.keywords()\n    .withCondition("Status = ENABLED")\n    .forDateRange("LAST_30_DAYS")\n    .get();\n  \n  while (keywords.hasNext()) {\n    const kw = keywords.next();\n    const stats = kw.getStatsFor("LAST_30_DAYS");\n    const cost = stats.getCost();\n    const conv = stats.getConversions();\n    \n    if (conv > 0 && (cost / conv) > CPA_THRESHOLD) {\n      kw.pause();\n      Logger.log("Paused: " + kw.getText() + " CPA: " + (cost/conv).toFixed(2));\n    }\n  }\n}`,
  },
  {
    id: "s2",
    title: "Budget pacing alert",
    description: "Envoie un email d'alerte si le rythme de dépense dépasse le budget mensuel prévu.",
    category: "Monitoring",
    tags: ["Budget", "Alert", "Email"],
    code: `function main() {\n  const MONTHLY_BUDGET = 5000;\n  const EMAIL = "you@agency.com";\n  \n  const today = new Date();\n  const dayOfMonth = today.getDate();\n  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();\n  \n  const account = AdsApp.currentAccount();\n  const stats = account.getStatsFor("THIS_MONTH");\n  const spent = stats.getCost();\n  \n  const expectedPace = (MONTHLY_BUDGET / daysInMonth) * dayOfMonth;\n  const paceRatio = spent / expectedPace;\n  \n  if (paceRatio > 1.15) {\n    MailApp.sendEmail(EMAIL, "⚠️ Budget Pacing Alert", \n      "Dépense: " + spent.toFixed(2) + "€ (" + (paceRatio*100).toFixed(0) + "% du pace)");\n  }\n}`,
  },
  {
    id: "s3",
    title: "Negative keywords from Search Terms",
    description: "Identifie les termes de recherche non convertissants et les ajoute en négatifs.",
    category: "Optimisation",
    tags: ["Négatifs", "Search Terms", "Auto"],
    code: `function main() {\n  const MIN_CLICKS = 10;\n  const MIN_COST = 20;\n  \n  const report = AdsApp.report(\n    "SELECT Query, Clicks, Cost, Conversions " +\n    "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +\n    "WHERE Clicks > " + MIN_CLICKS +\n    " AND Conversions = 0 " +\n    "DURING LAST_30_DAYS"\n  );\n  \n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const row = rows.next();\n    if (parseFloat(row["Cost"]) > MIN_COST) {\n      Logger.log("Negative candidate: " + row["Query"]);\n    }\n  }\n}`,
  },
  {
    id: "s4",
    title: "Quality Score tracker",
    description: "Exporte le Quality Score de tous les mots-clés actifs dans un Google Sheet pour suivi historique.",
    category: "Reporting",
    tags: ["QS", "Sheet", "Tracking"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  \n  const keywords = AdsApp.keywords()\n    .withCondition("Status = ENABLED")\n    .withCondition("QualityScore > 0")\n    .get();\n  \n  const today = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");\n  \n  while (keywords.hasNext()) {\n    const kw = keywords.next();\n    sheet.appendRow([\n      today,\n      kw.getText(),\n      kw.getQualityScore(),\n      kw.getCampaign().getName()\n    ]);\n  }\n}`,
  },
];

const CATEGORIES = ["Tous", "Optimisation", "Monitoring", "Reporting"];

export default function ScriptsPage() {
  const [category, setCategory] = useState("Tous");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = category === "Tous" ? SCRIPTS : SCRIPTS.filter((s) => s.category === category);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
          <span className="text-eclat">##</span> Scripts Library
        </h1>
        <p className="text-[13px] mt-1 max-w-[600px]" style={{ color: "var(--t2)" }}>
          Scripts Google Ads prêts à l&apos;emploi. Copiez, adaptez, déployez.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="font-mono text-[10px] px-3 py-1.5 rounded transition-all"
            style={{
              background: category === c ? "var(--eclat)" : "var(--bg3)",
              color: category === c ? "#0e0f11" : "var(--t3)",
              border: `1px solid ${category === c ? "var(--eclat)" : "var(--line2)"}`,
              fontWeight: category === c ? 600 : 400,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Script cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((script) => (
          <div key={script.id} className="card-os transition-all hover:border-[var(--line2)]">
            <div className="px-4 py-3 flex items-start justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex-1">
                <div className="text-[13px] font-medium mb-0.5" style={{ color: "var(--t)" }}>
                  {script.title}
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--t2)" }}>
                  {script.description}
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {script.tags.map((tag) => (
                    <span key={tag} className="badge badge-blue">{tag}</span>
                  ))}
                  <span className="badge badge-purple">{script.category}</span>
                </div>
              </div>
            </div>

            {/* Code preview */}
            <div
              className="rounded-b-[7px] overflow-hidden"
              style={{ background: "var(--bg)" }}
            >
              <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
                <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--t3)" }}>
                  JavaScript · Google Ads Script
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setExpanded(expanded === script.id ? null : script.id)}
                    className="btn-os text-[9px] py-0.5"
                  >
                    <Code2 size={10} /> {expanded === script.id ? "Réduire" : "Voir"}
                  </button>
                  <button className="btn-os text-[9px] py-0.5">
                    <Copy size={10} /> Copier
                  </button>
                </div>
              </div>
              <pre
                className="px-4 py-3 font-mono text-[11px] leading-relaxed overflow-x-auto"
                style={{
                  color: "#abb2bf",
                  maxHeight: expanded === script.id ? "none" : "100px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {script.code}
                {expanded !== script.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10"
                    style={{ background: "linear-gradient(transparent, var(--bg))" }}
                  />
                )}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
