
export interface Tenant {
  id: string;
  name: string;
  status: 'En règle' | 'Pas en règle';
  unpaid: number;
  observation: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}
