
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Tenant } from '@/types/tenant';
import { fr } from 'date-fns/locale';

interface TenantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

const TenantDetailModal: React.FC<TenantDetailModalProps> = ({ isOpen, onClose, tenant }) => {
  if (!tenant) return null;

  const formatNumber = (num: number | undefined) => {
    return num !== undefined ? new Intl.NumberFormat('fr-FR').format(num) : '-';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du locataire</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* En-tête avec photo et nom */}
          <div className="flex items-center gap-4">
            {tenant.photo ? (
              <div className="h-24 w-24 rounded-full overflow-hidden border flex-shrink-0">
                <img src={tenant.photo} alt={tenant.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-500">
                  {tenant.name.charAt(0)}{tenant.firstName ? tenant.firstName.charAt(0) : ''}
                </span>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold">
                {tenant.name} {tenant.firstName} {tenant.secondName}
              </h3>
              <div className={`text-sm mt-1 font-medium ${tenant.status === 'Pas en règle' ? 'text-red-500' : 'text-green-500'}`}>
                {tenant.status}
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Genre</p>
              <p className="font-medium">{tenant.gender || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">{formatDate(tenant.birthDate)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{tenant.phoneNumber || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type de pièce</p>
              <p className="font-medium">{tenant.idCardType || '-'}</p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200"></div>

          {/* Informations sur la location */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Détails de location</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Localisation</p>
                <p className="font-medium">{tenant.location}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type de bien</p>
                <p className="font-medium">{tenant.propertyType || '-'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                <p className="font-medium">{formatNumber(tenant.rent)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Caution</p>
                <p className="font-medium">{formatNumber(tenant.caution)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date d'arrivée</p>
                <p className="font-medium">{formatDate(tenant.arrival_date)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Montant impayé</p>
                <p className="font-medium text-red-500">{formatNumber(tenant.unpaid)}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Documents</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Carte d'identité</p>
                <p className="font-medium">{tenant.idCardFile ? 'Disponible' : 'Non fournie'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contrat</p>
                <p className="font-medium">{tenant.contractFile ? 'Disponible' : 'Non fourni'}</p>
              </div>
            </div>
          </div>

          {/* Observation */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">Observation</h4>
            <p className="bg-gray-50 p-3 rounded">{tenant.observation || 'Aucune observation'}</p>
          </div>
          
          {/* Dates système */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Créé le: {formatDate(tenant.created_at)}</span>
            <span>Dernière mise à jour: {formatDate(tenant.updated_at)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDetailModal;
