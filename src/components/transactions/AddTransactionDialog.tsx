import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import type { TransactionInsert } from '@/types/transaction';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES, TRANSACTION_STATUSES } from '@/types/transaction';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionInsert) => Promise<boolean>;
}

export const AddTransactionDialog = ({ isOpen, onClose, onSave }: AddTransactionDialogProps) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<"income" | "expense">('income');
  const [category, setCategory] = useState<typeof TRANSACTION_CATEGORIES[number]>('loyer');
  const [status, setStatus] = useState<typeof TRANSACTION_STATUSES[number]>('pending');
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);

  const { properties } = useProperties();
  const { tenants } = useTenants();

  const handleSubmit = async () => {
    if (!date || !description || !amount) {
      return;
    }

    const transaction: TransactionInsert = {
      date: new Date(date),
      description,
      amount: parseFloat(amount),
      type,
      category,
      status,
      property_id: propertyId || null,
      tenant_id: tenantId || null,
    };

    const success = await onSave(transaction);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Montant (FCFA)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select
              onValueChange={setType}
              value={type}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === 'income' ? 'Revenu' : 'Dépense'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Catégorie</Label>
            <Select
              onValueChange={setCategory}
              value={category}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la catégorie" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'loyer' ? 'Loyer' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Statut</Label>
            <Select
              onValueChange={setStatus}
              value={status}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_STATUSES.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat === 'received' ? 'Reçu' : 
                     stat === 'paid' ? 'Payé' : 'En attente'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">Bien associé</Label>
            <Select
              onValueChange={setPropertyId}
              value={propertyId}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((prop) => (
                  <SelectItem key={prop.id} value={prop.id}>
                    {prop.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenant" className="text-right">Locataire associé</Label>
            <Select
              onValueChange={setTenantId}
              value={tenantId}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {`${tenant.first_name} ${tenant.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
