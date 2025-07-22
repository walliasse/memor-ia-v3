import { useState, useEffect } from 'react'
import { supabase, Memory } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

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

      // Pour l'instant, on ignore les images (on les ajoutera plus tard)
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          content: memoryData.content,
          date: memoryData.date,
          location: memoryData.location || null
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

  // Charger les souvenirs au montage et quand l'utilisateur change
  useEffect(() => {
    fetchMemories()
  }, [user])

  return {
    memories,
    loading,
    saving,
    createMemory,
    refetch: fetchMemories
  }
} 