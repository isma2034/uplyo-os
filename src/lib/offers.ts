// ═══════════════════════════════════════════
// Uplyo — Référentiel des offres
// ═══════════════════════════════════════════
//
// Source unique de vérité pour :
//  - le budget publicitaire plancher (il était écrit en dur dans une seule
//    réponse de FAQ de la home, donc invisible sans clic et impossible à
//    maintenir cohérent entre les pages) ;
//  - les conditions d'engagement (le site affichait simultanément « sans
//    engagement » sur la home et « engagement 6 mois » sur /offres/retainer,
//    la FAQ et les CGV).
//
// Décision client : aucun engagement de durée. Résiliable à tout moment avec
// 30 jours de préavis. Honoraires sur devis tant qu'aucun tarif fixe n'est
// arrêté — ne pas inventer de montant ici.

export const MEDIA_FLOOR = {
  local: "500 €/mois",
  ecommerce: "1 000 €/mois",
} as const;

export const TERMS = {
  commitment: "Aucun engagement de durée",
  notice: "Résiliable à tout moment, 30 jours de préavis",
  fee: "Honoraires sur devis",
  auditDelay: "48 h",
  replyDelay: "24 h ouvrées",
  goLive: "5 jours ouvrés",
} as const;

export type OfferRoute = {
  slug: string;
  href: string;
  label: string;
  short: string;
};

// Les routes historiques (pack-lancement / retainer) sont conservées : les
// renommer imposerait des redirections pour un gain SEO nul sur un site qui
// n'a pas encore d'historique d'indexation. Seuls les libellés changent.
export const OFFER_ROUTES: Record<"setup" | "pilotage" | "ecommerce", OfferRoute> = {
  setup: {
    slug: "pack-lancement",
    href: "/offres/pack-lancement",
    label: "Le setup",
    short: "Construction du compte, 5 jours",
  },
  pilotage: {
    slug: "retainer",
    href: "/offres/retainer",
    label: "Le pilotage",
    short: "Conduite du compte, au mois",
  },
  ecommerce: {
    slug: "ecommerce",
    href: "/offres/ecommerce",
    label: "Module e-commerce",
    short: "Shopping et Performance Max, en complément du pilotage",
  },
};
