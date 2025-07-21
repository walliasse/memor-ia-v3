import { Search, Plus, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onAddMemory?: () => void;
}

const Header = ({ onSearch, onAddMemory }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-primary">
              memor.ia
            </h1>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Recherchez dans vos souvenirs..."
                className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile search button */}
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 sm:h-10 sm:w-10">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            {/* Add memory button */}
            <Button 
              onClick={onAddMemory} 
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 h-9 sm:h-10"
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nouveau souvenir</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>

            {/* User menu */}
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Recherchez dans vos souvenirs..."
              className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors h-10"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;