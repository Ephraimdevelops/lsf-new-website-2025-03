import { useMutation } from "convex/react";
import { api } from "./backend/api";
import { useAuth } from "./auth";

export function useSafeSignOut() {
  const { signOut } = useAuth();
  const disableMyPushTokens = useMutation(api.notifications.disableMyPushTokens);
  return async () => {
    // Revoke device delivery while we still have the user's authenticated session.
    await disableMyPushTokens({});
    await signOut();
  };
}
