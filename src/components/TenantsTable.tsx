import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Plus, Pencil, Calendar, Info, Eye, Printer } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import AddTenantModal from './AddTenantModal';
import ExportModal from './ExportModal';
import { Tenant } from '@/types/tenant';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SortConfig {
  key: keyof Tenant | null;
  direction: 'ascending' | 'descending';
}

// Interface pour les colonnes
interface Column {
  key: keyof Tenant | 'caution' | 'arrival_date' | 'updated_at'; // Extended keys
  label: string;
  visible: boolean;
  sortable: boolean;
}

const TenantsTable: React.FC = () => {
  const { tenants, loading } = useTenants();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });
  const [sortedTenants, setSortedTenants] = useState<Tenant[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'En règle' | 'Pas en règle'>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  
  // Configuration des colonnes avec visibilité
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Nom & Prénom', visible: true, sortable: true },
    { key: 'status', label: 'Situation', visible: true, sortable: true },
    { key: 'unpaid', label: 'Impayés', visible: true, sortable: true },
    { key: 'observation', label: 'Observation', visible: true, sortable: true },
    { key: 'location', label: 'Localisation', visible: true, sortable: true },
    { key: 'caution', label: 'Caution', visible: false, sortable: true },
    { key: 'arrival_date', label: "Date d'arrivée", visible: false, sortable: true },
    { key: 'updated_at', label: 'Dernière modification', visible: false, sortable: true },
  ]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (!tenants.length) return { total: 0, inOrder: 0, notInOrder: 0, totalUnpaid: 0 };
    
    const inOrder = tenants.filter(tenant => tenant.status === 'En règle').length;
    const notInOrder = tenants.filter(tenant => tenant.status === 'Pas en règle').length;
    const totalUnpaid = tenants.reduce((acc, tenant) => acc + tenant.unpaid, 0);
    
    return {
      total: tenants.length,
      inOrder,
      notInOrder,
      totalUnpaid
    };
  }, [tenants]);

  // Trier les données
  const sortData = (key: keyof Tenant) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    const sortedData = [...tenants].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setSortedTenants(sortedData);
    setSortConfig({ key, direction });
  };
  
  // Obtenir l'icône de tri
  const getSortIcon = (columnName: keyof Tenant) => {
    if (sortConfig.key !== columnName) {
      return <div className="w-4 h-4" />;
    }
    
    return sortConfig.direction === 'ascending' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Gérer la sélection des locataires
  const toggleTenantSelection = (tenantId: string) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantId)) {
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  // Commencer la modification des locataires sélectionnés
  const startEditing = () => {
    if (selectedTenants.length > 0) {
      setCurrentEditIndex(0);
      setIsEditModalOpen(true);
    }
  };

  // Passer au prochain locataire pour modification
  const handleNextTenant = () => {
    if (currentEditIndex < selectedTenants.length - 1) {
      setCurrentEditIndex(prev => prev + 1);
    } else {
      // Terminer le processus de modification
      setIsEditModalOpen(false);
      setSelectedTenants([]);
    }
  };

  // Toggle le filtre de statut
  const toggleStatusFilter = (status: 'En règle' | 'Pas en règle') => {
    if (selectedStatus === status) {
      setSelectedStatus('all');
    } else {
      setSelectedStatus(status);
    }
  };
  
  // Toggle la visibilité des colonnes
  const toggleColumnVisibility = (columnKey: Column['key']) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Navigation par mois
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setDate(subMonths(date, 1));
    } else {
      setDate(addMonths(date, 1));
    }
  };

  // Filtrer les locataires par statut
  const filteredTenants = useMemo(() => {
    if (selectedStatus === 'all') {
      return sortConfig.key ? sortedTenants : tenants;
    }
    const tenantsToFilter = sortConfig.key ? sortedTenants : tenants;
    return tenantsToFilter.filter(tenant => tenant.status === selectedStatus);
  }, [tenants, sortedTenants, sortConfig.key, selectedStatus]);

  // Formater le nombre avec les séparateurs de milliers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Formater la date pour l'afficher par mois
  const formatMonthDate = (date: Date) => {
    return format(date, 'MMMM yyyy');
  };

  // Pour les colonnes additionnelles
  const getCellValue = (tenant: Tenant, key: Column['key']) => {
    switch (key) {
      case 'caution':
        return formatNumber(5000); // Valeur fictive pour la caution
      case 'arrival_date':
        return '01/06/2023'; // Date d'arrivée fictive
      case 'updated_at':
        return tenant.updated_at ? format(new Date(tenant.updated_at), 'dd/MM/yyyy HH:mm') : '-';
      default:
        if (key === 'unpaid') {
          return formatNumber(tenant[key] as number);
        }
        return tenant[key as keyof Tenant] || '-';
    }
  };

  // Gérer l'export
  const handleExport = (format: 'pdf' | 'excel') => {
    const visibleColumnKeys = columns.filter(col => col.visible).map(col => col.key);
    const visibleColumnLabels = columns.filter(col => col.visible).map(col => col.label);
    
    if (format === 'pdf') {
      const doc = new jsPDF();
      const tableData = filteredTenants.map(tenant => 
        visibleColumnKeys.map(key => getCellValue(tenant, key))
      );
      
      doc.text('Liste des locataires', 14, 16);
      (doc as any).autoTable({
        head: [visibleColumnLabels],
        body: tableData,
        startY: 20,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [143, 149, 161],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
      });
      
      doc.save('locataires.pdf');
      toast({
        title: 'Export PDF réussi',
        description: 'Le document a été généré avec succès',
      });
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.aoa_to_sheet([
        visibleColumnLabels,
        ...filteredTenants.map(tenant => 
          visibleColumnKeys.map(key => getCellValue(tenant, key))
        )
      ]);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Locataires');
      XLSX.writeFile(workbook, 'locataires.xlsx');
      
      toast({
        title: 'Export Excel réussi',
        description: 'Le document a été généré avec succès',
      });
    }
    
    setIsExportModalOpen(false);
  };

  // Les colonnes visibles
  const visibleColumns = useMemo(() => {
    return columns.filter(column => column.visible);
  }, [columns]);

  return (
    <div className="h-full flex flex-col">
      {/* En-tête de la page */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Locataires</h1>
            <p className="text-white">La liste de tout les locataires de : M. ZEKE Philippe</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="text-white">Dernière mise à jour : il y a 3 jours</span>
          </div>
        </div>
      </div>

      {/* Conteneur du tableau avec fond blanc */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden p-1.5">
        {/* En-têtes du tableau avec coins arrondis en haut et en bas */}
        <div className="sticky top-0 z-10">
          <div className="bg-[#62666c] rounded-full overflow-hidden">
            <div className="p-4">
              <div className={`grid gap-4`} 
                style={{ 
                  gridTemplateColumns: `50px ${visibleColumns.map(() => '1fr').join(' ')} 50px` 
                }}
              >
                <div className="flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider">
                  &nbsp;
                </div>
                
                {visibleColumns.map((column) => (
                  <div 
                    key={column.key}
                    className={`cursor-pointer flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                    onClick={() => column.sortable && sortData(column.key as keyof Tenant)}
                  >
                    {column.label} {column.sortable && getSortIcon(column.key as keyof Tenant)}
                  </div>
                ))}

                <div className="flex items-center justify-center font-medium text-white text-sm uppercase tracking-wider">
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corps du tableau avec défilement */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-370px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Chargement des locataires...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>Aucun locataire à afficher</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTenants.map((tenant, index) => (
                <div 
                  key={tenant.id} 
                  className={`grid items-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#f7f8f7]'
                  } hover:bg-gray-100 rounded-full p-4`}
                  style={{ 
                    gridTemplateColumns: `50px ${visibleColumns.map(() => '1fr').join(' ')} 50px` 
                  }}
                  onMouseEnter={() => setHoveredRow(tenant.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="flex justify-center">
                    {hoveredRow === tenant.id || selectedTenants.includes(tenant.id) ? (
                      <Checkbox
                        checked={selectedTenants.includes(tenant.id)}
                        onCheckedChange={() => toggleTenantSelection(tenant.id)}
                        className="data-[state=checked]:bg-[#8f95a1] data-[state=checked]:text-primary-foreground"
                      />
                    ) : null}
                  </div>
                  
                  {visibleColumns.map((column) => (
                    <div 
                      key={`${tenant.id}-${column.key}`} 
                      className={`text-center truncate ${
                        column.key === 'status' && tenant[column.key] === 'Pas en règle' ? 'text-red-500' : 'text-[#62666c]'
                      }`}
                    >
                      {getCellValue(tenant, column.key)}
                    </div>
                  ))}
                  
                  <div className="flex justify-center">
                    {hoveredRow === tenant.id && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Info className="h-4 w-4 text-[#62666c]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white p-4 border shadow-lg rounded-md">
                            <div className="space-y-2 w-64">
                              <h3 className="font-bold">Détails du locataire</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium">Nom:</span>
                                <span className="text-sm">{tenant.name}</span>
                                
                                <span className="text-sm font-medium">Statut:</span>
                                <span className="text-sm">{tenant.status}</span>
                                
                                <span className="text-sm font-medium">Impayés:</span>
                                <span className="text-sm">{formatNumber(tenant.unpaid)}</span>
                                
                                <span className="text-sm font-medium">Location:</span>
                                <span className="text-sm">{tenant.location}</span>
                                
                                <span className="text-sm font-medium">Observation:</span>
                                <span className="text-sm">{tenant.observation || 'Aucune'}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sous-totaux */}
        <div className="p-4 bg-white rounded-lg">
          <div className="flex flex-wrap gap-3 justify-center">
            <Card className="shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-[#62666c] font-medium">Nbre de locataires:</span>
                <span className="font-bold text-[#62666c]">{stats.total}</span>
              </CardContent>
            </Card>
            
            <Card 
              className={`shadow-sm cursor-pointer ${selectedStatus === 'En règle' ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStatusFilter('En règle')}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-green-500 font-medium">En règle:</span>
                <span className="font-bold text-green-500">{stats.inOrder}</span>
              </CardContent>
            </Card>
            
            <Card 
              className={`shadow-sm cursor-pointer ${selectedStatus === 'Pas en règle' ? 'bg-gray-100' : ''}`}
              onClick={() => toggleStatusFilter('Pas en règle')}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-red-500 font-medium">Pas en règle:</span>
                <span className="font-bold text-red-500">{stats.notInOrder}</span>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-[#62666c] font-medium">Impayés:</span>
                <span className="font-bold text-[#62666c]">{formatNumber(stats.totalUnpaid)}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 border-t flex items-center justify-between space-x-4 bg-white rounded-b-lg">
          {/* Boutons à gauche */}
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              disabled={selectedTenants.length === 0}
              className={`shadow-sm ${
                selectedTenants.length > 0 
                  ? 'bg-[#8f95a1] text-white hover:bg-[#d9592b]' 
                  : 'bg-gray-300 text-gray-500'
              }`}
              onClick={startEditing}
            >
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
            
            <Button 
              variant="default" 
              className="shadow-sm bg-[#8f95a1] text-white hover:bg-[#d9592b]"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter un locataire
            </Button>
          </div>
          
          {/* Boutons à droite */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              className="shadow-sm"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimer
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  Colonnes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white w-56">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  className="shadow-sm flex items-center"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatMonthDate(date)}
                  <div className="ml-2 flex gap-1">
                    <ChevronDown className="h-4 w-4 cursor-pointer" onClick={() => navigateMonth('prev')} />
                    <ChevronUp className="h-4 w-4 cursor-pointer" onClick={() => navigateMonth('next')} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(day) => day && setDate(startOfMonth(day))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de locataire */}
      <AddTenantModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTenant}
      />
      
      {/* Modal d'exportation */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      {/* Toaster pour les notifications */}
      <Toaster />
    </div>
  );

  // Gestion du soumet pour ajouter un locataire
  function handleAddTenant(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) {
    const { addTenant } = useTenants();
    return addTenant(data);
  }
};

export default TenantsTable;
