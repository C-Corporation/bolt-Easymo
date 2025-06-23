
import React, { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2 } from 'lucide-react';
import { AddPropertyDialog } from '@/components/properties/AddPropertyDialog';
import { EditPropertyDialog } from '@/components/properties/EditPropertyDialog';
import type { PropertyItem } from '@/types/property';
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

const ImmoPage: React.FC = () => {
  const { properties, loading, addProperty, updateProperty, deleteProperty } = useProperties();

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyItem | null>(null);

  // --- Handlers ---
  const handleAddClick = () => setAddDialogOpen(true);

  const handleEditClick = (property: PropertyItem) => {
    setSelectedProperty(property);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (property: PropertyItem) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete.id);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  // --- Stats Calculations ---
  const stats = {
    totalProperties: properties.length,
    occupied: properties.filter(p => p.status === 'Occupé').length,
    totalRevenue: properties.reduce((sum, p) => sum + (p.rent || 0), 0),
  };

  const occupancyRate = stats.totalProperties > 0 
    ? ((stats.occupied / stats.totalProperties) * 100).toFixed(1) + '%' 
    : '0%';

  return (
    <>
      <div className="h-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Immobiliers</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistiques d'immobilier */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#2A2F36]">Statistiques</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Nombre de propriétés:</span>
                  <span className="font-medium">{stats.totalProperties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Taux d'occupation:</span>
                  <span className="font-medium">{occupancyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Revenu mensuel total:</span>
                  <span className="font-medium">{stats.totalRevenue.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Liste des propriétés récentes */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#2A2F36]">Propriétés récentes</h3>
              <ul className="space-y-2">
                {loading ? (
                  <li><span className="text-gray-700">Chargement...</span></li>
                ) : (
                  properties.slice(0, 3).map((property) => (
                    <li key={property.id} className="flex justify-between">
                      <span className="text-gray-700">{property.type} - {property.address.split(',')[0]}</span>
                      <span className="text-[#E84A33]">{(property.rent || 0).toLocaleString()} FCFA</span>
                    </li>
                  ))
                )}
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
              <Button onClick={handleAddClick} className="bg-[#E84A33] text-white px-4 py-2 rounded-lg hover:bg-[#E84A33]/90 transition-colors">
                Ajouter un bien
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Adresse</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Surface</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Loyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-3 text-center">Chargement...</td></tr>
                  ) : (
                    properties.map((property) => (
                      <tr key={property.id}>
                        <td className="px-4 py-3 whitespace-nowrap">{property.address}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{property.type}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{property.surface ? `${property.surface} m²` : '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{(property.rent || 0).toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.status === 'Occupé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {property.status || 'Vacant'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                           <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" title="Modifier" onClick={() => handleEditClick(property)}>
                              <FilePenLine className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Supprimer" onClick={() => handleDeleteClick(property)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddPropertyDialog isOpen={isAddDialogOpen} onClose={() => setAddDialogOpen(false)} onSave={addProperty} />

      {selectedProperty && (
        <EditPropertyDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          property={selectedProperty} 
          onSave={updateProperty} 
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce bien ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImmoPage;
