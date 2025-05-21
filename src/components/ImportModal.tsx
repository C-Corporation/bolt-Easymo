import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Import, FileSpreadsheet, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types/tenant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Array<Record<string, any>>>([]);
  const [error, setError] = useState<string | null>(null);

  // Réinitialiser le state quand la modale s'ouvre ou se ferme
  React.useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview([]);
      setError(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier le type de fichier
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError("Veuillez sélectionner un fichier Excel (.xlsx, .xls)");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    
    // Prévisualiser le fichier
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Limiter la prévisualisation à 5 éléments
        setPreview(jsonData.slice(0, 5));

        // Valider la structure des données
        if (jsonData.length === 0) {
          setError("Le fichier ne contient aucune donnée.");
          return;
        }

        // Vérifier les colonnes minimales requises
        const requiredColumns = ['name', 'status', 'location'];
        const firstRow = jsonData[0] as Record<string, any>;
        
        const missingColumns = requiredColumns.filter(col => 
          !Object.keys(firstRow).includes(col)
        );
        
        if (missingColumns.length > 0) {
          setError(`Colonnes manquantes : ${missingColumns.join(', ')}`);
        }
      } catch (err) {
        console.error('Erreur lors de la lecture du fichier:', err);
        setError("Impossible de lire le fichier Excel. Format non valide.");
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const binaryStr = evt.target?.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            setError("Le fichier ne contient aucune donnée.");
            setIsLoading(false);
            return;
          }

          // Préparer les données pour l'insertion
          const tenantsToInsert = jsonData.map((row: any) => ({
            name: row.name || '',
            firstName: row.firstName || '',
            secondName: row.secondName || '',
            gender: ['Homme', 'Femme', 'Autre'].includes(row.gender) ? row.gender : 'Homme',
            birthDate: row.birthDate || null,
            phoneNumber: row.phoneNumber || '',
            status: ['En règle', 'Pas en règle'].includes(row.status) ? row.status : 'En règle',
            unpaid: parseFloat(row.unpaid || 0),
            observation: row.observation || 'RAS',
            location: row.location || '',
            propertyType: row.propertyType || '',
            rent: parseFloat(row.rent || 0),
            caution: parseFloat(row.caution || 0),
            cautionMonths: parseInt(row.cautionMonths || 1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          // Insertion dans la base de données
          const { data, error } = await supabase
            .from('tenants')
            .insert(tenantsToInsert);

          if (error) throw error;
          
          toast({
            title: "Import réussi",
            description: `${tenantsToInsert.length} locataires ont été importés avec succès.`,
          });
          
          onImportSuccess();
          onClose();
        } catch (err) {
          console.error('Erreur lors du traitement du fichier:', err);
          setError("Une erreur est survenue lors de l'importation des données.");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error('Erreur lors de la lecture du fichier:', err);
      setError("Impossible de lire le fichier Excel.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des locataires</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="sr-only"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer text-center">
                {file ? (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="mt-3 text-sm font-medium text-gray-900">
                      Cliquez pour sélectionner un fichier Excel
                    </div>
                    <p className="mt-1 text-xs text-gray-500">XLSX, XLS jusqu'à 10MB</p>
                  </div>
                )}
              </label>
            </div>

            {preview.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Aperçu des données (5 premières lignes)</h4>
                <div className="mt-2 border rounded-md max-h-40 overflow-y-auto p-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview[0]).slice(0, 5).map((header, idx) => (
                          <th 
                            key={idx}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {Object.keys(row).slice(0, 5).map((key, cellIdx) => (
                            <td 
                              key={cellIdx} 
                              className="px-3 py-2 whitespace-nowrap text-xs"
                            >
                              {String(row[key]).substring(0, 20)}
                              {String(row[key]).length > 20 ? '...' : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Colonnes requises: nom, statut, localisation. Les données incorrectes seront ignorées.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!file || isLoading || !!error}
          >
            {isLoading ? "Importation..." : "Importer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
