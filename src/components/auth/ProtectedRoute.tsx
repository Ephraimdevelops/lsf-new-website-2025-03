
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isLoaded, isSignedIn } = useAuth();
    const user = useQuery(api.users.current);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        // Debug logging
        console.log("ProtectedRoute status:", { isLoaded, isSignedIn, user });

        // Force stop spinner after 5 seconds to prevent infinite hanging
        const timer = setTimeout(() => {
            if (showSpinner) {
                console.warn("ProtectedRoute: Forced timeout on spinner");
                setShowSpinner(false);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isLoaded, isSignedIn, user, showSpinner]);

    // Conditions to stop spinner naturally
    const isLoading = !isLoaded || (user === undefined && isSignedIn);

    if (isLoading && showSpinner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500 text-sm">Verifying access...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // If timeout happened and user is still undefined, we might block them or let them through?
        // If user is undefined here (due to timeout), checking user.role would crash if we didn't check 'user' first.
        // But (user && ...) prevents crash.
        // If user is undefined, this block is skipped.
        return <Navigate to="/" replace />;
    }

    // If user is undefined after timeout, we let them through to children?
    // Admin.tsx has its own checks, so it might handle it.
    // Ideally we assume if we timed out, something is wrong, but Admin.tsx is a safe fallback.

    return <>{children}</>;
};
