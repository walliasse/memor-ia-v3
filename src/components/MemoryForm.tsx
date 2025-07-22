import { useState } from "react";
import { Calendar, MapPin, Image as ImageIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MemoryFormData {
  content: string;
  date: string;
  location: string;
  image?: File;
}

interface MemoryFormProps {
  onSave: (memory: MemoryFormData) => void;
  onCancel: () => void;
  isFullPage?: boolean;
}

const MemoryForm = ({ onSave, onCancel, isFullPage = false }: MemoryFormProps) => {
  const [formData, setFormData] = useState<MemoryFormData>({
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
    if (formData.content) {
      onSave(formData);
    }
  };

  if (isFullPage) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Card className="w-full max-w-2xl mx-auto bg-gradient-memory shadow-warm">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Date et lieu */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                    className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
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
                    className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
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
                  className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
                />
                {imagePreview && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu"
                      className="w-full h-40 sm:h-48 object-cover"
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
                  placeholder="Un moment, une pensée, un souvenir..."
                  className="min-h-32 sm:min-h-40 bg-background/50 border-border focus:bg-background resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90 min-h-11"
                >
                  <Save className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Sauvegarder le souvenir</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1 min-h-11"
                >
                  <span className="text-sm sm:text-base">Annuler</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-memory shadow-warm">
        <CardHeader className="border-b border-border/50 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg sm:text-xl text-foreground">
              Nouveau souvenir
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 sm:h-10 sm:w-10">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Date et lieu */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                  className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
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
                  className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
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
                className="bg-background/50 border-border focus:bg-background h-10 sm:h-11"
              />
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu"
                    className="w-full h-40 sm:h-48 object-cover"
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
                className="min-h-28 sm:min-h-32 bg-background/50 border-border focus:bg-background resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90 min-h-11"
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Sauvegarder le souvenir</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1 min-h-11"
              >
                <span className="text-sm sm:text-base">Annuler</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryForm;