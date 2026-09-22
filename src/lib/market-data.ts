/**
 * Données de marché mesurées par Uplyo.
 *
 * Elles proviennent d'un scan réel de 790 entreprises françaises (septembre
 * 2026) : pour chacune, le conteneur Google Tag Manager public a été lu afin
 * d'y détecter un identifiant de conversion Google Ads (`AW-…`). C'est une
 * mesure, pas une estimation — et c'est la seule chose sur ce site que des
 * concurrents ne peuvent pas recopier.
 *
 * Trois règles, non négociables :
 *
 * 1. AUCUNE entreprise n'est nommée, ni son domaine, ni son identifiant de
 *    conversion. Seuls des agrégats sont publiés.
 * 2. La taille d'échantillon est TOUJOURS affichée à côté du pourcentage.
 *    Un « 42 % » calculé sur 14 entreprises est du bruit ; le lecteur doit
 *    pouvoir en juger.
 * 3. Rien n'est publié en dessous de MIN_SAMPLE. Voir `publishable()`.
 *
 * Le chiffre mesure les annonceurs *détectables* : une campagne sans suivi de
 * conversion dans GTM échappe au scan. Le taux réel est donc un plancher, et
 * c'est ainsi qu'il doit être formulé — jamais « seulement X % font de la
 * publicité ».
 */

/** En dessous, l'échantillon ne permet aucune affirmation honnête. */
export const MIN_SAMPLE = 25;

export const SCAN = {
  total: 790,
  advertisers: 102,
  /** Sans aucun outil de mesure : 40 % de l'échantillon. */
  noAnalytics: 323,
  /** Sans moyen de contact sur la page d'accueil : 19 %. */
  noContact: 151,
  /** Mois du relevé, à citer sur chaque page qui affiche un chiffre. */
  date: "septembre 2026",
} as const;

export type MarketStat = {
  /** Entreprises analysées. */
  scanned: number;

  // ── Dimension publicitaire ────────────────────────────────────────────
  /** Annonceurs Google Ads confirmés par lecture du conteneur GTM. */
  advertisers: number;
  /** Aucun outil de mesure d'audience détecté — ni GA4, ni GTM. */
  noAnalytics: number;

  // ── Dimension site ────────────────────────────────────────────────────
  /** Ni formulaire ni lien d'appel sur la page d'accueil. */
  noContact: number;
  /** Aucun titre H1, ou plusieurs — le sujet de la page est illisible. */
  noH1: number;
};

/**
 * Les deux dimensions se lisent ensemble, et c'est tout l'intérêt : payer
 * pour du trafic qui arrive sur une page sans moyen de contact, ou dépenser
 * sans aucun outil pour mesurer ce que ça produit, sont deux façons
 * différentes de perdre le même budget.
 */

export function share(s: MarketStat): number {
  return Math.round((s.advertisers / s.scanned) * 100);
}

/** Un chiffre n'est affichable que si l'échantillon le supporte. */
export function publishable(s: MarketStat): boolean {
  return s.scanned >= MIN_SAMPLE;
}

/**
 * Phrase prête à l'emploi, formulée comme un plancher mesuré et non comme
 * une vérité de marché.
 */
export function statSentence(s: MarketStat, label: string): string {
  return `Sur ${s.scanned} ${label} analysées en ${SCAN.date}, ${s.advertisers} diffusent des annonces Google Ads détectables, soit ${share(s)} %. La détection repose sur le suivi de conversion présent dans leur conteneur Google Tag Manager : une campagne sans suivi échappe au comptage, donc le chiffre réel est au moins celui-là.`;
}

/** Relevés par secteur (code NAF d'origine conservé en commentaire). */
// Totaux mis à jour le 22/09/2026 avec l'ajout de Bordeaux, Lille et
// Marseille (voir CITY_STATS ci-dessous) : ces trois villes recoupent les
// mêmes secteurs, leurs comptages sont donc additionnés ici plutôt que de
// laisser deux relevés nationaux se contredire (cas trouvé sur les
// architectes : la page Toulouse citait « aucun annonceur sur 32 cabinets »,
// devenu 2 sur 55 une fois Bordeaux et Lille intégrés — texte corrigé en
// conséquence, voir plus bas dans ce fichier ET sectors.ts).
export const SECTOR_STATS: Record<string, MarketStat> = {
  "agences-immobilieres": { scanned: 175, advertisers: 31, noAnalytics: 51, noContact: 26, noH1: 25 }, // 68.31Z
  "auto-ecoles": { scanned: 58, advertisers: 5, noAnalytics: 27, noContact: 20, noH1: 14 }, // 85.53Z
  "architectes": { scanned: 55, advertisers: 2, noAnalytics: 35, noContact: 34, noH1: 33 }, // 71.11Z
  "avocats": { scanned: 40, advertisers: 5, noAnalytics: 20, noContact: 8, noH1: 7 }, // 69.10Z
};

/** Relevés par ville — seules celles dont l'échantillon dépasse MIN_SAMPLE. */
export const CITY_STATS: Record<string, MarketStat> = {
  lyon: { scanned: 64, advertisers: 7, noAnalytics: 29, noContact: 15, noH1: 14 },
  paris: { scanned: 43, advertisers: 6, noAnalytics: 18, noContact: 7, noH1: 7 },
  rennes: { scanned: 36, advertisers: 4, noAnalytics: 16, noContact: 9, noH1: 6 },
  nantes: { scanned: 35, advertisers: 2, noAnalytics: 15, noContact: 7, noH1: 4 },
  toulouse: { scanned: 34, advertisers: 4, noAnalytics: 15, noContact: 8, noH1: 8 },
  bordeaux: { scanned: 122, advertisers: 25, noAnalytics: 56, noContact: 40, noH1: 31 },
  lille: { scanned: 59, advertisers: 11, noAnalytics: 20, noContact: 17, noH1: 19 },
  marseille: { scanned: 68, advertisers: 13, noAnalytics: 31, noContact: 27, noH1: 14 },
};
