import { User, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Souvenirs" }: HeaderProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo à gauche */}
          <div className="flex items-center space-x-2">
            <h1 
              className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-amber-400 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              memor.ia
            </h1>
          </div>

          {/* Titre centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-foreground dark:text-amber-100">
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