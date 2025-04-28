
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
    <div className="bg-background rounded-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-4xl font-bold">Locataires</h1>
          <p className="text-muted-foreground">La liste de tout les locataires de : M. ZEKE Philippe</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Dernière mise à jour : il y a 3 jours
        </div>
      </div>
      
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="w-[200px] cursor-pointer" onClick={() => sortData('name')}>
              <div className="flex items-center">
                Nom & Prénom {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => sortData('status')}>
              <div className="flex items-center">
                Situation {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => sortData('unpaid')}>
              <div className="flex items-center">
                Impayés {getSortIcon('unpaid')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => sortData('observation')}>
              <div className="flex items-center">
                Observation {getSortIcon('observation')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => sortData('location')}>
              <div className="flex items-center">
                Localité {getSortIcon('location')}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.name}</TableCell>
              <TableCell>
                <span className={tenant.status === 'En règle' ? 'text-green-500' : 'text-red-500'}>
                  {tenant.status}
                </span>
              </TableCell>
              <TableCell>{tenant.unpaid}</TableCell>
              <TableCell>{tenant.observation}</TableCell>
              <TableCell>{tenant.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-end p-4">
        <Button variant="default" className="rounded-full">
          +
        </Button>
      </div>
    </div>
  );
};

export default TenantsTable;
