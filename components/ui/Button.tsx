import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wider uppercase';

  const variantClasses = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99] shadow-sm',
    outline:
      'border border-border bg-transparent text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-[0.99]',
    secondary:
      'bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.99]',
    ghost:
      'bg-transparent text-foreground hover:bg-surface-hover active:scale-[0.99]',
  };

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-sm tracking-widest',
    md: 'text-xs sm:text-sm px-6 py-3 rounded-sm font-semibold tracking-widest',
    lg: 'text-sm sm:text-base px-8 py-4 rounded-md font-bold tracking-widest',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
