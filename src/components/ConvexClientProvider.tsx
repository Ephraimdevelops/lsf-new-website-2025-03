import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Safely try multiple ways Vite might expose the env vars on Vercel
const convexUrl =
    import.meta.env.VITE_CONVEX_URL ||
    import.meta.env.VITE_NEXT_PUBLIC_CONVEX_URL ||
    process.env.NEXT_PUBLIC_CONVEX_URL ||
    "";

const publishableKey =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    import.meta.env.VITE_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "";

// Prevent module-level crashes
let convex: ConvexReactClient | null = null;
if (convexUrl) {
    convex = new ConvexReactClient(convexUrl);
} else {
    console.error("CRITICAL: Missing NEXT_PUBLIC_CONVEX_URL. Application will fail to load data.");
}

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
    // Graceful Error UI for Deployment Issues
    if (!publishableKey || !convexUrl || !convex) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-lg w-full">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-xl font-bold">Deployment Configuration Error</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        The application could not start because required environment variables are missing on the server.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <ul className="space-y-2">
                            <li className={!convexUrl ? "text-red-600 font-bold" : "text-green-600"}>
                                NEXT_PUBLIC_CONVEX_URL: {convexUrl ? "Set" : "MISSING"}
                            </li>
                            <li className={!publishableKey ? "text-red-600 font-bold" : "text-green-600"}>
                                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {publishableKey ? "Set" : "MISSING"}
                            </li>
                        </ul>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        Please verify your Vercel Project Settings (Environment Variables).
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            appearance={{
                layout: {
                    unsafe_disableDevelopmentModeWarnings: true
                }
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};
