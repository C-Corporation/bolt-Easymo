import { useAuth } from '@/contexts/AuthContext';

/**
 * A hook to access and manage the current user's profile.
 * 
 * This hook acts as a simple wrapper around the `useAuth` context.
 * It provides the profile data, loading state, and an update function,
 * ensuring that all profile management logic is centralized in `AuthContext`.
 */
export const useProfile = () => {
  const { profile, loading, updateProfile, error } = useAuth();

  return {
    profile,
    loading,
    error: error ? error.message : null,
    updateProfile,
  };
};
