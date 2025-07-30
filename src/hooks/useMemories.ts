import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Memory } from '@/lib/types'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'
import { embeddingService } from '@/lib/embeddingService'

interface CreateMemoryData {
  content: string
  date: string
  location?: string
  image?: File
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Récupérer tous les souvenirs de l'utilisateur
  const fetchMemories = async () => {
    if (!user) {
      setMemories([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setMemories(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des souvenirs:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos souvenirs.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Générer l'embedding pour un souvenir
  const generateEmbedding = async (content: string, location?: string): Promise<number[] | null> => {
    try {
      const textToEmbed = `${content} ${location || ''}`.trim()
      if (!textToEmbed) return null
      
      return await embeddingService.generateEmbedding(textToEmbed)
    } catch (error) {
      console.error('Erreur lors de la génération de l\'embedding:', error)
      return null
    }
  }

  // Créer un nouveau souvenir
  const createMemory = async (memoryData: CreateMemoryData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder un souvenir.",
        variant: "destructive"
      })
      return { success: false, error: 'Non authentifié' }
    }

    try {
      setSaving(true)

      // Générer l'embedding
      const embedding = await generateEmbedding(memoryData.content, memoryData.location)

      // Pour l'instant, on ignore les images (on les ajoutera plus tard)
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          content: memoryData.content,
          date: memoryData.date,
          location: memoryData.location || null,
          embedding: embedding ? `[${embedding.join(',')}]` : null
        })
        .select()
        .single()

      if (error) throw error

      // Mettre à jour la liste locale
      setMemories(prev => [data, ...prev])

      toast({
        title: "Souvenir sauvegardé !",
        description: "Votre moment précieux a été ajouté à votre journal.",
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder votre souvenir.",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    } finally {
      setSaving(false)
    }
  }

  // Mettre à jour un souvenir
  const updateMemory = async (id: string, updates: { content: string; date: string; location?: string }) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier un souvenir.",
        variant: "destructive"
      })
      return { success: false, error: 'Non authentifié' }
    }

    try {
      setSaving(true)

      // Générer le nouvel embedding
      const embedding = await generateEmbedding(updates.content, updates.location)

      const { data, error } = await supabase
        .from('memories')
        .update({
          content: updates.content,
          date: updates.date,
          location: updates.location || null,
          embedding: embedding ? `[${embedding.join(',')}]` : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Mettre à jour la liste locale
      setMemories(prev => prev.map(memory => 
        memory.id === id ? data : memory
      ))

      toast({
        title: "Souvenir mis à jour !",
        description: "Votre souvenir a été modifié avec succès.",
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour votre souvenir.",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    } finally {
      setSaving(false)
    }
  }

  // Supprimer un souvenir
  const deleteMemory = async (id: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer un souvenir.",
        variant: "destructive"
      })
      return { success: false, error: 'Non authentifié' }
    }

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Mettre à jour la liste locale
      setMemories(prev => prev.filter(memory => memory.id !== id))

      toast({
        title: "Souvenir supprimé",
        description: "Votre souvenir a été supprimé avec succès.",
      })

      return { success: true }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer votre souvenir.",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  // Indexer tous les souvenirs existants (pour la migration)
  const indexAllMemories = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour indexer vos souvenirs.",
        variant: "destructive"
      })
      return { success: false, error: 'Non authentifié' }
    }

    try {
      setLoading(true)

      // Test de la clé API OpenAI
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        toast({
          title: "Erreur de configuration",
          description: "La clé API OpenAI n'est pas configurée. Vérifiez votre fichier .env",
          variant: "destructive"
        })
        return { success: false, error: 'Clé API OpenAI manquante' }
      }

      console.log('Clé API OpenAI trouvée:', apiKey.substring(0, 10) + '...')

      // Test simple de l'API OpenAI
      try {
        const testEmbedding = await embeddingService.generateEmbedding('test')
        console.log('Test OpenAI réussi, embedding généré:', testEmbedding.length, 'dimensions')
      } catch (testError) {
        console.error('Test OpenAI échoué:', testError)
        toast({
          title: "Erreur OpenAI",
          description: `Impossible de contacter OpenAI: ${testError}`,
          variant: "destructive"
        })
        return { success: false, error: `Erreur OpenAI: ${testError}` }
      }

      // Récupérer tous les souvenirs de l'utilisateur (avec any pour contourner les types)
      const { data: allMemories, error: fetchError } = await supabase
        .from('memories')
        .select('id, content, location, embedding')
        .eq('user_id', user.id) as any

      if (fetchError) {
        console.error('Erreur lors de la récupération des souvenirs:', fetchError)
        toast({
          title: "Erreur",
          description: `Erreur de base de données: ${fetchError.message}`,
          variant: "destructive"
        })
        return { success: false, error: fetchError.message }
      }

      if (!allMemories || allMemories.length === 0) {
        toast({
          title: "Aucun souvenir trouvé",
          description: "Vous n'avez pas encore de souvenirs à indexer.",
        })
        return { success: true, count: 0 }
      }

      console.log(`Diagnostic: ${allMemories.length} souvenirs trouvés`)

      // Compter les souvenirs avec et sans embedding
      const memoriesWithEmbedding = allMemories.filter((m: any) => m.embedding !== null)
      const memoriesWithoutEmbedding = allMemories.filter((m: any) => m.embedding === null)

      console.log(`- Avec embedding: ${memoriesWithEmbedding.length}`)
      console.log(`- Sans embedding: ${memoriesWithoutEmbedding.length}`)

      if (memoriesWithoutEmbedding.length === 0) {
        toast({
          title: "Indexation terminée",
          description: `Tous vos ${allMemories.length} souvenirs sont déjà indexés.`,
        })
        return { success: true, count: 0 }
      }

      let indexedCount = 0
      const errors: string[] = []

      // Traiter tous les souvenirs sans embedding
      console.log(`Traitement de ${memoriesWithoutEmbedding.length} souvenirs`)

      for (const memory of memoriesWithoutEmbedding) {
        try {
          console.log(`Traitement du souvenir ${memory.id}:`, memory.content.substring(0, 50) + '...')
          const embedding = await generateEmbedding(memory.content, memory.location)
          
          if (embedding) {
            const { error: updateError } = await supabase
              .from('memories')
              .update({ embedding: `[${embedding.join(',')}]` } as any)
              .eq('id', memory.id)

            if (updateError) {
              errors.push(`Erreur pour le souvenir ${memory.id}: ${updateError.message}`)
            } else {
              indexedCount++
              console.log(`Souvenir ${memory.id} indexé avec succès (${indexedCount}/${memoriesWithoutEmbedding.length})`)
            }
          }
        } catch (error) {
          console.error(`Erreur pour le souvenir ${memory.id}:`, error)
          errors.push(`Erreur pour le souvenir ${memory.id}: ${error}`)
        }
      }

      if (errors.length > 0) {
        console.error('Erreurs lors de l\'indexation:', errors)
      }

      toast({
        title: "Indexation terminée",
        description: `${indexedCount} souvenirs indexés avec succès sur ${memoriesWithoutEmbedding.length} traités.`,
      })

      return { success: true, count: indexedCount, errors }
    } catch (error: any) {
      console.error('Erreur lors de l\'indexation:', error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'indexer vos souvenirs.",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Charger les souvenirs au montage du composant
  useEffect(() => {
    fetchMemories()
  }, [user])

  return {
    memories,
    loading,
    saving,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    indexAllMemories
  }
}