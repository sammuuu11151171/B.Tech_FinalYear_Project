import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Sparkles,
  TrendingUp,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentSidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/student', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: '/student/learn', label: 'Learn ISL', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/student/quizzes', label: 'Quizzes', icon: <HelpCircle className="w-5 h-5" /> },
    { to: '/student/ai-tutor', label: 'AI Tutor', icon: <Sparkles className="w-5 h-5" /> },
    { to: '/student/progress', label: 'My Progress', icon: <TrendingUp className="w-5 h-5" /> },
    { to: '/student/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          OV
        </div>
        <div>
          <span className="font-bold text-base text-slate-900 block leading-tight">OVIA Portal</span>
          <span className="text-[11px] font-medium text-indigo-600 uppercase tracking-wider">Student Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 mb-2">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.full_name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
