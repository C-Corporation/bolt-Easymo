import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DocumentItem as DocumentRow } from "@/types/document";
import { toast } from "@/components/ui/use-toast";

// The shape of a document with the joined tenant information
export type DocumentWithTenant = DocumentRow & {
  tenants: {
    first_name: string;
    last_name: string;
  } | null;
};

// Type for creating a new document's metadata
export type DocumentInsert = Pick<DocumentRow, 'name' | 'type' | 'tenant_id' | 'property_id'>;

// Type for updating an existing document's metadata
export type DocumentUpdate = Partial<DocumentInsert>;

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentWithTenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*, tenants(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setDocuments((data as any) || []);

    } catch (err) {
      console.error("Erreur lors de la récupération des documents", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const addDocument = useCallback(async (
    file: File, 
    metadata: DocumentInsert
  ) => {
    try {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(uniqueFileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(uniqueFileName);

        if (!urlData.publicUrl) {
            throw new Error("Impossible d'obtenir l'URL publique pour le fichier.");
        }

        const newDocumentData = {
            ...metadata,
            file_url: urlData.publicUrl,
            upload_date: new Date().toISOString(),
        };

        const { error: dbError } = await supabase
            .from('documents')
            .insert(newDocumentData);
        
        if (dbError) throw dbError;

        await fetchDocuments();

        toast({
            title: "Succès",
            description: "Le document a été ajouté.",
        });
        return true;

    } catch (err) {
        console.error("Erreur lors de l'ajout du document:", err);
        toast({
            title: "Erreur",
            description: "Impossible d'ajouter le document.",
            variant: "destructive",
        });
        return false;
    }
  }, [fetchDocuments]);

  const updateDocument = useCallback(async (id: string, documentData: DocumentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await fetchDocuments();
        toast({ title: 'Succès', description: 'Document mis à jour avec succès.' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le document.', variant: 'destructive' });
      return false;
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (docToDelete: DocumentWithTenant) => {
    try {
      const filePath = docToDelete.file_url.split('/documents/')[1];
      if (!filePath) {
        throw new Error("URL de fichier invalide, impossible d'extraire le chemin.");
      }

      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.warn("Avertissement lors de la suppression du fichier du stockage:", storageError);
      }

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docToDelete.id);

      if (dbError) {
        throw dbError;
      }

      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docToDelete.id));

      toast({
        title: "Succès",
        description: "Le document a été supprimé.",
      });

    } catch (err) {
      console.error("Erreur lors de la suppression du document:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
    }
  }, []);

  return { documents, loading, fetchDocuments, addDocument, updateDocument, deleteDocument };
};
