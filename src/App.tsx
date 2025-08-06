import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MemoriesProvider } from "@/contexts/MemoriesContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MemoriesProvider>
              <TooltipProvider>
                <AppContent />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </MemoriesProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
