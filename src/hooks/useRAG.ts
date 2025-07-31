import { useState, useCallback } from 'react'
import { ragService, RAGResponse } from '@/lib/ragService'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

export function useRAG() {
  const [loading, setLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState<RAGResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  // Traiter une requête RAG complète
  const processQuery = useCallback(async (
    query: string,
    limit: number = 10
  ): Promise<RAGResponse | null> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour utiliser cette fonctionnalité.",
        variant: "destructive"
      })
      return null
    }

    // Valider la requête
    const validation = ragService.validateQuery(query)
    if (!validation.isValid) {
      toast({
        title: "Requête invalide",
        description: validation.error || "Veuillez reformuler votre question.",
        variant: "destructive"
      })
      return null
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 Traitement de la requête RAG:', query)
      
      const response = await ragService.processQuery(query, user.id, limit)
      
      setLastResponse(response)
      
      // Afficher un toast de succès si des résultats sont trouvés
      if (response.sources.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${response.sources.length} souvenir${response.sources.length > 1 ? 's' : ''} trouvé${response.sources.length > 1 ? 's' : ''} en ${response.queryAnalysis.processingTime}ms`,
        })
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucun souvenir trouvé correspondant à votre demande.",
          variant: "destructive"
        })
      }

      return response

    } catch (err: any) {
      console.error('Erreur lors du traitement RAG:', err)
      
      const errorMessage = err.message || "Une erreur s'est produite lors du traitement de votre demande."
      setError(errorMessage)
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })

      return null
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setLastResponse(null)
    setError(null)
    setLoading(false)
  }, [])

  // Obtenir des statistiques de recherche
  const getSearchStats = useCallback(async () => {
    if (!user) return null

    try {
      return await ragService.getSearchStats(user.id)
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err)
      return null
    }
  }, [user])

  return {
    loading,
    lastResponse,
    error,
    processQuery,
    reset,
    getSearchStats
  }
} 