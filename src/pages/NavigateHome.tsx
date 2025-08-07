import { useNavigate } from "react-router-dom";
import { Sailboat } from "lucide-react";
import Header from "@/components/Header";

export default function NavigateHome() {
  const navigate = useNavigate();

  const handleNavigateClick = () => {
    navigate("/naviguer");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 pb-20">
      <Header title="Naviguer" />

      {/* Contenu principal centré */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-8">
                     {/* Logo bateau animé */}
           <div 
             onClick={handleNavigateClick}
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

          {/* Texte d'invitation */}
          <div className="space-y-4">
            <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
              Voyage dans tes souvenirs
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              Navigue dans ta mémoire et découvre tes souvenirs avec l'aide de l'intelligence artificielle
            </p>
          </div>

          {/* Indicateur de clic */}
          <div className="text-xs text-muted-foreground animate-pulse">
            Clique pour commencer l'exploration
          </div>
        </div>
      </main>
    </div>
  );
} 