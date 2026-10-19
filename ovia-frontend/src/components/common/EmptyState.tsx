import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center max-w-md mx-auto">
      {icon && <div className="p-3 bg-white rounded-full shadow-xs text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
