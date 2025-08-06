import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    navigate("/nouveau");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    // Vérifier que la date de naissance est fournie lors de l'inscription
    if (!isLogin && !birthDate.trim()) {
      alert("Veuillez saisir votre date de naissance");
      return;
    }

    setLoading(true);
    
    if (isLogin) {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        navigate("/nouveau");
      }
    } else {
      const result = await signUp(email, password, birthDate);
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

              {/* Champ date de naissance - seulement visible lors de l'inscription */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required={!isLogin}
                      className="pl-10 bg-background/50 border-border h-12"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email.trim() || !password.trim() || (!isLogin && !birthDate.trim())}
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
            <p className="text-sm text-center mt-4">
              <a href="/forgot-password" className="text-primary underline">
                Mot de passe oublié ?
              </a>
            </p>
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