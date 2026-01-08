import { useState, useEffect, useRef } from 'react';
import Container from '@/components/shared/Container';

const stats = [
    { value: 14, suffix: '+', label: 'Years of Impact' },
    { value: 38, suffix: 'M+', label: 'People Reached' },
    { value: 4000, suffix: '+', label: 'Paralegals' },
    { value: 184, suffix: '', label: 'Districts' },
];

// Animated number component
const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
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

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    };

    return (
        <span ref={ref}>
            {formatNumber(count)}{suffix}
        </span>
    );
};

const HomeImpactNumbers = () => {
    return (
        <section className="py-12 relative overflow-hidden">
            {/* Brand Pattern Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
                    backgroundSize: '300px',
                    backgroundRepeat: 'repeat',
                }}
            />
            {/* Strong overlay for high contrast */}
            <div className="absolute inset-0 bg-black/60" />

            <Container className="relative z-10">
                <div className="flex flex-wrap justify-center items-center divide-x divide-white/20">
                    {stats.map((stat, index) => (
                        <div key={index} className="px-8 md:px-12 text-center text-white">
                            <p className="text-5xl md:text-6xl font-black tracking-tight">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-white/90 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default HomeImpactNumbers;
