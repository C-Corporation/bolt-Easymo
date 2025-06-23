import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyItem, PropertyInsert, PropertyUpdate } from "@/types/property";
import { toast } from "@/components/ui/use-toast";

export const useProperties = () => {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties((data ?? []) as PropertyItem[]);
    } catch (err) {
      console.error("Erreur lors de la récupération des biens", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les biens immobiliers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addProperty = useCallback(async (propertyData: PropertyInsert) => {
    try {
      const { error } = await supabase.from('properties').insert(propertyData);
      if (error) throw error;
      toast({ title: "Succès", description: "Le bien a été ajouté." });
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du bien", error);
      toast({ title: "Erreur", description: "Impossible d'ajouter le bien.", variant: "destructive" });
      return false;
    }
  }, [fetchProperties]);

  const updateProperty = useCallback(async (id: string, propertyData: PropertyUpdate) => {
    try {
      const { error } = await supabase.from('properties').update(propertyData).eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Le bien a été mis à jour." });
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bien", error);
      toast({ title: "Erreur", description: "Impossible de mettre à jour le bien.", variant: "destructive" });
      return false;
    }
  }, [fetchProperties]);

  const deleteProperty = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Le bien a été supprimé." });
      await fetchProperties();
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du bien", error);
      toast({ title: "Erreur", description: "Impossible de supprimer le bien.", variant: "destructive" });
      return false;
    }
  }, [fetchProperties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, fetchProperties, addProperty, updateProperty, deleteProperty };
};
