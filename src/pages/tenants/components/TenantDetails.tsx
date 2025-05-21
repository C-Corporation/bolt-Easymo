import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, ArrowLeft, Mail, Phone, Home, Calendar, FileText, User, CreditCard } from 'lucide-react';
import { Tenant } from '@/types/tenant';

type TenantWithRequiredId = Tenant & { id: string };

type TenantDetailsProps = {
  tenant: TenantWithRequiredId;
  onClose: () => void;
  onEdit: () => void;
};

export default function TenantDetails({ tenant, onClose, onEdit }: TenantDetailsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        <Button onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{`${tenant.firstName} ${tenant.lastName}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Genre</p>
              <p className="font-medium">{tenant.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">{formatDate(tenant.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">N° de pièce d'identité</p>
              <p className="font-medium">{tenant.idCardNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${tenant.email}`} className="hover:underline">
                {tenant.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${tenant.phone}`} className="hover:underline">
                {tenant.phone}
              </a>
            </div>
            
            {tenant.emergencyContact && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">Contact d'urgence</p>
                <div className="bg-muted/50 p-4 rounded-md space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p>{tenant.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <a href={`tel:${tenant.emergencyContact.phone}`} className="hover:underline">
                      {tenant.emergencyContact.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lien</p>
                    <p>{tenant.emergencyContact.relation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bail et logement */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              Bail et logement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium">{tenant.property.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyer mensuel</p>
              <p className="font-medium">{tenant.property.rent} €</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'entrée</p>
              <p className="font-medium">{formatDate(tenant.entryDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durée de location</p>
              <p className="font-medium">
                Depuis {formatDate(tenant.entryDate)} ({
                  Math.floor((new Date().getTime() - new Date(tenant.entryDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
                } mois)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <CreditCard className="h-6 w-6" />
              <span>Pièce d'identité</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Contrat de location</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              <span>État des lieux d'entrée</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Aucun paiement enregistré pour le moment
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {tenant.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line">{tenant.notes}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
