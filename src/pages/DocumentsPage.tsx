import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Trash2, Search, Upload, Filter } from 'lucide-react';
const DocumentsPage: React.FC = () => {
  const documents = [{
    id: 1,
    name: "Contrat de bail - Appartement Paris.pdf",
    type: "Bail",
    size: "1.2 MB",
    date: "15/03/2025",
    tenant: "Martin Dupont"
  }, {
    id: 2,
    name: "État des lieux - Studio Lyon.pdf",
    type: "État des lieux",
    size: "3.5 MB",
    date: "02/02/2025",
    tenant: "Sophie Lambert"
  }, {
    id: 3,
    name: "Quittance Avril 2025 - Maison Marseille.pdf",
    type: "Quittance",
    size: "0.8 MB",
    date: "01/04/2025",
    tenant: "Thomas Petit"
  }, {
    id: 4,
    name: "Attestation d'assurance - T2 Bordeaux.pdf",
    type: "Assurance",
    size: "1.5 MB",
    date: "12/01/2025",
    tenant: "Julie Martin"
  }, {
    id: 5,
    name: "Facture travaux plomberie - Appartement Paris.pdf",
    type: "Facture",
    size: "2.1 MB",
    date: "05/04/2025",
    tenant: "-"
  }, {
    id: 6,
    name: "DPE - Studio Lyon.pdf",
    type: "Diagnostic",
    size: "4.2 MB",
    date: "20/11/2024",
    tenant: "-"
  }];
  return <div className="h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Documents</h1>
        
        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Rechercher un document..." className="pl-9" />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            
            <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90 text-white flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
        
        {/* Liste des documents */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
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
              {documents.map(doc => <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#E84A33]" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>{doc.tenant}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" title="Télécharger">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Supprimer">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
        
        {/* Statistiques des documents */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total des documents</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Documents récents (30j)</p>
            <p className="text-2xl font-bold">6</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Espace utilisé</p>
            <p className="text-2xl font-bold">45.7 MB</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Documents à renouveler</p>
            <p className="text-2xl font-bold text-[#E84A33]">3</p>
          </div>
        </div>
        
        {/* Types de documents */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-[#2A2F36]">Types de documents</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {['Baux', 'Quittances', 'États des lieux', 'Factures', 'Diagnostics', 'Assurances'].map(type => <div key={type} className="rounded-lg p-4 text-center cursor-pointer bg-[#5d6169]">
                <FileText className="h-8 w-8 mx-auto mb-2 text-[#E84A33]" />
                <p className="text-sm font-medium">{type}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default DocumentsPage;