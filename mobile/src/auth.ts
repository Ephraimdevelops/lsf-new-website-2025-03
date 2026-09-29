import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/clerk-expo";
import { clerkReady } from "./config";

export { useSignIn, useSignUp } from "@clerk/clerk-expo";

// The Clerk configuration is fixed for the lifetime of this app bundle. These
// hooks let public screens render against Convex without a Clerk provider.
export function useAuth(): ReturnType<typeof useClerkAuth> {
  if (clerkReady) return useClerkAuth();
  return { isLoaded: true, isSignedIn: false, signOut: async () => undefined } as unknown as ReturnType<typeof useClerkAuth>;
}

export function useUser(): ReturnType<typeof useClerkUser> {
  if (clerkReady) return useClerkUser();
  return { isLoaded: true, isSignedIn: false, user: null } as unknown as ReturnType<typeof useClerkUser>;
}
