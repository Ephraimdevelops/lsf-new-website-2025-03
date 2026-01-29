import React from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StrategicTransparency = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle patterned background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('/lovable-uploads/brand-pattern.png')] bg-cover bg-center" />
            </div>

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Side: Text Content */}
                    <div className="text-left order-2 lg:order-1">
                        {/* Executive Badge */}
                        <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-neutral-900 text-xs font-bold uppercase tracking-widest">Organizational Evolution</span>
                        </div>

                        {/* Heading */}
                        <div className="relative mb-5">
                            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                                From Grant-Maker to <span className="text-primary">Direct Implementer</span>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg text-neutral-600 mb-8 border-l-4 border-primary pl-6">
                            <p className="mb-6 leading-relaxed">
                                In 2024, LSF successfully transitioned from a basket fund manager to a direct implementer. This strategic pivot allows us to drive deeper impact, maintain a <strong>99.8% expenditure control rate</strong>, and respond more agilely to community needs.
                            </p>
                            <p className="leading-relaxed">
                                Despite the exit of core funding, LSF remains financially robust with a <strong>1.36 Current Ratio</strong>, ensuring we can meet all obligations and continue our mission without interruption.
                            </p>
                        </div>

                        <Link to="/publications">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8 py-6 text-lg transition-all shadow-lg hover:shadow-primary/30">
                                Read the 2024 Annual Report
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Right Side: Floating Creative Cards (AGM Style) */}
                    <div className="hidden lg:flex flex-col gap-6 relative order-1 lg:order-2">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 via-teal-500/5 to-transparent rounded-full blur-3xl -z-10"></div>

                        {/* Card 1: Implementation - Primary */}
                        <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm w-4/5 self-start hover:-translate-y-2 transition-transform duration-500 relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 text-lg">Agile Response</h4>
                                    <p className="text-neutral-500 text-sm mt-1">Directly addressing community legal needs with speed.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Strategy - Teal - Staggered Right */}
                        <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm w-4/5 self-end hover:-translate-y-2 transition-transform duration-500 delay-100 relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-teal-50/50 rounded-xl text-teal-600">
                                    <ArrowRight className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 text-lg">99.8% Efficiency</h4>
                                    <p className="text-neutral-500 text-sm mt-1">Optimizing every shilling for maximum impact.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Finance - Primary - Staggered Left/Center */}
                        <div className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm w-4/5 self-center hover:-translate-y-2 transition-transform duration-500 delay-200 relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 text-lg">Financial Strength</h4>
                                    <p className="text-neutral-500 text-sm mt-1">1.36 Current Ratio ensuring stability.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default StrategicTransparency;
