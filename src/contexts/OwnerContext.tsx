import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


export interface Owner {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

interface OwnerContextValue {
  owners: Owner[];
  selectedOwner: Owner | null;
  loading: boolean;
  noOwners: boolean;
  switchOwner: (id: string) => Promise<void>;
}

const OwnerContext = createContext<OwnerContextValue | undefined>(undefined);

export const OwnerProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch owners for current workspace
  useEffect(() => {
    const fetchOwners = async () => {
      if (!user || !profile?.selected_workspace_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .eq('workspace_id', profile.selected_workspace_id)
        .order('created_at');
      if (error) console.error(error);
      else setOwners(data || []);

      if (profile.selected_owner_id) {
        const current = data?.find(o => o.id === profile.selected_owner_id) || null;
        setSelectedOwner(current);
      } else if (data && data.length > 0) {
        // If no owner selected yet, default to the first one
        setSelectedOwner(data[0]);
      }
      setLoading(false);
    };
    if (!authLoading) fetchOwners();
  }, [user, profile?.selected_workspace_id, profile?.selected_owner_id, authLoading]);

  const switchOwner = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ selected_owner_id: id })
      .eq('id', user.id);
    if (error) console.error(error);
    else window.location.reload();
  };

  const value: OwnerContextValue = { owners, selectedOwner, loading, noOwners: !loading && owners.length === 0, switchOwner };
  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
};

export const useOwners = () => {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error('useOwners must be used within OwnerProvider');
  return ctx;
};
