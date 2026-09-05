/**
 * Rendu du rapport, en Markdown.
 *
 * Le rendu ne décide de RIEN. Il ne trie pas, ne filtre pas, ne requalifie
 * pas : il lit `destination` et `status`, déjà calculés par findings.ts, et
 * les met en page. Toute la logique éditoriale tient dans un seul fichier,
 * celui des constats.
 *
 * L'ordre des sections traduit la règle de l'expert : ce qui coûte de l'argent
 * en premier, en trois constats maximum ; le reste après, clairement rangé
 * comme du second plan. Une section « notes internes » ferme le document — à
 * retirer avant transmission, c'est écrit dedans.
 */

import type { Finding, SiteAudit } from "./types.ts";

function sec(ms: number): string {
  return `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    return (u.pathname + u.search) || "/";
  } catch {
    return url;
  }
}

function scopeLine(f: Finding): string {
  if (f.scope === "site") return "Portée : ensemble du site.";
  if (f.systemic === true) {
    return `Portée : **systémique** — les ${f.pagesTested} pages lues sont concernées.`;
  }
  if (f.systemic === false) {
    return `Portée : **isolé** — ${f.pagesAffected} page(s) sur ${f.pagesTested} lues : ${f.pages
      .map(shortUrl)
      .join(", ")}.`;
  }
  if (f.pages.length > 0) {
    return `Page(s) concernée(s) : ${f.pages.map(shortUrl).join(", ")}.`;
  }
  return "Portée : ensemble du site.";
}

function renderCorps(findings: Finding[]): string {
  const corps = findings.filter((f) => f.destination === "corps");
  if (corps.length === 0) {
    return [
      "## Ce que ça vous coûte aujourd'hui",
      "",
      "Aucun constat de ce relevé ne se traduit par un coût publicitaire démontrable.",
      "C'est un résultat, pas un manque de données : les défauts relevés (voir annexe)",
      "sont réels mais n'ont pas de conséquence chiffrable sur la dépense.",
      "",
    ].join("\n");
  }

  const parts = ["## Ce que ça vous coûte aujourd'hui", ""];
  parts.push(
    `${corps.length} constat${corps.length > 1 ? "s" : ""} retenu${
      corps.length > 1 ? "s" : ""
    }, classé${corps.length > 1 ? "s" : ""} par coût décroissant. Les autres relevés sont en annexe.`
  );
  parts.push("");

  for (let i = 0; i < corps.length; i++) {
    const f = corps[i];
    parts.push(`### ${i + 1}. ${f.label}`);
    parts.push("");
    parts.push(`**Ce qui est constaté** — ${f.evidence}`);
    parts.push("");
    parts.push(`**Ce que ça vous coûte** — ${f.consequence}`);
    parts.push("");
    parts.push(
      `${scopeLine(f)} Gravité : ${f.severity}. Impact sur la dépense publicitaire : ${f.impactAds}.`
    );
    parts.push("");
  }
  return parts.join("\n");
}

function renderAdsLevels(audit: SiteAudit): string {
  const t = audit.tracking;
  if (!t) return "";
  const L = t.levels;
  const mark = (v: boolean | null) => (v === null ? "?" : v ? "oui" : "non");

  const rows = [
    `| 1 | Balise Google chargée | ${mark(L.googleTag.present)} | ${
      L.googleTag.evidence.join(", ") || "—"
    } |`,
    `| 2 | Identifiant annonceur Ads | ${mark(L.adsId.present)} | ${
      L.adsId.ids.join(", ") || "—"
    }${L.adsId.present ? ` (source : ${L.adsId.source.replace(/_/g, " ")})` : ""} |`,
    `| 3 | Conversion réellement définie | ${mark(L.conversionDefined.present)} | ${
      L.conversionDefined.evidence.join(" ; ") || L.conversionDefined.reason
    } |`,
    `| 4 | GA4 + Consent Mode + CMP | ${mark(
      L.consent.ga4Ids.length > 0 && L.consent.consentMode && L.consent.cmp.length > 0
    )} | GA4 : ${L.consent.ga4Ids.join(", ") || "aucun"} · Consent Mode : ${
      L.consent.consentMode ? "oui" : "non"
    } · CMP : ${L.consent.cmp.join(", ") || "aucune détectée"} |`,
  ];

  return [
    "## Mesure Google Ads, niveau par niveau",
    "",
    "Ce tableau existe pour une seule raison : aucun de ces niveaux ne dit rien tout seul.",
    "Ce qui compte est l'écart entre deux lignes voisines.",
    "",
    "| # | Niveau | Présent | Relevé |",
    "|---|--------|---------|--------|",
    rows.join("\n"),
    "",
    t.gtm.checked
      ? `Conteneur GTM : ${
          t.gtm.readable
            ? `${t.gtm.containerId} lu (${Math.round(t.gtm.bytes / 1024)} Ko), déclencheurs — envoi de formulaire : ${
                t.gtm.hasFormSubmitTrigger ? "oui" : "non"
              }, clic sur lien : ${t.gtm.hasLinkClickTrigger ? "oui" : "non"}, affichage d'élément : ${
                t.gtm.hasElementVisibilityTrigger ? "oui" : "non"
              }.`
            : `non lu — ${t.gtm.reason ?? "motif inconnu"}. Aucune conclusion tirée du conteneur.`
        }`
      : "Conteneur GTM : aucun identifiant GTM trouvé dans les pages lues.",
    "",
  ].join("\n");
}

function renderPagesRead(audit: SiteAudit): string {
  const ok = audit.pages.filter((p) => p.ok);
  const parts = ["## Ce que Google lit de vos pages", ""];
  parts.push(
    "Le texte exact du titre et du titre principal, tel qu'il est servi. C'est ce qui apparaît"
  );
  parts.push("dans les résultats de recherche et en haut de la page à l'arrivée d'un clic payant.");
  parts.push("");
  for (let i = 0; i < ok.length; i++) {
    const p = ok[i];
    parts.push(`**${shortUrl(p.finalUrl)}** _(${p.role}, HTTP ${p.status})_`);
    parts.push("");
    parts.push(`- Titre : ${p.title ? `« ${p.title} »` : "_absent_"}`);
    parts.push(
      `- Titre principal : ${
        p.h1Texts.length ? p.h1Texts.map((h) => `« ${h} »`).join(" · ") : "_aucun_"
      }`
    );
    parts.push("");
  }
  const failed = audit.pages.filter((p) => !p.ok);
  if (failed.length > 0) {
    parts.push("Pages demandées et non lues :");
    for (let i = 0; i < failed.length; i++) {
      parts.push(`- ${failed[i].requestedUrl} — ${failed[i].failureReason}`);
    }
    parts.push("");
  }
  return parts.join("\n");
}

function renderUnavailable(findings: Finding[]): string {
  const items = findings.filter((f) => f.status === "indisponible");
  if (items.length === 0) return "";
  const parts = ["## Mesures qui n'ont pas pu être faites", ""];
  parts.push(
    "Aucune de ces valeurs n'est estimée. Elles sont listées avec leur motif, et rien n'en est conclu."
  );
  parts.push("");
  for (let i = 0; i < items.length; i++) {
    parts.push(`- **${items[i].label}** — ${items[i].evidence}`);
  }
  parts.push("");
  return parts.join("\n");
}

function renderAnnexe(findings: Finding[]): string {
  const items = findings.filter((f) => f.destination === "annexe" && f.status !== "indisponible");
  if (items.length === 0) return "";
  const parts = ["## Annexe technique", ""];
  parts.push(
    "Constats réels, sans conséquence chiffrable sur la dépense publicitaire, ou écartés du corps"
  );
  parts.push("du rapport par le plafond de trois. Rien de ce qui suit ne justifie une décision.");
  parts.push("");
  for (let i = 0; i < items.length; i++) {
    const f = items[i];
    const flag =
      f.status === "conforme" ? "ok" : f.impactAds === "cosmetique" ? "cosmétique" : f.impactAds;
    parts.push(`- **${f.label}** _(${flag})_ — ${f.evidence}`);
    if (f.consequence) parts.push(`  - Conséquence : ${f.consequence}`);
  }
  parts.push("");
  return parts.join("\n");
}

function renderInternal(audit: SiteAudit): string {
  const parts = ["## Notes internes — chiffrage (à retirer avant transmission)", ""];
  for (let i = 0; i < audit.internalNotes.length; i++) {
    parts.push(`- **${audit.internalNotes[i].label}** — ${audit.internalNotes[i].detail}`);
  }
  parts.push("");
  parts.push(
    `Découverte des pages : ${audit.discovery.method.replace(/_/g, " ")} — ${audit.discovery.note}`
  );
  parts.push(
    `Requêtes émises vers le site : ${audit.requestsUsed} · durée totale ${sec(audit.elapsedMs)}`
  );
  parts.push("");
  parts.push("<details><summary>Journal des requêtes</summary>");
  parts.push("");
  parts.push("```");
  for (let i = 0; i < audit.trace.length; i++) parts.push(audit.trace[i]);
  parts.push("```");
  parts.push("");
  parts.push("</details>");
  parts.push("");
  return parts.join("\n");
}

export function renderReport(audit: SiteAudit): string {
  const head = [
    `# Relevé d'audit — ${audit.origin ?? audit.input}`,
    "",
    `Relevé automatique du ${new Date(audit.startedAt).toLocaleString("fr-FR")} · ${
      audit.pagesTested
    } page(s) lue(s) · vitesse mobile ${
      audit.speed.status === "mesure" ? "mesurée par Google" : "non disponible"
    }.`,
    "",
    "> Ce document est un relevé de faits, pas un diagnostic. Chaque valeur vient d'une mesure",
    "> effectuée sur le site ou d'une réponse de l'API Google ; aucune n'est estimée. Une mesure",
    "> qui échoue est listée comme indisponible, avec son motif.",
    "",
  ].join("\n");

  if (!audit.ok) {
    return [
      head,
      "## Relevé impossible",
      "",
      `Le site n'a pas pu être lu : \`${audit.failureReason ?? "motif inconnu"}\`.`,
      "",
      "Aucun constat n'est produit. À reprendre à la main.",
      "",
      "```",
      audit.trace.join("\n"),
      "```",
      "",
    ].join("\n");
  }

  return [
    head,
    renderCorps(audit.findings),
    renderAdsLevels(audit),
    renderPagesRead(audit),
    renderUnavailable(audit.findings),
    renderAnnexe(audit.findings),
    renderInternal(audit),
  ]
    .filter(Boolean)
    .join("\n");
}
