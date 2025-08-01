import { useState } from "react";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import CalendarView from "@/components/CalendarView";
import ViewToggle from "@/components/ViewToggle";
import { useMemories } from "@/contexts/MemoriesContext";

export default function Memories() {
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const { memories, loading } = useMemories();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Souvenirs" />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Basculement de vue */}
        <div className="flex justify-center mb-6">
          <ViewToggle 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            {currentView === 'list' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {currentView === 'list' ? (
              <Timeline />
            ) : (
              <CalendarView />
            )}
          </>
        )}
      </main>
    </div>
  );
} 