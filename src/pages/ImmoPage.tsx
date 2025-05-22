
import React from 'react';

const ImmoPage: React.FC = () => {
  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Immobiliers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistiques d'immobilier */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-[#2A2F36]">Statistiques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de propriétés:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'occupation:</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenu mensuel total:</span>
                <span className="font-medium">6 750 €</span>
              </div>
            </div>
          </div>

          {/* Liste des propriétés récentes */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-[#2A2F36]">Propriétés récentes</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Appartement T3 - Paris</span>
                <span className="text-[#E84A33]">1 200 €</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Studio - Lyon</span>
                <span className="text-[#E84A33]">650 €</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Maison T4 - Marseille</span>
                <span className="text-[#E84A33]">1 500 €</span>
              </li>
            </ul>
            <button className="mt-4 text-[#E84A33] font-medium text-sm hover:underline">
              Voir toutes les propriétés →
            </button>
          </div>
        </div>

        {/* Liste des biens */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2A2F36]">Mes biens immobiliers</h3>
            <button className="bg-[#E84A33] text-white px-4 py-2 rounded-lg hover:bg-[#E84A33]/90 transition-colors">
              Ajouter un bien
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">12 rue des Lilas, 75020 Paris</td>
                  <td className="px-4 py-3 whitespace-nowrap">Appartement T3</td>
                  <td className="px-4 py-3 whitespace-nowrap">65 m²</td>
                  <td className="px-4 py-3 whitespace-nowrap">1 200 €</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Occupé</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">5 avenue Jean Jaurès, 69000 Lyon</td>
                  <td className="px-4 py-3 whitespace-nowrap">Studio</td>
                  <td className="px-4 py-3 whitespace-nowrap">30 m²</td>
                  <td className="px-4 py-3 whitespace-nowrap">650 €</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Occupé</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">45 bd du Prado, 13008 Marseille</td>
                  <td className="px-4 py-3 whitespace-nowrap">Maison T4</td>
                  <td className="px-4 py-3 whitespace-nowrap">120 m²</td>
                  <td className="px-4 py-3 whitespace-nowrap">1 500 €</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Occupé</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">8 rue Emile Zola, 33000 Bordeaux</td>
                  <td className="px-4 py-3 whitespace-nowrap">Appartement T2</td>
                  <td className="px-4 py-3 whitespace-nowrap">48 m²</td>
                  <td className="px-4 py-3 whitespace-nowrap">850 €</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Vacant</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmoPage;
