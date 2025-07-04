import { useState, useEffect } from 'react';

const WEBHOOK_URL = 'https://lsfai.app.n8n.cloud/webhook-test/43fc1f39-c9ef-4313-afce-c266d0cd81b5';
const CHECK_INTERVAL = 30000; // 30 seconds

export const useChatStatus = () => {
  const [isOnline, setIsOnline] = useState(true); // Start optimistic
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = async () => {
    try {
      // Send a minimal test message to check if the webhook is responding
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'status_check',
          timestamp: new Date().toISOString()
        })
      });

      const isCurrentlyOnline = response.ok;
      setIsOnline(isCurrentlyOnline);
      setLastCheck(new Date());
      
      return isCurrentlyOnline;
    } catch (error) {
      setIsOnline(false);
      setLastCheck(new Date());
      return false;
    }
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