import React from 'react';

export type BadgeVariant = 'amber' | 'emerald' | 'rose' | 'indigo' | 'slate' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    amber: 'bg-amber-100 text-amber-800 border-amber-200/80',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200/80',
    rose: 'bg-rose-100 text-rose-800 border-rose-200/80',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-tight transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};
