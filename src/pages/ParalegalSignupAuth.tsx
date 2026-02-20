import * as SignUp from "@clerk/elements/sign-up";
import * as Clerk from "@clerk/elements/common";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ParalegalSignupAuth = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-blue-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Back Button */}
                <Link to="/legal-help" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Legal Help</span>
                </Link>

                <div className="grid lg:grid-cols-1 gap-6">
                    <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-6 flex justify-center">
                                <img
                                    src="/lovable-uploads/c7c6a992-0b2f-4131-b0db-6a75a7c2e391.png"
                                    alt="LSF Logo"
                                    className="h-16 md:h-20 w-auto drop-shadow-sm"
                                />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Join as a Paralegal</CardTitle>
                            <CardDescription className="text-gray-600">
                                Create your account to access the paralegal portal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            {/* Benefits List */}
                            <div className="w-full mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                                <p className="font-medium text-green-800 mb-3 text-sm">What you'll get:</p>
                                <ul className="space-y-2">
                                    {[
                                        "Access to your paralegal dashboard",
                                        "Profile visibility to clients",
                                        "Case management tools",
                                        "Training resources"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <SignUp.Root>
                                <SignUp.Step name="start" className="w-full flex flex-col gap-6 w-full max-w-[320px]">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Clerk.Connection name="google" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium">
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                                            Google
                                        </Clerk.Connection>
                                        <Clerk.Connection name="facebook" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-4 h-4" alt="Facebook" />
                                            Facebook
                                        </Clerk.Connection>
                                    </div>

                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                        <span className="relative bg-white px-4 text-xs tracking-widest text-gray-400 font-semibold uppercase">Or continue with email</span>
                                    </div>

                                    <Clerk.Field name="emailAddress" className="space-y-2">
                                        <Clerk.Label className="text-sm font-medium text-gray-700 ml-1">Email address</Clerk.Label>
                                        <Clerk.Input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white" />
                                        <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                                    </Clerk.Field>

                                    <Clerk.Field name="password" className="space-y-2">
                                        <Clerk.Label className="text-sm font-medium text-gray-700 ml-1">Password</Clerk.Label>
                                        <Clerk.Input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white" />
                                        <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                                    </Clerk.Field>

                                    <input type="hidden" name="unsafe_metadata.role" value="paralegal" />

                                    <SignUp.Action submit className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm">
                                        Create Account
                                    </SignUp.Action>

                                    <div id="clerk-captcha" />
                                </SignUp.Step>

                                <SignUp.Step name="verifications" className="w-full flex flex-col gap-6 max-w-[320px]">
                                    <SignUp.Strategy name="email_code">
                                        <div className="space-y-6">
                                            <div className="text-center space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Enter verification code sent to your email</p>
                                            </div>
                                            <Clerk.Field name="code" className="space-y-2">
                                                <Clerk.Label className="text-sm font-medium text-gray-700 ml-1">Code</Clerk.Label>
                                                <Clerk.Input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white tracking-widest text-center" />
                                                <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                                            </Clerk.Field>
                                            <SignUp.Action submit className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm">
                                                Verify
                                            </SignUp.Action>
                                        </div>
                                    </SignUp.Strategy>
                                </SignUp.Step>
                            </SignUp.Root>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Already have an account?{" "}
                                <Link to="/paralegal-login" className="text-primary hover:underline font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ParalegalSignupAuth;
