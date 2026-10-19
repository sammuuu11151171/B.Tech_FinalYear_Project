import React from 'react';
import { AccessibilityToolbar } from '../accessibility/AccessibilityToolbar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <AccessibilityToolbar />

        {user && (
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
              {user.full_name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {user.full_name}
              </span>
              <Badge
                variant={user.role === 'admin' ? 'danger' : 'indigo'}
                size="sm"
              >
                {user.role}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
