import type { Database } from "@/integrations/supabase/types";

/**
 * Represents a single tenant row from the 'tenants' table.
 * This type is derived directly from the auto-generated Supabase schema,
 * ensuring it's always in sync with the database.
 */
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];

// The input type for creating a new tenant, omitting db-generated fields
export type TenantInsert = Omit<Tenant, 'id' | 'created_at'>;

// The input type for updating a tenant, all fields are partial
export type TenantUpdate = Partial<Omit<Tenant, 'id' | 'created_at'>>;
