import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useProfile } from '@/hooks/useProfile';
import { authenticatedRequest } from '@/utils/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function CreateWorkspacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasWorkspace, loading: workspaceLoading } = useWorkspace();
  const { updateProfile } = useProfile();

  const [workspaceName, setWorkspaceName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Rediriger vers le tableau de bord si l'utilisateur a déjà un workspace
  useEffect(() => {
    if (!workspaceLoading && hasWorkspace) {
      toast.info('Vous avez déjà un espace de travail');
      navigate('/');
    }
  }, [hasWorkspace, workspaceLoading, navigate]);
  
  // Gestion d’une erreur détaillée côté UI
  const [detailedError, setDetailedError] = useState<string | null>(null);

  // Afficher un loader pendant la vérification du workspace
  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de votre espace de travail...</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------- */
  /* --------------------  HANDLE CREATE WORKSPACE  --------------------- */
  /* -------------------------------------------------------------------- */
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceName.trim()) {
      toast.error("Le nom de l'espace de travail ne peut pas être vide.");
      return;
    }
    
    if (!user) {
      toast.error('Vous devez être connecté pour créer un espace de travail');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    let loadingToast: string | number = '';

    try {
      loadingToast = toast.loading('Création de l\'espace de travail…');

      await authenticatedRequest(async () => {
        // 1. Création du workspace
        toast.loading('Création de l\'espace de travail…', { id: loadingToast });
        
        const { data: insertedWorkspace, error: insertError } = await supabase
          .from('workspaces')
          .insert({ 
            name: workspaceName, 
            owner_id: user.id 
          })
          .select('id')
          .single();

        if (insertError || !insertedWorkspace) {
          throw insertError || new Error('Échec de la création du workspace');
        }

        const workspaceId = insertedWorkspace.id;
        toast.success(`Workspace créé avec succès`, { id: loadingToast });

        // 2. Ajout du créateur comme membre admin
        toast.loading('Ajout en tant qu\'administrateur…', { id: loadingToast });
        
        const { error: memberError } = await supabase
          .from('workspace_members')
          .insert({ 
            workspace_id: workspaceId, 
            user_id: user.id, 
            role: 'admin' 
          });

        if (memberError) {
          throw memberError;
        }

        // 3. Mise à jour du profil avec le nouveau workspace sélectionné
        toast.loading('Mise à jour de votre profil…', { id: loadingToast });
        
        await updateProfile({ 
          selected_workspace_id: workspaceId 
        } as any);

        // Rafraîchir la session pour s'assurer que les données sont à jour
        await supabase.auth.refreshSession();
        
        // Tout s'est bien passé, on redirige
        toast.success(`Bienvenue sur votre nouvel espace "${workspaceName}" !`, { 
          id: loadingToast,
          duration: 3000 
        });
        
        // Petite pause pour laisser le temps de voir le message de succès
        setTimeout(() => {
          navigate('/');
        }, 500);
      });
      
    } catch (error: any) {
      console.error('[CreateWorkspace] Error:', error);
      
      const errorMessage = error?.message || 'Une erreur est survenue lors de la création de l\'espace de travail';
      
      toast.error(errorMessage, { 
        id: loadingToast,
        duration: 5000 
      });
      // Affichage d’un message d’erreur détaillé côté UI
      setDetailedError(errorMessage);
      
      // Si l'erreur est liée à l'authentification, on redirige vers la page de connexion
      if (error?.message?.includes('authentification') || error?.status === 401) {
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } finally {
      if (!loadingToast) {
        toast.dismiss(loadingToast);
      }
      setSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------- */
  /* ---------------------------  RENDER  -------------------------------- */
  /* -------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer votre espace de travail</CardTitle>
          <CardDescription>
            Donnez un nom à votre agence ou entreprise.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div>
              <Label htmlFor="workspace-name">
                Nom de l'espace de travail
              </Label>
              <Input
                id="workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                placeholder="Ex : Agence ImmoPlus"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Création…' : "Créer l'espace de travail"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}