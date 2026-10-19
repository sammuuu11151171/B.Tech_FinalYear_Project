import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const StudentLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner label="Authenticating session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
