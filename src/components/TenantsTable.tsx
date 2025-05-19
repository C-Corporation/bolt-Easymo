
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Plus, Pencil, Calendar } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import AddTenantModal from './AddTenantModal';
import { Tenant } from '@/types/tenant';
import { Toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SortConfig {
  key: keyof Tenant | null;
  direction: 'ascending' | 'descending';
}

const TenantsTable: React.FC = () => {
  const { tenants, loading, addTenant } = useTenants();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });
  const [sortedTenants, setSortedTenants] = useState<Tenant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  // Trier les données
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
    
    setSortedTenants(sortedData);
    setSortConfig({ key, direction });
  };
  
  // Obtenir l'icône de tri
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

  // Gestion du soumet pour ajouter un locataire
  const handleAddTenant = async (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    return await addTenant(data);
  };

  // Gérer la sélection des locataires
  const toggleTenantSelection = (tenantId: string) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantId)) {
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  // Utiliser les données triées ou les données originales
  const displayedTenants = sortConfig.key ? sortedTenants : tenants;
  
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
              <div className="grid grid-cols-[50px,200px,1fr,1fr,1.5fr,1fr] gap-4">
                <div className="flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider">
                  &nbsp;
                </div>
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
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Chargement des locataires...</p>
            </div>
          ) : displayedTenants.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>Aucun locataire à afficher</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedTenants.map((tenant, index) => (
                <div 
                  key={tenant.id} 
                  className={`grid grid-cols-[50px,200px,1fr,1fr,1.5fr,1fr] items-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#f7f8f7] hover:bg-gray-100'
                  } rounded-full p-4`}
                >
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectedTenants.includes(tenant.id)}
                      onCheckedChange={() => toggleTenantSelection(tenant.id)}
                      className="data-[state=checked]:bg-[#8f95a1] data-[state=checked]:text-primary-foreground"
                    />
                  </div>
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
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-end space-x-4 bg-white rounded-b-lg">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                className="shadow-sm flex items-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex-grow"></div>
          
          <Button 
            variant="outline"
            disabled={selectedTenants.length === 0}
            className={`shadow-sm ${
              selectedTenants.length > 0 
                ? 'bg-[#8f95a1] text-white hover:bg-[#d9592b]' 
                : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Pencil className="mr-2 h-4 w-4" /> Modifier
          </Button>
          
          <Button 
            variant="default" 
            className="shadow-sm bg-[#8f95a1] text-white hover:bg-[#d9592b]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un locataire
          </Button>
        </div>
      </div>

      {/* Modal d'ajout de locataire */}
      <AddTenantModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTenant}
      />

      {/* Toaster pour les notifications */}
      <Toaster />
    </div>
  );
};

export default TenantsTable;
