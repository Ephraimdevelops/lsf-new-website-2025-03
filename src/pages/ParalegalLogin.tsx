import { SignIn } from "@clerk/clerk-react";
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

                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="text-center pb-0">
                        <div className="mx-auto mb-6 flex justify-center">
                            <img
                                src="/lovable-uploads/LSF Favicon.png"
                                alt="LSF Logo"
                                className="h-16 md:h-20 w-auto drop-shadow-sm"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">Paralegal Portal</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center pt-6">
                        <SignIn
                            path="/paralegal-login"
                            routing="path"
                            signUpUrl="/paralegal-signup"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none bg-transparent p-0 w-full",
                                    header: "hidden", // We use our own CardHeader above for Paralegal
                                    logoBox: "hidden",
                                    footerAction: "hidden",
                                    formButtonPrimary: "w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm mt-2",
                                    formFieldInput: "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50/50 hover:bg-white text-sm shadow-none",
                                    formFieldLabel: "text-sm font-medium text-gray-700 ml-1 mb-1.5",
                                    socialButtonsBlockButton: "py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-gray-600 font-medium transition-all shadow-sm",
                                    socialButtonsBlockButtonText: "font-medium text-sm text-gray-700",
                                    dividerRow: "my-6",
                                    dividerText: "text-xs tracking-widest text-gray-400 font-semibold uppercase",
                                    identityPreview: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4",
                                    formFieldAction: "text-primary hover:text-primary/80 font-medium text-xs",
                                }
                            }}
                        />

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Not a paralegal yet?
                            </p>
                            <Link to="/paralegal-signup" className="block">
                                <Button variant="outline" className="w-full gap-2 rounded-xl h-11 border-gray-200 hover:bg-gray-50 text-gray-700">
                                    <Users className="h-4 w-4" />
                                    Apply to Become a Paralegal
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-white/60 text-xs font-medium tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
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
