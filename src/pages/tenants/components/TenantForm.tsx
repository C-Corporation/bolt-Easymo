import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tenant } from '@/types/tenant';
import { useProperties } from '@/hooks/useProperties';

// This type should only contain fields that are part of the 'tenants' table and are user-editable.
type TenantFormData = Partial<Omit<Tenant, 'id' | 'created_at'>>;

type TenantFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
  initialData?: Tenant | null;
};

export default function TenantForm({ onSubmit, onClose, initialData }: TenantFormProps) {
  const { properties, loading: loadingProperties } = useProperties();
  
  // The form state should only contain fields that exist in the database schema.
  const [formData, setFormData] = useState<TenantFormData>({});

  useEffect(() => {
    if (initialData) {
      // If we are editing, populate the form with existing data.
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone_number: initialData.phone_number || '',
        entry_date: initialData.entry_date ? new Date(initialData.entry_date).toISOString().split('T')[0] : '',
        exit_date: initialData.exit_date ? new Date(initialData.exit_date).toISOString().split('T')[0] : null,
        property_id: initialData.property_id || null,
      });
    } else {
      // If we are creating, start with an empty form.
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        entry_date: new Date().toISOString().split('T')[0],
        exit_date: null,
        property_id: null,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Information */}
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom *</Label>
          <Input id="first_name" name="first_name" value={formData.first_name || ''} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom *</Label>
          <Input id="last_name" name="last_name" value={formData.last_name || ''} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail *</Label>
          <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Téléphone</Label>
          <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number || ''} onChange={handleChange} />
        </div>

        {/* Property Information */}
        <div className="space-y-2">
          <Label htmlFor="property_id">Bien immobilier</Label>
          <Select
            value={formData.property_id || ''}
            onValueChange={value => handleSelectChange(value, 'property_id')}
            disabled={loadingProperties}
          >
            <SelectTrigger><SelectValue placeholder="Sélectionner un bien" /></SelectTrigger>
            <SelectContent>
              {loadingProperties ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : properties && properties.length > 0 ? (
                properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-properties" disabled>Aucun bien disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label htmlFor="entry_date">Date d'entrée</Label>
          <Input id="entry_date" name="entry_date" type="date" value={formData.entry_date || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_date">Date de sortie</Label>
          <Input id="exit_date" name="exit_date" type="date" value={formData.exit_date || ''} onChange={handleChange} />
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
  );
}