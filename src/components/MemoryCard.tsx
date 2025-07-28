import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Memory } from "@/lib/types";
import MemoryActionsMenu from "./MemoryActionsMenu";

interface MemoryCardProps {
  memory: Memory;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MemoryCard = ({ memory, onView, onEdit, onDelete }: MemoryCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTitle = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Générer un titre à partir du contenu
  const getTitle = (content: string) => {
    const words = content.trim().split(' ');
    if (words.length <= 6) return content;
    return words.slice(0, 6).join(' ') + '...';
  };

  return (
    <Card 
      className="group hover:shadow-warm transition-all duration-300 cursor-pointer bg-gradient-memory border-border/50 relative"
      onClick={onView}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Menu d'actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <MemoryActionsMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
        {/* Titre avec la date */}
        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground dark:text-amber-100 mb-3 group-hover:text-primary transition-colors line-clamp-1 capitalize">
          {formatDateTitle(memory.date)}
        </h3>

        {/* Localisation si présente */}
        {memory.location && (
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground dark:text-amber-200/70 mb-3">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>{memory.location}</span>
          </div>
        )}

        {/* Image si présente */}
        {memory.image_url && (
          <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden">
            <img 
              src={memory.image_url} 
              alt="Souvenir"
              className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Contenu tronqué */}
        <p className="text-sm sm:text-base text-foreground/80 dark:text-amber-100/90 leading-relaxed line-clamp-3">
          {memory.content}
        </p>

        {/* Indicateur d'image */}
        {memory.image_url && (
          <div className="flex items-center mt-3 text-xs text-muted-foreground dark:text-amber-200/70">
            <ImageIcon className="h-3 w-3 mr-1" />
            <span>Avec image</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryCard;