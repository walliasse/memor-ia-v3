import { vectorSearchService } from './vectorSearchService'
import { narrativeService, NarrativeResponse } from './narrativeService'
import { queryParser } from './queryParser'
import { SearchResult, ParsedQuery } from './types'

export interface RAGResponse {
  answer: string
  sources: any[]
  queryAnalysis: {
    parsedQuery: ParsedQuery
    processingTime: number
    searchResultsCount: number
  }
  narrativeResponse: NarrativeResponse
}

export class RAGService {
  // Méthode principale pour traiter une requête RAG complète
  async processQuery(
    query: string,
    userId: string,
    limit: number = 10
  ): Promise<RAGResponse> {
    const startTime = Date.now()
    
    try {
      console.log('🚀 Début du traitement RAG pour:', query)
      
      // 1️⃣ Parser la requête utilisateur
      const parsedQuery = queryParser.parseQuery(query)
      console.log('📝 Requête parsée:', parsedQuery)
      
      // 2️⃣ Effectuer la recherche vectorielle avec filtres
      const searchResults = await this.getRelevantMemories(
        parsedQuery.vectorQuery,
        userId,
        parsedQuery.filters,
        limit
      )
      console.log(`🔍 ${searchResults.length} souvenirs trouvés`)
      
      // 3️⃣ Générer la réponse narrative
      const narrativeResponse = await narrativeService.generateNarrativeAnswer(
        query,
        searchResults,
        userId
      )
      console.log('✨ Réponse narrative générée')
      
      const processingTime = Date.now() - startTime
      
      return {
        answer: narrativeResponse.answer,
        sources: searchResults.map(result => result.memory),
        queryAnalysis: {
          parsedQuery,
          processingTime,
          searchResultsCount: searchResults.length
        },
        narrativeResponse
      }
      
    } catch (error) {
      console.error('❌ Erreur dans le traitement RAG:', error)
      
      const processingTime = Date.now() - startTime
      
      return {
        answer: "Désolé, je n'ai pas pu traiter votre demande. Une erreur s'est produite.",
        sources: [],
        queryAnalysis: {
          parsedQuery: {
            originalQuery: query,
            filters: {},
            vectorQuery: query,
            confidence: 0
          },
          processingTime,
          searchResultsCount: 0
        },
        narrativeResponse: {
          answer: "Erreur de traitement",
          sources: [],
          queryType: 'list',
          confidence: 0,
          processingTime
        }
      }
    }
  }
  
  // Recherche hybride avec filtres
  private async getRelevantMemories(
    query: string,
    userId: string,
    filters: any,
    limit: number
  ): Promise<SearchResult[]> {
    try {
      // Recherche vectorielle de base
      let searchResults = await vectorSearchService.searchMemories(
        query,
        userId,
        filters,
        limit * 2 // Récupérer plus de résultats pour le filtrage
      )
      
      // Appliquer les filtres supplémentaires
      searchResults = this.applyFilters(searchResults, filters)
      
      // Limiter les résultats finaux
      return searchResults.slice(0, limit)
      
    } catch (error) {
      console.error('Erreur lors de la recherche de souvenirs:', error)
      return []
    }
  }
  
  // Appliquer les filtres supplémentaires
  private applyFilters(searchResults: SearchResult[], filters: any): SearchResult[] {
    if (!filters || Object.keys(filters).length === 0) {
      return searchResults
    }
    
    return searchResults.filter(result => {
      const memory = result.memory
      
      // Filtre par date
      if (filters.dateRange) {
        const memoryDate = new Date(memory.date)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        
        if (memoryDate < startDate || memoryDate > endDate) {
          return false
        }
      }
      
      // Filtre par lieu
      if (filters.locations && filters.locations.length > 0) {
        if (!memory.location || !filters.locations.some((loc: string) => 
          memory.location?.toLowerCase().includes(loc.toLowerCase())
        )) {
          return false
        }
      }
      
      // Filtre par saison
      if (filters.seasons && filters.seasons.length > 0) {
        const memoryDate = new Date(memory.date)
        const month = memoryDate.getMonth() + 1
        
        const seasonMonths = {
          'printemps': [3, 4, 5],
          'été': [6, 7, 8],
          'automne': [9, 10, 11],
          'hiver': [12, 1, 2]
        }
        
        const memorySeason = Object.entries(seasonMonths).find(([, months]) => 
          months.includes(month)
        )?.[0]
        
        if (!memorySeason || !filters.seasons.includes(memorySeason)) {
          return false
        }
      }
      
      // Filtre par activités
      if (filters.activities && filters.activities.length > 0) {
        const contentLower = memory.content.toLowerCase()
        if (!filters.activities.some((activity: string) => 
          contentLower.includes(activity.toLowerCase())
        )) {
          return false
        }
      }
      
      // Filtre par émotions
      if (filters.emotions && filters.emotions.length > 0) {
        const contentLower = memory.content.toLowerCase()
        if (!filters.emotions.some((emotion: string) => 
          contentLower.includes(emotion.toLowerCase())
        )) {
          return false
        }
      }
      
      return true
    })
  }
  
  // Méthode pour obtenir des statistiques de recherche
  async getSearchStats(userId: string): Promise<{
    totalMemories: number
    indexedMemories: number
    averageRelevanceScore: number
  }> {
    try {
      // Cette méthode pourrait être étendue pour récupérer des statistiques
      // depuis la base de données ou le cache
      return {
        totalMemories: 0,
        indexedMemories: 0,
        averageRelevanceScore: 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        totalMemories: 0,
        indexedMemories: 0,
        averageRelevanceScore: 0
      }
    }
  }
  
  // Méthode pour valider une requête
  validateQuery(query: string): { isValid: boolean; error?: string } {
    if (!query || query.trim().length === 0) {
      return { isValid: false, error: "La requête ne peut pas être vide" }
    }
    
    if (query.trim().length < 3) {
      return { isValid: false, error: "La requête doit contenir au moins 3 caractères" }
    }
    
    if (query.trim().length > 500) {
      return { isValid: false, error: "La requête est trop longue (max 500 caractères)" }
    }
    
    return { isValid: true }
  }
}

export const ragService = new RAGService() 