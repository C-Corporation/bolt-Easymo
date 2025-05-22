import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tenant } from '@/types/tenant';
type TenantFormData = Omit<Tenant, 'id' | 'created_at' | 'updated_at'>;
type TenantFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
  initialData?: Tenant | null;
};
export default function TenantForm({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: TenantFormProps) {
  const defaultFormData: TenantFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Homme',
    birthDate: '',
    idCardNumber: '',
    idCardFront: '',
    idCardBack: '',
    entryDate: new Date().toISOString().split('T')[0],
    property: {
      id: '',
      address: '',
      rent: 0
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    notes: '',
    status: 'En règle',
    unpaid: 0,
    observation: '',
    location: ''
  } as TenantFormData;
  const [formData, setFormData] = useState<TenantFormData>(defaultFormData);
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        property: {
          ...defaultFormData.property,
          ...(initialData.property || {})
        },
        emergencyContact: initialData.emergencyContact ? {
          ...defaultFormData.emergencyContact,
          ...initialData.emergencyContact
        } : defaultFormData.emergencyContact
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idCardFront' | 'idCardBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Données factices pour les biens immobiliers
  const properties = [{
    id: '1',
    address: '12 Rue de la Paix, 75001 Paris'
  }, {
    id: '2',
    address: '24 Avenue des Champs-Élysées, 75008 Paris'
  }, {
    id: '3',
    address: '5 Rue de Rivoli, 75004 Paris'
  }];
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-500">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>
              {initialData ? 'Modifier le locataire' : 'Ajouter un nouveau locataire'}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Genre *</Label>
                  <Select value={formData.gender} onValueChange={(value: 'Homme' | 'Femme') => setFormData(prev => ({
                  ...prev,
                  gender: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance *</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCardNumber">Numéro de pièce d'identité *</Label>
                <Input id="idCardNumber" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recto de la pièce d'identité *</Label>
                  <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'idCardFront')} required={!formData.idCardFront} />
                  {formData.idCardFront && <div className="mt-2">
                      <img src={formData.idCardFront} alt="Recto de la pièce d'identité" className="h-32 object-cover rounded-md border" />
                    </div>}
                </div>

                <div className="space-y-2">
                  <Label>Verso de la pièce d'identité *</Label>
                  <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'idCardBack')} required={!formData.idCardBack} />
                  {formData.idCardBack && <div className="mt-2">
                      <img src={formData.idCardBack} alt="Verso de la pièce d'identité" className="h-32 object-cover rounded-md border" />
                    </div>}
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Coordonnées</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              </div>

              <h3 className="text-lg font-medium pt-4">Bien immobilier</h3>
              
              <div className="space-y-2">
                <Label htmlFor="property.id">Adresse du bien *</Label>
                <Select value={formData.property.id} onValueChange={value => {
                const selectedProperty = properties.find(p => p.id === value);
                if (selectedProperty) {
                  setFormData(prev => ({
                    ...prev,
                    property: {
                      ...prev.property,
                      id: selectedProperty.id,
                      address: selectedProperty.address
                    }
                  }));
                }
              }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bien" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => <SelectItem key={property.id} value={property.id}>
                        {property.address}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property.rent">Loyer mensuel (€) *</Label>
                <Input id="property.rent" name="property.rent" type="number" value={formData.property.rent || ''} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryDate">Date d'entrée *</Label>
                <Input id="entryDate" name="entryDate" type="date" value={formData.entryDate} onChange={handleChange} required />
              </div>

              <h3 className="text-lg font-medium pt-4">Contact d'urgence</h3>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.name">Nom complet *</Label>
                <Input id="emergencyContact.name" name="emergencyContact.name" value={formData.emergencyContact?.name || ''} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.phone">Téléphone *</Label>
                  <Input id="emergencyContact.phone" name="emergencyContact.phone" type="tel" value={formData.emergencyContact?.phone || ''} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.relation">Lien de parenté *</Label>
                  <Input id="emergencyContact.relation" name="emergencyContact.relation" value={formData.emergencyContact?.relation || ''} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes supplémentaires</Label>
                <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="bg-slate-100 text-slate-950">
              Annuler
            </Button>
            <Button type="submit" className="bg-[#E84A33] hover:bg-[#d43f2a]">
              {initialData ? 'Mettre à jour' : 'Ajouter le locataire'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}