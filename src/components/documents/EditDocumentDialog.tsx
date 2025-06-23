import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTenants } from '@/hooks/useTenants';
import type { Tenant } from '@/types/tenant';
import { useProperties } from '@/hooks/useProperties';
import type { DocumentWithTenant } from '@/hooks/useDocuments';
import type { DocumentUpdate } from '@/hooks/useDocuments';

interface EditDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentWithTenant | null;
  onSave: (id: string, data: DocumentUpdate) => Promise<boolean>;
}

export const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({ isOpen, onClose, document, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const { tenants }: { tenants: Tenant[] } = useTenants();
  const { properties } = useProperties();

  useEffect(() => {
    if (document) {
      setName(document.name || '');
      setType(document.type || '');
      setTenantId(document.tenant_id || null);
      setPropertyId(document.property_id || null);
    }
  }, [document]);

  const handleSubmit = async () => {
    if (!document) return;

    const updatedData: DocumentUpdate = {
      name,
      type,
      tenant_id: tenantId,
      property_id: propertyId,
    };

    const success = await onSave(document.id, updatedData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du document ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input id="type" value={type} onChange={(e) => setType(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenant" className="text-right">
              Locataire
            </Label>
            <Select onValueChange={setTenantId} value={tenantId || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.first_name} {tenant.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">
              Propriété
            </Label>
            <Select onValueChange={setPropertyId} value={propertyId || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une propriété" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
