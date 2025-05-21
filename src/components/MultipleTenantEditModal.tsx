
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { useTenants } from '@/hooks/useTenants';
import { Tenant } from '@/types/tenant';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import TenantForm from './TenantForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schéma de validation du locataire (simplifié pour la modification multiple)
const tenantFormSchema = z.object({
  status: z.enum(['En règle', 'Pas en règle']),
  unpaid: z.number().nonnegative({ message: "Le montant impayé ne peut pas être négatif" }),
  location: z.string().min(3, { message: 'La localisation doit être spécifiée.' }),
  propertyType: z.string().optional(),
  observation: z.string().optional(),
  rent: z.number().positive({ message: "Le loyer doit être positif" }).optional(),
  caution: z.number().optional(),
  cautionMonths: z.number().positive({ message: "Le nombre de mois doit être positif" }).optional(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface MultipleTenantEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantIds: string[];
  onEditSuccess: () => void;
}

const MultipleTenantEditModal: React.FC<MultipleTenantEditModalProps> = ({ 
  isOpen, 
  onClose, 
  tenantIds, 
  onEditSuccess 
}) => {
  const { tenants, updateTenant } = useTenants();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<Tenant[]>([]);
  const [completedTenants, setCompletedTenants] = useState<string[]>([]);

  // État pour tracking la navigation
  const isFirstTenant = currentIndex === 0;
  const isLastTenant = currentIndex === selectedTenants.length - 1;

  // Construire le current tenant
  const currentTenant = selectedTenants[currentIndex];

  // Formulaire current
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      status: 'En règle',
      unpaid: 0,
      location: '',
      propertyType: '',
      observation: 'RAS',
      rent: 0,
      caution: 0,
      cautionMonths: 1,
    },
  });

  // Récupérer les locataires sélectionnés
  useEffect(() => {
    if (isOpen && tenantIds.length > 0) {
      const tenantsToEdit = tenants.filter(tenant => tenantIds.includes(tenant.id));
      setSelectedTenants(tenantsToEdit);
      setCurrentIndex(0);
      setCompletedTenants([]);
    }
  }, [isOpen, tenantIds, tenants]);

  // Mettre à jour le formulaire avec les données du locataire courant
  useEffect(() => {
    if (currentTenant) {
      form.reset({
        status: currentTenant.status || 'En règle',
        unpaid: currentTenant.unpaid || 0,
        location: currentTenant.location || '',
        propertyType: currentTenant.propertyType || '',
        observation: currentTenant.observation || 'RAS',
        rent: currentTenant.rent || 0,
        caution: currentTenant.caution || 0,
        cautionMonths: currentTenant.cautionMonths || 1,
      });
    }
  }, [currentTenant, form]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (data: TenantFormValues) => {
    if (!currentTenant) return;
    
    setIsLoading(true);
    try {
      const success = await updateTenant(currentTenant.id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      if (success) {
        setCompletedTenants(prev => [...prev, currentTenant.id]);
        
        // Si c'est le dernier locataire, terminer le processus
        if (isLastTenant) {
          toast({
            title: "Modifications terminées",
            description: `${selectedTenants.length} locataires ont été mis à jour avec succès.`,
          });
          onEditSuccess();
          onClose();
        } else {
          // Passer au suivant
          setCurrentIndex(currentIndex + 1);
          toast({
            title: "Locataire mis à jour",
            description: `${currentTenant.name} a été mis à jour avec succès.`,
          });
        }
      }
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

  // Navigation entre les locataires
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < selectedTenants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Si pas de locataires sélectionnés ou modal fermé, ne rien afficher
  if (!isOpen || selectedTenants.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white text-gray-800">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-gray-900">
            <span>Modifier les locataires sélectionnés</span>
            <span className="text-sm font-normal text-gray-500">
              {currentIndex + 1} / {selectedTenants.length}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 mb-4 flex items-center justify-center">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-[#8f95a1] h-1.5 rounded-full transition-all" 
              style={{ width: `${((currentIndex + 1) / selectedTenants.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {currentTenant && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full">
              {/* Information sur le locataire actuel */}
              <div className="bg-blue-50 p-3 rounded-md mb-4 text-center">
                <p className="font-medium text-blue-800">
                  Modification de: <span className="font-bold">{currentTenant.name}</span>
                </p>
              </div>
              
              {/* Version simplifiée du formulaire avec champs focalisés sur les mises à jour de status */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="col-span-2">
                  <TenantForm form={form} simplified={true} />
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center space-x-2 pt-4">
                {/* Navigation */}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevious}
                    disabled={isFirstTenant || isLoading}
                    size="sm"
                    className="text-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    size="sm"
                    className="text-gray-800"
                  >
                    Annuler
                  </Button>
                </div>
                
                <div>
                  {isLastTenant ? (
                    <Button 
                      type="submit" 
                      disabled={isLoading} 
                      className="bg-[#8f95a1] hover:bg-[#e84a33] text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isLoading ? "Enregistrement..." : "Terminer"}
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-[#8f95a1] hover:bg-[#e84a33] text-white"
                    >
                      {isLoading ? "Enregistrement..." : "Suivant"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MultipleTenantEditModal;
