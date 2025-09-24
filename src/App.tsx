import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrintCalculator from "./pages/PrintCalculator";
import Settings from "./pages/Settings"; // Import the new Settings page
import { SettingsProvider } from "./context/SettingsContext"; // Import the SettingsProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SettingsProvider> {/* Wrap the routes with SettingsProvider */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/print-calculator" element={<PrintCalculator />} />
            <Route path="/settings" element={<Settings />} /> {/* New route for settings */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;