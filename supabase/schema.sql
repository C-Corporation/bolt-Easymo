-- ===================================================================
-- EASYIMO - Supabase Full Database Schema
-- ===================================================================
-- This script defines the complete database structure for the app.
-- Run this in your Supabase SQL Editor to set up all tables and relationships.

-- 1. Properties Table
-- Stores all real estate properties.
CREATE TABLE IF NOT EXISTS public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    address text NOT NULL,
    type text, -- e.g., 'Appartement', 'Maison'
    surface numeric, -- in m²
    rent numeric, -- Monthly rent without charges
    charges numeric, -- Monthly charges
    status text, -- e.g., 'Loué', 'Libre', 'En travaux'
    purchase_price numeric,
    purchase_date date,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tenants Table
-- Manages information about tenants.
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE,
    phone_number text,
    entry_date date,
    exit_date date,
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL, -- Link to the rented property
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Documents Table
-- Stores files related to properties or tenants.
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text, -- e.g., 'Bail', 'Quittance', 'État des lieux'
    file_url text NOT NULL, -- URL from Supabase Storage
    upload_date date DEFAULT now(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE, -- If property is deleted, so are its documents
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE, -- If tenant is deleted, so are their documents
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Transactions Table
-- Tracks all financial movements (income and expenses).
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    amount numeric NOT NULL, -- Always positive value
    type text NOT NULL CHECK (type IN ('income', 'expense')), -- 'income' or 'expense'
    status text CHECK (status IN ('pending', 'completed', 'cancelled')), -- Transaction status
    description text NOT NULL,
    category text, -- e.g., 'Loyer', 'Travaux', 'Taxe foncière'
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL, -- Link to a property
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL, -- Link to a tenant
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Function to calculate effective amount (positive for income, negative for expense)
CREATE OR REPLACE FUNCTION public.calculate_effective_amount(
    amount numeric,
    type text
)
RETURNS numeric AS $$
BEGIN
    RETURN CASE 
        WHEN type = 'income' THEN amount
        WHEN type = 'expense' THEN -amount
        ELSE 0
    END;
END;
$$ LANGUAGE plpgsql;

-- 5. Rent Payments Table
-- Detailed tracking of rent payments for each tenant.
CREATE TABLE IF NOT EXISTS public.rent_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    month int NOT NULL, -- e.g., 1 for January, 12 for December
    year int NOT NULL,
    amount_paid numeric,
    payment_date date,
    status text, -- e.g., 'Payé', 'En retard', 'Partiel'
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, month, year) -- Ensures one entry per tenant per month/year
);

-- 6. Profiles Table
-- Stores user-specific data, extending Supabase's auth users.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  email text UNIQUE,
  updated_at timestamptz
);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  -- Mettre à jour le display_name dans auth.users
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{display_name}',
    to_jsonb(COALESCE(new.raw_user_meta_data->>'display_name', ''))
  )
  WHERE id = new.id;
  
  RETURN new;
END;
$$;

-- Trigger to execute the function after a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Row-Level Security (RLS) Policies
-- Enable RLS for all relevant tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Function to get the selected workspace of the current user
CREATE OR REPLACE FUNCTION public.get_selected_workspace_id() RETURNS uuid AS $$
BEGIN
  RETURN (SELECT selected_workspace_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for 'properties'
DROP POLICY IF EXISTS "Users can view properties in their workspace" ON public.properties;
CREATE POLICY "Users can view properties in their workspace" ON public.properties FOR SELECT USING (workspace_id = public.get_selected_workspace_id());
DROP POLICY IF EXISTS "Users can manage properties in their workspace" ON public.properties;
CREATE POLICY "Users can manage properties in their workspace" ON public.properties FOR ALL USING (workspace_id = public.get_selected_workspace_id());

-- Policies for 'tenants'
DROP POLICY IF EXISTS "Users can view tenants in their workspace" ON public.tenants;
CREATE POLICY "Users can view tenants in their workspace" ON public.tenants FOR SELECT USING (workspace_id = public.get_selected_workspace_id());
DROP POLICY IF EXISTS "Users can manage tenants in their workspace" ON public.tenants;
CREATE POLICY "Users can manage tenants in their workspace" ON public.tenants FOR ALL USING (workspace_id = public.get_selected_workspace_id());

-- Add similar policies for documents, transactions, and rent_payments...

-- Policies for 'documents'
DROP POLICY IF EXISTS "Users can view documents in their workspace" ON public.documents;
CREATE POLICY "Users can view documents in their workspace" ON public.documents FOR SELECT USING (workspace_id = public.get_selected_workspace_id());
DROP POLICY IF EXISTS "Users can manage documents in their workspace" ON public.documents;
CREATE POLICY "Users can manage documents in their workspace" ON public.documents FOR ALL USING (workspace_id = public.get_selected_workspace_id());

-- Policies for 'transactions'
DROP POLICY IF EXISTS "Users can view transactions in their workspace" ON public.transactions;
CREATE POLICY "Users can view transactions in their workspace" ON public.transactions FOR SELECT USING (workspace_id = public.get_selected_workspace_id());
DROP POLICY IF EXISTS "Users can manage transactions in their workspace" ON public.transactions;
CREATE POLICY "Users can manage transactions in their workspace" ON public.transactions FOR ALL USING (workspace_id = public.get_selected_workspace_id());

-- Policies for 'rent_payments'
DROP POLICY IF EXISTS "Users can view rent_payments in their workspace" ON public.rent_payments;
CREATE POLICY "Users can view rent_payments in their workspace" ON public.rent_payments FOR SELECT USING (workspace_id = public.get_selected_workspace_id());
DROP POLICY IF EXISTS "Users can manage rent_payments in their workspace" ON public.rent_payments;
CREATE POLICY "Users can manage rent_payments in their workspace" ON public.rent_payments FOR ALL USING (workspace_id = public.get_selected_workspace_id());


-- Policies for 'workspaces' and 'workspace_members'
-- Users can see workspaces they are a member of.
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON public.workspaces;
CREATE POLICY "Users can view workspaces they belong to" ON public.workspaces FOR SELECT USING (
  id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);

-- Users can see members of workspaces they belong to.
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON public.workspace_members;
CREATE POLICY "Users can view members of their workspaces" ON public.workspace_members FOR SELECT USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);

-- Admins of a workspace can manage members.
DROP POLICY IF EXISTS "Admins can manage workspace members" ON public.workspace_members;
CREATE POLICY "Admins can manage workspace members" ON public.workspace_members FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON public.documents(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON public.transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant_id ON public.rent_payments(tenant_id);

-- End of schema.
