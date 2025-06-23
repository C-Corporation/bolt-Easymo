import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TenantForm from '../components/TenantForm';
import TenantDetails from '../components/TenantDetails';
import { Tenant } from '@/types/tenant';

type TenantWithRequiredId = Tenant & { id: string };

export default function TenantProfiles() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantWithRequiredId | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données factices pour l'exemple
  const tenants: TenantWithRequiredId[] = [
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
        id: 'prop1',
        address: '12 Rue de la Paix, 75001 Paris',
        rent: 850,
      },
      emergencyContact: {
        name: 'Marie Dupont',
        phone: '06 98 76 54 32',
        relation: 'Épouse'
      },
      status: 'En règle',
      unpaid: 0,
      observation: '',
      location: 'Paris'
    },
    // Ajoutez plus de locataires si nécessaire
  ];

  const filteredTenants = tenants.filter(tenant => 
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm)
  );

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant: TenantWithRequiredId) => {
    setSelectedTenant(tenant);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Ici, vous ajouterez la logique pour sauvegarder les données
    console.log('Données du formulaire :', data);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profils des locataires</h1>
          <p className="text-muted-foreground">Gérez les profils de vos locataires</p>
        </div>
        <Button onClick={handleAddTenant} className="bg-[#E84A33] hover:bg-[#d43f2a]">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un locataire
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un locataire..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importer
          </Button>
        </div>
      </div>

      {/* Tableau des locataires */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Bien immobilier</TableHead>
              <TableHead>Loyer</TableHead>
              <TableHead>Date d'entrée</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow 
                key={tenant.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTenant(tenant)}
              >
                <TableCell className="font-medium">
                  {`${tenant.firstName} ${tenant.lastName}`}
                </TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {tenant.property.address}
                </TableCell>
                <TableCell>{new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 0}).format(tenant.property.rent * 655)} FCFA</TableCell>
                <TableCell>
                  {new Date(tenant.entryDate).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTenant(tenant)}>
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Formulaire modal */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTenant}
      />

      {/* Détails du locataire */}
      {selectedTenant && !isFormOpen && (
        <TenantDetails
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
          onEdit={() => handleEditTenant(selectedTenant)}
        />
      )}
    </div>
  );
}
