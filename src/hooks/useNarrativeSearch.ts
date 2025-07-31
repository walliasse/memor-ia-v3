import { useState, useCallback } from 'react'
import { travelSearchService } from '@/lib/travelSearchService'
import { TravelSearchRequest, TravelSearchResponse, SearchResult } from '@/lib/types'
import { useAuth } from './useAuth'

export function useTravelSearch() {
  const { user } = useAuth()
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<string>('')
  const [queryAnalysis, setQueryAnalysis] = useState<any>(null)

  const search = useCallback(async (
    query: string, 
    filters?: any, 
    limit: number = 10
  ) => {
    if (!user?.id) {
      setError('Utilisateur non connecté')
      return
    }

    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setLastQuery(query)

    try {
      const request: TravelSearchRequest = {
        query: query.trim(),
        userId: user.id,
        limit,
        filters
      }

      const response: TravelSearchResponse = await travelSearchService.search(request)
      
      setResults(response.results)
      setQueryAnalysis(response.queryAnalysis)
      
      if (response.results.length === 0) {
        setError('Aucun souvenir trouvé pour cette recherche')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche'
      setError(errorMessage)
      setResults([])
      console.error('Travel search error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
    setLastQuery('')
    setQueryAnalysis(null)
  }, [])

  const indexUserMemories = useCallback(async () => {
    if (!user?.id) {
      setError('Utilisateur non connecté')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await travelSearchService.indexUserMemories(user.id)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'indexation'
      setError(errorMessage)
      console.error('Indexing error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const getSearchStats = useCallback(async () => {
    if (!user?.id) {
      return null
    }

    try {
      return await travelSearchService.getSearchStats(user.id)
    } catch (err) {
      console.error('Error getting search stats:', err)
      return null
    }
  }, [user?.id])

  return {
    // État
    results,
    isLoading,
    error,
    lastQuery,
    queryAnalysis,
    
    // Actions
    search,
    clearResults,
    indexUserMemories,
    getSearchStats,
    
    // Utilitaires
    hasResults: results.length > 0,
    totalResults: results.length
  }
} 