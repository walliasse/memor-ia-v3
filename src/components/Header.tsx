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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-serif font-semibold text-primary">
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
          <div className="flex items-center space-x-2">
            {/* Mobile search button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Add memory button */}
            <Button onClick={onAddMemory} className="bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nouveau souvenir</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>

            {/* User menu */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Recherchez dans vos souvenirs..."
              className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;