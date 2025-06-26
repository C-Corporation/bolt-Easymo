-- ===================================================================
-- EASYIMO - Supabase Full Database Schema
-- ===================================================================
-- This script defines the complete database structure for the app.
-- Run this in your Supabase SQL Editor to set up all tables and relationships.
--
-- IMPORTANT :
-- Ce fichier doit être mis à jour à chaque modification du schéma ou des policies !

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  email text null,
  updated_at timestamp with time zone null default now(),
  username text null,
  selected_workspace_id uuid null,
  selected_owner_id uuid null,
  role text null,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_selected_owner_id_fkey foreign KEY (selected_owner_id) references owners (id) on delete set null,
  constraint profiles_selected_workspace_id_fkey foreign KEY (selected_workspace_id) references workspaces (id) on delete set null
) TABLESPACE pg_default;

-- Policies for profiles
-- SELECT: Users can select their own profile
CREATE POLICY "Users can select their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- SELECT: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Table: workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid not null default gen_random_uuid(),
  name text not null,
  logo_url text null,
  owner_id uuid not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null default now(),
  constraint workspaces_pkey primary key (id),
  constraint workspaces_owner_id_fkey foreign KEY (owner_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Policies for workspaces
-- INSERT: Allow authenticated users to create workspaces
CREATE POLICY "Allow authenticated users to create workspaces" ON public.workspaces FOR INSERT TO authenticated USING (true);
-- SELECT: TEMP_ALLOW_READ
CREATE POLICY "TEMP_ALLOW_READ" ON public.workspaces FOR SELECT TO authenticated USING (true);
-- SELECT: Users can view workspaces they are members of
CREATE POLICY "Users can view workspaces they are members of" ON public.workspaces FOR SELECT USING (
  id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);

-- Table: workspace_members
CREATE TABLE IF NOT EXISTS public.workspace_members (
  workspace_id uuid not null,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint workspace_members_pkey primary key (workspace_id, user_id),
  constraint workspace_members_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint workspace_members_workspace_id_fkey foreign KEY (workspace_id) references workspaces (id) on delete CASCADE
) TABLESPACE pg_default;

-- Policies for workspace_members
-- ALL: Admins can manage workspace members
CREATE POLICY "Admins can manage workspace members" ON public.workspace_members FOR ALL USING (true);
-- SELECT: Allow members to view other workspace members
CREATE POLICY "Allow members to view other workspace members" ON public.workspace_members FOR SELECT TO authenticated USING (true);
-- INSERT: Allow users to add themselves to a workspace
CREATE POLICY "Allow users to add themselves to a workspace" ON public.workspace_members FOR INSERT TO authenticated USING (true);
-- SELECT: Users can view members of their workspaces
CREATE POLICY "Users can view members of their workspaces" ON public.workspace_members FOR SELECT USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);

-- Table: owners
CREATE TABLE IF NOT EXISTS public.owners (
  id uuid not null default gen_random_uuid(),
  workspace_id uuid not null,
  first_name text null,
  last_name text null,
  email text null,
  phone text null,
  address text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null default now(),
  type text null default 'personne',
  notes text null,
  constraint owners_pkey primary key (id),
  constraint owners_workspace_id_fkey foreign KEY (workspace_id) references workspaces (id) on delete CASCADE,
  constraint owners_type_check check (
    (type = any (array['personne'::text, 'societe'::text]))
  )
) TABLESPACE pg_default;

-- Policies for owners
-- DELETE: Users can delete owners in their workspace
CREATE POLICY "Users can delete owners in their workspace" ON public.owners FOR DELETE USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);
-- INSERT: Users can insert owner in their workspace
CREATE POLICY "Users can insert owner in their workspace" ON public.owners FOR INSERT USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);
-- UPDATE: Users can update owners in their workspace
CREATE POLICY "Users can update owners in their workspace" ON public.owners FOR UPDATE USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);
-- SELECT: Users can view owners in their workspace
CREATE POLICY "Users can view owners in their workspace" ON public.owners FOR SELECT USING (
  workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
);

-- 1. Properties Table
-- Stores all real estate properties.
CREATE TABLE IF NOT EXISTS public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid,
    address text NOT NULL,
    type text, -- e.g., 'Appartement', 'Maison'
    surface numeric, -- in m²
    rent numeric, -- Monthly rent without charges
    charges numeric, -- Monthly charges
    status text, -- e.g., 'Loué', 'Libre', 'En travaux'
    purchase_price numeric,
    purchase_date date,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    constraint properties_owner_id_fkey foreign key (owner_id) references public.owners(id) on delete set null
);

-- 2. Tenants Table
-- Manages information about tenants.
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone text,
    entry_date date,
    exit_date date,
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL, -- Link to the rented property
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    constraint tenants_owner_id_fkey foreign key (owner_id) references public.owners(id) on delete set null
);

-- 3. Documents Table
-- Stores files related to properties or tenants.
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid,
    name text NOT NULL,
    type text, -- e.g., 'Bail', 'Quittance', 'État des lieux'
    file_url text NOT NULL, -- URL from Supabase Storage
    upload_date date DEFAULT now(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE, -- If property is deleted, so are its documents
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE, -- If tenant is deleted, so are their documents
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    constraint documents_owner_id_fkey foreign key (owner_id) references public.owners(id) on delete set null
);

-- 4. Transactions Table
-- Tracks all financial movements (income and expenses).
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid,
    date date NOT NULL,
    amount numeric NOT NULL, -- Always positive value
    type text NOT NULL CHECK (type IN ('income', 'expense')), -- 'income' or 'expense'
    status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')), -- Transaction status
    description text NOT NULL,
    category text, -- e.g., 'Loyer', 'Travaux', 'Taxe foncière'
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL, -- Link to a property
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL, -- Link to a tenant
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    constraint transactions_owner_id_fkey foreign key (owner_id) references public.owners(id) on delete set null
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
    owner_id uuid,
    amount numeric NOT NULL,
    payment_date date NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method text,
    reference text,
    notes text,
    property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    constraint rent_payments_owner_id_fkey foreign key (owner_id) references public.owners(id) on delete set null
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON public.tenants(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON public.documents(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON public.documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_owner_id ON public.transactions(owner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON public.transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_id ON public.transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_owner_id ON public.rent_payments(owner_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property_id ON public.rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant_id ON public.rent_payments(tenant_id);

-- Update the transactions table to include the owner_id foreign key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_owner_id_fkey') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT transactions_owner_id_fkey 
        FOREIGN KEY (owner_id) REFERENCES public.owners(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('spatial_ref_sys', 'knex_migrations', 'knex_migrations_lock')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_modtime ON %I', t.table_name, t.table_name);
        EXECUTE format('CREATE TRIGGER update_%s_modtime
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
            t.table_name, t.table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  
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

-- End of schema
