import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import { Tenant } from '@/types/tenant';
import { toast } from 'sonner';

interface ImportTenantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportTenantsDialog: React.FC<ImportTenantsDialogProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { addTenant } = useTenants();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier.');
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        if (json.length === 0) {
          toast.error('Le fichier est vide ou mal formaté.');
          return;
        }

        let importedCount = 0;
        for (const row of json) {
          const tenantData: Omit<Tenant, 'id' | 'created_at'> = {
            first_name: row.prénom || '',
            last_name: row.nom || '',
            email: row.email || '',
            phone_number: row.téléphone ? String(row.téléphone) : '',
            // Le champ 'adresse' du fichier n'est pas utilisé car il n'existe pas dans la table 'tenants'.
            // Pour l'instant, nous insérons uniquement les données correspondantes au schéma.
            property_id: null, // La propriété n'est pas liée lors de l'import.
            entry_date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
            exit_date: null
          };

          if (tenantData.first_name && tenantData.last_name && tenantData.email) {
            await addTenant(tenantData);
            importedCount++;
          }
        }
        toast.success(`${importedCount} locataire(s) importé(s) avec succès.`);
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'importation :", error);
        toast.error("Une erreur est survenue lors de la lecture du fichier. Assurez-vous qu'il est au bon format et que les noms de colonnes sont corrects.");
      } finally {
        setIsImporting(false);
        setFile(null);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer des locataires</DialogTitle>
          <DialogDescription>
            Téléversez un fichier (.xlsx, .csv). Colonnes requises : prénom, nom, email, téléphone, adresse.
          </DialogDescription>
        </DialogHeader>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}`}>
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            disabled={isImporting}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-muted-foreground">
            Glissez-déposez votre fichier ici, ou <span className="font-semibold text-primary">cliquez pour sélectionner</span>.
          </p>
          {file && <p className="mt-4 text-sm font-medium">Fichier : {file.name}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isImporting}>Annuler</Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? 'Importation...' : 'Importer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
