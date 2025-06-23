import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const EmptyProfileState = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="h-24 w-24 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-semibold text-gray-900">Aucun profil trouvé</h2>
          <p className="text-gray-500">
            Il semble que votre profil n'est pas encore configuré. Commencez par créer un nouveau profil pour continuer.
          </p>
          <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90">
            Créer un nouveau profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
