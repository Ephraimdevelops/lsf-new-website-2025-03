import React from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Map, TrendingUp, Shield, BarChart3, Users, Scale, ArrowRight, Target, CheckCircle2 } from 'lucide-react';

const ImpactBento = () => {
    return (
        <section className="py-12 bg-neutral-50 relative overflow-hidden flex flex-col justify-center min-h-[60vh]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('/lovable-uploads/brand-pattern.png')] bg-cover bg-center" />
            </div>

            <Container className="relative z-10 w-full max-w-[90%] xl:max-w-7xl">

                {/* Centered Heading */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                        <Target className="h-4 w-4" />
                        <span className="text-sm font-bold uppercase tracking-widest">2024 Performance Dashboard</span>
                    </div>
                    <Typography variant="h2" className="text-3xl md:text-5xl font-black text-neutral-900">
                        Measuring <span className="text-primary">Lives Changed</span>
                    </Typography>
                </div>

                {/* Main Dashboard Grid - Spread Out Horizontally (4 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* CARD 1: Total Reach (Tall) */}
                    <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Map className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        <Users className="h-5 w-5 text-neutral-600" />
                                    </div>
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Reach</span>
                                </div>
                                <p className="text-5xl font-black text-neutral-900 tracking-tighter mb-1">7.6M+</p>
                                <p className="text-sm font-medium text-neutral-500">People reached with legal education</p>
                            </div>
                            <div className="mt-8 space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold bg-neutral-50 p-2 rounded-lg">
                                    <span className="text-neutral-600">Women</span>
                                    <span className="text-primary">58%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold bg-neutral-50 p-2 rounded-lg">
                                    <span className="text-neutral-600">Coverage</span>
                                    <span className="text-neutral-900">26 Regions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Assets Reclaimed (Tall) */}
                    <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Scale className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-neutral-600" />
                                    </div>
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Economic Justice</span>
                                </div>
                                <p className="text-5xl font-black text-neutral-900 tracking-tighter mb-1">1.65B</p>
                                <p className="text-sm font-medium text-neutral-500">TZS Reclaimed for women</p>
                            </div>
                            <div className="mt-8">
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg w-fit">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs">Target Exceeded (110%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Efficiency Gauge (Compact) - Styled as Hero Strip */}
                    <div className="bg-primary p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300 min-h-[180px]">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center mix-blend-overlay" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center w-full">
                            <div className="flex items-center gap-2 mb-4 absolute top-0 left-0">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <BarChart3 className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">System Efficiency</span>
                            </div>

                            {/* CSS-only Donut Chart - Scaled Down - White Theme */}
                            <div className="relative w-32 h-32 mt-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#ffffff" strokeWidth="12"
                                        strokeDasharray={351} strokeDashoffset={351 - (351 * 0.60)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">60%</span>
                                    <span className="text-[9px] text-white/80 font-bold uppercase">Cases Handled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: GBV & Pipeline (Split Vertical) */}
                    <div className="flex flex-col gap-4">
                        {/* GBV Card */}
                        <div className="bg-primary text-white p-6 rounded-3xl shadow-lg flex-1 flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-white/80" />
                                    <span className="text-xs font-bold text-white/80 uppercase">GBV Cases</span>
                                </div>
                                <p className="text-4xl font-black mb-1">6,825</p>
                                <p className="text-xs text-white/90">Resolved, ensuring safety.</p>
                            </div>
                        </div>

                        {/* Pipeline Stats */}
                        <div className="bg-neutral-900 text-white p-6 rounded-3xl shadow-lg flex-1 flex flex-col justify-center relative overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-neutral-400 uppercase">Impact Pipeline</span>
                                <ArrowRight className="h-4 w-4 text-neutral-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xl font-bold text-white">4,185</p>
                                    <p className="text-[10px] text-neutral-500 uppercase">Paralegals</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-secondary-yellow">90%</p>
                                    <p className="text-[10px] text-neutral-500 uppercase">Income Rise</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default ImpactBento;
