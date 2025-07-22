import Timeline from "@/components/Timeline";
import Header from "@/components/Header";

export default function Memories() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Souvenirs" />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Timeline />
      </main>
    </div>
  );
} 