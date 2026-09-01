/**
 * Vérification HTML légère d'UNE page — la page d'accueil du site soumis.
 *
 * Portée volontairement étroite. Ce module est appelé depuis un endpoint
 * public : il ne doit jamais devenir un scanner de sites tiers gratuit, ni
 * reproduire l'incident du crawl sans limite de débit qui a mis un site de
 * prospect hors ligne pendant 2 h.
 *
 * Règles non négociables appliquées ici :
 *  - UNE seule requête HTTP par appel (plus, au pire, 2 sauts de redirection
 *    revalidés — sans quoi tout site en http→https ou apex→www échouerait) ;
 *  - jamais de sitemap, jamais de seconde page, jamais de réessai ;
 *  - timeout court et budget total borné ;
 *  - corps de réponse tronqué (une page de 40 Mo ne doit pas saturer le
 *    processus) ;
 *  - aucun appel à l'API PageSpeed : sa clé est partagée avec l'usage interne
 *    et un flux public l'épuiserait. Aucune clé PageSpeed n'existe dans ce
 *    dépôt, et il ne faut pas en ajouter.
 *
 * La logique des contrôles est reprise de
 * ~/.claude/skills/web-optimization/scripts/technical_audit.sh, éprouvée en
 * conditions réelles. Elle est ici réécrite avec cheerio plutôt qu'en regex :
 * le script bash doit aplatir le HTML sur une ligne et utiliser un motif non
 * gourmand parce que les constructeurs de pages (Divi, Elementor) coupent les
 * balises sur plusieurs lignes — un piège qui faisait silencieusement
 * remonter « 0 H1 » sur une page qui en avait onze. Un vrai parseur supprime
 * la classe de bug entière.
 */

import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const UA = "Mozilla/5.0 (compatible; UplyoAuditBot/1.0; +https://uplyo.fr/audit)";
const FETCH_TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 2;
const MAX_BYTES = 1_500_000;

export type SiteCheck =
  | { ok: false; url: string; reason: string }
  | {
      ok: true;
      url: string;
      finalUrl: string;
      status: number;
      title: string | null;
      titleLength: number;
      metaDescription: string | null;
      metaDescriptionLength: number;
      h1Count: number;
      h1Texts: string[];
      canonical: string | null;
      jsonLdBlocks: number;
      jsonLdTypes: string[];
      images: { total: number; emptyAlt: number; noAlt: number };
      mixedContent: string[];
      cms: { generator: string | null; fingerprints: string[] };
      htmlBytes: number;
      elapsedMs: number;
    };

/**
 * Normalise une saisie libre en URL de PAGE D'ACCUEIL.
 * « monsite.fr/produits?ref=x » devient « https://monsite.fr/ » : le chemin
 * est jeté, ce qui garantit qu'on ne peut pas viser une page arbitraire.
 */
export function toHomepageUrl(input: string): URL | null {
  const raw = String(input ?? "").trim();
  if (!raw || raw.length > 300) return null;

  let candidate = raw;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // Ports exotiques = souvent un service interne, pas un site public.
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.endsWith(".") || host.length > 253) return null;
  if (/\s/.test(host)) return null;

  return new URL(`${url.protocol}//${url.host}/`);
}

/**
 * Anti-SSRF. Le formulaire est public : sans ce filtre, n'importe qui pourrait
 * faire émettre au serveur des requêtes vers 127.0.0.1, le réseau privé de
 * l'hébergeur ou le point de métadonnées cloud (169.254.169.254). Le contrôle
 * porte sur les adresses RÉSOLUES, pas sur le nom : un domaine public peut
 * pointer sur 127.0.0.1.
 */
function isBlockedAddress(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local + métadonnées cloud
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast / réservé
    return false;
  }
  if (v === 6) {
    const s = ip.toLowerCase();
    if (s === "::" || s === "::1") return true;
    if (s.startsWith("fc") || s.startsWith("fd")) return true; // ULA
    if (s.startsWith("fe80")) return true; // link-local
    if (s.startsWith("::ffff:")) return isBlockedAddress(s.slice(7)); // IPv4 mappée
    return false;
  }
  return true;
}

async function assertPublicHost(host: string): Promise<void> {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) {
    throw new Error("host_not_public");
  }
  const addresses = await lookup(h, { all: true });
  if (addresses.length === 0) throw new Error("dns_no_result");
  for (const { address } of addresses) {
    if (isBlockedAddress(address)) throw new Error("host_not_public");
  }
}

/** Lit le corps en s'arrêtant à MAX_BYTES, sans jamais tout charger en mémoire. */
async function readCapped(res: Response): Promise<{ html: string; bytes: number }> {
  const reader = res.body?.getReader();
  if (!reader) return { html: "", bytes: 0 };
  const decoder = new TextDecoder("utf-8");
  let html = "";
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    html += decoder.decode(value, { stream: true });
    if (bytes >= MAX_BYTES) {
      await reader.cancel().catch(() => {});
      break;
    }
  }
  return { html, bytes };
}

/**
 * Une requête (au plus 1 + MAX_REDIRECTS sauts), redirections suivies à la
 * main pour revalider l'hôte à chaque saut — sinon un site pourrait rediriger
 * vers une adresse interne et contourner le filtre ci-dessus.
 */
async function fetchHomepage(start: URL, deadline: number) {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHost(current.hostname);

    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("timeout");

    const res = await fetch(current.toString(), {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(Math.min(FETCH_TIMEOUT_MS, remaining)),
      cache: "no-store",
    });

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      await res.body?.cancel().catch(() => {});
      if (!loc) throw new Error(`redirect_without_location_${res.status}`);
      current = new URL(loc, current);
      if (current.protocol !== "http:" && current.protocol !== "https:") {
        throw new Error("redirect_bad_protocol");
      }
      continue;
    }
    return { res, finalUrl: current };
  }
  throw new Error("too_many_redirects");
}

export async function checkHomepage(input: string): Promise<SiteCheck> {
  const url = toHomepageUrl(input);
  if (!url) return { ok: false, url: String(input ?? ""), reason: "url_invalide" };

  const started = Date.now();
  const deadline = started + FETCH_TIMEOUT_MS * 2;

  let res: Response;
  let finalUrl: URL;
  try {
    ({ res, finalUrl } = await fetchHomepage(url, deadline));
  } catch (e) {
    const reason = e instanceof Error ? e.message : "erreur_reseau";
    return { ok: false, url: url.toString(), reason };
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("html")) {
    await res.body?.cancel().catch(() => {});
    return { ok: false, url: url.toString(), reason: `contenu_non_html (${contentType || "sans type"})` };
  }

  let html = "";
  let bytes = 0;
  try {
    ({ html, bytes } = await readCapped(res));
  } catch {
    return { ok: false, url: url.toString(), reason: "lecture_interrompue" };
  }
  if (!html.trim()) {
    return { ok: false, url: url.toString(), reason: `reponse_vide (HTTP ${res.status})` };
  }

  const $ = cheerio.load(html);

  // Autre raison de ne pas transposer les regex du script bash telles quelles :
  // ses classes `[^"\x27]` sont interprétées par grep comme « ni " ni \ ni x
  // ni 2 ni 7 » (\x27 n'est pas une échappée dans une classe POSIX). La meta
  // description de www.mr-debarrasse.fr y est donc coupée à « Intervention »,
  // juste avant « 7j/7 » : 106 caractères remontés au lieu de 152. Vérifié en
  // comparant les deux sorties sur le même HTML. Bug à corriger côté skill.
  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[name="Description"]').attr("content")?.trim() ||
    null;
  const generator = $('meta[name="generator"]').attr("content")?.trim() || null;
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;

  const h1Texts = $("h1")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);
  const h1Count = $("h1").length;

  const ldNodes = $('script[type="application/ld+json"]');
  const jsonLdTypes = new Set<string>();
  ldNodes.each((_, el) => {
    const txt = $(el).contents().text();
    // Un bloc JSON-LD invalide (fréquent) ne doit pas faire échouer l'analyse.
    try {
      collectTypes(JSON.parse(txt), jsonLdTypes);
    } catch {
      // matchAll() n'est pas itérable sans downlevelIteration (target ES5
      // du tsconfig) : boucle exec() classique.
      const re = /"@type"\s*:\s*"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(txt)) !== null) jsonLdTypes.add(m[1]);
    }
  });

  // Comptage DOM, volontairement différent du script bash. Sur
  // www.mr-debarrasse.fr (WordPress + Elementor), le grep bash trouve 38
  // <img> et cheerio 20 : les 18 autres sont des copies de repli enfermées
  // dans des <noscript> (lazy-load). Un parseur les ignore, comme le
  // navigateur. Le chiffre DOM est le bon pour parler couverture des alt.
  const imgs = $("img");
  let emptyAlt = 0;
  let noAlt = 0;
  imgs.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined) noAlt++;
    else if (alt.trim() === "") emptyAlt++;
  });

  // Contenu mixte : ne se pose que si la page finale est servie en https.
  const mixed = new Set<string>();
  if (finalUrl.protocol === "https:") {
    $("[src], [href]").each((_, el) => {
      for (const attr of ["src", "href"] as const) {
        const v = $(el).attr(attr);
        if (v && v.toLowerCase().startsWith("http://")) mixed.add(v);
      }
    });
  }

  const fingerprints: string[] = [];
  const lower = html.toLowerCase();
  if (lower.includes("/wp-content/") || lower.includes("/wp-includes/")) fingerprints.push("WordPress");
  if (lower.includes("/wp-content/themes/divi")) fingerprints.push("Divi");
  if (lower.includes("elementor")) fingerprints.push("Elementor");
  if (lower.includes("yoast")) fingerprints.push("Yoast SEO");
  if (lower.includes("cdn.shopify.com") || lower.includes("shopify")) fingerprints.push("Shopify");
  if (lower.includes("wix.com") || lower.includes("wixstatic")) fingerprints.push("Wix");
  if (lower.includes("webflow")) fingerprints.push("Webflow");
  if (lower.includes("squarespace")) fingerprints.push("Squarespace");
  if (lower.includes("prestashop")) fingerprints.push("PrestaShop");

  return {
    ok: true,
    url: url.toString(),
    finalUrl: finalUrl.toString(),
    status: res.status,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1Count,
    h1Texts: h1Texts.slice(0, 12),
    canonical,
    jsonLdBlocks: ldNodes.length,
    jsonLdTypes: Array.from(jsonLdTypes).slice(0, 20),
    images: { total: imgs.length, emptyAlt, noAlt },
    mixedContent: Array.from(mixed).slice(0, 15),
    cms: { generator, fingerprints: Array.from(new Set(fingerprints)) },
    htmlBytes: bytes,
    elapsedMs: Date.now() - started,
  };
}

/**
 * Un @type peut être une chaîne, un tableau, ou niché n'importe où : @graph,
 * mais aussi `address` (PostalAddress), `contactPoint` (ContactPoint),
 * `potentialAction` (SearchAction)… Restreindre la descente à une liste de
 * clés connues en avait manqué trois sur un vrai bloc Yoast. On parcourt donc
 * toutes les valeurs objet, avec une profondeur bornée.
 */
function collectTypes(node: unknown, out: Set<string>, depth = 0) {
  if (depth > 8 || node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, out, depth + 1);
    return;
  }
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) for (const x of t) if (typeof x === "string") out.add(x);
  for (const key of Object.keys(obj)) {
    if (key === "@type") continue;
    const v = obj[key];
    if (v !== null && typeof v === "object") collectTypes(v, out, depth + 1);
  }
}
