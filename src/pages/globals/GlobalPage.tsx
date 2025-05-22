
import React from 'react';

const GlobalPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vue globale</h1>
          <p className="text-muted-foreground">Aperçu de toutes vos activités</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Statistiques locataires</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Locataires actifs</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Statistiques immobiliers</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Propriétés</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Finances</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">8500€</p>
            <p className="text-sm text-muted-foreground">Revenus mensuels</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium">Activité récente</h3>
          <p className="text-sm text-muted-foreground">Dernières actions effectuées</p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-none">
                <div className="rounded-full bg-primary/10 p-2">
                  <div className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Action {i}</p>
                  <p className="text-sm text-muted-foreground">
                    Description de l'action effectuée
                  </p>
                  <p className="text-xs text-muted-foreground">Il y a {i} heure(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPage;
