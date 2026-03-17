# Uplyo OS — v5.0

> **L'OS des experts Google Ads** — Agence + SaaS B2B  
> Stack: Next.js 14 · Tailwind CSS 3.4 · Lucide · API Anthropic Claude

---

## Installation rapide (5 minutes)

### Prérequis

- **Node.js** >= 18.17 (recommandé: v20 LTS ou v24)
- **npm** >= 9 (inclus avec Node.js)
- Un éditeur: VS Code recommandé (extensions incluses dans `.vscode/`)

### 1. Décompresser et installer

```bash
unzip uplyo-os-v5.zip -d uplyo-os
cd uplyo-os
npm install
```

### 2. Configurer

```bash
cp .env.example .env.local
# Edite .env.local avec ta clé API Anthropic
```

### 3. Lancer

```bash
npm run dev
# -> http://localhost:3000     (landing agency)
# -> http://localhost:3000/os  (Uplyo OS)
```

### 4. Builder pour la production

```bash
npm run build
npm run start
```

---

## Pages (12 routes)

| Route | Page | État |
|-------|------|------|
| `/` | Landing Agency | Complet |
| `/os` | Dashboard | Complet |
| `/os/clients` | CRM Clients | Complet |
| `/os/clients/[id]` | Fiche Client | Nouveau v5 |
| `/os/analyste-pro` | Analyste Pro IA | Nouveau v5 |
| `/os/ai-wizards` | AI Wizards (7) | Complet |
| `/os/scripts` | Scripts Library (16) | Enrichi v5 |
| `/os/reports` | Rapports WL | Nouveau v5 |
| `/os/alerts` | Alertes & Monitoring | Nouveau v5 |
| `/os/analytics` | Analytics | Fixé v5 |
| `/os/invoices` | Facturation | Fixé v5 |
| `/os/config` | Configuration | Fixé v5 |

---

## Licence

Propriétaire — Uplyo — Tous droits réservés — 2026
