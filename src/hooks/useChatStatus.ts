import { useState, useEffect } from 'react';

const CHECK_INTERVAL = 30000; // 30 seconds

export const useChatStatus = () => {
  const [isOnline, setIsOnline] = useState(true); // Start optimistic
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = async () => {
    const isCurrentlyOnline = navigator.onLine;
    setIsOnline(isCurrentlyOnline);
    setLastCheck(new Date());
    return isCurrentlyOnline;
  };

  useEffect(() => {
    // Initial check
    checkStatus();

    // Set up periodic checks
    const interval = setInterval(checkStatus, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    lastCheck,
    checkStatus
  };
};
