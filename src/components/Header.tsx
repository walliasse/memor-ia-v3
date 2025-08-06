import { User, Moon, Sun, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const Header = ({ title = "Souvenirs", showBack = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleBack = () => {
    // Logique simple de retour
    if (location.pathname === '/profile' || location.pathname === '/settings') {
      navigate('/souvenirs'); // Retour vers les souvenirs par défaut
    } else {
      navigate('/'); // Retour vers l'accueil
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo à gauche ou flèche de retour */}
          <div className="flex items-center space-x-2">
            {showBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            ) : (
              <h1 
                className="text-xl sm:text-2xl font-serif font-semibold text-primary cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
              >
                memor.ia
              </h1>
            )}
          </div>

          {/* Titre centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-foreground">
              {title}
            </h2>
          </div>

          {/* Boutons à droite */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;