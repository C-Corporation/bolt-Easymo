import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TenantForm from './components/TenantForm';
import { Tenant } from '@/types/tenant';
import TenantDetails from './components/TenantDetails';
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

// Extension du type Tenant avec les propriétés manquantes
interface TenantWithDetails extends Tenant {
  idCardFront?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  status?: string;
  location?: string;
  phone?: string;
  property?: string;
}

export default function TenantsPage() {
  // État pour la gestion du formulaire et des détails
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Utilisation du hook useTenants
  const { tenants, loading, addTenant, updateTenant, deleteTenant } = useTenants();

  // Filtrer les locataires en fonction du terme de recherche
  const filteredTenants = tenants.filter(tenant => 
    `${tenant.first_name} ${tenant.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Gérer l'ajout d'un nouveau locataire
  const handleAddTenant = async (tenantData: Omit<Tenant, 'id' | 'created_at'>) => {
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

  // Gérer la sélection d'un locataire
  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant({
      ...tenant,
      firstName: tenant.first_name,
      lastName: tenant.last_name,
    });
    setIsDetailsDialogOpen(true);
  };

  // Gérer la fermeture du dialogue de détails
  const handleCloseDetails = () => {
    setSelectedTenant(null);
    setIsDetailsDialogOpen(false);
  };

  // Gérer la fermeture du formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTenant(null);
  };

  // Gérer l'ouverture du formulaire en mode édition
  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant({
      ...tenant,
      firstName: tenant.first_name,
      lastName: tenant.last_name,
    });
    setIsFormOpen(true);
  };

  // Gérer l'ouverture du formulaire en mode création
  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
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
              {filteredTenants.map((tenant) => (
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
                        <DropdownMenuItem onClick={() => handleSelectTenant(tenant)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Détails
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* Dialogue de détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du locataire</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <TenantDetails
              tenant={selectedTenant}
              onClose={handleCloseDetails}
              onEdit={handleEditTenant}
            />
          )}