import { useNavigate } from "react-router-dom";
import MemoryForm from "@/components/MemoryForm";
import Header from "@/components/Header";
import { useMemories } from "@/contexts/MemoriesContext";

interface MemoryFormData {
  content: string;
  date: string;
  location: string;
  image?: File;
}

export default function NewMemory() {
  const navigate = useNavigate();
  const { createMemory, saving } = useMemories();

  const handleSaveMemory = async (memoryData: MemoryFormData) => {
    const result = await createMemory({
      content: memoryData.content,
      date: memoryData.date,
      location: memoryData.location,
      image: memoryData.image
    });

    if (result.success) {
      // Rediriger vers la page des souvenirs
      navigate("/souvenirs");
    }
    // Les erreurs sont gérées dans le hook useMemories
  };

  const handleCancel = () => {
    navigate("/souvenirs");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
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