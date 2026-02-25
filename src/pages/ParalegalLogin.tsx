import { SignIn } from "@clerk/clerk-react";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ParalegalLogin = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24">
            <div className="w-full max-w-lg space-y-16">
                {/* Back Button */}
                <Link to="/legal-help" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium text-sm tracking-tight group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Return to Legal Help</span>
                </Link>

                <div className="space-y-12">
                    <header className="space-y-8">
                        <div className="flex justify-start">
                            <img
                                src="/uploads/oimages/lsf-logo.png"
                                alt="LSF Logo"
                                className="h-20 md:h-28 w-auto object-contain"
                            />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter leading-none">
                                Paralegal <br /> Portal
                            </h1>
                            <p className="text-xl text-gray-400 font-medium max-w-sm leading-relaxed">
                                Secure access for legal representatives across Tanzania.
                            </p>
                        </div>
                    </header>

                    <main className="w-full">
                        <SignIn
                            path="/paralegal-login"
                            routing="path"
                            signUpUrl="/paralegal-signup"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-none bg-transparent p-0 w-full rounded-none",
                                    header: "hidden",
                                    logoBox: "hidden",
                                    footerAction: "hidden",
                                    formButtonPrimary: "w-full py-5 px-6 bg-black text-white rounded-none font-bold text-lg hover:bg-gray-900 transition-all uppercase tracking-widest mt-4 shadow-none",
                                    formFieldInput: "w-full px-0 py-4 border-b-2 border-gray-100 focus:border-black transition-all outline-none bg-transparent rounded-none text-lg font-medium placeholder:text-gray-300 shadow-none",
                                    formFieldLabel: "text-xs font-black text-black uppercase tracking-widest mb-1",
                                    socialButtonsBlockButton: "hidden",
                                    socialButtonsBlockButtonText: "hidden",
                                    dividerRow: "hidden",
                                    dividerText: "hidden",
                                    identityPreview: "bg-gray-50 border-none rounded-none px-4 py-4 mb-6",
                                    formFieldAction: "text-black hover:underline font-black text-xs uppercase tracking-wider",
                                    formContainer: "gap-8"
                                }
                            }}
                        />

                        {/* Additional Info */}
                        <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-baseline gap-6 justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-black uppercase tracking-widest">
                                    Authentication Security
                                </p>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Shield className="h-3.5 w-3.5" />
                                    <span className="text-[13px] font-medium">Standard LSF Privacy Protocol</span>
                                </div>
                            </div>

                            <Link to="/paralegal-signup" className="group">
                                <span className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                    Join the Network <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ParalegalLogin;
