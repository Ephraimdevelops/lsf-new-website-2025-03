import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const duration = 2000;
                    const steps = 60;
                    const increment = value / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    return (
        <span ref={ref}>
            {prefix}{count}{suffix}
        </span>
    );
};

const ModernPartnersSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

    const partners = [
        { name: 'DANIDA', logo: '/lovable-uploads/Danish amabssador.png' },
        { name: 'FCDO', logo: '/lovable-uploads/UKAid.png' },
        { name: 'European Union', logo: '/lovable-uploads/Funded by European Union.png' },
        { name: 'World Bank', logo: '/lovable-uploads/lsf-10years-annivervasry.jpg' }, // Fallback to generic if no logo
        { name: 'WINGS', logo: '/lovable-uploads/lsf-10years-annivervasry.jpg' },      // Fallback to generic if no logo
        { name: 'ENABEL', logo: '/lovable-uploads/Enabel.png' },
    ];

    const stats = [
        { value: 31, prefix: '', suffix: '', label: 'Regions' },
        { value: 6, prefix: '', suffix: '', label: 'Strategic Partners' },
        { value: 52, prefix: '$ ', suffix: ' Million', label: 'Funds Managed' },
    ];

    return (
        <section
            ref={sectionRef as any}
            className="py-20 bg-white"
        >
            <Container>
                {/* Header */}
                <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                        <Handshake className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-widest">Strategic Alliances</span>
                    </div>

                    <Typography variant="h2" className="font-bold text-gray-900 tracking-tight text-3xl md:text-4xl lg:text-5xl mb-4">
                        Driving Justice Through <span className="text-primary">Partnerships</span>
                    </Typography>

                    <p className="text-gray-600 text-lg max-w-2xl border-l-4 border-primary pl-6">
                        Our impact is amplified through transformative partnerships with donors and development agencies.
                    </p>
                </div>

                {/* Partners Logo Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="group flex items-center justify-center p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className={`flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

                    <div className="flex items-center gap-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                                </p>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <Link to="/partners">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base h-auto shadow-lg hover:shadow-xl transition-all">
                            View All Partners
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default ModernPartnersSection;
