import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'indigo';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
