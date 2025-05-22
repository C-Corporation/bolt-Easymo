
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import TenantsTablePage from "./pages/TenantsTablePage";
import TenantsPage from "./pages/tenants";
import Sidebar from "./components/Sidebar";
import ImmoPage from "./pages/ImmoPage";
import FinancesPage from "./pages/FinancesPage";
import DocumentsPage from "./pages/DocumentsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <DashboardPage />
                </main>
              </div>
            </div>
          } />
          <Route path="/locataires/tableau" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <TenantsTablePage />
                </main>
              </div>
            </div>
          } />
          <Route path="/locataires/profils" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <TenantsPage />
                </main>
              </div>
            </div>
          } />
          {/* Nouvelles routes pour Immobilier, Finances, Documents et Paramètres */}
          <Route path="/immobiliers" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <ImmoPage />
                </main>
              </div>
            </div>
          } />
          <Route path="/finances" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <FinancesPage />
                </main>
              </div>
            </div>
          } />
          <Route path="/documents" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <DocumentsPage />
                </main>
              </div>
            </div>
          } />
          <Route path="/parametres" element={
            <div className="h-screen bg-white relative">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
              <div className="relative h-full">
                <Sidebar className="absolute top-4 left-5" />
                <main className="ml-[244px] p-6 h-full overflow-y-auto">
                  <SettingsPage />
                </main>
              </div>
            </div>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
