import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { Memory } from "@/lib/types";

interface MemoryDetailModalProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MemoryDetailModal({ memory, open, onOpenChange }: MemoryDetailModalProps) {
  if (!memory) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground dark:text-amber-100">
            {formatDate(memory.date)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date et localisation */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-amber-200/70">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(memory.date).toLocaleDateString('fr-FR')}</span>
            </div>
            {memory.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{memory.location}</span>
              </div>
            )}
          </div>

          {/* Image si présente */}
          {memory.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={memory.image_url} 
                alt="Souvenir"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Contenu complet */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-foreground/90 dark:text-amber-100/90 leading-relaxed whitespace-pre-wrap">
              {memory.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}