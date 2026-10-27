import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from './backend/api';
export function usePresenceHeartbeat(ready: boolean) {
  const prefs = useQuery(api.presence.preferences, ready ? {} : 'skip');
  const heartbeat = useMutation(api.presence.heartbeat);
  useEffect(() => {
    if (!ready || !prefs?.sharePresence) return;
    const sessionId = 'mobile-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    let sequence = 0;
    const send = () => void heartbeat({ sessionId, sequence: ++sequence, surface: 'mobile', foreground: AppState.currentState === 'active' && (typeof document === 'undefined' || document.visibilityState === 'visible') }).catch(() => undefined);
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', send);
    send(); const timer = setInterval(send, 30_000);
    const subscription = AppState.addEventListener('change', send);
    return () => { clearInterval(timer); subscription.remove(); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', send); void heartbeat({ sessionId, sequence: ++sequence, surface: 'mobile', foreground: false }).catch(() => undefined); };
  }, [ready, prefs?.sharePresence, heartbeat]);
}
