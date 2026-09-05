/**
 * Orchestration d'un audit complet.
 *
 * Ordre des opérations, et pourquoi :
 *   1. page d'accueil — si elle ne répond pas, rien d'autre n'a de sens ;
 *   2. PageSpeed lancé en parallèle dès que l'URL finale est connue. Un run
 *      Lighthouse distant prend 15 à 40 s ; le faire pendant la lecture des
 *      autres pages évite d'additionner les deux durées. Cet appel ne touche
 *      pas le serveur du prospect, il touche l'API Google ;
 *   3. robots.txt, puis sitemap (le sitemap déclaré dans robots.txt prime) ;
 *   4. choix et lecture des pages internes à valeur commerciale ;
 *   5. conteneur GTM, une seule fois, avec l'identifiant vu dans les pages ;
 *   6. redirection http→https ;
 *   7. assemblage des constats.
 *
 * Toutes les requêtes vers le site du prospect passent par un seul Crawler,
 * qui porte le délai inter-requêtes, le plafond de requêtes et le budget de
 * temps. Il n'existe aucun autre chemin sortant.
 */

import { Crawler, LIMITS, toHomepageUrl } from "./fetcher.ts";
import {
  checkHttpRedirect,
  countCandidates,
  fetchRobots,
  fetchSitemap,
  markBlockedPages,
  pickPages,
} from "./discovery.ts";
import { analyzePage, collectHrefs, failedPage } from "./page.ts";
import { fetchPageSpeed, speedUnavailable } from "./pagespeed.ts";
import { buildTrackingReport, emptyGtmReport, parseGtmContainer } from "./tracking.ts";
import { buildFindings, internalNotes } from "./findings.ts";
import type {
  GtmContainerReport,
  PageReport,
  SiteAudit,
  SpeedReport,
  TrackingReport,
} from "./types.ts";

export type RunOptions = {
  /** Pages internes lues EN PLUS de l'accueil. */
  maxExtraPages: number;
  /** false = aucun appel à l'API Google (mode hors ligne / sans clé). */
  pagespeed: boolean;
};

export const DEFAULT_OPTIONS: RunOptions = { maxExtraPages: 3, pagespeed: true };

function emptyAudit(input: string, reason: string, trace: string[], started: number): SiteAudit {
  return {
    ok: false,
    input,
    origin: null,
    failureReason: reason,
    startedAt: new Date(started).toISOString(),
    pages: [],
    pagesTested: 0,
    discovery: { method: "aucune", candidatesConsidered: 0, note: "audit interrompu" },
    robots: {
      status: "indisponible",
      url: "",
      httpStatus: null,
      reason: "audit interrompu",
      disallowRules: [],
      blocksEverything: false,
      blocksAdsBot: false,
      adsBotGroupPresent: false,
      sitemapUrls: [],
      crawlDelaySeconds: null,
      blockedAnalyzedPages: [],
    },
    sitemap: {
      status: "indisponible",
      url: null,
      source: null,
      httpStatus: null,
      reason: "audit interrompu",
      isIndex: false,
      declaredUrls: 0,
      sampleUrls: [],
    },
    httpRedirect: {
      status: "non_teste",
      from: "",
      to: null,
      httpStatus: null,
      reason: "audit interrompu",
    },
    tracking: null,
    speed: speedUnavailable("audit interrompu avant la mesure"),
    findings: [],
    internalNotes: [],
    requestsUsed: 0,
    trace,
    elapsedMs: Date.now() - started,
  };
}

/**
 * Lit le conteneur GTM public. Google le sert à tout le monde : aucune donnée
 * privée n'est touchée, et c'est le seul moyen honnête de savoir si une
 * conversion est configurée quand elle ne laisse aucune trace dans la page.
 */
async function fetchGtm(crawler: Crawler, containerId: string): Promise<GtmContainerReport> {
  const empty = emptyGtmReport();
  const url = new URL(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`);
  const res = await crawler.get(url, {
    maxBytes: LIMITS.MAX_SCRIPT_BYTES,
    timeoutMs: LIMITS.PAGE_TIMEOUT_MS,
    accept: "application/javascript,text/javascript,*/*",
    // googletagmanager.com n'est pas le serveur du prospect.
    noThrottle: true,
  });

  if (!res.ok) {
    return { ...empty, checked: true, containerId, reason: res.reason };
  }
  if (res.status !== 200) {
    return { ...empty, checked: true, containerId, reason: `HTTP ${res.status}` };
  }
  if (res.body.length < 500) {
    return {
      ...empty,
      checked: true,
      containerId,
      reason: "conteneur vide ou non publié",
      bytes: res.bytes,
    };
  }
  return parseGtmContainer(res.body, containerId, res.bytes);
}

export async function auditSite(
  input: string,
  options: RunOptions = DEFAULT_OPTIONS
): Promise<SiteAudit> {
  const started = Date.now();
  const crawler = new Crawler();

  const home = toHomepageUrl(input);
  if (!home) return emptyAudit(input, "url_invalide", ["entrée non analysable"], started);

  // ── 1. Page d'accueil ────────────────────────────────────────────────────
  const homeRes = await crawler.get(home, { timeoutMs: LIMITS.PAGE_TIMEOUT_MS });
  if (!homeRes.ok) {
    const audit = emptyAudit(input, homeRes.reason, crawler.trace, started);
    audit.origin = home.origin;
    audit.requestsUsed = crawler.requestsUsed();
    return audit;
  }
  if (homeRes.contentType.indexOf("html") < 0) {
    const audit = emptyAudit(
      input,
      `contenu_non_html (${homeRes.contentType || "sans type"})`,
      crawler.trace,
      started
    );
    audit.origin = home.origin;
    audit.requestsUsed = crawler.requestsUsed();
    return audit;
  }

  const origin = new URL(homeRes.finalUrl.origin);
  const homePage = analyzePage("accueil", homeRes);
  const pages: PageReport[] = [homePage];

  // ── 2. PageSpeed en parallèle ────────────────────────────────────────────
  const speedPromise: Promise<SpeedReport> = options.pagespeed
    ? fetchPageSpeed(homePage.finalUrl)
    : Promise.resolve(speedUnavailable("mesure désactivée par l'option --no-pagespeed"));

  // ── 3. robots.txt puis sitemap ───────────────────────────────────────────
  const robotsOut = await fetchRobots(crawler, origin);
  const robots = robotsOut.report;
  // Dès que robots.txt est lu, son Crawl-delay s'applique à tout le reste.
  // www.mr-debarrasse.fr demande 10 s ; on les respecte, quitte à lire moins
  // de pages. Un audit incomplet se dit ; un site ralenti ne se rattrape pas.
  crawler.applyCrawlDelay(robots.crawlDelaySeconds);
  const sitemapOut = await fetchSitemap(crawler, origin, robots);
  const sitemap = sitemapOut.report;

  // ── 4. Pages internes à valeur commerciale ───────────────────────────────
  const homePath = new URL(homePage.finalUrl).pathname;
  let candidateSource: string[] = sitemapOut.urls;
  let method: SiteAudit["discovery"]["method"] = "sitemap";
  if (candidateSource.length === 0) {
    candidateSource = collectHrefs(homeRes.body);
    method = candidateSource.length > 0 ? "liens_internes" : "aucune";
  }
  const considered = countCandidates(candidateSource, origin, homePath);
  const picked = pickPages(candidateSource, origin, homePath, options.maxExtraPages);

  for (let i = 0; i < picked.length; i++) {
    if (crawler.exhausted()) {
      pages.push(
        failedPage("decouverte", picked[i].url.toString(), crawler.exhaustedReason(), null)
      );
      continue;
    }
    const res = await crawler.get(picked[i].url, { timeoutMs: LIMITS.PAGE_TIMEOUT_MS });
    if (!res.ok) {
      pages.push(failedPage("decouverte", picked[i].url.toString(), res.reason, res.status));
      continue;
    }
    if (res.contentType.indexOf("html") < 0) {
      pages.push(
        failedPage(
          "decouverte",
          picked[i].url.toString(),
          `contenu_non_html (${res.contentType || "sans type"})`,
          res.status
        )
      );
      continue;
    }
    pages.push(analyzePage("decouverte", res));
  }

  const okPages = pages.filter((p) => p.ok);
  markBlockedPages(
    robots,
    robotsOut.raw,
    okPages.map((p) => p.finalUrl)
  );

  // ── 5. Conteneur GTM ─────────────────────────────────────────────────────
  const gtmIds: string[] = [];
  for (let i = 0; i < okPages.length; i++) {
    const ids = okPages[i].tracking.gtmIds;
    for (let j = 0; j < ids.length; j++) if (gtmIds.indexOf(ids[j]) < 0) gtmIds.push(ids[j]);
  }
  let gtm = emptyGtmReport();
  if (gtmIds.length > 0) {
    gtm = crawler.exhausted()
      ? { ...gtm, checked: true, containerId: gtmIds[0], reason: crawler.exhaustedReason() }
      : await fetchGtm(crawler, gtmIds[0]);
  }

  // ── 6. http:// redirige-t-il ? ───────────────────────────────────────────
  const httpRedirect = await checkHttpRedirect(crawler, origin);

  // ── 7. Assemblage ────────────────────────────────────────────────────────
  let telLinksTotal = 0;
  let formsTotal = 0;
  const telNumbers: string[] = [];
  for (let i = 0; i < okPages.length; i++) {
    telLinksTotal += okPages[i].contact.telLinks;
    formsTotal += okPages[i].contact.forms.length;
    for (let j = 0; j < okPages[i].contact.telNumbers.length; j++) {
      const num = okPages[i].contact.telNumbers[j];
      if (telNumbers.indexOf(num) < 0) telNumbers.push(num);
    }
  }

  const tracking: TrackingReport = buildTrackingReport(
    okPages.map((p) => p.tracking),
    gtm,
    telLinksTotal,
    telNumbers,
    formsTotal
  );

  const speed = await speedPromise;

  const base: Omit<SiteAudit, "findings" | "internalNotes"> = {
    ok: true,
    input,
    origin: origin.origin,
    failureReason: null,
    startedAt: new Date(started).toISOString(),
    pages,
    pagesTested: okPages.length,
    discovery: {
      method,
      candidatesConsidered: considered,
      note:
        method === "sitemap"
          ? `${considered} URL retenues depuis le sitemap, ${picked.length} lues`
          : method === "liens_internes"
            ? `${considered} liens internes retenus depuis l'accueil, ${picked.length} lus`
            : "aucune page interne trouvée",
    },
    robots,
    sitemap,
    httpRedirect,
    tracking,
    speed,
    requestsUsed: crawler.requestsUsed(),
    trace: crawler.trace,
    elapsedMs: Date.now() - started,
  };

  return {
    ...base,
    findings: buildFindings(base),
    internalNotes: internalNotes(pages),
    elapsedMs: Date.now() - started,
  };
}
