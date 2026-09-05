/**
 * Structures de données du second étage d'audit (outil interne, hors ligne).
 *
 * ── Pourquoi ce code vit dans scripts/ et pas dans src/
 * Il n'est JAMAIS importé par une route Next.js. Le chemin public
 * (/api/audit-check → src/lib/site-check.ts) reste un accusé de réception
 * minimal : une requête, une page, pas de PageSpeed. Le brancher sur cet
 * étage-ci ré-ouvrirait deux problèmes déjà payés au prix fort sur ce projet :
 * la clé PageSpeed est à quota partagé, et un crawl sans limite de débit a
 * mis un site de prospect hors ligne pendant 2 h. La frontière est physique :
 * rien sous scripts/ n'est déployé.
 *
 * ── Le point central : le type Finding
 * Un constat ne se réduit pas à une valeur mesurée. Il porte, par
 * construction :
 *   - sa GRAVITÉ (`severity`) ;
 *   - la ou les PAGES concernées (`pages`) ;
 *   - s'il est SYSTÉMIQUE ou ISOLÉ (`systemic`, `pagesAffected`/`pagesTested`) ;
 *   - sa CONSÉQUENCE BUSINESS en clair (`consequence`) ;
 *   - son STATUT de mesure (`status`) : une mesure ratée est « indisponible »
 *     avec son motif, jamais estimée, jamais présentée comme un résultat ;
 *   - deux attributs de tri : `impactAds` et `destination`.
 *
 * ── La règle de tri, codée comme un filtre (voir findings.ts)
 * Tout constat qui ne se traduit pas par « et voilà ce que ça vous coûte »
 * descend en annexe. Seuls les constats `bloquant` ou `couteux` peuvent monter
 * au corps du rapport, plafonnés à 3, triés par coût décroissant — pas par
 * facilité de correction. `destination` n'est donc jamais écrit à la main :
 * il est calculé, en un seul endroit.
 */

export type Severity = "critique" | "majeur" | "mineur" | "info";

export type FindingStatus =
  /** Un défaut constaté. */
  | "probleme"
  /** Contrôle passé : rien à signaler. */
  | "conforme"
  /** La mesure n'a pas pu être faite. Aucune valeur inventée. */
  | "indisponible";

export type FindingCategory =
  | "conversion"
  | "indexation"
  | "vitesse"
  | "contact"
  | "geo"
  | "contenu"
  | "technique";

/**
 * Coût pour un annonceur qui paie déjà ses clics.
 *  - `bloquant`   : l'argent dépensé ne peut pas produire de résultat, ou le
 *                   résultat est invisible. Rien d'autre ne se corrige avant.
 *  - `couteux`    : la dépense produit moins qu'elle ne devrait, de façon
 *                   mesurable.
 *  - `cosmetique` : vrai constat technique, sans conséquence chiffrable sur la
 *                   dépense publicitaire. N'a rien à faire dans le corps du
 *                   rapport.
 */
export type ImpactAds = "bloquant" | "couteux" | "cosmetique";

export type Destination = "corps" | "annexe";

export type Finding = {
  /** Clé stable, utilisable pour rebrancher une formulation externe. */
  id: string;
  category: FindingCategory;
  severity: Severity;
  status: FindingStatus;
  /** Libellé court et factuel. */
  label: string;
  /** Le fait mesuré, brut, vérifiable. */
  evidence: string;
  /**
   * Conséquence business en français clair. Vide = le constat n'a pas de
   * traduction commerciale : le filtre le renvoie automatiquement en annexe.
   */
  consequence: string;
  impactAds: ImpactAds;
  /** Calculé par assignDestinations(), jamais renseigné à la main. */
  destination: Destination;
  /**
   * Rang de coût, échelle relative 0-100, servant UNIQUEMENT à ordonner les
   * constats entre eux. Ce n'est pas une mesure, ce n'est pas un euro, et il
   * n'apparaît jamais dans le rapport remis au client.
   */
  costRank: number;
  /** "site" = constat global ; "page" = rattaché à des URL précises. */
  scope: "site" | "page";
  pages: string[];
  /**
   * true  = présent sur toutes les pages analysées (défaut systémique)
   * false = présent sur une partie seulement (défaut isolé)
   * null  = non applicable (constat de niveau site, ou une seule page lue)
   */
  systemic: boolean | null;
  pagesAffected: number;
  pagesTested: number;
};

/**
 * Constats volontairement SORTIS du rapport client.
 *
 * Couverture des attributs `alt` et nombre de H1 : ce sont de vrais faits,
 * utiles pour chiffrer un devis (volume de travail rédactionnel), mais les
 * présenter à un artisan comme un problème c'est vendre du jargon. Ils
 * restent ici, dans une section interne.
 */
export type InternalNote = {
  label: string;
  detail: string;
};

export type PageRole = "accueil" | "decouverte";

/**
 * Test du chemin de contact : ce qu'un visiteur venu d'une annonce doit faire
 * pour aboutir à une demande. C'est la seule partie de l'audit qui mesure la
 * conversion elle-même, et pas sa mesure.
 */
export type ContactPath = {
  /** Position du premier lien tel: dans l'ordre du document. */
  firstTelInHeader: boolean;
  /** Rang du premier lien tel: parmi les éléments du <body>, en pourcentage. */
  firstTelBodyPercent: number | null;
  telLinks: number;
  telNumbers: string[];
  mailtoLinks: number;
  whatsappLinks: number;
  /** Lien vers une page contact / devis dans la page. */
  linksToContactPage: number;
  /** Formulaires hors recherche, avec le détail de leurs champs. */
  forms: FormShape[];
};

export type FormShape = {
  /** Repère lisible : id, name, ou classe du <form>. */
  hint: string;
  /** Champs saisissables visibles (hidden, submit et boutons exclus). */
  visibleFields: number;
  requiredFields: number;
  hasFileUpload: boolean;
  /** Champs repérés comme téléphone / email, utile pour juger la friction. */
  fieldNames: string[];
};

/**
 * Cohérence géographique. Un artisan dont la page ne dit pas où il intervient
 * paie des clics hors zone.
 */
export type GeoSignals = {
  /** Codes postaux suivis d'un nom de commune, trouvés dans le texte. */
  postalCodesInText: string[];
  /** PostalAddress en JSON-LD (code postal + commune si présents). */
  jsonLdPostalAddress: string[];
  /** areaServed déclaré en JSON-LD. */
  jsonLdAreaServed: string[];
  /** Communes citées, déduites des deux sources ci-dessus, comptées en texte. */
  citiesMentioned: Array<{ name: string; occurrences: number }>;
};

export type PageReport = {
  role: PageRole;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  ok: boolean;
  /** Renseigné uniquement si ok = false. */
  failureReason: string | null;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  h1Texts: string[];
  canonical: string | null;
  canonicalResolved: string | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  noindex: boolean;
  htmlLang: string | null;
  viewport: string | null;
  viewportBlocksZoom: boolean;
  jsonLdBlocks: number;
  jsonLdTypes: string[];
  images: { total: number; noAlt: number; emptyAlt: number };
  mixedContent: string[];
  wordCount: number;
  htmlBytes: number;
  truncated: boolean;
  elapsedMs: number;
  cms: { generator: string | null; fingerprints: string[]; server: string | null };
  contact: ContactPath;
  geo: GeoSignals;
  tracking: PageTrackingSignals;
};

export type PageTrackingSignals = {
  /** Niveau 1 : la balise Google est chargée (gtag/js ou gtm.js). */
  googleTagLoaders: string[];
  ga4Ids: string[];
  universalAnalyticsIds: string[];
  gtmIds: string[];
  /** Niveau 2 : identifiant annonceur AW-XXXXXXXXX. */
  adsConversionIds: string[];
  /** Niveau 3 : paires AW-XXXXXXXXX/Label — une conversion réellement définie. */
  adsSendToPairs: string[];
  /** Autres traces d'un annonceur (remarketing, googleadservices…). */
  adsSignals: string[];
  otherAnalytics: string[];
  metaPixel: boolean;
  /** Niveau 4 : CMP identifiée + Consent Mode. */
  consentPlatforms: string[];
  consentModeInPage: boolean;
  callTrackingVendors: string[];
  formVendors: string[];
  telLinksWithInlineHandler: number;
  /** Événement de conversion écrit en dur dans la page (gtag/fbq/dataLayer). */
  inlineConversionEvents: string[];
};

export type GtmContainerReport = {
  checked: boolean;
  readable: boolean;
  containerId: string | null;
  reason: string | null;
  bytes: number;
  adsConversionIds: string[];
  /** Paires AW-XXXXXXXXX/Label, forme utilisée par gtag (rare en conteneur). */
  adsSendToPairs: string[];
  /**
   * Nombre de tags dont le modèle est `__awct` (Google Ads Conversion
   * Tracking). C'est LA preuve utilisable qu'une conversion est définie dans
   * un conteneur — voir l'en-tête de tracking.ts.
   */
  adsConversionTags: number;
  /** Étiquettes de conversion (`vtp_conversionLabel`) trouvées dans ces tags. */
  conversionLabels: string[];
  hasAdsTags: boolean;
  ga4Ids: string[];
  hasFormSubmitTrigger: boolean;
  hasLinkClickTrigger: boolean;
  hasElementVisibilityTrigger: boolean;
  /**
   * L'API de consentement Google est présente dans le conteneur. Vrai pour
   * TOUS les conteneurs, configurés ou non : ce champ est informatif et n'est
   * jamais utilisé pour conclure quoi que ce soit sur le Consent Mode.
   */
  consentApiPresent: boolean;
  conversionEventNames: string[];
};

/**
 * La mesure décomposée en 4 niveaux.
 *
 * Aucun de ces niveaux, pris isolément, ne fait un argument commercial. Ce qui
 * vend, c'est l'ÉCART entre eux : « votre balise Ads est en place, mais aucune
 * conversion n'est définie ». D'où cette structure, qui expose les 4 niveaux
 * séparément pour que findings.ts n'ait qu'à lire les écarts.
 */
export type AdsLevels = {
  /** N1 — la balise Google est chargée. */
  googleTag: { present: boolean; evidence: string[] };
  /** N2 — un identifiant annonceur Ads est présent. */
  adsId: {
    present: boolean;
    ids: string[];
    source: "page" | "conteneur_gtm" | "page+conteneur_gtm" | "aucun";
  };
  /**
   * N3 — une conversion est RÉELLEMENT définie.
   * null = impossible de conclure (conteneur GTM présent mais illisible).
   */
  conversionDefined: { present: boolean | null; evidence: string[]; reason: string };
  /** N4 — GA4 + Consent Mode + CMP. */
  consent: { ga4Ids: string[]; consentMode: boolean; cmp: string[] };
};

export type TrackingReport = {
  levels: AdsLevels;
  analytics: {
    ga4Ids: string[];
    universalAnalyticsIds: string[];
    gtmIds: string[];
    others: string[];
    metaPixel: boolean;
  };
  callTracking: {
    telLinksTotal: number;
    telLinksWithInlineHandler: number;
    telNumbers: string[];
    vendors: string[];
    /** null = impossible de conclure (voir gtm.reason). */
    tracked: boolean | null;
  };
  formTracking: {
    formsTotal: number;
    vendors: string[];
    inlineConversionEvents: string[];
    formSubmitTriggerInGtm: boolean | null;
    tracked: boolean | null;
  };
  gtm: GtmContainerReport;
};

export type RobotsReport = {
  status: "present" | "absent" | "indisponible";
  url: string;
  httpStatus: number | null;
  reason: string | null;
  disallowRules: string[];
  blocksEverything: boolean;
  blocksAdsBot: boolean;
  adsBotGroupPresent: boolean;
  sitemapUrls: string[];
  /**
   * Crawl-delay demandé par le site. Googlebot l'ignore, nous non : sur ce
   * projet, un crawl sans limite de débit a mis un site de prospect hors ligne
   * pendant 2 h. Quand le site demande un délai, on le respecte.
   */
  crawlDelaySeconds: number | null;
  /** URL analysées que robots.txt interdit à Googlebot. */
  blockedAnalyzedPages: string[];
};

export type SitemapReport = {
  status: "present" | "absent" | "indisponible";
  url: string | null;
  source: "robots.txt" | "chemin_standard" | null;
  httpStatus: number | null;
  reason: string | null;
  isIndex: boolean;
  declaredUrls: number;
  sampleUrls: string[];
};

/**
 * Le domaine répond-il en http:// sans rediriger vers https:// ?
 * Contrôle à part : il ne se voit pas en lisant la page https.
 */
export type HttpRedirectReport = {
  status: "redirige" | "ne_redirige_pas" | "injoignable" | "non_teste";
  from: string;
  to: string | null;
  httpStatus: number | null;
  reason: string | null;
};

/**
 * Vitesse. Mobile uniquement, JAMAIS de score /100 : c'est du jargon et une
 * fausse autorité. Le champ n'existe pas dans ce type, précisément pour qu'il
 * ne puisse pas fuiter dans un rapport. Tout est exprimé en secondes, avec le
 * seuil Google de 2,5 s comme repère.
 *
 * La donnée TERRAIN (CrUX) est l'atout de crédibilité maximal : ce sont les
 * temps vécus par de vrais visiteurs. Son absence est elle-même une
 * information commerciale, pas un trou dans le rapport.
 */
export type SpeedReport =
  | {
      status: "indisponible";
      /** Motif technique : clé absente, quota, hors délai, erreur Google. */
      reason: string;
      strategy: "mobile";
    }
  | {
      status: "mesure";
      strategy: "mobile";
      /** URL réellement mesurée par Google (après ses propres redirections). */
      measuredUrl: string | null;
      /** Laboratoire (Lighthouse), en millisecondes. */
      lcpMs: number | null;
      clsScore: number | null;
      tbtMs: number | null;
      fcpMs: number | null;
      /** Terrain (CrUX) sur l'URL. null = Google n'en publie pas. */
      fieldDataCategory: string | null;
      fieldLcpMs: number | null;
      fieldInpMs: number | null;
      fieldClsScore: number | null;
      /** Terrain sur l'ORIGINE (tout le domaine). */
      originFieldDataCategory: string | null;
      originFieldLcpMs: number | null;
      elapsedMs: number;
    };

export type SiteAudit = {
  /** false = pas même la page d'accueil n'a pu être lue. */
  ok: boolean;
  input: string;
  origin: string | null;
  failureReason: string | null;
  startedAt: string;
  pages: PageReport[];
  pagesTested: number;
  discovery: {
    method: "sitemap" | "liens_internes" | "aucune";
    candidatesConsidered: number;
    note: string;
  };
  robots: RobotsReport;
  sitemap: SitemapReport;
  httpRedirect: HttpRedirectReport;
  tracking: TrackingReport | null;
  speed: SpeedReport;
  findings: Finding[];
  internalNotes: InternalNote[];
  requestsUsed: number;
  trace: string[];
  elapsedMs: number;
};
