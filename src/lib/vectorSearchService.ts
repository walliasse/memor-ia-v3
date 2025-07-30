import { supabase } from '@/integrations/supabase/client'
import { Memory, QueryFilters, SearchResult } from './types'
import { embeddingService } from './embeddingService'

export class VectorSearchService {
  // Recherche simple qui fonctionne à coup sûr
  async searchMemories(
    query: string,
    userId: string,
    filters: QueryFilters = {},
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      console.log('Starting search for:', query)
      
      // 1. Récupérer tous les souvenirs de l'utilisateur
      const { data: memories, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .not('embedding', 'is', null)
        .limit(50) // Limiter pour les performances

      if (error) {
        console.error('Error fetching memories:', error)
        throw error
      }

      if (!memories || memories.length === 0) {
        console.log('No memories found')
        return []
      }

      console.log(`Found ${memories.length} memories to search in`)

      // 2. Générer l'embedding de la requête
      const queryEmbedding = await embeddingService.generateEmbedding(query)
      if (!queryEmbedding) {
        console.log('Failed to generate query embedding, using text search')
        return this.simpleTextSearch(query, memories, limit)
      }

      console.log(`Query embedding generated: ${queryEmbedding.length} dimensions, first 5 values:`, queryEmbedding.slice(0, 5))

      // Test du calcul de similarité avec des vecteurs connus
      const testVector1 = [1, 0, 0, 0, 0]
      const testVector2 = [0, 1, 0, 0, 0]
      const testVector3 = [1, 0, 0, 0, 0]
      const testSimilarity1 = embeddingService.calculateCosineSimilarity(testVector1, testVector2) // devrait être 0
      const testSimilarity2 = embeddingService.calculateCosineSimilarity(testVector1, testVector3) // devrait être 1
      console.log('Test similarity calculation:', {
        'different vectors': testSimilarity1,
        'same vectors': testSimilarity2
      })

      // 3. Calculer la similarité pour chaque souvenir
      const resultsWithSimilarity = memories.map((memory: any) => {
                      // Parser l'embedding depuis la chaîne JSON stockée
              let memoryEmbedding: number[]
              try {
                if (typeof memory.embedding === 'string') {
                  // Si c'est une chaîne JSON, la parser
                  memoryEmbedding = JSON.parse(memory.embedding)
                } else if (Array.isArray(memory.embedding)) {
                  // Si c'est déjà un tableau
                  memoryEmbedding = memory.embedding
                } else {
                  console.warn(`Memory ${memory.id} has invalid embedding type:`, typeof memory.embedding)
                  return {
                    memory,
                    similarity: 0
                  }
                }
              } catch (parseError) {
                console.warn(`Memory ${memory.id} has unparseable embedding:`, parseError)
                return {
                  memory,
                  similarity: 0
                }
              }

              // Vérifier que l'embedding parsé a la bonne longueur
              if (!memoryEmbedding || !Array.isArray(memoryEmbedding) || memoryEmbedding.length !== queryEmbedding.length) {
                console.warn(`Memory ${memory.id} has invalid embedding after parsing:`, {
                  hasEmbedding: !!memoryEmbedding,
                  isArray: Array.isArray(memoryEmbedding),
                  length: memoryEmbedding?.length,
                  expectedLength: queryEmbedding.length
                })
                return {
                  memory,
                  similarity: 0
                }
              }

              // Vérifier si l'embedding est différent de zéro
              const embeddingSum = memoryEmbedding.reduce((sum: number, val: number) => sum + Math.abs(val), 0)
              if (embeddingSum === 0) {
                console.warn(`Memory ${memory.id} has zero embedding`)
                return {
                  memory,
                  similarity: 0
                }
              }

              const similarity = embeddingService.calculateCosineSimilarity(
                queryEmbedding,
                memoryEmbedding
              )
        
        // Log pour debug
        console.log(`Memory ${memory.id}: similarity = ${similarity.toFixed(4)}, embedding sum = ${embeddingSum.toFixed(4)}, content: "${memory.content.substring(0, 50)}..."`)
        
        return {
          memory,
          similarity
        }
      })

      // 4. Trier par similarité et limiter
      const sortedResults = resultsWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)

      console.log(`Top results:`, sortedResults.map(r => ({
        id: r.memory.id,
        similarity: r.similarity.toFixed(4),
        content: r.memory.content.substring(0, 50) + '...'
      })))

      console.log(`Returning ${sortedResults.length} results`)

      // 5. Formater les résultats
      return sortedResults.map((item: any) => ({
        memory: {
          id: item.memory.id,
          user_id: item.memory.user_id,
          content: item.memory.content,
          date: item.memory.date,
          location: item.memory.location,
          image_url: item.memory.image_url,
          created_at: item.memory.created_at,
          updated_at: item.memory.updated_at
        },
        relevanceScore: item.similarity,
        matchReason: 'Similarité sémantique',
        highlightedContent: this.highlightContent(item.memory.content, query)
      }))

    } catch (error) {
      console.error('Error in search:', error)
      // Fallback vers recherche textuelle
      return this.simpleTextSearch(query, [], limit)
    }
  }

  // Recherche textuelle simple (fallback)
  private simpleTextSearch(query: string, memories: any[], limit: number): SearchResult[] {
    console.log('Using simple text search')
    
    if (memories.length === 0) {
      return []
    }

    const queryLower = query.toLowerCase()
    const results = memories
      .filter((memory: any) => 
        memory.content.toLowerCase().includes(queryLower) ||
        (memory.location && memory.location.toLowerCase().includes(queryLower))
      )
      .slice(0, limit)
      .map((memory: any) => ({
        memory: {
          id: memory.id,
          user_id: memory.user_id,
          content: memory.content,
          date: memory.date,
          location: memory.location,
          image_url: memory.image_url,
          created_at: memory.created_at,
          updated_at: memory.updated_at
        },
        relevanceScore: 0.5,
        matchReason: 'Recherche textuelle',
        highlightedContent: this.highlightContent(memory.content, query)
      }))

    console.log(`Text search found ${results.length} results`)
    return results
  }

  // Recherche hybride (alias pour searchMemories)
  async hybridSearch(
    query: string,
    userId: string,
    filters: QueryFilters = {},
    limit: number = 10
  ): Promise<SearchResult[]> {
    return this.searchMemories(query, userId, filters, limit)
  }

  // Mettre en surbrillance le contenu
  private highlightContent(content: string, query: string): string {
    if (!content || !query) return content

    const queryWords = query.toLowerCase().split(/\s+/)
    let highlightedContent = content

    queryWords.forEach(word => {
      if (word.length > 2) {
        const regex = new RegExp(`(${word})`, 'gi')
        highlightedContent = highlightedContent.replace(regex, '**$1**')
      }
    })

    return highlightedContent
  }
}

// Instance singleton
export const vectorSearchService = new VectorSearchService() 