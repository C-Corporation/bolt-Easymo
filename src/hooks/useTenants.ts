
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types/tenant';
import { toast } from '@/components/ui/use-toast';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer tous les locataires
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (error) throw error;
      
      if (data) {
        // Assurons-nous que les données correspondent au type Tenant
        const typedData = data.map(item => ({
          ...item,
          status: item.status as 'En règle' | 'Pas en règle',
          unpaid: Number(item.unpaid)
        }));
        setTenants(typedData);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des locataires:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les locataires',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un locataire
  const deleteTenant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTenants(tenants.filter(tenant => tenant.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Locataire supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du locataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le locataire',
        variant: 'destructive',
      });
    }
  };

  // Ajouter un locataire
  const addTenant = async (tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenant])
        .select();

      if (error) throw error;
      
      if (data) {
        // Même conversion de type que dans fetchTenants
        const typedData = {
          ...data[0],
          status: data[0].status as 'En règle' | 'Pas en règle',
          unpaid: Number(data[0].unpaid)
        };
        setTenants([...tenants, typedData]);
        toast({
          title: 'Succès',
          description: 'Locataire ajouté avec succès',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du locataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le locataire',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return {
    tenants,
    loading,
    fetchTenants,
    deleteTenant,
    addTenant,
  };
};
