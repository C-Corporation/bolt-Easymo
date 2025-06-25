import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(data as Profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('[updateProfile] Aucun utilisateur connecté');
        throw new Error('Aucun utilisateur connecté');
      }

      console.log('[updateProfile] Tentative de mise à jour du profil', {
        updates,
        userId: user.id
      });

      const { error, data } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('[updateProfile] ERREUR SQL', error, { updates, userId: user.id });
        // @ts-ignore
        if (typeof window !== 'undefined' && window.toast) {
          // Si toast global existe
          window.toast.error('[updateProfile] ERREUR SQL: ' + (error.message || error.details || JSON.stringify(error)));
        }
        throw error;
      }

      console.log('[updateProfile] SUCCÈS', data);
      // Mettre à jour le profil local
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil');
      console.error('[updateProfile] Exception JS', err);
      // @ts-ignore
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('[updateProfile] Exception JS: ' + (err?.message || JSON.stringify(err)));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};
