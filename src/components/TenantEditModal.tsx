
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Tenant } from '@/types/tenant';
import { supabase } from '@/integrations/supabase/client';
import TenantForm from './TenantForm';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
  secondName: z.string().optional(),
  gender: z.enum(['Homme', 'Femme', 'Autre']),
  birthDate: z.string().optional(),
  phoneNumber: z.string().min(8, { message: 'Le numéro de téléphone doit être valide.' }),
  status: z.enum(['En règle', 'Pas en règle']),
  unpaid: z.number().nonnegative({ message: "Le montant impayé ne peut pas être négatif" }),
  location: z.string().min(3, { message: 'La localisation doit être spécifiée.' }),
  propertyType: z.string().min(1, { message: 'Le type de bien est requis.' }),
  observation: z.string().optional(),
  rent: z.number().positive({ message: "Le loyer doit être positif" }),
  caution: z.number().optional(),
  cautionMonths: z.number().positive({ message: "Le nombre de mois doit être positif" }).optional(),
});

interface TenantEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onEditSuccess: () => void;
}

const TenantEditModal: React.FC<TenantEditModalProps> = ({ isOpen, onClose, tenant, onEditSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tenant?.name || '',
      firstName: tenant?.firstName || '',
      secondName: tenant?.secondName || '',
      gender: tenant?.gender || 'Homme',
      birthDate: tenant?.birthDate || '',
      phoneNumber: tenant?.phoneNumber || '',
      status: tenant?.status || 'En règle',
      unpaid: tenant?.unpaid || 0,
      location: tenant?.location || '',
      propertyType: tenant?.propertyType || '',
      observation: tenant?.observation || 'RAS',
      rent: tenant?.rent || 0,
      caution: tenant?.caution || 0,
      cautionMonths: tenant?.cautionMonths || 1,
    },
  });

  React.useEffect(() => {
    if (tenant && isOpen) {
      form.reset({
        name: tenant.name || '',
        firstName: tenant.firstName || '',
        secondName: tenant.secondName || '',
        gender: tenant.gender || 'Homme',
        birthDate: tenant.birthDate || '',
        phoneNumber: tenant.phoneNumber || '',
        status: tenant.status || 'En règle',
        unpaid: tenant.unpaid || 0,
        location: tenant.location || '',
        propertyType: tenant.propertyType || '',
        observation: tenant.observation || 'RAS',
        rent: tenant.rent || 0,
        caution: tenant.caution || 0,
        cautionMonths: tenant.cautionMonths || 1,
      });
    }
  }, [tenant, isOpen, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!tenant) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name: data.name,
          firstName: data.firstName,
          secondName: data.secondName,
          gender: data.gender,
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber,
          status: data.status,
          unpaid: data.unpaid,
          location: data.location,
          propertyType: data.propertyType,
          observation: data.observation,
          rent: data.rent,
          caution: data.caution,
          cautionMonths: data.cautionMonths,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenant.id);

      if (error) throw error;
      
      toast({
        title: "Modification réussie",
        description: "Les informations du locataire ont été mises à jour.",
      });
      
      onEditSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification du locataire:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du locataire.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le locataire</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Composant formulaire réutilisable */}
            <TenantForm form={form} />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Modification..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantEditModal;
