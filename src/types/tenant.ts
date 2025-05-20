
export interface Tenant {
  id: string;
  name: string;
  status: 'En règle' | 'Pas en règle';
  unpaid: number;
  observation: string;
  location: string;
  caution?: number;
  arrival_date?: string;
  created_at?: string;
  updated_at?: string;
}
