import { Brain, Heart, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-journal.jpg";

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

const WelcomeSection = ({ onGetStarted }: WelcomeSectionProps) => {
  const features = [
    {
      icon: Heart,
      title: "Capturer l'instant",
      description: "Préservez vos souvenirs avec des textes, photos et émotions"
    },
    {
      icon: Search,
      title: "Recherche intelligente",
      description: "Retrouvez vos moments grâce à l'IA et la recherche sémantique"
    },
    {
      icon: Brain,
      title: "Assistant IA",
      description: "Posez des questions sur vos souvenirs en langage naturel"
    },
    {
      icon: Sparkles,
      title: "Timeline magique",
      description: "Naviguez dans vos souvenirs mois par mois"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-memory">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu textuel */}
            <div className="space-y-8">
              <div>
                <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Votre journal
                  <span className="text-primary block">intelligent</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Capturez vos souvenirs quotidiens et retrouvez-les grâce à l'intelligence artificielle. 
                  Memor.ia transforme vos moments en une collection précieuse et facilement accessible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity px-8 py-3 text-lg"
                >
                  Commencer mon journal
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3 text-lg border-primary/20 hover:bg-primary/5"
                >
                  Découvrir les fonctionnalités
                </Button>
              </div>
            </div>

            {/* Image hero */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-warm">
                <img 
                  src={heroImage} 
                  alt="Journal personnel élégant"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-gold rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
            Pourquoi choisir memor.ia ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une approche moderne du journal personnel, enrichie par l'intelligence artificielle 
            pour une expérience unique de mémorisation et de redécouverte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 hover:bg-card/80 transition-colors border-border/50 shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-warm rounded-2xl p-8 lg:p-12 text-center shadow-warm">
          <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-4">
            Commencez dès aujourd'hui
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Chaque jour qui passe est une nouvelle page de votre histoire. 
            Ne laissez plus vos souvenirs s'effacer.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity px-8 py-3"
          >
            Créer mon premier souvenir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;