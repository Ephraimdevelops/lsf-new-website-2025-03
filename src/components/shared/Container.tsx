
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const Container = ({
  children,
  size = 'xl',
  className = ''
}: ContainerProps) => {
  // Using Tailwind's container class to match Header exactly
  // This ensures content aligns perfectly with the logo
  return (
    <div className={cn(
      'container mx-auto px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};

export default Container;
