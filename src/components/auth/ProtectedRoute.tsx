
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isLoaded, isSignedIn } = useAuth();
    const user = useQuery(api.users.current);

    if (!isLoaded || user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return <>{children}</>;
};
