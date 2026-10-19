import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading content...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 text-slate-500 gap-3"
    >
      <div
        className={`${sizeMap[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
