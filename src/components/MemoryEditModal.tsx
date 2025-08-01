import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { Memory } from "@/lib/types";
import { useDateBounds } from "@/hooks/useDateBounds";

interface MemoryEditModalProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: { content: string; date: string; location?: string; removeImage?: boolean; image?: File }) => Promise<void>;
  loading?: boolean;
}

export default function MemoryEditModal({ 
  memory, 
  open, 
  onOpenChange, 
  onSave, 
  loading = false 
}: MemoryEditModalProps) {
  const { minDate, maxDate, isDateValid, getErrorMessage } = useDateBounds();
  
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (memory) {
      setContent(memory.content);
      setDate(memory.date);
      setLocation(memory.location || '');
      setRemoveImage(false);
      setNewImage(null);
      setImagePreview(memory.image_url || '');
    }
  }, [memory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setRemoveImage(false);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setNewImage(null);
    setRemoveImage(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    
    // Valider la date
    const selectedDate = new Date(newDate);
    const error = getErrorMessage(selectedDate);
    setDateError(error);
  };

  const handleSave = async () => {
    if (!memory) return;
    
    // Vérifier la validité de la date
    const selectedDate = new Date(date);
    if (!isDateValid(selectedDate)) {
      const error = getErrorMessage(selectedDate);
      setDateError(error);
      return;
    }
    
    await onSave(memory.id, {
      content,
      date,
      location: location || undefined,
      removeImage: removeImage,
      image: newImage || undefined
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
              onChange={handleDateChange}
              min={minDate.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              className={dateError ? 'border-red-500' : ''}
              required
            />
            {dateError && (
              <p className="text-xs text-red-500 mt-1">{dateError}</p>
            )}
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

          {/* Gestion des images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Image</Label>
              {!removeImage && (memory.image_url || newImage) && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              )}
            </div>

            {/* Upload d'image si pas d'image actuelle */}
            {!memory.image_url && !newImage && !removeImage && (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-background/50 border-border focus:bg-background"
                />
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cliquez pour ajouter une image</p>
                </div>
              </div>
            )}

            {/* Aperçu de l'image actuelle ou nouvelle */}
            {imagePreview && !removeImage && (
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={imagePreview} 
                  alt="Souvenir"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {/* Message de suppression */}
            {removeImage && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Image supprimée</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRemoveImage(false);
                      setImagePreview(memory?.image_url || '');
                    }}
                    className="h-8 px-2"
                  >
                    Annuler
                  </Button>
                </div>
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">L'image sera supprimée lors de la sauvegarde</p>
                </div>
              </div>
            )}
          </div>

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