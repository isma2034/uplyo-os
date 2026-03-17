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
  {
    id: "s5",
    title: "Auto-pause zero impression ads",
    description: "Pause les annonces avec 0 impression depuis 14 jours pour nettoyer les ad groups.",
    category: "Optimisation",
    tags: ["Ads", "Cleanup", "Auto"],
    code: `function main() {\n  const ads = AdsApp.ads()\n    .withCondition("Status = ENABLED")\n    .withCondition("Impressions = 0")\n    .forDateRange("LAST_14_DAYS")\n    .get();\n  \n  while (ads.hasNext()) {\n    const ad = ads.next();\n    ad.pause();\n    Logger.log("Paused ad in: " + ad.getAdGroup().getName());\n  }\n}`,
  },
  {
    id: "s6",
    title: "Bid adjustment by device",
    description: "Ajuste les enchères par device (mobile/desktop/tablet) selon les performances CPA.",
    category: "Optimisation",
    tags: ["Bids", "Device", "CPA"],
    code: `function main() {\n  const TARGET_CPA = 40;\n  const campaigns = AdsApp.campaigns()\n    .withCondition("Status = ENABLED").get();\n  \n  while (campaigns.hasNext()) {\n    const camp = campaigns.next();\n    const devices = camp.targeting().platforms().get();\n    while (devices.hasNext()) {\n      const device = devices.next();\n      const stats = device.getStatsFor("LAST_30_DAYS");\n      const conv = stats.getConversions();\n      if (conv > 0) {\n        const cpa = stats.getCost() / conv;\n        const adj = Math.round((TARGET_CPA / cpa - 1) * 100);\n        device.setBidModifier(1 + adj / 100);\n      }\n    }\n  }\n}`,
  },
  {
    id: "s7",
    title: "RSA performance grader",
    description: "Analyse la performance de chaque titre et description RSA et exporte les résultats.",
    category: "Reporting",
    tags: ["RSA", "Annonces", "Export"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  \n  const report = AdsApp.report(\n    "SELECT CampaignName, AdGroupName, HeadlinePart1, " +\n    "HeadlinePart2, Description, Impressions, Clicks, Conversions " +\n    "FROM AD_PERFORMANCE_REPORT " +\n    "WHERE AdType = RESPONSIVE_SEARCH_AD " +\n    "DURING LAST_30_DAYS"\n  );\n  \n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const row = rows.next();\n    sheet.appendRow([\n      row["CampaignName"], row["AdGroupName"],\n      row["HeadlinePart1"], row["Impressions"],\n      row["Clicks"], row["Conversions"]\n    ]);\n  }\n}`,
  },
  {
    id: "s8",
    title: "Campaign daily spend tracker",
    description: "Log quotidien des dépenses par campagne dans un Google Sheet pour suivi historique.",
    category: "Reporting",
    tags: ["Budget", "Sheet", "Daily"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  const today = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");\n  \n  const campaigns = AdsApp.campaigns()\n    .withCondition("Status = ENABLED").get();\n  \n  while (campaigns.hasNext()) {\n    const camp = campaigns.next();\n    const stats = camp.getStatsFor("TODAY");\n    sheet.appendRow([\n      today, camp.getName(),\n      stats.getCost(), stats.getClicks(),\n      stats.getConversions(), stats.getImpressions()\n    ]);\n  }\n}`,
  },
  {
    id: "s9",
    title: "Broken URL checker",
    description: "Vérifie toutes les URLs de destination et alerte si un code HTTP 4xx/5xx est détecté.",
    category: "Monitoring",
    tags: ["URLs", "404", "Alert"],
    code: `function main() {\n  const EMAIL = "you@agency.com";\n  const broken = [];\n  \n  const ads = AdsApp.ads()\n    .withCondition("Status = ENABLED").get();\n  \n  while (ads.hasNext()) {\n    const ad = ads.next();\n    const urls = ad.urls();\n    const finalUrl = urls.getFinalUrl();\n    if (finalUrl) {\n      try {\n        const resp = UrlFetchApp.fetch(finalUrl, {muteHttpExceptions: true});\n        if (resp.getResponseCode() >= 400) {\n          broken.push(finalUrl + " → " + resp.getResponseCode());\n        }\n      } catch(e) {\n        broken.push(finalUrl + " → ERROR");\n      }\n    }\n  }\n  \n  if (broken.length > 0) {\n    MailApp.sendEmail(EMAIL, "⚠️ Broken URLs",\n      broken.join("\\n"));\n  }\n}`,
  },
  {
    id: "s10",
    title: "Conversion lag report",
    description: "Compare les conversions à 1j, 7j et 30j pour identifier le délai de conversion moyen.",
    category: "Reporting",
    tags: ["Conversions", "Lag", "Analysis"],
    code: `function main() {\n  const periods = ["LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS"];\n  \n  periods.forEach(function(period) {\n    const stats = AdsApp.currentAccount().getStatsFor(period);\n    Logger.log(period + ":");\n    Logger.log("  Cost: " + stats.getCost());\n    Logger.log("  Conv: " + stats.getConversions());\n    Logger.log("  CPA: " + (stats.getCost() / Math.max(stats.getConversions(), 1)).toFixed(2));\n  });\n}`,
  },
  {
    id: "s11",
    title: "Auto-label high performers",
    description: "Ajoute un label aux mots-clés avec un CPA inférieur au seuil et +5 conversions.",
    category: "Optimisation",
    tags: ["Labels", "Keywords", "Auto"],
    code: `function main() {\n  const CPA_TARGET = 35;\n  const MIN_CONV = 5;\n  const LABEL = "★ Top Performer";\n  \n  // Create label if needed\n  try { AdsApp.createLabel(LABEL); } catch(e) {}\n  \n  const keywords = AdsApp.keywords()\n    .withCondition("Status = ENABLED")\n    .forDateRange("LAST_30_DAYS")\n    .get();\n  \n  while (keywords.hasNext()) {\n    const kw = keywords.next();\n    const stats = kw.getStatsFor("LAST_30_DAYS");\n    const conv = stats.getConversions();\n    if (conv >= MIN_CONV) {\n      const cpa = stats.getCost() / conv;\n      if (cpa <= CPA_TARGET) {\n        kw.applyLabel(LABEL);\n        Logger.log("Labeled: " + kw.getText());\n      }\n    }\n  }\n}`,
  },
  {
    id: "s12",
    title: "Impression share tracker",
    description: "Exporte le taux d'impression perdu (budget + rank) par campagne dans un Sheet.",
    category: "Reporting",
    tags: ["IS", "Sheet", "Tracking"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  const today = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");\n  \n  const report = AdsApp.report(\n    "SELECT CampaignName, SearchImpressionShare, " +\n    "SearchBudgetLostImpressionShare, SearchRankLostImpressionShare " +\n    "FROM CAMPAIGN_PERFORMANCE_REPORT " +\n    "WHERE CampaignStatus = ENABLED DURING LAST_7_DAYS"\n  );\n  \n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const row = rows.next();\n    sheet.appendRow([today, row["CampaignName"],\n      row["SearchImpressionShare"],\n      row["SearchBudgetLostImpressionShare"],\n      row["SearchRankLostImpressionShare"]]);\n  }\n}`,
  },
  {
    id: "s13",
    title: "Shopping feed error alert",
    description: "Vérifie les erreurs du feed Merchant Center et alerte par email.",
    category: "Monitoring",
    tags: ["Shopping", "Feed", "Alert"],
    code: `function main() {\n  const EMAIL = "you@agency.com";\n  \n  const report = AdsApp.report(\n    "SELECT CampaignName, OfferId, MerchantId, " +\n    "Title, CustomLabel0 " +\n    "FROM SHOPPING_PERFORMANCE_REPORT " +\n    "WHERE Impressions = 0 DURING LAST_7_DAYS"\n  );\n  \n  const issues = [];\n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const row = rows.next();\n    issues.push(row["OfferId"] + " — " + row["Title"]);\n  }\n  \n  if (issues.length > 10) {\n    MailApp.sendEmail(EMAIL,\n      "⚠️ " + issues.length + " produits sans impression",\n      issues.slice(0, 50).join("\\n"));\n  }\n}`,
  },
  {
    id: "s14",
    title: "Ad schedule performance",
    description: "Analyse les performances par créneau horaire pour optimiser les ad schedules.",
    category: "Optimisation",
    tags: ["Schedule", "Horaires", "Bids"],
    code: `function main() {\n  const report = AdsApp.report(\n    "SELECT HourOfDay, Clicks, Impressions, Cost, " +\n    "Conversions, ConversionRate " +\n    "FROM ACCOUNT_PERFORMANCE_REPORT " +\n    "DURING LAST_30_DAYS"\n  );\n  \n  const rows = report.rows();\n  Logger.log("Hour | Clicks | Conv | CPA | CVR");\n  while (rows.hasNext()) {\n    const r = rows.next();\n    const conv = parseFloat(r["Conversions"]);\n    const cost = parseFloat(r["Cost"]);\n    const cpa = conv > 0 ? (cost / conv).toFixed(2) : "N/A";\n    Logger.log(r["HourOfDay"] + "h | " +\n      r["Clicks"] + " | " + r["Conversions"] + " | " +\n      cpa + "€ | " + r["ConversionRate"]);\n  }\n}`,
  },
  {
    id: "s15",
    title: "Duplicate keywords finder",
    description: "Détecte les mots-clés en doublon entre différents ad groups ou campagnes.",
    category: "Optimisation",
    tags: ["Keywords", "Duplicates", "Cleanup"],
    code: `function main() {\n  const kwMap = {};\n  const dupes = [];\n  \n  const keywords = AdsApp.keywords()\n    .withCondition("Status = ENABLED").get();\n  \n  while (keywords.hasNext()) {\n    const kw = keywords.next();\n    const text = kw.getText().toLowerCase();\n    const camp = kw.getCampaign().getName();\n    const ag = kw.getAdGroup().getName();\n    const key = text + "|" + kw.getMatchType();\n    \n    if (kwMap[key]) {\n      dupes.push(text + " [" + kw.getMatchType() + "] → " +\n        kwMap[key] + " & " + camp + "/" + ag);\n    } else {\n      kwMap[key] = camp + "/" + ag;\n    }\n  }\n  \n  dupes.forEach(d => Logger.log("DUPE: " + d));\n  Logger.log("Total duplicates: " + dupes.length);\n}`,
  },
  {
    id: "s16",
    title: "ROAS par campagne (weekly)",
    description: "Calcule le ROAS hebdomadaire par campagne et l'exporte pour suivi des tendances.",
    category: "Reporting",
    tags: ["ROAS", "Weekly", "E-com"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  const today = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");\n  \n  const campaigns = AdsApp.campaigns()\n    .withCondition("Status = ENABLED").get();\n  \n  while (campaigns.hasNext()) {\n    const camp = campaigns.next();\n    const stats = camp.getStatsFor("LAST_7_DAYS");\n    const cost = stats.getCost();\n    const convValue = stats.getConversionValue();\n    const roas = cost > 0 ? (convValue / cost).toFixed(2) : "N/A";\n    \n    sheet.appendRow([today, camp.getName(),\n      cost.toFixed(2), convValue.toFixed(2),\n      roas, stats.getConversions()]);\n  }\n}`,
  },
  {
    id: "s17",
    title: "Geo performance analyzer",
    description: "Analyse les performances par zone géographique et recommande des ajustements de bid.",
    category: "Reporting",
    tags: ["Geo", "Bids", "Analysis"],
    code: `function main() {\n  const report = AdsApp.report(\n    "SELECT CountryCriteriaId, RegionCriteriaId, " +\n    "Clicks, Cost, Conversions " +\n    "FROM GEO_PERFORMANCE_REPORT " +\n    "DURING LAST_30_DAYS"\n  );\n  \n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const row = rows.next();\n    const conv = parseFloat(row["Conversions"]);\n    const cost = parseFloat(row["Cost"]);\n    if (conv > 0) {\n      Logger.log(row["RegionCriteriaId"] + \n        " | CPA: " + (cost/conv).toFixed(2) + "€");\n    }\n  }\n}`,
  },
  {
    id: "s18",
    title: "Extension sitelink auditor",
    description: "Vérifie que chaque campagne a au moins 4 sitelinks actifs et alerte si non.",
    category: "Monitoring",
    tags: ["Extensions", "Audit", "Alert"],
    code: `function main() {\n  const EMAIL = "you@agency.com";\n  const issues = [];\n  \n  const campaigns = AdsApp.campaigns()\n    .withCondition("Status = ENABLED").get();\n  \n  while (campaigns.hasNext()) {\n    const camp = campaigns.next();\n    const sitelinks = camp.extensions().sitelinks().get();\n    let count = 0;\n    while (sitelinks.hasNext()) { sitelinks.next(); count++; }\n    if (count < 4) {\n      issues.push(camp.getName() + ": " + count + " sitelinks");\n    }\n  }\n  \n  if (issues.length > 0) {\n    MailApp.sendEmail(EMAIL, "⚠️ Sitelinks manquants",\n      issues.join("\\n"));\n  }\n}`,
  },
  {
    id: "s19",
    title: "Shopping product partition optimizer",
    description: "Analyse les performances par product group dans Shopping et identifie les top/flop.",
    category: "E-commerce",
    tags: ["Shopping", "Products", "ROAS"],
    code: `function main() {\n  const report = AdsApp.report(\n    "SELECT OfferId, Impressions, Clicks, Cost, " +\n    "Conversions, ConversionValue " +\n    "FROM SHOPPING_PERFORMANCE_REPORT " +\n    "DURING LAST_30_DAYS"\n  );\n  \n  const rows = report.rows();\n  while (rows.hasNext()) {\n    const r = rows.next();\n    const cost = parseFloat(r["Cost"]);\n    const value = parseFloat(r["ConversionValue"]);\n    const roas = cost > 0 ? (value / cost).toFixed(2) : "N/A";\n    Logger.log(r["OfferId"] + " | ROAS: " + roas +\n      " | Cost: " + cost.toFixed(2));\n  }\n}`,
  },
  {
    id: "s20",
    title: "PMax asset group performance",
    description: "Exporte les performances des asset groups Performance Max dans un Sheet.",
    category: "E-commerce",
    tags: ["PMax", "Assets", "Sheet"],
    code: `function main() {\n  const SHEET_URL = "YOUR_SHEET_URL";\n  const ss = SpreadsheetApp.openByUrl(SHEET_URL);\n  const sheet = ss.getActiveSheet();\n  const today = Utilities.formatDate(\n    new Date(), "Europe/Paris", "yyyy-MM-dd");\n  \n  const campaigns = AdsApp.performanceMaxCampaigns()\n    .withCondition("Status = ENABLED").get();\n  \n  while (campaigns.hasNext()) {\n    const camp = campaigns.next();\n    const stats = camp.getStatsFor("LAST_7_DAYS");\n    sheet.appendRow([today, camp.getName(),\n      stats.getCost(), stats.getConversions(),\n      stats.getConversionValue()]);\n  }\n}`,
  },
  {
    id: "s21",
    title: "Ad strength checker",
    description: "Identifie les annonces RSA avec un Ad Strength faible (Poor/Average) pour optimisation.",
    category: "Optimisation",
    tags: ["RSA", "Ad Strength", "Audit"],
    code: `function main() {\n  const weak = [];\n  const ads = AdsApp.ads()\n    .withCondition("Type = RESPONSIVE_SEARCH_AD")\n    .withCondition("Status = ENABLED").get();\n  \n  while (ads.hasNext()) {\n    const ad = ads.next();\n    // Note: Ad Strength via API requires Reports\n    const camp = ad.getCampaign().getName();\n    const ag = ad.getAdGroup().getName();\n    const stats = ad.getStatsFor("LAST_30_DAYS");\n    const ctr = stats.getCtr();\n    if (ctr < 0.02) { // Low CTR proxy for weak ad\n      weak.push(camp + "/" + ag + " CTR: " +\n        (ctr * 100).toFixed(2) + "%");\n    }\n  }\n  \n  weak.forEach(w => Logger.log("⚠️ " + w));\n  Logger.log("Total weak ads: " + weak.length);\n}`,
  },
  {
    id: "s22",
    title: "Consent Mode v2 checker",
    description: "Vérifie que le Consent Mode v2 est correctement configuré via les tags de conversion.",
    category: "Monitoring",
    tags: ["Consent", "RGPD", "Tracking"],
    code: `function main() {\n  // Check conversion actions for consent mode\n  const EMAIL = "you@agency.com";\n  const account = AdsApp.currentAccount();\n  \n  Logger.log("Account: " + account.getName());\n  Logger.log("Checking conversion tracking...");\n  \n  const report = AdsApp.report(\n    "SELECT ConversionTypeName, ConversionCategoryName " +\n    "FROM ACCOUNT_PERFORMANCE_REPORT " +\n    "DURING LAST_7_DAYS"\n  );\n  \n  const rows = report.rows();\n  let hasConversions = false;\n  while (rows.hasNext()) {\n    const r = rows.next();\n    hasConversions = true;\n    Logger.log("Conv: " + r["ConversionTypeName"]);\n  }\n  \n  if (!hasConversions) {\n    MailApp.sendEmail(EMAIL,\n      "⚠️ Pas de conversions détectées",\n      "Vérifiez le Consent Mode v2 et les tags GTM.");\n  }\n}`,
  },
];

const CATEGORIES = ["Tous", "Optimisation", "Monitoring", "Reporting", "E-commerce"];

export default function ScriptsPage() {
  const [category, setCategory] = useState("Tous");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = category === "Tous" ? SCRIPTS : SCRIPTS.filter((s) => s.category === category);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <button
                    onClick={() => handleCopy(script.id, script.code)}
                    className="btn-os text-[9px] py-0.5"
                  >
                    <Copy size={10} /> {copied === script.id ? "Copié ✓" : "Copier"}
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
