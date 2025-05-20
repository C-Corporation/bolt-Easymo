
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tenant } from '@/types/tenant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const tenantSchema = z.object({
  photo: z.any().optional(),
  name: z.string().min(2, { message: 'Le nom est requis' }),
  firstName: z.string().min(2, { message: 'Le prénom est requis' }),
  secondName: z.string().optional(),
  gender: z.enum(['Homme', 'Femme', 'Autre'], { required_error: "Le genre est requis" }),
  birthDate: z.date({ required_error: "La date de naissance est requise" }),
  phoneNumber: z.string().min(8, { message: 'Le numéro de téléphone est requis' }),
  status: z.enum(['En règle', 'Pas en règle']),
  unpaid: z.coerce.number().min(0, { message: 'Le montant ne peut pas être négatif' }),
  observation: z.string().optional().default('RAS'),
  location: z.string().min(2, { message: 'La localisation est requise' }),
  propertyType: z.string().min(2, { message: 'Le type de bien est requis' }),
  rent: z.coerce.number().min(1, { message: 'Le loyer est requis' }),
  cautionMonths: z.coerce.number().min(1, { message: 'Le nombre de mois est requis' }),
  idCardType: z.enum(['Biométrique', 'CIP']).optional(),
  idCardFile: z.any().optional(),
  contractFile: z.any().optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
}

const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      firstName: '',
      secondName: '',
      gender: 'Homme',
      phoneNumber: '',
      status: 'En règle',
      unpaid: 0,
      observation: 'RAS',
      location: '',
      propertyType: '',
      rent: 0,
      cautionMonths: 2,
      idCardType: 'Biométrique',
    },
  });
  
  const cautionMonths = form.watch('cautionMonths');
  const rent = form.watch('rent');
  const calculatedCaution = cautionMonths * rent;
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: any, previewSetter?: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.size > MAX_FILE_SIZE) {
        form.setError(field.name as any, {
          type: "manual",
          message: "La taille du fichier doit être inférieure à 5MB"
        });
        return;
      }
      
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError(field.name as any, {
          type: "manual",
          message: "Format de fichier non accepté"
        });
        return;
      }
      
      field.onChange(file);
      
      // Create preview if it's a photo and previewSetter is provided
      if (previewSetter && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewSetter(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (data: TenantFormValues) => {
    // Ensure the data is complete with all required fields
    const tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'> = {
      name: data.name,
      firstName: data.firstName,
      secondName: data.secondName,
      gender: data.gender,
      birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
      phoneNumber: data.phoneNumber,
      status: data.status,
      unpaid: data.unpaid,
      observation: data.observation || 'RAS',
      location: data.location,
      propertyType: data.propertyType,
      rent: data.rent,
      caution: calculatedCaution,
      cautionMonths: data.cautionMonths,
      idCardType: data.idCardType,
      // For file fields, we'd typically upload these to storage and store the URL
      // For now, we'll just indicate if they exist
      idCardFile: data.idCardFile ? 'uploaded' : undefined,
      contractFile: data.contractFile ? 'uploaded' : undefined,
      photo: photoPreview || undefined
    };
    
    const success = await onSubmit(tenantData);
    if (success) {
      setPhotoPreview(null);
      form.reset();
      onClose();
    }
  };

  const renderTooltip = (label: string, description: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-1 inline-flex items-center">
            <Info className="h-4 w-4 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white p-2 shadow-md rounded-md border">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un locataire</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Photo du locataire */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {photoPreview && (
                        <div className="w-24 h-24 rounded-full overflow-hidden border flex-shrink-0">
                          <img src={photoPreview} alt="Prévisualisation" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <Input 
                        type="file" 
                        onChange={(e) => handleFileChange(e, field, setPhotoPreview)}
                        accept="image/jpeg,image/png,image/jpg"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Nom et prénom */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du locataire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom du locataire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="secondName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Second prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Genre et date de naissance */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le genre" />
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Numéro de téléphone et status */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la situation" />
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

            {/* Montant impayé et observation */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="unpaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant impayé</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input placeholder="Observation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Localisation et type de bien */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Localisation* 
                      {renderTooltip("Localisation", "Localisation du bien immobilier loué")}
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
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Bien en location* 
                      {renderTooltip("Bien", "Type de bien loué (boutique, chambre, salon, etc.)")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Appartement, Boutique..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Loyer et caution */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Loyer* 
                      {renderTooltip("Loyer", "Montant mensuel à verser")}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Montant du loyer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cautionMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Mois de caution* 
                      {renderTooltip("Caution", "Nombre de mois de loyer pour la caution")}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col">
                <FormLabel>Caution totale</FormLabel>
                <div className="h-10 px-3 py-2 rounded-md border flex items-center text-sm">
                  {calculatedCaution.toLocaleString('fr-FR')}
                </div>
                <FormDescription className="text-xs text-muted-foreground">
                  Calculé automatiquement
                </FormDescription>
              </div>
            </div>
            
            {/* Carte d'identité */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="idCardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Type de carte d'identité
                      {renderTooltip("Carte d'identité", "Type de pièce d'identité fournie")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Biométrique">Biométrique</SelectItem>
                        <SelectItem value="CIP">CIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="idCardFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo carte d'identité (PDF, PNG, JPG)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        onChange={(e) => handleFileChange(e, field)}
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contrat */}
            <FormField
              control={form.control}
              name="contractFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Contrat 
                    {renderTooltip("Contrat", "Version scannée du contrat signé par le locataire")}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, field)}
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-[#8f95a1] hover:bg-[#d9592b]">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantModal;
