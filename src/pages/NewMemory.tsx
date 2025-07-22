import { useNavigate } from "react-router-dom";
import MemoryForm from "@/components/MemoryForm";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface MemoryFormData {
  content: string;
  date: string;
  location: string;
  image?: File;
}

export default function NewMemory() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveMemory = (memoryData: MemoryFormData) => {
    // TODO: Sauvegarder en base de données via Supabase
    console.log('Nouveau souvenir:', memoryData);
    
    toast({
      title: "Souvenir sauvegardé !",
      description: "Votre moment précieux a été ajouté à votre journal.",
    });
    
    // Rediriger vers la page des souvenirs
    navigate("/souvenirs");
  };

  const handleCancel = () => {
    navigate("/souvenirs");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Ecrire" />

      {/* Formulaire en pleine page */}
      <MemoryForm 
        onSave={handleSaveMemory}
        onCancel={handleCancel}
        isFullPage={true}
      />
    </div>
  );
} 