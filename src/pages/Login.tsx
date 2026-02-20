
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

const Login = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);
  const syncUser = useMutation(api.users.syncUser);

  // Sync user to Convex on login
  useEffect(() => {
    if (isSignedIn && user === null) {
      // User signed in but not in Convex yet - will be handled by Clerk webhook or first query
      // In a real app, you might want to call syncUser here as a fallback
    }
  }, [isSignedIn, user]);

  // If authenticated and user data is loaded, redirect based on role
  if (isLoaded && isSignedIn && user !== undefined) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "paralegal") return <Navigate to="/dashboard/paralegal" replace />;
    if (user?.role === "staff") return <Navigate to="/dashboard/staff" replace />;
    if (user?.role === "stakeholder") return <Navigate to="/dashboard/stakeholder" replace />;
    return <Navigate to="/dashboard/user" replace />;
  }

  // Loading state
  if (isLoaded && isSignedIn && user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">

        {/* Logo and Header */}
        <Link to="/" className="mb-8 hover:opacity-90 transition-opacity">
          <img
            src="/lsf-favicon.png"
            alt="LSF Logo"
            className="h-16 w-auto drop-shadow-sm"
          />
        </Link>

        {/* Primary Auth Card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 p-8 sm:p-10 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to access your LSF dashboard
            </p>
          </div>

          <div className="w-full">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none p-0 m-0 w-full",
                  header: "hidden", // We built our own header above
                  logoBox: "hidden",
                  footer: "hidden", // Hides the "Secured by Clerk" badge
                  main: "gap-6",
                  socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl py-3.5 shadow-sm transition-all relative overflow-hidden",
                  socialButtonsBlockButtonText: "font-medium text-sm z-10 relative",
                  socialButtonsProviderIcon: "w-5 h-5",
                  dividerRow: "my-6",
                  dividerLine: "bg-gray-100",
                  dividerText: "text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white px-3",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-white rounded-2xl py-3.5 font-semibold shadow-sm transition-all mt-2",
                  formFieldInput: "border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-4 py-3.5 w-full text-[15px] transition-all bg-gray-50/30 hover:bg-white outline-none",
                  formFieldLabel: "text-gray-700 font-medium text-sm mb-2",
                  identityPreviewEditButton: "text-primary hover:text-primary/80 transition-colors",
                  formFieldAction: "text-primary hover:text-primary/80 text-sm font-medium transition-colors",
                  form: "grid gap-5",
                  alertText: "text-red-500 text-sm mt-1",
                  alertText__danger: "text-red-500",
                  formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-600",
                  identityPreview: "border border-gray-200 rounded-2xl bg-gray-50/50 p-3",
                  identityPreviewText: "text-gray-700 font-medium",
                }
              }}
            />
          </div>
        </div>

        {/* Unified Footer Links Group */}
        <div className="mt-8 text-center space-y-5 w-full px-4">
          <p className="text-[15px] text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Professional Access</span>
            <div className="w-12 h-px bg-gray-200"></div>
          </div>

          <Link
            to="/paralegal-login"
            className="inline-flex items-center justify-center gap-2 text-[15px] text-gray-500 hover:text-primary font-medium transition-colors"
          >
            <span>Paralegal Login</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

