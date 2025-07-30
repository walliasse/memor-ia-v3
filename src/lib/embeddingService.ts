import { EmbeddingRequest, EmbeddingResponse } from './types'

const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings'
const DEFAULT_MODEL = 'text-embedding-3-small'

export class EmbeddingService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || ''
  }

  async generateEmbedding(text: string, model: string = DEFAULT_MODEL): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required')
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty')
    }

    try {
      console.log('Envoi de la requête à OpenAI:', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        model: model,
        apiKeyPrefix: this.apiKey.substring(0, 10) + '...'
      })

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input: text,
          model: model
        })
      })

      console.log('Réponse OpenAI reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erreur OpenAI détaillée:', errorData)
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data: EmbeddingResponse = await response.json()
      console.log('Données OpenAI reçues:', {
        hasData: !!data,
        object: data.object,
        hasDataArray: !!data.data,
        dataArrayLength: data.data?.length || 0,
        model: data.model,
        usage: data.usage
      })
      
      // Vérifier la structure de la réponse
      if (data.object === 'list' && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const embedding = data.data[0].embedding
        if (embedding && Array.isArray(embedding) && embedding.length > 0) {
          console.log('Embedding extrait avec succès:', embedding.length, 'dimensions')
          return embedding
        }
      }
      
      console.error('Réponse OpenAI sans embedding valide:', data)
      throw new Error('No embedding returned from OpenAI')
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  async generateEmbeddings(texts: string[], model: string = DEFAULT_MODEL): Promise<number[][]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required')
    }

    if (!texts || texts.length === 0) {
      throw new Error('Texts array cannot be empty')
    }

    // Filtrer les textes vides
    const validTexts = texts.filter(text => text && text.trim().length > 0)
    
    if (validTexts.length === 0) {
      throw new Error('No valid texts provided')
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input: validTexts,
          model: model
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from OpenAI')
      }

      return data.data.map((item: any) => item.embedding)
    } catch (error) {
      console.error('Error generating embeddings:', error)
      throw error
    }
  }

  // Fonction utilitaire pour calculer la similarité cosinus
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length')
    }

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i]
      norm1 += embedding1[i] * embedding1[i]
      norm2 += embedding2[i] * embedding2[i]
    }

    norm1 = Math.sqrt(norm1)
    norm2 = Math.sqrt(norm2)

    if (norm1 === 0 || norm2 === 0) {
      return 0
    }

    return dotProduct / (norm1 * norm2)
  }

  // Fonction pour normaliser un embedding
  normalizeEmbedding(embedding: number[]): number[] {
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    if (norm === 0) return embedding
    return embedding.map(val => val / norm)
  }
}

// Instance singleton
export const embeddingService = new EmbeddingService() 