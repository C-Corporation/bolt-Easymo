import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const EmptyDocumentsState = () => {
  return (
    <EmptyState
      title="Aucun document trouvé"
      description="Commencez par télécharger vos documents importants pour gérer efficacement votre parc immobilier."
      action={
        <div className="space-y-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Télécharger un document
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Créer un dossier
          </Button>
        </div>
      }
    />
  );
};
