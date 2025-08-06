import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Profile } from '@/lib/types'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Récupérer le profil utilisateur
  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

      if (data) {
        setProfile(data)
      } else {
        // Créer un profil par défaut si n'existe pas
        await createProfile()
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    } finally {
      setLoading(false)
    }
  }

  // Créer un profil par défaut
  const createProfile = async () => {
    if (!user) return

    try {
      // Récupérer la date de naissance depuis les metadata de l'utilisateur
      const birthDate = user.user_metadata?.birth_date || '1990-01-01'
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || null,
          birth_date: birthDate
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error)
    }
  }

  // Mettre à jour le profil
  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) return { success: false, error: 'Profil non trouvé' }

    try {
      setSaving(true)
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)

      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été sauvegardées.",
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive"
      })
      return { success: false, error: error.message }
    } finally {
      setSaving(false)
    }
  }

  // Charger le profil au montage et quand l'utilisateur change
  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    saving,
    updateProfile,
    refetch: fetchProfile
  }
} 