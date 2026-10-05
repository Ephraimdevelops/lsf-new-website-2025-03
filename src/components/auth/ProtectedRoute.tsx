
import { useAuth } from "@clerk/clerk-react";
import { useConvexAuth, useQuery } from "convex/react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { ReactNode, useEffect, useState } from "react";
import { useAccountSync } from "@/hooks/useStoreUserEffect";
import { dashboardPath } from "./dashboardPath";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const location = useLocation();
    const { isLoaded, isSignedIn } = useAuth();
    const { isAuthenticated } = useConvexAuth();
    const { status, retry } = useAccountSync();
    const access = useQuery(api.users.currentAccess, isAuthenticated ? {} : "skip");
    const [waitedTooLong, setWaitedTooLong] = useState(false);
    useEffect(() => {
        if ((isLoaded && !isSignedIn) || (isAuthenticated && status === "ready" && !!access)) {
            setWaitedTooLong(false);
            return;
        }
        const timer = window.setTimeout(() => setWaitedTooLong(true), 15000);
        return () => window.clearTimeout(timer);
    }, [isLoaded, isSignedIn, isAuthenticated, status, access]);

    if (!isLoaded && !waitedTooLong) return <div role="status" className="flex min-h-screen items-center justify-center">Verifying access...</div>;
    if (isLoaded && !isSignedIn) return <Navigate to={location.pathname === "/notifications" ? "/login?returnTo=%2Fnotifications" : "/login"} replace />;

    if (status === "error" || waitedTooLong) {
        return (
            <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
                <h1 className="text-xl font-semibold">Your account could not be connected</h1>
                <p className="max-w-md text-sm text-gray-600">Check your connection and try again. If your account was deactivated, contact LSF support.</p>
                <button type="button" onClick={() => { setWaitedTooLong(false); retry(); }} className="rounded-lg bg-primary px-5 py-2 font-semibold text-white">Retry</button>
                <button type="button" onClick={() => window.location.reload()} className="text-sm font-semibold text-primary underline">Reload app</button>
            </div>
        );
    }

    if (!isAuthenticated || status !== "ready" || !access) {
        return <div role="status" className="flex min-h-screen items-center justify-center">Connecting your secure account...</div>;
    }

    if (allowedRoles && !allowedRoles.some((role) => access.roles.includes(role as typeof access.roles[number]))) {
        const destination = dashboardPath(access.roles);
        return destination === window.location.pathname
            ? <div role="alert" className="flex min-h-screen items-center justify-center p-6 text-center">This workspace is unavailable for your account. Contact LSF support if you believe this is an error.</div>
            : <Navigate to={destination} replace />;
    }

    return <>{children}</>;
};
