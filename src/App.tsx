import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrintCalculator from "./pages/PrintCalculator";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import HistoricalCalculations from "./pages/HistoricalCalculations";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { SessionContextProvider } from "./context/SessionContext";
import "./i18n"; // Import i18n configuration

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <TooltipProvider>
        {/* Removed <Toaster /> as sonner is used */}
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <SettingsProvider>
              <Routes>
                <Route path="/" element={<PrintCalculator />} />
                <Route path="/home" element={<Index />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/history" element={<HistoricalCalculations />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SettingsProvider>
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;