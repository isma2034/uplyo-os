/**
 * Uplyo — Conversion tracking utilities
 * Centralise tous les événements GA4 / Google Ads.
 * Usage : importer la fonction voulue dans un composant client.
 */

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

// ─── Formulaires ──────────────────────────────────────────────────

/** `audit_rappel` = la variante « je préfère être rappelé » du formulaire /audit. */
export type FormName = "contact" | "audit" | "audit_rappel";

/** Premier focus dans un formulaire lead (micro-conversion) */
export function trackFormStart(formName: FormName) {
  gtag("event", "form_start", {
    form_name: formName,
    event_category: "Lead",
  });
}

/**
 * Étape atteinte dans un formulaire multi-étapes.
 *
 * C'est l'événement qui permet de répondre à « quelle étape bloque ? » : dans
 * GA4, comparer le nombre de `form_step` par `step_number` donne directement
 * le taux de passage d'une étape à l'autre. L'étape 1 est comptée elle aussi
 * (à la première interaction), sans quoi il manquerait le dénominateur.
 *
 * Rapport GA4 à créer : exploration en entonnoir sur `form_step`, dimension
 * personnalisée `step_number` (à déclarer dans Admin > Définitions
 * personnalisées, sinon le paramètre reste invisible dans les rapports).
 */
export function trackFormStep(step: number, formName: FormName, stepName?: string) {
  gtag("event", "form_step", {
    form_name: formName,
    step_number: step,
    step_name: stepName ?? `step_${step}`,
    event_category: "Lead",
  });
}

/** Soumission réussie d'un formulaire — valeur dynamique selon budget */
export function trackFormSubmit(formName: FormName, budget?: string) {
  const value = budget?.startsWith("3000") || budget?.startsWith("10000")
    ? 500
    : budget?.startsWith("1000")
    ? 250
    : 100;

  gtag("event", "generate_lead", {
    form_name: formName,
    budget_range: budget ?? "unknown",
    event_category: "Conversion",
    currency: "EUR",
    value,
  });
}

// ─── Intentions fortes ────────────────────────────────────────────

/** Clic sur un lien Calendly (intention de réservation) */
export function trackCalendlyClick(location: string) {
  gtag("event", "schedule_appointment", {
    click_location: location,
    event_category: "Conversion",
    currency: "EUR",
    value: 1,
  });
}

/** Clic sur l'email de contact */
export function trackEmailClick(location: string) {
  gtag("event", "contact_email_click", {
    click_location: location,
    event_category: "Engagement",
  });
}

// ─── CTAs ─────────────────────────────────────────────────────────

/** Clic sur un CTA principal */
export function trackCTAClick(location: string, label: string) {
  gtag("event", "cta_click", {
    cta_location: location,
    cta_label: label,
    event_category: "Engagement",
  });
}

// ─── Scroll depth ─────────────────────────────────────────────────

/** Profondeur de scroll atteinte (25 / 50 / 75 / 90) */
export function trackScrollDepth(
  depth: 25 | 50 | 75 | 90,
  pagePath: string
) {
  gtag("event", "scroll_depth", {
    percent_scrolled: depth,
    page_path: pagePath,
    event_category: "Engagement",
    non_interaction: true,
  });
}

// ─── Pages offres ─────────────────────────────────────────────────

/** Vue d'une page de service (intention d'achat) */
export function trackServiceView(serviceName: string) {
  gtag("event", "view_item", {
    item_name: serviceName,
    event_category: "Consideration",
  });
}

// ─── Google Ads ───────────────────────────────────────────────────

/**
 * Conversion Google Ads.
 * Activer après validation de la balise dans Google Ads :
 *   - Menu Outils > Conversions > tag Google Ads
 *   - Remplacer CONVERSION_ID par AW-XXXXXXXXX/XXXXXXXXXXXXXXXX
 */
export function trackGoogleAdsConversion(conversionId?: string) {
  if (!conversionId) return;
  gtag("event", "conversion", {
    send_to: conversionId,
    value: 1.0,
    currency: "EUR",
  });
}
