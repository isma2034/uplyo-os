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
export const SECTOR_STATS: Record<string, MarketStat> = {
  "agences-immobilieres": { scanned: 105, advertisers: 11, noAnalytics: 24, noContact: 7, noH1: 10 }, // 68.31Z
  "auto-ecoles": { scanned: 45, advertisers: 3, noAnalytics: 20, noContact: 16, noH1: 9 }, // 85.53Z
  "architectes": { scanned: 32, advertisers: 0, noAnalytics: 21, noContact: 18, noH1: 18 }, // 71.11Z
  "avocats": { scanned: 27, advertisers: 3, noAnalytics: 15, noContact: 5, noH1: 4 }, // 69.10Z
};

/** Relevés par ville — seules celles dont l'échantillon dépasse MIN_SAMPLE. */
export const CITY_STATS: Record<string, MarketStat> = {
  lyon: { scanned: 64, advertisers: 7, noAnalytics: 29, noContact: 15, noH1: 14 },
  paris: { scanned: 43, advertisers: 6, noAnalytics: 18, noContact: 7, noH1: 7 },
  rennes: { scanned: 36, advertisers: 4, noAnalytics: 16, noContact: 9, noH1: 6 },
  nantes: { scanned: 35, advertisers: 2, noAnalytics: 15, noContact: 7, noH1: 4 },
  toulouse: { scanned: 34, advertisers: 4, noAnalytics: 15, noContact: 8, noH1: 8 },
};
