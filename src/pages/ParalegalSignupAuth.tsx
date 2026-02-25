import { SignUp } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ParalegalSignupAuth = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6 sm:p-12 lg:p-24">
            <div className="w-full max-w-2xl space-y-20">
                {/* Back Button */}
                <Link to="/legal-help" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium text-sm tracking-tight group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Return to Legal Help</span>
                </Link>

                <div className="space-y-16">
                    <header className="space-y-8">
                        <div className="flex justify-start">
                            <img
                                src="/uploads/oimages/lsf-logo.png"
                                alt="LSF Logo"
                                className="h-20 md:h-28 w-auto object-contain"
                            />
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter leading-[0.9]">
                                Join the <br /> Foundation
                            </h1>
                            <p className="text-2xl text-gray-400 font-medium max-w-md leading-tight">
                                Empowering Tanzanian justice through community legal aid.
                            </p>
                        </div>
                    </header>

                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
                        <section className="space-y-12">
                            <div className="space-y-8">
                                <h2 className="text-xs font-black text-black uppercase tracking-[0.3em]">
                                    Paralegal Benefits
                                </h2>
                                <div className="space-y-10">
                                    {[
                                        { title: "Dashboard", desc: "Digital management for every case." },
                                        { title: "Visibility", desc: "Profile accessible by local communities." },
                                        { title: "Tools", desc: "Advanced case management integration." },
                                        { title: "Training", desc: "Accredited LSF legal resources." }
                                    ].map((item, i) => (
                                        <div key={i} className="group space-y-2">
                                            <div className="flex items-center gap-4">
                                                <div className="h-[2px] w-4 bg-black group-hover:w-8 transition-all duration-500" />
                                                <h3 className="text-xl font-black text-black uppercase tracking-tight">{item.title}</h3>
                                            </div>
                                            <p className="text-gray-400 font-medium pl-8">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="w-full">
                            <SignUp
                                path="/paralegal-signup"
                                routing="path"
                                signInUrl="/paralegal-login"
                                unsafeMetadata={{ role: "paralegal" }}
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-none border-none bg-transparent p-0 w-full rounded-none",
                                        header: "hidden",
                                        logoBox: "hidden",
                                        footerAction: "hidden",
                                        formButtonPrimary: "w-full py-5 px-6 bg-black text-white rounded-none font-bold text-lg hover:bg-gray-900 transition-all uppercase tracking-widest shadow-none",
                                        formFieldInput: "w-full px-0 py-4 border-b-2 border-gray-100 focus:border-black transition-all outline-none bg-transparent rounded-none text-lg font-medium placeholder:text-gray-300 shadow-none",
                                        formFieldLabel: "text-xs font-black text-black uppercase tracking-widest mb-1",
                                        socialButtonsBlockButton: "hidden",
                                        socialButtonsBlockButtonText: "hidden",
                                        dividerRow: "hidden",
                                        dividerText: "hidden",
                                        formContainer: "gap-8"
                                    }
                                }}
                            />

                            <div className="mt-16 pt-8 border-t border-gray-100 italic text-gray-300 text-sm font-medium">
                                Already registered? <Link to="/paralegal-login" className="text-black font-black hover:underline not-italic uppercase tracking-widest text-xs ml-2">Sign In</Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParalegalSignupAuth;
