import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Sailboat, MessageCircle, Calendar, MapPin, Clock, Filter, X, Bot, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useRAG } from "@/hooks/useRAG";
import Header from "@/components/Header";
import RAGResults from "@/components/RAGResults";

export default function AiSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, lastResponse, error, processQuery, reset } = useRAG();

  const [searchQuery, setSearchQuery] = useState("");

  const suggestedQueries = [
    "Combien de fois je suis allé au restaurant en 2024 ?",
    "Raconte-moi mes vacances à Paris",
    "Résume mes souvenirs d'été 2023",
    "Mes moments de bonheur cette année",
    "Souvenirs avec mes amis",
    "Voyages et découvertes",
    "Moments de réflexion personnelle",
    "Événements marquants",
    "Restaurants et gastronomie",
    "Activités sportives"
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    await processQuery(searchQuery.trim());
  };

  const handleSuggestedQuery = (query: string) => {
    setSearchQuery(query);
    // La recherche sera déclenchée automatiquement
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
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
              Voyage dans tes souvenirs, navigue dans ta mémoire...
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Posez vos questions en langage naturel et obtenez des réponses intelligentes basées sur vos souvenirs
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Par exemple : 'Combien de fois je suis allé au bar en mai ?' ou 'Raconte-moi mes vacances à Lisbonne' ou 'Résume ce que j'ai fait en juin'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
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
                  disabled={!searchQuery.trim() || loading}
                  className="bg-gradient-gold text-primary-foreground hover:opacity-90 h-8 px-3"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats RAG */}
        {lastResponse && (
          <RAGResults 
            response={lastResponse} 
            onReset={handleClearSearch}
          />
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
        {!lastResponse && !loading && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-base sm:text-lg text-foreground flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-accent" />
                Exemples de questions
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
        {!lastResponse && !loading && (
          <Card className="bg-gradient-warm shadow-soft border-border/50">
            <CardContent className="py-6">
              <div className="text-center space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground">
                  🤖 Assistant IA Narratif
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Notre assistant IA analyse vos souvenirs et génère des réponses intelligentes. 
                  Il peut compter, raconter, résumer ou lister vos souvenirs selon vos besoins. 
                  Posez vos questions en langage naturel !
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    Comptage
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Narration
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Résumé
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Liste
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 