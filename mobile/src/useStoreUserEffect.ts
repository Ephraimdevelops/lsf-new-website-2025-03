import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "./backend/api";
import { useUser } from "./auth";

export function useStoreUserEffect() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const lastSyncedClerkId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user || lastSyncedClerkId.current === user.id) return;

    lastSyncedClerkId.current = user.id;
    const email = user.primaryEmailAddress?.emailAddress ?? "";
    const name = user.fullName || user.username || user.firstName || "Haki Yangu user";

    void syncUser({
      clerkId: user.id,
      email,
      name,
      imageUrl: user.imageUrl,
    }).catch((error) => {
      lastSyncedClerkId.current = null;
      console.warn("Failed to sync Clerk user to Convex", error);
    });
  }, [isLoaded, syncUser, user]);
}
