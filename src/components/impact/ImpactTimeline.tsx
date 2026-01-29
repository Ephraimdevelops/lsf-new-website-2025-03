import React from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Calendar, CheckCircle2, Flag, Award, TrendingUp, ArrowRight } from 'lucide-react';

const ImpactTimeline = () => {
    const milestones = [
        {
            year: "2011-2016",
            title: "The Foundation",
            description: "Established the largest paralegal network in Tanzania.",
            stat: "4,185 active paralegals",
            icon: <Calendar className="h-6 w-6 text-primary" />,
        },
        {
            year: "2017-2018",
            title: "The Legislation",
            description: "Successfully advocated for the enactment of Legal Aid Acts.",
            stat: "Legal Aid Act Passed",
            icon: <Flag className="h-6 w-6 text-primary" />,
        },
        {
            year: "2023",
            title: "The Awakening",
            description: "Co-chaired the Mama Samia Legal Aid Campaign.",
            stat: "National Campaign Launch",
            icon: <Award className="h-6 w-6 text-primary" />,
        },
        {
            year: "2024",
            title: "The Pivot",
            description: "Transitioned to a Direct Implementer model.",
            stat: "7.6M+ Reached",
            icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
        }
    ];

    return (
        <section id="impact-timeline" className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern - Subtle */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('/lovable-uploads/brand-pattern.png')] bg-cover bg-center" />
            </div>

            <Container className="relative z-10">
                {/* Heading - Efficiency Style */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-widest">Our Historic Impact</span>
                    </div>
                    <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        A History of <span className="text-primary">Results</span>
                    </Typography>
                    <p className="text-lg text-gray-600 max-w-2xl border-l-4 border-primary pl-6">
                        From a grant fund to a national implementer. Every milestone represents a leap forward in access to justice.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Desktop Connector Line */}
                    <div className="hidden md:block absolute top-[60px] left-0 right-0 h-0.5 bg-gray-100 z-0">
                        <div className="absolute top-0 left-0 h-full bg-primary/20 w-3/4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                        {milestones.map((item, index) => (
                            <div key={index} className="relative group flex md:block gap-6">

                                {/* Mobile Vertical Connector */}
                                {index !== milestones.length - 1 && (
                                    <div className="md:hidden absolute left-[27px] top-[60px] bottom-[-48px] w-0.5 bg-gray-100 -z-10"></div>
                                )}

                                {/* Icon Node */}
                                <div className="flex-shrink-0 relative z-10">
                                    <div className="w-14 h-14 md:w-28 md:h-28 bg-white border-4 border-gray-50 md:border-8 rounded-full flex items-center justify-center shadow-sm group-hover:border-primary/10 group-hover:scale-110 transition-all duration-300 md:mx-auto md:mb-8">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            {/* Responsive Icon Sizes */}
                                            <div className="md:scale-150 transform transition-transform">
                                                {item.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-2 md:pt-0 md:text-center flex-1">
                                    <h4 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3">{item.year}</h4>
                                    <h3 className="text-lg font-bold text-primary mb-2 uppercase tracking-wide">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 md:px-4">
                                        {item.description}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-gray-900 font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                        {item.stat}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ImpactTimeline;
