import { SignUp, useUser } from "@clerk/clerk-react";
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
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-orange to-orange-500 shadow-lg">
                                <Scale className="h-8 w-8 text-white" />
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

                            <SignUp
                                signInUrl="/paralegal-login"
                                forceRedirectUrl="/dashboard/paralegal"
                                unsafeMetadata={{
                                    role: "paralegal"
                                }}
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-none p-0 border-none",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                                        formButtonPrimary: "bg-secondary-orange hover:bg-secondary-orange/90",
                                        footerActionLink: "text-primary hover:text-primary/80"
                                    }
                                }}
                            />

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
