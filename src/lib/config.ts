// ═══════════════════════════════════════════
// Uplyo — Shared Site Config
// ═══════════════════════════════════════════

export const SITE_CONFIG = {
  calendlyUrl: "https://calendly.com/contact-uplyo/30min",
  contactEmail: "contact@uplyo.fr",
  // Vide volontairement : https://linkedin.com/company/uplyo renvoie 404,
  // et le lien figurait dans le pied de page des 33 pages du site. Une page
  // LinkedIn existe peut-etre sous un autre identifiant — des que l'URL
  // exacte est connue, la remettre ici suffit a rafficher le lien partout.
  linkedinUrl: "",
  domain: "uplyo.fr",
} as const;
