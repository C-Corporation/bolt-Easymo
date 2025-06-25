import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export default function CreateWorkspacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim() || !user) {
      toast.error("Le nom de l'espace de travail ne peut pas être vide.");
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le workspace
      toast.loading('Création de l’espace de travail...');
      console.log('Tentative de création du workspace avec:', { name: workspaceName, owner_id: user.id });
      const { error: insertError } = await supabase
        .from('workspaces')
        .insert({ name: workspaceName, owner_id: user.id });

      if (insertError) {
        console.error("ERREUR PENDANT L'INSERTION:", insertError);
        toast.error("Erreur lors de la création de l’espace de travail : " + insertError.message);
        throw insertError;
      }
      toast.success('Espace de travail créé. Récupération des informations...');
      console.log('SUCCÈS: Workspace inséré. Tentative de récupération...');

      // Étape 2: Ajouter le créateur comme membre admin
    let workspaceId: string | null = null;
    // On récupère l'id du workspace tout juste créé (par le nom et la date)
    const { data: workspaceCreated, error: selectCreatedError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('name', workspaceName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (selectCreatedError || !workspaceCreated) {
      toast.error('Erreur lors de la récupération du workspace créé : ' + (selectCreatedError?.message || 'Non trouvé'));
      throw selectCreatedError || new Error('Workspace non trouvé');
    }
    workspaceId = workspaceCreated.id;

    toast.success('Workspace récupéré. Ajout du membre administrateur...');
    console.log('SUCCÈS: Workspace retrouvé:', workspaceCreated);

    // 2. Ajouter le créateur comme membre admin
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspaceId, user_id: user.id, role: 'admin' });

    if (memberError) {
      toast.error('Erreur lors de l’ajout du membre administrateur : ' + memberError.message);
      throw memberError;
    }

    // 3. Sélectionner le workspace dont l'utilisateur est admin (sécurité multi-tenant)
    const { data: adminWorkspace, error: adminSelectError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (adminSelectError || !adminWorkspace) {
      toast.error('Erreur lors de la récupération du workspace admin : ' + (adminSelectError?.message || 'Non trouvé'));
      throw adminSelectError || new Error('Workspace admin non trouvé');
    }
    workspaceId = adminWorkspace.workspace_id;

    toast.success('Membre administrateur ajouté. Mise à jour du profil...');

    // 4. Mettre à jour le workspace sélectionné pour l'utilisateur (via useProfile)
    try {
      await updateProfile({ selected_workspace_id: workspaceId } as any); // Typage dynamique pour update
      toast.success('Profil utilisateur mis à jour avec succès.');
    } catch (profileUpdateError: any) {
      toast.error('Erreur lors de la mise à jour du profil : ' + (profileUpdateError.message || profileUpdateError));
      throw profileUpdateError;
    }  

      toast.success(`L'espace de travail "${workspaceName}" a été créé et configuré !`);
      navigate('/'); // Rediriger vers le tableau de bord

    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

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
              <Label htmlFor="workspace-name">Nom de l'espace de travail</Label>
              <Input
                id="workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                placeholder="Ex: Agence ImmoPlus"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création...' : "Créer l'espace de travail"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
