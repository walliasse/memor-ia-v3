import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemoryCard from "./MemoryCard";
import { useMemories } from "@/hooks/useMemories";

const Timeline = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { memories, loading } = useMemories();

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Filtrer les souvenirs du mois actuel
  const monthlyMemories = memories.filter(memory => {
    const memoryDate = new Date(memory.date);
    return memoryDate.getFullYear() === currentMonth.getFullYear() && 
           memoryDate.getMonth() === currentMonth.getMonth();
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gradient-warm rounded-lg p-3 sm:p-4 shadow-soft">
          <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation mensuelle */}
      <div className="flex items-center justify-between bg-gradient-warm rounded-lg p-3 sm:p-4 shadow-soft">
        <Button variant="ghost" size="icon" onClick={previousMonth} className="h-9 w-9 sm:h-10 sm:w-10">
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        <h2 className="font-serif text-lg sm:text-xl font-medium text-foreground capitalize">
          {formatMonth(currentMonth)}
        </h2>
        
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 sm:h-10 sm:w-10">
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Grille des souvenirs */}
      {monthlyMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {monthlyMemories.map((memory) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory}
              onClick={() => {
                // TODO: Ouvrir le modal de détail du souvenir
                console.log('Ouvrir souvenir:', memory.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gradient-memory rounded-lg p-6 sm:p-8 max-w-md mx-auto shadow-soft">
            <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-2">
              {memories.length === 0 ? "Aucun souvenir encore" : "Aucun souvenir ce mois-ci"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {memories.length === 0 ? "Commencez à capturer vos moments précieux" : "Naviguez vers d'autres mois ou créez un nouveau souvenir"}
            </p>
            <Button 
              onClick={() => window.location.href = '/nouveau'}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 min-h-10"
            >
              {memories.length === 0 ? "Créer votre premier souvenir" : "Créer un nouveau souvenir"}
            </Button>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {memories.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Total : {memories.length} souvenir{memories.length > 1 ? 's' : ''} dans votre journal
        </div>
      )}
    </div>
  );
};

export default Timeline;