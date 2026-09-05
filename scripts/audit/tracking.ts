/**
 * Détection de la mesure de conversion — le constat à plus forte valeur
 * commerciale de tout l'audit.
 *
 * ── Pourquoi la mesure est décomposée en 4 niveaux
 * Dire « vous avez Google Ads » n'apprend rien à quelqu'un qui paie une
 * facture Google tous les mois. Dire « vous n'avez pas de suivi » est souvent
 * faux, parce que le tag de conversion vit dans le conteneur GTM et pas dans
 * le HTML. Ce qui se vend, c'est l'ÉCART entre deux niveaux voisins :
 *
 *   N1  la balise Google est chargée (gtag/js ou gtm.js)
 *   N2  un identifiant annonceur AW-XXXXXXXXX est présent
 *   N3  une conversion est RÉELLEMENT définie
 *       (paire AW-XXXXXXXXX/Label, gtag('event','conversion'),
 *        ou déclencheur dans le conteneur GTM public)
 *   N4  GA4 + Consent Mode + une CMP identifiée
 *
 * « Votre balise Ads est en place (N2), mais aucune conversion n'est définie
 * (N3) » : Google reçoit l'argent sans dire quelles annonces produisent des
 * demandes. C'est cette phrase-là qui déclenche un rendez-vous, et elle n'est
 * disponible qu'en mesurant les niveaux séparément.
 *
 * ── Deux pièges, tenus explicitement
 *  1. Conclure « aucun suivi » alors que tout est dans GTM. Vérifié sur un
 *     compte client réel : zéro trace dans la page, AW-871292681 bien présent
 *     dans le conteneur. Le conteneur étant servi publiquement par Google, une
 *     requête suffit à lever le doute — on la fait toujours.
 *  2. Conclure quoi que ce soit quand le conteneur n'a PAS pu être lu. Dans ce
 *     cas N3 vaut `null` (indéterminé), jamais `false`. Un constat faux dans un
 *     rapport de prospection coûte plus cher qu'un constat absent.
 *
 * Ce module ne lit que du HTML public et un fichier JavaScript public. Il
 * n'interroge aucun compte, n'accède à aucune donnée privée.
 */

import type { CheerioAPI } from "cheerio";
import type {
  AdsLevels,
  GtmContainerReport,
  PageTrackingSignals,
  TrackingReport,
} from "./types.ts";

/**
 * Tous ces motifs sont appliqués au HTML BRUT, sans passer par toUpperCase().
 *
 * Ce n'est pas un détail : la version majuscule de la page transformait la
 * classe CSS `g-recaptcha` en `G-RECAPTCHA`, que le motif GA4 acceptait. Le
 * premier relevé réel sur www.mr-debarrasse.fr rapportait donc fièrement un
 * identifiant GA4 « G-RECAPTCHA », qui n'existe pas. Les vrais identifiants
 * Google sont toujours en majuscules dans le balisage — ils ne fonctionnent
 * pas autrement — donc la casse est une information utile, pas un obstacle.
 */
const RE_GTM = /\bGTM-[A-Z0-9]{5,9}\b/g;
/** GA4 : G-XXXXXXXXXX. Le seuil de 8 caractères écarte déjà beaucoup de bruit. */
const RE_GA4 = /\bG-[A-Z0-9]{8,12}\b/g;
const RE_UA = /\bUA-\d{4,10}-\d{1,4}\b/g;
/** Identifiant annonceur Google Ads. */
const RE_AW = /\bAW-\d{9,12}\b/g;
/**
 * Paire identifiant/étiquette dans un appel gtag : c'est ELLE qui prouve
 * qu'une conversion est définie. `AW-871292681` seul dit « cet annonceur
 * existe ». `AW-871292681/AbC-D_efG` dit « cette action précise est comptée ».
 */
const RE_AW_LABEL = /\bAW-\d{9,12}\/[A-Za-z0-9_-]{6,}/g;

/**
 * Un identifiant Google contient toujours au moins un chiffre. Second filet
 * après la casse, contre les mots anglais tout en majuscules.
 */
function hasDigit(v: string): boolean {
  return /\d/.test(v);
}

function matchAllUnique(re: RegExp, haystack: string, cap = 8): string[] {
  // matchAll() n'est pas itérable sans downlevelIteration : boucle exec().
  const out: string[] = [];
  const seen: Record<string, true> = {};
  const rx = new RegExp(re.source, re.flags.indexOf("g") >= 0 ? re.flags : re.flags + "g");
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = rx.exec(haystack)) !== null && guard++ < 5000) {
    const v = m[0];
    if (!seen[v]) {
      seen[v] = true;
      out.push(v);
      if (out.length >= cap) break;
    }
    if (m.index === rx.lastIndex) rx.lastIndex++;
  }
  return out;
}

type VendorRule = { label: string; needles: string[] };

const CALL_TRACKING_VENDORS: VendorRule[] = [
  { label: "CallRail", needles: ["callrail.com", "cdn.callrail"] },
  { label: "Dexem", needles: ["dexem.com", "dexem-call"] },
  { label: "Ringover", needles: ["ringover.com", "cdn.ringover"] },
  { label: "Aircall", needles: ["aircall.io"] },
  { label: "Freespee", needles: ["freespee.com"] },
  { label: "Invoca", needles: ["invoca.net"] },
  { label: "WhatConverts", needles: ["whatconverts.com"] },
];

const FORM_VENDORS: VendorRule[] = [
  { label: "Contact Form 7", needles: ["wpcf7", "contact-form-7"] },
  { label: "Gravity Forms", needles: ["gravityforms", "gform_wrapper"] },
  { label: "WPForms", needles: ["wpforms"] },
  { label: "Ninja Forms", needles: ["ninja_forms", "nf-form"] },
  { label: "Formidable", needles: ["frm_forms", "formidable"] },
  { label: "Elementor Forms", needles: ["elementor-form"] },
  { label: "HubSpot", needles: ["js.hsforms.net", "hbspt.forms"] },
  { label: "Typeform", needles: ["typeform.com"] },
  { label: "Tally", needles: ["tally.so"] },
  { label: "Formspree", needles: ["formspree.io"] },
  { label: "Brevo / Sendinblue", needles: ["sibforms.com", "sendinblue"] },
  { label: "Mailchimp", needles: ["list-manage.com"] },
];

/** Les CMP explicitement demandées, plus celles rencontrées en clientèle. */
const CONSENT_PLATFORMS: VendorRule[] = [
  { label: "Axeptio", needles: ["axeptio"] },
  { label: "Tarteaucitron", needles: ["tarteaucitron"] },
  { label: "Cookiebot", needles: ["cookiebot"] },
  { label: "Complianz", needles: ["complianz", "cmplz"] },
  { label: "Didomi", needles: ["didomi"] },
  { label: "CookieYes", needles: ["cookieyes"] },
  { label: "OneTrust", needles: ["onetrust", "optanon"] },
  { label: "Klaro", needles: ["klaro"] },
  { label: "Orejime", needles: ["orejime"] },
  { label: "Quantcast", needles: ["quantcast.mgr", "cmp2.js"] },
];

const OTHER_ANALYTICS: VendorRule[] = [
  { label: "Matomo", needles: ["matomo.js", "piwik.js", "matomo.php"] },
  { label: "Plausible", needles: ["plausible.io"] },
  { label: "Fathom", needles: ["usefathom.com"] },
  { label: "Umami", needles: ["umami.is", "umami.js"] },
  { label: "Hotjar", needles: ["hotjar"] },
  { label: "Microsoft Clarity", needles: ["clarity.ms"] },
  { label: "Piano / AT Internet", needles: ["xiti.com", "atinternet"] },
];

function detectVendors(rules: VendorRule[], lowerHtml: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    for (let j = 0; j < rule.needles.length; j++) {
      if (lowerHtml.indexOf(rule.needles[j]) >= 0) {
        out.push(rule.label);
        break;
      }
    }
  }
  return out;
}

/**
 * Un lien `tel:` avec un déclencheur inline (onclick gtag/dataLayer/fbq, ou un
 * attribut data-* de tagging) est une preuve POSITIVE de suivi d'appel.
 * L'absence de déclencheur inline n'est PAS une preuve d'absence : un
 * déclencheur « clic sur lien » dans GTM ne laisse aucune trace dans le HTML.
 */
function telLinkHasInlineHandler($: CheerioAPI, el: never): boolean {
  const node = $(el);
  const onclick = (node.attr("onclick") ?? "").toLowerCase();
  if (/gtag\(|datalayer|fbq\(|ga\(|_gaq|conversion|trackevent/.test(onclick)) return true;
  const cls = (node.attr("class") ?? "").toLowerCase();
  if (/\b(gtm|ga|track|tracking|conversion)[-_]/.test(cls)) return true;
  const attrs = node.attr() ?? {};
  const keys = Object.keys(attrs);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i].toLowerCase();
    if (k.indexOf("data-gtm") === 0) return true;
    if (k.indexOf("data-ga") === 0) return true;
    if (k === "data-event" || k === "data-track" || k === "data-tracking") return true;
  }
  return false;
}

export function extractPageTracking(html: string, $: CheerioAPI): PageTrackingSignals {
  const lower = html.toLowerCase();

  // N1 — la balise Google est-elle chargée ? On cherche les deux chargeurs
  // officiels, pas une mention quelconque de « google ».
  const googleTagLoaders: string[] = [];
  if (lower.indexOf("googletagmanager.com/gtag/js") >= 0) googleTagLoaders.push("gtag/js");
  if (lower.indexOf("googletagmanager.com/gtm.js") >= 0) googleTagLoaders.push("gtm.js");
  if (lower.indexOf("googletagmanager.com/ns.html") >= 0 && googleTagLoaders.indexOf("gtm.js") < 0) {
    googleTagLoaders.push("gtm.js (noscript)");
  }

  const gtmIds = matchAllUnique(RE_GTM, html, 4).filter(hasDigit);
  const ga4Ids = matchAllUnique(RE_GA4, html, 4).filter(hasDigit);
  const universalAnalyticsIds = matchAllUnique(RE_UA, html, 4);
  const adsConversionIds = matchAllUnique(RE_AW, html, 4);
  const adsSendToPairs = matchAllUnique(RE_AW_LABEL, html, 6);

  const adsSignals: string[] = [];
  if (adsConversionIds.length > 0) adsSignals.push("identifiant AW- dans la page");
  if (lower.indexOf("googleadservices.com") >= 0) adsSignals.push("googleadservices.com");
  if (lower.indexOf("doubleclick.net") >= 0 || lower.indexOf("googlesyndication") >= 0) {
    adsSignals.push("remarketing (doubleclick / googlesyndication)");
  }
  if (lower.indexOf("gtag_report_conversion") >= 0 || lower.indexOf("google_conversion") >= 0) {
    adsSignals.push("fonction de conversion Google Ads");
  }

  const inlineConversionEvents: string[] = [];
  if (/gtag\(\s*['"]event['"]\s*,\s*['"]conversion['"]/.test(lower)) {
    inlineConversionEvents.push("gtag('event','conversion')");
  }
  if (/gtag\(\s*['"]event['"]\s*,\s*['"]generate_lead['"]/.test(lower)) {
    inlineConversionEvents.push("gtag('event','generate_lead')");
  }
  if (lower.indexOf("gtag_report_conversion") >= 0) {
    inlineConversionEvents.push("gtag_report_conversion()");
  }
  if (/fbq\(\s*['"]track['"]\s*,\s*['"](lead|contact|submitapplication|schedule)['"]/.test(lower)) {
    inlineConversionEvents.push("fbq('track','Lead'/'Contact')");
  }
  if (
    /datalayer\.push\(\s*\{[^}]{0,200}['"]event['"]\s*:\s*['"][^'"]*(conversion|lead|contact|form|devis|appel|call)[^'"]*['"]/.test(
      lower
    )
  ) {
    inlineConversionEvents.push("dataLayer.push({event:…}) de conversion");
  }

  let telWithHandler = 0;
  $('a[href^="tel:"]').each((_, el) => {
    if (telLinkHasInlineHandler($, el as never)) telWithHandler++;
  });

  return {
    googleTagLoaders,
    ga4Ids,
    universalAnalyticsIds,
    gtmIds,
    adsConversionIds,
    adsSendToPairs,
    adsSignals,
    otherAnalytics: detectVendors(OTHER_ANALYTICS, lower),
    metaPixel: lower.indexOf("connect.facebook.net") >= 0 || /\bfbq\s*\(/.test(lower),
    consentPlatforms: detectVendors(CONSENT_PLATFORMS, lower),
    consentModeInPage: /gtag\(\s*['"]consent['"]/.test(lower),
    callTrackingVendors: detectVendors(CALL_TRACKING_VENDORS, lower),
    formVendors: detectVendors(FORM_VENDORS, lower),
    telLinksWithInlineHandler: telWithHandler,
    inlineConversionEvents,
  };
}

export function emptyGtmReport(): GtmContainerReport {
  return {
    checked: false,
    readable: false,
    containerId: null,
    reason: null,
    bytes: 0,
    adsConversionIds: [],
    adsSendToPairs: [],
    adsConversionTags: 0,
    conversionLabels: [],
    hasAdsTags: false,
    ga4Ids: [],
    hasFormSubmitTrigger: false,
    hasLinkClickTrigger: false,
    hasElementVisibilityTrigger: false,
    consentApiPresent: false,
    conversionEventNames: [],
  };
}

/**
 * Analyse le JavaScript public d'un conteneur GTM.
 *
 * ── Où se cache réellement la preuve d'une conversion
 * Un conteneur GTM n'écrit PAS ses conversions sous la forme
 * `AW-871292681/Étiquette`. Vérifié sur le conteneur réel GTM-KWJ27TGF : cette
 * chaîne n'y apparaît nulle part. Ce qui s'y trouve, en revanche, est un tag
 * dont le modèle est `__awct` — « Google Ads Conversion Tracking » — avec son
 * `vtp_conversionLabel`. Le conteneur en contient trois, soit trois
 * conversions distinctes, avec l'identifiant fourni par une macro.
 *
 * S'être fié à un motif « AW-xxx/label » aurait donc conclu « aucune
 * conversion définie » sur un compte qui en a trois — exactement le constat
 * faux qu'un rapport de prospection ne peut pas se permettre. On lit donc les
 * tags `__awct` et leurs étiquettes.
 *
 * `__sp` (remarketing) n'est PAS une conversion : il n'est pas compté ici.
 *
 * ── Le mode consentement n'est pas déductible du conteneur
 * `wait_for_update`, `google_tag_data.ics` et la chaîne « consent » sont
 * présents dans l'API de consentement que Google embarque dans TOUS les
 * conteneurs, configurée ou non. Le premier relevé réel annonçait donc
 * « Consent Mode : oui » sur un site qui n'a ni CMP ni appel gtag('consent').
 * Le champ reste collecté pour information, mais il ne sert plus au verdict :
 * seul un appel gtag('consent') dans la page compte.
 */
export function parseGtmContainer(
  js: string,
  containerId: string,
  bytes: number
): GtmContainerReport {
  const lower = js.toLowerCase();

  const conversionEventNames: string[] = [];
  const eventRe =
    /["']((?:generate_lead|conversion|contact|form_submit|formulaire|devis|appel|call|purchase|lead)[a-z0-9_]*)["']/gi;
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = eventRe.exec(js)) !== null && guard++ < 2000) {
    const name = m[1].toLowerCase();
    if (conversionEventNames.indexOf(name) < 0 && conversionEventNames.length < 12) {
      conversionEventNames.push(name);
    }
  }

  // Tags de conversion Google Ads et leurs étiquettes.
  const adsConversionTags = (js.match(/"function"\s*:\s*"__awct"/g) ?? []).length;
  const conversionLabels: string[] = [];
  const labelRe = /vtp_conversionLabel"\s*:\s*"([A-Za-z0-9_-]{6,})"/g;
  let lm: RegExpExecArray | null;
  while ((lm = labelRe.exec(js)) !== null && conversionLabels.length < 12) {
    if (conversionLabels.indexOf(lm[1]) < 0) conversionLabels.push(lm[1]);
  }

  return {
    checked: true,
    readable: true,
    containerId,
    reason: null,
    bytes,
    adsConversionIds: matchAllUnique(RE_AW, js, 6),
    adsSendToPairs: matchAllUnique(RE_AW_LABEL, js, 8),
    adsConversionTags,
    conversionLabels,
    hasAdsTags:
      lower.indexOf("googleadservices") >= 0 ||
      lower.indexOf("doubleclick") >= 0 ||
      lower.indexOf("googlesyndication") >= 0,
    ga4Ids: matchAllUnique(RE_GA4, js, 4).filter(hasDigit),
    hasFormSubmitTrigger: lower.indexOf("gtm.formsubmit") >= 0,
    hasLinkClickTrigger: lower.indexOf("gtm.linkclick") >= 0,
    hasElementVisibilityTrigger: lower.indexOf("gtm.elementvisibility") >= 0,
    // Collecté, volontairement NON utilisé pour conclure — voir l'en-tête.
    consentApiPresent:
      lower.indexOf("google_tag_data.ics") >= 0 || lower.indexOf("wait_for_update") >= 0,
    conversionEventNames,
  };
}

function uniq(list: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i] && out.indexOf(list[i]) < 0) out.push(list[i]);
  }
  return out;
}

function flat(pages: PageTrackingSignals[], key: keyof PageTrackingSignals): string[] {
  const acc: string[] = [];
  for (let i = 0; i < pages.length; i++) {
    const v = pages[i][key];
    if (Array.isArray(v)) for (let j = 0; j < v.length; j++) acc.push(v[j] as string);
  }
  return uniq(acc);
}

function sum(pages: PageTrackingSignals[], key: keyof PageTrackingSignals): number {
  let n = 0;
  for (let i = 0; i < pages.length; i++) {
    const v = pages[i][key];
    if (typeof v === "number") n += v;
  }
  return n;
}

export function buildTrackingReport(
  perPage: PageTrackingSignals[],
  gtm: GtmContainerReport,
  telLinksTotal: number,
  telNumbers: string[],
  formsTotal: number
): TrackingReport {
  // GA4 vit très souvent dans le conteneur et pas dans la page : sur
  // www.mr-debarrasse.fr, G-39F73XTTW9 n'existe que dans GTM-KWJ27TGF. Ne
  // regarder que les pages faisait écrire « GA4 : aucun » à un site qui en a un.
  const ga4Ids = uniq(flat(perPage, "ga4Ids").concat(gtm.readable ? gtm.ga4Ids : []));
  const uaIds = flat(perPage, "universalAnalyticsIds");
  const gtmIds = flat(perPage, "gtmIds");
  const others = flat(perPage, "otherAnalytics");
  const metaPixel = perPage.some((p) => p.metaPixel);
  const loaders = flat(perPage, "googleTagLoaders");

  const pageAwIds = flat(perPage, "adsConversionIds");
  const pagePairs = flat(perPage, "adsSendToPairs");
  const inlineConversions = flat(perPage, "inlineConversionEvents");
  const allAwIds = uniq(pageAwIds.concat(gtm.adsConversionIds));
  const allPairs = uniq(pagePairs.concat(gtm.adsSendToPairs));

  // ── N1 : la balise Google est-elle chargée ? ────────────────────────────
  const n1Evidence: string[] = [];
  for (let i = 0; i < loaders.length; i++) n1Evidence.push(`chargeur ${loaders[i]}`);
  if (gtmIds.length > 0) n1Evidence.push(`conteneur ${gtmIds.join(", ")}`);
  if (ga4Ids.length > 0) n1Evidence.push(`GA4 ${ga4Ids.join(", ")}`);

  // ── N2 : un identifiant annonceur est-il présent ? ──────────────────────
  let adsSource: AdsLevels["adsId"]["source"] = "aucun";
  if (pageAwIds.length > 0 && gtm.adsConversionIds.length > 0) adsSource = "page+conteneur_gtm";
  else if (pageAwIds.length > 0) adsSource = "page";
  else if (gtm.adsConversionIds.length > 0) adsSource = "conteneur_gtm";

  // ── N3 : une conversion est-elle RÉELLEMENT définie ? ───────────────────
  // Preuves acceptées, toutes vérifiables sans ouvrir un compte :
  //   a) un tag `__awct` dans le conteneur, avec son étiquette de conversion
  //      — la forme réelle sous laquelle GTM stocke une conversion Ads ;
  //   b) une paire AW-XXXXXXXXX/Étiquette (forme gtag, en page) ;
  //   c) un appel gtag('event','conversion') / gtag_report_conversion().
  //
  // Un déclencheur GTM seul (envoi de formulaire, clic sur lien) ne suffit
  // PAS : il peut n'alimenter que GA4, sans jamais remonter à Google Ads.
  // Le compter comme preuve produirait des « tout va bien » injustifiés.
  const n3Evidence: string[] = [];
  if (gtm.readable && gtm.adsConversionTags > 0) {
    n3Evidence.push(
      `${gtm.adsConversionTags} tag(s) « Google Ads Conversion Tracking » dans le conteneur ${gtm.containerId}` +
        (gtm.conversionLabels.length
          ? ` — étiquette(s) ${gtm.conversionLabels.slice(0, 4).join(", ")}`
          : "")
    );
  }
  if (allPairs.length > 0) {
    n3Evidence.push(`paire identifiant/étiquette : ${allPairs.slice(0, 3).join(", ")}`);
  }
  if (inlineConversions.length > 0) {
    n3Evidence.push(`appel en page : ${inlineConversions.join(", ")}`);
  }

  let conversionDefined: boolean | null;
  let conversionReason: string;
  if (n3Evidence.length > 0) {
    conversionDefined = true;
    conversionReason = "Au moins une conversion est définie et repérable publiquement.";
  } else if (gtmIds.length > 0 && !gtm.readable) {
    // Le conteneur peut tout contenir. On ne tranche pas.
    conversionDefined = null;
    conversionReason = `Google Tag Manager est présent (${gtmIds.join(
      ", "
    )}) mais son conteneur n'a pas pu être lu (${
      gtm.reason ?? "motif inconnu"
    }). La conversion peut y être définie : conclusion impossible sans ouvrir le compte.`;
  } else if (gtm.readable) {
    conversionDefined = false;
    conversionReason = `Conteneur ${gtm.containerId} lu en entier (${Math.round(
      gtm.bytes / 1024
    )} Ko) : aucun tag de conversion Google Ads, aucune étiquette de conversion.`;
  } else if (gtmIds.length === 0) {
    conversionDefined = false;
    conversionReason =
      "Aucun conteneur GTM sur les pages analysées, et aucune conversion déclarée dans le HTML.";
  } else {
    conversionDefined = null;
    conversionReason = "Conteneur GTM non analysé : conclusion impossible.";
  }

  // ── N4 : GA4 + Consent Mode + CMP ───────────────────────────────────────
  // Le conteneur n'entre PAS dans ce calcul : Google y embarque son API de
  // consentement quoi qu'il arrive. Seul un gtag('consent') réellement écrit
  // dans la page prouve une configuration.
  const cmp = flat(perPage, "consentPlatforms");
  const consentMode = perPage.some((p) => p.consentModeInPage);

  const levels: AdsLevels = {
    googleTag: { present: loaders.length > 0 || gtmIds.length > 0, evidence: n1Evidence },
    adsId: { present: allAwIds.length > 0, ids: allAwIds, source: adsSource },
    conversionDefined: {
      present: conversionDefined,
      evidence: n3Evidence,
      reason: conversionReason,
    },
    consent: { ga4Ids, consentMode, cmp },
  };

  // ── Suivi des appels ────────────────────────────────────────────────────
  const callVendors = flat(perPage, "callTrackingVendors");
  const telWithHandler = sum(perPage, "telLinksWithInlineHandler");
  let callTracked: boolean | null;
  if (telLinksTotal === 0) callTracked = null; // rien à suivre : le constat porte ailleurs
  else if (telWithHandler > 0 || callVendors.length > 0) callTracked = true;
  else if (gtm.readable && gtm.hasLinkClickTrigger) callTracked = true;
  else if (gtm.readable) callTracked = false; // conteneur lu, aucun déclencheur : conclusion sûre
  else if (gtmIds.length === 0) callTracked = false; // pas de GTM, rien en page : conclusion sûre
  else callTracked = null; // GTM présent mais illisible : on ne tranche pas

  // ── Suivi des formulaires ───────────────────────────────────────────────
  const formVendors = flat(perPage, "formVendors");
  let formTracked: boolean | null;
  if (formsTotal === 0) formTracked = null;
  else if (inlineConversions.length > 0) formTracked = true;
  else if (gtm.readable && (gtm.hasFormSubmitTrigger || gtm.hasElementVisibilityTrigger))
    formTracked = true;
  else if (gtm.readable) formTracked = false;
  else if (gtmIds.length === 0) formTracked = false;
  else formTracked = null;

  return {
    levels,
    analytics: { ga4Ids, universalAnalyticsIds: uaIds, gtmIds, others, metaPixel },
    callTracking: {
      telLinksTotal,
      telLinksWithInlineHandler: telWithHandler,
      telNumbers,
      vendors: callVendors,
      tracked: callTracked,
    },
    formTracking: {
      formsTotal,
      vendors: formVendors,
      inlineConversionEvents: inlineConversions,
      formSubmitTriggerInGtm: gtm.readable ? gtm.hasFormSubmitTrigger : null,
      tracked: formTracked,
    },
    gtm,
  };
}
