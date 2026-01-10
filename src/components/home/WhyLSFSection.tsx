import { Award, Users, MapPin, Calendar, CheckCircle, Shield, Scale, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const WhyLSFSection = () => {
    const stats = [
        { value: '6M+', label: 'People Reached', description: 'Annually across Tanzania' },
        { value: '168', label: 'Districts Covered', description: 'Full nationwide presence' },
        { value: '4,000+', label: 'Paralegals', description: 'Active frontline network' },
        { value: '60%', label: 'Resolution Rate', description: 'Disputes resolved locally' },
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
                <div className="bg-primary rounded-3xl p-10 md:p-12 shadow-2xl mb-16 relative overflow-hidden text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-yellow rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 divider-x-white/20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <Typography variant="h1" className="text-4xl md:text-5xl text-secondary-yellow mb-2 font-black group-hover:scale-105 transition-transform duration-300">
                                    {stat.value}
                                </Typography>
                                <Typography variant="h4" className="mb-2 text-lg font-bold text-white tracking-wide">
                                    {stat.label}
                                </Typography>
                                <Typography variant="body" className="text-white/70 text-sm font-medium">
                                    {stat.description}
                                </Typography>
                            </div>
                        ))}
                    </div>
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
