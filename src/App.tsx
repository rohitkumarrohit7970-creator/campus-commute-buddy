import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBuses = lazy(() => import("./pages/admin/AdminBuses"));
const AdminRoutes = lazy(() => import("./pages/admin/AdminRoutes"));
const AdminStudents = lazy(() => import("./pages/admin/AdminStudents"));
const AdminDrivers = lazy(() => import("./pages/admin/AdminDrivers"));
const AdminSchedule = lazy(() => import("./pages/admin/AdminSchedule"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const BookSeat = lazy(() => import("./pages/student/BookSeat"));
const MyBooking = lazy(() => import("./pages/student/MyBooking"));
const TrackBus = lazy(() => import("./pages/student/TrackBus"));
const DriverDashboard = lazy(() => import("./pages/driver/DriverDashboard"));
const DriverRoute = lazy(() => import("./pages/driver/DriverRoute"));
const DriverSchedule = lazy(() => import("./pages/driver/DriverSchedule"));

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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading Campus Ride...</div>}>
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
        <Route path="/driver/route" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverRoute />
          </ProtectedRoute>
        } />
        <Route path="/driver/schedule" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverSchedule />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppDataProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </AppDataProvider>
  </QueryClientProvider>
);

export default App;
