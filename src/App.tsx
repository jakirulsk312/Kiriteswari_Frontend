import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import MemberSection from "./components/MemberSection";
import PriorityNoticePopup from "./components/PriorityNoticePopup";
import { LanguageProvider } from "@/lib/language";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PriorityNoticePopup />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/members" element={<MemberSection />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
