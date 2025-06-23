import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTenants } from '@/hooks/useTenants';
import type { Tenant } from '@/types/tenant';
import { useProperties } from '@/hooks/useProperties';

interface AddDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, metadata: { name: string; type: string; tenant_id: string | null; property_id: string | null; }) => Promise<boolean>;
}

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const { tenants }: { tenants: Tenant[] } = useTenants();
  const { properties } = useProperties();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDocName(selectedFile.name);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (file && docName && docType) {
      const newDocument = { name: docName, type: docType, tenant_id: tenantId, property_id: propertyId };
      const success = await onSave(file, newDocument);
      if (success) {
        onClose(); // Close the dialog after submission
      }
    }
  }, [file, docName, docType, tenantId, propertyId, onSave, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau document</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload" className="text-right">Fichier</Label>
            <Input id="file-upload" type="file" className="col-span-3" onChange={handleFileChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input id="name" value={docName} onChange={(e) => setDocName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={setDocType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bail">Bail</SelectItem>
                <SelectItem value="Quittance">Quittance</SelectItem>
                <SelectItem value="État des lieux">État des lieux</SelectItem>
                <SelectItem value="Facture">Facture</SelectItem>
                <SelectItem value="Assurance">Assurance</SelectItem>
                <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenant" className="text-right">Locataire</Label>
            <Select onValueChange={(value) => setTenantId(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Associer un locataire (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>{`${tenant.first_name} ${tenant.last_name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">Bien</Label>
            <Select onValueChange={(value) => setPropertyId(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Associer un bien (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id.toString()}>{property.address}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!file || !docName || !docType}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
