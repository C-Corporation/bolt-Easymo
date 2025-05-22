
export interface Tenant {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Homme' | 'Femme' | 'Autre';
  birthDate: string;
  idCardNumber: string;
  idCardFront?: string;
  idCardBack?: string;
  entryDate: string;
  property: {
    id: string;
    address: string;
    rent: number;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance?: {
    company: string;
    policyNumber: string;
    expiryDate: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  notes?: string;
  status: 'En règle' | 'Pas en règle';
  unpaid: number;
  observation: string;
  location: string;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields needed by components
  name?: string;
  photo?: string;
  phoneNumber?: string;
  secondName?: string;
  idCardType?: string;
  propertyType?: string;
  caution?: number;
  cautionMonths?: number;
  arrival_date?: string;
  idCardFile?: string;
  contractFile?: string;
  rent?: number;
  fullName?: string; // Add this field for sorting
}
