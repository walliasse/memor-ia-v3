import { Button } from "@/components/ui/button";
import { List, Calendar } from "lucide-react";

interface ViewToggleProps {
  currentView: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  className?: string;
}

export default function ViewToggle({ 
  currentView, 
  onViewChange, 
  className = "" 
}: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-muted/50 rounded-lg ${className}`}>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2 h-8 px-3"
      >
        <List className="h-4 w-4" />
        <span className="text-xs font-medium">Liste</span>
      </Button>
      
      <Button
        variant={currentView === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className="flex items-center gap-2 h-8 px-3"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-xs font-medium">Calendrier</span>
      </Button>
    </div>
  );
} 