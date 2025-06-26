import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { OwnerProvider } from "./contexts/OwnerContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import WorkspaceProtectedRoute from "./components/auth/WorkspaceProtectedRoute";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import TenantsPage from "./pages/tenants";
import ImmoPage from "./pages/ImmoPage";
import FinancesPage from "./pages/FinancesPage";
import DocumentsPage from "./pages/DocumentsPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import CreateWorkspacePage from "./pages/workspace/CreateWorkspacePage";

const queryClient = new QueryClient();



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/workspace/create" element={<CreateWorkspacePage />} />
      
      {/* Routes protégées par authentification */}
      <Route 
        element={
          <ProtectedRoute />
        }
      >
        {/* Routes protégées par vérification de workspace */}
        <Route element={<WorkspaceProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="locataires/*" element={<TenantsPage />} />
            <Route path="immobiliers" element={<ImmoPage />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="parametres" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <WorkspaceProvider>
          <OwnerProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </OwnerProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
