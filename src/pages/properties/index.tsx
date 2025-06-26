import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProperties } from '@/hooks/useProperties';
import type { PropertyItem, PropertyInsert, PropertyUpdate } from '@/types/property';
import PropertyForm from './components/PropertyForm';

const EmptyPropertiesState: React.FC<{ onAddProperty: () => void; }> = ({ onAddProperty }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg mt-16 bg-white">
      <div className="mb-6 p-4 rounded-full bg-primary/10">
        <Home className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Aucun bien immobilier pour le moment
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Commencez par ajouter votre premier bien pour le gérer et y associer des locataires.
      </p>
      <Button 
        className="bg-primary hover:bg-primary-hover"
        onClick={onAddProperty}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un bien
      </Button>
    </div>
  );
};

export default function PropertiesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { properties, loading, addProperty, updateProperty, deleteProperty } = useProperties();

  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = async (propertyData: PropertyInsert) => {
    await addProperty(propertyData);
    setIsFormOpen(false);
  };

  const handleUpdateProperty = async (propertyData: PropertyUpdate) => {
    if (!selectedProperty) return;
    await updateProperty(selectedProperty.id, propertyData);
    setIsFormOpen(false);
  };

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
  };

  const handleCreateProperty = () => {
    setSelectedProperty(null);
    setIsFormOpen(true);
  };

  const handleEditProperty = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return <div className="text-center p-8">Chargement des biens...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des biens immobiliers</h1>

      {properties.length === 0 ? (
        <EmptyPropertiesState onAddProperty={handleCreateProperty} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Liste des biens</h2>
            <Button onClick={handleCreateProperty} className="bg-primary hover:bg-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau bien
            </Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Rechercher par adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Adresse</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Loyer (€)</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-b">
                    <td className="p-4 font-medium">{property.address}</td>
                    <td className="p-4">{property.type}</td>
                    <td className="p-4">{property.rent}</td>
                    <td className="p-4">{property.status}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProperty ? 'Modifier le bien' : 'Nouveau bien immobilier'}</DialogTitle>
          </DialogHeader>
          <PropertyForm
            onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
            initialData={selectedProperty}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
