
export interface Tenant {
  id: string;
  name: string;
  firstName?: string;
  secondName?: string;
  gender?: 'Homme' | 'Femme' | 'Autre';
  birthDate?: string;
  phoneNumber?: string;
  status: 'En règle' | 'Pas en règle';
  unpaid: number;
  observation: string;
  location: string;
  propertyType?: string;
  rent?: number;
  caution?: number;
  cautionMonths?: number;
  idCardType?: 'Biométrique' | 'CIP';
  idCardFile?: string;
  contractFile?: string;
  photo?: string;
  arrival_date?: string;
  created_at?: string;
  updated_at?: string;
}
