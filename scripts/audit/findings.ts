/**
 * Transformation des mesures brutes en CONSTATS exploitables.
 *
 * C'est ici, et nulle part ailleurs, que se décident la gravité, la portée
 * (systémique ou isolé), la conséquence business et le classement corps /
 * annexe. La collecte en amont ne produit que des faits ; le rendu en aval ne
 * fait qu'afficher.
 *
 * ── La règle centrale, codée comme un filtre
 * « Tout constat qui ne se traduit pas par : et voilà ce que ça vous coûte,
 * descend en annexe. » Deux mécanismes la tiennent :
 *   1. `consequence` vide ⇒ annexe automatique. Un constat sans traduction
 *      commerciale ne peut pas remonter, même en le voulant ;
 *   2. `assignDestinations()` est le SEUL endroit où `destination` est écrit :
 *      seuls `bloquant` et `couteux` sont éligibles, plafonnés à 3, triés par
 *      coût décroissant — pas par facilité de correction. Un défaut cher et
 *      pénible à réparer passe devant un défaut gratuit et anodin.
 *
 * ── Trois règles tenues strictement
 *  1. une mesure ratée produit `status: "indisponible"` avec son motif —
 *     jamais une valeur estimée, jamais un « probablement » ;
 *  2. la gravité d'un défaut de conversion monte quand le prospect est un
 *     annonceur avéré : le même défaut ne coûte pas la même chose selon qu'on
 *     paie ou non pour le trafic ;
 *  3. un défaut n'est déclaré systémique que si toutes les pages RÉELLEMENT
 *     lues le portent — avec une seule page lue, `systemic` reste null.
 *
 * ── Ce qui est volontairement SORTI du rapport client
 * La couverture des attributs `alt` et le NOMBRE de H1 ne sont pas des
 * constats : ce sont des éléments de chiffrage. Ils partent dans
 * `internalNotes()`, pas dans les findings.
 */

import type {
  ContactPath,
  Finding,
  FindingCategory,
  GeoSignals,
  HttpRedirectReport,
  ImpactAds,
  InternalNote,
  PageReport,
  RobotsReport,
  Severity,
  SiteAudit,
  SitemapReport,
  SpeedReport,
  TrackingReport,
} from "./types.ts";

/** Plafond du corps du rapport. Trois constats, pas quatre. */
export const MAX_CORPS = 3;

/**
 * Rangs de coût. Échelle relative 0-100, uniquement destinée à ordonner les
 * constats entre eux : ce n'est pas une mesure et cela n'apparaît jamais dans
 * le document remis au client. L'ordre encode un jugement commercial, pas une
 * difficulté technique — « le compte tourne à vide » passe avant « la page est
 * lente », qui passe avant « le titre est trop court ».
 */
const COST = {
  ADS_NO_CONVERSION: 95,
  ROBOTS_BLOCKS_ALL: 92,
  NOINDEX: 90,
  ADSBOT_BLOCKED: 88,
  FIELD_SLOW: 84,
  LAB_LCP_VERY_SLOW: 80,
  FIELD_CLS: 74,
  FIELD_INP: 71,
  CALLS_NOT_TRACKED: 78,
  FORMS_NOT_TRACKED: 76,
  NO_CONSENT: 72,
  HTTP_NOT_REDIRECTED: 70,
  NO_TEL_LINK: 68,
  TEL_BURIED: 64,
  NO_GEO: 62,
  FORM_TOO_LONG: 60,
  LAB_LCP_SLOW: 56,
  TITLE_DUPLICATE: 54,
  TITLE_MISSING: 52,
  TAG_WITHOUT_ADS_ID: 50,
  TITLE_GENERIC: 48,
  H1_MISSING: 46,
  MIXED_CONTENT: 42,
  NO_CONTACT_CHANNEL: 40,
  COSMETIC: 10,
} as const;

type Draft = {
  id: string;
  category: FindingCategory;
  severity: Severity;
  status?: Finding["status"];
  label: string;
  evidence: string;
  /** Vide = pas de traduction commerciale ⇒ annexe automatique. */
  consequence?: string;
  impactAds: ImpactAds;
  costRank: number;
  scope?: "site" | "page";
  pages?: string[];
  pagesTested: number;
};

function mk(d: Draft): Finding {
  const pages = d.pages ?? [];
  const scope = d.scope ?? (pages.length > 0 ? "page" : "site");
  const status = d.status ?? "probleme";
  const systemic =
    scope === "site" || d.pagesTested <= 1 || status !== "probleme"
      ? null
      : pages.length >= d.pagesTested;
  return {
    id: d.id,
    category: d.category,
    severity: d.severity,
    status,
    label: d.label,
    evidence: d.evidence,
    consequence: d.consequence ?? "",
    impactAds: d.impactAds,
    // Recalculé par assignDestinations(). Valeur de départ volontairement
    // pessimiste : rien ne monte au corps par défaut.
    destination: "annexe",
    costRank: d.costRank,
    scope,
    pages,
    systemic,
    pagesAffected: pages.length,
    pagesTested: d.pagesTested,
  };
}

/**
 * LE filtre. Seul endroit du programme où `destination` est décidé.
 */
export function assignDestinations(findings: Finding[]): Finding[] {
  const eligible = findings
    .filter(
      (f) =>
        f.status === "probleme" &&
        (f.impactAds === "bloquant" || f.impactAds === "couteux") &&
        f.consequence.trim().length > 0
    )
    .sort((a, b) => b.costRank - a.costRank);

  const promoted: Record<string, true> = {};
  for (let i = 0; i < eligible.length && i < MAX_CORPS; i++) promoted[eligible[i].id] = true;

  return findings.map((f) => ({ ...f, destination: promoted[f.id] ? "corps" : "annexe" }));
}

function short(url: string): string {
  try {
    const u = new URL(url);
    return (u.pathname + u.search) || "/";
  } catch {
    return url;
  }
}

function list(values: string[], cap = 3): string {
  const shown = values.slice(0, cap).join(", ");
  return values.length > cap ? `${shown} (+${values.length - cap})` : shown;
}

function sec(ms: number): string {
  return `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
}

function pagesWhere(pages: PageReport[], pred: (p: PageReport) => boolean): string[] {
  const out: string[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].ok && pred(pages[i])) out.push(pages[i].finalUrl);
  }
  return out;
}

// ── 1. Google Ads : l'écart entre les 4 niveaux ────────────────────────────

/**
 * La phrase qui vend n'est aucun des 4 niveaux pris isolément, c'est l'ÉCART
 * entre eux. Cette fonction ne produit donc pas « N1 ok, N2 ok, N3 absent » :
 * elle produit le constat de l'écart, formulé du point de vue de la facture.
 */
function adsFindings(t: TrackingReport, n: number): Finding[] {
  const out: Finding[] = [];
  const L = t.levels;
  const advertiser = L.adsId.present;

  // Écart N2 → N3 : le constat le plus vendeur de tout l'audit.
  if (advertiser && L.conversionDefined.present === false) {
    out.push(
      mk({
        id: "ads.gap_id_without_conversion",
        category: "conversion",
        severity: "critique",
        label: "Identifiant Google Ads en place, aucune conversion définie",
        evidence: `Identifiant annonceur ${L.adsId.ids.join(", ")} trouvé (source : ${L.adsId.source.replace(
          /_/g,
          " "
        )}). ${L.conversionDefined.reason}`,
        consequence:
          "Google reçoit votre argent sans vous dire quelles annonces produisent des demandes. Les enchères s'optimisent sur des clics, pas sur des clients : vous payez au même prix la recherche qui appelle et celle qui repart.",
        impactAds: "bloquant",
        costRank: COST.ADS_NO_CONVERSION,
        pagesTested: n,
      })
    );
  }

  // Écart N1 → N2 : la balise est là, l'identifiant annonceur non.
  if (L.googleTag.present && !advertiser) {
    out.push(
      mk({
        id: "ads.gap_tag_without_id",
        category: "conversion",
        severity: "majeur",
        label: "Balise Google présente, aucun identifiant Google Ads",
        evidence: `Balise chargée (${list(L.googleTag.evidence, 4)}), mais aucun identifiant AW- trouvé, ni dans les pages, ni dans le conteneur GTM${
          t.gtm.readable ? " (lu en entier)" : " (non lu)"
        }.`,
        consequence:
          "La mesure d'audience est installée, la partie publicitaire ne l'est pas. Si des campagnes tournent, rien ne relie leurs clics à ce qui se passe ensuite sur le site.",
        impactAds: "couteux",
        costRank: COST.TAG_WITHOUT_ADS_ID,
        pagesTested: n,
      })
    );
  }

  // N3 indéterminé : on le dit, on ne devine pas.
  if (advertiser && L.conversionDefined.present === null) {
    out.push(
      mk({
        id: "ads.conversion_undetermined",
        category: "conversion",
        severity: "majeur",
        status: "indisponible",
        label: "Conversion Google Ads non vérifiable publiquement",
        evidence: `Identifiant annonceur ${L.adsId.ids.join(", ")} présent. ${L.conversionDefined.reason}`,
        consequence: "",
        impactAds: "couteux",
        costRank: COST.ADS_NO_CONVERSION - 1,
        pagesTested: n,
      })
    );
  }

  // Écart N3 → N4 : conversions définies mais mesure dégradée faute de
  // consentement correctement câblé.
  if (advertiser && L.consent.cmp.length === 0 && !L.consent.consentMode) {
    out.push(
      mk({
        id: "ads.gap_no_consent",
        category: "conversion",
        severity: "majeur",
        label: "Tags publicitaires sans plateforme de consentement ni Consent Mode",
        evidence:
          "Aucune CMP connue (Axeptio, Tarteaucitron, Cookiebot, Complianz, Didomi…) et aucun appel gtag('consent') repérés, alors que des tags publicitaires sont chargés.",
        consequence:
          "Double coût : exposition réglementaire côté CNIL, et depuis mars 2024 Google dégrade la remontée des conversions en Europe quand le mode consentement est absent. Une partie des demandes déjà mesurées ne parvient jamais au compte.",
        impactAds: "couteux",
        costRank: COST.NO_CONSENT,
        pagesTested: n,
      })
    );
  }

  // État conforme : utile au rapport, mais sans coût ⇒ jamais dans le corps.
  if (advertiser && L.conversionDefined.present === true) {
    out.push(
      mk({
        id: "ads.conversion_defined",
        category: "conversion",
        severity: "info",
        status: "conforme",
        label: "Au moins une conversion Google Ads est définie",
        evidence: `${L.adsId.ids.join(", ")} — preuves : ${list(L.conversionDefined.evidence, 3)}.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  }

  // ── Appels et formulaires : quelles conversions manquent ────────────────
  if (t.callTracking.telLinksTotal > 0 && t.callTracking.tracked === false) {
    out.push(
      mk({
        id: "conversion.calls_not_tracked",
        category: "conversion",
        severity: advertiser ? "critique" : "majeur",
        label: "Les appels téléphoniques ne sont pas comptés",
        evidence: `${t.callTracking.telLinksTotal} lien(s) tel: sur les pages lues (${list(
          t.callTracking.telNumbers,
          2
        )}), aucun déclencheur de suivi — ni en page, ni dans le conteneur GTM lu, ni via un prestataire de call tracking.`,
        consequence:
          "Dans un métier où l'on convertit au téléphone, c'est la conversion principale qui n'existe pas dans les chiffres. Le coût par client affiché est faux, et toujours dans le sens qui vous dessert.",
        impactAds: advertiser ? "bloquant" : "couteux",
        costRank: COST.CALLS_NOT_TRACKED,
        pagesTested: n,
      })
    );
  }

  if (t.formTracking.formsTotal > 0 && t.formTracking.tracked === false) {
    out.push(
      mk({
        id: "conversion.forms_not_tracked",
        category: "conversion",
        severity: advertiser ? "critique" : "majeur",
        label: "Les envois de formulaire ne sont pas comptés",
        evidence: `${t.formTracking.formsTotal} formulaire(s) hors recherche${
          t.formTracking.vendors.length ? ` (${list(t.formTracking.vendors)})` : ""
        }, aucun événement de conversion associé — ni en page, ni dans le conteneur GTM lu.`,
        consequence:
          "Les demandes de devis reçues n'apparaissent nulle part dans les statistiques. Impossible de dire quelle campagne les a produites, donc impossible de couper celles qui ne produisent rien.",
        impactAds: advertiser ? "bloquant" : "couteux",
        costRank: COST.FORMS_NOT_TRACKED,
        pagesTested: n,
      })
    );
  }

  return out;
}

// ── 2. Chemin de contact ───────────────────────────────────────────────────

function aggregateContact(pages: PageReport[]): ContactPath {
  const acc: ContactPath = {
    firstTelInHeader: false,
    firstTelBodyPercent: null,
    telLinks: 0,
    telNumbers: [],
    mailtoLinks: 0,
    whatsappLinks: 0,
    linksToContactPage: 0,
    forms: [],
  };
  for (let i = 0; i < pages.length; i++) {
    if (!pages[i].ok) continue;
    const c = pages[i].contact;
    acc.telLinks += c.telLinks;
    acc.mailtoLinks += c.mailtoLinks;
    acc.whatsappLinks += c.whatsappLinks;
    acc.linksToContactPage += c.linksToContactPage;
    if (c.firstTelInHeader) acc.firstTelInHeader = true;
    if (
      c.firstTelBodyPercent !== null &&
      (acc.firstTelBodyPercent === null || c.firstTelBodyPercent < acc.firstTelBodyPercent)
    ) {
      acc.firstTelBodyPercent = c.firstTelBodyPercent;
    }
    for (let j = 0; j < c.telNumbers.length; j++) {
      if (acc.telNumbers.indexOf(c.telNumbers[j]) < 0) acc.telNumbers.push(c.telNumbers[j]);
    }
    for (let j = 0; j < c.forms.length; j++) acc.forms.push(c.forms[j]);
  }
  return acc;
}

/**
 * Seuil de 15 % : c'est l'ordre de grandeur de l'en-tête et du premier bloc
 * d'une page classique. Au-delà, le numéro n'est pas visible sans faire
 * défiler. Le rang est documentaire, pas pixellaire — voir page.ts.
 */
const TEL_TOP_THRESHOLD = 15;

function contactFindings(pages: PageReport[], n: number): Finding[] {
  const out: Finding[] = [];
  const okPages = pages.filter((p) => p.ok);
  if (okPages.length === 0) return out;
  const c = aggregateContact(pages);

  if (c.telLinks === 0) {
    out.push(
      mk({
        id: "contact.no_tel_link",
        category: "contact",
        severity: "majeur",
        label: "Aucun numéro cliquable",
        evidence: `Aucun lien tel: sur les ${n} page(s) lues.`,
        consequence:
          "Sur téléphone, appeler oblige à recopier un numéro à la main. À ce stade du parcours, le clic est déjà payé : la friction se paie une seconde fois, en demande perdue.",
        impactAds: "couteux",
        costRank: COST.NO_TEL_LINK,
        pages: okPages.map((p) => p.finalUrl),
        pagesTested: n,
      })
    );
  } else if (!c.firstTelInHeader && c.firstTelBodyPercent !== null && c.firstTelBodyPercent > TEL_TOP_THRESHOLD) {
    out.push(
      mk({
        id: "contact.tel_buried",
        category: "contact",
        severity: "majeur",
        label: "Le numéro n'est pas en haut de page",
        evidence: `Premier lien tel: au rang ${c.firstTelBodyPercent} % des éléments du corps de page, hors en-tête (seuil retenu : ${TEL_TOP_THRESHOLD} %).`,
        consequence:
          "Le visiteur venu d'une annonce doit chercher le moyen de vous joindre. C'est le seul geste qu'on lui demande, et il n'est pas là où il regarde en premier.",
        impactAds: "couteux",
        costRank: COST.TEL_BURIED,
        pagesTested: n,
      })
    );
  }

  if (c.telLinks === 0 && c.forms.length === 0 && c.mailtoLinks === 0 && c.whatsappLinks === 0) {
    out.push(
      mk({
        id: "contact.no_channel",
        category: "contact",
        severity: "critique",
        label: "Aucun moyen de contact direct sur les pages lues",
        evidence: `Ni lien tel:, ni formulaire hors recherche, ni mailto:, ni WhatsApp sur ${n} page(s).`,
        consequence:
          "Un visiteur qui veut vous joindre ne peut pas. Tout budget publicitaire envoyé sur ces pages est dépensé sans issue possible.",
        impactAds: "bloquant",
        costRank: COST.NO_CONTACT_CHANNEL + 40,
        pagesTested: n,
      })
    );
  }

  // Formulaires trop longs. On ne cite aucun pourcentage d'abandon : aucune
  // étude propre à ce site n'existe, et inventer un chiffre décrédibilise le
  // reste. Le fait brut suffit.
  const heavyForms = c.forms.filter((f) => f.requiredFields >= 6 || f.visibleFields >= 10);
  if (heavyForms.length > 0) {
    out.push(
      mk({
        id: "contact.form_too_long",
        category: "contact",
        severity: "majeur",
        label: "Formulaire long pour une simple demande",
        evidence: heavyForms
          .map(
            (f) =>
              `« ${f.hint} » : ${f.visibleFields} champ(s) visible(s), ${f.requiredFields} obligatoire(s)${
                f.hasFileUpload ? ", dont un envoi de fichier" : ""
              } — ${list(f.fieldNames, 6)}`
          )
          .join(" ; "),
        consequence:
          "Chaque champ obligatoire est une occasion d'abandonner, sur un écran de téléphone plus encore. Un prospect qui voulait un ordre de prix renonce avant d'avoir écrit son besoin.",
        impactAds: "couteux",
        costRank: COST.FORM_TOO_LONG,
        pagesTested: n,
      })
    );
  }

  // Constat de contexte : sans coût, donc annexe par construction.
  out.push(
    mk({
      id: "contact.inventory",
      category: "contact",
      severity: "info",
      status: "conforme",
      label: "Inventaire des points de contact",
      evidence: `${c.telLinks} lien(s) tel: (${list(c.telNumbers, 3) || "aucun numéro lisible"}), ${
        c.forms.length
      } formulaire(s) hors recherche, ${c.mailtoLinks} mailto:, ${c.whatsappLinks} lien(s) WhatsApp, ${
        c.linksToContactPage
      } lien(s) vers une page contact/devis${
        c.firstTelInHeader ? " — numéro présent dans l'en-tête" : ""
      }.`,
      consequence: "",
      impactAds: "cosmetique",
      costRank: COST.COSMETIC,
      pagesTested: n,
    })
  );

  return out;
}

// ── 3. Vitesse — mobile, en secondes, sans score ───────────────────────────

/** Seuils publics de Google pour les Core Web Vitals, mobile. */
const LCP_GOOGLE_THRESHOLD_MS = 2500;
const LCP_POOR_MS = 4000;
const CLS_GOOGLE_THRESHOLD = 0.1;
const INP_GOOGLE_THRESHOLD_MS = 200;

function speedFindings(speed: SpeedReport, n: number): Finding[] {
  if (speed.status === "indisponible") {
    return [
      mk({
        id: "speed.unavailable",
        category: "vitesse",
        severity: "majeur",
        status: "indisponible",
        label: "Vitesse mobile non mesurée",
        evidence: speed.reason,
        consequence: "",
        impactAds: "couteux",
        costRank: COST.LAB_LCP_SLOW,
        pagesTested: n,
      }),
    ];
  }

  const out: Finding[] = [];

  // ── Donnée TERRAIN (CrUX) ───────────────────────────────────────────────
  // Elle prime sur le laboratoire : ce sont de vrais visiteurs, sur de vrais
  // téléphones. Mais on ne recopie PAS la catégorie globale de Google : le
  // premier relevé réel titrait « expérience lente » puis citait un affichage
  // à 1,8 s, sous le seuil de 2,5 s — un constat qui se contredit en deux
  // lignes et détruit la crédibilité du reste. Chaque métrique est donc
  // comparée à son propre seuil, et seule celle qui échoue est nommée.
  const hasField =
    speed.fieldLcpMs !== null || speed.fieldInpMs !== null || speed.fieldClsScore !== null;

  if (hasField) {
    if (speed.fieldLcpMs !== null && speed.fieldLcpMs > LCP_GOOGLE_THRESHOLD_MS) {
      out.push(
        mk({
          id: "speed.field_lcp",
          category: "vitesse",
          severity: speed.fieldLcpMs > LCP_POOR_MS ? "critique" : "majeur",
          label: "Chez vos visiteurs réels, la page met du temps à s'afficher",
          evidence: `Données terrain Google (CrUX, 28 derniers jours, mobile) : contenu principal affiché en ${sec(
            speed.fieldLcpMs
          )} pour 75 % des visites. Le seuil Google est de 2,5 s.`,
          consequence:
            "Ce ne sont pas des chiffres de laboratoire, ce sont les temps vécus sur les téléphones de vos visiteurs. Une part de ceux que vous payez repart avant que la page apparaisse — le clic est facturé quand même.",
          impactAds: "couteux",
          costRank: COST.FIELD_SLOW,
          pagesTested: n,
        })
      );
    }

    if (speed.fieldClsScore !== null && speed.fieldClsScore > CLS_GOOGLE_THRESHOLD) {
      out.push(
        mk({
          id: "speed.field_cls",
          category: "vitesse",
          severity: speed.fieldClsScore > 0.25 ? "critique" : "majeur",
          label: "La page bouge sous le doigt pendant qu'elle se charge",
          evidence: `Données terrain Google (CrUX, mobile) : décalage visuel de ${speed.fieldClsScore
            .toFixed(2)
            .replace(".", ",")} pour 75 % des visites, pour un seuil de 0,1. ${
            speed.clsScore !== null && speed.clsScore <= CLS_GOOGLE_THRESHOLD
              ? `Le test en laboratoire, lui, ne le voit pas (${speed.clsScore
                  .toFixed(3)
                  .replace(".", ",")}) : le défaut n'apparaît que sur de vrais appareils.`
              : ""
          }`,
          consequence:
            "Les éléments se déplacent au moment où le visiteur va appuyer : il touche autre chose que ce qu'il visait. Sur un numéro de téléphone ou un bouton de devis, c'est un contact perdu sur un clic déjà payé.",
          impactAds: "couteux",
          costRank: COST.FIELD_CLS,
          pagesTested: n,
        })
      );
    }

    if (speed.fieldInpMs !== null && speed.fieldInpMs > INP_GOOGLE_THRESHOLD_MS) {
      out.push(
        mk({
          id: "speed.field_inp",
          category: "vitesse",
          severity: "majeur",
          label: "La page tarde à réagir quand on appuie dessus",
          evidence: `Données terrain Google (CrUX, mobile) : ${speed.fieldInpMs} ms entre l'appui et la réaction pour 75 % des visites, pour un seuil de 200 ms.`,
          consequence:
            "Le visiteur appuie sur « Appeler », rien ne se passe visiblement, il appuie encore ou il abandonne. La page fonctionne, mais elle donne l'impression d'être cassée.",
          impactAds: "couteux",
          costRank: COST.FIELD_INP,
          pagesTested: n,
        })
      );
    }

    // Récapitulatif complet, y compris ce qui va bien : en annexe.
    const parts: string[] = [];
    if (speed.fieldLcpMs !== null) parts.push(`affichage ${sec(speed.fieldLcpMs)} (seuil 2,5 s)`);
    if (speed.fieldInpMs !== null) {
      parts.push(`réaction au toucher ${speed.fieldInpMs} ms (seuil 200 ms)`);
    }
    if (speed.fieldClsScore !== null) {
      parts.push(
        `décalage visuel ${speed.fieldClsScore.toFixed(2).replace(".", ",")} (seuil 0,1)`
      );
    }
    out.push(
      mk({
        id: "speed.field_summary",
        category: "vitesse",
        severity: "info",
        status: "conforme",
        label: "Mesure terrain complète (CrUX, mobile, 28 jours)",
        evidence: `${parts.join(" · ")}${
          speed.originFieldDataCategory
            ? ` — l'ensemble du domaine est classé « ${speed.originFieldDataCategory} » par Google`
            : ""
        }.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  } else {
    // L'absence de donnée terrain est elle-même une information commerciale.
    out.push(
      mk({
        id: "speed.no_field_data",
        category: "vitesse",
        severity: "info",
        status: "indisponible",
        label: "Google ne publie pas de mesure terrain pour cette page",
        evidence: `Pas assez de visites réelles sur cette URL pour que Google publie des données CrUX${
          speed.originFieldDataCategory
            ? ` — mais l'ensemble du domaine est classé « ${speed.originFieldDataCategory} »${
                speed.originFieldLcpMs !== null ? ` (${sec(speed.originFieldLcpMs)})` : ""
              }`
            : ""
        }. Les valeurs ci-dessous sont donc des mesures de laboratoire.`,
        consequence:
          "Fait à énoncer tel quel : votre site ne reçoit pas encore assez de visiteurs réels pour que Google publie des statistiques d'expérience. C'est le point de départ, pas un défaut.",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  }

  // ── Laboratoire, en secondes. Aucun score /100 nulle part. ──────────────
  // Quand la donnée terrain existe, le laboratoire NE PEUT PAS monter au
  // corps du rapport. Sur www.mr-debarrasse.fr, le laboratoire mesure 11,3 s
  // et le terrain 1,8 s : les deux sont vrais (le laboratoire simule un
  // téléphone bridé, cache vide, réseau lent), mais les afficher côte à côte
  // comme deux constats majeurs donne un document qui se contredit. Le
  // terrain gagne, le laboratoire descend en annexe et explique l'écart.
  if (speed.lcpMs !== null && hasField) {
    out.push(
      mk({
        id: "speed.lab_lcp_context",
        category: "vitesse",
        severity: "info",
        status: "conforme",
        label: "Mesure de laboratoire, pour référence",
        evidence: `Test Lighthouse de Google sur ${
          speed.measuredUrl ?? "la page d'accueil"
        } : contenu principal à ${sec(speed.lcpMs)}${
          speed.fieldLcpMs !== null ? `, contre ${sec(speed.fieldLcpMs)} chez les visiteurs réels` : ""
        }. L'écart est normal : le test simule un téléphone d'entrée de gamme, cache vide, sur un réseau bridé. C'est le chiffre terrain qui décrit la réalité.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  } else if (speed.lcpMs !== null) {
    if (speed.lcpMs > LCP_POOR_MS) {
      out.push(
        mk({
          id: "speed.lcp_very_slow",
          category: "vitesse",
          severity: "critique",
          label: "La page met plusieurs secondes à afficher son contenu",
          evidence: `Mesure Google (mobile, laboratoire) sur ${
            speed.measuredUrl ?? "la page d'accueil"
          } : contenu principal affiché à ${sec(speed.lcpMs)}. Le seuil Google est de 2,5 s.`,
          consequence:
            "Le visiteur regarde un écran vide pendant ce temps-là, après avoir cliqué sur une annonce que vous avez payée. Sur mobile, la majorité repart avant que la page apparaisse.",
          impactAds: "couteux",
          costRank: COST.LAB_LCP_VERY_SLOW,
          pagesTested: n,
        })
      );
    } else if (speed.lcpMs > LCP_GOOGLE_THRESHOLD_MS) {
      out.push(
        mk({
          id: "speed.lcp_slow",
          category: "vitesse",
          severity: "majeur",
          label: "Affichage du contenu principal au-dessus du seuil Google",
          evidence: `Mesure Google (mobile, laboratoire) : contenu principal affiché à ${sec(
            speed.lcpMs
          )}, pour un seuil de 2,5 s.`,
          consequence:
            "Le premier contenu utile arrive après le seuil au-delà duquel les abandons augmentent nettement. Chaque dixième de seconde gagné se répercute sur le même budget publicitaire.",
          impactAds: "couteux",
          costRank: COST.LAB_LCP_SLOW,
          pagesTested: n,
        })
      );
    }
  }

  // Détails de laboratoire : vrais, utiles au correctif, sans conséquence
  // formulable seule ⇒ annexe par construction (consequence vide).
  const details: string[] = [];
  if (speed.fcpMs !== null) details.push(`premier affichage ${sec(speed.fcpMs)}`);
  if (speed.tbtMs !== null) details.push(`page bloquée par ses scripts ${speed.tbtMs} ms`);
  if (speed.clsScore !== null) {
    details.push(`stabilité visuelle ${speed.clsScore.toFixed(3).replace(".", ",")}`);
  }
  if (details.length > 0) {
    out.push(
      mk({
        id: "speed.lab_details",
        category: "vitesse",
        severity: "info",
        status: "conforme",
        label: "Détail de la mesure de laboratoire (mobile)",
        evidence: `${details.join(", ")} — mesuré en ${(speed.elapsedMs / 1000).toFixed(0)} s par Google.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  }

  return out;
}

// ── 4. Indexabilité — alertes conditionnelles uniquement ───────────────────

/**
 * Seuls trois cas montent : Disallow: /, noindex sur une page importante,
 * http:// qui ne redirige pas. Tout le reste (robots présent, sitemap,
 * canonique) est de l'information d'annexe : constater qu'un sitemap existe
 * n'a jamais fait gagner un euro à personne.
 */
function indexFindings(
  robots: RobotsReport,
  sitemap: SitemapReport,
  httpRedirect: HttpRedirectReport,
  pages: PageReport[],
  n: number
): Finding[] {
  const out: Finding[] = [];
  const okPages = pages.filter((p) => p.ok);

  const noindexPages = pagesWhere(okPages, (p) => p.noindex);
  if (noindexPages.length > 0) {
    out.push(
      mk({
        id: "index.noindex",
        category: "indexation",
        severity: "critique",
        label: "Page interdite d'indexation (noindex)",
        evidence: okPages
          .filter((p) => p.noindex)
          .map((p) => `${short(p.finalUrl)} → ${p.robotsMeta ?? p.xRobotsTag}`)
          .join(" ; "),
        consequence:
          "La page demande elle-même à Google de la retirer. Elle ne peut apparaître dans aucun résultat naturel, quel que soit son contenu — et si une annonce y mène, la cohérence du compte en pâtit.",
        impactAds: "bloquant",
        costRank: COST.NOINDEX,
        pages: noindexPages,
        pagesTested: n,
      })
    );
  }

  if (robots.status === "present" && robots.blocksEverything) {
    out.push(
      mk({
        id: "index.robots_blocks_all",
        category: "indexation",
        severity: "critique",
        label: "robots.txt interdit tout le site à Googlebot",
        evidence: `Règle « Disallow: / » applicable à Googlebot dans ${robots.url}.`,
        consequence:
          "Google a interdiction d'explorer le site. Aucune page ne peut se positionner en résultat naturel : tout le trafic doit être acheté, indéfiniment.",
        impactAds: "bloquant",
        costRank: COST.ROBOTS_BLOCKS_ALL,
        pagesTested: n,
      })
    );
  }

  if (robots.status === "present" && robots.blocksAdsBot) {
    out.push(
      mk({
        id: "ads.robots_blocks_adsbot",
        category: "indexation",
        severity: "critique",
        label: "robots.txt bloque AdsBot-Google",
        evidence: `Groupe « AdsBot-Google » avec Disallow: / dans ${robots.url}.`,
        consequence:
          "Google ne peut plus contrôler vos pages de destination : le niveau de qualité chute, le coût par clic monte, et certaines annonces peuvent être refusées.",
        impactAds: "bloquant",
        costRank: COST.ADSBOT_BLOCKED,
        pagesTested: n,
      })
    );
  }

  if (robots.status === "present" && robots.blockedAnalyzedPages.length > 0) {
    out.push(
      mk({
        id: "index.robots_blocks_page",
        category: "indexation",
        severity: "critique",
        label: "robots.txt bloque une page analysée",
        evidence: `Pages interdites à Googlebot : ${robots.blockedAnalyzedPages.join(", ")}.`,
        consequence:
          "Ces pages ne peuvent être ni explorées ni indexées. Si une campagne y envoie du trafic, Google paie et n'apprend rien.",
        impactAds: "bloquant",
        costRank: COST.ROBOTS_BLOCKS_ALL - 1,
        pages: robots.blockedAnalyzedPages,
        pagesTested: n,
      })
    );
  }

  if (httpRedirect.status === "ne_redirige_pas") {
    out.push(
      mk({
        id: "index.http_not_redirected",
        category: "indexation",
        severity: "majeur",
        label: "La version http:// du site ne redirige pas vers https://",
        evidence: `${httpRedirect.from} répond ${
          httpRedirect.httpStatus !== null ? `HTTP ${httpRedirect.httpStatus}` : "sans redirection"
        }${httpRedirect.to ? ` → ${httpRedirect.to}` : ""}.`,
        consequence:
          "Deux versions du même site coexistent. Google en indexe une, vos annonces peuvent mener à l'autre, et le navigateur y affiche « non sécurisé » — juste au moment où on demande un numéro de téléphone.",
        impactAds: "couteux",
        costRank: COST.HTTP_NOT_REDIRECTED,
        pagesTested: n,
      })
    );
  } else if (httpRedirect.status === "injoignable") {
    out.push(
      mk({
        id: "index.http_untested",
        category: "indexation",
        severity: "mineur",
        status: "indisponible",
        label: "Redirection http→https non vérifiable",
        evidence: `${httpRedirect.from} — ${httpRedirect.reason ?? "motif inconnu"}.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pagesTested: n,
      })
    );
  }

  // ── Le reste : annexe, par construction (consequence vide) ──────────────
  out.push(
    mk({
      id: "index.robots_state",
      category: "indexation",
      severity: "info",
      status: robots.status === "indisponible" ? "indisponible" : "conforme",
      label: "État du fichier robots.txt",
      evidence:
        robots.status === "present"
          ? `${robots.url} — ${robots.disallowRules.length} règle(s) Disallow pour Googlebot${
              robots.adsBotGroupPresent ? ", groupe AdsBot-Google présent" : ""
            }${
              robots.crawlDelaySeconds !== null
                ? `, Crawl-delay ${robots.crawlDelaySeconds} s (respecté par ce relevé)`
                : ""
            }${robots.sitemapUrls.length ? `, sitemap déclaré : ${list(robots.sitemapUrls, 2)}` : ", aucun sitemap déclaré"}.`
          : `${robots.url} — ${robots.status}${robots.reason ? ` (${robots.reason})` : ""}.`,
      consequence: "",
      impactAds: "cosmetique",
      costRank: COST.COSMETIC,
      pagesTested: n,
    })
  );

  out.push(
    mk({
      id: "index.sitemap_state",
      category: "indexation",
      severity: "info",
      status: sitemap.status === "indisponible" ? "indisponible" : "conforme",
      label: "État du sitemap XML",
      evidence:
        sitemap.status === "present"
          ? `${sitemap.url} — ${
              sitemap.isIndex
                ? `index de ${sitemap.declaredUrls} sitemap(s), ${sitemap.sampleUrls.length} URL lues dans le premier`
                : `${sitemap.declaredUrls} URL déclarée(s)`
            }, source : ${sitemap.source === "robots.txt" ? "déclaré dans robots.txt" : "chemin standard"}.`
          : `${sitemap.url ?? "/sitemap.xml"} — ${sitemap.status}${
              sitemap.reason ? ` (${sitemap.reason})` : ""
            }.`,
      consequence: "",
      impactAds: "cosmetique",
      costRank: COST.COSMETIC,
      pagesTested: n,
    })
  );

  return out;
}

// ── 5. Cohérence géographique ──────────────────────────────────────────────

function geoFindings(pages: PageReport[], n: number): Finding[] {
  const okPages = pages.filter((p) => p.ok);
  if (okPages.length === 0) return [];

  const merged: GeoSignals = {
    postalCodesInText: [],
    jsonLdPostalAddress: [],
    jsonLdAreaServed: [],
    citiesMentioned: [],
  };
  const cityTotals: Record<string, number> = {};
  for (let i = 0; i < okPages.length; i++) {
    const g = okPages[i].geo;
    for (let j = 0; j < g.postalCodesInText.length; j++) {
      if (merged.postalCodesInText.indexOf(g.postalCodesInText[j]) < 0) {
        merged.postalCodesInText.push(g.postalCodesInText[j]);
      }
    }
    for (let j = 0; j < g.jsonLdPostalAddress.length; j++) {
      if (merged.jsonLdPostalAddress.indexOf(g.jsonLdPostalAddress[j]) < 0) {
        merged.jsonLdPostalAddress.push(g.jsonLdPostalAddress[j]);
      }
    }
    for (let j = 0; j < g.jsonLdAreaServed.length; j++) {
      if (merged.jsonLdAreaServed.indexOf(g.jsonLdAreaServed[j]) < 0) {
        merged.jsonLdAreaServed.push(g.jsonLdAreaServed[j]);
      }
    }
    for (let j = 0; j < g.citiesMentioned.length; j++) {
      const c = g.citiesMentioned[j];
      cityTotals[c.name] = (cityTotals[c.name] ?? 0) + c.occurrences;
    }
  }
  const cityNames = Object.keys(cityTotals).sort((a, b) => cityTotals[b] - cityTotals[a]);
  for (let i = 0; i < cityNames.length && i < 15; i++) {
    merged.citiesMentioned.push({ name: cityNames[i], occurrences: cityTotals[cityNames[i]] });
  }

  const hasAnySignal =
    merged.postalCodesInText.length > 0 ||
    merged.jsonLdPostalAddress.length > 0 ||
    merged.jsonLdAreaServed.length > 0;

  if (!hasAnySignal) {
    return [
      mk({
        id: "geo.no_signal",
        category: "geo",
        severity: "majeur",
        label: "Le site ne dit pas où vous intervenez",
        evidence: `Sur ${n} page(s) lues : aucun code postal suivi d'une commune dans le texte, aucun bloc PostalAddress ni areaServed en données structurées.`,
        consequence:
          "Un visiteur à 200 km ne peut pas savoir qu'il est hors zone avant de vous appeler, et Google non plus. Vous payez des clics qui ne pouvaient pas devenir des chantiers.",
        impactAds: "couteux",
        costRank: COST.NO_GEO,
        pagesTested: n,
      }),
    ];
  }

  // Signal présent mais uniquement en texte, sans données structurées : moins
  // grave, réel quand même.
  const out: Finding[] = [];
  if (merged.jsonLdPostalAddress.length === 0 && merged.jsonLdAreaServed.length === 0) {
    out.push(
      mk({
        id: "geo.text_only",
        category: "geo",
        severity: "mineur",
        label: "Zone d'intervention lisible par un humain, pas par Google",
        evidence: `Adresse trouvée dans le texte (${list(
          merged.postalCodesInText,
          2
        )}), mais aucun PostalAddress ni areaServed en données structurées.`,
        consequence:
          "Google devine votre implantation au lieu de la lire. Sur des recherches locales, c'est le concurrent qui l'a déclarée explicitement qui remonte.",
        impactAds: "couteux",
        costRank: COST.NO_GEO - 20,
        pagesTested: n,
      })
    );
  }

  out.push(
    mk({
      id: "geo.inventory",
      category: "geo",
      severity: "info",
      status: "conforme",
      label: "Ancrage géographique relevé",
      evidence: [
        merged.postalCodesInText.length
          ? `adresses en texte : ${list(merged.postalCodesInText, 3)}`
          : "",
        merged.jsonLdPostalAddress.length
          ? `PostalAddress : ${list(merged.jsonLdPostalAddress, 2)}`
          : "",
        merged.jsonLdAreaServed.length
          ? `areaServed : ${list(merged.jsonLdAreaServed, 6)}`
          : "",
        merged.citiesMentioned.length
          ? `communes déclarées et leur nombre d'occurrences dans le texte : ${merged.citiesMentioned
              .slice(0, 6)
              .map((c) => `${c.name} (${c.occurrences}×)`)
              .join(", ")}`
          : "",
        // Précision d'honnêteté : le comptage ne part que des communes
        // DÉCLARÉES (JSON-LD, adresse). Faute d'annuaire des communes, une
        // ville citée uniquement dans un titre — « Nantes » ici — n'est pas
        // détectable, et le rapport ne doit pas laisser croire le contraire.
        "comptage limité aux communes déclarées en données structurées ou en adresse",
      ]
        .filter(Boolean)
        .join(" ; "),
      consequence: "",
      impactAds: "cosmetique",
      costRank: COST.COSMETIC,
      pagesTested: n,
    })
  );

  return out;
}

// ── 6. Contenu : le TEXTE du title et du H1, le contenu mixte ──────────────

const GENERIC_TITLES = [
  "accueil",
  "home",
  "bienvenue",
  "welcome",
  "index",
  "untitled",
  "page d'accueil",
  "site",
];

function isGenericTitle(title: string, host: string): boolean {
  const t = title.trim().toLowerCase().replace(/\s+/g, " ");
  if (GENERIC_TITLES.indexOf(t) >= 0) return true;
  const bareHost = host.replace(/^www\./, "").toLowerCase();
  if (t === bareHost || t === bareHost.split(".")[0]) return true;
  return false;
}

function contentFindings(pages: PageReport[], origin: string, n: number): Finding[] {
  const out: Finding[] = [];
  const okPages = pages.filter((p) => p.ok);
  if (okPages.length === 0) return out;

  let host = "";
  try {
    host = new URL(origin).hostname;
  } catch {
    host = "";
  }

  const noTitle = pagesWhere(okPages, (p) => !p.title);
  if (noTitle.length > 0) {
    out.push(
      mk({
        id: "content.title_missing",
        category: "contenu",
        severity: "critique",
        label: "Balise title absente",
        evidence: `Aucun <title> exploitable sur ${noTitle.length} page(s) : ${noTitle
          .map(short)
          .join(", ")}.`,
        consequence:
          "C'est la ligne bleue cliquable dans Google, et le libellé de l'onglet. Sans elle, Google fabrique un titre à votre place et le taux de clic s'effondre.",
        impactAds: "couteux",
        costRank: COST.TITLE_MISSING,
        pages: noTitle,
        pagesTested: n,
      })
    );
  }

  const generic = okPages.filter((p) => p.title && isGenericTitle(p.title, host));
  if (generic.length > 0) {
    out.push(
      mk({
        id: "content.title_generic",
        category: "contenu",
        severity: "majeur",
        label: "Titre de page sans contenu commercial",
        evidence: generic.map((p) => `${short(p.finalUrl)} : « ${p.title} »`).join(" ; "),
        consequence:
          "Le titre ne dit ni ce que vous faites ni où. Dans une liste de résultats où tout le monde propose la même chose, c'est la seule ligne qui vous distingue et elle est vide.",
        impactAds: "couteux",
        costRank: COST.TITLE_GENERIC,
        pages: generic.map((p) => p.finalUrl),
        pagesTested: n,
      })
    );
  }

  if (okPages.length >= 2) {
    const byTitle: Record<string, string[]> = {};
    for (let i = 0; i < okPages.length; i++) {
      const t = (okPages[i].title ?? "").trim().toLowerCase();
      if (!t) continue;
      (byTitle[t] = byTitle[t] ?? []).push(okPages[i].finalUrl);
    }
    const dupUrls: string[] = [];
    const dupValues: string[] = [];
    const keys = Object.keys(byTitle);
    for (let i = 0; i < keys.length; i++) {
      if (byTitle[keys[i]].length > 1) {
        for (let j = 0; j < byTitle[keys[i]].length; j++) dupUrls.push(byTitle[keys[i]][j]);
        dupValues.push(keys[i].slice(0, 90));
      }
    }
    if (dupUrls.length > 0) {
      out.push(
        mk({
          id: "content.title_duplicate",
          category: "contenu",
          severity: "majeur",
          label: "Le même titre sur plusieurs pages",
          evidence: `Title identique sur ${dupUrls.length} page(s) lues : « ${dupValues.join(
            " », « "
          )} » — ${dupUrls.map(short).join(", ")}.`,
          consequence:
            "Google ne distingue plus vos pages et n'en retient généralement qu'une. Les autres deviennent invisibles, y compris celle où l'on demande un devis.",
          impactAds: "couteux",
          costRank: COST.TITLE_DUPLICATE,
          pages: dupUrls,
          pagesTested: n,
        })
      );
    }
  }

  const noH1 = pagesWhere(okPages, (p) => p.h1Texts.length === 0);
  if (noH1.length > 0) {
    out.push(
      mk({
        id: "content.h1_missing",
        category: "contenu",
        severity: "majeur",
        label: "Aucun titre principal (H1) sur la page",
        evidence: `Aucun H1 porteur de texte sur ${noH1.length} page(s) : ${noH1
          .map(short)
          .join(", ")}.`,
        consequence:
          "Le visiteur qui arrive d'une annonce ne trouve pas, en un coup d'œil, la phrase qui lui confirme qu'il est au bon endroit. C'est la première seconde qui décide de la suite.",
        impactAds: "couteux",
        costRank: COST.H1_MISSING,
        pages: noH1,
        pagesTested: n,
      })
    );
  }

  // Contenu mixte : uniquement quand il est présent.
  const mixedPages = okPages.filter((p) => p.mixedContent.length > 0);
  if (mixedPages.length > 0) {
    out.push(
      mk({
        id: "tech.mixed_content",
        category: "technique",
        severity: "majeur",
        label: "Ressources en http:// sur une page servie en https",
        evidence: mixedPages
          .map(
            (p) =>
              `${short(p.finalUrl)} : ${p.mixedContent.length} ressource(s) — ${list(
                p.mixedContent,
                2
              )}`
          )
          .join(" ; "),
        consequence:
          "Le navigateur bloque ces ressources ou signale la page comme non sécurisée. L'avertissement tombe au pire moment : celui où le visiteur allait laisser son numéro.",
        impactAds: "couteux",
        costRank: COST.MIXED_CONTENT,
        pages: mixedPages.map((p) => p.finalUrl),
        pagesTested: n,
      })
    );
  }

  // ── Annexe technique : réel, mais sans traduction en euros ──────────────
  const noDesc = pagesWhere(okPages, (p) => !p.metaDescription);
  if (noDesc.length > 0) {
    out.push(
      mk({
        id: "annexe.meta_description_missing",
        category: "contenu",
        severity: "mineur",
        label: "Meta description absente",
        evidence: `${noDesc.length} page(s) sur ${n} : ${noDesc.map(short).join(", ")}.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pages: noDesc,
        pagesTested: n,
      })
    );
  }

  const noCanonical = pagesWhere(okPages, (p) => !p.canonical);
  if (noCanonical.length > 0) {
    out.push(
      mk({
        id: "annexe.canonical_missing",
        category: "indexation",
        severity: "mineur",
        label: "Balise canonique absente",
        evidence: `${noCanonical.length} page(s) sur ${n} : ${noCanonical.map(short).join(", ")}.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pages: noCanonical,
        pagesTested: n,
      })
    );
  }

  // Canonique d'une page interne pointant vers l'accueil : celle-ci a bien une
  // conséquence, mais elle reste sous les constats de conversion.
  const home = okPages.filter((p) => p.role === "accueil")[0];
  if (home) {
    const homeUrl = home.finalUrl.replace(/\/+$/, "");
    const wrong = okPages.filter(
      (p) =>
        p.role !== "accueil" &&
        p.canonicalResolved !== null &&
        p.canonicalResolved.replace(/\/+$/, "") === homeUrl
    );
    if (wrong.length > 0) {
      out.push(
        mk({
          id: "index.canonical_points_home",
          category: "indexation",
          severity: "critique",
          label: "Canonique d'une page interne pointant vers l'accueil",
          evidence: wrong.map((p) => `${short(p.finalUrl)} → ${p.canonicalResolved}`).join(" ; "),
          consequence:
            "La page demande à Google de la remplacer par l'accueil. Elle ne peut pas se positionner sur ses propres mots-clés, et une annonce qui y mène envoie sur une page que Google considère comme un doublon.",
          impactAds: "couteux",
          costRank: COST.TITLE_DUPLICATE + 5,
          pages: wrong.map((p) => p.finalUrl),
          pagesTested: n,
        })
      );
    }
  }

  const noJsonLd = pagesWhere(okPages, (p) => p.jsonLdBlocks === 0);
  if (noJsonLd.length > 0) {
    out.push(
      mk({
        id: "annexe.jsonld_missing",
        category: "indexation",
        severity: "mineur",
        label: "Aucune donnée structurée (JSON-LD)",
        evidence: `${noJsonLd.length} page(s) sur ${n} : ${noJsonLd.map(short).join(", ")}.`,
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pages: noJsonLd,
        pagesTested: n,
      })
    );
  }

  const fps: string[] = [];
  for (let i = 0; i < okPages.length; i++) {
    const c = okPages[i].cms;
    if (c.generator && fps.indexOf(`generator: ${c.generator}`) < 0) {
      fps.push(`generator: ${c.generator}`);
    }
    for (let j = 0; j < c.fingerprints.length; j++) {
      if (fps.indexOf(c.fingerprints[j]) < 0) fps.push(c.fingerprints[j]);
    }
    if (c.server && fps.indexOf(`serveur: ${c.server}`) < 0) fps.push(`serveur: ${c.server}`);
  }
  out.push(
    mk({
      id: "annexe.stack",
      category: "technique",
      severity: "info",
      status: "conforme",
      label: "Empreinte technique et poids des pages",
      evidence: `${fps.length ? fps.join(" · ") : "non identifiée"} — poids HTML : ${okPages
        .map((p) => `${short(p.finalUrl)} ${Math.round(p.htmlBytes / 1024)} Ko`)
        .join(", ")}.`,
      consequence: "",
      impactAds: "cosmetique",
      costRank: COST.COSMETIC,
      pagesTested: n,
    })
  );

  const failed = pages.filter((p) => !p.ok);
  if (failed.length > 0) {
    out.push(
      mk({
        id: "tech.page_unreachable",
        category: "technique",
        severity: "majeur",
        status: "indisponible",
        label: "Page demandée mais non lue",
        evidence: failed.map((p) => `${p.requestedUrl} → ${p.failureReason}`).join(" ; "),
        consequence: "",
        impactAds: "cosmetique",
        costRank: COST.COSMETIC,
        pages: failed.map((p) => p.requestedUrl),
        pagesTested: pages.length,
      })
    );
  }

  return out;
}

// ── Notes internes : hors rapport client ───────────────────────────────────

/**
 * Couverture des `alt` et nombre de H1. Ce sont de vrais faits, utiles pour
 * chiffrer le volume de travail d'un devis, mais les présenter à un artisan
 * comme des « problèmes » revient à vendre du jargon. Ils ne sont donc pas des
 * findings : ils vivent dans une section explicitement marquée interne.
 */
export function internalNotes(pages: PageReport[]): InternalNote[] {
  const okPages = pages.filter((p) => p.ok);
  const out: InternalNote[] = [];
  if (okPages.length === 0) return out;

  let total = 0;
  let missing = 0;
  const perPage: string[] = [];
  for (let i = 0; i < okPages.length; i++) {
    const im = okPages[i].images;
    total += im.total;
    missing += im.noAlt + im.emptyAlt;
    perPage.push(`${short(okPages[i].finalUrl)} ${im.noAlt + im.emptyAlt}/${im.total}`);
  }
  out.push({
    label: "Couverture des attributs alt",
    detail:
      total === 0
        ? "aucune balise <img> dans le HTML initial des pages lues"
        : `${missing}/${total} image(s) sans alt utile (${perPage.join(", ")}). Sert à estimer le volume de rédaction, pas à alimenter le rapport client.`,
  });

  out.push({
    label: "Nombre de H1 par page",
    detail: okPages
      .map((p) => `${short(p.finalUrl)} : ${p.h1Count}`)
      .join(", ")
      .concat(". Le NOMBRE de H1 n'a aucune traduction commerciale ; seul leur texte en a une."),
  });

  out.push({
    label: "Volume de texte par page",
    detail: okPages.map((p) => `${short(p.finalUrl)} : ~${p.wordCount} mots`).join(", ") + ".",
  });

  return out;
}

// ── Assemblage ─────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<Severity, number> = { critique: 0, majeur: 1, mineur: 2, info: 3 };

export function buildFindings(audit: Omit<SiteAudit, "findings" | "internalNotes">): Finding[] {
  const n = audit.pages.filter((p) => p.ok).length;
  let out: Finding[] = [];
  if (audit.tracking) out = out.concat(adsFindings(audit.tracking, n));
  out = out.concat(contactFindings(audit.pages, n));
  out = out.concat(speedFindings(audit.speed, n));
  out = out.concat(
    indexFindings(audit.robots, audit.sitemap, audit.httpRedirect, audit.pages, n)
  );
  out = out.concat(geoFindings(audit.pages, n));
  out = out.concat(contentFindings(audit.pages, audit.origin ?? "", n));

  out = assignDestinations(out);

  // Tri d'affichage : coût décroissant d'abord (c'est la règle demandée),
  // gravité ensuite pour départager, jamais la facilité de correction.
  return out.sort(
    (a, b) => b.costRank - a.costRank || SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
}

export function summarize(findings: Finding[]) {
  let corps = 0;
  let problemes = 0;
  let indisponibles = 0;
  let bloquants = 0;
  for (let i = 0; i < findings.length; i++) {
    const f = findings[i];
    if (f.destination === "corps") corps++;
    if (f.status === "probleme") {
      problemes++;
      if (f.impactAds === "bloquant") bloquants++;
    }
    if (f.status === "indisponible") indisponibles++;
  }
  return { corps, problemes, bloquants, indisponibles, total: findings.length };
}
