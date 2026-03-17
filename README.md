# ⚡ Uplyo OS — Prototype

> SaaS Google Ads pour agences et freelances. Dashboard, CRM, AI Wizards, Scripts, Facturation.

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** 18+ → [nodejs.org](https://nodejs.org)
- **VSCode** → [code.visualstudio.com](https://code.visualstudio.com)

### Installation

```bash
# 1. Ouvrir le dossier dans VSCode
code uplyo-os-project

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir **http://localhost:3000** dans le navigateur.

---

## 📁 Structure du projet

```
uplyo-os-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page (Agency)
│   │   ├── layout.tsx            ← Root layout + fonts
│   │   └── os/
│   │       ├── layout.tsx        ← OS layout (sidebar + topbar)
│   │       ├── page.tsx          ← Dashboard
│   │       ├── clients/page.tsx  ← CRM Clients
│   │       ├── analytics/page.tsx← Analytics
│   │       ├── ai-wizards/page.tsx ← AI Wizards
│   │       ├── scripts/page.tsx  ← Scripts Library
│   │       ├── invoices/page.tsx ← Facturation
│   │       └── config/page.tsx   ← Configuration
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       ← Sidebar navigation
│   │   │   └── Topbar.tsx        ← Top bar
│   │   ├── ui/                   ← Composants réutilisables
│   │   ├── agency/               ← Composants landing
│   │   └── os/                   ← Composants OS
│   ├── lib/
│   │   ├── types.ts              ← Types TypeScript
│   │   ├── data.ts               ← Données mock (clients, wizards, nav)
│   │   └── utils.ts              ← Utilitaires (cn, etc.)
│   └── styles/
│       └── globals.css           ← Design tokens + Tailwind + composants
├── .vscode/
│   ├── settings.json             ← Config VSCode optimale
│   └── extensions.json           ← Extensions recommandées
├── tailwind.config.ts            ← Design tokens Uplyo
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🎨 Stack technique

| Outil | Rôle | Coût |
|-------|------|------|
| **Next.js 14** | Framework React SSR/SSG | Gratuit |
| **TypeScript** | Typage statique | Gratuit |
| **Tailwind CSS** | Styling utility-first | Gratuit |
| **Lucide React** | Icônes | Gratuit |
| **Vercel** | Déploiement | Gratuit (hobby) |
| **Supabase** | Auth + DB (à venir) | Gratuit (50K MAU) |
| **API Claude** | AI Wizards | ~2€/1M tokens |

---

## 🛤️ Roadmap prochaines étapes

### Phase 1 — Prototype actuel ✅
- [x] Landing page Agency
- [x] Dashboard OS avec KPIs
- [x] CRM Clients avec filtres
- [x] AI Wizards (6 assistants)
- [x] Scripts Library
- [x] Facturation
- [x] Configuration

### Phase 2 — Backend & Auth
- [ ] Intégrer Supabase (auth + Postgres)
- [ ] Système de login / inscription
- [ ] Persistance des données CRM
- [ ] API routes pour les AI Wizards

### Phase 3 — Intégrations
- [ ] Google Ads API (lecture comptes)
- [ ] Looker Studio embed
- [ ] Slack notifications
- [ ] Calendly booking intégré
- [ ] Export PDF des factures

### Phase 4 — Production
- [ ] Tests unitaires + E2E
- [ ] Stripe pour les paiements
- [ ] Multi-tenant (marque blanche)
- [ ] Analytics d'usage

---

## 📦 Extensions VSCode recommandées

À l'ouverture du projet, VSCode proposera d'installer :
- **ESLint** — Linting
- **Prettier** — Formatage auto
- **Tailwind CSS IntelliSense** — Autocomplétion classes
- **GitLens** — Git avancé
- **Auto Rename Tag** — Renommage HTML/JSX
- **Path Intellisense** — Autocomplétion imports
- **ES7 React Snippets** — Snippets React rapides

---

## 🌐 Déploiement (gratuit)

```bash
# 1. Créer un repo GitHub
git init && git add . && git commit -m "init: Uplyo OS prototype"

# 2. Push vers GitHub
git remote add origin https://github.com/votre-user/uplyo-os.git
git push -u origin main

# 3. Déployer sur Vercel
# → Aller sur vercel.com, connecter le repo GitHub
# → Le déploiement est automatique à chaque push
```

---

Built with ⚡ by Uplyo
