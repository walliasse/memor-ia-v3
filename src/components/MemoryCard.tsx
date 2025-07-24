import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Memory } from "@/lib/supabase";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
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
      className="group hover:shadow-warm transition-all duration-300 cursor-pointer bg-gradient-memory border-border/50"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Header avec date et lieu */}
        <div className="flex items-start sm:items-center justify-between mb-3 text-xs sm:text-sm text-muted-foreground gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{formatDate(memory.date)}</span>
          </div>
          {memory.location && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              <MapPin className="h-3 w-3" />
              <span className="text-xs truncate max-w-20 sm:max-w-none">{memory.location}</span>
            </div>
          )}
        </div>

        {/* Titre généré */}
        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {getTitle(memory.content)}
        </h3>

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