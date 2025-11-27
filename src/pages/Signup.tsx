
import { SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary-teal/5 p-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignUp
            signInUrl="/login"
            forceRedirectUrl="/admin" // Or dashboard
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
