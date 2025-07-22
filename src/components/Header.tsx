import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Souvenirs" }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo à gauche */}
          <div className="flex items-center space-x-2">
            <h1 
              className="text-xl sm:text-2xl font-serif font-semibold text-primary cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              memor.ia
            </h1>
          </div>

          {/* Titre centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-foreground">
              {title}
            </h2>
          </div>

          {/* Bouton profil à droite */}
          <div className="flex items-center">
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