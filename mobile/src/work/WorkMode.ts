import { useCallback, useSyncExternalStore } from "react";
import { useAuth } from "../auth";
type Mode = "work" | "personal";
const modes = new Map<string, Mode>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
/** Presentation preference only; all data access remains authorised by Convex. */
export function useWorkMode() {
  const { userId } = useAuth();
  const key = userId ?? "guest";
  const mode = useSyncExternalStore(subscribe, () => modes.get(key) ?? "work", () => "work" as Mode);
  const setMode = useCallback((next: Mode) => { if ((modes.get(key) ?? "work") === next) return; modes.set(key, next); listeners.forEach(listener => listener()); }, [key]);
  return { mode, setMode };
}
