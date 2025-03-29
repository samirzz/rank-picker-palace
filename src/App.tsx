
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPriceManagerPage from "./pages/AdminPriceManagerPage";
import AdminChatPage from "./pages/AdminChatPage";
import AdminGameSelectionPage from "./pages/AdminGameSelectionPage";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import CustomOrder from "./pages/CustomOrder";
import { AuthProvider } from "./hooks/useAuth";
import React from "react";
import { LiveChatProvider } from "./components/chat/LiveChatContext";
import GameSelectionPage from "./pages/GameSelectionPage";
import MobileLegends from "./pages/games/MobileLegends";

// Instead of creating QueryClient outside the component, we create it inside
const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LiveChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<GameSelectionPage />} />
                <Route path="/mobile-legends" element={<MobileLegends />} />
                <Route path="/game-selection" element={<GameSelectionPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/custom-order" element={<CustomOrder />} />
                <Route path="/admin/login" element={<Admin />} />
                <Route path="/admin/game-selection" element={<AdminGameSelectionPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/prices" element={<AdminPriceManagerPage />} />
                <Route path="/admin/chat" element={<AdminChatPage />} />
                
                {/* Placeholder routes for future game-specific pages */}
                <Route path="/pubg" element={<NotFound />} />
                <Route path="/honor-of-kings" element={<NotFound />} />
                <Route path="/clash-of-clans" element={<NotFound />} />
                <Route path="/clash-royale" element={<NotFound />} />
                
                {/* Placeholder routes for future admin game pages */}
                <Route path="/admin/pubg" element={<NotFound />} />
                <Route path="/admin/honor-of-kings" element={<NotFound />} />
                <Route path="/admin/clash-of-clans" element={<NotFound />} />
                <Route path="/admin/clash-royale" element={<NotFound />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LiveChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
