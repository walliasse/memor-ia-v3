import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Memory } from "@/lib/types";
import { useDateBounds } from "@/hooks/useDateBounds";

interface MonthCalendarProps {
  month: Date;
  memoriesByDate: Map<string, Memory[]>;
  onDayClick: (date: Date) => void;
  getMemoriesForDate: (date: Date) => Memory[];
}

export default function MonthCalendar({ 
  month, 
  memoriesByDate, 
  onDayClick, 
  getMemoriesForDate 
}: MonthCalendarProps) {
  const { minDate, maxDate, isDateValid } = useDateBounds();
  
  // Générer les jours du mois
  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajuster au début de la semaine (lundi = 0)
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - mondayOffset);
    
    const days: (Date | null)[] = [];
    const currentDate = new Date(startDate);
    
    // Générer 6 semaines (42 jours) pour couvrir tous les cas
    for (let i = 0; i < 42; i++) {
      if (currentDate.getMonth() === monthIndex) {
        days.push(new Date(currentDate));
      } else {
        days.push(null);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [month]);

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      month: 'long'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasMemories = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return memoriesByDate.has(dateKey);
  };

  const getMemoryCount = (date: Date) => {
    return getMemoriesForDate(date).length;
  };

  return (
    <Card className="bg-card/50 shadow-soft border-border/50 hover:shadow-warm transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg font-medium text-foreground capitalize text-center">
          {formatMonth(month)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        {/* En-têtes des jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div 
              key={index}
              className="h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return (
                <div 
                  key={index}
                  className="h-8 w-8 rounded-md"
                />
              );
            }

            const dayMemories = getMemoriesForDate(date);
            const hasMemory = dayMemories.length > 0;
            const isCurrentDay = isToday(date);
            const isCurrentMonth = date.getMonth() === month.getMonth();

                                    const isDateInBounds = isDateValid(date);
                        
                        return (
                          <button
                            key={index}
                            onClick={() => onDayClick(date)}
                            disabled={!hasMemory || !isDateInBounds}
                            className={`
                              calendar-day h-8 w-8 rounded-md text-sm font-medium
                              flex items-center justify-center relative
                              ${isCurrentMonth 
                                ? 'text-foreground' 
                                : 'text-muted-foreground/50'
                              }
                              ${hasMemory && isDateInBounds
                                ? 'hover:bg-primary/20 cursor-pointer calendar-day-with-memory' 
                                : 'cursor-default'
                              }
                              ${!isDateInBounds
                                ? 'opacity-30 cursor-not-allowed'
                                : ''
                              }
                              ${isCurrentDay 
                                ? 'bg-primary text-primary-foreground font-bold' 
                                : ''
                              }
                            `}
                          >
                {date.getDate()}
                
                {/* Indicateur de souvenirs */}
                {hasMemory && !isCurrentDay && (
                  <div className="calendar-day-indicator bg-primary" />
                )}
                
                {/* Indicateur pour aujourd'hui avec souvenirs */}
                {hasMemory && isCurrentDay && (
                  <div className="calendar-day-indicator bg-primary/60" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 