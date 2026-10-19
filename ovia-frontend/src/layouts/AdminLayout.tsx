import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner label="Validating administrative security token..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
