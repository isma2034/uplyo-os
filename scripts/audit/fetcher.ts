/**
 * Couche réseau de l'audit — la SEULE porte de sortie HTTP vers un site tiers.
 *
 * Tout ce que le reste du module récupère passe par ici, ce qui donne un point
 * unique où sont appliqués les garde-fous. Ils ne sont pas décoratifs : un
 * crawl sans limite de débit a déjà mis un site de prospect hors ligne pendant
 * 2 h sur ce projet.
 *
 * Garde-fous appliqués, sans exception :
 *  - anti-SSRF sur les adresses RÉSOLUES, revalidé à CHAQUE saut de
 *    redirection (un domaine public peut pointer sur 127.0.0.1, et une
 *    redirection peut viser un réseau interne) ;
 *  - délai minimal entre deux requêtes vers le MÊME hôte : le site du prospect
 *    ne reçoit jamais de rafale. C'est le garde-fou qui manquait le jour de
 *    l'incident, et il est ici plus généreux que sur le chemin public (700 ms
 *    contre 350) parce que cet étage n'a personne à faire patienter ;
 *  - plafond du nombre de requêtes par audit, et budget de temps global ;
 *  - timeout par requête ;
 *  - corps de réponse tronqué (une page de 40 Mo ne doit pas saturer le
 *    processus).
 *
 * Le budget de temps est large (90 s) parce que ce module tourne en ligne de
 * commande, déclenché à la main par Ismael : personne n'attend derrière une
 * réponse HTTP. C'est exactement la raison d'être du second étage.
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const UA =
  "Mozilla/5.0 (compatible; UplyoAuditBot/1.0; +https://uplyo.fr/audit)";

export const LIMITS = {
  /** Budget de temps total pour TOUTES les requêtes vers le site audité. */
  CRAWL_BUDGET_MS: 150_000,
  /** Plafond dur du nombre de requêtes sortantes par audit. */
  MAX_REQUESTS: 16,
  /** Délai minimal entre deux requêtes vers le même hôte. */
  HOST_DELAY_MS: 700,
  /** Plafond du délai, y compris quand robots.txt en demande davantage. */
  MAX_HOST_DELAY_MS: 10_000,
  PAGE_TIMEOUT_MS: 15_000,
  /** Petit fichier : robots.txt, sitemap. */
  SMALL_TIMEOUT_MS: 10_000,
  MAX_REDIRECTS: 3,
  MAX_HTML_BYTES: 3_000_000,
  MAX_TEXT_BYTES: 1_000_000,
  /** Un conteneur GTM chargé peut peser plusieurs centaines de Ko. */
  MAX_SCRIPT_BYTES: 4_000_000,
} as const;

export type FetchOk = {
  ok: true;
  requestedUrl: string;
  finalUrl: URL;
  status: number;
  contentType: string;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  truncated: boolean;
  elapsedMs: number;
};

export type FetchFail = {
  ok: false;
  requestedUrl: string;
  reason: string;
  status: number | null;
};

export type FetchOutcome = FetchOk | FetchFail;

/**
 * Anti-SSRF. Même si l'entrée vient d'Ismael et non d'un formulaire public,
 * le filtre reste : une redirection du site audité peut viser 127.0.0.1 ou le
 * réseau local du poste, et une faute de frappe ne doit pas scanner un
 * intranet.
 */
export function isBlockedAddress(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const parts = ip.split(".").map(Number);
    const a = parts[0];
    const b = parts[1];
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

export async function assertPublicHost(host: string): Promise<void> {
  const h = host.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal")
  ) {
    throw new Error("host_not_public");
  }
  const addresses = await lookup(h, { all: true });
  if (addresses.length === 0) throw new Error("dns_no_result");
  for (let i = 0; i < addresses.length; i++) {
    if (isBlockedAddress(addresses[i].address)) throw new Error("host_not_public");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type GetOptions = {
  maxBytes?: number;
  timeoutMs?: number;
  accept?: string;
  /**
   * Exempte la requête du délai inter-requêtes. Réservé aux points de
   * terminaison Google (gtm.js, PageSpeed) : ce ne sont pas des serveurs de
   * prospects, les ménager n'a aucun sens.
   */
  noThrottle?: boolean;
  /** Ne suit pas les redirections : renvoie la 3xx telle quelle. */
  noFollow?: boolean;
};

/** Un audit = une instance. Elle porte le budget et le compteur de requêtes. */
export class Crawler {
  private deadline: number;
  private used = 0;
  private hostDelayMs: number = LIMITS.HOST_DELAY_MS;
  private lastHitByHost = new Map<string, number>();
  /** Journal factuel des requêtes, repris tel quel en annexe du rapport. */
  readonly trace: string[] = [];

  constructor(budgetMs: number = LIMITS.CRAWL_BUDGET_MS) {
    this.deadline = Date.now() + budgetMs;
  }

  /**
   * Applique le Crawl-delay demandé par robots.txt.
   *
   * Googlebot ignore cette directive ; nous la respectons. Ce n'est pas de la
   * courtoisie décorative : c'est précisément ce garde-fou qui manquait le
   * jour où un crawl a mis un site de prospect hors ligne pendant 2 h. Le
   * délai n'est jamais réduit, seulement augmenté, et il est plafonné pour que
   * le budget de temps global reste tenable — si le budget s'épuise, les pages
   * non lues sont rapportées comme telles, avec leur motif.
   */
  applyCrawlDelay(seconds: number | null): void {
    if (seconds === null || !isFinite(seconds) || seconds <= 0) return;
    const wanted = Math.min(seconds * 1000, LIMITS.MAX_HOST_DELAY_MS);
    if (wanted > this.hostDelayMs) {
      this.hostDelayMs = wanted;
      this.trace.push(`robots.txt demande Crawl-delay ${seconds}s → délai porté à ${wanted} ms`);
    }
  }

  remainingMs(): number {
    return this.deadline - Date.now();
  }

  requestsUsed(): number {
    return this.used;
  }

  exhausted(): boolean {
    return this.remainingMs() <= 1000 || this.used >= LIMITS.MAX_REQUESTS;
  }

  /** Motif d'épuisement, pour marquer un contrôle « indisponible » sans mentir. */
  exhaustedReason(): string {
    if (this.used >= LIMITS.MAX_REQUESTS) return "plafond_requetes_atteint";
    return "budget_temps_epuise";
  }

  async get(target: URL, opts: GetOptions = {}): Promise<FetchOutcome> {
    const requestedUrl = target.toString();

    if (this.exhausted()) {
      this.trace.push(`SKIP ${requestedUrl} (${this.exhaustedReason()})`);
      return { ok: false, requestedUrl, reason: this.exhaustedReason(), status: null };
    }

    const maxBytes = opts.maxBytes ?? LIMITS.MAX_HTML_BYTES;
    const wanted = opts.timeoutMs ?? LIMITS.PAGE_TIMEOUT_MS;
    // Chronomètre remis à zéro APRÈS l'attente de politesse : sinon le journal
    // affiche « 9 505 ms » pour une réponse instantanée, et on croit à tort que
    // le site du prospect est lent.
    let started = Date.now();

    let current = target;

    try {
      for (let hop = 0; hop <= LIMITS.MAX_REDIRECTS; hop++) {
        await assertPublicHost(current.hostname);

        if (!opts.noThrottle) await this.throttle(current.hostname);
        if (hop === 0) started = Date.now();

        const remaining = this.remainingMs();
        if (remaining <= 500) throw new Error("budget_temps_epuise");

        this.used += 1;
        if (this.used > LIMITS.MAX_REQUESTS) throw new Error("plafond_requetes_atteint");

        const res = await fetch(current.toString(), {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": UA,
            Accept: opts.accept ?? "text/html,application/xhtml+xml",
            "Accept-Language": "fr-FR,fr;q=0.9",
            // fetch() de Node n'a pas de cache HTTP : l'option `cache` du
            // navigateur n'existe pas ici (et ne type-check pas). C'est
            // l'en-tête qui demande au site et aux intermédiaires de servir
            // une réponse fraîche — ce qu'on veut pour un relevé.
            "Cache-Control": "no-cache",
          },
          signal: AbortSignal.timeout(Math.max(1000, Math.min(wanted, remaining))),
        });

        if (res.status >= 300 && res.status < 400 && !opts.noFollow) {
          const loc = res.headers.get("location");
          await res.body?.cancel().catch(() => {});
          if (!loc) throw new Error(`redirection_sans_location_${res.status}`);
          const next = new URL(loc, current);
          if (next.protocol !== "http:" && next.protocol !== "https:") {
            throw new Error("redirection_protocole_invalide");
          }
          this.trace.push(`${res.status} ${current.toString()} → ${next.toString()}`);
          current = next;
          continue;
        }

        const read = await readCapped(res, maxBytes);
        const elapsedMs = Date.now() - started;
        this.trace.push(
          `${res.status} ${current.toString()} (${Math.round(read.bytes / 1024)} Ko, ${elapsedMs} ms)`
        );

        return {
          ok: true,
          requestedUrl,
          finalUrl: current,
          status: res.status,
          contentType: res.headers.get("content-type") ?? "",
          headers: pickHeaders(res.headers),
          body: read.body,
          bytes: read.bytes,
          truncated: read.truncated,
          elapsedMs,
        };
      }
      throw new Error("trop_de_redirections");
    } catch (e) {
      const reason = normalizeError(e);
      this.trace.push(`ERR ${requestedUrl} (${reason})`);
      return { ok: false, requestedUrl, reason, status: null };
    }
  }

  private async throttle(host: string): Promise<void> {
    const last = this.lastHitByHost.get(host);
    const now = Date.now();
    if (last !== undefined) {
      const wait = this.hostDelayMs - (now - last);
      if (wait > 0) await sleep(Math.min(wait, this.hostDelayMs));
    }
    this.lastHitByHost.set(host, Date.now());
  }
}

/**
 * Seuls les en-têtes utiles à un constat sont conservés — pas de collecte
 * large de données sur le serveur d'un tiers.
 */
const KEEP_HEADERS = [
  "content-type",
  "server",
  "x-powered-by",
  "x-robots-tag",
  "location",
  "strict-transport-security",
];

function pickHeaders(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < KEEP_HEADERS.length; i++) {
    const name = KEEP_HEADERS[i];
    const v = h.get(name);
    if (v) out[name] = v.slice(0, 500);
  }
  return out;
}

function normalizeError(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === "TimeoutError" || e.name === "AbortError") return "timeout";
    const m = e.message || e.name;
    // Les erreurs undici imbriquent la cause utile (ENOTFOUND, ECONNREFUSED…).
    const cause = (e as { cause?: unknown }).cause;
    if (m === "fetch failed" && cause instanceof Error) {
      const code = (cause as { code?: string }).code;
      return code ? `reseau_${code}` : `reseau_${cause.message}`.slice(0, 80);
    }
    return m.slice(0, 120);
  }
  return "erreur_inconnue";
}

/** Lit le corps en s'arrêtant à maxBytes, sans jamais tout charger en mémoire. */
async function readCapped(
  res: Response,
  maxBytes: number
): Promise<{ body: string; bytes: number; truncated: boolean }> {
  const reader = res.body?.getReader();
  if (!reader) return { body: "", bytes: 0, truncated: false };
  const decoder = new TextDecoder("utf-8");
  let body = "";
  let bytes = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    body += decoder.decode(value, { stream: true });
    if (bytes >= maxBytes) {
      truncated = true;
      await reader.cancel().catch(() => {});
      break;
    }
  }
  return { body, bytes, truncated };
}

/**
 * Normalise une saisie libre en URL de PAGE D'ACCUEIL.
 * « monsite.fr/produits?ref=x » devient « https://monsite.fr/ ».
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
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.endsWith(".") || host.length > 253) return null;
  if (/\s/.test(host)) return null;

  return new URL(`${url.protocol}//${url.host}/`);
}
