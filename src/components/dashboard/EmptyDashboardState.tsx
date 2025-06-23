import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const EmptyDashboardState = () => {
  return (
    <EmptyState
      title="Bienvenue dans votre tableau de bord"
      description="Commencez par ajouter vos biens immobiliers et locataires pour suivre efficacement votre gestion locative."
      action={
        <div className="space-y-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien immobilier
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un locataire
          </Button>
        </div>
      }
    />
  );
};
