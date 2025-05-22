
import React from 'react';

const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Gérez vos documents importants</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#E84A33] hover:bg-[#d43f2a] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <span className="h-4 w-4">+</span>
            Ajouter un document
          </button>
          <button className="border bg-muted text-foreground px-4 py-2 rounded-md flex items-center gap-2">
            <span className="h-4 w-4">🔍</span>
            Rechercher
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left text-sm font-medium">Nom</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Type</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Propriété</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Date d'ajout</th>
              <th className="py-3 px-4 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Contrat de bail - Dupont', type: 'Contrat', property: 'Appartement 1', date: '15/01/2023' },
              { name: 'Facture réparation', type: 'Facture', property: 'Appartement 2', date: '23/03/2023' },
              { name: 'Assurance habitation', type: 'Assurance', property: 'Appartement 1', date: '05/02/2023' },
              { name: 'État des lieux - Martin', type: 'État des lieux', property: 'Appartement 3', date: '10/04/2023' },
            ].map((doc, i) => (
              <tr key={i} className="border-b">
                <td className="py-3 px-4 text-sm font-medium">{doc.name}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {doc.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{doc.property}</td>
                <td className="py-3 px-4 text-sm">{doc.date}</td>
                <td className="py-3 px-4 text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600">
                      <span className="h-4 w-4">👁️</span>
                    </button>
                    <button className="rounded-md bg-gray-500 p-1 text-white hover:bg-gray-600">
                      <span className="h-4 w-4">📥</span>
                    </button>
                    <button className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600">
                      <span className="h-4 w-4">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsPage;
