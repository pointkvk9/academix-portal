import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import CompanyHome from "./pages/CompanyHome";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ExamApplicationForm from "./pages/ExamApplicationForm";
import DonationPage from "./pages/DonationPage";
import MembershipPage from "./pages/MembershipPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function DashboardRouter() {
  const { role, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (role === "admin") return <AdminDashboard />;
  return <StudentDashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<CompanyHome />} />
            <Route path="/exam" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardRouter /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/apply/:examId" element={
              <ProtectedRoute><ExamApplicationForm /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
