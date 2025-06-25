import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyInsert, PropertyItem } from '@/types/property';

type PropertyFormProps = {
  onSubmit: (data: PropertyInsert) => void;
  onCancel: () => void;
  initialData?: PropertyItem | null;
};

export default function PropertyForm({ onSubmit, onCancel, initialData }: PropertyFormProps) {
  const defaultFormData: PropertyInsert = {
    address: '',
    type: null,
    surface: null,
    rent: null,
    charges: null,
    status: null,
    purchase_price: null,
    purchase_date: null,
    notes: null,
  };

  const [formData, setFormData] = useState<PropertyInsert>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Adresse *</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de bien</Label>
          <Select value={formData.type || ''} onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Appartement">Appartement</SelectItem>
              <SelectItem value="Maison">Maison</SelectItem>
              <SelectItem value="Bureau">Bureau</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status || ''} onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Loué">Loué</SelectItem>
              <SelectItem value="Vacant">Vacant</SelectItem>
              <SelectItem value="En rénovation">En rénovation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="surface">Surface (m²)</Label>
          <Input id="surface" name="surface" type="number" value={formData.surface || ''} onChange={handleNumberChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rent">Loyer mensuel (€)</Label>
          <Input id="rent" name="rent" type="number" value={formData.rent || ''} onChange={handleNumberChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="charges">Charges mensuelles (€)</Label>
          <Input id="charges" name="charges" type="number" value={formData.charges || ''} onChange={handleNumberChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_price">Prix d'achat (€)</Label>
          <Input id="purchase_price" name="purchase_price" type="number" value={formData.purchase_price || ''} onChange={handleNumberChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_date">Date d'achat</Label>
          <Input id="purchase_date" name="purchase_date" type="date" value={formData.purchase_date || ''} onChange={handleChange} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={4} />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="bg-slate-100 text-slate-950">
          Annuler
        </Button>
        <Button type="submit" className="bg-[#E84A33] hover:bg-[#d43f2a]">
          {initialData ? 'Mettre à jour' : 'Ajouter le bien'}
        </Button>
      </div>
    </form>
  );
}
