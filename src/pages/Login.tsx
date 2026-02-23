import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function Login() {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);

  // Sync logic omitted for brevity in UI focus, but it's handled by generic state or webhooks
  useEffect(() => {
    // any sync needs
  }, [isSignedIn, user]);

  if (isLoaded && isSignedIn && user !== undefined) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "paralegal") return <Navigate to="/dashboard/paralegal" replace />;
    if (user?.role === "staff") return <Navigate to="/dashboard/staff" replace />;
    if (user?.role === "stakeholder") return <Navigate to="/dashboard/stakeholder" replace />;
    return <Navigate to="/dashboard/user" replace />;
  }

  if (isLoaded && isSignedIn && user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFDFD]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden p-4 sm:p-8">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">

        <Link to="/" className="w-full flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors self-start ml-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="w-full flex flex-col items-center">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/signup"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoImageUrl: "/lovable-uploads/LSF Favicon.png"
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent p-0 m-0 w-full max-w-none",
                headerTitle: "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-2",
                headerSubtitle: "text-[15px] text-gray-500",
                logoImage: "h-16 md:h-20 w-auto drop-shadow-sm mb-2",
                footerAction: "hidden", // Hide clerk sign up link so we can use our custom one 
                formButtonPrimary: "w-full py-4 px-4 bg-primary text-white rounded-2xl font-bold text-[15px] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md mt-2",
                formFieldInput: "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[15px] shadow-none",
                formFieldLabelRow: "mb-2",
                formFieldLabel: "text-sm font-semibold text-gray-700 ml-1",
                socialButtonsBlockButton: "py-3 border border-gray-200 bg-white rounded-2xl hover:bg-gray-50 text-gray-600 font-semibold transition-all shadow-sm",
                socialButtonsBlockButtonText: "font-semibold text-[14px] text-gray-700",
                dividerRow: "my-8",
                dividerText: "text-xs tracking-widest text-gray-400 font-semibold uppercase",
                identityPreview: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4",
                formFieldAction: "text-primary hover:text-primary/80 font-medium text-sm",
                otpCodeFieldInput: "w-12 h-12 text-lg font-bold rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                alertText: "text-red-500 font-medium text-sm",
                alertIcon: "text-red-500",
                formContainer: "gap-4",
              }
            }}
          />

          {/* Custom Footer Links to blend perfectly with the Clerk box */}
          <div className="mt-8 space-y-5 w-full">
            <div className="text-center text-[15px] text-gray-600">
              Don't have an account? <Link to="/signup" className="text-secondary-pink font-bold hover:underline transition-all">Sign up</Link>
            </div>
            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute inset-0 flex items-center pt-2"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white/0 px-4 mt-2 text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase backdrop-blur-3xl">Professionals</span>
            </div>
            <Link to="/paralegal-login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              Paralegal Login Portal <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
