
import React, { useState, useMemo } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';

interface SortConfig {
  key: keyof Tenant | null;
  direction: 'ascending' | 'descending';
}

const TenantsTable: React.FC = () => {
  const { tenants, loading } = useTenants();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });
  const [sortedTenants, setSortedTenants] = useState<Tenant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'En règle' | 'Pas en règle'>('all');

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (!tenants.length) return { total: 0, inOrder: 0, notInOrder: 0, totalUnpaid: 0 };
    
    const inOrder = tenants.filter(tenant => tenant.status === 'En règle').length;
    const notInOrder = tenants.filter(tenant => tenant.status === 'Pas en règle').length;
    const totalUnpaid = tenants.reduce((acc, tenant) => acc + tenant.unpaid, 0);
    
    return {
      total: tenants.length,
      inOrder,
      notInOrder,
      totalUnpaid
    };
  }, [tenants]);

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

  // Toggle le filtre de statut
  const toggleStatusFilter = (status: 'En règle' | 'Pas en règle') => {
    if (selectedStatus === status) {
      setSelectedStatus('all');
    } else {
      setSelectedStatus(status);
    }
  };

  // Filtrer les locataires par statut
  const filteredTenants = useMemo(() => {
    if (selectedStatus === 'all') {
      return sortConfig.key ? sortedTenants : tenants;
    }
    const tenantsToFilter = sortConfig.key ? sortedTenants : tenants;
    return tenantsToFilter.filter(tenant => tenant.status === selectedStatus);
  }, [tenants, sortedTenants, sortConfig.key, selectedStatus]);

  // Formater le nombre avec les séparateurs de milliers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
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
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-370px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Chargement des locataires...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>Aucun locataire à afficher</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTenants.map((tenant, index) => (
                <div 
                  key={tenant.id} 
                  className={`grid grid-cols-[50px,200px,1fr,1fr,1.5fr,1fr] items-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#f7f8f7]'
                  } hover:bg-gray-100 rounded-full p-4`}
                  onMouseEnter={() => setHoveredRow(tenant.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="flex justify-center">
                    {(hoveredRow === tenant.id || selectedTenants.includes(tenant.id)) && (
                      <Checkbox
                        checked={selectedTenants.includes(tenant.id)}
                        onCheckedChange={() => toggleTenantSelection(tenant.id)}
                        className="data-[state=checked]:bg-[#8f95a1] data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  </div>
                  <div className="text-[#62666c] text-center">{tenant.name}</div>
                  <div className="text-center">
                    <span className={tenant.status === 'En règle' ? 'text-green-500' : 'text-red-500'}>
                      {tenant.status}
                    </span>
                  </div>
                  <div className="text-[#62666c] text-center">{formatNumber(tenant.unpaid)}</div>
                  <div className="text-[#62666c] truncate text-center">{tenant.observation}</div>
                  <div className="text-[#62666c] text-center">{tenant.location}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sous-totaux */}
        <div className="p-4 bg-white rounded-lg">
          <div className="flex flex-wrap gap-3 justify-center">
            <Card className="shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-[#62666c] font-medium">Nbre de locataires:</span>
                <span className="font-bold text-[#62666c]">{stats.total}</span>
              </CardContent>
            </Card>
            
            <Card 
              className={`shadow-sm cursor-pointer ${selectedStatus === 'En règle' ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStatusFilter('En règle')}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-green-500 font-medium">En règle:</span>
                <span className="font-bold text-green-500">{stats.inOrder}</span>
              </CardContent>
            </Card>
            
            <Card 
              className={`shadow-sm cursor-pointer ${selectedStatus === 'Pas en règle' ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStatusFilter('Pas en règle')}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-red-500 font-medium">Pas en règle:</span>
                <span className="font-bold text-red-500">{stats.notInOrder}</span>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-[#62666c] font-medium">Impayés:</span>
                <span className="font-bold text-[#62666c]">{formatNumber(stats.totalUnpaid)}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Boutons d'action */}
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

  // Gestion du soumet pour ajouter un locataire
  function handleAddTenant(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) {
    const { addTenant } = useTenants();
    return addTenant(data);
  }
};

export default TenantsTable;
