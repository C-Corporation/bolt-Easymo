import { Database } from '@/integrations/supabase/types';

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

// Type for creating a new transaction (excluding auto-generated fields)
export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'>;

// Type for updating a transaction (all fields are partial)
export type TransactionUpdate = Partial<Omit<Transaction, 'id' | 'created_at'>>;

// Transaction categories
export const TRANSACTION_CATEGORIES = [
  'loyer',
  'maintenance',
  'assurance',
  'taxes',
  'autres'
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

// Transaction types
export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];

// Transaction statuses
export const TRANSACTION_STATUSES = ['received', 'paid', 'pending'] as const;
export type TransactionStatus = typeof TRANSACTION_STATUSES[number];
