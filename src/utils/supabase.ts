import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility function to handle authenticated requests with automatic token refresh
 * @param request The async function to execute
 * @returns The result of the request
 * @throws Error if authentication fails
 */
export async function authenticatedRequest<T>(
  request: () => Promise<T>,
  options?: {
    showErrorToast?: boolean;
    errorMessage?: string;
  }
): Promise<T> {
  const { showErrorToast = true, errorMessage = 'Erreur d\'authentification' } = options || {};

  try {
    // Check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Aucune session active');
    }

    // Try to execute the request
    try {
      return await request();
    } catch (requestError) {
      // If the error is an authentication error, try to refresh the token
      if (isAuthError(requestError)) {
        console.log('Session expirée, tentative de rafraîchissement...');
        
        // Try to refresh the session
        const { data: { session: newSession }, error: refreshError } = 
          await supabase.auth.refreshSession();
        
        if (refreshError || !newSession) {
          console.error('Failed to refresh session:', refreshError);
          throw new Error('La session a expiré. Veuillez vous reconnecter.');
        }

        // Retry the original request with the new session
        console.log('Session rafraîchie, nouvelle tentative...');
        return await request();
      }
      
      // If it's not an auth error, rethrow it
      throw requestError;
    }
  } catch (error) {
    console.error('Authenticated request failed:', error);
    
    if (showErrorToast) {
      const message = error instanceof Error ? error.message : errorMessage;
      toast.error(message);
    }
    
    // If it's an auth error, sign out the user
    if (isAuthError(error)) {
      await supabase.auth.signOut();
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    
    throw error;
  }
}

/**
 * Check if an error is an authentication error
 */
function isAuthError(error: any): boolean {
  if (!error) return false;
  
  // Check for Supabase auth errors
  if (error.message?.includes('Invalid Refresh Token') ||
      error.message?.includes('Auth session missing') ||
      error.message?.includes('JWT expired')) {
    return true;
  }
  
  // Check for HTTP 401/403
  if (error.status === 401 || error.status === 403) {
    return true;
  }
  
  return false;
}

/**
 * Helper to handle Supabase errors consistently
 */
export function handleSupabaseError(error: any, context = 'operation'): never {
  console.error(`Error during ${context}:`, error);
  
  let message = `Une erreur est survenue lors de ${context}`;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (error?.message) {
    message = error.message;
  }
  
  throw new Error(message);
}
