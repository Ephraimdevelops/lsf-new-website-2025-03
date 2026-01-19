import { useState, useEffect } from 'react';

/**
 * useOnlineStatus Hook
 * 
 * Tracks the browser's online/offline status in real-time.
 * Essential for Tanzanian deployment where network connectivity is unreliable.
 * 
 * Usage:
 * ```tsx
 * const isOnline = useOnlineStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 * ```
 */
export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState<boolean>(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => {
            console.log('[Network] Connection restored');
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('[Network] Connection lost');
            setIsOnline(false);
        };

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

export default useOnlineStatus;
