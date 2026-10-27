import { useLanguage } from "@/providers/LanguageProvider";
import { clerkSw } from "@/i18n/clerkSw";
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
    const { locale } = useLanguage();
    // Graceful Error UI for Deployment Issues
    if (!publishableKey || !convexUrl || !convex) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6"><div role="alert" className="max-w-lg space-y-4 rounded-xl bg-white p-8"><h1 className="text-xl font-semibold">{locale === "sw" ? "Haki Yangu haipatikani kwa sasa" : "Haki Yangu is unavailable right now"}</h1><p>{locale === "sw" ? "Huduma haijafunguka. Jaribu tena baadaye au wasiliana na LSF." : "The service did not open. Try again later or contact LSF."}</p><a className="text-primary underline" href="mailto:info@lsftz.org">info@lsftz.org</a></div></div>
        );
    }

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            localization={locale === "sw" ? clerkSw : { locale: "en-US" }}
            signInUrl="/login"
            signUpUrl="/signup"
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
