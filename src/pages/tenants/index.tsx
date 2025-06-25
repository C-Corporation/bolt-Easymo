import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, MapPin, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TenantForm from './components/TenantForm';
import { ImportTenantsDialog } from '@/components/tenants/ImportTenantsDialog';
import { Tenant, TenantInsert } from '@/types/tenant';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTenants } from '@/hooks/useTenants';



const EmptyTenantsState: React.FC<{ onAddTenant: () => void; onImport: () => void; }> = ({ onAddTenant, onImport }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg mt-16 bg-white">
      <div className="mb-6 p-4 rounded-full bg-primary/10">
        <Users className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Aucun locataire pour le moment
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Commencez par ajouter votre premier locataire pour gérer ses informations et documents.
      </p>
      <div className="flex items-center gap-4">
        <Button 
          className="bg-primary hover:bg-primary-hover"
          onClick={onAddTenant}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un locataire
        </Button>
        <Button 
          variant="outline"
          onClick={onImport}
        >
          <Upload className="mr-2 h-4 w-4" />
          Importer un locataire
        </Button>
      </div>
    </div>
  );
};

export default function TenantsPage() {
  // État pour la gestion du formulaire et des détails
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Utilisation du hook useTenants
  const { tenants, loading, addTenant, updateTenant, deleteTenant } = useTenants();

  // Filtrer les locataires en fonction du terme de recherche
  const filteredTenants = tenants.filter(tenant => 
    `${tenant.first_name} ${tenant.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Gérer l'ajout d'un nouveau locataire
  const handleAddTenant = async (tenantData: TenantInsert) => {
    try {
      await addTenant(tenantData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du locataire:', error);
    }
  };

  // Gérer la mise à jour d'un locataire
  const handleUpdateTenant = async (tenantData: Partial<Omit<Tenant, 'id' | 'created_at'>>) => {
    if (!selectedTenant) return;
    try {
      await updateTenant(selectedTenant.id, tenantData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du locataire:', error);
    }
  };

  // Gérer la suppression d'un locataire
  const handleDeleteTenant = async (id: string) => {
    try {
      await deleteTenant(id);
      setSelectedTenant(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du locataire:', error);
    }
  };



  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTenant(null);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsFormOpen(true);
  };

  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return <div className="text-center p-8">Chargement des locataires...</div>;
  }

  return (
    <div className="space-y-6">
      {tenants.length === 0 ? (
        <EmptyTenantsState onAddTenant={handleCreateTenant} onImport={() => setIsImportDialogOpen(true)} />
      ) : (
        <>
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Locataires</h1>
            <Button onClick={handleCreateTenant} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau locataire
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
          </div>

          {/* Tableau des locataires */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">Nom</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Téléphone</th>
                    <th className="p-4 text-left">Propriété</th>
                    <th className="p-4 text-left">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b">
                        <td className="p-4">
                          {tenant.first_name} {tenant.last_name}
                        </td>
                        <td className="p-4">{tenant.email}</td>
                        <td className="p-4">{tenant.phone_number}</td>
                        <td className="p-4">Propriété {tenant.property_id}</td>
                        <td className="p-4">En règle</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTenant(tenant)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTenant(tenant.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                              
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Aucun locataire ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Formulaire de locataire */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTenant ? 'Modifier le locataire' : 'Nouveau locataire'}</DialogTitle>
          </DialogHeader>
          <TenantForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={selectedTenant ? handleUpdateTenant : handleAddTenant}
            initialData={selectedTenant}
          />
        </DialogContent>
      </Dialog>

      

      <ImportTenantsDialog 
        isOpen={isImportDialogOpen} 
        onClose={() => setIsImportDialogOpen(false)} 
      />
    </div>
  );
}