/**
 * Analyse HTML d'UNE page.
 *
 * Tout passe par cheerio, jamais par une regex sur le HTML brut. Deux bugs
 * bien réels justifient ce choix, tous deux relevés sur le script bash de
 * ~/.claude/skills/web-optimization :
 *
 *  - il doit aplatir le HTML sur une ligne et utiliser un motif non gourmand
 *    parce que les constructeurs de pages (Divi, Elementor) coupent les balises
 *    sur plusieurs lignes — ce qui faisait silencieusement remonter « 0 H1 »
 *    sur une page qui en avait onze ;
 *  - ses classes `[^"\x27]` sont interprétées par grep comme « ni " ni \ ni x
 *    ni 2 ni 7 » (\x27 n'est pas une échappée dans une classe POSIX). La meta
 *    description de www.mr-debarrasse.fr y est coupée à « Intervention »,
 *    juste avant « 7j/7 » : 106 caractères remontés au lieu de 152.
 *
 * Le comptage des images est lui aussi volontairement différent : sur
 * www.mr-debarrasse.fr, le grep trouve 38 <img> et cheerio 20 — les autres
 * sont des copies de repli enfermées dans des <noscript> (lazy-load). Un
 * parseur les ignore, comme le navigateur.
 */

import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { FetchOk } from "./fetcher.ts";
import { extractPageTracking } from "./tracking.ts";
import type { ContactPath, FormShape, GeoSignals, PageReport, PageRole } from "./types.ts";

export function emptyContactPath(): ContactPath {
  return {
    firstTelInHeader: false,
    firstTelBodyPercent: null,
    telLinks: 0,
    telNumbers: [],
    mailtoLinks: 0,
    whatsappLinks: 0,
    linksToContactPage: 0,
    forms: [],
  };
}

export function emptyGeo(): GeoSignals {
  return {
    postalCodesInText: [],
    jsonLdPostalAddress: [],
    jsonLdAreaServed: [],
    citiesMentioned: [],
  };
}

export function failedPage(
  role: PageRole,
  requestedUrl: string,
  reason: string,
  status: number | null
): PageReport {
  return {
    role,
    requestedUrl,
    finalUrl: requestedUrl,
    status: status ?? 0,
    ok: false,
    failureReason: reason,
    title: null,
    titleLength: 0,
    metaDescription: null,
    metaDescriptionLength: 0,
    h1Count: 0,
    h1Texts: [],
    canonical: null,
    canonicalResolved: null,
    robotsMeta: null,
    xRobotsTag: null,
    noindex: false,
    htmlLang: null,
    viewport: null,
    viewportBlocksZoom: false,
    jsonLdBlocks: 0,
    jsonLdTypes: [],
    images: { total: 0, noAlt: 0, emptyAlt: 0 },
    mixedContent: [],
    wordCount: 0,
    htmlBytes: 0,
    truncated: false,
    elapsedMs: 0,
    cms: { generator: null, fingerprints: [], server: null },
    contact: emptyContactPath(),
    geo: emptyGeo(),
    tracking: {
      googleTagLoaders: [],
      ga4Ids: [],
      universalAnalyticsIds: [],
      gtmIds: [],
      adsConversionIds: [],
      adsSendToPairs: [],
      adsSignals: [],
      otherAnalytics: [],
      metaPixel: false,
      consentPlatforms: [],
      consentModeInPage: false,
      callTrackingVendors: [],
      formVendors: [],
      telLinksWithInlineHandler: 0,
      inlineConversionEvents: [],
    },
  };
}

/** Liens sortants d'une page, pour la découverte des pages à analyser. */
export function collectHrefs(html: string, cap = 400): string[] {
  const $ = cheerio.load(html);
  const out: string[] = [];
  $("a[href]").each((_, el) => {
    if (out.length >= cap) return;
    const href = ($(el).attr("href") ?? "").trim();
    if (!href) return;
    if (href.charAt(0) === "#") return;
    const l = href.toLowerCase();
    if (l.indexOf("mailto:") === 0 || l.indexOf("tel:") === 0 || l.indexOf("javascript:") === 0) {
      return;
    }
    out.push(href);
  });
  return out;
}

// ── Chemin de contact ──────────────────────────────────────────────────────

/**
 * Un formulaire de recherche n'est pas un formulaire de contact. Les compter
 * ensemble ferait dire « 3 formulaires sur la page » alors qu'il n'y a qu'un
 * seul point de conversion — le genre d'imprécision qui décrédibilise le reste
 * du rapport.
 */
function isSearchForm($: CheerioAPI, el: never): boolean {
  const node = $(el);
  if ((node.attr("role") ?? "").toLowerCase() === "search") return true;
  const cls = (node.attr("class") ?? "").toLowerCase();
  const id = (node.attr("id") ?? "").toLowerCase();
  if (cls.indexOf("search") >= 0 || id.indexOf("search") >= 0) return true;
  if (node.find('input[type="search"]').length > 0) return true;
  const names = node
    .find("input[name]")
    .map((_, i) => ($(i).attr("name") ?? "").toLowerCase())
    .get();
  if (names.length > 0 && names.length <= 2) {
    for (let i = 0; i < names.length; i++) {
      if (names[i] === "s" || names[i] === "q" || names[i] === "search") return true;
    }
  }
  return false;
}

const NON_INPUT_TYPES = ["hidden", "submit", "button", "image", "reset"];

/**
 * Compte les champs qu'un visiteur doit RÉELLEMENT remplir. Les champs cachés
 * (jeton CSRF, pot de miel anti-spam, identifiant de formulaire) ne coûtent
 * rien au visiteur et gonfleraient artificiellement le constat.
 */
function describeForm($: CheerioAPI, el: never): FormShape {
  const node = $(el);
  const hint =
    node.attr("id") ||
    node.attr("name") ||
    (node.attr("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 2).join(" ") ||
    "formulaire sans identifiant";

  let visibleFields = 0;
  let requiredFields = 0;
  let hasFileUpload = false;
  const fieldNames: string[] = [];

  node.find("input, select, textarea").each((_, f) => {
    const field = $(f);
    const tag = (f as unknown as { tagName?: string }).tagName?.toLowerCase() ?? "";
    const type = (field.attr("type") ?? (tag === "input" ? "text" : tag)).toLowerCase();
    if (tag === "input" && NON_INPUT_TYPES.indexOf(type) >= 0) return;
    if (field.attr("hidden") !== undefined) return;
    if (/display\s*:\s*none|visibility\s*:\s*hidden/i.test(field.attr("style") ?? "")) return;

    if (type === "file") hasFileUpload = true;
    visibleFields++;
    if (field.attr("required") !== undefined || field.attr("aria-required") === "true") {
      requiredFields++;
    }
    const name = (field.attr("name") ?? field.attr("id") ?? type).slice(0, 40);
    if (fieldNames.indexOf(name) < 0 && fieldNames.length < 15) fieldNames.push(name);
  });

  return { hint: hint.slice(0, 60), visibleFields, requiredFields, hasFileUpload, fieldNames };
}

/**
 * Position du premier numéro cliquable.
 *
 * Le pourcentage est un rang dans l'ordre du document, pas une position en
 * pixels : impossible de mesurer une position à l'écran sans navigateur, et
 * inventer une valeur serait pire que de ne rien dire. Le rang documentaire
 * répond quand même à la vraie question — « faut-il faire défiler la page pour
 * trouver le numéro ? ». Le seuil de 15 % correspond à l'en-tête et au premier
 * bloc d'une page classique.
 */
function analyzeContactPath($: CheerioAPI): ContactPath {
  const out = emptyContactPath();

  const bodyElements = $("body *");
  const total = bodyElements.length;
  let firstTelIndex = -1;

  bodyElements.each((i, el) => {
    if (firstTelIndex >= 0) return;
    const node = $(el);
    const href = node.attr("href");
    if (!href) return;
    if (href.toLowerCase().indexOf("tel:") === 0) firstTelIndex = i;
  });

  const telNodes = $('a[href^="tel:"]');
  out.telLinks = telNodes.length;
  // Un href tel: peut être percent-encodé (`tel:%200680328833` sur un vrai
  // site) : sans décodage ni normalisation, le même numéro était compté deux
  // fois et affiché tel quel dans le rapport, ce qui donne l'air de ne pas
  // savoir lire une page.
  const telSeen: Record<string, true> = {};
  telNodes.each((_, el) => {
    let raw = ($(el).attr("href") ?? "").replace(/^tel:/i, "").trim();
    try {
      raw = decodeURIComponent(raw);
    } catch {
      /* encodage invalide : on garde la valeur brute */
    }
    raw = raw.trim();
    const key = raw.replace(/[\s.()\- ]/g, "");
    if (!key || telSeen[key]) return;
    telSeen[key] = true;
    if (out.telNumbers.length < 6) out.telNumbers.push(raw);
  });

  if (firstTelIndex >= 0 && total > 0) {
    out.firstTelBodyPercent = Math.round((firstTelIndex / total) * 1000) / 10;
    const first = $(bodyElements.get(firstTelIndex) as never);
    const inHeaderTag = first.closest("header, [role=banner]").length > 0;
    const inHeaderClass =
      first.closest('[class*="header"], [class*="topbar"], [class*="top-bar"], [id*="header"]')
        .length > 0;
    out.firstTelInHeader = inHeaderTag || inHeaderClass;
  }

  out.mailtoLinks = $('a[href^="mailto:"]').length;

  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") ?? "").toLowerCase();
    if (href.indexOf("wa.me/") >= 0 || href.indexOf("api.whatsapp.com") >= 0 || href.indexOf("whatsapp://") === 0) {
      out.whatsappLinks++;
    }
    // Le mot-clé n'est pas forcément collé au slash. Sur un vrai site,
    // l'unique page de conversion s'appelle
    // « /deplacements-et-devis-gratuits-7j-7/ » : exiger `/devis` faisait
    // rapporter « 0 lien vers une page contact/devis » alors qu'il y en avait.
    if (/(contact|devis|estimation|nous-joindre|rappel)/.test(href)) {
      out.linksToContactPage++;
    }
  });

  $("form").each((_, el) => {
    if (isSearchForm($, el as never)) return;
    if (out.forms.length >= 8) return;
    out.forms.push(describeForm($, el as never));
  });

  return out;
}

// ── Cohérence géographique ─────────────────────────────────────────────────

/**
 * Un code postal français isolé (`\d{5}`) est un très mauvais signal : un prix,
 * un numéro de SIRET ou un téléphone collé y répondent. On exige donc un code
 * postal SUIVI d'un nom de commune capitalisé — la forme d'une adresse réelle.
 * Faux négatifs possibles (adresse sur deux lignes), assumés : mieux vaut ne
 * rien affirmer que d'affirmer faux.
 */
const RE_POSTAL_CITY = /\b(0[1-9]|[1-8]\d|9[0-8])\d{3}\b[  ,-]+([A-ZÀ-ÝŒ][A-Za-zÀ-ÿŒœ'’-]{2,}(?:[ -][A-ZÀ-ÝŒ][A-Za-zÀ-ÿŒœ'’-]{2,}){0,3})/g;

function walkJsonLd(
  node: unknown,
  geo: { addresses: string[]; areas: string[]; localities: string[] },
  depth = 0
): void {
  if (depth > 8 || node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) walkJsonLd(node[i], geo, depth + 1);
    return;
  }
  const obj = node as Record<string, unknown>;
  const type = obj["@type"];
  const typeStr = Array.isArray(type) ? type.join(",") : typeof type === "string" ? type : "";

  if (typeStr.indexOf("PostalAddress") >= 0) {
    const parts: string[] = [];
    for (const k of ["streetAddress", "postalCode", "addressLocality", "addressRegion"]) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) parts.push(v.trim());
    }
    const joined = parts.join(" ").slice(0, 120);
    if (joined && geo.addresses.indexOf(joined) < 0 && geo.addresses.length < 6) {
      geo.addresses.push(joined);
    }
    // La commune déclarée est un candidat au comptage : sans ça, un site dont
    // l'adresse ne vit que dans le JSON-LD (donc hors du texte du <body>)
    // ressortait avec « communes citées : aucune ».
    const loc = obj["addressLocality"];
    if (typeof loc === "string" && loc.trim()) {
      const s = loc.trim().slice(0, 60);
      if (geo.localities.indexOf(s) < 0 && geo.localities.length < 10) geo.localities.push(s);
    }
  }

  const area = obj["areaServed"];
  const pushArea = (v: unknown) => {
    if (typeof v === "string" && v.trim()) {
      const s = v.trim().slice(0, 80);
      if (geo.areas.indexOf(s) < 0 && geo.areas.length < 20) geo.areas.push(s);
    } else if (v && typeof v === "object") {
      const name = (v as Record<string, unknown>)["name"];
      if (typeof name === "string" && name.trim()) {
        const s = name.trim().slice(0, 80);
        if (geo.areas.indexOf(s) < 0 && geo.areas.length < 20) geo.areas.push(s);
      }
    }
  };
  if (Array.isArray(area)) for (let i = 0; i < area.length; i++) pushArea(area[i]);
  else if (area !== undefined) pushArea(area);

  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const v = obj[keys[i]];
    if (v !== null && typeof v === "object") walkJsonLd(v, geo, depth + 1);
  }
}

function analyzeGeo(bodyText: string, jsonLdRaw: string[]): GeoSignals {
  const out = emptyGeo();

  const re = new RegExp(RE_POSTAL_CITY.source, "g");
  let m: RegExpExecArray | null;
  let guard = 0;
  const cityCandidates: string[] = [];
  while ((m = re.exec(bodyText)) !== null && guard++ < 500) {
    const full = m[0].replace(/\s+/g, " ").trim();
    if (out.postalCodesInText.indexOf(full) < 0 && out.postalCodesInText.length < 12) {
      out.postalCodesInText.push(full);
    }
    if (cityCandidates.indexOf(m[2]) < 0) cityCandidates.push(m[2]);
  }

  const acc = { addresses: [] as string[], areas: [] as string[], localities: [] as string[] };
  for (let i = 0; i < jsonLdRaw.length; i++) {
    try {
      walkJsonLd(JSON.parse(jsonLdRaw[i]), acc);
    } catch {
      // Bloc JSON-LD invalide : fréquent, et sans conséquence ici.
    }
  }
  out.jsonLdPostalAddress = acc.addresses;
  out.jsonLdAreaServed = acc.areas;

  const extra = acc.areas.concat(acc.localities);
  for (let i = 0; i < extra.length; i++) {
    if (cityCandidates.indexOf(extra[i]) < 0) cityCandidates.push(extra[i]);
  }

  const lowerText = bodyText.toLowerCase();
  for (let i = 0; i < cityCandidates.length && out.citiesMentioned.length < 15; i++) {
    const name = cityCandidates[i];
    const needle = name.toLowerCase();
    let count = 0;
    let from = 0;
    for (;;) {
      const at = lowerText.indexOf(needle, from);
      if (at < 0) break;
      count++;
      from = at + needle.length;
      if (count > 200) break;
    }
    out.citiesMentioned.push({ name, occurrences: count });
  }
  out.citiesMentioned.sort((a, b) => b.occurrences - a.occurrences);

  return out;
}

// ── Analyse complète ───────────────────────────────────────────────────────

export function analyzePage(role: PageRole, res: FetchOk): PageReport {
  const html = res.body;
  const $ = cheerio.load(html);
  const lower = html.toLowerCase();

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[name="Description"]').attr("content")?.trim() ||
    null;
  const generator = $('meta[name="generator"]').attr("content")?.trim() || null;
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;

  let canonicalResolved: string | null = null;
  if (canonical) {
    try {
      canonicalResolved = new URL(canonical, res.finalUrl).toString();
    } catch {
      canonicalResolved = null;
    }
  }

  // noindex peut venir de la balise meta OU de l'en-tête HTTP X-Robots-Tag.
  // Ne regarder que la balise fait passer à côté des blocages posés au niveau
  // serveur — cas classique d'une préproduction laissée en ligne.
  const robotsMeta =
    $('meta[name="robots"]').attr("content")?.trim() ||
    $('meta[name="googlebot"]').attr("content")?.trim() ||
    null;
  const xRobotsTag = res.headers["x-robots-tag"] ?? null;
  const noindex = /noindex/i.test(robotsMeta ?? "") || /noindex/i.test(xRobotsTag ?? "");

  const h1Texts = $("h1")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);

  const viewport = $('meta[name="viewport"]').attr("content")?.trim() || null;
  const viewportBlocksZoom = viewport
    ? /user-scalable\s*=\s*(no|0)/i.test(viewport) ||
      /maximum-scale\s*=\s*(1(\.0+)?|0?\.\d+)\b/i.test(viewport)
    : false;

  const ldNodes = $('script[type="application/ld+json"]');
  const jsonLdRaw: string[] = [];
  const jsonLdTypes: string[] = [];
  ldNodes.each((_, el) => {
    const txt = $(el).contents().text();
    jsonLdRaw.push(txt);
    try {
      collectTypes(JSON.parse(txt), jsonLdTypes);
    } catch {
      const re = /"@type"\s*:\s*"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(txt)) !== null) {
        if (jsonLdTypes.indexOf(m[1]) < 0) jsonLdTypes.push(m[1]);
      }
    }
  });

  const imgs = $("img");
  let emptyAlt = 0;
  let noAlt = 0;
  imgs.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined) noAlt++;
    else if (alt.trim() === "") emptyAlt++;
  });

  // Contenu mixte : ne se pose que si la page finale est servie en https.
  const mixed: string[] = [];
  if (res.finalUrl.protocol === "https:") {
    $("[src], [href]").each((_, el) => {
      const attrs = ["src", "href"] as const;
      for (let i = 0; i < attrs.length; i++) {
        const v = $(el).attr(attrs[i]);
        if (v && v.toLowerCase().indexOf("http://") === 0 && mixed.indexOf(v) < 0 && mixed.length < 20) {
          mixed.push(v);
        }
      }
    });
  }

  const fingerprints: string[] = [];
  const addFp = (name: string) => {
    if (fingerprints.indexOf(name) < 0) fingerprints.push(name);
  };
  if (lower.indexOf("/wp-content/") >= 0 || lower.indexOf("/wp-includes/") >= 0) addFp("WordPress");
  if (lower.indexOf("/wp-content/themes/divi") >= 0) addFp("Divi");
  if (lower.indexOf("elementor") >= 0) addFp("Elementor");
  if (lower.indexOf("yoast") >= 0) addFp("Yoast SEO");
  if (lower.indexOf("rank-math") >= 0 || lower.indexOf("rankmath") >= 0) addFp("Rank Math");
  if (lower.indexOf("cdn.shopify.com") >= 0 || lower.indexOf("shopify") >= 0) addFp("Shopify");
  if (lower.indexOf("wix.com") >= 0 || lower.indexOf("wixstatic") >= 0) addFp("Wix");
  if (lower.indexOf("webflow") >= 0) addFp("Webflow");
  if (lower.indexOf("squarespace") >= 0) addFp("Squarespace");
  if (lower.indexOf("prestashop") >= 0) addFp("PrestaShop");
  if (lower.indexOf("woocommerce") >= 0) addFp("WooCommerce");

  // Volume de contenu : le texte du <body>, scripts et styles retirés.
  const bodyClone = cheerio.load(html);
  bodyClone("script, style, noscript, template").remove();
  const textContent = bodyClone("body").text().replace(/\s+/g, " ").trim();
  const wordCount = textContent ? textContent.split(" ").length : 0;

  return {
    role,
    requestedUrl: res.requestedUrl,
    finalUrl: res.finalUrl.toString(),
    status: res.status,
    ok: true,
    failureReason: null,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1Count: $("h1").length,
    h1Texts: h1Texts.slice(0, 12),
    canonical,
    canonicalResolved,
    robotsMeta,
    xRobotsTag,
    noindex,
    htmlLang: $("html").attr("lang")?.trim() || null,
    viewport,
    viewportBlocksZoom,
    jsonLdBlocks: ldNodes.length,
    jsonLdTypes: jsonLdTypes.slice(0, 20),
    images: { total: imgs.length, noAlt, emptyAlt },
    mixedContent: mixed.slice(0, 15),
    wordCount,
    htmlBytes: res.bytes,
    truncated: res.truncated,
    elapsedMs: res.elapsedMs,
    cms: { generator, fingerprints, server: res.headers["server"] ?? null },
    contact: analyzeContactPath($),
    geo: analyzeGeo(textContent, jsonLdRaw),
    tracking: extractPageTracking(html, $),
  };
}

/**
 * Un @type peut être une chaîne, un tableau, ou niché n'importe où : @graph,
 * mais aussi `address` (PostalAddress), `contactPoint` (ContactPoint),
 * `potentialAction` (SearchAction)… Restreindre la descente à une liste de
 * clés connues en avait manqué trois sur un vrai bloc Yoast.
 */
function collectTypes(node: unknown, out: string[], depth = 0) {
  if (depth > 8 || node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) collectTypes(node[i], out, depth + 1);
    return;
  }
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") {
    if (out.indexOf(t) < 0) out.push(t);
  } else if (Array.isArray(t)) {
    for (let i = 0; i < t.length; i++) {
      const x = t[i];
      if (typeof x === "string" && out.indexOf(x) < 0) out.push(x);
    }
  }
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === "@type") continue;
    const v = obj[keys[i]];
    if (v !== null && typeof v === "object") collectTypes(v, out, depth + 1);
  }
}
