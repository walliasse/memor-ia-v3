import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemories } from "@/contexts/MemoriesContext";
import { Memory } from "@/lib/types";
import { useDateBounds } from "@/hooks/useDateBounds";
import MonthCalendar from "./MonthCalendar";
import DayMemoriesModal from "./DayMemoriesModal";

interface CalendarViewProps {
  className?: string;
}

export default function CalendarView({ className = "" }: CalendarViewProps) {
  const { minDate, maxDate } = useDateBounds();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { memories } = useMemories();

  // Créer un Map pour un accès rapide aux souvenirs par date
  const memoriesByDate = useMemo(() => {
    const map = new Map<string, Memory[]>();
    memories.forEach(memory => {
      const dateKey = memory.date.split('T')[0]; // Format YYYY-MM-DD
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(memory);
    });
    return map;
  }, [memories]);

  // Générer tous les mois de l'année avec filtrage des bornes
  const months = useMemo(() => {
    const allMonths = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
    
    // Filtrer les mois qui sont dans les bornes temporelles
    return allMonths.filter(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      return monthStart <= maxDate && monthEnd >= minDate;
    });
  }, [currentYear, minDate, maxDate]);

  const previousYear = () => {
    const newYear = currentYear - 1;
    if (newYear >= minDate.getFullYear()) {
      setCurrentYear(newYear);
    }
  };

  const nextYear = () => {
    const newYear = currentYear + 1;
    if (newYear <= maxDate.getFullYear()) {
      setCurrentYear(newYear);
    }
  };

  const handleDayClick = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const dayMemories = memoriesByDate.get(dateKey) || [];
    
    if (dayMemories.length > 0) {
      setSelectedDate(date);
      setModalOpen(true);
    }
  };

  const getMemoriesForDate = (date: Date): Memory[] => {
    const dateKey = date.toISOString().split('T')[0];
    return memoriesByDate.get(dateKey) || [];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Navigation de l'année */}
      <Card className="bg-gradient-warm shadow-soft border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
                         <Button 
               variant="ghost" 
               size="icon" 
               onClick={previousYear}
               disabled={currentYear <= minDate.getFullYear()}
               className="h-10 w-10 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <ChevronLeft className="h-5 w-5" />
             </Button>
            
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                {currentYear}
              </h2>
            </div>
            
                         <Button 
               variant="ghost" 
               size="icon" 
               onClick={nextYear}
               disabled={currentYear >= maxDate.getFullYear()}
               className="h-10 w-10 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <ChevronRight className="h-5 w-5" />
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grille des mois */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => (
          <MonthCalendar
            key={index}
            month={month}
            memoriesByDate={memoriesByDate}
            onDayClick={handleDayClick}
            getMemoriesForDate={getMemoriesForDate}
          />
        ))}
      </div>

      {/* Modal pour afficher les souvenirs d'un jour */}
      <DayMemoriesModal
        date={selectedDate}
        open={modalOpen}
        onOpenChange={setModalOpen}
        memories={selectedDate ? getMemoriesForDate(selectedDate) : []}
      />
    </div>
  );
} 