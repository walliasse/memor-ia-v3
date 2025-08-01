import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Image as ImageIcon, Clock } from "lucide-react";
import { Memory } from "@/lib/types";
import MemoryCard from "./MemoryCard";

interface DayMemoriesModalProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memories: Memory[];
}

export default function DayMemoriesModal({ 
  date, 
  open, 
  onOpenChange, 
  memories 
}: DayMemoriesModalProps) {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {formatDate(date)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* En-tête avec statistiques */}
          <div className="flex items-center justify-between p-4 bg-gradient-memory rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {memories.length} souvenir{memories.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {memories.length > 0 && formatTime(memories[0].created_at)}
              </span>
            </div>
          </div>

          {/* Liste des souvenirs */}
          {memories.length > 0 ? (
            <div className="space-y-4">
              {memories.map((memory, index) => (
                <div key={memory.id} className="space-y-3">
                  <MemoryCard 
                    memory={memory} 
                    onView={() => {
                      // Optionnel : navigation vers la page détail
                      console.log('Voir le souvenir:', memory.id);
                    }}
                    onEdit={() => {
                      // Optionnel : édition
                      console.log('Éditer le souvenir:', memory.id);
                    }}
                    onDelete={() => {
                      // Optionnel : suppression
                      console.log('Supprimer le souvenir:', memory.id);
                    }}
                  />
                  
                  {index < memories.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gradient-memory rounded-lg p-6 max-w-md mx-auto">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                  Aucun souvenir ce jour-là
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ce jour n'a pas encore de souvenirs enregistrés.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 