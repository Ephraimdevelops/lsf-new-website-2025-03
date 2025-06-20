
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  className 
}: ErrorStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
