import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeSection from "@/components/WelcomeSection";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  // Diagnostic pour Vercel
  useEffect(() => {
    console.log('🔍 Diagnostic Index:', {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      href: window.location.href,
      loading,
      isAuthenticated,
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    });
  }, [loading, isAuthenticated]);

  // Rediriger les utilisateurs connectés vers /nouveau (page d'écriture)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/nouveau", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/nouveau");
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
