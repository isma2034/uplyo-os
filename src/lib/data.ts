import { Client, WizardConfig, NavSection } from "./types";

// ═══════════════════════════════════════════
// CRM Mock Data (matches prototype)
// ═══════════════════════════════════════════

export const CLIENTS: Client[] = [
  {
    id: "c1",
    nom: "TechFlow SaaS",
    email: "contact@techflow.io",
    secteur: "SaaS B2B",
    statut: "actif",
    budget: 8500,
    cpa: "45€",
    cpaActuel: 52,
    conversions: 189,
    auditScore: 24,
    notes: "Scale campaign Performance Max en cours. Objectif: passer sous 40€ CPA d'ici fin Q2.",
    gaAccountId: "123-456-7890",
    lookerUrl: "https://lookerstudio.google.com/example",
    slackChannel: "#techflow-ads",
    mrr: 1200,
    dateCreation: "2024-09-15",
  },
  {
    id: "c2",
    nom: "BioMarket",
    email: "ads@biomarket.fr",
    secteur: "E-commerce Bio",
    statut: "scale",
    budget: 15000,
    cpa: "ROAS 4.5",
    cpaActuel: 3.8,
    conversions: 420,
    auditScore: 27,
    notes: "Top client. Scaling Shopping + PMax. Black Friday prep en avance.",
    gaAccountId: "987-654-3210",
    lookerUrl: "https://lookerstudio.google.com/example2",
    calendlyUrl: "https://calendly.com/uplyo/biomarket",
    slackChannel: "#biomarket",
    mrr: 2500,
    dateCreation: "2024-03-10",
  },
  {
    id: "c3",
    nom: "Immo Premium",
    email: "digital@immopremium.fr",
    secteur: "Immobilier Luxe",
    statut: "onboarding",
    budget: 5000,
    cpa: "120€",
    auditScore: 12,
    notes: "Nouveau client. Audit en cours. Structure à revoir entièrement.",
    dateCreation: "2025-01-20",
  },
  {
    id: "c4",
    nom: "FitZone",
    email: "marketing@fitzone.fr",
    secteur: "Fitness / Coaching",
    statut: "actif",
    budget: 3200,
    cpa: "25€",
    cpaActuel: 31,
    conversions: 95,
    auditScore: 19,
    notes: "Campagnes Search + Display. Lead gen via formulaire Calendly.",
    gaAccountId: "111-222-3333",
    mrr: 600,
    dateCreation: "2024-11-05",
  },
  {
    id: "c5",
    nom: "LegalTech Pro",
    email: "growth@legaltechpro.com",
    secteur: "LegalTech B2B",
    statut: "prospect",
    budget: 6000,
    cpa: "80€",
    notes: "Intéressé par un audit gratuit. RDV prévu semaine prochaine.",
    dateCreation: "2025-02-28",
  },
];

export const STATUT_LABELS: Record<string, string> = {
  prospect: "Prospect",
  onboarding: "Onboarding",
  actif: "Actif",
  scale: "Scale",
  pause: "Pause",
  churned: "Churned",
};

export const STATUT_COLORS: Record<string, string> = {
  prospect: "purple",
  onboarding: "amber",
  actif: "green",
  scale: "blue",
  pause: "amber",
  churned: "red",
};

// ═══════════════════════════════════════════
// AI Wizards
// ═══════════════════════════════════════════

export const WIZARDS: WizardConfig[] = [
  {
    id: "auditeur",
    icon: "🔬",
    title: "Auditeur de compte",
    description: "Analyse complète d'un compte Google Ads avec recommandations priorisées.",
    badge: "AUDIT",
    inputLabel: "Données du compte (KPIs, structure, paramètres…)",
    placeholder: "Coller les données du compte : budget, CPA, structure campagnes, mots-clés top/flop…",
    runLabel: "Lancer l'audit IA",
  },
  {
    id: "copy",
    icon: "✍️",
    title: "Copywriter Ads",
    description: "Génère des annonces RSA, titres, descriptions et extensions optimisées.",
    badge: "COPY",
    inputLabel: "Contexte de l'annonce (produit, audience, objectif…)",
    placeholder: "Ex: E-commerce chaussures running, audience 25-45 ans, objectif conversions…",
    runLabel: "Générer les annonces",
  },
  {
    id: "roas",
    icon: "📊",
    title: "Simulateur ROAS",
    description: "Projections de performance selon différents scénarios budget/CPA.",
    badge: "ROAS",
    inputLabel: "Données actuelles (budget, CPA, taux conversion…)",
    placeholder: "Budget: 5000€, CPA actuel: 45€, taux conv: 3.2%, panier moyen: 85€…",
    runLabel: "Simuler les scénarios",
  },
  {
    id: "struct",
    icon: "🏗️",
    title: "Architecte de compte",
    description: "Propose une structure de campagnes optimale selon les objectifs.",
    badge: "STRUCTURE",
    inputLabel: "Objectifs et contexte business",
    placeholder: "Ex: Lead gen B2B, 3 services différents, budget 8000€/mois, France entière…",
    runLabel: "Générer la structure",
  },
  {
    id: "negatives",
    icon: "🚫",
    title: "Générateur négatifs",
    description: "Listes de mots-clés négatifs intelligentes par thématique.",
    badge: "NÉGATIFS",
    inputLabel: "Thématique / mots-clés actuels",
    placeholder: "Ex: Plombier Paris — exclure formation, emploi, salaire, gratuit…",
    runLabel: "Générer les négatifs",
  },
  {
    id: "reporting",
    icon: "📋",
    title: "Rédacteur de rapports",
    description: "Transforme les données en rapport client clair et actionnable.",
    badge: "RAPPORT",
    inputLabel: "KPIs et données de la période",
    placeholder: "Coller les métriques : impressions, clics, CPA, conversions, budget dépensé…",
    runLabel: "Rédiger le rapport",
  },
  {
    id: "landing",
    icon: "🌐",
    title: "Analyseur Landing Page",
    description: "Évalue la pertinence de votre landing page vs vos annonces et mots-clés.",
    badge: "LP",
    inputLabel: "URL de la landing page + mots-clés ciblés",
    placeholder: "Ex: https://monsite.fr/offre — mots-clés : plombier paris, dépannage urgent…",
    runLabel: "Analyser la LP",
  },
];

// ═══════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════

export const OS_NAV: NavSection[] = [
  {
    title: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/os" },
      { id: "clients", label: "CRM Clients", icon: "Users", href: "/os/clients" },
      { id: "analytics", label: "Analytics", icon: "BarChart3", href: "/os/analytics" },
    ],
  },
  {
    title: "Outils IA",
    items: [
      { id: "ai-wizards", label: "AI Wizards", icon: "Sparkles", href: "/os/ai-wizards", badge: "IA" },
      { id: "analyste", label: "Analyste Pro", icon: "Sparkles", href: "/os/analyste-pro", badge: "PRO" },
      { id: "scripts", label: "Scripts Library", icon: "Code2", href: "/os/scripts" },
      { id: "reports", label: "Rapports WL", icon: "FileText", href: "/os/reports" },
    ],
  },
  {
    title: "Gestion",
    items: [
      { id: "alerts", label: "Alertes", icon: "Bell", href: "/os/alerts" },
      { id: "invoices", label: "Facturation", icon: "Receipt", href: "/os/invoices" },
      { id: "config", label: "Configuration", icon: "Settings", href: "/os/config" },
    ],
  },
];
