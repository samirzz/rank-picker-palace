
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { LiveChatProvider } from "./components/chat/LiveChatContext";
import React from "react";

// Use lazy loading for non-critical routes
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminPriceManagerPage = lazy(() => import("./pages/AdminPriceManagerPage"));
const AdminChatPage = lazy(() => import("./pages/AdminChatPage"));
const Auth = lazy(() => import("./pages/Auth"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CustomOrder = lazy(() => import("./pages/CustomOrder"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mlbb-purple"></div>
  </div>
);

// Instead of creating QueryClient outside the component, we create it inside
const App = () => {
  // Create a new QueryClient instance inside the component with optimized settings
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Disable refetching on window focus
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
        retry: 1, // Only retry failed requests once
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LiveChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/custom-order" element={<CustomOrder />} />
                  <Route path="/admin/login" element={<Admin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/prices" element={<AdminPriceManagerPage />} />
                  <Route path="/admin/chat" element={<AdminChatPage />} />
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LiveChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
