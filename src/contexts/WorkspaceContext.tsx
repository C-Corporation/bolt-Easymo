import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WorkspaceContextType {
  hasWorkspace: boolean;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { profile, loading: authLoading } = useAuth();
  const [hasWorkspace, setHasWorkspace] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  console.log('[WorkspaceContext] Initializing. Received authLoading:', authLoading);

  useEffect(() => {
    console.log('[WorkspaceContext] useEffect triggered. AuthLoading:', authLoading, 'Profile:', profile);
    
    // We are only done loading when auth is done.
    if (!authLoading) {
      // Once auth is done, we can determine if a workspace exists based on the profile.
      const newHasWorkspace = !!profile?.selected_workspace_id;
      console.log('[WorkspaceContext] Auth finished. Setting hasWorkspace to:', newHasWorkspace);
      setHasWorkspace(newHasWorkspace);
      // Now that we've processed the profile, our own loading is done.
      setWorkspaceLoading(false);
    } else {
      console.log('[WorkspaceContext] Auth is still loading. Forcing workspace loading state.');
      // If auth starts loading again, we must also be in a loading state.
      setWorkspaceLoading(true);
    }
  }, [profile, authLoading]);

  console.log('[WorkspaceContext] Final loading state for this render:', workspaceLoading);

  return (
    <WorkspaceContext.Provider value={{ hasWorkspace, loading: workspaceLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
