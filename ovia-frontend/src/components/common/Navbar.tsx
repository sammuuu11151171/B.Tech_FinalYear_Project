import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityToolbar } from '../accessibility/AccessibilityToolbar';
import { Button } from './Button';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin' : '/student';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-indigo-600 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <span className="font-bold text-lg tracking-wider">OV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                OVIA
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest hidden sm:inline">
                Inclusive Learning
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/learn" className="hover:text-indigo-600 transition-colors">
              Learn ISL
            </Link>
            <Link to="/quizzes" className="hover:text-indigo-600 transition-colors">
              Quizzes
            </Link>
            <Link to="/ai-tutor" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-indigo-600">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Tutor
            </Link>
          </nav>

          {/* Actions & Accessibility */}
          <div className="flex items-center gap-3">
            <AccessibilityToolbar />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath()}>
                  <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                    Dashboard
                  </Button>
                </Link>
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900">{user.full_name}</p>
                    <Badge variant={user.role === 'admin' ? 'danger' : 'indigo'} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Start Learning
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
