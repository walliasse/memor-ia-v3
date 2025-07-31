import { Memory } from './types'

export interface LLMResponse {
  answer: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export class LLMService {
  private apiKey: string
  private model: string = 'gpt-4o-mini'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
  }

  async generateNarrativeResponse(
    query: string,
    memories: Memory[],
    queryType: 'count' | 'narrative' | 'summary' | 'list'
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée')
    }

    const prompt = this.buildPrompt(query, memories, queryType)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(queryType)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        answer: data.choices[0].message.content,
        usage: data.usage,
        model: this.model
      }

    } catch (error) {
      console.error('Erreur lors de la génération LLM:', error)
      throw error
    }
  }

  private getSystemPrompt(queryType: string): string {
    const basePrompt = `Tu es un assistant personnel qui aide à analyser et raconter des souvenirs personnels.

RÈGLES GÉNÉRALES
- Réponds toujours en français et tutoie l'utilisateur (tu, ton, tes).
- Ne t'appuie que sur les souvenirs fournis dans le contexte.
- Si une information n'apparaît pas dans ces souvenirs, dis-le clairement.
- N'invente jamais de contenu, même pour faire joli.
- Un souvenir = un document récupéré (texte, image, audio transcrit) avec ses métadonnées (date, lieu, tags).
- Si aucun souvenir ne correspond, réponds : "Je n'ai trouvé aucun souvenir correspondant à ta demande."
- Ton ton est chaleureux, naturel et concis.
- Comptage, résumé : 1-2 phrases.
- Narration courtes : 2-3 phrases.
- Listes : puces ou numérotation, 1 ligne par souvenir.
- À la fin de chaque réponse, ajoute un séparateur --- puis la section Sources :
- pour chaque souvenir utilisé : [Date] - [Titre ou extrait significatif]`

    switch (queryType) {
      case 'count':
        return basePrompt + '\n\nPour les questions de comptage : Identifie tous les souvenirs pertinents et calcule le nombre exact. Formule : "Tu as fait X [activité] en [période]." + éventuelle phrase de contexte. Évite toute spéculation : si l\'activité n\'est pas explicitement décrite, ne la compte pas.'
      
      case 'narrative':
        return basePrompt + '\n\nPour les questions narratives : Raconte les faits marquants en mentionnant dates et lieux clés. Utilise un style vivant mais sobre : pas plus de 3 phrases. N\'invente rien.'
      
      case 'summary':
        return basePrompt + '\n\nPour les résumés : Fais un résumé concis des thèmes principaux et du nombre de souvenirs.'
      
      case 'list':
        return basePrompt + '\n\nPour les listes : Classe par ordre chronologique (ou pertinence si aucune date). Format puces : [JJ/MM/AAAA] - [Phrase reformulée < 15 mots].'
      
      default:
        return basePrompt
    }
  }

  private buildPrompt(query: string, memories: Memory[], queryType: string): string {
    const memoriesText = memories.map(memory => {
      const date = new Date(memory.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      return `- ${date}${memory.location ? ` à ${memory.location}` : ''} : ${memory.content}`
    }).join('\n')

    return `Question de l'utilisateur : "${query}"

Souvenirs disponibles :
${memoriesText}

${memories.length === 0 ? 'Aucun souvenir trouvé correspondant à cette demande.' : ''}

Génère une réponse appropriée selon le type de question (${queryType}).`
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }

  getModelInfo(): { name: string; maxTokens: number; cost: string } {
    return {
      name: this.model,
      maxTokens: 4096,
      cost: this.model === 'gpt-4o-mini' ? '~$0.001/1K tokens' : '~$0.03/1K tokens'
    }
  }
}

export const llmService = new LLMService() 