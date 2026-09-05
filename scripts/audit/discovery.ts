/**
 * robots.txt, sitemap, redirection http→https, et choix des pages à analyser.
 *
 * Pourquoi plusieurs pages : passer de 1 à 3-4 pages suffit à distinguer un
 * défaut ISOLÉ d'un défaut SYSTÉMIQUE, ce qui change tout dans un rapport
 * (« votre page contact n'a pas de title » ≠ « aucune de vos pages n'a de
 * title »). Au-delà, le gain de conclusion est marginal et le coût pour le
 * serveur du prospect augmente linéairement.
 *
 * Les pages visées sont choisies pour leur valeur commerciale : contact,
 * devis, services, tarifs. Ce sont les pages d'atterrissage naturelles d'une
 * campagne Google Ads — donc celles dont les défauts coûtent de l'argent.
 */

import type { Crawler } from "./fetcher.ts";
import { LIMITS } from "./fetcher.ts";
import type { HttpRedirectReport, RobotsReport, SitemapReport } from "./types.ts";

// ── robots.txt ─────────────────────────────────────────────────────────────

type RobotsGroup = {
  agents: string[];
  disallow: string[];
  allow: string[];
  crawlDelay: number | null;
};

function parseRobots(text: string): { groups: RobotsGroup[]; sitemaps: string[] } {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let lastLineWasAgent = false;

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length && i < 5000; i++) {
    const line = lines[i].replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === "user-agent") {
      if (!current || !lastLineWasAgent) {
        current = { agents: [], disallow: [], allow: [], crawlDelay: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastLineWasAgent = true;
      continue;
    }
    lastLineWasAgent = false;
    if (field === "sitemap") {
      if (value && sitemaps.indexOf(value) < 0 && sitemaps.length < 20) sitemaps.push(value);
      continue;
    }
    if (!current) continue;
    if (field === "disallow" && current.disallow.length < 200) current.disallow.push(value);
    if (field === "allow" && current.allow.length < 200) current.allow.push(value);
    if (field === "crawl-delay") {
      const d = Number(value.replace(",", "."));
      if (isFinite(d) && d > 0) current.crawlDelay = d;
    }
  }
  return { groups, sitemaps };
}

/**
 * Sélectionne le groupe applicable à un robot donné.
 * Règle Google : un groupe nommé l'emporte sur `*`. Cas particulier important
 * ici — AdsBot-Google IGNORE `User-agent: *`. Un site avec
 * `User-agent: * / Disallow: /` ne bloque donc PAS les annonces, et affirmer
 * le contraire dans un audit serait faux.
 */
function groupFor(
  groups: RobotsGroup[],
  agent: string,
  fallbackToStar: boolean
): RobotsGroup | null {
  const a = agent.toLowerCase();
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].agents.indexOf(a) >= 0) return groups[i];
  }
  if (!fallbackToStar) return null;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].agents.indexOf("*") >= 0) return groups[i];
  }
  return null;
}

/** Correspondance de chemin robots.txt : préfixe, avec `*` et `$`. */
function ruleMatches(rule: string, path: string): boolean {
  if (rule === "") return false;
  const anchored = rule.endsWith("$");
  const body = anchored ? rule.slice(0, -1) : rule;
  const parts = body.split("*");
  let pos = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === "") continue;
    const found = i === 0 ? (path.indexOf(part) === 0 ? 0 : -1) : path.indexOf(part, pos);
    if (found < 0) return false;
    pos = found + part.length;
  }
  if (anchored) return pos === path.length;
  return true;
}

/** Règle Google : la règle la plus longue gagne ; à égalité, Allow gagne. */
function isDisallowed(group: RobotsGroup | null, path: string): boolean {
  if (!group) return false;
  let bestDisallow = -1;
  let bestAllow = -1;
  for (let i = 0; i < group.disallow.length; i++) {
    if (ruleMatches(group.disallow[i], path)) {
      bestDisallow = Math.max(bestDisallow, group.disallow[i].length);
    }
  }
  for (let i = 0; i < group.allow.length; i++) {
    if (ruleMatches(group.allow[i], path)) {
      bestAllow = Math.max(bestAllow, group.allow[i].length);
    }
  }
  if (bestDisallow < 0) return false;
  return bestDisallow > bestAllow;
}

/**
 * Renvoie le rapport ET le corps brut : le corps sert une seconde fois, plus
 * tard, pour tester si les pages découvertes sont bloquées — et les pages ne
 * sont connues qu'après la lecture du robots.txt.
 */
export async function fetchRobots(
  crawler: Crawler,
  origin: URL
): Promise<{ report: RobotsReport; raw: string | null }> {
  const url = new URL("/robots.txt", origin);
  const base: RobotsReport = {
    status: "absent",
    url: url.toString(),
    httpStatus: null,
    reason: null,
    disallowRules: [],
    blocksEverything: false,
    blocksAdsBot: false,
    adsBotGroupPresent: false,
    sitemapUrls: [],
    crawlDelaySeconds: null,
    blockedAnalyzedPages: [],
  };

  const res = await crawler.get(url, {
    maxBytes: LIMITS.MAX_TEXT_BYTES,
    timeoutMs: LIMITS.SMALL_TIMEOUT_MS,
    accept: "text/plain,*/*",
  });

  if (!res.ok) {
    return { report: { ...base, status: "indisponible", reason: res.reason }, raw: null };
  }
  base.httpStatus = res.status;
  if (res.status !== 200) {
    return {
      report: {
        ...base,
        status: res.status === 404 || res.status === 410 ? "absent" : "indisponible",
        reason: `HTTP ${res.status}`,
      },
      raw: null,
    };
  }
  // Beaucoup d'hébergeurs servent la page 404 HTML en 200 sur /robots.txt.
  const looksHtml = res.contentType.indexOf("html") >= 0 || /^\s*<(!doctype|html)/i.test(res.body);
  if (looksHtml) {
    return {
      report: {
        ...base,
        status: "absent",
        reason: "réponse HTML servie à la place d'un robots.txt",
      },
      raw: null,
    };
  }

  const parsed = parseRobots(res.body);
  const googlebot = groupFor(parsed.groups, "googlebot", true);
  const adsbot = groupFor(parsed.groups, "adsbot-google", false);

  return {
    report: {
      ...base,
      status: "present",
      disallowRules: googlebot ? googlebot.disallow.slice(0, 40) : [],
      blocksEverything: isDisallowed(googlebot, "/"),
      adsBotGroupPresent: adsbot !== null,
      blocksAdsBot: adsbot !== null && isDisallowed(adsbot, "/"),
      sitemapUrls: parsed.sitemaps,
      crawlDelaySeconds: googlebot?.crawlDelay ?? null,
      blockedAnalyzedPages: [],
    },
    raw: res.body,
  };
}

/** Marque les pages analysées que robots.txt interdit à Googlebot. */
export function markBlockedPages(
  report: RobotsReport,
  rawRobots: string | null,
  pageUrls: string[]
): void {
  if (report.status !== "present" || !rawRobots) return;
  const parsed = parseRobots(rawRobots);
  const googlebot = groupFor(parsed.groups, "googlebot", true);
  const blocked: string[] = [];
  for (let i = 0; i < pageUrls.length; i++) {
    try {
      const u = new URL(pageUrls[i]);
      if (isDisallowed(googlebot, u.pathname + u.search)) blocked.push(pageUrls[i]);
    } catch {
      /* URL non analysable : on ne conclut rien */
    }
  }
  report.blockedAnalyzedPages = blocked;
}

// ── http:// redirige-t-il vers https:// ? ──────────────────────────────────

/**
 * Contrôle invisible depuis la page https : on interroge explicitement
 * http://domaine/ SANS suivre la redirection, et on regarde l'en-tête
 * Location. Un site qui répond 200 en http:// sert deux versions du même
 * contenu — Google en indexe une, les annonces pointent sur l'autre, et le
 * navigateur affiche « non sécurisé » au moment du formulaire.
 */
export async function checkHttpRedirect(
  crawler: Crawler,
  origin: URL
): Promise<HttpRedirectReport> {
  const from = `http://${origin.host}/`;
  if (origin.protocol !== "https:") {
    return {
      status: "non_teste",
      from,
      to: null,
      httpStatus: null,
      reason: "le site lui-même n'est pas servi en https",
    };
  }

  const res = await crawler.get(new URL(from), {
    maxBytes: 200_000,
    timeoutMs: LIMITS.SMALL_TIMEOUT_MS,
    noFollow: true,
  });

  if (!res.ok) {
    return { status: "injoignable", from, to: null, httpStatus: null, reason: res.reason };
  }
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers["location"] ?? null;
    let target: string | null = loc;
    try {
      if (loc) target = new URL(loc, from).toString();
    } catch {
      /* Location non analysable : on garde la valeur brute */
    }
    const toHttps = target !== null && target.toLowerCase().indexOf("https://") === 0;
    return {
      status: toHttps ? "redirige" : "ne_redirige_pas",
      from,
      to: target,
      httpStatus: res.status,
      reason: toHttps ? null : "redirection qui ne mène pas en https",
    };
  }
  return {
    status: "ne_redirige_pas",
    from,
    to: null,
    httpStatus: res.status,
    reason: `HTTP ${res.status} servi directement en http://`,
  };
}

// ── sitemap ────────────────────────────────────────────────────────────────

function extractLocs(xml: string, cap: number): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<\s][^<]*?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null && out.length < cap) {
    out.push(m[1].replace(/&amp;/g, "&").trim());
  }
  return out;
}

/** Compte TOUTES les occurrences de <loc>, même au-delà du plafond d'échantillon. */
function countLocs(xml: string): number {
  const m = xml.match(/<loc>/gi);
  return m ? m.length : 0;
}

export async function fetchSitemap(
  crawler: Crawler,
  origin: URL,
  robots: RobotsReport
): Promise<{ report: SitemapReport; urls: string[] }> {
  const empty: SitemapReport = {
    status: "absent",
    url: null,
    source: null,
    httpStatus: null,
    reason: null,
    isIndex: false,
    declaredUrls: 0,
    sampleUrls: [],
  };

  // Priorité au sitemap déclaré dans robots.txt : c'est celui que Google lit.
  let target: URL | null = null;
  let source: SitemapReport["source"] = null;
  for (let i = 0; i < robots.sitemapUrls.length; i++) {
    try {
      const u = new URL(robots.sitemapUrls[i]);
      // Un sitemap déclaré sur un AUTRE hôte ne doit pas nous y emmener.
      if (u.hostname.toLowerCase() !== origin.hostname.toLowerCase()) continue;
      if (/\.gz$/i.test(u.pathname)) continue; // gzip : non lisible ici, on ne devine pas
      target = u;
      source = "robots.txt";
      break;
    } catch {
      /* déclaration invalide, on passe */
    }
  }
  if (!target) {
    target = new URL("/sitemap.xml", origin);
    source = "chemin_standard";
  }

  const res = await crawler.get(target, {
    maxBytes: LIMITS.MAX_TEXT_BYTES,
    timeoutMs: LIMITS.SMALL_TIMEOUT_MS,
    accept: "application/xml,text/xml,*/*",
  });

  if (!res.ok) {
    return {
      report: {
        ...empty,
        status: "indisponible",
        url: target.toString(),
        source,
        reason: res.reason,
      },
      urls: [],
    };
  }
  if (res.status !== 200) {
    return {
      report: {
        ...empty,
        status: res.status === 404 || res.status === 410 ? "absent" : "indisponible",
        url: target.toString(),
        source,
        httpStatus: res.status,
        reason: `HTTP ${res.status}`,
      },
      urls: [],
    };
  }
  if (res.body.indexOf("<loc>") < 0 && res.body.indexOf("<LOC>") < 0) {
    return {
      report: {
        ...empty,
        status: "absent",
        url: target.toString(),
        source,
        httpStatus: res.status,
        reason: "réponse sans balise <loc> (probablement une page HTML)",
      },
      urls: [],
    };
  }

  const isIndex = /<sitemapindex/i.test(res.body);
  const locs = extractLocs(res.body, 300);
  const total = countLocs(res.body);

  if (!isIndex) {
    return {
      report: {
        status: "present",
        url: target.toString(),
        source,
        httpStatus: res.status,
        reason: null,
        isIndex: false,
        declaredUrls: total,
        sampleUrls: locs.slice(0, 25),
      },
      urls: locs,
    };
  }

  // Index : une seule descente, sur le premier sitemap enfant du même hôte.
  let child: URL | null = null;
  for (let i = 0; i < locs.length; i++) {
    try {
      const u = new URL(locs[i]);
      if (u.hostname.toLowerCase() === origin.hostname.toLowerCase() && !/\.gz$/i.test(u.pathname)) {
        child = u;
        break;
      }
    } catch {
      /* ignore */
    }
  }

  const indexReport: SitemapReport = {
    status: "present",
    url: target.toString(),
    source,
    httpStatus: res.status,
    reason: null,
    isIndex: true,
    declaredUrls: total,
    sampleUrls: locs.slice(0, 25),
  };

  if (!child || crawler.exhausted()) return { report: indexReport, urls: [] };

  const childRes = await crawler.get(child, {
    maxBytes: LIMITS.MAX_TEXT_BYTES,
    timeoutMs: LIMITS.SMALL_TIMEOUT_MS,
    accept: "application/xml,text/xml,*/*",
  });
  if (!childRes.ok || childRes.status !== 200) return { report: indexReport, urls: [] };

  const childLocs = extractLocs(childRes.body, 300);
  indexReport.sampleUrls = childLocs.slice(0, 25);
  return { report: indexReport, urls: childLocs };
}

// ── choix des pages à analyser ─────────────────────────────────────────────

/**
 * Mots-clés commerciaux, du plus au moins prioritaire. Une page « contact » ou
 * « devis » est là où se joue la conversion d'un clic payant : c'est celle dont
 * un défaut se traduit directement en budget perdu.
 */
const PRIORITY: Array<{ score: number; needles: string[] }> = [
  { score: 100, needles: ["/contact", "contactez", "nous-contacter"] },
  { score: 95, needles: ["/devis", "demande-de-devis", "demander-un-devis", "estimation", "quote"] },
  { score: 85, needles: ["/tarif", "/prix", "/pricing", "/nos-tarifs"] },
  { score: 75, needles: ["/service", "/prestation", "/nos-services", "/savoir-faire", "/solutions"] },
  { score: 60, needles: ["/produit", "/boutique", "/shop", "/catalogue"] },
  { score: 45, needles: ["/realisation", "/portfolio", "/references", "/avis", "/temoignage"] },
  { score: 30, needles: ["/a-propos", "/qui-sommes-nous", "/about", "/equipe"] },
];

const EXCLUDED_EXT =
  /\.(pdf|jpe?g|png|gif|webp|avif|svg|zip|rar|mp4|mp3|docx?|xlsx?|pptx?|css|js|ico|xml|txt)$/i;

const EXCLUDED_PATH =
  /\/(wp-admin|wp-json|wp-login|feed|tag|category|author|cart|panier|checkout|mon-compte|my-account|connexion|login|cgv|cgu|mentions-legales|politique|confidentialite|privacy|plan-du-site|sitemap)(\/|$)/i;

function scorePath(pathname: string): number {
  const p = pathname.toLowerCase();
  for (let i = 0; i < PRIORITY.length; i++) {
    for (let j = 0; j < PRIORITY[i].needles.length; j++) {
      if (p.indexOf(PRIORITY[i].needles[j]) >= 0) return PRIORITY[i].score;
    }
  }
  // À défaut de mot-clé, une page peu profonde vaut mieux qu'une page enfouie.
  const depth = p.split("/").filter(Boolean).length;
  return depth === 1 ? 15 : depth === 2 ? 8 : 3;
}

export type Candidate = { url: URL; score: number };

function collectCandidates(rawUrls: string[], origin: URL, homepagePath: string): Candidate[] {
  const seen: Record<string, true> = {};
  const out: Candidate[] = [];
  for (let i = 0; i < rawUrls.length && i < 600; i++) {
    let u: URL;
    try {
      u = new URL(rawUrls[i], origin);
    } catch {
      continue;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") continue;
    // Même hôte obligatoire : un lien sortant n'est pas le site du prospect, et
    // le suivre transformerait l'audit en crawler de tiers.
    if (u.hostname.toLowerCase() !== origin.hostname.toLowerCase()) continue;
    u.hash = "";
    const path = u.pathname;
    if (path === "/" || path === homepagePath) continue;
    if (EXCLUDED_EXT.test(path)) continue;
    if (EXCLUDED_PATH.test(path)) continue;
    const key = path.replace(/\/+$/, "") || "/";
    if (seen[key]) continue;
    seen[key] = true;
    out.push({ url: u, score: scorePath(path) });
  }
  out.sort((a, b) => b.score - a.score || a.url.pathname.length - b.url.pathname.length);
  return out;
}

export function pickPages(
  rawUrls: string[],
  origin: URL,
  homepagePath: string,
  max: number
): Candidate[] {
  return collectCandidates(rawUrls, origin, homepagePath).slice(0, max);
}

export function countCandidates(rawUrls: string[], origin: URL, homepagePath: string): number {
  return collectCandidates(rawUrls, origin, homepagePath).length;
}
