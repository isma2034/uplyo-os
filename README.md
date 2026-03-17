# Uplyo OS — v2.0-beta

> L'OS des experts Google Ads — Agence + SaaS B2B

## Stack
- **Framework** : Next.js 14 (App Router)
- **Styles** : Tailwind CSS 3.4 + CSS Design Tokens
- **Typo** : DM Sans / DM Mono
- **Icons** : Lucide React
- **IA** : API Anthropic Claude (Analyste Pro + AI Wizards)

## Pages (12 routes)

### Agency (landing)
- `/` — Landing page agence (hero, offres, méthode, témoignages, FAQ, contact)

### Uplyo OS (SaaS)
- `/os` — Dashboard (KPIs, derniers clients, raccourcis)
- `/os/clients` — CRM Clients (recherche, filtres, liste)
- `/os/clients/[id]` — Fiche client détaillée (overview, performance 30j, historique)
- `/os/analytics` — Analytics cross-compte
- `/os/analyste-pro` — Analyste Pro (audit IA, plan 90j, workload, scripts)
- `/os/ai-wizards` — AI Wizards (7 assistants IA)
- `/os/scripts` — Scripts Library (16 scripts, clipboard copy)
- `/os/reports` — Rapports Marque Blanche (5 templates)
- `/os/alerts` — Alertes et Monitoring (fil + règles)
- `/os/invoices` — Facturation
- `/os/config` — Configuration

## Installation

```bash
npm install
npm run dev
```

## Licence
Propriétaire — Uplyo · Tous droits réservés
