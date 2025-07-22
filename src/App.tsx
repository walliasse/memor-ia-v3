import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Memories from "./pages/Memories";
import NewMemory from "./pages/NewMemory";
import AiSearch from "./pages/AiSearch";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MobileTabs from "./components/MobileTabs";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  
  // Pages où afficher les onglets mobiles
  const showMobileTabs = ["/souvenirs", "/nouveau", "/recherche"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/souvenirs" element={<Memories />} />
          <Route path="/nouveau" element={<NewMemory />} />
          <Route path="/recherche" element={<AiSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showMobileTabs && <MobileTabs />}
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
