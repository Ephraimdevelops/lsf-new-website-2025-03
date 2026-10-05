import { useConvexAuth, useMutation } from "convex/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./backend/api";
import { useUser } from "./auth";

type AccountSyncStatus = "waiting" | "syncing" | "ready" | "error";
const AccountSyncContext = createContext<{ status: AccountSyncStatus; ready: boolean; retry: () => void } | null>(null);

export function useAccountSync() {
  const value = useContext(AccountSyncContext);
  if (!value) throw new Error("Account sync provider is missing");
  return value;
}

export function AccountSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const syncUser = useMutation(api.users.syncUser);
  const [status, setStatus] = useState<AccountSyncStatus>("waiting");
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failures, setFailures] = useState(0);
  const retry = useCallback(() => { setFailures(0); setAttempt((value) => value + 1); }, []);
  const userId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name = user?.fullName || user?.username || user?.firstName || "Haki Yangu user";
  const imageUrl = user?.imageUrl;

  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !userId) {
      setStatus("waiting");
      setSyncedUserId(null);
      return;
    }
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    setStatus("syncing");
    void syncUser({
      clerkId: userId,
      name,
      imageUrl,
    }).then(() => {
      if (active) {
        setSyncedUserId(userId);
        setStatus("ready");
      }
    }).catch((error) => {
      if (!active) return;
      console.warn("Failed to sync Clerk user to Convex", error);
      if (failures < 2) {
        retryTimer = setTimeout(() => setFailures((value) => value + 1), 1000 * 2 ** failures);
      } else {
        setStatus("error");
      }
    });
    return () => { active = false; if (retryTimer) clearTimeout(retryTimer); };
  }, [isLoaded, isAuthenticated, syncUser, userId, email, name, imageUrl, attempt, failures]);

  const ready = isAuthenticated && !!userId && syncedUserId === userId && status === "ready";
  const value = useMemo(() => ({ status, ready, retry }), [status, ready, retry]);
  return <AccountSyncContext.Provider value={value}>{children}</AccountSyncContext.Provider>;
}
