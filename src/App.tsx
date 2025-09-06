import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import Index from "./pages/Index";

import Analytics from "./pages/Analytics";
import Distractions from "./pages/Distractions";
import Focus from "./pages/Focus";
import Goals from "./pages/Goals";
import Motivation from "./pages/Motivation";
import Mood from "./pages/Mood";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HelmetProvider>
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/focus" element={<Focus />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/distractions" element={<Distractions />} />
            <Route path="/motivation" element={<Motivation />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SiteFooter />
        </HelmetProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
