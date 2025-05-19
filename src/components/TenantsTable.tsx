
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Plus, Trash } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import AddTenantModal from './AddTenantModal';
import { Tenant } from '@/types/tenant';
import { Toaster } from '@/components/ui/toaster';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SortConfig {
  key: keyof Tenant | null;
  direction: 'ascending' | 'descending';
}

const TenantsTable: React.FC = () => {
  const { tenants, loading, deleteTenant, addTenant } = useTenants();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });
  const [sortedTenants, setSortedTenants] = useState<Tenant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);

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

  // Ouvrir la modal de confirmation de suppression
  const openDeleteConfirmation = (id: string) => {
    setTenantToDelete(id);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (tenantToDelete) {
      await deleteTenant(tenantToDelete);
      setTenantToDelete(null);
    }
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setTenantToDelete(null);
  };

  // Gestion du soumet pour ajouter un locataire
  const handleAddTenant = async (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    return await addTenant(data);
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
              <div className="grid grid-cols-[200px,1fr,1fr,1.5fr,1fr,80px] gap-4">
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
                <div className="flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider">
                  Actions
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
                  className={`grid grid-cols-[200px,1fr,1fr,1.5fr,1fr,80px] items-center ${
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
                  <div className="flex justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => openDeleteConfirmation(tenant.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end bg-white rounded-b-lg">
          <Button 
            variant="default" 
            className="shadow-sm"
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

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={!!tenantToDelete} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toaster pour les notifications */}
      <Toaster />
    </div>
  );
};

export default TenantsTable;
