import { ParsedQuery, QueryFilters } from './types'

export class QueryParser {
  // Analyser une requête utilisateur pour extraire les filtres et intentions
  parseQuery(query: string): ParsedQuery {
    const originalQuery = query.trim()
    const queryLower = originalQuery.toLowerCase()
    
    // Extraire les filtres de date
    const dateFilters = this.extractDateFilters(queryLower)
    
    // Extraire les lieux
    const locations = this.extractLocations(queryLower)
    
    // Extraire les saisons
    const seasons = this.extractSeasons(queryLower)
    
    // Extraire les activités/émotions
    const activities = this.extractActivities(queryLower)
    const emotions = this.extractEmotions(queryLower)
    
    // Déterminer le type de requête
    const queryType = this.determineQueryType(queryLower)
    
    // Créer les filtres
    const filters: QueryFilters = {
      ...(dateFilters && { dateRange: dateFilters }),
      ...(locations.length > 0 && { locations }),
      ...(seasons.length > 0 && { seasons }),
      ...(activities.length > 0 && { activities }),
      ...(emotions.length > 0 && { emotions })
    }
    
    // Créer la requête vectorielle (sans les mots de filtrage)
    const vectorQuery = this.createVectorQuery(originalQuery, filters)
    
    // Calculer la confiance (basique pour l'instant)
    const confidence = this.calculateConfidence(filters, queryType)
    
    return {
      originalQuery,
      filters,
      vectorQuery,
      confidence
    }
  }
  
  private extractDateFilters(query: string): { start: string; end: string } | null {
    const datePatterns = [
      // Années spécifiques
      { pattern: /(\d{4})/g, type: 'year' },
      // Mois
      { pattern: /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/g, type: 'month' },
      // Expressions temporelles
      { pattern: /(cette année|cette semaine|ce mois|l'année dernière|l'été dernier|l'hiver dernier)/g, type: 'relative' },
      // Périodes
      { pattern: /(en mai|en juin|en juillet|en août|en septembre|en octobre|en novembre|en décembre)/g, type: 'month' }
    ]
    
    let startDate: string | null = null
    let endDate: string | null = null
    
    for (const { pattern, type } of datePatterns) {
      const matches = query.match(pattern)
      if (matches) {
        if (type === 'year') {
          const year = matches[0]
          startDate = `${year}-01-01`
          endDate = `${year}-12-31`
        } else if (type === 'month') {
          const monthMap: { [key: string]: string } = {
            'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
            'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
            'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
          }
          
          const currentYear = new Date().getFullYear()
          const month = monthMap[matches[0].replace('en ', '')]
          if (month) {
            startDate = `${currentYear}-${month}-01`
            endDate = `${currentYear}-${month}-31`
          }
        } else if (type === 'relative') {
          const now = new Date()
          if (matches[0].includes('année')) {
            startDate = `${now.getFullYear()}-01-01`
            endDate = `${now.getFullYear()}-12-31`
          } else if (matches[0].includes('mois')) {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            startDate = firstDay.toISOString().split('T')[0]
            endDate = lastDay.toISOString().split('T')[0]
          }
        }
        break
      }
    }
    
    return startDate && endDate ? { start: startDate, end: endDate } : null
  }
  
  private extractLocations(query: string): string[] {
    const locationPatterns = [
      /(paris|lyon|marseille|bordeaux|toulouse|nice|nantes|strasbourg|montpellier|rennes)/g,
      /(lisbonne|rome|madrid|barcelone|londres|berlin|amsterdam|prague|budapest|vienne)/g,
      /(new york|los angeles|san francisco|chicago|miami|las vegas|seattle|boston)/g,
      /(tokyo|kyoto|osaka|séoul|singapour|hong kong|bangkok|hanoi|ho chi minh)/g
    ]
    
    const locations: string[] = []
    
    for (const pattern of locationPatterns) {
      const matches = query.match(pattern)
      if (matches) {
        locations.push(...matches.map(m => m.charAt(0).toUpperCase() + m.slice(1)))
      }
    }
    
    return [...new Set(locations)] // Supprimer les doublons
  }
  
  private extractSeasons(query: string): string[] {
    const seasons = ['printemps', 'été', 'automne', 'hiver']
    return seasons.filter(season => query.includes(season))
  }
  
  private extractActivities(query: string): string[] {
    const activities = [
      'voyage', 'restaurant', 'cinéma', 'théâtre', 'concert', 'musée', 'exposition',
      'sport', 'course', 'vélo', 'randonnée', 'ski', 'plage', 'piscine',
      'café', 'bar', 'club', 'fête', 'anniversaire', 'mariage',
      'travail', 'bureau', 'réunion', 'formation', 'conférence'
    ]
    
    return activities.filter(activity => query.includes(activity))
  }
  
  private extractEmotions(query: string): string[] {
    const emotions = [
      'heureux', 'joyeux', 'content', 'satisfait', 'épanoui',
      'triste', 'déprimé', 'mélancolique', 'nostalgique',
      'stressé', 'anxieux', 'inquiet', 'nerveux',
      'excité', 'enthousiaste', 'passionné', 'inspiré',
      'calme', 'serein', 'paisible', 'détendu'
    ]
    
    return emotions.filter(emotion => query.includes(emotion))
  }
  
  private determineQueryType(query: string): 'count' | 'narrative' | 'summary' | 'list' {
    if (query.includes('combien') || query.includes('fois') || query.includes('nombre')) {
      return 'count'
    } else if (query.includes('raconte') || query.includes('histoire') || query.includes('moment')) {
      return 'narrative'
    } else if (query.includes('résume') || query.includes('synthèse') || query.includes('résumé')) {
      return 'summary'
    } else {
      return 'list'
    }
  }
  
  private createVectorQuery(originalQuery: string, filters: QueryFilters): string {
    // Supprimer les mots de filtrage pour créer une requête vectorielle plus pure
    let vectorQuery = originalQuery
    
    // Supprimer les mots de date
    vectorQuery = vectorQuery.replace(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/gi, '')
    vectorQuery = vectorQuery.replace(/\b(\d{4})\b/g, '')
    vectorQuery = vectorQuery.replace(/\b(cette année|cette semaine|ce mois|l'année dernière|l'été dernier|l'hiver dernier)\b/gi, '')
    
    // Supprimer les mots de comptage
    vectorQuery = vectorQuery.replace(/\b(combien|fois|nombre)\b/gi, '')
    
    // Nettoyer les espaces multiples
    vectorQuery = vectorQuery.replace(/\s+/g, ' ').trim()
    
    return vectorQuery || originalQuery
  }
  
  private calculateConfidence(filters: QueryFilters, queryType: string): number {
    let confidence = 0.5 // Base
    
    // Bonus pour les filtres de date
    if (filters.dateRange) confidence += 0.2
    
    // Bonus pour les lieux
    if (filters.locations && filters.locations.length > 0) confidence += 0.15
    
    // Bonus pour les saisons
    if (filters.seasons && filters.seasons.length > 0) confidence += 0.1
    
    // Bonus pour les activités/émotions
    if (filters.activities && filters.activities.length > 0) confidence += 0.1
    if (filters.emotions && filters.emotions.length > 0) confidence += 0.1
    
    // Bonus pour le type de requête spécifique
    if (queryType === 'count') confidence += 0.1
    if (queryType === 'narrative') confidence += 0.15
    
    return Math.min(confidence, 1.0)
  }
}

export const queryParser = new QueryParser() 