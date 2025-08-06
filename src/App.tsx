import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MemoriesProvider } from "@/contexts/MemoriesContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import DebugInfo from "@/components/DebugInfo";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Memories from "./pages/Memories";
import NewMemory from "./pages/NewMemory";
import AiSearch from "./pages/AiSearch";
import NavigateHome from "./pages/NavigateHome";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MemoryDetail from "./pages/MemoryDetail";
import MobileTabs from "./components/MobileTabs";
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  
  // Debug: logs pour identifier le problème
  console.log('🚀 AppContent rendu, location:', location.pathname);
  console.log('🔧 Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_OPENAI_API_KEY: !!import.meta.env.VITE_OPENAI_API_KEY,
  });
  
  // Pages où afficher les onglets mobiles
  const showMobileTabs = ["/souvenirs", "/nouveau", "/naviguer", "/navigate"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/souvenirs" element={<Memories />} />
          <Route path="/nouveau" element={<NewMemory />} />
          <Route path="/naviguer" element={<AiSearch />} />
          <Route path="/navigate" element={<NavigateHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/memory/:id" element={<MemoryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      {/* Onglets mobiles */}
      {showMobileTabs && <MobileTabs />}
      
      {/* Debug Info */}
      <DebugInfo />
    </div>
  );
}

function App() {
  console.log('🚀 App component initialisé');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NavigationProvider>
            <MemoriesProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <AppContent />
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </BrowserRouter>
            </MemoriesProvider>
          </NavigationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
