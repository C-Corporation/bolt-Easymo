import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Trash2, Search, Upload, Filter, FilePenLine } from 'lucide-react';
import { useDocuments, DocumentWithTenant } from '@/hooks/useDocuments';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddDocumentDialog } from '@/components/documents/AddDocumentDialog';
import { EditDocumentDialog } from '@/components/documents/EditDocumentDialog';
import { EmptyDocumentsState } from '@/components/documents/EmptyDocumentsState';

const DocumentsPage: React.FC = () => {
  const { documents: documentsDb, loading, addDocument, updateDocument, deleteDocument } = useDocuments();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentWithTenant | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithTenant | null>(null);

  // Handlers for dialogs
  const openEditDialog = (doc: DocumentWithTenant) => {
    setSelectedDocument(doc);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (doc: DocumentWithTenant) => {
    setDocumentToDelete(doc);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
    }
    setIsDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Derived state for stats
  const recentDocumentsCount = documentsDb.filter(doc => {
    if (!doc.upload_date) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(doc.upload_date) > thirtyDaysAgo;
  }).length;

  const hasDocuments = documentsDb.length > 0;

  return (
    <>
      <div className="h-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Documents</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-700" />
              <Input type="text" placeholder="Rechercher un document..." className="pl-9 bg-white" />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
              
              <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90 text-white flex items-center gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <Upload className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des documents...</p>
            </div>
          ) : hasDocuments ? (
            <div className="bg-white rounded-lg overflow-hidden">
              <Table className="text-gray-700">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Locataire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsDb.map((doc: DocumentWithTenant) => {
                    const tenantName = doc.tenants ? `${doc.tenants.first_name} ${doc.tenants.last_name}` : 'N/A';
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#E84A33]" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell>{doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{tenantName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" title="Modifier" onClick={() => openEditDialog(doc)}>
                              <FilePenLine className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Télécharger" onClick={() => window.open(doc.file_url, '_blank')}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Supprimer" onClick={() => openDeleteDialog(doc)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyDocumentsState />
          )}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Total des documents</p>
              <p className="text-2xl font-bold">{documentsDb.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Documents récents (30j)</p>
              <p className="text-2xl font-bold">{recentDocumentsCount}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Espace utilisé</p>
              <p className="text-2xl font-bold">N/A</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Documents à renouveler</p>
              <p className="text-2xl font-bold text-[#E84A33]">N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddDocumentDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSave={addDocument} 
      />

      {selectedDocument && (
        <EditDocumentDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          document={selectedDocument}
          onSave={updateDocument}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le fichier sera définitivement supprimé de votre espace de stockage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentsPage;