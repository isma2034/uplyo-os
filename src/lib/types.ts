// ═══════════════════════════════════════════
// Uplyo OS — Core Type Definitions
// ═══════════════════════════════════════════

export type ClientStatus =
  | "prospect"
  | "onboarding"
  | "actif"
  | "scale"
  | "pause"
  | "churned";

export interface Client {
  id: string;
  nom: string;
  email: string;
  secteur: string;
  statut: ClientStatus;
  budget: number;
  cpa?: string;
  cpaActuel?: number;
  conversions?: number;
  auditScore?: number;
  notes?: string;
  gaAccountId?: string;
  lookerUrl?: string;
  calendlyUrl?: string;
  slackChannel?: string;
  mrr?: number;
  dateCreation: string;
}

export interface KPI {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  color?: "green" | "red" | "blue" | "amber" | "purple";
}

export interface WizardConfig {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  inputLabel: string;
  placeholder: string;
  runLabel: string;
  systemExtra?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientNom: string;
  numero: string;
  date: string;
  echeance: string;
  montantHT: number;
  tva: number;
  statut: "brouillon" | "envoyee" | "payee" | "retard";
  lignes: InvoiceLine[];
}

export interface InvoiceLine {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Script {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  tags: string[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
