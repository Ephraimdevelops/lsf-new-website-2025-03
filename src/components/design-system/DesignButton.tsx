
import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/styles/designTokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface DesignButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const DesignButton = ({ 
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}: DesignButtonProps) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-teal hover:bg-secondary-teal/90 active:bg-secondary-teal/80 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white active:bg-primary-600',
    ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  };

  return (
    <button
      className={cn(
        'font-heading font-semibold transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default DesignButton;
