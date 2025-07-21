import { useState } from "react";
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
    setHasMemories(true);
    // Scroll vers la timeline ou ouvrir le formulaire
    const timelineElement = document.getElementById('timeline');
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
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
        <main className="container mx-auto px-4 py-8" id="timeline">
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
