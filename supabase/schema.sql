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
  full_name text,
  avatar_url text,
  email text UNIQUE,
  updated_at timestamptz
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON public.tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON public.documents(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON public.transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant_id ON public.rent_payments(tenant_id);

-- End of schema.
