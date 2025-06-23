import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTenants } from '@/hooks/useTenants';
import { AddTenantDialog } from '@/components/tenants/AddTenantDialog';
import { EditTenantDialog } from '@/components/tenants/EditTenantDialog';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import type { Tenant } from '@/types/tenant';
import { useProperties } from '@/hooks/useProperties';

const TenantsTablePage: React.FC = () => {
  const { tenants, loading, addTenant, updateTenant, deleteTenant } = useTenants();
  const { properties } = useProperties(); // To display property address
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTenant) {
      await deleteTenant(selectedTenant.id);
      setIsDeleteDialogOpen(false);
      setSelectedTenant(null);
    }
  };

  const getPropertyName = (propertyId: string | null) => {
    if (!propertyId) return 'N/A';
    const property = properties.find(p => p.id === propertyId);
    return property ? property.address : 'Inconnu';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Locataires</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un locataire
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Bien associé</TableHead>
              <TableHead>Date d'entrée</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Chargement des locataires...</TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant: Tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{`${tenant.first_name} ${tenant.last_name}`}</TableCell>
                  <TableCell>{tenant.email || 'N/A'}</TableCell>
                  <TableCell>{tenant.phone_number || 'N/A'}</TableCell>
                  <TableCell>{getPropertyName(tenant.property_id)}</TableCell>
                  <TableCell>{tenant.entry_date ? new Date(tenant.entry_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(tenant)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(tenant)}>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddTenantDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={addTenant}
      />

      <EditTenantDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTenant(null);
        }}
        onSave={updateTenant}
        tenant={selectedTenant}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTenant(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer le locataire"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedTenant?.first_name} ${selectedTenant?.last_name} ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default TenantsTablePage;
