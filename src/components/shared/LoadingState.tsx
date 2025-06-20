
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingState = ({ className, size = 'md', text = 'Loading...' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="mt-4 text-sm text-neutral-gray font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
