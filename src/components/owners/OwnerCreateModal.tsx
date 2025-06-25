import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOwners } from '@/contexts/OwnerContext';

export interface OwnerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  type: z.enum(['personne', 'societe']),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const OwnerCreateModal: React.FC<OwnerCreateModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const { switchOwner } = useOwners();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'personne',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    console.log('Début de la création du propriétaire avec les données:', data);
    console.log('Workspace ID du profil:', profile?.selected_workspace_id);
    console.log('ID utilisateur:', profile?.id);
    
    if (!profile?.selected_workspace_id) {
      const errorMsg = 'Aucun workspace sélectionné dans le profil utilisateur';
      console.error(errorMsg, { profile });
      toast({ 
        title: 'Erreur', 
        description: errorMsg, 
        variant: 'destructive' 
      });
      return;
    }
    setLoading(true);
    toast.loading('Création du propriétaire...');
    
    const ownerData = {
      name: data.name,
      type: data.type,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2,
      postal_code: data.postalCode,
      city: data.city,
      country: data.country,
      tax_id: data.taxId,
      notes: data.notes,
      workspace_id: profile.selected_workspace_id,
    };

    console.log('Tentative d\'insertion du propriétaire avec les données:', ownerData);
    
    try {
      const { data: inserted, error } = await supabase
        .from('owners')
        .insert(ownerData)
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la création du propriétaire:', error);
        toast({ 
          title: 'Erreur', 
          description: `Erreur lors de la création du propriétaire: ${error.message}`, 
          variant: 'destructive' 
        });
        setLoading(false);
        toast.dismiss();
        return;
      }
      
      console.log('Propriétaire créé avec succès:', inserted);

      console.log('Sélection du portefeuille propriétaire:', inserted.id);
      toast.success('Propriétaire créé avec succès. Sélection du portefeuille...');
      
      try {
        await switchOwner(inserted.id);
        console.log('Portefeuille sélectionné avec succès');
        toast.success('Portefeuille sélectionné !');
      } catch (switchError) {
        console.error('Erreur lors de la sélection du portefeuille:', switchError);
        toast({
          title: 'Avertissement',
          description: 'Le propriétaire a été créé mais une erreur est survenue lors de la sélection du portefeuille.',
          variant: 'warning'
        });
      }
    } catch (err: any) {
      console.error('Erreur inattendue lors de la création du propriétaire:', err);
      toast({ 
        title: 'Erreur', 
        description: err?.message || 'Erreur inconnue lors de la création du propriétaire.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
      toast.dismiss();
      // Fermer la modale uniquement en cas de succès
      if (!error) {
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un propriétaire</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du propriétaire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personne">Personne physique</SelectItem>
                      <SelectItem value="societe">Société</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email contact</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="exemple@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+225 ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes internes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#8f95a1] hover:bg-[#e84a33] text-white">
                {loading ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerCreateModal;
