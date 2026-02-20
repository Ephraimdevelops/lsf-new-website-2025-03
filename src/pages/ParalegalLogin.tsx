import * as SignIn from "@clerk/elements/sign-in";
import * as Clerk from "@clerk/elements/common";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, Users, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ParalegalLogin = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-blue-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back Button */}
                <Link to="/legal-help" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Legal Help</span>
                </Link>

                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-6 flex justify-center">
                            <img
                                src="/lovable-uploads/c7c6a992-0b2f-4131-b0db-6a75a7c2e391.png"
                                alt="LSF Logo"
                                className="h-16 md:h-20 w-auto drop-shadow-sm"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Paralegal Portal</CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <SignIn.Root>
                            <SignIn.Step name="start" className="w-full flex flex-col gap-6 w-full max-w-[320px]">
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

                                <Clerk.Field name="identifier" className="space-y-2">
                                    <Clerk.Label className="text-sm font-medium text-gray-700 ml-1">Email address</Clerk.Label>
                                    <Clerk.Input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white" />
                                    <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                                </Clerk.Field>
                                <SignIn.Action submit className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm">
                                    Continue
                                </SignIn.Action>
                            </SignIn.Step>

                            <SignIn.Step name="verifications" className="w-full flex flex-col gap-6 max-w-[320px]">
                                <SignIn.Strategy name="password">
                                    <div className="space-y-6">
                                        <Clerk.Field name="password" className="space-y-2">
                                            <div className="flex justify-between items-center ml-1">
                                                <Clerk.Label className="text-sm font-medium text-gray-700">Password</Clerk.Label>
                                                <SignIn.Action navigate="start" className="text-xs font-medium text-primary cursor-pointer hover:underline">Change Email</SignIn.Action>
                                            </div>
                                            <Clerk.Input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white" />
                                            <Clerk.FieldError className="text-sm text-red-500 font-medium ml-1" />
                                        </Clerk.Field>
                                        <SignIn.Action submit className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm">
                                            Sign In
                                        </SignIn.Action>
                                    </div>
                                </SignIn.Strategy>
                            </SignIn.Step>
                        </SignIn.Root>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-100 w-full">
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Not a paralegal yet?
                            </p>
                            <Link to="/become-a-paralegal" className="block">
                                <Button variant="outline" className="w-full gap-2">
                                    <Users className="h-4 w-4" />
                                    Apply to Become a Paralegal
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-white/60 text-xs">
                    <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Secure Login</span>
                    </div>
                    <span>•</span>
                    <span>LSF Tanzania</span>
                </div>
            </div>
        </div>
    );
};

export default ParalegalLogin;
