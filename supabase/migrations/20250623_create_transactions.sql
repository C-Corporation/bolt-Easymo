-- Create the transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL CHECK (category IN ('loyer', 'maintenance', 'assurance', 'taxes', 'autres')),
    status TEXT NOT NULL CHECK (status IN ('received', 'paid', 'pending')),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Add RLS policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own transactions
CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own transactions
CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own transactions
CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);
