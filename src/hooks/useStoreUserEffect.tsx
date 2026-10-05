import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type AccountSyncStatus = "waiting" | "syncing" | "ready" | "error";
type AccountSyncState = { status: AccountSyncStatus; retry: () => void };
const AccountSyncContext = createContext<AccountSyncState | null>(null);

export function useAccountSync() {
    const value = useContext(AccountSyncContext);
    if (!value) throw new Error("Account sync provider is missing");
    return value;
}

export function AccountSyncProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.syncUser);
    const [status, setStatus] = useState<AccountSyncStatus>("waiting");
    const [attempt, setAttempt] = useState(0);
    const [failures, setFailures] = useState(0);
    const retry = useCallback(() => { setFailures(0); setAttempt((value) => value + 1); }, []);
    const userId = user?.id;
    const name = user?.fullName || user?.username || user?.firstName || "User";
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const imageUrl = user?.imageUrl;

    useEffect(() => {
        if (!isLoaded || !isAuthenticated || !userId) {
            setStatus("waiting");
            return;
        }
        let active = true;
        let retryTimer: ReturnType<typeof setTimeout> | undefined;
        setStatus("syncing");
        void storeUser({ clerkId: userId, name, imageUrl })
            .then(() => { if (active) setStatus("ready"); })
            .catch((error) => {
                console.error("Failed to connect account to Convex:", error);
                if (!active) return;
                if (failures < 2) retryTimer = setTimeout(() => setFailures((value) => value + 1), 1000 * 2 ** failures);
                else setStatus("error");
            });
        return () => { active = false; if (retryTimer) clearTimeout(retryTimer); };
    }, [isLoaded, isAuthenticated, userId, name, email, imageUrl, attempt, failures, storeUser]);

    const value = useMemo(() => ({ status, retry }), [status, retry]);
    return <AccountSyncContext.Provider value={value}>{children}</AccountSyncContext.Provider>;
}
