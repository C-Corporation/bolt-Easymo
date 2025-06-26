import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Transaction, TransactionInsert, TransactionUpdate } from '@/types/transaction';
import { useAuth } from '@/contexts/AuthContext';

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (transaction: TransactionInsert) => Promise<boolean>;
  updateTransaction: (id: string, transaction: TransactionUpdate) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!profile?.selected_workspace_id) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('workspace_id', profile.selected_workspace_id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les transactions. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [profile?.selected_workspace_id]);

  const addTransaction = useCallback(async (transaction: TransactionInsert) => {
    if (!profile?.selected_workspace_id) {
      toast({
        title: 'Erreur',
        description: "Aucun espace de travail n'est sélectionné.",
        variant: 'destructive',
      });
      return false;
    }

    const transactionWithWorkspace = {
      ...transaction,
      workspace_id: profile.selected_workspace_id,
    };

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([transactionWithWorkspace]);

      if (error) throw error;

      // Refresh the list after adding
      await fetchTransactions();
      toast({
        title: 'Succès',
        description: 'Transaction ajoutée avec succès.',
      });
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la transaction.',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchTransactions, profile?.selected_workspace_id]);

  const updateTransaction = useCallback(async (id: string, transaction: TransactionUpdate) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id);

      if (error) throw error;

      // Refresh the list after updating
      await fetchTransactions();
      toast({
        title: 'Succès',
        description: 'Transaction mise à jour avec succès.',
      });
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la transaction.',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh the list after deleting
      await fetchTransactions();
      toast({
        title: 'Succès',
        description: 'Transaction supprimée avec succès.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la transaction.',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchTransactions]);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, profile?.selected_workspace_id]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
  };
};
