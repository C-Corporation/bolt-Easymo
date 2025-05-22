
import React from 'react';

const PropertiesPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Immobiliers</h1>
          <p className="text-muted-foreground">Gérez vos biens immobiliers</p>
        </div>
        <button className="bg-[#E84A33] hover:bg-[#d43f2a] text-white px-4 py-2 rounded-md flex items-center gap-2">
          <span className="h-4 w-4">+</span>
          Ajouter un bien
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="aspect-[16/9] bg-muted"></div>
            <div className="p-6">
              <h3 className="text-lg font-medium">Appartement {i}</h3>
              <p className="text-sm text-muted-foreground">{`${10 + i} Rue de Paris, 75001 Paris`}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Surface</span>
                  <span className="font-medium">{`${50 + i * 10} m²`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Loyer</span>
                  <span className="font-medium">{`${800 + i * 100} €/mois`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Statut</span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Occupé
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
