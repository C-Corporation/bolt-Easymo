import type { Database } from "@/integrations/supabase/types";

/**
 * Represents a single document row from the 'documents' table.
 * This type is derived directly from the auto-generated Supabase schema,
 * ensuring it's always in sync with the database.
 */
export type DocumentItem = Database["public"]["Tables"]["documents"]["Row"];
