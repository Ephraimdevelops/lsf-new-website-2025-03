
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Users, ArrowRight, Shield } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

const Login = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);
  const syncUser = useMutation(api.users.syncUser);

  // Sync user to Convex on login
  useEffect(() => {
    if (isSignedIn && user === null) {
      // User signed in but not in Convex yet - will be handled by Clerk webhook or first query
    }
  }, [isSignedIn, user]);

  // If authenticated and user data is loaded, redirect based on role
  if (isLoaded && isSignedIn && user !== undefined) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "paralegal") {
      return <Navigate to="/dashboard/paralegal" replace />;
    }
    if (user?.role === "staff") {
      return <Navigate to="/dashboard/staff" replace />;
    }
    if (user?.role === "stakeholder") {
      return <Navigate to="/dashboard/stakeholder" replace />;
    }
    // Regular users go to their dashboard
    return <Navigate to="/dashboard/user" replace />;
  }

  // Loading state
  if (isLoaded && isSignedIn && user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary/95 to-blue-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex gap-12 items-center justify-center">
        {/* Left Side - Simple Branding */}
        <div className="hidden lg:block w-1/2 space-y-6">
          <Link to="/" className="inline-block">
            <img
              src="/logo.svg"
              alt="LSF"
              className="h-12 w-auto"
            />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Welcome back to LSF
          </h1>
          <p className="text-lg text-gray-600">
            Access legal resources and manage your activities in one place.
          </p>
        </div>

        {/* Right Side - Clean Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.svg"
                alt="LSF"
                className="h-10 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          </div>

          <div className="text-center mb-6 hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900">Sign In to Dashboard</h2>
          </div>
          <SignIn
            signUpUrl="/signup"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 border-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white rounded-lg",
                footerActionLink: "text-primary hover:text-primary/80 font-medium",
                formFieldInput: "border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3",
                formFieldLabel: "text-gray-700 font-medium text-sm mb-1",
                identityPreviewText: "text-gray-600",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                footer: "hidden",
              }
            }}
          />

          <div className="w-full mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
