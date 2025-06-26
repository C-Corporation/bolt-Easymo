import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyItem, PropertyInsert, PropertyUpdate } from "@/types/property";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useProperties = () => {
  const { profile } = useAuth();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    if (!profile?.selected_workspace_id) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq('workspace_id', profile.selected_workspace_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties((data ?? []) as PropertyItem[]);
    } catch (err) {
      console.error("Erreur lors de la récupération des biens", err);
      toast.error("Impossible de charger les biens immobiliers");
    } finally {
      setLoading(false);
    }
  }, [profile?.selected_workspace_id]);

  const addProperty = useCallback(async (propertyData: PropertyInsert) => {
    if (!profile?.selected_workspace_id) {
      toast.error("Aucun espace de travail n'est sélectionné.");
      return false;
    }

    const dataWithWorkspace = {
      ...propertyData,
      workspace_id: profile.selected_workspace_id,
    };
    try {
      const { error } = await supabase.from('properties').insert(dataWithWorkspace);
      if (error) throw error;
      toast.success("Le bien a été ajouté.");
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du bien", error);
      toast.error("Impossible d'ajouter le bien.");
      return false;
    }
  }, [fetchProperties]);

  const updateProperty = useCallback(async (id: string, propertyData: PropertyUpdate) => {
    try {
      const { error } = await supabase.from('properties').update(propertyData).eq('id', id);
      if (error) throw error;
      toast.success("Le bien a été mis à jour.");
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bien", error);
      toast.error("Impossible de mettre à jour le bien.");
      return false;
    }
  }, [fetchProperties]);

  const deleteProperty = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      toast.success("Le bien a été supprimé.");
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du bien", error);
      toast.error("Impossible de supprimer le bien.");
      return false;
    }
  }, [fetchProperties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties, profile?.selected_workspace_id]);

  return { properties, loading, fetchProperties, addProperty, updateProperty, deleteProperty };
};
