import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tenant, TenantInsert, TenantUpdate } from '@/types/tenant';
import { toast } from '@/components/ui/use-toast';



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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) throw error;
      if (data) {
        setTenants(data);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des locataires:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les locataires.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addTenant = useCallback(async (tenantData: TenantInsert) => {
    try {
      const { error } = await supabase.from('tenants').insert(tenantData).select();
      if (error) throw error;
      toast({ title: 'Succès', description: 'Le locataire a été ajouté.' });
      await fetchTenants();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du locataire:", error);
      toast({ title: 'Erreur', description: "Impossible d'ajouter le locataire.", variant: 'destructive' });
      return false;
    }
  }, [fetchTenants]);

  const updateTenant = useCallback(async (id: string, tenantData: TenantUpdate) => {
    try {
      const { error } = await supabase.from('tenants').update(tenantData).eq('id', id);
      if (error) throw error;
      toast({ title: 'Succès', description: 'Le locataire a été mis à jour.' });
      await fetchTenants();
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du locataire:', error);
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le locataire.', variant: 'destructive' });
      return false;
    }
  }, [fetchTenants]);

  const deleteTenant = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('tenants').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Succès', description: 'Le locataire a été supprimé.' });
      await fetchTenants();
    } catch (error) {
      console.error('Erreur lors de la suppression du locataire:', error);
      toast({ title: 'Erreur', description: 'Impossible de supprimer le locataire.', variant: 'destructive' });
    }
  }, [fetchTenants]);


  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, fetchTenants, addTenant, updateTenant, deleteTenant };
};
