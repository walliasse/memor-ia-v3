import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    navigate("/souvenirs");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    
    if (isLogin) {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        navigate("/souvenirs");
      }
    } else {
      const result = await signUp(email, password);
      if (result.success) {
        setIsLogin(true); // Revenir au mode connexion après inscription
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-memory flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-primary">memor.ia</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Connectez-vous à votre journal" : "Créez votre compte"}
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm shadow-warm border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center font-serif">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-background/50 border-border h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-background/50 border-border h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full h-12 bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                ) : null}
                {isLogin ? "Se connecter" : "Créer le compte"}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? "Pas de compte ? Créer un compte" 
                  : "Déjà un compte ? Se connecter"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
} 