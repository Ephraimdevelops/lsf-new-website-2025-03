
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'secondary-orange' | 'secondary-teal' | 'secondary-yellow';
  animated?: boolean;
}

const ProgressIndicator = ({ 
  value, 
  max, 
  className = '', 
  showLabel = true, 
  label,
  color = 'primary',
  animated = true
}: ProgressIndicatorProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animated]);

  const colorClasses = {
    primary: 'bg-primary',
    'secondary-orange': 'bg-secondary-orange',
    'secondary-teal': 'bg-secondary-teal',
    'secondary-yellow': 'bg-secondary-yellow'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-gray">
            {label || `Progress`}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-neutral-light rounded-full h-2.5 overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', colorClasses[color])}
          style={{ width: `${animatedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
