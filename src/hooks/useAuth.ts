import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
      
      console.log("Connexion réussie !")
      return { success: true }
    } catch (error: any) {
      console.error("Erreur de connexion:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Inscription
  const signUp = async (email: string, password: string, birthDate?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            birth_date: birthDate
          }
        }
      })
      if (error) throw error
      
      console.log("Compte créé !")
      return { success: true }
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      console.log("Déconnecté")
      return { success: true }
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error.message)
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