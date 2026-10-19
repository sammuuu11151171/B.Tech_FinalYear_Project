import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
  };

  const current = configs[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border ${current.bg} ${className}`}
    >
      {current.icon}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
    </div>
  );
};
