import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import type { Tenant, TenantUpdate } from '@/types/tenant';

interface EditTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, tenant: TenantUpdate) => Promise<boolean>;
  tenant: Tenant | null;
}

export const EditTenantDialog = ({ isOpen, onClose, onSave, tenant }: EditTenantDialogProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const { properties } = useProperties();

  useEffect(() => {
    if (tenant) {
      setFirstName(tenant.first_name);
      setLastName(tenant.last_name);
      setEmail(tenant.email || '');
      setPhone(tenant.phone_number || '');
      setEntryDate(tenant.entry_date ? tenant.entry_date.split('T')[0] : '');
      setExitDate(tenant.exit_date ? tenant.exit_date.split('T')[0] : '');
      setPropertyId(tenant.property_id || undefined);
    } else {
      // Reset form if no tenant is selected (e.g., on close)
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setEntryDate('');
      setExitDate('');
      setPropertyId(undefined);
    }
  }, [tenant, isOpen]);

  const handleSubmit = async () => {
    if (!tenant) return;

    const updatedTenant: TenantUpdate = {
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone_number: phone || null,
      entry_date: entryDate || null,
      exit_date: exitDate || null,
      property_id: propertyId || null,
    };

    const success = await onSave(tenant.id, updatedTenant);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le locataire</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">Prénom</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Nom</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Téléphone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entryDate" className="text-right">Date d'entrée</Label>
            <Input id="entryDate" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exitDate" className="text-right">Date de sortie</Label>
            <Input id="exitDate" type="date" value={exitDate} onChange={(e) => setExitDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">Bien associé</Label>
            <Select onValueChange={setPropertyId} value={propertyId}>
              <SelectTrigger className="col-span-3">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
