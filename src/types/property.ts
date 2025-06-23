import type { Database } from "@/integrations/supabase/types";

/**
 * Represents a single property row from the 'properties' table.
 * This type is derived directly from the auto-generated Supabase schema,
 * ensuring it's always in sync with the database.
 */
export type PropertyItem = Database["public"]["Tables"]["properties"]["Row"];

export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
