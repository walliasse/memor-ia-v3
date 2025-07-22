import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import Timeline from "@/components/Timeline";
import MemoryForm from "@/components/MemoryForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMemories, setHasMemories] = useState(false); // Commencer par la page d'accueil
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();

  const handleAddMemory = () => {
    setShowMemoryForm(true);
  };

  const handleSaveMemory = (memoryData: any) => {
    // TODO: Sauvegarder en base de données via Supabase
    console.log('Nouveau souvenir:', memoryData);
    
    toast({
      title: "Souvenir sauvegardé !",
      description: "Votre moment précieux a été ajouté à votre journal.",
    });
    
    setShowMemoryForm(false);
    setHasMemories(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/souvenirs");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {hasMemories && (
        <Header 
          onSearch={handleSearch}
          onAddMemory={handleAddMemory}
        />
      )}

      {!hasMemories ? (
        <WelcomeSection onGetStarted={handleGetStarted} />
      ) : (
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8" id="timeline">
          <Timeline searchQuery={searchQuery} />
        </main>
      )}

      {showMemoryForm && (
        <MemoryForm 
          onSave={handleSaveMemory}
          onCancel={() => setShowMemoryForm(false)}
        />
      )}

      {/* Debug info - temporaire pour tester Supabase */}
      <div className="fixed bottom-4 right-4 bg-card p-3 rounded-lg shadow text-xs space-y-1 max-w-48">
        <div>Auth: {loading ? 'Loading...' : isAuthenticated ? 'Connecté' : 'Non connecté'}</div>
        {user && <div>User: {user.email}</div>}
        {!isAuthenticated && !loading && (
          <button 
            onClick={() => navigate("/login")}
            className="text-primary underline text-xs"
          >
            Se connecter
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
