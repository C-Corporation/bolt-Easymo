import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { DocumentInsert } from '@/hooks/useDocuments';

type DocumentFormProps = {
  onSubmit: (file: File, metadata: DocumentInsert) => void;
  onCancel: () => void;
};

export default function DocumentForm({ onSubmit, onCancel }: DocumentFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<DocumentInsert>({ name: '', type: '', property_id: null, tenant_id: null });
  const { properties } = useProperties();
  const { tenants } = useTenants();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!metadata.name) {
        setMetadata(prev => ({ ...prev, name: selectedFile.name.split('.').slice(0, -1).join('.') }));
      }
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof DocumentInsert) => (value: string) => {
    setMetadata(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit(file, metadata);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file">Fichier *</Label>
        <Input id="file" type="file" onChange={handleFileChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du document *</Label>
          <Input id="name" name="name" value={metadata.name} onChange={handleMetadataChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de document</Label>
          <Input id="type" name="type" value={metadata.type || ''} onChange={handleMetadataChange} placeholder="Ex: Bail, Quittance..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_id">Lier à un bien</Label>
          <Select value={metadata.property_id || ''} onValueChange={handleSelectChange('property_id')}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un bien" /></SelectTrigger>
            <SelectContent>
              {properties.map(prop => <SelectItem key={prop.id} value={prop.id}>{prop.address}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenant_id">Lier à un locataire</Label>
          <Select value={metadata.tenant_id || ''} onValueChange={handleSelectChange('tenant_id')}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un locataire" /></SelectTrigger>
            <SelectContent>
              {tenants.map(t => <SelectItem key={t.id} value={t.id}>{`${t.first_name} ${t.last_name}`}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={!file} className="bg-[#E84A33] hover:bg-[#d43f2a]">Ajouter le document</Button>
      </div>
    </form>
  );
}
