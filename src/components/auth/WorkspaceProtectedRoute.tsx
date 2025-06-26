import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Loader2 } from 'lucide-react';

const WorkspaceProtectedRoute = () => {
  const { hasWorkspace, loading } = useWorkspace();
  const location = useLocation();

  console.log('[WorkspaceProtectedRoute] Rendering. Loading:', loading, 'HasWorkspace:', hasWorkspace);

  // Afficher un loader pendant la vérification
  if (loading) {
    console.log('[WorkspaceProtectedRoute] Decision: Show loader.');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de votre espace de travail...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'a pas de workspace, rediriger vers la page de création
  if (!hasWorkspace) {
    console.log('[WorkspaceProtectedRoute] Decision: Redirect to /workspace/create.');
    // Stocker l'URL actuelle pour y revenir après la création du workspace
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/workspace/create?redirect_to=${redirectTo}`} replace />;
  }

  // Si tout est bon, afficher le contenu protégé
  console.log('[WorkspaceProtectedRoute] Decision: Render Outlet.');
  return <Outlet />;
};

export default WorkspaceProtectedRoute;
