import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Définir un type simple pour le profil, en attendant une définition plus complète
interface Profile {
  id: string;
  selected_workspace_id: string | null;
  email?: string;
  full_name?: string;
  [key: string]: any;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
  updateProfile: (userId: string) => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to fetch user profile, moved outside the component to prevent re-creation
const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  console.log(`[AuthHelper] fetchUserProfile: Starting for userId: ${userId}`);
  try {
    console.log('[AuthHelper] fetchUserProfile: Executing Supabase query...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('[AuthHelper] fetchUserProfile: Supabase query finished.');

    if (profileError) {
      console.error('[AuthHelper] fetchUserProfile: SUPABASE ERROR while fetching profile:', profileError);
      throw profileError;
    }
    
    console.log('[AuthHelper] fetchUserProfile: Profile data received:', profileData);
    return profileData as Profile;
  } catch (err) {
    console.error('[AuthHelper] fetchUserProfile: CATCH BLOCK - An error occurred:', err);
    // Re-throw the error to be caught by the calling function
    throw err;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('[AuthContext] Initializing...');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('[AuthContext] useEffect running.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthContext] onAuthStateChange event: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);

      // Auth loading est terminé dès que la session est connue (même si le profil n'est pas encore récupéré)
      setLoading(false);

      if (session?.user) {
        try {
          const fetchedProfile = await fetchUserProfile(session.user.id);
          setProfile(fetchedProfile);
        } catch (err) {
          console.error("[AuthContext] Error fetching profile in onAuthStateChange", err);
          setError(err as Error);
          setProfile(null);
        }
      } else {
        setProfile(null);
        // Pas de session : authLoading est terminé malgré tout
        setLoading(false);
      }
    });

    // Initial check in case the event listener doesn't fire right away
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false); // Déplacement de setLoading(false) ici
      } 
      // setLoading(false) is handled by the listener, which will fire
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth state changes.');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // This function is now defined inside the component because it depends on state setters
  const updateProfileCallback = useCallback(async (userId: string) => {
    try {
      const fetchedProfile = await fetchUserProfile(userId);
      setProfile(fetchedProfile);
      return fetchedProfile;
    } catch (err) {
      setError(err as Error);
      setProfile(null);
      return null;
    }
  }, []);

  // Fonction de déconnexion avec gestion d'erreur
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err as Error);
      throw err;
    }
  };

  // Rafraîchir la session actuelle
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user.id);
      }
      return data.session;
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError(err as Error);
      throw err;
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    error,
    signOut,
    refreshSession,
    updateProfile: updateProfileCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
