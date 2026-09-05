/**
 * Vitesse réelle via l'API PageSpeed Insights (Lighthouse exécuté par Google).
 *
 * ── Pourquoi cet appel est ici et PAS dans /api/audit-check
 * La clé PageSpeed est à quota partagé avec l'usage interne d'Ismael. Brancher
 * un endpoint public dessus permettrait à n'importe qui de le vider, et le
 * chemin public est de toute façon borné à ~12 s alors qu'un run Lighthouse
 * distant prend 15 à 40 s sur les sites lents — qui sont précisément la cible.
 * Ce second étage tourne en ligne de commande, déclenché par Ismael : ni quota
 * exposé, ni contrainte de temps.
 *
 * ── Pourquoi aucun score /100 n'apparaît nulle part
 * « 34/100 » est du jargon, et une fausse autorité : le score est une moyenne
 * pondérée arbitraire qui bouge d'un run à l'autre. Le type SpeedReport ne
 * comporte donc AUCUN champ de score, pour qu'il ne puisse pas fuiter dans un
 * rapport. Tout est exprimé en secondes, avec le seuil Google de 2,5 s.
 *
 * ── Pourquoi la donnée terrain (CrUX) prime
 * C'est la seule mesure qui vient de vrais visiteurs, sur leurs vrais
 * téléphones, sur leur vrai réseau. Un chiffre de laboratoire se conteste ;
 * « voilà ce que vivent vos visiteurs » ne se conteste pas. Et son absence est
 * elle-même une information commerciale : Google n'a pas assez de visiteurs
 * réels sur ce site pour publier des mesures.
 *
 * La clé n'est lue que dans l'environnement. Elle n'est jamais écrite dans le
 * dépôt ni dans un rapport, et elle est masquée dans tout message d'erreur.
 */

import type { SpeedReport } from "./types.ts";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/**
 * Plafond dur. Calibré sur des mesures réelles depuis ce poste : 16 s et 32 s
 * pour www.mr-debarrasse.fr, 34 s pour uplyo.fr. La fourchette « 5 à 15 s »
 * habituellement citée est trop optimiste pour les sites lents.
 */
const PSI_TIMEOUT_MS = 90_000;

function num(v: unknown): number | null {
  return typeof v === "number" && isFinite(v) ? v : null;
}

function round(v: number | null): number | null {
  return v === null ? null : Math.round(v);
}

/** Retire toute occurrence de la clé d'un message avant de le stocker. */
function scrub(message: string, key: string | undefined): string {
  const cleaned = key ? message.split(key).join("[clé masquée]") : message;
  return cleaned.replace(/key=[^&\s]+/gi, "key=[clé masquée]").slice(0, 240);
}

export function speedUnavailable(reason: string): SpeedReport {
  return { status: "indisponible", reason, strategy: "mobile" };
}

/**
 * Un seul appel, stratégie mobile, catégorie performance.
 *
 * Mobile uniquement : c'est là qu'arrive l'essentiel du trafic Google Ads des
 * cibles (artisans, services locaux), et cela divise par deux la consommation
 * de quota. Ne lève jamais : toute erreur devient un rapport « indisponible »
 * motivé, jamais une valeur estimée.
 */
export async function fetchPageSpeed(url: string): Promise<SpeedReport> {
  const first = await callPageSpeed(url);
  if (first.status === "mesure") return first;
  // Un seul réessai, et seulement sur les échecs qui peuvent être passagers
  // (500 de Lighthouse, hors délai). Deux appels au maximum : le quota est
  // partagé, on ne boucle pas. Sur www.mr-debarrasse.fr l'erreur 500 est
  // reproductible — le réessai n'y change rien, et c'est très bien ainsi : le
  // rapport dit « indisponible » avec le motif, il n'invente pas de valeur.
  if (!/erreur PageSpeed 5|hors délai|illisible/i.test(first.reason)) return first;
  await new Promise((r) => setTimeout(r, 2000));
  const second = await callPageSpeed(url);
  if (second.status === "mesure") return second;
  return speedUnavailable(`${second.reason} (deux tentatives)`);
}

async function callPageSpeed(url: string): Promise<SpeedReport> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    return speedUnavailable(
      "PAGESPEED_API_KEY absente de l'environnement — mesure de vitesse non lancée"
    );
  }

  const started = Date.now();
  const target =
    `${ENDPOINT}?url=${encodeURIComponent(url)}` +
    `&strategy=mobile&category=performance&key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(target, {
      method: "GET",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(PSI_TIMEOUT_MS),
    });

    const raw = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return speedUnavailable(`réponse PageSpeed illisible (HTTP ${res.status})`);
    }

    if (data.error) {
      const err = data.error as { status?: string; message?: string };
      return speedUnavailable(
        `erreur PageSpeed ${err.status ?? res.status} — ${scrub(err.message ?? "sans message", key)}`
      );
    }
    if (!res.ok) return speedUnavailable(`erreur PageSpeed HTTP ${res.status}`);

    const lh = (data.lighthouseResult ?? {}) as Record<string, unknown>;
    const audits = (lh.audits ?? {}) as Record<string, { numericValue?: unknown }>;

    // Données terrain (CrUX). Absentes quand le site n'a pas assez de trafic
    // réel : c'est un fait à rapporter tel quel, pas une valeur à combler.
    const le = data.loadingExperience as
      | { overall_category?: string; metrics?: Record<string, { percentile?: unknown }> }
      | undefined;
    const ole = data.originLoadingExperience as
      | { overall_category?: string; metrics?: Record<string, { percentile?: unknown }> }
      | undefined;
    const metrics = le?.metrics ?? {};
    const originMetrics = ole?.metrics ?? {};

    // CrUX exprime le CLS en centièmes d'unité (10 = 0,10).
    const fieldCls = num(metrics["CUMULATIVE_LAYOUT_SHIFT_SCORE"]?.percentile);

    return {
      status: "mesure",
      strategy: "mobile",
      measuredUrl:
        (typeof lh.finalDisplayedUrl === "string" && lh.finalDisplayedUrl) ||
        (typeof lh.finalUrl === "string" && lh.finalUrl) ||
        (typeof lh.requestedUrl === "string" && lh.requestedUrl) ||
        null,
      lcpMs: round(num(audits["largest-contentful-paint"]?.numericValue)),
      clsScore: num(audits["cumulative-layout-shift"]?.numericValue),
      tbtMs: round(num(audits["total-blocking-time"]?.numericValue)),
      fcpMs: round(num(audits["first-contentful-paint"]?.numericValue)),
      fieldDataCategory: le?.overall_category ?? null,
      fieldLcpMs: round(num(metrics["LARGEST_CONTENTFUL_PAINT_MS"]?.percentile)),
      fieldInpMs: round(num(metrics["INTERACTION_TO_NEXT_PAINT"]?.percentile)),
      fieldClsScore: fieldCls === null ? null : fieldCls / 100,
      originFieldDataCategory: ole?.overall_category ?? null,
      originFieldLcpMs: round(num(originMetrics["LARGEST_CONTENTFUL_PAINT_MS"]?.percentile)),
      elapsedMs: Date.now() - started,
    };
  } catch (e) {
    if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) {
      return speedUnavailable(`mesure PageSpeed hors délai (> ${PSI_TIMEOUT_MS / 1000} s)`);
    }
    return speedUnavailable(
      `appel PageSpeed impossible — ${scrub(
        e instanceof Error ? e.message : "erreur inconnue",
        process.env.PAGESPEED_API_KEY
      )}`
    );
  }
}
