import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();

  const handleSelection = async (role: 'owner' | 'agent') => {
    toast.loading('Mise à jour du profil...');
    try {
      await updateProfile({ role } as any); // Typage dynamique pour update
      toast.success('Rôle enregistré : ' + (role === 'agent' ? 'Agent' : 'Propriétaire'));
      if (role === 'agent') {
        navigate('/workspace/create'); // Rediriger vers la création de workspace
      } else {
        // Pour un propriétaire, on peut le rediriger vers une page simplifiée
        navigate('/');
      }
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du profil : ' + (err?.message || 'Erreur inconnue'));
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Bienvenue sur EasyIMO !</CardTitle>
          <CardDescription>Pour commencer, dites-nous qui vous êtes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-6 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleSelection('owner')}
role="button"
          >
            <h3 className="text-lg font-semibold">Je suis un propriétaire</h3>
            <p className="text-sm text-gray-600 mt-2">
              Gérez vos propres biens immobiliers en toute simplicité.
            </p>
          </div>
          <div 
            className="p-6 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleSelection('agent')}
role="button"
          >
            <h3 className="text-lg font-semibold">Je travaille pour une agence</h3>
            <p className="text-sm text-gray-600 mt-2">
              Collaborez avec votre équipe et gérez les portefeuilles de vos clients.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
