import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Memory } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { embeddingService } from '@/lib/embeddingService';

interface MemoriesContextType {
  memories: Memory[];
  loading: boolean;
  saving: boolean;
  fetchMemories: () => Promise<void>;
  createMemory: (memoryData: CreateMemoryData) => Promise<{ success: boolean; error?: string; data?: Memory }>;
  updateMemory: (id: string, updates: UpdateMemoryData) => Promise<{ success: boolean; error?: string; data?: Memory }>;
  deleteMemory: (id: string) => Promise<{ success: boolean; error?: string }>;
  indexAllMemories: () => Promise<{ success: boolean; error?: string; count?: number; errors?: string[] }>;
}

interface CreateMemoryData {
  content: string;
  date: string;
  location?: string;
  image?: File;
}

interface UpdateMemoryData {
  content: string;
  date: string;
  location?: string;
  image?: File;
  removeImage?: boolean;
}

const MemoriesContext = createContext<MemoriesContextType | undefined>(undefined);

export function MemoriesProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Récupérer tous les souvenirs de l'utilisateur
  const fetchMemories = async () => {
    if (!user) {
      setMemories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des souvenirs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos souvenirs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Générer l'embedding pour un souvenir
  const generateEmbedding = async (content: string, location?: string): Promise<number[] | null> => {
    try {
      const textToEmbed = `${content} ${location || ''}`.trim();
      if (!textToEmbed) return null;
      
      return await embeddingService.generateEmbedding(textToEmbed);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'embedding:', error);
      return null;
    }
  };

  // Créer un nouveau souvenir
  const createMemory = async (memoryData: CreateMemoryData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder un souvenir.",
        variant: "destructive"
      });
      return { success: false, error: 'Non authentifié' };
    }

    try {
      setSaving(true);

      // Vérifier s'il existe déjà un souvenir pour cette date
      const { data: existingMemory, error: checkError } = await supabase
        .from('memories')
        .select('id, content')
        .eq('user_id', user.id)
        .eq('date', memoryData.date)
        .single();

      if (existingMemory) {
        // Demander confirmation pour remplacer ou ajouter
        const shouldReplace = window.confirm(
          `Vous avez déjà un souvenir pour le ${new Date(memoryData.date).toLocaleDateString('fr-FR')}.\n\n` +
          `Contenu existant : "${existingMemory.content.substring(0, 50)}..."\n\n` +
          `Voulez-vous remplacer ce souvenir par le nouveau ?`
        );

        if (shouldReplace) {
          // Mettre à jour le souvenir existant
          return await updateMemory(existingMemory.id, {
            content: memoryData.content,
            date: memoryData.date,
            location: memoryData.location,
            image: memoryData.image
          });
        } else {
          // Annuler la création
          toast({
            title: "Création annulée",
            description: "Le souvenir n'a pas été créé.",
          });
          return { success: false, error: 'Création annulée par l\'utilisateur' };
        }
      }

      // Générer l'embedding
      const embedding = await generateEmbedding(memoryData.content, memoryData.location);

      // Upload de l'image si présente
      let imageUrl = null;
      if (memoryData.image) {
        const fileExt = memoryData.image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('memories')
          .upload(fileName, memoryData.image);

        if (uploadError) {
          console.error('Erreur upload image:', uploadError);
          toast({
            title: "Attention",
            description: "L'image n'a pas pu être uploadée, mais le souvenir a été sauvegardé.",
            variant: "destructive"
          });
        } else {
          // Récupérer l'URL publique de l'image
          const { data: urlData } = supabase.storage
            .from('memories')
            .getPublicUrl(fileName);
          
          imageUrl = urlData.publicUrl;
        }
      }

      // Créer le souvenir avec l'image
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          content: memoryData.content,
          date: memoryData.date,
          location: memoryData.location || null,
          image_url: imageUrl,
          embedding: embedding ? `[${embedding.join(',')}]` : null
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste locale
      setMemories(prev => [data, ...prev]);

      toast({
        title: "Souvenir sauvegardé !",
        description: "Votre moment précieux a été ajouté à votre journal.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      
      // Gérer spécifiquement l'erreur de contrainte d'unicité
      if (error.code === '23505' && error.message.includes('memories_user_id_date_key')) {
        toast({
          title: "Souvenir déjà existant",
          description: `Vous avez déjà un souvenir pour le ${new Date(memoryData.date).toLocaleDateString('fr-FR')}.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de sauvegarder votre souvenir.",
          variant: "destructive"
        });
      }
      
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour un souvenir
  const updateMemory = async (id: string, updates: UpdateMemoryData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier un souvenir.",
        variant: "destructive"
      });
      return { success: false, error: 'Non authentifié' };
    }

    try {
      setSaving(true);

      // Générer le nouvel embedding
      const embedding = await generateEmbedding(updates.content, updates.location);

      // Récupérer le souvenir actuel pour gérer l'image existante
      const { data: currentMemory, error: fetchError } = await supabase
        .from('memories')
        .select('image_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Supprimer l'ancienne image si nécessaire
      if (currentMemory?.image_url && (updates.removeImage || updates.image)) {
        try {
          const urlParts = currentMemory.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const fullPath = `${user.id}/${fileName}`;

          const { error: deleteImageError } = await supabase.storage
            .from('memories')
            .remove([fullPath]);

          if (deleteImageError) {
            console.error('Erreur suppression ancienne image:', deleteImageError);
          }
        } catch (imageError) {
          console.error('Erreur lors de la suppression de l\'ancienne image:', imageError);
        }
      }

      // Upload de la nouvelle image si présente
      let imageUrl = null;
      if (updates.image) {
        const fileExt = updates.image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('memories')
          .upload(fileName, updates.image);

        if (uploadError) {
          console.error('Erreur upload image:', uploadError);
          toast({
            title: "Attention",
            description: "L'image n'a pas pu être uploadée, mais le souvenir a été mis à jour.",
            variant: "destructive"
          });
        } else {
          // Récupérer l'URL publique de l'image
          const { data: urlData } = supabase.storage
            .from('memories')
            .getPublicUrl(fileName);
          
          imageUrl = urlData.publicUrl;
        }
      }

      const updateData: any = {
        content: updates.content,
        date: updates.date,
        location: updates.location || null,
        embedding: embedding ? `[${embedding.join(',')}]` : null,
        updated_at: new Date().toISOString()
      };

      // Gérer l'image_url selon les cas
      if (updates.removeImage) {
        updateData.image_url = null;
      } else if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { data, error } = await supabase
        .from('memories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste locale
      setMemories(prev => prev.map(memory => 
        memory.id === id ? data : memory
      ));

      toast({
        title: "Souvenir mis à jour !",
        description: "Votre souvenir a été modifié avec succès.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour votre souvenir.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  };

  // Supprimer un souvenir
  const deleteMemory = async (id: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer un souvenir.",
        variant: "destructive"
      });
      return { success: false, error: 'Non authentifié' };
    }

    try {
      // Récupérer le souvenir pour obtenir l'URL de l'image
      const { data: memory, error: fetchError } = await supabase
        .from('memories')
        .select('image_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      // Supprimer l'image du storage si elle existe
      if (memory?.image_url) {
        try {
          // Extraire le nom du fichier de l'URL
          const urlParts = memory.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const fullPath = `${user.id}/${fileName}`;

          const { error: deleteImageError } = await supabase.storage
            .from('memories')
            .remove([fullPath]);

          if (deleteImageError) {
            console.error('Erreur suppression image:', deleteImageError);
            // On continue même si l'image n'a pas pu être supprimée
          }
        } catch (imageError) {
          console.error('Erreur lors de la suppression de l\'image:', imageError);
          // On continue même si l'image n'a pas pu être supprimée
        }
      }

      // Supprimer le souvenir de la base de données
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour la liste locale
      setMemories(prev => prev.filter(memory => memory.id !== id));

      toast({
        title: "Souvenir supprimé",
        description: "Votre souvenir a été supprimé avec succès.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer votre souvenir.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  // Indexer tous les souvenirs existants (pour la migration)
  const indexAllMemories = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour indexer vos souvenirs.",
        variant: "destructive"
      });
      return { success: false, error: 'Non authentifié' };
    }

    try {
      setLoading(true);

      // Test de la clé API OpenAI
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        toast({
          title: "Erreur de configuration",
          description: "La clé API OpenAI n'est pas configurée. Vérifiez votre fichier .env",
          variant: "destructive"
        });
        return { success: false, error: 'Clé API OpenAI manquante' };
      }

      console.log('Clé API OpenAI trouvée:', apiKey.substring(0, 10) + '...');

      // Test simple de l'API OpenAI
      try {
        const testEmbedding = await embeddingService.generateEmbedding('test');
        console.log('Test OpenAI réussi, embedding généré:', testEmbedding.length, 'dimensions');
      } catch (testError) {
        console.error('Test OpenAI échoué:', testError);
        toast({
          title: "Erreur OpenAI",
          description: `Impossible de contacter OpenAI: ${testError}`,
          variant: "destructive"
        });
        return { success: false, error: `Erreur OpenAI: ${testError}` };
      }

      // Récupérer tous les souvenirs de l'utilisateur (avec any pour contourner les types)
      const { data: allMemories, error: fetchError } = await supabase
        .from('memories')
        .select('id, content, location, embedding')
        .eq('user_id', user.id) as any;

      if (fetchError) {
        console.error('Erreur lors de la récupération des souvenirs:', fetchError);
        toast({
          title: "Erreur",
          description: `Erreur de base de données: ${fetchError.message}`,
          variant: "destructive"
        });
        return { success: false, error: fetchError.message };
      }

      if (!allMemories || allMemories.length === 0) {
        toast({
          title: "Aucun souvenir trouvé",
          description: "Vous n'avez pas encore de souvenirs à indexer.",
        });
        return { success: true, count: 0 };
      }

      console.log(`Diagnostic: ${allMemories.length} souvenirs trouvés`);

      // Compter les souvenirs avec et sans embedding
      const memoriesWithEmbedding = allMemories.filter((m: any) => m.embedding !== null);
      const memoriesWithoutEmbedding = allMemories.filter((m: any) => m.embedding === null);

      console.log(`- Avec embedding: ${memoriesWithEmbedding.length}`);
      console.log(`- Sans embedding: ${memoriesWithoutEmbedding.length}`);

      if (memoriesWithoutEmbedding.length === 0) {
        toast({
          title: "Indexation terminée",
          description: `Tous vos ${allMemories.length} souvenirs sont déjà indexés.`,
        });
        return { success: true, count: 0 };
      }

      let indexedCount = 0;
      const errors: string[] = [];

      // Traiter tous les souvenirs sans embedding
      console.log(`Traitement de ${memoriesWithoutEmbedding.length} souvenirs`);

      for (const memory of memoriesWithoutEmbedding) {
        try {
          console.log(`Traitement du souvenir ${memory.id}:`, memory.content.substring(0, 50) + '...');
          const embedding = await generateEmbedding(memory.content, memory.location);
          
          if (embedding) {
            const { error: updateError } = await supabase
              .from('memories')
              .update({ embedding: `[${embedding.join(',')}]` } as any)
              .eq('id', memory.id);

            if (updateError) {
              errors.push(`Erreur pour le souvenir ${memory.id}: ${updateError.message}`);
            } else {
              indexedCount++;
              console.log(`Souvenir ${memory.id} indexé avec succès (${indexedCount}/${memoriesWithoutEmbedding.length})`);
            }
          }
        } catch (error) {
          console.error(`Erreur pour le souvenir ${memory.id}:`, error);
          errors.push(`Erreur pour le souvenir ${memory.id}: ${error}`);
        }
      }

      if (errors.length > 0) {
        console.error('Erreurs lors de l\'indexation:', errors);
      }

      toast({
        title: "Indexation terminée",
        description: `${indexedCount} souvenirs indexés avec succès sur ${memoriesWithoutEmbedding.length} traités.`,
      });

      return { success: true, count: indexedCount, errors };
    } catch (error: any) {
      console.error('Erreur lors de l\'indexation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'indexer vos souvenirs.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Charger les souvenirs au montage du composant et quand l'utilisateur change
  useEffect(() => {
    if (user && !initialized) {
      fetchMemories();
      setInitialized(true);
    } else if (!user) {
      setMemories([]);
      setInitialized(false);
    }
  }, [user, initialized]);

  const value = {
    memories,
    loading,
    saving,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    indexAllMemories
  };

  return (
    <MemoriesContext.Provider value={value}>
      {children}
    </MemoriesContext.Provider>
  );
}

export function useMemories() {
  const context = useContext(MemoriesContext);
  if (context === undefined) {
    throw new Error('useMemories must be used within a MemoriesProvider');
  }
  return context;
} 