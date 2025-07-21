import { useState } from "react";
import { Calendar, MapPin, Image as ImageIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MemoryFormData {
  title: string;
  content: string;
  date: string;
  location: string;
  image?: File;
}

interface MemoryFormProps {
  onSave: (memory: MemoryFormData) => void;
  onCancel: () => void;
}

const MemoryForm = ({ onSave, onCancel }: MemoryFormProps) => {
  const [formData, setFormData] = useState<MemoryFormData>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-memory shadow-warm">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl text-foreground">
              Nouveau souvenir
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Titre du souvenir
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Donnez un titre à ce moment..."
                className="bg-background/50 border-border focus:bg-background"
                required
              />
            </div>

            {/* Date et lieu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-background/50 border-border focus:bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Lieu (optionnel)
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Où étiez-vous ?"
                  className="bg-background/50 border-border focus:bg-background"
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-foreground flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                Image (optionnelle)
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background/50 border-border focus:bg-background"
              />
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-foreground">
                Votre souvenir
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Racontez-nous ce moment... Que s'est-il passé ? Comment vous sentiez-vous ?"
                className="min-h-32 bg-background/50 border-border focus:bg-background resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le souvenir
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryForm;