import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to automatically sync Clerk users to Convex database
 * This ensures every authenticated user has a record in Convex
 */
export function useStoreUserEffect() {
    const { user, isLoaded } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.syncUser);

    useEffect(() => {
        // Wait for Clerk to load
        if (!isLoaded || !isAuthenticated) return;

        // No user authenticated
        if (!user) return;

        const syncUserToConvex = async () => {
            try {
                await storeUser({
                    name: user.fullName || user.username || user.firstName || "User",
                    email: user.primaryEmailAddress?.emailAddress || "",
                    clerkId: user.id,
                    imageUrl: user.imageUrl,
                });
            } catch (error) {
                console.error("Failed to sync user to Convex:", error);
            }
        };

        syncUserToConvex();
    }, [user, isLoaded, isAuthenticated, storeUser]);
}
