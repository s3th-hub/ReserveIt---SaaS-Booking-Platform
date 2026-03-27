/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, AdminLayout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { ServiceDetails } from './pages/ServiceDetails';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard, AdminBookings, AdminServices } from './pages/AdminPages';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'user' | 'admin' }> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/services/:id" element={<><Navbar /><ServiceDetails /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="user">
            <Navbar />
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute role="admin">
            <AdminLayout><AdminBookings /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute role="admin">
            <AdminLayout><AdminServices /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
