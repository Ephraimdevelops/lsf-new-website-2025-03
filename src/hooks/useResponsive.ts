
import { useState, useEffect } from 'react';

interface BreakpointValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
}

export const useResponsive = (): BreakpointValues => {
  const [breakpoint, setBreakpoint] = useState<BreakpointValues>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLarge: false,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1280,
        isLarge: width >= 1280,
      });
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};
