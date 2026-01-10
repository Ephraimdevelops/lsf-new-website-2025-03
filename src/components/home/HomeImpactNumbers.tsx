import { Award, Users, MapPin, Calendar, CheckCircle, Shield, Scale, Heart, TrendingUp, Globe, Gavel, Handshake, DollarSign } from 'lucide-react';
import Container from '@/components/shared/Container';

const HomeImpactNumbers = () => {
    // Final approved stats list for continuous ticker
    const stats = [
        { value: '15+', label: 'Years of Impact', icon: Calendar },
        { value: '$47M+', label: 'Funds Managed', icon: DollarSign },
        { value: '40M+', label: 'People Reached', icon: Users },
        { value: '54,000+', label: 'Disputes Resolved', icon: Gavel },
        { value: '4,000+', label: 'Paralegals', icon: Scale },
        { value: '200+', label: 'Partners Supported', icon: Handshake },
        { value: '70%', label: 'Women Beneficiaries', icon: Heart },
        { value: '168', label: 'Districts', icon: MapPin },
        { value: '100%', label: 'Gov Compliance', icon: Shield },
        { value: '60%', label: 'Resolution Rate', icon: CheckCircle },
        { value: '31', label: 'Regions', icon: Globe },
        { value: '209', label: 'Women Leaders', icon: Award },
    ];

    return (
        <section className="bg-white overflow-hidden p-0 m-0 border-none">
            {/* Continuous Stats Ticker - Deep Maroon Brand Theme */}
            <div className="w-full bg-primary border-y border-primary-dark py-20 relative overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10 bg-repeat space-x-4"
                    style={{ backgroundImage: `url('/lovable-uploads/brand-pattern.png')`, backgroundSize: '200px' }}
                ></div>

                {/* Gradient Fades for Smooth Edge Effect (Matching Maroon) */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary via-primary/80 to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-full group relative z-20">
                    <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] items-center">
                        {/* First set of stats */}
                        {stats.map((stat, index) => (
                            <div key={`stat-1-${index}`} className="flex flex-col items-center justify-center gap-2 mx-16">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/10 mb-2 backdrop-blur-sm shadow-xl">
                                    <stat.icon className="h-7 w-7 text-white" />
                                </div>
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-bold text-white/80 uppercase tracking-widest text-center">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                        {/* Duplicate set for seamless scroll */}
                        {stats.map((stat, index) => (
                            <div key={`stat-2-${index}`} className="flex flex-col items-center justify-center gap-2 mx-16">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/10 mb-2 backdrop-blur-sm shadow-xl">
                                    <stat.icon className="h-7 w-7 text-white" />
                                </div>
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-bold text-white/80 uppercase tracking-widest text-center">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeImpactNumbers;
