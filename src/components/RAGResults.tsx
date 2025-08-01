import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'
import { RAGResponse } from '@/lib/ragService'
import MemoryCard from './MemoryCard'
import MemoryDetailModal from './MemoryDetailModal'

interface RAGResultsProps {
  response: RAGResponse
  onReset?: () => void
}

export default function RAGResults({ response, onReset }: RAGResultsProps) {
  const [showSources, setShowSources] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<any>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Fonction pour formater la réponse IA avec des listes à puces
  const formatAIResponse = (text: string) => {
    // Séparer la réponse principale des sources
    const parts = text.split('---')
    const mainAnswer = parts[0]?.trim() || ''
    const sources = parts[1]?.trim() || ''

    return (
      <div className="space-y-4">
        {/* Réponse principale */}
        <div>
          {mainAnswer.split('\n').map((line, index) => {
            const trimmedLine = line.trim()
            
            // Détecter les listes à puces (commençant par - ou •)
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
              const content = trimmedLine.substring(2)
              return (
                <div key={index} className="flex items-start gap-2 ml-4 mb-1">
                  <span className="text-primary mt-1">•</span>
                  <span>{content}</span>
                </div>
              )
            }
            
            // Lignes normales
            if (trimmedLine) {
              return <p key={index} className="mb-2">{trimmedLine}</p>
            }
            
            // Lignes vides
            return <br key={index} />
          })}
        </div>

                 {/* Section Sources - Supprimée car redondante avec "Sources utilisées" */}
      </div>
    )
  }

  const getQueryTypeIcon = (type: string) => {
    switch (type) {
      case 'count':
        return <Target className="h-4 w-4" />
      case 'narrative':
        return <BookOpen className="h-4 w-4" />
      case 'summary':
        return <Sparkles className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getQueryTypeLabel = (type: string) => {
    switch (type) {
      case 'count':
        return 'Comptage'
      case 'narrative':
        return 'Narration'
      case 'summary':
        return 'Résumé'
      default:
        return 'Liste'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const handleViewMemory = (memory: any) => {
    setSelectedMemory(memory)
    setDetailModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Réponse narrative principale */}
      <Card className="bg-gradient-memory shadow-soft border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg text-foreground flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-primary" />
              Réponse IA
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
              >
                {getQueryTypeIcon(response.narrativeResponse.queryType)}
                {getQueryTypeLabel(response.narrativeResponse.queryType)}
              </Badge>
                             <Badge 
                 className={`${getConfidenceColor(response.narrativeResponse.confidence)}`}
               >
                 {Math.round(response.narrativeResponse.confidence * 100)}% confiance
               </Badge>
               {response.narrativeResponse.model && (
                 <Badge variant="secondary" className="text-xs">
                   {response.narrativeResponse.llmUsed ? '🤖' : '📝'} {response.narrativeResponse.model}
                 </Badge>
               )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {formatAIResponse(response.answer)}
            </div>
          </div>
          
          {/* Métadonnées de traitement */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {response.queryAnalysis.processingTime}ms
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {response.sources.length} source{response.sources.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-6 px-2 text-xs"
              >
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Détails
              </Button>
            </div>
            
            {/* Détails techniques */}
            {showDetails && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Requête vectorielle :</span>
                    <p className="text-muted-foreground">{response.queryAnalysis.parsedQuery.vectorQuery}</p>
                  </div>
                  <div>
                    <span className="font-medium">Filtres détectés :</span>
                    <p className="text-muted-foreground">
                      {Object.keys(response.queryAnalysis.parsedQuery.filters).length > 0 
                        ? Object.entries(response.queryAnalysis.parsedQuery.filters)
                            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                            .join(', ')
                        : 'Aucun'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sources utilisées */}
      {response.sources.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-base sm:text-lg text-foreground flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-accent" />
                Sources utilisées ({response.sources.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSources(!showSources)}
                className="h-8 px-2"
              >
                {showSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showSources ? 'Masquer' : 'Afficher'}
              </Button>
            </div>
          </CardHeader>
          
          {showSources && (
            <CardContent className="space-y-4">
              {response.sources.map((memory, index) => (
                <div key={memory.id} className="space-y-3">
                  <div 
                    className="cursor-pointer transition-all hover:bg-muted/30 rounded-lg p-2 -m-2"
                    onClick={() => handleViewMemory(memory)}
                  >
                    <MemoryCard 
                      memory={memory} 
                      onView={() => handleViewMemory(memory)}
                      onEdit={() => {
                        // Optionnel : gérer l'édition
                        console.log('Édition du souvenir:', memory.id)
                      }}
                      onDelete={() => {
                        // Optionnel : gérer la suppression
                        console.log('Suppression du souvenir:', memory.id)
                      }}
                    />
                  </div>
                  
                  {index < response.sources.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Nouvelle recherche
        </Button>
      </div>

      {/* Modal pour afficher les détails du souvenir */}
      <MemoryDetailModal
        memory={selectedMemory}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  )
} 