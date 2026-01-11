import { Smartphone, Download, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';

const HakiYanguAppSection = () => {
    return (
        <section className="py-10 bg-gray-50 relative overflow-hidden">
            {/* Subtle Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "url('/pattern-bg.png')",
                    backgroundSize: "cover",
                }}
            />

            <Container>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid lg:grid-cols-2">

                        {/* Left: Visual Mockup (Now on Left as requested) */}
                        <div className="bg-gray-100 relative min-h-[400px] flex items-end justify-center px-10 pt-10 lg:pr-10 lg:pl-20 overflow-hidden order-2 lg:order-1">
                            {/* Phone Frame */}
                            <div className="relative w-[280px] border-[10px] border-gray-900 rounded-[2.5rem] bg-white shadow-2xl z-10 -mb-12 transform transition-transform hover:-translate-y-4 duration-500">
                                {/* Using a better placeholder or the specific new image if available. Since user said "image is bad", I will try to use the specific one I found or a generic high-quality one. I will use the one I found in the file list: NEW-HAKI-YANGU-APP.png */}
                                <img src="/lovable-uploads/NEW-HAKI-YANGU-APP.png" alt="Haki Yangu App Screen" className="w-full h-full object-cover rounded-[2rem]" />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-10 left-10 w-24 h-24 bg-gray-300 rounded-full blur-3xl opacity-40 animate-pulse" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gray-400 rounded-full blur-3xl opacity-40" />
                        </div>

                        {/* Right: Content (Order 2 on large screens) */}
                        <div className="p-10 lg:p-14 flex flex-col justify-center order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-gray-900 font-bold text-sm uppercase tracking-wider mb-6 self-start">
                                <Smartphone className="h-4 w-4" />
                                <span>Mobile Application</span>
                            </div>

                            <Typography variant="h2" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                Your Pocket <span className="text-primary">Legal Aid</span>.
                            </Typography>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Access independent legal education and report issues securely. Designed for privacy, speed, and accessibility for all Tanzanians.
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Shield className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <span className="font-medium text-gray-700">Secure Reporting Mechanism</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Download className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <span className="font-medium text-gray-700">Works Offline (Low Data Usage)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Globe className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <span className="font-medium text-gray-700">Swahili & English Support</span>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                <Link to="/haki-yangu">
                                    <Button size="lg" className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3">
                                        <Smartphone className="w-6 h-6" />
                                        <span>
                                            <span className="block text-[10px] uppercase tracking-wider leading-none">Download on</span>
                                            App Store
                                        </span>
                                    </Button>
                                </Link>
                                <Link to="/haki-yangu">
                                    <Button size="lg" className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3">
                                        <Smartphone className="w-6 h-6" />
                                        <span>
                                            <span className="block text-[10px] uppercase tracking-wider leading-none">Get it on</span>
                                            Google Play
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HakiYanguAppSection;
