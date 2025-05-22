
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
        // Convert Supabase data to Tenant type with required fields
        const typedData: Tenant[] = data.map(item => ({
          id: item.id,
          status: item.status as 'En règle' | 'Pas en règle',
          unpaid: Number(item.unpaid),
          location: item.location,
          observation: item.observation || 'RAS',
          created_at: item.created_at,
          updated_at: item.updated_at,
          // Map the name field to firstName/lastName
          firstName: item.name?.split(' ')[1] || '',
          lastName: item.name?.split(' ')[0] || '',
          name: item.name,
          // Add required fields with placeholder values
          email: '',
          phone: '',
          gender: 'Homme',
          birthDate: '',
          idCardNumber: '',
          entryDate: '',
          property: {
            id: '',
            address: '',
            rent: 0
          }
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
      // Extract only the fields that exist in the database table
      const dbRecord = {
        name: tenant.firstName + ' ' + tenant.lastName,
        status: tenant.status,
        unpaid: tenant.unpaid,
        location: tenant.location,
        observation: tenant.observation
      };
      
      const { data, error } = await supabase
        .from('tenants')
        .insert([dbRecord])
        .select();

      if (error) throw error;
      
      if (data) {
        // Convert database record to Tenant type
        const newTenant: Tenant = {
          ...tenant,
          id: data[0].id,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          name: data[0].name
        };
        
        setTenants([...tenants, newTenant]);
        
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

  // Mettre à jour un locataire
  const updateTenant = async (id: string, tenant: Partial<Tenant>) => {
    try {
      // Extract only fields that exist in the database
      const dbRecord: any = {};
      if (tenant.firstName && tenant.lastName) {
        dbRecord.name = tenant.firstName + ' ' + tenant.lastName;
      } else if (tenant.name) {
        dbRecord.name = tenant.name;
      }
      
      if (tenant.status) dbRecord.status = tenant.status;
      if (tenant.unpaid !== undefined) dbRecord.unpaid = tenant.unpaid;
      if (tenant.location) dbRecord.location = tenant.location;
      if (tenant.observation) dbRecord.observation = tenant.observation;
      
      const { data, error } = await supabase
        .from('tenants')
        .update(dbRecord)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data) {
        // Update the tenant in the local state
        const updatedTenant: Tenant = {
          ...tenants.find(t => t.id === id)!,
          ...tenant,
          name: dbRecord.name || tenants.find(t => t.id === id)?.name,
          updated_at: data[0].updated_at
        };
        
        setTenants(tenants.map(t => t.id === id ? updatedTenant : t));
        
        toast({
          title: 'Succès',
          description: 'Locataire mis à jour avec succès',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du locataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le locataire',
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
    updateTenant,
  };
};
