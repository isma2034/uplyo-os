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
  /** Mois du relevé, à citer sur chaque page qui affiche un chiffre. */
  date: "septembre 2026",
} as const;

export type MarketStat = {
  /** Entreprises analysées. */
  scanned: number;
  /** Annonceurs Google Ads confirmés par lecture du conteneur GTM. */
  advertisers: number;
};

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
  "agences-immobilieres": { scanned: 105, advertisers: 11 }, // 68.31Z
  "auto-ecoles": { scanned: 45, advertisers: 3 }, // 85.53Z
  "architectes": { scanned: 32, advertisers: 0 }, // 71.11Z
  "avocats": { scanned: 27, advertisers: 3 }, // 69.10Z
};

/** Relevés par ville — seules celles dont l'échantillon dépasse MIN_SAMPLE. */
export const CITY_STATS: Record<string, MarketStat> = {
  lyon: { scanned: 64, advertisers: 7 },
  paris: { scanned: 43, advertisers: 6 },
  rennes: { scanned: 36, advertisers: 4 },
  nantes: { scanned: 35, advertisers: 2 },
  toulouse: { scanned: 34, advertisers: 4 },
};
