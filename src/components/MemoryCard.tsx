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
      month: 'long',
      year: 'numeric'
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
        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1 capitalize">
          {formatDateTitle(memory.date)}
        </h3>

        {/* Localisation et indicateur d'image */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
          {memory.location && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>{memory.location}</span>
            </div>
          )}
          {memory.image_url && (
            <div className="flex items-center">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          )}
        </div>

        {/* Image si présente - Supprimé pour ne pas afficher l'aperçu */}

        {/* Contenu tronqué */}
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed line-clamp-3">
          {memory.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;