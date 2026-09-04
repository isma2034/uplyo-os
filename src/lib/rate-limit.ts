/**
 * Limiteur de débit en mémoire, fenêtre glissante.
 *
 * ⚠️ LIMITE ASSUMÉE DE CETTE IMPLÉMENTATION
 * Le compteur vit dans la mémoire du processus. En serverless (Vercel), chaque
 * instance lambda a sa propre mémoire et les instances sont recyclées : un
 * visiteur qui tombe sur une instance froide repart à zéro, et N instances
 * concurrentes autorisent jusqu'à N × LIMITE requêtes sur la fenêtre. Ce n'est
 * donc PAS une protection anti-abus déterministe, seulement un garde-fou de
 * premier niveau contre le martèlement trivial (une personne, un onglet).
 *
 * Passer à un store partagé (Vercel Firewall, ou Upstash Redis via son API
 * REST) dès que le formulaire reçoit du trafic réel. Aucun store de ce type
 * n'est branché sur le projet à ce jour — vérifié : pas de dépendance KV/Redis
 * dans package.json, le seul schéma Supabase présent (supabase/schema.sql)
 * n'est pas connecté au site.
 *
 * Analyse complète, seuils par route, déclencheur de mise à niveau et
 * pseudo-code prêt à brancher : docs/RATE_LIMIT.md.
 */

type Hit = number[];

const buckets = new Map<string, Hit>();

/** Purge paresseuse : évite que la Map grossisse indéfiniment sur un processus long. */
function sweep(now: number, windowMs: number) {
  if (buckets.size < 500) return;
  const stale: string[] = [];
  buckets.forEach((hits, key) => {
    const kept = hits.filter((t: number) => now - t < windowMs);
    if (kept.length === 0) stale.push(key);
    else buckets.set(key, kept);
  });
  for (const key of stale) buckets.delete(key);
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Secondes avant que le prochain jeton se libère (0 si autorisé). */
  retryAfter: number;
};

/**
 * Consomme un jeton pour `key`. Le jeton n'est consommé QUE si la requête est
 * autorisée : une requête refusée n'allonge pas la pénalité.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now, windowMs);

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    buckets.set(key, hits);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, remaining: limit - hits.length, retryAfter: 0 };
}

/** Adresse cliente derrière le proxy Vercel. `unknown` si aucun en-tête. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Réinitialisation — utilisée uniquement par les tests locaux. */
export function __resetRateLimit() {
  buckets.clear();
}
