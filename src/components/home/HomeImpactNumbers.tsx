import { Award, Users, MapPin, Calendar, CheckCircle, Shield, Scale, Heart, Globe, Gavel, Handshake, DollarSign, type LucideIcon } from 'lucide-react';

// Shared by the current homepage and concept 03 so figures and ticker spacing stay identical.
const stats = [
        { value: '7 Million+', label: 'People Reached Annually', icon: Users },
        { value: '100,000+', label: 'Direct Assistance', icon: Handshake },
        { value: '$ 600,000', label: 'Assets Secured for Women', icon: DollarSign },
        { value: '6,825', label: 'GBV Cases Addressed', icon: Heart },
        { value: '15+', label: 'Years of Impact', icon: Calendar },
        { value: '54,000+', label: 'Disputes Resolved', icon: Gavel },
        { value: '4,000+', label: 'Paralegals', icon: Scale },
        { value: '168', label: 'Districts', icon: MapPin },
        { value: '100%', label: 'Gov Compliance', icon: Shield },
        { value: '60%', label: 'Resolution Rate', icon: CheckCircle },
        { value: '31', label: 'Regions', icon: Globe },
        { value: '209', label: 'Women Leaders', icon: Award },
];

export type ImpactStat = { value: string; label: string; icon: LucideIcon };

export const HomeImpactTicker = ({ tone = 'dark', density = 'normal', figures = stats }: { tone?: 'dark' | 'light'; density?: 'normal' | 'compact'; figures?: ImpactStat[] }) => (
            <div className={`hc-impact-ticker w-full py-20 relative overflow-hidden ${tone === 'light' ? 'bg-white' : 'bg-primary border-y border-primary-dark'}`}>
                {/* Background Pattern */}
                <div
                    className={`absolute inset-0 bg-repeat space-x-4 ${tone === 'light' ? 'opacity-[0.035]' : 'opacity-10'}`}
                    style={{ backgroundImage: `url('/lovable-uploads/brand-pattern.png')`, backgroundSize: '200px' }}
                ></div>

                {/* Gradient Fades for Smooth Edge Effect (Matching Maroon) */}
                <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r to-transparent z-10 pointer-events-none ${tone === 'light' ? 'from-white via-white/90' : 'from-primary via-primary/80'}`}></div>
                <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l to-transparent z-10 pointer-events-none ${tone === 'light' ? 'from-white via-white/90' : 'from-primary via-primary/80'}`}></div>

                <div className="flex w-full group relative z-20">
                    <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] items-center">
                        {/* First set of stats */}
                        {figures.map((stat, index) => (
                            <div key={`stat-1-${index}`} className={`hc-impact-stat flex flex-col items-center justify-center gap-2 ${density === 'compact' ? 'mx-10' : 'mx-16'}`}>
                                <div className={`hc-impact-icon ${density === 'compact' ? 'w-12 h-12 mb-1' : 'w-16 h-16 mb-2'} rounded-full flex items-center justify-center border ${tone === 'light' ? 'bg-primary/10 border-primary/10' : 'bg-white/10 border-white/10 backdrop-blur-sm shadow-xl'}`}>
                                    <stat.icon className={`${density === 'compact' ? 'h-6 w-6' : 'h-7 w-7'} ${tone === 'light' ? 'text-primary' : 'text-white'}`} />
                                </div>
                                <span className={`hc-impact-value ${density === 'compact' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-black tracking-tight ${tone === 'light' ? 'text-primary' : 'text-white drop-shadow-sm'}`}>
                                    {stat.value}
                                </span>
                                <span className={`hc-impact-label ${density === 'compact' ? 'text-xs' : 'text-sm'} font-bold uppercase tracking-widest text-center ${tone === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                        {/* Duplicate set for seamless scroll */}
                        {figures.map((stat, index) => (
                            <div key={`stat-2-${index}`} className={`hc-impact-stat flex flex-col items-center justify-center gap-2 ${density === 'compact' ? 'mx-10' : 'mx-16'}`}>
                                <div className={`hc-impact-icon ${density === 'compact' ? 'w-12 h-12 mb-1' : 'w-16 h-16 mb-2'} rounded-full flex items-center justify-center border ${tone === 'light' ? 'bg-primary/10 border-primary/10' : 'bg-white/10 border-white/10 backdrop-blur-sm shadow-xl'}`}>
                                    <stat.icon className={`${density === 'compact' ? 'h-6 w-6' : 'h-7 w-7'} ${tone === 'light' ? 'text-primary' : 'text-white'}`} />
                                </div>
                                <span className={`hc-impact-value ${density === 'compact' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-black tracking-tight ${tone === 'light' ? 'text-primary' : 'text-white drop-shadow-sm'}`}>
                                    {stat.value}
                                </span>
                                <span className={`hc-impact-label ${density === 'compact' ? 'text-xs' : 'text-sm'} font-bold uppercase tracking-widest text-center ${tone === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
);

const HomeImpactNumbers = () => <section className="bg-white overflow-hidden p-0 m-0 border-none"><HomeImpactTicker /></section>;

export default HomeImpactNumbers;
