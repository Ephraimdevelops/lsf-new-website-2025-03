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

                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                            <Scale className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Paralegal Portal</CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <SignIn
                            signUpUrl="/paralegal-signup"
                            forceRedirectUrl="/dashboard/paralegal"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none p-0 border-none",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                                    footerActionLink: "text-primary hover:text-primary/80"
                                }
                            }}
                        />

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
