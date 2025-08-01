import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMemories } from "@/contexts/MemoriesContext";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

export default function MemoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memories, deleteMemory } = useMemories();
  const { user } = useAuth();
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && memories.length > 0) {
      const foundMemory = memories.find(m => m.id === id);
      if (foundMemory) {
        setMemory(foundMemory);
      }
      setLoading(false);
    }
  }, [id, memories]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    navigate(`/memory/${id}/edit`);
  };

  const handleDelete = async () => {
    if (memory) {
      await deleteMemory(memory.id);
      navigate('/souvenirs');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Souvenir" showBack={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
              <div className="h-32 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Souvenir non trouvé" showBack={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Souvenir non trouvé
            </h1>
            <p className="text-muted-foreground mb-6">
              Le souvenir que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Souvenir" showBack={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le souvenir</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer ce souvenir ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Contenu du souvenir */}
          <Card className="bg-gradient-memory shadow-warm border-border/50">
            <CardContent className="p-6 space-y-6">
              {/* Titre avec date */}
              <div className="text-center">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {formatDate(memory.date)}
                </h1>
                
                {/* Métadonnées */}
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
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
                  {memory.image_url && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>Avec image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              {memory.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={memory.image_url} 
                    alt="Souvenir"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Contenu */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {memory.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 