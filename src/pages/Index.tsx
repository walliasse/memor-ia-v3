import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import Timeline from "@/components/Timeline";
import MemoryForm from "@/components/MemoryForm";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMemories, setHasMemories] = useState(false); // Commencer par la page d'accueil
  const { toast } = useToast();
  const navigate = useNavigate();

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
    // Rediriger vers la page des souvenirs au lieu de changer l'état local
    navigate("/souvenirs");
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
    </div>
  );
};

export default Index;
