export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          benefice: number | null
          benefice_rabais: number | null
          created_at: string | null
          id: string
          modele: string
          montant_commande: number | null
          prix_fournisseur: number
          prix_marche: number
          prix_rabais: number | null
          prix_vente: number
          produit_id: number | null
          quantite: number
        }
        Insert: {
          benefice?: number | null
          benefice_rabais?: number | null
          created_at?: string | null
          id?: string
          modele: string
          montant_commande?: number | null
          prix_fournisseur?: number
          prix_marche?: number
          prix_rabais?: number | null
          prix_vente?: number
          produit_id?: number | null
          quantite?: number
        }
        Update: {
          benefice?: number | null
          benefice_rabais?: number | null
          created_at?: string | null
          id?: string
          modele?: string
          montant_commande?: number | null
          prix_fournisseur?: number
          prix_marche?: number
          prix_rabais?: number | null
          prix_vente?: number
          produit_id?: number | null
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          nom: string
        }
        Insert: {
          id?: number
          nom: string
        }
        Update: {
          id?: number
          nom?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          name: string
          type: string | null
          file_url: string
          upload_date: string | null
          property_id: string | null
          tenant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string | null
          file_url: string
          upload_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          file_url?: string
          upload_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          id: string
          address: string
          type: string | null
          surface: number | null
          rent: number | null
          charges: number | null
          status: string | null
          purchase_price: number | null
          purchase_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          address: string
          type?: string | null
          surface?: number | null
          rent?: number | null
          charges?: number | null
          status?: string | null
          purchase_price?: number | null
          purchase_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          address?: string
          type?: string | null
          surface?: number | null
          rent?: number | null
          charges?: number | null
          status?: string | null
          purchase_price?: number | null
          purchase_date?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      produits: {
        Row: {
          categorie_id: number | null
          id: number
          nom: string
        }
        Insert: {
          categorie_id?: number | null
          id?: number
          nom: string
        }
        Update: {
          categorie_id?: number | null
          id?: number
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          email: string | null
          entry_date: string | null
          exit_date: string | null
          first_name: string
          id: string
          last_name: string
          phone_number: string | null
          property_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          entry_date?: string | null
          exit_date?: string | null
          first_name: string
          id?: string
          last_name: string
          phone_number?: string | null
          property_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          entry_date?: string | null
          exit_date?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string | null
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
