
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Tenant } from '@/types/tenant';
import { Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

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
            {/* Section identité */}
            <div className="bg-slate-50 p-3 rounded-lg">
              <h3 className="font-medium mb-3 text-slate-800 flex items-center">
                Identité
                <span className="text-xs ml-2 text-slate-500">(* champs obligatoires)</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Nom *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nom de famille du locataire</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Prénom *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Prénom principal du locataire</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondName"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Second prénom
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Autre prénom (optionnel)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Second prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Genre *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un genre" />
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
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Date de naissance *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Date de naissance du locataire</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Téléphone *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Numéro de téléphone principal du locataire</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Situation financière *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>État des paiements du locataire</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une situation" />
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
              </div>
            </div>

            {/* Section location */}
            <div className="bg-slate-50 p-3 rounded-lg">
              <h3 className="font-medium mb-3 text-slate-800">Informations de location</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="flex items-center">
                        Localisation *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Adresse/Localisation du bien loué</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse du bien" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Type de bien *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Type de bien loué (boutique, chambre, etc.)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Chambre, boutique, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Loyer mensuel *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Montant du loyer mensuel</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unpaid"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="flex items-center">
                        Impayés
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Montant total des impayés</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="cautionMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Mois de caution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Nombre de mois de loyer pour la caution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange(value);
                              // Mettre à jour le montant de la caution
                              const rent = form.getValues("rent");
                              form.setValue("caution", rent * value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Total caution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Montant total de la caution</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Observation */}
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Observation
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notes sur le locataire</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informations supplémentaires..."
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
