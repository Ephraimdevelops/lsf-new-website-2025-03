import { Award, Users, MapPin, Calendar, CheckCircle, Shield, Scale, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const WhyLSFSection = () => {
    // Expanded stats list for continuous ticker
    const stats = [
        { value: '6M+', label: 'People Reached Annually' },
        { value: '168', label: 'Districts Covered' },
        { value: '4,000+', label: 'Active Paralegals' },
        { value: '60%', label: 'Dispute Resolution Rate' },
        { value: '15+', label: 'Years of Impact' },
        { value: '31', label: 'Regions Served' },
        { value: 'TZS 3.1B', label: 'Legal Aid Fund' },
        { value: '209', label: 'Women Leaders Trained' },
        { value: '100%', label: 'Government Compliance' },
        { value: '1,214', label: 'Girls Supported' },
        { value: '50+', label: 'Strategic Partnerships' },
    ];

    const features = [
        {
            icon: Shield,
            title: "Government Recognition",
            description: "Our paralegal training program is officially recognized and endorsed by the Tanzanian government.",
            color: "bg-primary text-white"
        },
        {
            icon: Scale,
            title: "Strategic Partnerships",
            description: "We work with over 50 organizations including courts, civil society, and community leaders.",
            color: "bg-secondary-teal text-white"
        },
        {
            icon: Heart,
            title: "Community Focus",
            description: "Special emphasis on women, marginalized communities, and rural populations.",
            color: "bg-secondary-orange text-white"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <Container>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold text-gray-900">
                        Why Legal Services Facility?
                    </Typography>
                    <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
                        For over 15 years, we've been building the infrastructure for accessible justice,
                        one community at a time.
                    </Typography>
                </div>

                {/* Stats Section - Premium Branded */}
                {/* Continuous Stats Ticker - Light & Clean */}
                <div className="w-full bg-neutral-50 border-y border-neutral-100 py-10 mb-16 relative overflow-hidden">
                    <div className="flex w-full group">
                        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
                            {/* First set of stats */}
                            {stats.map((stat, index) => (
                                <div key={`stat-1-${index}`} className="flex items-center gap-3 mx-12">
                                    <span className="text-4xl md:text-5xl font-black text-primary">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm md:text-base font-bold text-neutral-500 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                            {/* Duplicate set for seamless scroll */}
                            {stats.map((stat, index) => (
                                <div key={`stat-2-${index}`} className="flex items-center gap-3 mx-12">
                                    <span className="text-4xl md:text-5xl font-black text-primary">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm md:text-base font-bold text-neutral-500 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Fades for Smooth Edge Effect */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* Feature Cards - Clean & Distinct */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl bg-white border border-gray-100">
                            <div className={`p-8 h-full flex flex-col items-center text-center`}>
                                <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-10 w-10" />
                                </div>
                                <Typography variant="h3" className="text-gray-900 mb-4 text-2xl font-bold">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body" className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </Typography>
                            </div>
                            {/* Colorful bottom bar */}
                            <div className={`h-2 w-full ${feature.color}`}></div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default WhyLSFSection;
