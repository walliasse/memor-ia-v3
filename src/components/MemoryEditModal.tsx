import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Memory } from "@/lib/types";

interface MemoryEditModalProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: { content: string; date: string; location?: string }) => Promise<void>;
  loading?: boolean;
}

export default function MemoryEditModal({ 
  memory, 
  open, 
  onOpenChange, 
  onSave, 
  loading = false 
}: MemoryEditModalProps) {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (memory) {
      setContent(memory.content);
      setDate(memory.date);
      setLocation(memory.location || '');
    }
  }, [memory]);

  const handleSave = async () => {
    if (!memory) return;
    
    await onSave(memory.id, {
      content,
      date,
      location: location || undefined
    });
    
    onOpenChange(false);
  };

  if (!memory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Modifier le souvenir
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Lieu (optionnel)</Label>
            <Input
              id="edit-location"
              type="text"
              placeholder="Où étiez-vous ?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Contenu</Label>
            <Textarea
              id="edit-content"
              placeholder="Décrivez votre souvenir..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>

          {memory.image_url && (
            <div className="space-y-2">
              <Label>Image actuelle</Label>
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={memory.image_url} 
                  alt="Souvenir"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || !content.trim() || !date}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}