
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
    const access = useQuery(api.users.currentAccess);

    const isLoading = !isLoaded || (access === undefined && isSignedIn);

    if (isLoading) {
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

    if (!access) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.some((role) => access.roles.includes(role as typeof access.roles[number]))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
