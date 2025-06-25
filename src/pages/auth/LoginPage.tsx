import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // Peut être email ou username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let email = identifier;

    // Si l'identifiant n'est pas un email, on suppose que c'est un nom d'utilisateur
    if (!identifier.includes('@')) {
      try {
        // Rechercher le pseudo dans la table profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', identifier)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          toast.error("Identifiants incorrects ou compte inexistant");
          setLoading(false);
          return;
        }

        email = profile.email;
      } catch (error) {
        console.error("Erreur lors de la recherche du profil:", error);
        toast.error("Erreur lors de la connexion. Veuillez réessayer.");
        setLoading(false);
        return;
      }
    }

    // Tentative de connexion
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Message d'erreur générique pour éviter de révéler des informations sensibles
      toast.error('Identifiants incorrects ou compte inexistant');
    } else {
      toast.success('Connexion réussie !');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#47367a] via-[#5d3f9f] to-[#7140b0] bg-cover bg-no-repeat relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="w-px h-px bg-white/70 absolute animate-pulse" style={{ top: '20%', left: '30%' }} />
        <div className="w-px h-px bg-white/60 absolute animate-pulse" style={{ top: '60%', left: '70%' }} />
        <div className="w-px h-px bg-white/50 absolute animate-pulse" style={{ top: '80%', left: '20%' }} />
      </div>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
        {/* Illustration */}
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('/images/login-illustration.jpg')` }} />

        {/* Form container */}
        <div className="p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-700">Accédez à votre tableau de bord Easymo.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="identifier" className="text-gray-800 font-semibold">Email ou Nom d'utilisateur</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="exemple@email.com ou votre pseudo"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-800 font-semibold">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas de compte ?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
   );
}
