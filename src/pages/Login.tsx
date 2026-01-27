
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { api } from "../../convex/_generated/api";

const Login = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);

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
    // Default fallback for regular users or unknown roles
    return <Navigate to="/" replace />;
  }

  // If loading user data but clerk is loaded/signed in, show nothing or spinner
  if (isLoaded && isSignedIn && user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary-teal/5 p-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignIn
            signUpUrl="/signup"
          // We remove forceRedirectUrl to let our component logic handle the routing after sign-in state updates
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
