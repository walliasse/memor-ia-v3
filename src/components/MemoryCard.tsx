import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  image?: string;
}

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

  return (
    <Card 
      className="group hover:shadow-warm transition-all duration-300 cursor-pointer bg-gradient-memory border-border/50"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header avec date et lieu */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(memory.date)}</span>
          </div>
          {memory.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{memory.location}</span>
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="font-serif text-lg font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
          {memory.title}
        </h3>

        {/* Image si présente */}
        {memory.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={memory.image} 
              alt={memory.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Contenu tronqué */}
        <p className="text-foreground/80 leading-relaxed line-clamp-3">
          {memory.content}
        </p>

        {/* Indicateur d'image */}
        {memory.image && (
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <ImageIcon className="h-3 w-3 mr-1" />
            <span>Avec image</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryCard;