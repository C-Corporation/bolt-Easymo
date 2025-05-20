
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileDown, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter les données</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choisissez le format d'exportation souhaité
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => onExport('pdf')}
              className="flex-1 gap-2 bg-[#8f95a1] hover:bg-[#d9592b] text-white"
            >
              <FileDown />
              PDF
            </Button>
            <Button
              onClick={() => onExport('excel')}
              className="flex-1 gap-2 bg-[#8f95a1] hover:bg-[#d9592b] text-white"
            >
              <FileSpreadsheet />
              Excel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
