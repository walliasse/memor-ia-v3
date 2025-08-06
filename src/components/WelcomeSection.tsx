import { Sailboat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

const WelcomeSection = ({ onGetStarted }: WelcomeSectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-memory flex items-center justify-center">
      <div className="text-center space-y-12 px-6">
        {/* Logo memor.ia en gros */}
        <div className="space-y-4">
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-none">
            memor.ia
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-light">
            Votre journal intelligent
          </p>
        </div>

                {/* Bouton bateau rond - exactement comme dans NavigateHome */}
        <div className="pt-12">
          <div 
            onClick={onGetStarted}
            className="group cursor-pointer mx-auto"
          >
            <div className="relative flex justify-center">
              {/* Cercle de fond avec gradient */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 via-primary/20 to-accent/30 border-2 border-primary/40 group-hover:border-primary/70 transition-all duration-700 ease-out group-hover:scale-110 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20">
                {/* Effet de brillance */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
                
                {/* Icône bateau */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sailboat className="h-16 w-16 text-primary group-hover:text-primary/90 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm" />
                </div>
              </div>
              
              {/* Effet de vague animée */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-x-200 group-hover:scale-y-150"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;