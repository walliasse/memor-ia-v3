import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeSection from "@/components/WelcomeSection";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  // Rediriger les utilisateurs connectés vers /souvenirs
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/souvenirs", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/souvenirs");
    } else {
      navigate("/login");
    }
  };

  // Afficher un loader pendant la vérification d'auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Page d'accueil uniquement pour les non-connectés
  return (
    <div className="min-h-screen bg-background">
      <WelcomeSection onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
