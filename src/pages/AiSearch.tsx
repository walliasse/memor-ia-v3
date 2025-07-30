import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Sailboat, MessageCircle, Calendar, MapPin, Clock, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTravelSearch } from "@/hooks/useTravelSearch";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import MemoryCard from "@/components/MemoryCard";

export default function AiSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    results,
    isLoading,
    error,
    lastQuery,
    queryAnalysis,
    search,
    clearResults,
    hasResults,
    totalResults
  } = useTravelSearch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const suggestedQueries = [
    "Mes moments de bonheur en 2024",
    "Souvenirs avec mes amis",
    "Voyages et découvertes",
    "Moments de réflexion personnelle",
    "Événements marquants",
    "Souvenirs d'été",
    "Restaurants et gastronomie",
    "Activités sportives",
    "Moments de joie",
    "Souvenirs de voyage"
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await search(searchQuery, activeFilters);
  };

  const handleSuggestedQuery = (query: string) => {
    setSearchQuery(query);
    search(query, activeFilters);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearResults();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Naviguer" />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
        {/* Section de recherche principale */}
        <Card className="bg-gradient-memory shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-lg sm:text-xl text-foreground flex items-center">
              <Sailboat className="h-5 w-5 mr-2 text-primary" />
              Explorez vos souvenirs avec Travel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Utilisez le langage naturel pour retrouver vos moments précieux
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Par exemple : 'Raconte-moi mes plus beaux souvenirs d'été 2023' ou 'Quand ai-je été le plus heureux cette année ?'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="min-h-20 bg-background/50 border-border focus:bg-background resize-none pr-12"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                {searchQuery && (
                  <Button
                    onClick={handleClearSearch}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isLoading}
                  className="bg-gradient-gold text-primary-foreground hover:opacity-90 h-8 px-3"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyse de la requête */}
        {queryAnalysis && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-sm text-foreground flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-accent" />
                Analyse de votre requête
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {queryAnalysis.parsedQuery.filters.dateRange && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(queryAnalysis.parsedQuery.filters.dateRange.start).toLocaleDateString('fr-FR')} - {new Date(queryAnalysis.parsedQuery.filters.dateRange.end).toLocaleDateString('fr-FR')}
                  </Badge>
                )}
                {queryAnalysis.parsedQuery.filters.locations?.map((location: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {location}
                  </Badge>
                ))}
                {queryAnalysis.parsedQuery.filters.activities?.map((activity: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {activity}
                  </Badge>
                ))}
                {queryAnalysis.parsedQuery.filters.emotions?.map((emotion: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                Traitement en {queryAnalysis.processingTime}ms
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultats de recherche */}
        {hasResults && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-base sm:text-lg text-foreground">
                {totalResults} souvenir{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, index) => (
                <div key={result.memory.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getRelevanceColor(result.relevanceScore)}`} />
                      <span className="text-xs text-muted-foreground">
                        Pertinence: {Math.round(result.relevanceScore * 100)}%
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.matchReason}
                    </Badge>
                  </div>
                  
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/memory/${result.memory.id}`)}
                  >
                    <MemoryCard memory={result.memory} />
                  </div>
                  
                  {result.highlightedContent && (
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      <div className="font-medium mb-1">Extrait pertinent :</div>
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: result.highlightedContent.replace(/\*\*(.*?)\*\*/g, '<mark>$1</mark>') 
                        }}
                      />
                    </div>
                  )}
                  
                  {index < results.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Message d'erreur */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="py-4">
              <div className="text-center text-destructive">
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggestions de recherche */}
        {!hasResults && !isLoading && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-base sm:text-lg text-foreground flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-accent" />
                Suggestions de recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 bg-background/50 hover:bg-background border-border/50 hover:border-primary/30"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    <Search className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{query}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information sur la fonctionnalité */}
        {!hasResults && !isLoading && (
          <Card className="bg-gradient-warm shadow-soft border-border/50">
            <CardContent className="py-6">
              <div className="text-center space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground">
                  🚀 Travel - Navigation intelligente
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Travel utilise une approche hybride combinant recherche sémantique par embeddings et filtrage intelligent pour vous aider à retrouver vos souvenirs les plus pertinents. Posez vos questions en langage naturel !
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 