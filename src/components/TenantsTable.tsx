
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  status: 'En règle' | 'Pas en règle';
  unpaid: number;
  observation: string;
  location: string;
}

const initialTenants: Tenant[] = [
  { id: 1, name: 'AFFOKPE David', status: 'En règle', unpaid: 0, observation: 'RAS', location: 'Cotonou' },
  { id: 2, name: 'BIGNON Merveille', status: 'Pas en règle', unpaid: 25000, observation: 'A promis le 10 prochain', location: 'Allada' },
  { id: 3, name: 'KOUASSI Eric', status: 'En règle', unpaid: 0, observation: 'RAS', location: 'Abidjan' },
  { id: 4, name: 'TCHAGBA Aline', status: 'Pas en règle', unpaid: 15000, observation: 'A réglé partiellement', location: 'Lomé' },
  { id: 5, name: 'SOW Aboubakar', status: 'En règle', unpaid: 0, observation: 'RAS', location: 'Dakar' },
  { id: 6, name: 'ZOUKOU Kamel', status: 'Pas en règle', unpaid: 30000, observation: 'Délai jusqu\'au 5 prochain', location: 'Cotonou' },
  { id: 7, name: 'ADJOUA Margo', status: 'En règle', unpaid: 0, observation: 'RAS', location: 'Accra' },
  { id: 8, name: 'AKOUE Sarah', status: 'Pas en règle', unpaid: 20000, observation: 'À régler le 15 prochain', location: 'Cotonou' },
  { id: 9, name: 'DIALLO Moussa', status: 'En règle', unpaid: 0, observation: 'RAS', location: 'Bamako' },
  { id: 10, name: 'KONE Aissatou', status: 'Pas en règle', unpaid: 10000, observation: 'Délai jusqu\'au 20 prochain', location: 'Bamako' },
];

interface SortConfig {
  key: keyof Tenant | null;
  direction: 'ascending' | 'descending';
}

const TenantsTable: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });

  const sortData = (key: keyof Tenant) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    const sortedData = [...tenants].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setTenants(sortedData);
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (columnName: keyof Tenant) => {
    if (sortConfig.key !== columnName) {
      return <div className="w-4 h-4" />;
    }
    
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* En-tête de la page */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Locataires</h1>
            <p className="text-white">La liste de tout les locataires de : M. ZEKE Philippe</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="text-white">Dernière mise à jour : il y a 3 jours</span>
          </div>
        </div>
      </div>

      {/* Conteneur du tableau avec fond blanc */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden p-1.5">
        {/* En-têtes du tableau avec coins arrondis en haut et en bas */}
        <div className="sticky top-0 z-10">
          <div className="bg-[#62666c] rounded-full overflow-hidden">
            <div className="p-4">
              <div className="grid grid-cols-[200px,1fr,1fr,1.5fr,1fr] gap-4">
                <div 
                  className="cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider" 
                  onClick={() => sortData('name')}
                >
                  Nom & Prénom {getSortIcon('name')}
                </div>
                <div 
                  className="cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider" 
                  onClick={() => sortData('status')}
                >
                  Situation {getSortIcon('status')}
                </div>
                <div 
                  className="cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider" 
                  onClick={() => sortData('unpaid')}
                >
                  Impayés {getSortIcon('unpaid')}
                </div>
                <div 
                  className="cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider" 
                  onClick={() => sortData('observation')}
                >
                  Observation {getSortIcon('observation')}
                </div>
                <div 
                  className="cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider" 
                  onClick={() => sortData('location')}
                >
                  Localisation {getSortIcon('location')}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Corps du tableau avec défilement */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          <div className="space-y-2">
            {tenants.map((tenant, index) => (
              <div 
                key={tenant.id} 
                className={`grid grid-cols-[200px,1fr,1fr,1.5fr,1fr] items-center ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#f7f8f7] hover:bg-gray-100'
                } rounded-full p-4`}
              >
                <div className="text-[#62666c] text-center">{tenant.name}</div>
                <div className="text-center">
                  <span className={tenant.status === 'En règle' ? 'text-green-500' : 'text-red-500'}>
                    {tenant.status}
                  </span>
                </div>
                <div className="text-[#62666c] text-center">{tenant.unpaid}</div>
                <div className="text-[#62666c] truncate text-center">{tenant.observation}</div>
                <div className="text-[#62666c] text-center">{tenant.location}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end bg-white rounded-b-lg">
          <Button variant="default" className="shadow-sm">
            Ajouter un locataire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantsTable;
