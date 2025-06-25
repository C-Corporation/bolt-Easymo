import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionInsert, TRANSACTION_CATEGORIES, TRANSACTION_TYPES, TRANSACTION_STATUSES } from '@/types/transaction';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';

type TransactionFormProps = {
  onSubmit: (data: TransactionInsert) => void;
  onCancel: () => void;
  initialData?: TransactionInsert | null;
};

export default function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const { properties } = useProperties();
  const { tenants } = useTenants();

  const defaultFormData: TransactionInsert = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'loyer',
    type: 'income',
    status: 'pending',
    property_id: null,
    tenant_id: null,
  };

  const [formData, setFormData] = useState<TransactionInsert>(initialData || defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (name: keyof TransactionInsert) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant (€) *</Label>
          <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleAmountChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={handleSelectChange('type')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map(type => <SelectItem key={type} value={type}>{type === 'income' ? 'Revenu' : 'Dépense'}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={formData.category} onValueChange={handleSelectChange('category')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TRANSACTION_CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status || ''} onValueChange={handleSelectChange('status')}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
            <SelectContent>
              {TRANSACTION_STATUSES.map(stat => <SelectItem key={stat} value={stat} className="capitalize">{stat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_id">Bien associé</Label>
          <Select value={formData.property_id || ''} onValueChange={handleSelectChange('property_id')}>
            <SelectTrigger><SelectValue placeholder="Lier à un bien" /></SelectTrigger>
            <SelectContent>
              {properties.map(prop => <SelectItem key={prop.id} value={prop.id}>{prop.address}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenant_id">Locataire associé</Label>
          <Select value={formData.tenant_id || ''} onValueChange={handleSelectChange('tenant_id')}>
            <SelectTrigger><SelectValue placeholder="Lier à un locataire" /></SelectTrigger>
            <SelectContent>
              {tenants.map(t => <SelectItem key={t.id} value={t.id}>{`${t.first_name} ${t.last_name}`}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-[#E84A33] hover:bg-[#d43f2a]">{initialData ? 'Mettre à jour' : 'Ajouter'}</Button>
      </div>
    </form>
  );
}
