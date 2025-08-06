import { useState } from "react";
import { Calendar, MapPin, Image as ImageIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDateBounds } from "@/hooks/useDateBounds";

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
  const { minDate, maxDate, isDateValid, getErrorMessage } = useDateBounds();
  
  const [formData, setFormData] = useState<MemoryFormData>({
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData(prev => ({ ...prev, date: newDate }));
    
    // Valider la date
    const selectedDate = new Date(newDate);
    const error = getErrorMessage(selectedDate);
    setDateError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier la validité de la date
    const selectedDate = new Date(formData.date);
    if (!isDateValid(selectedDate)) {
      const error = getErrorMessage(selectedDate);
      setDateError(error);
      return;
    }
    
    if (formData.content) {
      onSave(formData);
    }
  };

  if (isFullPage) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Card className="w-full max-w-xl mx-auto bg-gradient-memory shadow-warm">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date et lieu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    min={minDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    className={`bg-background/50 border-border focus:bg-background h-10 ${
                      dateError ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {dateError && (
                    <p className="text-xs text-red-500 mt-1">{dateError}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Lieu"
                    className="bg-background/50 border-border focus:bg-background h-10"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-background/50 border-border focus:bg-background h-10"
                />
                {imagePreview && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Votre souvenir..."
                  className="min-h-40 bg-background/50 border-border focus:bg-background resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-4">
                                 <Button 
                   type="submit" 
                   className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12"
                 >
                   <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2">
                     <Plus className="h-3 w-3 text-white" />
                   </div>
                   Sauvegarder
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-background/50 border-border focus:bg-background h-10"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lieu"
                  className="bg-background/50 border-border focus:bg-background h-10"
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background/50 border-border focus:bg-background h-10"
              />
              {imagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Votre souvenir..."
                className="min-h-32 bg-background/50 border-border focus:bg-background resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                             <Button 
                 type="submit" 
                 className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90 h-12"
               >
                 <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2">
                   <Plus className="h-3 w-3 text-white" />
                 </div>
                 Sauvegarder
               </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1 h-12"
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