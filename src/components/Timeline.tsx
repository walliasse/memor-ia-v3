import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemoryCard from "./MemoryCard";

// Mock data pour la démonstration
const mockMemories = [
  {
    id: '1',
    title: 'Balade en forêt',
    content: 'Une magnifique promenade dans la forêt de Fontainebleau. Les couleurs d\'automne étaient absolument splendides, avec des tons dorés et orangés partout. J\'ai pris le temps de m\'asseoir près d\'un petit ruisseau et d\'écouter le bruit de l\'eau qui coule. C\'était un moment de paix totale.',
    date: '2024-01-15',
    location: 'Forêt de Fontainebleau',
  },
  {
    id: '2',
    title: 'Dîner avec Marie',
    content: 'Soirée inoubliable avec Marie dans ce petit restaurant italien. Nous avons ri aux éclats en nous remémorant nos souvenirs d\'université. Les pâtes étaient délicieuses et l\'ambiance parfaite pour une longue conversation.',
    date: '2024-01-10',
    location: 'Restaurant La Dolce Vita, Paris',
  },
  {
    id: '3',
    title: 'Premier jour au nouveau travail',
    content: 'Première journée dans ma nouvelle entreprise. Un mélange d\'excitation et de nervosité. L\'équipe m\'a accueilli chaleureusement et j\'ai déjà hâte de découvrir tous les projets sur lesquels je vais travailler. Le bureau a une vue magnifique sur les toits de Paris.',
    date: '2024-01-08',
    location: 'Bureau, La Défense',
  },
  {
    id: '4',
    title: 'Week-end à la mer',
    content: 'Escapade improvisée à Deauville. Le vent était fort mais le soleil magnifique. J\'ai marché sur la plage pendant des heures, ramassé quelques coquillages et pris un café chaud face à l\'océan. Ces moments de solitude me ressourcent toujours.',
    date: '2024-01-05',
    location: 'Deauville',
  },
];

interface TimelineProps {
  searchQuery?: string;
}

const Timeline = ({ searchQuery }: TimelineProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredMemories = mockMemories.filter(memory => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      memory.title.toLowerCase().includes(query) ||
      memory.content.toLowerCase().includes(query) ||
      memory.location?.toLowerCase().includes(query)
    );
  });

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

      {/* Messages d'état */}
      {searchQuery && (
        <div className="text-center py-3 sm:py-4">
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            {filteredMemories.length > 0 
              ? `${filteredMemories.length} souvenir(s) trouvé(s) pour "${searchQuery}"`
              : `Aucun souvenir trouvé pour "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {/* Grille des souvenirs */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMemories.map((memory) => (
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
      ) : !searchQuery ? (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gradient-memory rounded-lg p-6 sm:p-8 max-w-md mx-auto shadow-soft">
            <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-2">
              Aucun souvenir ce mois-ci
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Commencez à capturer vos moments précieux
            </p>
            <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 min-h-10">
              Créer votre premier souvenir
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Timeline;