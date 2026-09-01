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

/** Premier focus dans un formulaire lead (micro-conversion) */
export function trackFormStart(formName: "contact" | "audit") {
  gtag("event", "form_start", {
    form_name: formName,
    event_category: "Lead",
  });
}

/** Soumission réussie d'un formulaire — valeur dynamique selon budget */
export function trackFormSubmit(
  formName: "contact" | "audit",
  budget?: string
) {
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
