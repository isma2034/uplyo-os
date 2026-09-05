# Second étage d'audit — outil interne

Moteur d'audit complet, lancé **à la main par Ismael** à réception d'un lead.
Code : `scripts/audit/`. Rien de tout cela n'est déployé.

```bash
npm run audit -- https://www.exemple.fr
npm run audit -- exemple.fr --out /tmp/rapport.md
npm run audit -- exemple.fr --json            # données brutes
npm run audit -- exemple.fr --pages 5         # pages internes en plus (0 à 6)
npm run audit -- exemple.fr --no-pagespeed    # aucun appel à l'API Google
```

Type-check : `npm run typecheck:scripts`.

---

## Pourquoi ce n'est PAS dans /api/audit-check

Le premier réflexe était d'ajouter PageSpeed et l'analyse multi-pages à
l'endpoint public. C'est une mauvaise idée pour trois raisons qui ne se
contournent pas :

1. **Le quota PageSpeed est partagé** avec l'usage interne. Un endpoint public
   branché dessus permet à n'importe qui de le vider.
2. **Le crawl multi-pages depuis un endpoint public** est exactement ce qui a
   déjà mis un site de prospect hors ligne pendant 2 h sur ce projet.
3. **Le chemin public est borné à ~12 s.** Un run Lighthouse distant prend
   couramment 20 à 40 s sur un site lent — et les sites lents sont la cible.

Il y a donc **deux étages, et la frontière est physique** :

| | `/api/audit-check` (public) | `scripts/audit/` (interne) |
|---|---|---|
| Déclenché par | le formulaire d'un visiteur | Ismael, en ligne de commande |
| Pages lues | 1 (accueil) | 1 à 7 |
| PageSpeed | jamais | oui |
| Budget | ~12 s | 150 s |
| Rôle | accusé de réception + relevé brut par email | le rapport |
| Déployé | oui | **non** |

C'est aussi ce qui protège la promesse « 48 h ouvrées » : le prospect n'attend
rien en direct, l'enrichissement se fait hors ligne.

`/api/audit-check` et `src/lib/site-check.ts` n'ont pas été modifiés.

---

## La clé PageSpeed

Elle n'est **jamais** dans le dépôt. Elle est lue dans `PAGESPEED_API_KEY` et
nulle part ailleurs, et masquée dans tout message d'erreur.

Le script npm charge `~/.claude/skills/web-optimization/.env` via
`--env-file-if-exists` : `npm run audit` fonctionne sans rien exporter à la
main. Sans clé, la vitesse est marquée **indisponible avec son motif** — jamais
estimée.

---

## Ce que le rapport contient, et pourquoi

### La règle de tri, codée comme un filtre

> Tout constat qui ne se traduit pas par « et voilà ce que ça vous coûte »
> descend en annexe.

Deux mécanismes la tiennent, tous deux dans `scripts/audit/findings.ts` :

- un constat dont le champ `consequence` est vide **ne peut pas** monter au
  corps, même en le voulant ;
- `assignDestinations()` est le **seul** endroit du programme où `destination`
  est écrit. Seuls les constats `bloquant` ou `couteux` sont éligibles,
  **plafonnés à 3**, triés par **coût décroissant** — jamais par facilité de
  correction.

Chaque constat porte : gravité, page(s) concernée(s), caractère systémique ou
isolé, conséquence business en clair, `impactAds ∈ {bloquant, couteux,
cosmetique}` et `destination ∈ {corps, annexe}`.

### Classement des contrôles

| Contrôle | Sort |
|---|---|
| Annonceur Google Ads (décomposé en 4 niveaux) | corps (éligible) |
| Texte du title et du H1 | corps (éligible) |
| Contenu mixte http/https, **quand présent** | corps (éligible) |
| Chemin de contact, vitesse mobile, cohérence géographique | corps (éligible) |
| Meta description, canonique, JSON-LD, empreinte CMS, poids HTML | annexe |
| **Couverture des `alt`, nombre de H1** | **hors rapport client** — section « notes internes », pour chiffrer un devis |

### Les 4 niveaux de la mesure Google Ads

Aucun de ces niveaux ne dit rien tout seul. Ce qui se vend est **l'écart** :

1. balise Google chargée (`gtag/js` ou `gtm.js`)
2. identifiant annonceur `AW-XXXXXXXXX`
3. **une conversion réellement définie**
4. GA4 + Consent Mode + une CMP

> « Votre balise Ads est en place, mais aucune conversion n'est définie —
> Google reçoit votre argent sans vous dire quelles annonces produisent des
> demandes. »

**Où se trouve réellement la preuve du niveau 3.** Un conteneur GTM n'écrit pas
ses conversions sous la forme `AW-871292681/Étiquette` : vérifié sur le
conteneur réel `GTM-KWJ27TGF`, cette chaîne n'y apparaît nulle part. Ce qui s'y
trouve est un tag de modèle **`__awct`** (Google Ads Conversion Tracking) avec
son `vtp_conversionLabel`. Se fier au motif `AW-xxx/label` aurait conclu
« aucune conversion définie » sur un compte qui en a **trois**.

Un déclencheur GTM seul (envoi de formulaire, clic sur lien) **ne compte pas**
comme preuve : il peut n'alimenter que GA4 sans jamais remonter à Google Ads.

Quand le conteneur GTM n'a pas pu être lu, le niveau 3 vaut **indéterminé**,
jamais « absent ».

### Vitesse

- **Mobile uniquement.**
- **Jamais de score /100** : le champ n'existe pas dans le type `SpeedReport`,
  pour qu'il ne puisse pas fuiter.
- Tout en secondes, seuil Google 2,5 s.
- La **donnée terrain CrUX** prime sur le laboratoire. Son absence est une
  information commerciale en soi : « Google n'a pas assez de visiteurs réels
  sur votre site pour publier des mesures. »
- **Chaque métrique terrain est comparée à son propre seuil.** On ne recopie
  pas la catégorie globale de Google : sur `www.mr-debarrasse.fr`, Google
  classe l'expérience « SLOW » alors que l'affichage tient en 1,8 s — c'est le
  décalage visuel (0,69 pour un seuil de 0,1) qui est en cause. Titrer
  « expérience lente » puis citer 1,8 s est un document qui se contredit en
  deux lignes.
- Quand la donnée terrain existe, **le laboratoire ne peut pas monter au
  corps** : 11,4 s en laboratoire contre 1,8 s sur le terrain, les deux sont
  vrais, mais côte à côte ils s'annulent. Le laboratoire descend en annexe et
  explique l'écart.

### Indexabilité

Alertes conditionnelles **uniquement** : `Disallow: /`, `noindex` sur une page
lue, blocage d'`AdsBot-Google`, et `http://` qui ne redirige pas vers `https`
(testé explicitement, sans suivre la redirection). Le reste va en annexe.

### Cohérence géographique

Code postal suivi d'une commune dans le texte, `PostalAddress` et `areaServed`
en JSON-LD. Le comptage des communes est **limité aux communes déclarées** :
faute d'annuaire, une ville citée seulement dans un titre n'est pas détectable,
et le rapport le dit.

---

## Garde-fous réseau

Tout passe par un seul `Crawler` (`scripts/audit/fetcher.ts`) :

- anti-SSRF sur les adresses **résolues**, revalidé à chaque redirection ;
- délai entre deux requêtes vers le même hôte : **700 ms par défaut**, et le
  **`Crawl-delay` de robots.txt est respecté** (plafonné à 10 s). Googlebot
  l'ignore, nous non : c'est précisément ce garde-fou qui manquait le jour de
  l'incident. `www.mr-debarrasse.fr` demande 10 s, un relevé y prend donc ~70 s ;
- plafond de 16 requêtes et budget de 150 s par audit ;
- corps de réponse tronqué.

Si le budget s'épuise, les pages non lues sont rapportées comme telles avec
leur motif. Un audit incomplet se dit ; un site ralenti ne se rattrape pas.

---

## Règle absolue : aucune donnée inventée

Une mesure qui échoue est marquée `indisponible` **avec son motif**, jamais
estimée. Exemple réel : l'API PageSpeed renvoie par intermittence
`500 — Lighthouse returned error` sur `www.mr-debarrasse.fr`. Le moteur
réessaie **une** fois, puis écrit :

> **Vitesse mobile non mesurée** — erreur PageSpeed 500 — Lighthouse returned
> error: Something went wrong. (deux tentatives)

---

## Points restant à la main d'Ismael

- **Le rapport n'est pas un livrable client en l'état.** C'est un relevé de
  faits ordonné. La mise en forme, le ton et la décision de ce qu'on montre
  restent à faire.
- **La section « notes internes » doit être retirée** avant toute transmission
  (c'est écrit dans le titre de la section).
- **Ne jamais citer un client nommément** sans son accord écrit.
- **Le niveau 3 « indéterminé »** se lève en ouvrant le compte Google Ads, pas
  en devinant.
