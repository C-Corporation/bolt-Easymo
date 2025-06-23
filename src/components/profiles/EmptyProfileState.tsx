import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const EmptyProfileState = () => {
  return (
    <EmptyState
      title="Aucun profil trouvé"
      description="Commencez par créer votre profil pour gérer efficacement votre parc immobilier."
      action={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer un profil
        </Button>
      }
    />
  );
};
