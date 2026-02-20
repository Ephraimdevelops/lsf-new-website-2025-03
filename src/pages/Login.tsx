
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
        <div className="w-full bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-8 sm:p-10 pb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to access your LSF dashboard
            </p>
          </div>

          <div className="px-8 sm:px-10 pb-10 w-full flex justify-center">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: "w-full flex justify-center",
                  card: "shadow-none border-none p-0 bg-transparent w-full m-0 max-w-none",
                  header: "hidden", // We built our own header above
                  logoBox: "hidden",
                  footer: "hidden", // Hides the "Secured by Clerk" badge
                  socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl py-3 shadow-sm transition-all",
                  socialButtonsBlockButtonText: "font-medium text-sm",
                  dividerLine: "bg-gray-100",
                  dividerText: "text-gray-400 text-xs font-medium uppercase tracking-wider",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-semibold shadow-sm transition-all",
                  formFieldInput: "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 w-full text-base transition-all bg-gray-50/50 hover:bg-white",
                  formFieldLabel: "text-gray-700 font-medium text-sm mb-1.5",
                  identityPreviewEditButton: "text-primary hover:text-primary/80",
                  formFieldAction: "text-primary hover:text-primary/80 text-sm font-medium",
                  form: "grid gap-4",
                  alertText: "text-red-600 text-sm",
                  alertText__danger: "text-red-600",
                }
              }}
            />
          </div>
        </div>

        {/* Unified Footer Links Group */}
        <div className="mt-8 space-y-4 w-full px-4">
          {/* General Sign Up Redirect */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Paralegal Specific Redirect */}
          <Link
            to="/paralegal-login"
            className="group flex items-center justify-between w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Are you a Paralegal?
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                Access the dedicated paralegal portal
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

