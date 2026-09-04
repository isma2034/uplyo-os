# Limitation de débit des formulaires — ce qu'elle protège, et ce qu'elle ne protège pas

Code : `src/lib/rate-limit.ts`, utilisé par `src/app/api/audit-check/route.ts`
et `src/app/api/contact/route.ts`.

## Réglages actuels

| Route | Par IP | Plafond global | Fenêtre |
|---|---|---|---|
| `/api/audit-check` | 3 | 40 | 1 h glissante |
| `/api/contact` | 5 | 60 | 1 h glissante |

Un dépassement renvoie `429` avec un en-tête `Retry-After` et un message
affichable tel quel par le formulaire (« Trop de demandes envoyées depuis cette
connexion… »). Le jeton n'est **pas** consommé par une requête refusée : un
visiteur bloqué ne s'inflige pas de pénalité supplémentaire en réessayant.

Le plafond global existe pour `/api/audit-check` parce que cette route déclenche
une requête HTTP sortante vers le site soumis (`src/lib/site-check.ts`). Sans
lui, une attaque répartie sur beaucoup d'IP transformerait le site en scanner de
masse — le genre d'incident qui fait blacklister le domaine.

## ⚠️ La limite réelle : le compteur ne survit pas au serverless

Les compteurs vivent dans une `Map` en mémoire de processus. Sur Vercel :

1. **chaque instance lambda a sa propre mémoire.** Avec N instances chaudes en
   parallèle, le plafond effectif est de N × la limite ;
2. **les instances sont recyclées.** Après quelques minutes sans trafic, la
   suivante repart d'une Map vide. Un attaquant patient n'est jamais bloqué ;
3. **le plafond global n'est global qu'au sein d'une instance** — c'est le
   garde-fou le plus affaibli par ce mode d'exécution ;
4. l'IP vient de `x-forwarded-for` : derrière un CGNAT (opérateurs mobiles),
   plusieurs entreprises différentes peuvent partager une IP et se bloquer
   mutuellement. C'est l'argument pour ne pas descendre les seuils plus bas.

**Conclusion à ne pas oublier : ce limiteur arrête le martèlement trivial
(une personne, un onglet, un clic répété, un script naïf). Ce n'est pas une
protection anti-abus déterministe.** Tant que le trafic du site est ce qu'il
est aujourd'hui, c'est un compromis acceptable ; il ne le sera plus dès que la
prospection amènera du volume ou qu'une des URL sera partagée publiquement.

## L'amélioration à faire quand ce sera nécessaire

Non implémentée volontairement, faute de pouvoir la tester de bout en bout ici :
brancher une intégration externe non vérifiée sur un site en production, pour un
formulaire qui reçoit quelques soumissions par semaine, ajoute plus de risque
qu'il n'en retire. Le déclencheur de mise en œuvre est simple : **plus d'une
soumission indésirable par jour, ou plus de 50 soumissions légitimes par mois.**

Deux options, sans dépendance payante :

### Option A — Vercel Firewall (aucune ligne de code)

Le tableau de bord Vercel permet de poser une règle de limitation par chemin
(`/api/*`) et par IP. Elle s'applique en amont des fonctions, donc mutualisée
entre instances — c'est exactement ce qui manque ici. Disponible sur le plan
Hobby avec des quotas restreints ; à essayer en premier, parce que le coût de
maintenance est nul.

### Option B — compteur partagé Upstash Redis (offre gratuite, API REST)

Pas de client à installer : l'API REST se consomme avec `fetch`. Le principe,
en pseudo-code, à placer dans `src/lib/rate-limit.ts` **en amont** du compteur
mémoire, qui reste alors le filet de repli :

```ts
// Variables d'env (Vercel) : UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
async function sharedRateLimit(key: string, limit: number, windowSec: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null; // pas configuré → repli mémoire

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSec), "NX"],
    ]),
    signal: AbortSignal.timeout(1000),
  });
  if (!res.ok) return null; // Upstash indisponible → repli mémoire
  const [{ result: count }] = await res.json();
  return { allowed: Number(count) <= limit };
}
```

Trois règles à respecter si cette option est retenue :

1. **échouer en repli, jamais en blocage** : si Upstash est injoignable ou hors
   délai, on retombe sur le compteur mémoire. Un magasin de compteurs ne doit
   jamais pouvoir couper le formulaire de contact du site ;
2. **timeout court** (1 s), sinon la latence du formulaire dépend d'un tiers ;
3. **vérifier réellement** avant de déployer : un faux serveur HTTP local
   répondant au format `/pipeline` suffit à tester les quatre cas — sous la
   limite, au-dessus, service en erreur, service hors délai.

## Ce qui protège déjà, en plus du compteur

- **Pot de miel** `_honey` sur les deux formulaires, contrôlé côté serveur : une
  soumission qui le remplit reçoit `200` sans qu'aucun email ne parte (répondre
  une erreur renseignerait le robot).
- **Validation stricte** : email au format, téléphone `^\+?\d{9,15}$`, champs
  tronqués à des longueurs fixes avant tout rendu HTML.
- **Échappement HTML systématique** (`src/lib/escape.ts`) de toute valeur
  insérée dans les emails, et lien du site affiché en texte s'il n'est pas en
  `http(s)://`.
- **Anti-SSRF** sur la vérification de site (`src/lib/site-check.ts`) : les
  adresses résolues sont contrôlées à chaque saut de redirection.
