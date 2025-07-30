// Types pour les données
export interface Memory {
  id: string
  user_id: string
  content: string
  date: string
  location?: string
  image_url?: string
  created_at: string
  updated_at: string
  embedding?: number[]
}

export interface Profile {
  id: string
  email: string
  name?: string
  bio?: string
  created_at: string
  updated_at: string
}

// Types pour la fonctionnalité Travel
export interface ParsedQuery {
  originalQuery: string
  filters: QueryFilters
  vectorQuery: string
  confidence: number
}

export interface QueryFilters {
  dateRange?: {
    start: string
    end: string
  }
  locations?: string[]
  seasons?: string[]
  activities?: string[]
  emotions?: string[]
  tags?: string[]
}

export interface SearchResult {
  memory: Memory
  relevanceScore: number
  matchReason: string
  highlightedContent?: string
}

export interface TravelSearchRequest {
  query: string
  userId: string
  limit?: number
  filters?: Partial<QueryFilters>
}

export interface TravelSearchResponse {
  results: SearchResult[]
  totalCount: number
  queryAnalysis: {
    parsedQuery: ParsedQuery
    processingTime: number
  }
}

// Types pour les embeddings
export interface EmbeddingRequest {
  text: string
  model?: string
}

export interface EmbeddingResponse {
  object: string
  data: Array<{
    object: string
    embedding: number[]
    index: number
  }>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

// Types pour les logs
export interface SearchLog {
  id: string
  userId: string
  query: string
  parsedQuery: ParsedQuery
  resultsCount: number
  processingTime: number
  timestamp: string
  success: boolean
  error?: string
}