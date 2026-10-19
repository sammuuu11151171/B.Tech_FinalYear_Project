import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 ${
        hoverable ? 'hover:shadow-md hover:border-slate-300 transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
