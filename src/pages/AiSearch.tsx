import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Sailboat, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function AiSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // TODO: Implémenter la recherche IA
    setTimeout(() => {
      setSearchResults([]);
      setIsSearching(false);
    }, 2000);
  };

  const suggestedQueries = [
    "Mes moments de bonheur en 2024",
    "Souvenirs avec mes amis",
    "Voyages et découvertes",
    "Moments de réflexion personnelle",
    "Événements marquants",
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Naviguer" />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
        {/* Section de recherche principale */}
        <Card className="bg-gradient-memory shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-lg sm:text-xl text-foreground flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Posez une question sur vos souvenirs
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Utilisez le langage naturel pour retrouver vos moments précieux
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Par exemple : 'Raconte-moi mes plus beaux souvenirs d'été' ou 'Quand ai-je été le plus heureux cette année ?'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-h-20 bg-background/50 border-border focus:bg-background resize-none pr-12"
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="absolute bottom-2 right-2 bg-gradient-gold text-primary-foreground hover:opacity-90 h-8 px-3"
              >
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions de recherche */}
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
                  onClick={() => setSearchQuery(query)}
                >
                  <Search className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{query}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder pour les résultats */}
        {searchQuery && (
          <Card className="bg-card/30 border-border/30 border-dashed">
            <CardContent className="py-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Sailboat className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    Navigation IA en développement
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Cette fonctionnalité révolutionnaire vous permettra bientôt de naviguer dans vos souvenirs en langage naturel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information sur la fonctionnalité */}
        <Card className="bg-gradient-warm shadow-soft border-border/50">
          <CardContent className="py-6">
            <div className="text-center space-y-3">
              <h3 className="font-serif text-base sm:text-lg font-medium text-foreground">
                🚀 Fonctionnalité à venir
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La navigation par intelligence artificielle analysera le contenu de vos souvenirs pour vous permettre de les retrouver naturellement, comme si vous naviguiez avec un guide personnel qui connaît toute votre histoire.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 