import { Memory, SearchResult } from './types'
import { queryParser } from './queryParser'
import { llmService } from './llmService'

export interface NarrativeResponse {
  answer: string
  sources: Memory[]
  queryType: 'count' | 'narrative' | 'summary' | 'list'
  confidence: number
  processingTime: number
  model?: string
  llmUsed?: boolean
}

export class NarrativeService {
  // Générer une réponse narrative basée sur les souvenirs trouvés
  async generateNarrativeAnswer(
    query: string,
    searchResults: SearchResult[],
    userId: string
  ): Promise<NarrativeResponse> {
    const startTime = Date.now()
    
    try {
      // Parser la requête pour comprendre l'intention
      const parsedQuery = queryParser.parseQuery(query)
      const queryType = this.determineQueryType(query)
      
      // Extraire les souvenirs sources
      const sources = searchResults.map(result => result.memory)
      
      // Essayer d'utiliser le LLM si disponible, sinon utiliser les templates
      let answer: string
      let model: string | undefined
      let llmUsed = false
      
      if (sources.length === 0) {
        answer = this.generateNoResultsAnswer(query)
      } else if (llmService.isAvailable()) {
        try {
          console.log('🤖 Utilisation du LLM pour générer la réponse')
          const llmResponse = await llmService.generateNarrativeResponse(query, sources, queryType)
          answer = llmResponse.answer
          model = llmResponse.model
          llmUsed = true
        } catch (error) {
          console.warn('⚠️ Erreur LLM, fallback vers templates:', error)
          answer = this.generateTemplateAnswer(query, sources, parsedQuery, queryType)
        }
      } else {
        console.log('📝 Utilisation des templates (LLM non disponible)')
        answer = this.generateTemplateAnswer(query, sources, parsedQuery, queryType)
      }
      
      const processingTime = Date.now() - startTime
      
      return {
        answer,
        sources,
        queryType,
        confidence: parsedQuery.confidence,
        processingTime,
        model,
        llmUsed
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse narrative:', error)
      
             return {
         answer: "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler votre question ?",
         sources: [],
         queryType: 'list',
         confidence: 0,
         processingTime: Date.now() - startTime,
         llmUsed: false
       }
    }
  }
  
  private determineQueryType(query: string): 'count' | 'narrative' | 'summary' | 'list' {
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('combien') || queryLower.includes('fois') || queryLower.includes('nombre')) {
      return 'count'
    } else if (queryLower.includes('raconte') || queryLower.includes('histoire') || queryLower.includes('moment')) {
      return 'narrative'
    } else if (queryLower.includes('résume') || queryLower.includes('synthèse') || queryLower.includes('résumé')) {
      return 'summary'
    } else {
      return 'list'
    }
  }
  
  private generateNoResultsAnswer(query: string): string {
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('combien') || queryLower.includes('fois')) {
      return "Je n'ai trouvé aucun souvenir correspondant à votre demande. Il est possible que vous n'ayez pas encore enregistré de souvenirs sur ce sujet."
    } else if (queryLower.includes('raconte')) {
      return "Je n'ai pas trouvé de souvenirs à raconter pour cette demande. Peut-être pourriez-vous essayer avec une période ou un lieu différent ?"
    } else {
      return "Je n'ai trouvé aucun souvenir correspondant à votre recherche. Essayez peut-être avec des mots-clés différents ou une période plus large."
    }
  }
  
  private generateTemplateAnswer(query: string, sources: Memory[], parsedQuery: any, queryType: string): string {
    switch (queryType) {
      case 'count':
        return this.generateCountAnswer(query, sources, parsedQuery)
      case 'narrative':
        return this.generateNarrativeStory(query, sources, parsedQuery)
      case 'summary':
        return this.generateSummaryAnswer(query, sources, parsedQuery)
      case 'list':
      default:
        return this.generateListAnswer(query, sources, parsedQuery)
    }
  }

  private generateCountAnswer(query: string, sources: Memory[], parsedQuery: any): string {
    const count = sources.length
    const queryLower = query.toLowerCase()
    
    // Extraire le sujet de la question
    let subject = "souvenirs"
    if (queryLower.includes('bar')) subject = "fois où tu es allé au bar"
    else if (queryLower.includes('restaurant')) subject = "fois où tu es allé au restaurant"
    else if (queryLower.includes('voyage')) subject = "voyages"
    else if (queryLower.includes('cinéma')) subject = "fois où tu es allé au cinéma"
    else if (queryLower.includes('concert')) subject = "concerts"
    else if (queryLower.includes('musée')) subject = "visites de musées"
    
    // Extraire la période si présente
    let period = ""
    if (parsedQuery.filters.dateRange) {
      const startYear = new Date(parsedQuery.filters.dateRange.start).getFullYear()
      const endYear = new Date(parsedQuery.filters.dateRange.end).getFullYear()
      if (startYear === endYear) {
        period = ` en ${startYear}`
      } else {
        period = ` entre ${startYear} et ${endYear}`
      }
    }
    
    if (count === 0) {
      return `Tu n'as pas encore enregistré de ${subject}${period}.`
    } else if (count === 1) {
      return `Tu as enregistré 1 ${subject}${period}.`
    } else {
      return `Tu as enregistré ${count} ${subject}${period}.`
    }
  }
  
  private generateNarrativeStory(query: string, sources: Memory[], parsedQuery: any): string {
    if (sources.length === 0) {
      return "Je n'ai pas trouvé de souvenirs à raconter pour cette demande."
    }
    
    // Trier les souvenirs par date
    const sortedSources = [...sources].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Extraire les informations principales
    const locations = [...new Set(sortedSources.map(s => s.location).filter(Boolean))]
    const dateRange = this.getDateRange(sortedSources)
    
    let narrative = ""
    
    // Commencer par une introduction
    if (locations.length > 0) {
      narrative += `Tu as passé du temps ${locations.length === 1 ? `à ${locations[0]}` : `dans plusieurs endroits : ${locations.join(', ')}`}`
    }
    
    if (dateRange) {
      narrative += ` ${dateRange}. `
    } else {
      narrative += ". "
    }
    
    // Ajouter quelques détails des souvenirs les plus récents
    const recentMemories = sortedSources.slice(-3) // 3 plus récents
    const memoryDetails = recentMemories.map(memory => {
      const date = new Date(memory.date).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      })
      return `le ${date}${memory.location ? ` à ${memory.location}` : ''} : ${memory.content.substring(0, 100)}${memory.content.length > 100 ? '...' : ''}`
    })
    
    if (memoryDetails.length > 0) {
      narrative += `Voici quelques moments marquants : ${memoryDetails.join(' ; ')}.`
    }
    
    return narrative
  }
  
  private generateSummaryAnswer(query: string, sources: Memory[], parsedQuery: any): string {
    if (sources.length === 0) {
      return "Je n'ai pas trouvé de souvenirs à résumer pour cette demande."
    }
    
    // Trier par date
    const sortedSources = [...sources].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Extraire les thèmes principaux
    const themes = this.extractThemes(sortedSources)
    const dateRange = this.getDateRange(sortedSources)
    
    let summary = `Résumé de tes souvenirs`
    if (dateRange) {
      summary += ` ${dateRange}`
    }
    summary += ` : `
    
    // Ajouter les thèmes principaux
    if (themes.length > 0) {
      summary += `Tu as principalement vécu des moments liés à ${themes.join(', ')}. `
    }
    
    // Ajouter le nombre total de souvenirs
    summary += `Tu as enregistré ${sources.length} souvenir${sources.length > 1 ? 's' : ''} sur cette période.`
    
    return summary
  }
  
  private generateListAnswer(query: string, sources: Memory[], parsedQuery: any): string {
    if (sources.length === 0) {
      return "Je n'ai trouvé aucun souvenir correspondant à votre recherche."
    }
    
    // Trier par pertinence (les sources sont déjà triées par le service de recherche)
    const topSources = sources.slice(0, 5) // Limiter à 5 résultats
    
    let answer = `J'ai trouvé ${sources.length} souvenir${sources.length > 1 ? 's' : ''} correspondant à votre recherche. `
    
    if (topSources.length > 0) {
      answer += `Voici les plus pertinents : `
      
      const memoryList = topSources.map((memory, index) => {
        const date = new Date(memory.date).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        })
        return `${index + 1}. Le ${date}${memory.location ? ` à ${memory.location}` : ''} : ${memory.content.substring(0, 80)}${memory.content.length > 80 ? '...' : ''}`
      })
      
      answer += memoryList.join(' ')
    }
    
    return answer
  }
  
  private getDateRange(sources: Memory[]): string | null {
    if (sources.length === 0) return null
    
    const dates = sources.map(s => new Date(s.date))
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
    
    const minYear = minDate.getFullYear()
    const maxYear = maxDate.getFullYear()
    
    if (minYear === maxYear) {
      return `en ${minYear}`
    } else {
      return `entre ${minYear} et ${maxYear}`
    }
  }
  
  private extractThemes(sources: Memory[]): string[] {
    const themes: { [key: string]: number } = {}
    
    const themeKeywords = {
      'voyage': ['voyage', 'vacances', 'découverte', 'exploration', 'visite'],
      'gastronomie': ['restaurant', 'manger', 'cuisine', 'plat', 'dîner', 'déjeuner'],
      'culture': ['musée', 'exposition', 'concert', 'théâtre', 'cinéma', 'festival'],
      'sport': ['sport', 'course', 'vélo', 'randonnée', 'ski', 'plage', 'piscine'],
      'social': ['ami', 'famille', 'fête', 'anniversaire', 'mariage', 'célébration'],
      'travail': ['travail', 'bureau', 'réunion', 'formation', 'conférence', 'projet']
    }
    
    sources.forEach(source => {
      const contentLower = source.content.toLowerCase()
      
      for (const [theme, keywords] of Object.entries(themeKeywords)) {
        if (keywords.some(keyword => contentLower.includes(keyword))) {
          themes[theme] = (themes[theme] || 0) + 1
        }
      }
    })
    
    // Retourner les thèmes les plus fréquents
    return Object.entries(themes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme)
  }
}

export const narrativeService = new NarrativeService() 