import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBuses from "./pages/admin/AdminBuses";
import AdminRoutes from "./pages/admin/AdminRoutes";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminSchedule from "./pages/admin/AdminSchedule";
import StudentDashboard from "./pages/student/StudentDashboard";
import BookSeat from "./pages/student/BookSeat";
import MyBooking from "./pages/student/MyBooking";
import TrackBus from "./pages/student/TrackBus";
import DriverDashboard from "./pages/driver/DriverDashboard";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
};

// Redirect if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/buses" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminBuses />
        </ProtectedRoute>
      } />
      <Route path="/admin/routes" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminStudents />
        </ProtectedRoute>
      } />
      <Route path="/admin/drivers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDrivers />
        </ProtectedRoute>
      } />
      <Route path="/admin/schedule" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSchedule />
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/book" element={
        <ProtectedRoute allowedRoles={['student']}>
          <BookSeat />
        </ProtectedRoute>
      } />
      <Route path="/student/booking" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MyBooking />
        </ProtectedRoute>
      } />
      <Route path="/student/track" element={
        <ProtectedRoute allowedRoles={['student']}>
          <TrackBus />
        </ProtectedRoute>
      } />
      
      {/* Driver Routes */}
      <Route path="/driver" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <DriverDashboard />
        </ProtectedRoute>
      } />
      <Route path="/driver/*" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <DriverDashboard />
        </ProtectedRoute>
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
