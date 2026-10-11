import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'accent' | 'muted';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-border text-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={`inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
