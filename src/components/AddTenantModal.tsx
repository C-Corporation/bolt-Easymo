import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tenant } from '@/types/tenant';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
}

// Schéma de validation pour le formulaire
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  phone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  gender: z.enum(['Homme', 'Femme', 'Autre']),
  birthDate: z.string().min(1, { message: "La date de naissance est requise" }),
  idCardNumber: z.string().min(1, { message: "Le numéro de pièce d'identité est requis" }),
  location: z.string().min(3, { message: "La localisation doit être spécifiée" }),
  status: z.enum(['En règle', 'Pas en règle']),
  unpaid: z.number().nonnegative({ message: "Le montant impayé ne peut pas être négatif" }),
  observation: z.string().optional(),
  property: z.object({
    id: z.string().optional(),
    address: z.string().min(5, { message: "L'adresse doit être spécifiée" }),
    rent: z.number().positive({ message: "Le loyer doit être positif" })
  }),
  entryDate: z.string().min(1, { message: "La date d'entrée est requise" })
});

type FormValues = z.infer<typeof formSchema>;

const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Homme',
      birthDate: '',
      idCardNumber: '',
      location: '',
      status: 'En règle',
      unpaid: 0,
      observation: 'RAS',
      property: {
        id: '',
        address: '',
        rent: 0
      },
      entryDate: new Date().toISOString().split('T')[0]
    }
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const success = await onSubmit({
        ...data,
        // Add any additional required fields from Tenant type
        insurance: {
          company: '',
          policyNumber: '',
          expiryDate: ''
        },
        documents: []
      });
      
      if (success) {
        toast({
          title: "Locataire ajouté",
          description: "Le nouveau locataire a été ajouté avec succès.",
        });
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du locataire:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du locataire.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Homme">Homme</SelectItem>
                        <SelectItem value="Femme">Femme</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de pièce d'identité</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de pièce d'identité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse du bien</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property.rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loyer mensuel</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="entryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'entrée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En règle">En règle</SelectItem>
                        <SelectItem value="Pas en règle">Pas en règle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unpaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant impayé</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ville, quartier..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observations ou notes supplémentaires" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#8f95a1] hover:bg-[#e84a33] text-white"
              >
                {isLoading ? "Ajout en cours..." : "Ajouter le locataire"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantModal;
