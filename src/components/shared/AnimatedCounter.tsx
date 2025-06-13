
import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = '' 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const isVisible = useIntersectionObserver(countRef, { threshold: 0.5 });

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
      const increment = end / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, hasStarted, end, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <span ref={countRef} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
