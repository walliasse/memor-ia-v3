import { ParsedQuery, QueryFilters } from './types'

// Mots-clés pour les saisons
const SEASON_KEYWORDS = {
  'printemps': { start: '03-21', end: '06-20' },
  'été': { start: '06-21', end: '09-22' },
  'automne': { start: '09-23', end: '12-20' },
  'hiver': { start: '12-21', end: '03-20' },
  'spring': { start: '03-21', end: '06-20' },
  'summer': { start: '06-21', end: '09-22' },
  'fall': { start: '09-23', end: '12-20' },
  'autumn': { start: '09-23', end: '12-20' },
  'winter': { start: '12-21', end: '03-20' }
}

// Mots-clés pour les lieux flous
const FUZZY_LOCATIONS = {
  'le sud': ['sud de la france', 'provence', 'languedoc', 'côte d\'azur'],
  'le nord': ['nord de la france', 'hauts-de-france', 'normandie'],
  'l\'est': ['est de la france', 'alsace', 'lorraine', 'bourgogne'],
  'l\'ouest': ['ouest de la france', 'bretagne', 'pays de la loire'],
  'paris': ['paris', 'île-de-france'],
  'la montagne': ['alpes', 'pyrennées', 'massif central', 'jura'],
  'la mer': ['côte atlantique', 'côte méditerranéenne', 'bretagne', 'normandie'],
  'la campagne': ['rural', 'village', 'campagne']
}

// Mots-clés pour les activités
const ACTIVITY_KEYWORDS = [
  'voyage', 'vacances', 'weekend', 'excursion', 'randonnée', 'plage', 'ski',
  'restaurant', 'musée', 'concert', 'festival', 'sport', 'nager', 'manger',
  'visiter', 'découvrir', 'explorer', 'se promener', 'faire du shopping'
]

// Mots-clés pour les émotions
const EMOTION_KEYWORDS = [
  'joie', 'bonheur', 'excitation', 'sérénité', 'nostalgie', 'tristesse',
  'colère', 'peur', 'surprise', 'amour', 'amitié', 'inspiration'
]

export function parseQuery(query: string): ParsedQuery {
  const originalQuery = query.toLowerCase().trim()
  const filters: QueryFilters = {}
  let vectorQuery = originalQuery
  let confidence = 1.0

  // Extraction des années
  const yearMatches = originalQuery.match(/(\d{4})/g)
  if (yearMatches) {
    const year = parseInt(yearMatches[0])
    filters.dateRange = {
      start: `${year}-01-01`,
      end: `${year}-12-31`
    }
    vectorQuery = vectorQuery.replace(/\d{4}/g, '')
  }

  // Extraction des saisons
  const seasons: string[] = []
  for (const [season, dates] of Object.entries(SEASON_KEYWORDS)) {
    if (originalQuery.includes(season)) {
      seasons.push(season)
      if (yearMatches && filters.dateRange) {
        const year = parseInt(yearMatches[0])
        filters.dateRange.start = `${year}-${dates.start}`
        filters.dateRange.end = `${year}-${dates.end}`
      }
      vectorQuery = vectorQuery.replace(new RegExp(season, 'g'), '')
    }
  }
  if (seasons.length > 0) {
    filters.seasons = seasons
  }

  // Extraction des lieux
  const locations: string[] = []
  
  // Lieux flous
  for (const [fuzzyLocation, expandedLocations] of Object.entries(FUZZY_LOCATIONS)) {
    if (originalQuery.includes(fuzzyLocation)) {
      locations.push(...expandedLocations)
      vectorQuery = vectorQuery.replace(fuzzyLocation, '')
    }
  }

  // Lieux spécifiques (mots avec majuscules ou après "à", "dans", "sur")
  const locationPatterns = [
    /(?:à|dans|sur)\s+([a-zA-ZÀ-ÿ\s]+?)(?:\s|$)/g,
    /([A-Z][a-zA-ZÀ-ÿ\s]+?)(?:\s|$)/g
  ]

  for (const pattern of locationPatterns) {
    const matches = [...originalQuery.matchAll(pattern)]
    for (const match of matches) {
      const location = match[1]?.trim()
      if (location && location.length > 2 && !locations.includes(location)) {
        locations.push(location)
      }
    }
  }

  if (locations.length > 0) {
    filters.locations = locations
  }

  // Extraction des activités
  const activities: string[] = []
  for (const activity of ACTIVITY_KEYWORDS) {
    if (originalQuery.includes(activity)) {
      activities.push(activity)
      vectorQuery = vectorQuery.replace(new RegExp(activity, 'g'), '')
    }
  }
  if (activities.length > 0) {
    filters.activities = activities
  }

  // Extraction des émotions
  const emotions: string[] = []
  for (const emotion of EMOTION_KEYWORDS) {
    if (originalQuery.includes(emotion)) {
      emotions.push(emotion)
      vectorQuery = vectorQuery.replace(new RegExp(emotion, 'g'), '')
    }
  }
  if (emotions.length > 0) {
    filters.emotions = emotions
  }

  // Nettoyage de la requête vectorielle
  vectorQuery = vectorQuery
    .replace(/\s+/g, ' ')
    .trim()

  // Si la requête vectorielle est vide, utiliser la requête originale
  if (!vectorQuery) {
    vectorQuery = originalQuery
    confidence = 0.8 // Moins de confiance car parsing incomplet
  }

  return {
    originalQuery: query,
    filters,
    vectorQuery,
    confidence
  }
}

// Fonction de fallback pour parsing simple
export function parseQuerySimple(query: string): ParsedQuery {
  return {
    originalQuery: query,
    filters: {},
    vectorQuery: query,
    confidence: 0.5
  }
}

// Fonction pour valider les filtres extraits
export function validateFilters(filters: QueryFilters): boolean {
  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start)
    const end = new Date(filters.dateRange.end)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return false
    }
  }
  return true
} 