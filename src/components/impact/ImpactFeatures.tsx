import React from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Download, UserPlus, Heart, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactFeatures = () => {
    return (
        <>
            {/* SAUTI FEATURE - Split Layout */}
            <section className="py-24 bg-white overflow-hidden">
                <Container>
                    <div className="flex flex-col lg:flex-row items-stretch gap-0 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Image Side */}
                        <div className="w-full lg:w-1/2 relative min-h-[400px]">
                            <img
                                src="/lovable-uploads/mwanamke shamba.png"
                                alt="Sauti ya Mwanamke Leadership"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden" />
                            <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white z-10">
                                <div className="inline-flex items-center gap-2 bg-secondary-yellow text-black px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
                                    <Heart className="h-3 w-3" /> Flagship Program
                                </div>
                                <h3 className="text-4xl font-black mb-2">Sauti ya Mwanamke</h3>
                                <p className="text-white/90 font-medium">Amplifying women's voices in governance.</p>
                            </div>
                        </div>

                        {/* Stats Side */}
                        <div className="w-full lg:w-1/2 bg-neutral-900 text-white p-8 lg:p-16 flex flex-col justify-center">
                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-secondary-yellow/20 group-hover:text-secondary-yellow transition-colors">
                                        <Shield className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-white mb-1">12,500+</p>
                                        <p className="text-white/60 font-medium">GBV survivors accessed justice</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-secondary-yellow/20 group-hover:text-secondary-yellow transition-colors">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-white mb-1">2,200+</p>
                                        <p className="text-white/60 font-medium">Women elected to local government</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-secondary-yellow/20 group-hover:text-secondary-yellow transition-colors">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-white mb-1">850+</p>
                                        <p className="text-white/60 font-medium">Women's groups formally registered</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/programs/sauti-ya-mwanamke" className="mt-12 inline-block">
                                <Button className="bg-white text-black hover:bg-neutral-200 font-bold rounded-full px-8 py-6 text-lg w-full sm:w-auto">
                                    View Program Details <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* HAKI YANGU - Dark Mode Tech Card */}
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/lovable-uploads/brand-pattern.png')] mix-blend-overlay" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none" />

                <Container className="relative z-10">
                    <div className="max-w-6xl mx-auto bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 lg:p-20 overflow-hidden relative">
                        {/* Glow Effect */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-1/2">
                                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-6">
                                    <Smartphone className="h-4 w-4" />
                                    Innovation in Justice
                                </div>
                                <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                    Justice Goes <span className="text-primary">Digital.</span>
                                </Typography>
                                <p className="text-white/60 text-xl leading-relaxed mb-8">
                                    With the <strong>Haki Yangu App</strong>, we are democratizing legal knowledge. 15% of our 2024 case intake came through digital channels, providing discreet, instant support to those who need it most.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white/10 rounded-2xl p-6 flex-1 min-w-[140px]">
                                        <Download className="h-6 w-6 text-primary mb-3" />
                                        <p className="text-3xl font-black text-white">45k+</p>
                                        <p className="text-sm text-white/50">App Downloads</p>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-6 flex-1 min-w-[140px]">
                                        <UserPlus className="h-6 w-6 text-primary mb-3" />
                                        <p className="text-3xl font-black text-white">15%</p>
                                        <p className="text-sm text-white/50">Digital Intake</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Mockup / Visual */}
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <img
                                        src="/lovable-uploads/haki yangu app uzinuzi.webp"
                                        alt="Haki Yangu App Interface"
                                        className="relative rounded-3xl shadow-2xl border-8 border-neutral-800 rotate-[-5deg] hover:rotate-0 transition-transform duration-500 max-w-sm w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

// Helper Icon for Sauti section
const Shield = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
);

export default ImpactFeatures;
