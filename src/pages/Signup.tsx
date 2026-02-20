import * as SignUp from "@clerk/elements/sign-up";
import * as Clerk from "@clerk/elements/common";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { ChevronRight } from "lucide-react";

export default function Signup() {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.current);

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
        {/* Cinematic Centered Logo */}
        <Link to="/" className="mb-10 hover:opacity-80 transition-opacity">
          <img
            src="/lovable-uploads/c7c6a992-0b2f-4131-b0db-6a75a7c2e391.png"
            alt="LSF Logo"
            className="h-16 md:h-20 w-auto drop-shadow-sm"
          />
        </Link>

        {/* The True Custom Form Container */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[28px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-10 flex flex-col items-center">

          <SignUp.Root fallback={<div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>}>

            {/* STEP 1: Email, Password & Social */}
            <SignUp.Step name="start" className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Create an account
                </h1>
                <p className="text-[15px] text-gray-500">
                  Join the LSF community today
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <Clerk.Connection
                  name="google"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-[14px] font-semibold text-gray-700 shadow-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  Google
                </Clerk.Connection>
                <Clerk.Connection
                  name="facebook"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-[14px] font-semibold text-gray-700 shadow-sm"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-5 h-5" alt="Facebook" />
                  Facebook
                </Clerk.Connection>
              </div>

              <div className="flex items-center justify-center w-full relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <span className="relative bg-white px-4 text-xs tracking-widest text-gray-400 font-semibold uppercase">Or continue with</span>
              </div>

              {/* Sign Up Form */}
              <div className="flex flex-col gap-4">
                <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                  <Clerk.Label className="text-sm font-semibold text-gray-700 ml-1">Email address</Clerk.Label>
                  <Clerk.Input className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[15px]" type="email" placeholder="you@example.com" />
                  <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                </Clerk.Field>

                <Clerk.Field name="password" className="flex flex-col gap-2 mt-1">
                  <Clerk.Label className="text-sm font-semibold text-gray-700 ml-1">Create Password</Clerk.Label>
                  <Clerk.Input className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[15px]" type="password" placeholder="••••••••" />
                  <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                </Clerk.Field>

                {/* Adding role metadata for LSF specifically! */}
                <input type="hidden" name="unsafe_metadata.role" value="user" />

                <SignUp.Action
                  submit
                  className="w-full py-4 px-4 bg-primary text-white rounded-2xl font-bold text-[15px] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md mt-4"
                >
                  Create Account
                </SignUp.Action>

                <div id="clerk-captcha" />
              </div>
            </SignUp.Step>

            {/* STEP 2: Verification */}
            <SignUp.Step name="verifications" className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <SignUp.Strategy name="email_code">
                <div className="w-full flex flex-col gap-8">
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                      Verify email
                    </h1>
                    <p className="text-[15px] text-gray-500">
                      We sent a verification code to your email address.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <Clerk.Field name="code" className="flex flex-col gap-2">
                      <Clerk.Label className="text-sm font-semibold text-gray-700 ml-1">Verification Code</Clerk.Label>
                      <Clerk.Input className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-center text-xl tracking-widest font-mono" type="text" placeholder="123456" />
                      <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                    </Clerk.Field>

                    <SignUp.Action
                      submit
                      className="w-full py-4 px-4 bg-primary text-white rounded-2xl font-bold text-[15px] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md mt-2"
                    >
                      Verify
                    </SignUp.Action>
                  </div>
                </div>
              </SignUp.Strategy>
            </SignUp.Step>
          </SignUp.Root>
        </div>

        {/* Global Footer Links beneath the card for super-clean aesthetic */}
        <div className="mt-8 text-center space-y-6 w-full">
          <p className="text-[15px] text-gray-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>

          <div className="flex items-center justify-center gap-3 opacity-60">
            <div className="w-8 h-px bg-gray-400"></div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em]">Professionals</span>
            <div className="w-8 h-px bg-gray-400"></div>
          </div>

          <Link
            to="/paralegal-signup"
            className="inline-flex items-center justify-center gap-2 text-[14px] text-gray-500 hover:text-primary font-semibold transition-colors"
          >
            <span>Apply as a Paralegal</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
