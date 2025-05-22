
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import TenantsTablePage from "./pages/TenantsTablePage";
import TenantsPage from "./pages/tenants";
import GlobalPage from "./pages/globals/GlobalPage";
import PropertiesPage from "./pages/properties/PropertiesPage";
import FinancesPage from "./pages/finances/FinancesPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen bg-white relative">
    <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
    <div className="relative h-full">
      <Sidebar className="absolute top-4 left-5" />
      <main className="ml-[244px] p-6 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><GlobalPage /></MainLayout>} />
          <Route path="/locataires/tableau" element={<MainLayout><TenantsTablePage /></MainLayout>} />
          <Route path="/locataires/profils" element={<MainLayout><TenantsPage /></MainLayout>} />
          <Route path="/immobiliers" element={<MainLayout><PropertiesPage /></MainLayout>} />
          <Route path="/finances" element={<MainLayout><FinancesPage /></MainLayout>} />
          <Route path="/documents" element={<MainLayout><DocumentsPage /></MainLayout>} />
          <Route path="/parametres" element={<MainLayout><SettingsPage /></MainLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
