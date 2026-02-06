
import { SignUp, useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { api } from "../../convex/_generated/api";

const Signup = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);

  // If already authenticated, redirect based on role
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Creating your account...</p>
        </div>
      </div>
    );
  }

  const benefits = [
    { text: "Access legal resources" },
    { text: "Save important content" },
    { text: "Personalized dashboard" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Benefits */}
          <div className="hidden lg:block space-y-8">
            <div>
              <Link to="/" className="inline-block mb-6">
                <img
                  src="/logo.svg"
                  alt="LSF"
                  className="h-12 w-auto"
                />
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                Join the Community
              </h1>
              <p className="text-lg text-gray-600">
                Create your free account to access resources and connect with our network.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
            </div>

            <SignUp
              signInUrl="/login"
              forceRedirectUrl="/dashboard/user"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none bg-transparent w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg py-3",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-white rounded-lg py-3 font-semibold",
                  footerActionLink: "text-primary hover:text-primary/80 font-medium",
                  formFieldInput: "border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 w-full",
                  formFieldLabel: "text-gray-700 font-medium text-sm mb-1.5",
                  formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
                  formFieldAction: "text-primary hover:text-primary/80 text-sm font-medium",
                  footer: "hidden",
                  form: "space-y-4",
                }
              }}
            />

            <div className="w-full mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
