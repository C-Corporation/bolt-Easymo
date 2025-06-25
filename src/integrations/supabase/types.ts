/**
 * Types dérivés manuellement du schéma Supabase.
 * Ce fichier est une représentation manuelle et peut nécessiter des mises à jour
 * si le schéma de la base de données change.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          created_at?: string;
        };
      };

      workspaces: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          owner_id?: string;
          created_at?: string;
        };
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: 'admin' | 'member';
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: 'admin' | 'member';
        };
        Update: {
          role?: 'admin' | 'member';
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          email: string | null;
          updated_at: string | null;
          selected_workspace_id: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          updated_at?: string | null;
          selected_workspace_id?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          updated_at?: string | null;
          selected_workspace_id?: string | null;
        };
      };
      properties: {
        Row: {
          id: string;
          address: string;
          type: string | null;
          surface: number | null;
          rent: number | null;
          charges: number | null;
          status: string | null;
          purchase_price: number | null;
          purchase_date: string | null;
          notes: string | null;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          address: string;
          type?: string | null;
          surface?: number | null;
          rent?: number | null;
          charges?: number | null;
          status?: string | null;
          purchase_price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          address?: string;
          type?: string | null;
          surface?: number | null;
          rent?: number | null;
          charges?: number | null;
          status?: string | null;
          purchase_price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          workspace_id?: string;
        };
      };
      tenants: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone_number: string | null;
          entry_date: string | null;
          exit_date: string | null;
          property_id: string | null;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone_number?: string | null;
          entry_date?: string | null;
          exit_date?: string | null;
          property_id?: string | null;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone_number?: string | null;
          entry_date?: string | null;
          exit_date?: string | null;
          property_id?: string | null;
          created_at?: string;
          workspace_id?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string | null;
          file_url: string;
          upload_date: string | null;
          property_id: string | null;
          tenant_id: string | null;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string | null;
          file_url: string;
          upload_date?: string | null;
          property_id?: string | null;
          tenant_id?: string | null;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string | null;
          file_url?: string;
          upload_date?: string | null;
          property_id?: string | null;
          tenant_id?: string | null;
          created_at?: string;
          workspace_id?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          amount: number;
          type: 'income' | 'expense';
          status: 'pending' | 'completed' | 'cancelled' | null;
          description: string;
          category: string | null;
          property_id: string | null;
          tenant_id: string | null;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          date: string;
          amount: number;
          type: 'income' | 'expense';
          status?: 'pending' | 'completed' | 'cancelled' | null;
          description: string;
          category?: string | null;
          property_id?: string | null;
          tenant_id?: string | null;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          date?: string;
          amount?: number;
          type?: 'income' | 'expense';
          status?: 'pending' | 'completed' | 'cancelled' | null;
          description?: string;
          category?: string | null;
          property_id?: string | null;
          tenant_id?: string | null;
          created_at?: string;
          workspace_id?: string;
        };
      };
      rent_payments: {
        Row: {
          id: string;
          tenant_id: string;
          property_id: string;
          month: number;
          year: number;
          amount_paid: number | null;
          payment_date: string | null;
          status: string | null;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          property_id: string;
          month: number;
          year: number;
          amount_paid?: number | null;
          payment_date?: string | null;
          status?: string | null;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          property_id?: string;
          month?: number;
          year?: number;
          amount_paid?: number | null;
          payment_date?: string | null;
          status?: string | null;
          created_at?: string;
          workspace_id?: string;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
}

