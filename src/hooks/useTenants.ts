import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tenant, TenantInsert, TenantUpdate } from '@/types/tenant';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Explicit return type for the hook to enforce a clear contract
interface UseTenantsReturn {
  tenants: Tenant[];
  loading: boolean;
  fetchTenants: () => Promise<void>;
  addTenant: (tenantData: TenantInsert) => Promise<boolean>;
  updateTenant: (id: string, tenantData: TenantUpdate) => Promise<boolean>;
  deleteTenant: (id: string) => Promise<void>;
}

export const useTenants = (): UseTenantsReturn => {
  const { profile } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    // Ne rien faire si le profil ou l'ID du workspace n'est pas encore chargé
    if (!profile?.selected_workspace_id) {
      setTenants([]); // Vider les locataires si aucun workspace n'est sélectionné
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        // Le RLS s'occupe de filtrer par workspace_id
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) throw error;
      if (data) {
        setTenants(data);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des locataires:', error);
      toast.error('Impossible de charger les locataires.');
    } finally {
      setLoading(false);
    }
  }, [profile?.selected_workspace_id]); // Se déclenche quand l'ID du workspace change

  const addTenant = useCallback(async (tenantData: TenantInsert) => {
    if (!profile?.selected_workspace_id) {
      toast.error("Aucun espace de travail n'est sélectionné pour y ajouter le locataire.");
      return false;
    }

    const dataWithWorkspace = {
      ...tenantData,
      workspace_id: profile.selected_workspace_id,
    };

    try {
      const { error } = await supabase.from('tenants').insert(dataWithWorkspace);
      if (error) throw error;
      toast.success('Le locataire a été ajouté.');
      await fetchTenants(); // Rafraîchir la liste
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du locataire:", error);
      toast.error("Impossible d'ajouter le locataire.");
      return false;
    }
  }, [fetchTenants, profile?.selected_workspace_id]);

  const updateTenant = useCallback(async (id: string, tenantData: TenantUpdate) => {
    try {
      const { error } = await supabase.from('tenants').update(tenantData).eq('id', id);
      if (error) throw error;
      toast.success('Le locataire a été mis à jour.');
      await fetchTenants();
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du locataire:', error);
      toast.error('Impossible de mettre à jour le locataire.');
      return false;
    }
  }, [fetchTenants]);

  const deleteTenant = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('tenants').delete().eq('id', id);
      if (error) throw error;
      toast.success('Le locataire a été supprimé.');
      await fetchTenants();
    } catch (error) {
      console.error('Erreur lors de la suppression du locataire:', error);
      toast.error('Impossible de supprimer le locataire.');
    }
  }, [fetchTenants]);


  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, fetchTenants, addTenant, updateTenant, deleteTenant };
};
