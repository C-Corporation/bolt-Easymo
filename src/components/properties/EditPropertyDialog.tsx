import React, { useState, useEffect } from 'react';
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
import type { PropertyItem, PropertyUpdate } from '@/types/property';

interface EditPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyItem | null;
  onSave: (id: string, propertyData: PropertyUpdate) => Promise<boolean>;
}

export const EditPropertyDialog: React.FC<EditPropertyDialogProps> = ({ isOpen, onClose, property, onSave }) => {
  const [address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [rent, setRent] = useState<number | ''>('');
  const [surface, setSurface] = useState<number | ''>('');
  const [status, setStatus] = useState('Vacant');

  useEffect(() => {
    if (property) {
      setAddress(property.address || '');
      setType(property.type || '');
      setRent(property.rent || '');
      setSurface(property.surface || '');
      setStatus(property.status || 'Vacant');
    }
  }, [property]);

  const handleSubmit = async () => {
    if (!property) return;

    const updatedProperty: PropertyUpdate = {
      address,
      type,
      rent: Number(rent),
      surface: Number(surface),
      status,
    };

    const success = await onSave(property.id, updatedProperty);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le bien immobilier</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de la propriété ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Adresse</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Input id="type" value={type} onChange={(e) => setType(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rent" className="text-right">Loyer (FCFA)</Label>
            <Input id="rent" type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surface" className="text-right">Surface (m²)</Label>
            <Input id="surface" type="number" value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Statut</Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Occupé">Occupé</SelectItem>
                <SelectItem value="Vacant">Vacant</SelectItem>
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
