import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Workspace } from '@/types/workspace';

interface UseWorkspacesReturn {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  loading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
}

export const useWorkspaces = (): UseWorkspacesReturn => {
  const { user, profile, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: memberEntries, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const workspaceIds = memberEntries.map(entry => entry.workspace_id);
      if (workspaceIds.length === 0) {
        setWorkspaces([]);
        setSelectedWorkspace(null);
        return;
      }

      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (workspaceError) throw workspaceError;

      setWorkspaces(workspaceData || []);

      if (profile?.selected_workspace_id) {
        const current = workspaceData?.find(ws => ws.id === profile.selected_workspace_id) || null;
        setSelectedWorkspace(current);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des espaces de travail:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile?.selected_workspace_id]);

  const switchWorkspace = async (workspaceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ selected_workspace_id: workspaceId })
        .eq('id', user.id);

      if (error) throw error;

      // Re-fetch workspaces to update the selected one
      // Note: This will trigger a re-render in AuthContext, which will then trigger a re-fetch here.
      // A more direct state update could be done for better UX.
      window.location.reload(); // Simple solution to refresh all data

    } catch (error) {
      console.error('Erreur lors du changement d\'espace de travail:', error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWorkspaces();
    }
  }, [authLoading, fetchWorkspaces]);

  return { workspaces, selectedWorkspace, loading, switchWorkspace };
};
