import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Building2, FileText, TrendingUp, Users, House } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import TenantForm from '@/pages/tenants/components/TenantForm';
import { useTenants } from '@/hooks/useTenants';
import { Tenant } from '@/types/tenant';
import PropertyForm from '@/pages/properties/components/PropertyForm';
import { useProperties } from '@/hooks/useProperties';
import { PropertyInsert } from '@/types/property';
import TransactionForm from '@/pages/transactions/components/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionInsert } from '@/types/transaction';
import DocumentForm from '@/pages/documents/components/DocumentForm';
import { useDocuments, DocumentInsert } from '@/hooks/useDocuments';

export const EmptyDashboardState = () => {
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const navigate = useNavigate();
  const { addTenant } = useTenants();
  const { addProperty } = useProperties();
  const { addTransaction } = useTransactions();
  const { addDocument } = useDocuments();

  const handleTenantSubmit = async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    const success = await addTenant(tenantData);
    if (success) {
      setIsTenantModalOpen(false);
      navigate('/locataires');
    }
  };

  const handlePropertySubmit = async (propertyData: PropertyInsert) => {
    const success = await addProperty(propertyData);
    if (success) {
      setIsPropertyModalOpen(false);
      navigate('/biens');
    }
  };

  const handleTransactionSubmit = async (transactionData: TransactionInsert) => {
    const success = await addTransaction(transactionData);
    if (success) {
      setIsTransactionModalOpen(false);
      navigate('/transactions');
    }
  };

  const handleDocumentSubmit = async (file: File, metadata: DocumentInsert) => {
    const success = await addDocument(file, metadata);
    if (success) {
      setIsDocumentModalOpen(false);
      navigate('/documents');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg bg-white">
      <div className="mb-6">
        <img src="/images/Logo 1.png" alt="Easymo Logo" className="h-16 w-auto" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Le logiciel c'est Easymo.
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Commencez à gérer votre patrimoine immobilier en quelques clics. Ajoutez vos premières données pour débloquer la puissance de votre tableau de bord.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        <Dialog open={isTenantModalOpen} onOpenChange={setIsTenantModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col h-32 items-center justify-center p-4 space-y-2 hover:bg-primary-hover hover:text-white transition-colors">
              <Users className="h-8 w-8 text-white" />
              <span className="text-sm font-medium">Ajouter un locataire</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouveau locataire.
              </DialogDescription>
            </DialogHeader>
            <TenantForm onSubmit={handleTenantSubmit} onCancel={() => setIsTenantModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isPropertyModalOpen} onOpenChange={setIsPropertyModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col h-32 items-center justify-center p-4 space-y-2 hover:bg-primary-hover hover:text-white transition-colors">
              <Building2 className="h-8 w-8 text-white" />
              <span className="text-sm font-medium">Ajouter un bien</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau bien</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouveau bien immobilier.
              </DialogDescription>
            </DialogHeader>
            <PropertyForm onSubmit={handlePropertySubmit} onCancel={() => setIsPropertyModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col h-32 items-center justify-center p-4 space-y-2 hover:bg-primary-hover hover:text-white transition-colors">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-sm font-medium">Ajouter une transaction</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle transaction</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour enregistrer une transaction.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSubmit={handleTransactionSubmit} onCancel={() => setIsTransactionModalOpen(false)} />
          </DialogContent>
        </Dialog>
        <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col h-32 items-center justify-center p-4 space-y-2 hover:bg-primary-hover hover:text-white transition-colors">
              <FileText className="h-8 w-8 text-white" />
              <span className="text-sm font-medium">Ajouter un document</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
              <DialogDescription>
                Sélectionnez un fichier et remplissez les informations pour l'ajouter.
              </DialogDescription>
            </DialogHeader>
            <DocumentForm onSubmit={handleDocumentSubmit} onCancel={() => setIsDocumentModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
