import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Connexion avec email (simple pour commencer)
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue dans votre journal.",
      })
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  // Inscription
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      
      toast({
        title: "Compte créé !",
        description: "Vérifiez votre email pour confirmer votre compte.",
      })
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Déconnecté",
        description: "À bientôt !",
      })
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUp,
    signOut
  }
} 