import { 
  TravelSearchRequest, 
  TravelSearchResponse, 
  ParsedQuery, 
  SearchResult,
  SearchLog 
} from './types'
import { parseQuery, parseQuerySimple, validateFilters } from './queryParser'
import { vectorSearchService } from './vectorSearchService'
import { supabase } from '@/integrations/supabase/client'

export class TravelSearchService {
  async search(request: TravelSearchRequest): Promise<TravelSearchResponse> {
    const startTime = Date.now()
    let success = true
    let error: string | undefined

    try {
      // 1. Parser la requête
      let parsedQuery: ParsedQuery
      try {
        parsedQuery = parseQuery(request.query)
        
        // Valider les filtres extraits
        if (!validateFilters(parsedQuery.filters)) {
          console.warn('Invalid filters detected, using simple parsing')
          parsedQuery = parseQuerySimple(request.query)
        }
      } catch (parseError) {
        console.warn('Query parsing failed, using simple parsing:', parseError)
        parsedQuery = parseQuerySimple(request.query)
      }

      // 2. Fusionner les filtres utilisateur avec les filtres extraits
      const mergedFilters = this.mergeFilters(parsedQuery.filters, request.filters || {})

      // 3. Effectuer la recherche hybride
      const results = await vectorSearchService.hybridSearch(
        parsedQuery.vectorQuery,
        request.userId,
        mergedFilters,
        request.limit || 10
      )

      // 4. Trier et classer les résultats
      const rankedResults = this.rankResults(results, parsedQuery, mergedFilters)

      const processingTime = Date.now() - startTime

      // 5. Logger la recherche
      await this.logSearch({
        id: crypto.randomUUID(),
        userId: request.userId,
        query: request.query,
        parsedQuery,
        resultsCount: rankedResults.length,
        processingTime,
        timestamp: new Date().toISOString(),
        success: true
      })

      return {
        results: rankedResults,
        totalCount: rankedResults.length,
        queryAnalysis: {
          parsedQuery,
          processingTime
        }
      }

    } catch (searchError) {
      success = false
      error = searchError instanceof Error ? searchError.message : 'Unknown error'
      
      console.error('Travel search failed:', searchError)

      // Logger l'erreur
      await this.logSearch({
        id: crypto.randomUUID(),
        userId: request.userId,
        query: request.query,
        parsedQuery: parseQuerySimple(request.query),
        resultsCount: 0,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
        error
      })

      throw searchError
    }
  }

  // Fusionner les filtres extraits avec les filtres utilisateur
  private mergeFilters(extractedFilters: any, userFilters: any): any {
    const merged = { ...extractedFilters }

    // Fusionner les plages de dates
    if (userFilters.dateRange && extractedFilters.dateRange) {
      merged.dateRange = {
        start: new Date(Math.max(
          new Date(userFilters.dateRange.start).getTime(),
          new Date(extractedFilters.dateRange.start).getTime()
        )).toISOString().split('T')[0],
        end: new Date(Math.min(
          new Date(userFilters.dateRange.end).getTime(),
          new Date(extractedFilters.dateRange.end).getTime()
        )).toISOString().split('T')[0]
      }
    } else if (userFilters.dateRange) {
      merged.dateRange = userFilters.dateRange
    }

    // Fusionner les listes
    const listFields = ['locations', 'activities', 'emotions', 'tags']
    listFields.forEach(field => {
      if (userFilters[field] || extractedFilters[field]) {
        merged[field] = [
          ...(extractedFilters[field] || []),
          ...(userFilters[field] || [])
        ].filter((item, index, arr) => arr.indexOf(item) === index) // Dédupliquer
      }
    })

    return merged
  }

  // Classer les résultats par pertinence
  private rankResults(
    results: SearchResult[], 
    parsedQuery: ParsedQuery, 
    filters: any
  ): SearchResult[] {
    return results.map(result => {
      let score = result.relevanceScore

      // Bonus pour les correspondances exactes
      if (filters.dateRange && this.isDateInRange(result.memory.date, filters.dateRange)) {
        score += 0.1
      }

      if (filters.locations && this.hasLocationMatch(result.memory, filters.locations)) {
        score += 0.15
      }

      if (filters.activities && this.hasActivityMatch(result.memory, filters.activities)) {
        score += 0.1
      }

      if (filters.emotions && this.hasEmotionMatch(result.memory, filters.emotions)) {
        score += 0.1
      }

      // Bonus pour la confiance du parsing
      score *= parsedQuery.confidence

      return {
        ...result,
        relevanceScore: Math.min(score, 1.0) // Normaliser à 1.0 max
      }
    }).sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  // Vérifier si une date est dans une plage
  private isDateInRange(date: string, dateRange: { start: string; end: string }): boolean {
    const memoryDate = new Date(date)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    return memoryDate >= startDate && memoryDate <= endDate
  }

  // Vérifier si un souvenir correspond à des lieux
  private hasLocationMatch(memory: any, locations: string[]): boolean {
    if (!memory.location) return false
    return locations.some(location => 
      memory.location.toLowerCase().includes(location.toLowerCase())
    )
  }

  // Vérifier si un souvenir correspond à des activités
  private hasActivityMatch(memory: any, activities: string[]): boolean {
    return activities.some(activity => 
      memory.content.toLowerCase().includes(activity.toLowerCase())
    )
  }

  // Vérifier si un souvenir correspond à des émotions
  private hasEmotionMatch(memory: any, emotions: string[]): boolean {
    return emotions.some(emotion => 
      memory.content.toLowerCase().includes(emotion.toLowerCase())
    )
  }

  // Logger les recherches
  private async logSearch(log: SearchLog): Promise<void> {
    try {
      // Pour l'instant, on log en console
      // Plus tard, on pourra créer une table search_logs dans Supabase
      console.log('Search Log:', {
        userId: log.userId,
        query: log.query,
        resultsCount: log.resultsCount,
        processingTime: log.processingTime,
        success: log.success,
        error: log.error
      })

      // TODO: Implémenter le logging dans Supabase
      // const { error } = await supabase
      //   .from('search_logs')
      //   .insert(log)
      
      // if (error) {
      //   console.error('Failed to log search:', error)
      // }
    } catch (error) {
      console.error('Error logging search:', error)
    }
  }

  // Indexer les souvenirs existants pour un utilisateur
  async indexUserMemories(userId: string): Promise<void> {
    try {
      await vectorSearchService.indexExistingMemories(userId)
      console.log(`Successfully indexed memories for user ${userId}`)
    } catch (error) {
      console.error(`Failed to index memories for user ${userId}:`, error)
      throw error
    }
  }

  // Obtenir les statistiques de recherche pour un utilisateur
  async getSearchStats(userId: string): Promise<{
    totalSearches: number
    averageProcessingTime: number
    mostCommonQueries: string[]
  }> {
    // TODO: Implémenter avec une table search_logs
    return {
      totalSearches: 0,
      averageProcessingTime: 0,
      mostCommonQueries: []
    }
  }
}

// Instance singleton
export const travelSearchService = new TravelSearchService() 