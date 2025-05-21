import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TenantForm from './components/TenantForm';
import { Tenant } from '@/types/tenant';
import TenantDetails from './components/TenantDetails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Type personnalisé qui étend le type Tenant pour rendre l'ID obligatoire
type TenantWithRequiredId = Tenant & { id: string };

export default function TenantsPage() {
  // État pour la gestion du formulaire et des détails
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantWithRequiredId | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données factices pour la démonstration
  const [tenants, setTenants] = useState<TenantWithRequiredId[]>([
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '06 12 34 56 78',
      gender: 'Homme',
      birthDate: '1985-05-15',
      idCardNumber: '1234567890123',
      entryDate: '2023-01-15',
      property: {
        id: '1',
        address: '12 Rue de la Paix, 75001 Paris',
        rent: 850,
      },
      emergencyContact: {
        name: 'Marie Dupont',
        phone: '06 98 76 54 32',
        relation: 'Épouse',
      },
      notes: 'A signalé une fuite dans la salle de bain le 15/03/2023',
      status: 'En règle',
      unpaid: 0,
      observation: 'Paiements toujours à jour',
      location: 'Paris',
      insurance: {
        company: '',
        policyNumber: '',
        expiryDate: ''
      },
      documents: []
    },
    {
      id: '2',
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@example.com',
      phone: '06 23 45 67 89',
      gender: 'Femme',
      birthDate: '1990-08-22',
      idCardNumber: '9876543210987',
      entryDate: '2023-03-10',
      property: {
        id: '2',
        address: '24 Avenue des Champs-Élysées, 75008 Paris',
        rent: 1200,
      },
      emergencyContact: {
        name: 'Pierre Martin',
        phone: '06 78 90 12 34',
        relation: 'Frère',
      },
      notes: '',
      status: 'En règle',
      unpaid: 0,
      observation: 'Nouveau locataire',
      location: 'Paris',
      insurance: {
        company: '',
        policyNumber: '',
        expiryDate: ''
      },
      documents: []
    },
  ]);

  // Filtrer les locataires en fonction de la recherche
  const filteredTenants = tenants.filter(
    (tenant) =>
      `${tenant.firstName} ${tenant.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer l'ajout/mise à jour d'un locataire
  const handleSubmitTenant = (data: Tenant) => {
    const tenantData: Tenant = {
      ...data,
      status: data.status || 'En règle',
      unpaid: data.unpaid || 0,
      observation: data.observation || '',
      location: data.location || '',
      notes: data.notes || '',
      property: {
        id: data.property?.id || '',
        address: data.property?.address || '',
        rent: data.property?.rent || 0,
      },
      emergencyContact: data.emergencyContact || {
        name: '',
        phone: '',
        relation: '',
      },
      insurance: data.insurance || {
        company: '',
        policyNumber: '',
        expiryDate: ''
      },
      documents: data.documents || []
    } as Tenant;

    if (selectedTenant) {
      // Mise à jour d'un locataire existant
      setTenants(
        tenants.map((t) =>
          t.id === selectedTenant.id ? { ...tenantData, id: selectedTenant.id } : t
        )
      );
    } else {
      // Ajout d'un nouveau locataire
      const newTenant: TenantWithRequiredId = {
        ...tenantData,
        id: Math.random().toString(36).substr(2, 9), // Génère un ID unique
      } as TenantWithRequiredId;
      setTenants([...tenants, newTenant]);
    }
    setIsFormOpen(false);
    setSelectedTenant(null);
  };

  // Gérer la suppression d'un locataire
  const handleDeleteTenant = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
      setTenants(tenants.filter((tenant) => tenant.id !== id));
      if (selectedTenant?.id === id) {
        setSelectedTenant(null);
      }
    }
  };

  // Formater la date en français
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec titre et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des locataires</h1>
          <p className="text-muted-foreground">
            Gérez les profils de vos locataires et leurs baux
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedTenant(null);
            setIsFormOpen(true);
          }}
          className="bg-[#E84A33] hover:bg-[#d43f2a]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un locataire
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un locataire, un email, un téléphone..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-[#e84a33] hover:text-white transition-colors duration-200"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-[#e84a33] hover:text-white transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-[#e84a33] hover:text-white transition-colors duration-200"
          >
            <Upload className="h-4 w-4" />
            Importer
          </Button>
        </div>
      </div>

      {/* Grille des locataires - Design rectangulaire */}
      {filteredTenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant) => (
            <div 
              key={tenant.id}
              className="group relative bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col h-64 w-full"
              onClick={() => setSelectedTenant(tenant)}
            >
              {/* Contenu principal */}
              <div className="flex-1 p-4 flex">
                {/* Photo du locataire */}
                <div className="w-1/3 pr-4 flex items-center justify-center">
                  <div className="h-full w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#E84A33] to-[#F9A826] flex items-center justify-center text-white text-2xl font-bold">
                      {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                    </div>
                  </div>
                </div>
                
                {/* Informations du locataire */}
                <div className="w-2/3 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {`${tenant.firstName} ${tenant.lastName}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tenant.gender} • {format(new Date(tenant.birthDate), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      tenant.status === 'En règle' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                  
                  {/* Séparation */}
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  {/* Détails */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-sm text-gray-500">
                      <p>{tenant.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#E84A33]">{tenant.property.rent} €</p>
                      <p className="text-xs text-gray-500">Loyer mensuel</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pied de carte */}
              <div className="border-t border-gray-200 py-3 px-4 bg-gray-50">
                <div className="flex items-center justify-center text-[#E84A33] font-medium text-sm uppercase tracking-wide">
                  Informations
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          {searchTerm ? (
            <p className="text-gray-500">Aucun locataire trouvé pour votre recherche.</p>
          ) : (
            <p className="text-gray-500">Aucun locataire enregistré pour le moment.</p>
          )}
        </div>
      )}

      {/* Formulaire d'ajout/édition */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTenant(null);
        }}
        onSubmit={handleSubmitTenant}
        initialData={selectedTenant || undefined}
      />

      {/* Détails du locataire */}
      {selectedTenant && !isFormOpen && (
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => setSelectedTenant(null)}
            className="mb-4"
          >
            Retour à la liste
          </Button>
          <TenantDetails
            tenant={selectedTenant}
            onClose={() => setSelectedTenant(null)}
            onEdit={() => setIsFormOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
