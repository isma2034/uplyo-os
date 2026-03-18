-- ═══════════════════════════════════════════════════════════════
-- UPLYO OS — Supabase Multi-Tenant Schema
-- Architecture: Multi-tenant with Row Level Security (RLS)
-- Auth: Supabase Auth (email + OAuth Google)
-- Billing: Stripe Subscriptions
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. TENANTS (Organizations / Agencies) ───
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- e.g. "uplyo", "agence-martin"
  plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'solo', 'team', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days',
  -- White-label
  logo_url TEXT,
  brand_color TEXT DEFAULT '#6C5CE7',
  agency_name TEXT,
  agency_email TEXT,
  -- Quotas
  max_clients INT DEFAULT 10,
  max_analyses_month INT DEFAULT 10, -- Analyste Pro quota
  analyses_used_month INT DEFAULT 0,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. USERS ───
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. CLIENTS (of tenants) ───
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  email TEXT,
  secteur TEXT,
  statut TEXT NOT NULL DEFAULT 'prospect' CHECK (statut IN ('prospect', 'onboarding', 'actif', 'scale', 'pause', 'churned')),
  budget NUMERIC,
  cpa_cible TEXT,
  cpa_actuel NUMERIC,
  conversions INT,
  audit_score INT,
  notes TEXT,
  ga_account_id TEXT,
  looker_url TEXT,
  calendly_url TEXT,
  slack_channel TEXT,
  mrr NUMERIC,
  date_creation DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. INVOICES ───
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  numero TEXT NOT NULL, -- INV-2026-001
  date DATE NOT NULL,
  echeance DATE NOT NULL,
  montant_ht NUMERIC NOT NULL,
  tva NUMERIC DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyee', 'payee', 'retard')),
  lignes JSONB DEFAULT '[]', -- [{description, quantite, prix_unitaire}]
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. AI ANALYSES (Analyste Pro) ───
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL DEFAULT 'audit' CHECK (type IN ('audit', 'structure', 'copy', 'roas', 'negatives', 'reporting', 'landing')),
  input_data JSONB, -- CSV data, user input
  result JSONB, -- Full AI analysis result
  score INT,
  tokens_used INT,
  model TEXT DEFAULT 'claude-sonnet-4-6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. REPORTS (White Label) ───
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  template TEXT NOT NULL, -- 'monthly', 'weekly', 'audit', 'ecom', 'onboarding'
  title TEXT,
  data JSONB, -- Report data
  pdf_url TEXT,
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'genere', 'envoye')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. ALERTS ───
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  type TEXT NOT NULL CHECK (type IN ('budget', 'cpa', 'conv', 'anomaly', 'url', 'custom')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. ALERT RULES ───
CREATE TABLE public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  condition_config JSONB NOT NULL, -- {metric, operator, threshold, period}
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'slack', 'both')),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. ACTIVITY LOG ───
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('optim', 'report', 'test', 'meeting', 'script', 'alert', 'general')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Every table is isolated by tenant_id
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Helper function: get tenant_id for current user
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Users can see their own tenant
CREATE POLICY "Users see own tenant" ON public.tenants
  FOR SELECT USING (id = public.get_user_tenant_id());

-- Users see only their tenant's data (applied to all tables)
CREATE POLICY "Tenant isolation" ON public.users
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.clients
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.invoices
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.analyses
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.reports
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.alerts
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.alert_rules
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant isolation" ON public.activity_log
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_users_tenant ON public.users(tenant_id);
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_statut ON public.clients(tenant_id, statut);
CREATE INDEX idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_analyses_tenant ON public.analyses(tenant_id);
CREATE INDEX idx_analyses_client ON public.analyses(client_id);
CREATE INDEX idx_reports_tenant ON public.reports(tenant_id);
CREATE INDEX idx_alerts_tenant ON public.alerts(tenant_id);
CREATE INDEX idx_alerts_unread ON public.alerts(tenant_id, read) WHERE NOT read;
CREATE INDEX idx_activity_tenant ON public.activity_log(tenant_id);
CREATE INDEX idx_activity_client ON public.activity_log(client_id);

-- ═══════════════════════════════════════════════════════════════
-- STRIPE PLANS MAPPING
-- ═══════════════════════════════════════════════════════════════
-- Configure in Stripe Dashboard:
--
-- Product: Uplyo OS
--   Price: Solo  → 99€/month  (price_solo_monthly)
--   Price: Team  → 299€/month (price_team_monthly)
--
-- Webhook endpoint: https://uplyo.fr/api/stripe/webhook
-- Events to listen:
--   checkout.session.completed
--   customer.subscription.updated
--   customer.subscription.deleted
--   invoice.payment_succeeded
--   invoice.payment_failed
