import { useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
export function usePresenceHeartbeat(ready: boolean) {
  const prefs = useQuery(api.presence.preferences, ready ? {} : 'skip');
  const heartbeat = useMutation(api.presence.heartbeat);
  useEffect(() => {
    if (!ready || !prefs?.sharePresence) return;
    const sessionId = crypto.randomUUID();
    let sequence = 0;
    const send = () => void heartbeat({ sessionId, sequence: ++sequence, surface: 'web', foreground: document.visibilityState === 'visible' }).catch(() => undefined);
    send(); const timer = setInterval(send, 30_000);
    document.addEventListener('visibilitychange', send);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', send); void heartbeat({ sessionId, sequence: ++sequence, surface: 'web', foreground: false }).catch(() => undefined); };
  }, [ready, prefs?.sharePresence, heartbeat]);
}
